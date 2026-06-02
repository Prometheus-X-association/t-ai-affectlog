"""Plot definitions — each plot must have required data, produced artifact, and privacy level."""

from __future__ import annotations

from enum import StrEnum

from pydantic import BaseModel, Field


class PlotPrivacyLevel(StrEnum):
    PUBLIC = "public"
    PSEUDONYMISED = "pseudonymised"
    RESTRICTED = "restricted"


class PlotDefinition(BaseModel):
    id: str
    label: str
    purpose: str
    required_analyses: list[str] = Field(default_factory=list)
    required_fields: list[str] = Field(default_factory=list)
    produced_artifact: str
    privacy_level: PlotPrivacyLevel = PlotPrivacyLevel.PUBLIC
    limitations: str = ""
    compatible_formats: list[str] = Field(default_factory=list)
    requires_model: bool = False
    requires_predictions: bool = False
    requires_ground_truth: bool = False
    requires_group_field: bool = False
    requires_probability_output: bool = False
    unavailable_message: str = ""


_ALL = [
    "maskott_csv_v1",
    "becomino_json",
    "generic_xapi_json",
    "generic_xapi_jsonl",
    "generic_csv_tabular",
    "parquet_tabular",
]
_XAPI = ["maskott_csv_v1", "becomino_json", "generic_xapi_json", "generic_xapi_jsonl"]
_TAB = ["generic_csv_tabular", "parquet_tabular"]

PLOTS: list[PlotDefinition] = [
    # ── Schema & Quality ────────────────────────────────────────────────────
    PlotDefinition(
        id="schema_overview_table",
        label="Schema Overview Table",
        purpose="Displays field names, inferred types, cardinalities, and missing rates.",
        required_analyses=["schema_validation", "type_profile"],
        produced_artifact="dashboard_payload.json",
        compatible_formats=_ALL,
        privacy_level=PlotPrivacyLevel.PUBLIC,
        limitations="Field names are shown. Ensure no sensitive column naming conventions are exposed.",
    ),
    PlotDefinition(
        id="missingness_matrix",
        label="Missingness Matrix",
        purpose="Visual heatmap showing which fields and rows have missing values.",
        required_analyses=["missingness_profile"],
        produced_artifact="dashboard_payload.json",
        compatible_formats=_ALL,
        privacy_level=PlotPrivacyLevel.PUBLIC,
    ),
    PlotDefinition(
        id="completeness_bar",
        label="Completeness Bar Chart",
        purpose="Per-field completeness as a percentage bar chart.",
        required_analyses=["completeness_profile"],
        produced_artifact="dashboard_payload.json",
        compatible_formats=_ALL,
        privacy_level=PlotPrivacyLevel.PUBLIC,
    ),
    PlotDefinition(
        id="type_distribution_bar",
        label="Field Type Distribution",
        purpose="Bar chart of inferred field types across the dataset schema.",
        required_analyses=["type_profile"],
        produced_artifact="dashboard_payload.json",
        compatible_formats=_ALL,
        privacy_level=PlotPrivacyLevel.PUBLIC,
    ),
    PlotDefinition(
        id="entropy_bar",
        label="Entropy Bar Chart",
        purpose="Shannon entropy per categorical field — high entropy indicates more diversity.",
        required_analyses=["entropy_profile"],
        produced_artifact="dashboard_payload.json",
        compatible_formats=_ALL,
        privacy_level=PlotPrivacyLevel.PUBLIC,
    ),
    # ── Privacy ──────────────────────────────────────────────────────────────
    PlotDefinition(
        id="pii_field_heatmap",
        label="PII Field Heatmap",
        purpose="Heatmap showing which fields are flagged as PII, quasi-identifiers, or free-text risks.",
        required_analyses=["pii_scan"],
        produced_artifact="privacy_report.json",
        compatible_formats=_ALL,
        privacy_level=PlotPrivacyLevel.RESTRICTED,
        limitations="Displayed as a summary. Raw field values are never shown.",
    ),
    # ── xAPI / Educational Traces ─────────────────────────────────────────
    PlotDefinition(
        id="verb_distribution_bar",
        label="Verb / ViewContext Distribution",
        purpose="Bar chart of the frequency of each activity verb or ViewContext value.",
        required_analyses=["verb_distribution"],
        compatible_formats=_XAPI,
        produced_artifact="dashboard_payload.json",
        privacy_level=PlotPrivacyLevel.PUBLIC,
    ),
    PlotDefinition(
        id="event_frequency_timeline",
        label="Event Frequency Timeline",
        purpose="Time-series of event counts per day/week. Shows activity peaks and gaps.",
        required_analyses=["event_frequency_profile", "temporal_density_profile"],
        required_fields=["timestamp_field"],
        compatible_formats=_XAPI + _TAB,
        produced_artifact="dashboard_payload.json",
        privacy_level=PlotPrivacyLevel.PUBLIC,
        limitations="Requires timestamp field.",
        unavailable_message="Event frequency timeline requires a timestamp field.",
    ),
    PlotDefinition(
        id="temporal_density_histogram",
        label="Temporal Density Histogram",
        purpose="Distribution of events across time bins (hours of day, days of week).",
        required_analyses=["temporal_density_profile"],
        required_fields=["timestamp_field"],
        compatible_formats=_XAPI + _TAB,
        produced_artifact="dashboard_payload.json",
        privacy_level=PlotPrivacyLevel.PUBLIC,
        unavailable_message="Temporal density histogram requires a timestamp field.",
    ),
    PlotDefinition(
        id="session_density_histogram",
        label="Session Density Histogram",
        purpose="Distribution of session lengths and events-per-session.",
        required_analyses=["session_density_profile"],
        required_fields=["session_field"],
        compatible_formats=_XAPI + _TAB,
        produced_artifact="dashboard_payload.json",
        privacy_level=PlotPrivacyLevel.PUBLIC,
        unavailable_message="Session density histogram requires session and timestamp fields.",
    ),
    PlotDefinition(
        id="resource_type_bar",
        label="Resource Type Distribution",
        purpose="Bar chart of interaction counts per ResourceType or content category.",
        required_analyses=["resource_type_distribution"],
        required_fields=["item_field"],
        compatible_formats=_ALL,
        produced_artifact="dashboard_payload.json",
        privacy_level=PlotPrivacyLevel.PUBLIC,
    ),
    PlotDefinition(
        id="top_resources_bar",
        label="Top Resources Bar Chart",
        purpose="Top 20 most-interacted resources by total interaction count.",
        required_analyses=["resource_dominance"],
        required_fields=["item_field"],
        compatible_formats=_ALL,
        produced_artifact="dashboard_payload.json",
        privacy_level=PlotPrivacyLevel.PUBLIC,
        limitations="Resource IDs are shown. Confirm they do not constitute PII.",
    ),
    PlotDefinition(
        id="top_entities_bar_pseudonymised",
        label="Top Entities (Pseudonymised)",
        purpose="Top 20 most-active entities by event count. Entity IDs are HMAC-pseudonymised.",
        required_analyses=["entity_dominance", "pseudonymisation_benchmark"],
        required_fields=["entity_field"],
        compatible_formats=_ALL,
        produced_artifact="dashboard_payload.json",
        privacy_level=PlotPrivacyLevel.PSEUDONYMISED,
        limitations="Entity IDs are HMAC-hashed and never shown in raw form.",
    ),
    # ── Concentration ────────────────────────────────────────────────────────
    PlotDefinition(
        id="long_tail_curve",
        label="Long-Tail Curve",
        purpose="Ranks resources by interaction count and plots the cumulative fraction — visualises the power-law distribution.",
        required_analyses=["long_tail_profile"],
        required_fields=["item_field"],
        compatible_formats=_ALL,
        produced_artifact="dashboard_payload.json",
        privacy_level=PlotPrivacyLevel.PUBLIC,
    ),
    PlotDefinition(
        id="lorenz_curve",
        label="Lorenz Curve",
        purpose="Cumulative share of interactions vs cumulative share of entities or resources. Used alongside Gini.",
        required_analyses=["gini_concentration"],
        required_fields=["entity_field"],
        compatible_formats=_ALL,
        produced_artifact="dashboard_payload.json",
        privacy_level=PlotPrivacyLevel.PUBLIC,
    ),
    PlotDefinition(
        id="gini_summary_card",
        label="Gini Summary Card",
        purpose="Displays the Gini coefficient value with an interpretation note.",
        required_analyses=["gini_concentration"],
        compatible_formats=_ALL,
        produced_artifact="dashboard_payload.json",
        privacy_level=PlotPrivacyLevel.PUBLIC,
    ),
    PlotDefinition(
        id="coverage_at_k_curve",
        label="Coverage@K Curve",
        purpose="Plots Coverage@K for K = 1 to 20, showing how resource exposure scales with recommendation depth.",
        required_analyses=["coverage_at_k"],
        required_fields=["entity_field", "item_field"],
        compatible_formats=_ALL,
        produced_artifact="dashboard_payload.json",
        privacy_level=PlotPrivacyLevel.PUBLIC,
    ),
    PlotDefinition(
        id="sparsity_heatmap_sample",
        label="Interaction Sparsity Heatmap (Sample)",
        purpose="Sampled user-item interaction matrix heatmap showing populated and missing cells.",
        required_analyses=["sparsity_analysis"],
        required_fields=["entity_field", "item_field"],
        compatible_formats=_ALL,
        produced_artifact="dashboard_payload.json",
        privacy_level=PlotPrivacyLevel.PSEUDONYMISED,
        limitations="Uses a random sample of up to 50 entities and 50 resources. Entity IDs are pseudonymised.",
    ),
    PlotDefinition(
        id="cooccurrence_network",
        label="Co-occurrence Network",
        purpose="Graph visualisation of resource or verb co-occurrences within sessions.",
        required_analyses=["cooccurrence_summary"],
        required_fields=["entity_field", "item_field"],
        compatible_formats=_XAPI,
        produced_artifact="dashboard_payload.json",
        privacy_level=PlotPrivacyLevel.PUBLIC,
        limitations="Edges represent aggregate co-occurrence counts, never individual sessions.",
    ),
    PlotDefinition(
        id="representation_index_bar",
        label="Representation Index Bar",
        purpose="Bar chart of the composite representation score across content categories.",
        required_analyses=["representation_index"],
        compatible_formats=_ALL,
        produced_artifact="dashboard_payload.json",
        privacy_level=PlotPrivacyLevel.PUBLIC,
    ),
    # ── Fairness ─────────────────────────────────────────────────────────────
    PlotDefinition(
        id="group_distribution_bar",
        label="Group Distribution Bar",
        purpose="Event or sample count per group/segment. Detects imbalanced group representation.",
        required_analyses=["fairness_by_group"],
        required_fields=["group_field"],
        requires_group_field=True,
        compatible_formats=_TAB,
        produced_artifact="dashboard_payload.json",
        privacy_level=PlotPrivacyLevel.RESTRICTED,
        unavailable_message="Group distribution requires a group field.",
    ),
    PlotDefinition(
        id="fairness_metric_table",
        label="Fairness Metric Table",
        purpose="Table of per-group precision, recall, and parity gap values for fairness assessment.",
        required_analyses=["fairness_by_group"],
        required_fields=["group_field", "target_field", "prediction_field"],
        requires_group_field=True,
        requires_predictions=True,
        requires_ground_truth=True,
        compatible_formats=_TAB,
        produced_artifact="dashboard_payload.json",
        privacy_level=PlotPrivacyLevel.RESTRICTED,
        unavailable_message="Fairness table requires group field, target, and predictions.",
    ),
    # ── Classification Metrics ───────────────────────────────────────────────
    PlotDefinition(
        id="confusion_matrix",
        label="Confusion Matrix",
        purpose="Matrix of true/false positive and negative counts per class.",
        required_analyses=["classification_performance"],
        required_fields=["target_field", "prediction_field"],
        requires_predictions=True,
        requires_ground_truth=True,
        compatible_formats=_TAB,
        produced_artifact="dashboard_payload.json",
        privacy_level=PlotPrivacyLevel.PUBLIC,
        unavailable_message="Confusion matrix requires target and prediction class labels.",
    ),
    PlotDefinition(
        id="roc_curve",
        label="ROC Curve",
        purpose="Receiver Operating Characteristic curve showing the trade-off between TPR and FPR.",
        required_analyses=["classification_performance"],
        required_fields=["target_field", "prediction_field"],
        requires_predictions=True,
        requires_ground_truth=True,
        requires_probability_output=True,
        compatible_formats=_TAB,
        produced_artifact="dashboard_payload.json",
        privacy_level=PlotPrivacyLevel.PUBLIC,
        unavailable_message="ROC curve requires probability outputs from the classifier.",
    ),
    PlotDefinition(
        id="pr_curve",
        label="Precision-Recall Curve",
        purpose="Precision-recall curve, useful for imbalanced classification tasks.",
        required_analyses=["classification_performance"],
        required_fields=["target_field", "prediction_field"],
        requires_predictions=True,
        requires_ground_truth=True,
        requires_probability_output=True,
        compatible_formats=_TAB,
        produced_artifact="dashboard_payload.json",
        privacy_level=PlotPrivacyLevel.PUBLIC,
        unavailable_message="PR curve requires probability outputs from the classifier.",
    ),
    PlotDefinition(
        id="calibration_curve",
        label="Calibration Curve",
        purpose="Plots predicted probability vs observed frequency — assesses model calibration quality.",
        required_analyses=["classification_performance"],
        requires_predictions=True,
        requires_ground_truth=True,
        requires_probability_output=True,
        compatible_formats=_TAB,
        produced_artifact="dashboard_payload.json",
        privacy_level=PlotPrivacyLevel.PUBLIC,
        unavailable_message="Calibration curve requires probability outputs.",
    ),
    # ── Regression Metrics ───────────────────────────────────────────────────
    PlotDefinition(
        id="residual_plot",
        label="Residual Plot",
        purpose="Residuals vs predicted values — detects heteroscedasticity and systematic bias.",
        required_analyses=["regression_performance", "model_residual_diagnostics"],
        requires_predictions=True,
        requires_ground_truth=True,
        compatible_formats=_TAB,
        produced_artifact="dashboard_payload.json",
        privacy_level=PlotPrivacyLevel.PUBLIC,
        unavailable_message="Residual plot requires numeric target and prediction fields.",
    ),
    PlotDefinition(
        id="prediction_error_histogram",
        label="Prediction Error Histogram",
        purpose="Distribution of |prediction − ground_truth| errors.",
        required_analyses=["regression_performance"],
        requires_predictions=True,
        requires_ground_truth=True,
        compatible_formats=_TAB,
        produced_artifact="dashboard_payload.json",
        privacy_level=PlotPrivacyLevel.PUBLIC,
    ),
    # ── Model Explanations ───────────────────────────────────────────────────
    PlotDefinition(
        id="feature_importance_bar",
        label="Feature Importance Bar Chart",
        purpose="Global SHAP or permutation feature importance ranked by mean |SHAP value|.",
        required_analyses=["model_feature_importance"],
        requires_model=True,
        compatible_formats=_TAB,
        produced_artifact="dashboard_payload.json",
        privacy_level=PlotPrivacyLevel.PUBLIC,
        unavailable_message="Feature importance requires a compatible model and feature schema.",
    ),
    PlotDefinition(
        id="local_explanation_waterfall",
        label="Local Explanation Waterfall",
        purpose="SHAP waterfall plot for a single prediction — shows which features pushed the decision.",
        required_analyses=["model_prediction_explanation"],
        requires_model=True,
        compatible_formats=_TAB,
        produced_artifact="dashboard_payload.json",
        privacy_level=PlotPrivacyLevel.PSEUDONYMISED,
        limitations="Uses a representative sample row. Row identity is pseudonymised.",
        unavailable_message="Local explanation requires a compatible model and feature schema.",
    ),
    PlotDefinition(
        id="partial_dependence_plot",
        label="Partial Dependence Plot",
        purpose="Marginal effect of top features on model output, holding others at their median.",
        required_analyses=["model_partial_dependence"],
        requires_model=True,
        compatible_formats=_TAB,
        produced_artifact="dashboard_payload.json",
        privacy_level=PlotPrivacyLevel.PUBLIC,
        unavailable_message="Partial dependence requires a compatible model adapter.",
    ),
    PlotDefinition(
        id="model_comparison_radar",
        label="Model Comparison Radar",
        purpose="Radar chart comparing multiple metrics (accuracy, F1, fairness parity, explanation fidelity) across two models.",
        required_analyses=["model_comparison"],
        requires_model=True,
        compatible_formats=_TAB,
        produced_artifact="dashboard_payload.json",
        privacy_level=PlotPrivacyLevel.PUBLIC,
        unavailable_message="Model comparison radar requires two compatible model artifacts.",
    ),
    # ── Compliance / Audit ───────────────────────────────────────────────────
    PlotDefinition(
        id="jsonld_graph_preview",
        label="JSON-LD Compliance Graph Preview",
        purpose="Interactive graph visualisation of the audit evidence graph (nodes = entities, edges = relationships).",
        required_analyses=["jsonld_compliance_graph"],
        compatible_formats=_ALL,
        produced_artifact="compliance_graph.jsonld",
        privacy_level=PlotPrivacyLevel.PUBLIC,
    ),
    PlotDefinition(
        id="audit_pipeline_timeline",
        label="Audit Pipeline Timeline",
        purpose="Step-by-step visual timeline of the audit pipeline stages and their durations.",
        required_analyses=["audit_manifest_export"],
        compatible_formats=_ALL,
        produced_artifact="audit_manifest.json",
        privacy_level=PlotPrivacyLevel.PUBLIC,
    ),
    PlotDefinition(
        id="artifact_stack_view",
        label="Artifact Stack View",
        purpose="Summary card list of all produced artifacts with type, size, and download links.",
        required_analyses=[],
        compatible_formats=_ALL,
        produced_artifact="audit_manifest.json",
        privacy_level=PlotPrivacyLevel.PUBLIC,
    ),
]

PLOT_BY_ID: dict[str, PlotDefinition] = {p.id: p for p in PLOTS}
PLOT_IDS: set[str] = {p.id for p in PLOTS}
