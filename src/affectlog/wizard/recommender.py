"""Wizard recommender — produces a scoped analysis plan from inspection result and purpose."""

from __future__ import annotations

from affectlog.capabilities.analyses import ANALYSES, ANALYSIS_BY_ID
from affectlog.capabilities.plots import PLOTS
from affectlog.wizard.schemas import (
    RecommendRequest,
    RecommendResponse,
    ScopeItem,
    ScopeStatus,
    WizardPurpose,
)

LIMITATIONS = [
    "AffectLog does not issue legal compliance certifications.",
    "AffectLog does not guarantee the absence of bias — it measures and documents it.",
    "Raw personal data is not exported by default.",
    "Outputs depend on data quality and the accuracy of field mappings.",
    "Interpretation of results requires qualified human review.",
    "Model explanations are approximations — SHAP values are not causal.",
    "Statistical samples are used for large datasets; exact counts may differ.",
]

ASSUMPTIONS = [
    "The uploaded dataset is representative of the production data distribution.",
    "Field mappings confirmed in Step 3 are accurate.",
    "Group fields used in fairness analyses are ethically appropriate and lawfully collected.",
    "Model artifacts are the same versions used in the production system being assessed.",
]

_PURPOSE_ANALYSES: dict[WizardPurpose, list[str]] = {
    WizardPurpose.DATASET_READINESS: [
        "schema_validation",
        "xapi_compatibility_check",
        "missingness_profile",
        "completeness_profile",
        "type_profile",
        "pii_scan",
        "data_card_export",
        "sop_export",
        "audit_manifest_export",
    ],
    WizardPurpose.PRIVACY_AUDIT: [
        "schema_validation",
        "pii_scan",
        "pseudonymisation_benchmark",
        "privacy_risk_profile",
        "data_card_export",
        "sop_export",
        "audit_manifest_export",
        "jsonld_compliance_graph",
    ],
    WizardPurpose.XAPI_HARMONISATION: [
        "schema_validation",
        "xapi_compatibility_check",
        "becomino_template_inference",
        "maskott_csv_to_xapi_transform",
        "pii_scan",
        "sop_export",
        "audit_manifest_export",
        "jsonld_compliance_graph",
    ],
    WizardPurpose.FAIRNESS_OR_REPRESENTATION: [
        "schema_validation",
        "pii_scan",
        "missingness_profile",
        "gini_concentration",
        "coverage_at_k",
        "representation_index",
        "long_tail_profile",
        "sparsity_analysis",
        "fairness_by_group",
        "data_card_export",
        "sop_export",
        "audit_manifest_export",
    ],
    WizardPurpose.RECOMMENDER_EVALUATION: [
        "schema_validation",
        "pii_scan",
        "gini_concentration",
        "coverage_at_k",
        "long_tail_profile",
        "sparsity_analysis",
        "representation_index",
        "recommender_precision_at_k",
        "recommender_recall_at_k",
        "recommender_hit_rate_at_k",
        "recommender_ndcg_at_k",
        "recommender_diversity",
        "recommender_novelty",
        "data_card_export",
        "sop_export",
        "audit_manifest_export",
    ],
    WizardPurpose.MODEL_EXPLANATION: [
        "schema_validation",
        "pii_scan",
        "dataset_model_schema_check",
        "model_feature_importance",
        "model_prediction_explanation",
        "model_partial_dependence",
        "model_card_export",
        "sop_export",
        "audit_manifest_export",
        "jsonld_compliance_graph",
    ],
    WizardPurpose.MODEL_COMPARISON: [
        "schema_validation",
        "pii_scan",
        "dataset_model_schema_check",
        "model_feature_importance",
        "model_comparison",
        "classification_performance",
        "regression_performance",
        "model_card_export",
        "sop_export",
        "audit_manifest_export",
    ],
    WizardPurpose.COMPLIANCE_EXPORT: [
        "schema_validation",
        "pii_scan",
        "data_card_export",
        "jsonld_compliance_graph",
        "sop_export",
        "audit_manifest_export",
        "carisma_metadata_export",
        "lola_metadata_export",
        "pdc_metadata_export",
    ],
    WizardPurpose.FULL_AUDIT: [a.id for a in ANALYSES],
}


def _is_analysis_available(
    analysis_id: str,
    detected_format: str,
    req: RecommendRequest,
) -> tuple[ScopeStatus, str]:
    a = ANALYSIS_BY_ID.get(analysis_id)
    if not a:
        return ScopeStatus.OUT_OF_SCOPE, "Analysis not found in capability registry."

    if a.compatible_formats and detected_format not in a.compatible_formats:
        return (
            ScopeStatus.OUT_OF_SCOPE,
            a.unavailable_message or f"Not compatible with {detected_format} format.",
        )
    if a.requires_model and not req.has_model:
        return (
            ScopeStatus.CONDITIONAL,
            a.unavailable_message or "Requires a registered model artifact or endpoint.",
        )
    if a.requires_predictions and not req.has_predictions:
        return (
            ScopeStatus.CONDITIONAL,
            a.unavailable_message or "Requires prediction output file.",
        )
    if a.requires_ground_truth and not req.has_ground_truth:
        return (
            ScopeStatus.CONDITIONAL,
            a.unavailable_message or "Requires ground-truth file.",
        )
    if a.requires_group_field and not req.has_group_field:
        return (
            ScopeStatus.CONDITIONAL,
            a.unavailable_message or "Requires a group/segment field.",
        )
    if a.requires_probability_output and not req.has_probability_output:
        return (
            ScopeStatus.CONDITIONAL,
            "Requires probability outputs from the model.",
        )
    if a.required_fields:
        missing = [f for f in a.required_fields if f not in req.field_mappings]
        if missing:
            return (
                ScopeStatus.CONDITIONAL,
                f"Requires field mapping for: {', '.join(missing)}.",
            )
    return ScopeStatus.AVAILABLE, "Ready to run."


def _scope_item_from_analysis(analysis_id: str, status: ScopeStatus, why: str) -> ScopeItem:
    a = ANALYSIS_BY_ID.get(analysis_id)
    if not a:
        return ScopeItem(id=analysis_id, label=analysis_id, status=status, description="", why=why)
    return ScopeItem(
        id=a.id,
        label=a.label,
        status=status,
        description=a.description,
        why=why,
        required_inputs=a.required_fields,
        expected_outputs=a.produced_artifacts,
        backend_route=a.backend_route,
        runtime_category=a.runtime.value,
        sensitivity_level=a.sensitivity.value,
    )


def recommend(req: RecommendRequest) -> RecommendResponse:
    detected_format = req.inspection_result.detected_format or "generic_csv_tabular"
    purpose_analyses = _PURPOSE_ANALYSES.get(req.purpose, [a.id for a in ANALYSES])

    valid: list[ScopeItem] = []
    conditional: list[ScopeItem] = []
    invalid: list[ScopeItem] = []

    for analysis_id in purpose_analyses:
        status, why = _is_analysis_available(analysis_id, detected_format, req)
        item = _scope_item_from_analysis(analysis_id, status, why)
        if status == ScopeStatus.AVAILABLE:
            valid.append(item)
        elif status == ScopeStatus.CONDITIONAL:
            conditional.append(item)
        else:
            invalid.append(item)

    # Analyses explicitly out of scope (not in purpose list) — check if they're being asked about
    {a.id for a in ANALYSES}
    purpose_set = set(purpose_analyses)
    for a in ANALYSES:
        if (
            a.id not in purpose_set
            and a.compatible_formats
            and detected_format not in a.compatible_formats
        ):
            invalid.append(
                _scope_item_from_analysis(
                    a.id,
                    ScopeStatus.OUT_OF_SCOPE,
                    a.unavailable_message
                    or f"Not in scope for {req.purpose.value} purpose and not compatible with {detected_format}.",
                )
            )

    # ── Plots ──────────────────────────────────────────────────────────
    valid_analysis_ids = {i.id for i in valid}
    valid_plots: list[ScopeItem] = []
    invalid_plots: list[ScopeItem] = []
    for p in PLOTS:
        if p.compatible_formats and detected_format not in p.compatible_formats:
            invalid_plots.append(
                ScopeItem(
                    id=p.id,
                    label=p.label,
                    status=ScopeStatus.OUT_OF_SCOPE,
                    description=p.purpose,
                    why=p.unavailable_message or f"Not compatible with {detected_format}.",
                )
            )
            continue
        if p.requires_model and not req.has_model:
            invalid_plots.append(
                ScopeItem(
                    id=p.id,
                    label=p.label,
                    status=ScopeStatus.CONDITIONAL,
                    description=p.purpose,
                    why=p.unavailable_message or "Requires model.",
                )
            )
            continue
        if p.requires_predictions and not req.has_predictions:
            invalid_plots.append(
                ScopeItem(
                    id=p.id,
                    label=p.label,
                    status=ScopeStatus.CONDITIONAL,
                    description=p.purpose,
                    why=p.unavailable_message or "Requires predictions.",
                )
            )
            continue
        if p.requires_ground_truth and not req.has_ground_truth:
            invalid_plots.append(
                ScopeItem(
                    id=p.id,
                    label=p.label,
                    status=ScopeStatus.CONDITIONAL,
                    description=p.purpose,
                    why="Requires ground truth.",
                )
            )
            continue
        if p.requires_group_field and not req.has_group_field:
            invalid_plots.append(
                ScopeItem(
                    id=p.id,
                    label=p.label,
                    status=ScopeStatus.CONDITIONAL,
                    description=p.purpose,
                    why=p.unavailable_message or "Requires group field.",
                )
            )
            continue
        if p.requires_probability_output and not req.has_probability_output:
            invalid_plots.append(
                ScopeItem(
                    id=p.id,
                    label=p.label,
                    status=ScopeStatus.CONDITIONAL,
                    description=p.purpose,
                    why="Requires probability outputs.",
                )
            )
            continue
        if p.required_analyses and not valid_analysis_ids.intersection(p.required_analyses):
            invalid_plots.append(
                ScopeItem(
                    id=p.id,
                    label=p.label,
                    status=ScopeStatus.CONDITIONAL,
                    description=p.purpose,
                    why=f"Requires analysis: {', '.join(p.required_analyses)}.",
                )
            )
            continue
        valid_plots.append(
            ScopeItem(
                id=p.id,
                label=p.label,
                status=ScopeStatus.AVAILABLE,
                description=p.purpose,
                why="Available for current analysis plan.",
            )
        )

    # ── Expected artifacts ─────────────────────────────────────────────
    artifacts = [
        "metrics.json",
        "metrics.csv",
        "dashboard_payload.json",
        "field_inventory.csv",
        "SOP.md",
        "audit_manifest.json",
    ]
    if req.has_model:
        artifacts.append("model_card.json")
    artifacts.extend(["data_card.json", "compliance_graph.jsonld"])

    # ── Runtime estimate ───────────────────────────────────────────────
    row_count = req.inspection_result.row_count_estimate or 100_000
    base_time = max(30, row_count // 10_000)
    if req.has_model:
        base_time += 120
    if req.purpose == WizardPurpose.FULL_AUDIT:
        base_time *= 2

    # ── Missing inputs ─────────────────────────────────────────────────
    missing_inputs: list[str] = []
    optional_inputs: list[str] = []
    if any(i.status == ScopeStatus.CONDITIONAL and "model" in i.why.lower() for i in conditional):
        optional_inputs.append("Model artifact (.pkl, .onnx, .pt, .h5) or HTTP endpoint URL")
    if any(
        i.status == ScopeStatus.CONDITIONAL and "prediction" in i.why.lower() for i in conditional
    ):
        optional_inputs.append("Prediction output CSV")
    if any(i.status == ScopeStatus.CONDITIONAL and "ground" in i.why.lower() for i in conditional):
        optional_inputs.append("Ground-truth CSV")
    if any(i.status == ScopeStatus.CONDITIONAL and "group" in i.why.lower() for i in conditional):
        optional_inputs.append("Group/segment field mapping")

    # ── Scope summary ──────────────────────────────────────────────────
    scope_summary = (
        f"For a {req.purpose.value.replace('_', ' ')} of a {detected_format} dataset: "
        f"{len(valid)} analyses available immediately, "
        f"{len(conditional)} available with additional input, "
        f"{len(invalid)} out of scope."
    )

    # ── Privacy controls ───────────────────────────────────────────────
    privacy_controls = [
        "Entity/user identifiers are HMAC-pseudonymised by default.",
        "Raw personal data is not exported by default.",
        "PII field detection runs before all other analyses.",
        "Privacy acknowledgement is required before sensitive exports.",
    ]

    return RecommendResponse(
        recommended_recipe=f"{detected_format}_{req.purpose.value}",
        valid_analyses=valid,
        invalid_analyses=invalid,
        conditional_analyses=conditional,
        valid_plots=valid_plots,
        invalid_plots=invalid_plots,
        required_missing_inputs=missing_inputs,
        optional_recommended_inputs=optional_inputs,
        privacy_controls=privacy_controls,
        expected_artifacts=artifacts,
        runtime_estimate_seconds=base_time,
        memory_estimate_mb=max(256, row_count // 1000),
        limitations=LIMITATIONS,
        assumptions=ASSUMPTIONS,
        scope_summary=scope_summary,
    )
