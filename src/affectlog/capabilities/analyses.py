"""All supported analysis definitions with required inputs, outputs, and format compatibility."""

from __future__ import annotations

from enum import StrEnum

from pydantic import BaseModel, Field


class AnalysisCategory(StrEnum):
    SCHEMA = "schema"
    TRANSFORM = "transform"
    PRIVACY = "privacy"
    PROFILING = "profiling"
    TEMPORAL = "temporal"
    CONCENTRATION = "concentration"
    REPRESENTATION = "representation"
    RECOMMENDER = "recommender"
    CLASSIFICATION = "classification"
    REGRESSION = "regression"
    EXPLANATION = "explanation"
    COMPARISON = "comparison"
    COMPLIANCE = "compliance"


class SensitivityLevel(StrEnum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"


class RuntimeCategory(StrEnum):
    FAST = "fast"  # < 30s
    MEDIUM = "medium"  # 30s – 5min
    SLOW = "slow"  # > 5min


class AnalysisDefinition(BaseModel):
    id: str
    label: str
    category: AnalysisCategory
    description: str
    required_formats: list[str] = Field(default_factory=list)
    compatible_formats: list[str] = Field(default_factory=list)
    required_fields: list[str] = Field(default_factory=list)
    optional_fields: list[str] = Field(default_factory=list)
    requires_model: bool = False
    requires_predictions: bool = False
    requires_ground_truth: bool = False
    requires_group_field: bool = False
    requires_probability_output: bool = False
    requires_feature_schema: bool = False
    backend_route: str = ""
    produced_artifacts: list[str] = Field(default_factory=list)
    sensitivity: SensitivityLevel = SensitivityLevel.LOW
    runtime: RuntimeCategory = RuntimeCategory.FAST
    unavailable_message: str = ""


_ALL_FORMATS = [
    "maskott_csv_v1",
    "becomino_json",
    "generic_xapi_json",
    "generic_xapi_jsonl",
    "generic_csv_tabular",
    "parquet_tabular",
]
_XAPI_FORMATS = ["maskott_csv_v1", "becomino_json", "generic_xapi_json", "generic_xapi_jsonl"]
_TABULAR_FORMATS = ["generic_csv_tabular", "parquet_tabular"]
_ALL_FORMATS_PLUS_PREDICTIONS = _ALL_FORMATS + ["prediction_csv", "ground_truth_csv"]

ANALYSES: list[AnalysisDefinition] = [
    # ── Schema / Transform ──────────────────────────────────────────────────
    AnalysisDefinition(
        id="schema_validation",
        label="Schema Validation",
        category=AnalysisCategory.SCHEMA,
        description="Validates the dataset against the named schema, checking required columns, types, and constraints.",
        compatible_formats=_ALL_FORMATS,
        backend_route="POST /v1/datasets/validate",
        produced_artifacts=["validation_report.json"],
        runtime=RuntimeCategory.FAST,
    ),
    AnalysisDefinition(
        id="xapi_compatibility_check",
        label="xAPI Compatibility Check",
        category=AnalysisCategory.SCHEMA,
        description="Scores how closely the dataset conforms to the xAPI specification. Reports missing required fields and verb coverage.",
        compatible_formats=_XAPI_FORMATS + _TABULAR_FORMATS,
        backend_route="POST /v1/datasets/validate",
        produced_artifacts=["xapi_compatibility_report.json"],
        runtime=RuntimeCategory.FAST,
    ),
    AnalysisDefinition(
        id="becomino_template_inference",
        label="Becomino Template Inference",
        category=AnalysisCategory.SCHEMA,
        description="Matches the dataset structure against known Becomino activity templates and reports confidence.",
        compatible_formats=["becomino_json"],
        backend_route="POST /v1/datasets/validate",
        produced_artifacts=["becomino_template_match.json"],
        runtime=RuntimeCategory.FAST,
    ),
    AnalysisDefinition(
        id="maskott_csv_to_xapi_transform",
        label="Maskott CSV → xAPI Transform",
        category=AnalysisCategory.TRANSFORM,
        description="Transforms Maskott/Tactileo CSV into canonical xAPI JSONL using the AffectLog normalization pipeline.",
        required_formats=["maskott_csv_v1"],
        compatible_formats=["maskott_csv_v1"],
        backend_route="POST /v1/datasets/{dataset_id}/transform",
        produced_artifacts=["transformed.jsonl", "transform_report.json"],
        runtime=RuntimeCategory.MEDIUM,
    ),
    # ── Privacy ─────────────────────────────────────────────────────────────
    AnalysisDefinition(
        id="pii_scan",
        label="PII Field Scan",
        category=AnalysisCategory.PRIVACY,
        description="Detects columns containing personally identifiable information using pattern matching and heuristics.",
        compatible_formats=_ALL_FORMATS,
        backend_route="POST /v1/audits/run (stage: pii_scan)",
        produced_artifacts=["pii_report.json"],
        sensitivity=SensitivityLevel.HIGH,
        runtime=RuntimeCategory.MEDIUM,
    ),
    AnalysisDefinition(
        id="pseudonymisation_benchmark",
        label="Pseudonymisation Benchmark",
        category=AnalysisCategory.PRIVACY,
        description="Applies HMAC pseudonymisation to identifier fields and benchmarks linkage risk reduction.",
        compatible_formats=_ALL_FORMATS,
        backend_route="POST /v1/audits/run (stage: pseudonymisation_benchmark)",
        produced_artifacts=["pseudonymisation_report.json"],
        sensitivity=SensitivityLevel.HIGH,
        runtime=RuntimeCategory.MEDIUM,
    ),
    AnalysisDefinition(
        id="privacy_risk_profile",
        label="Privacy Risk Profile",
        category=AnalysisCategory.PRIVACY,
        description="Computes a composite privacy risk score across re-identification risk, quasi-identifier combinations, and linkage exposure.",
        compatible_formats=_ALL_FORMATS,
        backend_route="POST /v1/audits/run (stage: privacy_risk_profile)",
        produced_artifacts=["privacy_report.json"],
        sensitivity=SensitivityLevel.HIGH,
        runtime=RuntimeCategory.MEDIUM,
    ),
    # ── Profiling ────────────────────────────────────────────────────────────
    AnalysisDefinition(
        id="missingness_profile",
        label="Missingness Profile",
        category=AnalysisCategory.PROFILING,
        description="Computes per-field missing value rates and overall missingness distribution.",
        compatible_formats=_ALL_FORMATS,
        backend_route="POST /v1/audits/run (stage: profiling)",
        produced_artifacts=["metrics.json"],
        runtime=RuntimeCategory.FAST,
    ),
    AnalysisDefinition(
        id="completeness_profile",
        label="Completeness Profile",
        category=AnalysisCategory.PROFILING,
        description="Reports the fraction of rows with all required fields populated.",
        compatible_formats=_ALL_FORMATS,
        produced_artifacts=["metrics.json"],
        runtime=RuntimeCategory.FAST,
    ),
    AnalysisDefinition(
        id="type_profile",
        label="Field Type Profile",
        category=AnalysisCategory.PROFILING,
        description="Infers and reports the data type of each field.",
        compatible_formats=_ALL_FORMATS,
        produced_artifacts=["metrics.json"],
        runtime=RuntimeCategory.FAST,
    ),
    AnalysisDefinition(
        id="entropy_profile",
        label="Entropy Profile",
        category=AnalysisCategory.PROFILING,
        description="Computes Shannon entropy per categorical field to measure information diversity.",
        compatible_formats=_ALL_FORMATS,
        produced_artifacts=["metrics.json"],
        runtime=RuntimeCategory.FAST,
    ),
    AnalysisDefinition(
        id="temporal_density_profile",
        label="Temporal Density Profile",
        category=AnalysisCategory.TEMPORAL,
        description="Analyses the distribution of events over time, detecting active periods, gaps, and seasonal patterns.",
        compatible_formats=_XAPI_FORMATS + _TABULAR_FORMATS,
        required_fields=["timestamp_field"],
        backend_route="POST /v1/audits/run (stage: temporal_profile)",
        produced_artifacts=["metrics.json"],
        runtime=RuntimeCategory.MEDIUM,
        unavailable_message="Temporal density profile requires a timestamp field. Map a timestamp column in Step 3.",
    ),
    AnalysisDefinition(
        id="session_density_profile",
        label="Session Density Profile",
        category=AnalysisCategory.TEMPORAL,
        description="Measures event density within sessions and the distribution of session lengths.",
        compatible_formats=_XAPI_FORMATS + _TABULAR_FORMATS,
        required_fields=["session_field", "timestamp_field"],
        produced_artifacts=["metrics.json"],
        runtime=RuntimeCategory.MEDIUM,
        unavailable_message="Session density profile requires both session and timestamp fields.",
    ),
    AnalysisDefinition(
        id="event_frequency_profile",
        label="Event Frequency Profile",
        category=AnalysisCategory.TEMPORAL,
        description="Counts total events per entity and per item, reporting frequency distributions.",
        compatible_formats=_ALL_FORMATS,
        required_fields=["entity_field"],
        produced_artifacts=["metrics.json"],
        runtime=RuntimeCategory.FAST,
    ),
    # ── Distribution / Concentration ─────────────────────────────────────────
    AnalysisDefinition(
        id="verb_distribution",
        label="Verb / ViewContext Distribution",
        category=AnalysisCategory.PROFILING,
        description="Reports the frequency distribution of activity verbs or ViewContext values.",
        compatible_formats=_XAPI_FORMATS,
        produced_artifacts=["metrics.json"],
        runtime=RuntimeCategory.FAST,
    ),
    AnalysisDefinition(
        id="resource_type_distribution",
        label="Resource Type Distribution",
        category=AnalysisCategory.PROFILING,
        description="Reports the proportion of interactions by resource or content type.",
        compatible_formats=_ALL_FORMATS,
        required_fields=["item_field"],
        produced_artifacts=["metrics.json"],
        runtime=RuntimeCategory.FAST,
    ),
    AnalysisDefinition(
        id="long_tail_profile",
        label="Long-Tail Resource Profile",
        category=AnalysisCategory.CONCENTRATION,
        description="Identifies the fraction of resources responsible for the majority of interactions (power-law characterisation).",
        compatible_formats=_ALL_FORMATS,
        required_fields=["item_field"],
        backend_route="metrics.concentration.long_tail",
        produced_artifacts=["metrics.json"],
        runtime=RuntimeCategory.FAST,
    ),
    AnalysisDefinition(
        id="sparsity_analysis",
        label="Interaction Matrix Sparsity",
        category=AnalysisCategory.CONCENTRATION,
        description="Computes the sparsity of the user-item interaction matrix.",
        compatible_formats=_ALL_FORMATS,
        required_fields=["entity_field", "item_field"],
        produced_artifacts=["metrics.json"],
        runtime=RuntimeCategory.FAST,
    ),
    AnalysisDefinition(
        id="entity_dominance",
        label="Entity Dominance Analysis",
        category=AnalysisCategory.CONCENTRATION,
        description="Identifies entities (users) producing a disproportionate share of total events.",
        compatible_formats=_ALL_FORMATS,
        required_fields=["entity_field"],
        produced_artifacts=["metrics.json"],
        runtime=RuntimeCategory.FAST,
    ),
    AnalysisDefinition(
        id="resource_dominance",
        label="Resource Dominance Analysis",
        category=AnalysisCategory.CONCENTRATION,
        description="Identifies resources (items) receiving a disproportionate share of total interactions.",
        compatible_formats=_ALL_FORMATS,
        required_fields=["item_field"],
        produced_artifacts=["metrics.json"],
        runtime=RuntimeCategory.FAST,
    ),
    AnalysisDefinition(
        id="gini_concentration",
        label="Gini Concentration",
        category=AnalysisCategory.CONCENTRATION,
        description="Measures inequality in event or resource contribution using the Gini coefficient and Lorenz curve.",
        compatible_formats=_ALL_FORMATS,
        required_fields=["entity_field"],
        backend_route="metrics.concentration.gini",
        produced_artifacts=["metrics.json"],
        runtime=RuntimeCategory.FAST,
    ),
    AnalysisDefinition(
        id="coverage_at_k",
        label="Coverage@K",
        category=AnalysisCategory.REPRESENTATION,
        description="Estimates how broadly resources appear across top-K interaction lists. Detects representational concentration.",
        compatible_formats=_ALL_FORMATS,
        required_fields=["entity_field", "item_field"],
        backend_route="metrics.coverage.coverage_at_k",
        produced_artifacts=["metrics.json"],
        runtime=RuntimeCategory.FAST,
    ),
    AnalysisDefinition(
        id="representation_index",
        label="Representation Index",
        category=AnalysisCategory.REPRESENTATION,
        description="A composite score capturing how evenly content is distributed across the corpus.",
        compatible_formats=_ALL_FORMATS,
        required_fields=["entity_field", "item_field"],
        produced_artifacts=["metrics.json"],
        runtime=RuntimeCategory.FAST,
    ),
    AnalysisDefinition(
        id="cooccurrence_summary",
        label="Co-occurrence Summary",
        category=AnalysisCategory.REPRESENTATION,
        description="Computes and summarises verb-object or resource co-occurrence patterns.",
        compatible_formats=_XAPI_FORMATS,
        required_fields=["entity_field", "item_field"],
        produced_artifacts=["metrics.json"],
        runtime=RuntimeCategory.MEDIUM,
    ),
    # ── Recommender Evaluation ───────────────────────────────────────────────
    AnalysisDefinition(
        id="recommender_precision_at_k",
        label="Recommender Precision@K",
        category=AnalysisCategory.RECOMMENDER,
        description="Fraction of top-K recommendations that match ground-truth interactions.",
        compatible_formats=_ALL_FORMATS,
        required_fields=["entity_field", "item_field"],
        requires_predictions=True,
        requires_ground_truth=True,
        produced_artifacts=["metrics.json"],
        runtime=RuntimeCategory.MEDIUM,
        unavailable_message="Precision@K requires ranked recommendation predictions and ground-truth interaction data.",
    ),
    AnalysisDefinition(
        id="recommender_recall_at_k",
        label="Recommender Recall@K",
        category=AnalysisCategory.RECOMMENDER,
        description="Fraction of ground-truth items recovered in the top-K recommendations.",
        compatible_formats=_ALL_FORMATS,
        required_fields=["entity_field", "item_field"],
        requires_predictions=True,
        requires_ground_truth=True,
        produced_artifacts=["metrics.json"],
        runtime=RuntimeCategory.MEDIUM,
        unavailable_message="Recall@K requires ranked recommendation predictions and ground-truth interaction data.",
    ),
    AnalysisDefinition(
        id="recommender_hit_rate_at_k",
        label="Recommender Hit Rate@K",
        category=AnalysisCategory.RECOMMENDER,
        description="Proportion of users for whom at least one top-K recommendation matches ground truth.",
        compatible_formats=_ALL_FORMATS,
        required_fields=["entity_field", "item_field"],
        requires_predictions=True,
        requires_ground_truth=True,
        produced_artifacts=["metrics.json"],
        runtime=RuntimeCategory.MEDIUM,
        unavailable_message="Hit Rate@K requires ranked recommendations and ground-truth interactions.",
    ),
    AnalysisDefinition(
        id="recommender_ndcg_at_k",
        label="Recommender nDCG@K",
        category=AnalysisCategory.RECOMMENDER,
        description="Normalised Discounted Cumulative Gain at K — a ranked relevance metric for recommender evaluation.",
        compatible_formats=_ALL_FORMATS,
        required_fields=["entity_field", "item_field"],
        requires_predictions=True,
        requires_ground_truth=True,
        produced_artifacts=["metrics.json"],
        runtime=RuntimeCategory.MEDIUM,
        unavailable_message="nDCG@K requires a ranked recommendation list and ground-truth interaction set.",
    ),
    AnalysisDefinition(
        id="recommender_diversity",
        label="Recommender Intra-List Diversity",
        category=AnalysisCategory.RECOMMENDER,
        description="Measures content diversity within recommendation lists to detect echo-chamber effects.",
        compatible_formats=_ALL_FORMATS,
        required_fields=["entity_field", "item_field"],
        requires_predictions=True,
        produced_artifacts=["metrics.json"],
        runtime=RuntimeCategory.MEDIUM,
        unavailable_message="Diversity requires recommendation predictions.",
    ),
    AnalysisDefinition(
        id="recommender_novelty",
        label="Recommender Novelty",
        category=AnalysisCategory.RECOMMENDER,
        description="Measures how surprising the recommendations are relative to historical popularity.",
        compatible_formats=_ALL_FORMATS,
        required_fields=["entity_field", "item_field"],
        requires_predictions=True,
        produced_artifacts=["metrics.json"],
        runtime=RuntimeCategory.MEDIUM,
        unavailable_message="Novelty requires recommendation predictions.",
    ),
    # ── Classification / Regression ─────────────────────────────────────────
    AnalysisDefinition(
        id="classification_performance",
        label="Classification Performance",
        category=AnalysisCategory.CLASSIFICATION,
        description="Accuracy, precision, recall, F1, and confusion matrix for classification models.",
        compatible_formats=_ALL_FORMATS + _TABULAR_FORMATS,
        required_fields=["target_field", "prediction_field"],
        requires_predictions=True,
        requires_ground_truth=True,
        produced_artifacts=["metrics.json"],
        runtime=RuntimeCategory.FAST,
        unavailable_message="Classification metrics require a target field and prediction field (class labels).",
    ),
    AnalysisDefinition(
        id="regression_performance",
        label="Regression Performance",
        category=AnalysisCategory.REGRESSION,
        description="RMSE, MAE, R², and residual statistics for regression models.",
        compatible_formats=_TABULAR_FORMATS,
        required_fields=["target_field", "prediction_field"],
        requires_predictions=True,
        requires_ground_truth=True,
        produced_artifacts=["metrics.json"],
        runtime=RuntimeCategory.FAST,
        unavailable_message="Regression metrics require numeric target and prediction fields.",
    ),
    AnalysisDefinition(
        id="segment_performance",
        label="Segment-Level Performance",
        category=AnalysisCategory.CLASSIFICATION,
        description="Performance metrics broken down by data segment or cohort.",
        compatible_formats=_TABULAR_FORMATS,
        required_fields=["target_field", "prediction_field", "group_field"],
        requires_predictions=True,
        requires_ground_truth=True,
        requires_group_field=True,
        produced_artifacts=["metrics.json"],
        runtime=RuntimeCategory.FAST,
        unavailable_message="Segment performance requires target, prediction, and at least one group/segment field.",
    ),
    AnalysisDefinition(
        id="fairness_by_group",
        label="Fairness by Group",
        category=AnalysisCategory.CLASSIFICATION,
        description="Computes demographic parity, equalised odds, and predictive parity across user-defined groups.",
        compatible_formats=_TABULAR_FORMATS,
        required_fields=["target_field", "prediction_field", "group_field"],
        requires_predictions=True,
        requires_ground_truth=True,
        requires_group_field=True,
        backend_route="metrics.fairness.fairness_by_group",
        produced_artifacts=["metrics.json"],
        sensitivity=SensitivityLevel.HIGH,
        runtime=RuntimeCategory.FAST,
        unavailable_message=(
            "Fairness-by-group is unavailable because no group/segment field was selected. "
            "Provide an ethically and legally appropriate grouping field and confirm lawful use."
        ),
    ),
    # ── Model Explanation ────────────────────────────────────────────────────
    AnalysisDefinition(
        id="model_feature_importance",
        label="Global Feature Importance",
        category=AnalysisCategory.EXPLANATION,
        description="SHAP or permutation-based global feature importance for the registered model.",
        compatible_formats=_TABULAR_FORMATS,
        requires_model=True,
        requires_feature_schema=True,
        backend_route="POST /v1/models/{model_id}/explain",
        produced_artifacts=["metrics.json"],
        runtime=RuntimeCategory.SLOW,
        unavailable_message="Model feature importance requires a compatible model artifact or endpoint and a valid feature matrix.",
    ),
    AnalysisDefinition(
        id="model_prediction_explanation",
        label="Local Prediction Explanations",
        category=AnalysisCategory.EXPLANATION,
        description="SHAP waterfall explanations for individual predictions in the test dataset.",
        compatible_formats=_TABULAR_FORMATS,
        requires_model=True,
        requires_feature_schema=True,
        backend_route="POST /v1/models/{model_id}/explain",
        produced_artifacts=["metrics.json"],
        runtime=RuntimeCategory.SLOW,
        unavailable_message="Local explanations require a compatible model artifact and a feature matrix.",
    ),
    AnalysisDefinition(
        id="model_partial_dependence",
        label="Partial Dependence Plots",
        category=AnalysisCategory.EXPLANATION,
        description="Marginal effect of each feature on model predictions, computed via partial dependence.",
        compatible_formats=_TABULAR_FORMATS,
        requires_model=True,
        requires_feature_schema=True,
        produced_artifacts=["metrics.json"],
        runtime=RuntimeCategory.SLOW,
        unavailable_message="Partial dependence requires a compatible model adapter and feature schema.",
    ),
    AnalysisDefinition(
        id="model_comparison",
        label="Model Comparison",
        category=AnalysisCategory.COMPARISON,
        description="Side-by-side performance and explanation comparison of two registered models.",
        compatible_formats=_TABULAR_FORMATS,
        requires_model=True,
        backend_route="POST /v1/models/compare",
        produced_artifacts=["metrics.json"],
        runtime=RuntimeCategory.SLOW,
        unavailable_message="Model comparison requires two compatible model artifacts.",
    ),
    AnalysisDefinition(
        id="model_residual_diagnostics",
        label="Residual Diagnostics",
        category=AnalysisCategory.REGRESSION,
        description="Residual plots, heteroscedasticity analysis, and outlier detection for regression models.",
        compatible_formats=_TABULAR_FORMATS,
        required_fields=["target_field", "prediction_field"],
        requires_predictions=True,
        requires_ground_truth=True,
        produced_artifacts=["metrics.json"],
        runtime=RuntimeCategory.FAST,
        unavailable_message="Residual diagnostics require numeric target and prediction fields.",
    ),
    AnalysisDefinition(
        id="dataset_model_schema_check",
        label="Dataset–Model Schema Check",
        category=AnalysisCategory.SCHEMA,
        description="Validates that the dataset feature schema is compatible with the registered model's expected input schema.",
        compatible_formats=_TABULAR_FORMATS,
        requires_model=True,
        requires_feature_schema=True,
        produced_artifacts=["schema_compatibility_report.json"],
        runtime=RuntimeCategory.FAST,
        unavailable_message="Schema check requires a registered model with a declared feature schema.",
    ),
    # ── Compliance Exports ───────────────────────────────────────────────────
    AnalysisDefinition(
        id="data_card_export",
        label="Data Card Export",
        category=AnalysisCategory.COMPLIANCE,
        description="Generates a structured data card (Google/Hugging Face format) summarising dataset provenance, composition, and limitations.",
        compatible_formats=_ALL_FORMATS,
        produced_artifacts=["data_card.json"],
        runtime=RuntimeCategory.FAST,
    ),
    AnalysisDefinition(
        id="model_card_export",
        label="Model Card Export",
        category=AnalysisCategory.COMPLIANCE,
        description="Generates a structured model card summarising intended use, performance, and limitations.",
        compatible_formats=_TABULAR_FORMATS,
        requires_model=True,
        produced_artifacts=["model_card.json"],
        runtime=RuntimeCategory.FAST,
        unavailable_message="Model card export requires a registered model.",
    ),
    AnalysisDefinition(
        id="jsonld_compliance_graph",
        label="JSON-LD Compliance Graph",
        category=AnalysisCategory.COMPLIANCE,
        description="Generates a machine-readable audit evidence graph in JSON-LD format, aligned with EU AI Act Annex IV requirements.",
        compatible_formats=_ALL_FORMATS,
        backend_route="POST /v1/compliance/jsonld",
        produced_artifacts=["compliance_graph.jsonld"],
        runtime=RuntimeCategory.FAST,
    ),
    AnalysisDefinition(
        id="sop_export",
        label="Standard Operating Procedure Export",
        category=AnalysisCategory.COMPLIANCE,
        description="Produces a human-readable SOP document describing the audit pipeline, inputs, methods, and outputs.",
        compatible_formats=_ALL_FORMATS,
        produced_artifacts=["SOP.md", "SOP.html"],
        runtime=RuntimeCategory.FAST,
    ),
    AnalysisDefinition(
        id="audit_manifest_export",
        label="Audit Manifest Export",
        category=AnalysisCategory.COMPLIANCE,
        description="Generates a cryptographically signed manifest of all audit inputs, parameters, and output artifacts.",
        compatible_formats=_ALL_FORMATS,
        produced_artifacts=["audit_manifest.json"],
        runtime=RuntimeCategory.FAST,
    ),
    AnalysisDefinition(
        id="carisma_metadata_export",
        label="CARiSMA Metadata Export",
        category=AnalysisCategory.COMPLIANCE,
        description="Exports audit metadata in CARiSMA interoperability format for Prometheus-X data space integration.",
        compatible_formats=_ALL_FORMATS,
        backend_route="POST /v1/interoperability/carisma",
        produced_artifacts=["carisma_metadata.json"],
        runtime=RuntimeCategory.FAST,
    ),
    AnalysisDefinition(
        id="lola_metadata_export",
        label="LOLA Metadata Export",
        category=AnalysisCategory.COMPLIANCE,
        description="Exports dataset and audit metadata in LOLA (Learning Object Linkage Architecture) format.",
        compatible_formats=_ALL_FORMATS,
        backend_route="POST /v1/interoperability/lola",
        produced_artifacts=["lola_metadata.json"],
        runtime=RuntimeCategory.FAST,
    ),
    AnalysisDefinition(
        id="pdc_metadata_export",
        label="PDC Metadata Export",
        category=AnalysisCategory.COMPLIANCE,
        description="Exports consent and policy metadata to the Personal Data Cooperative (PDC) via ODRL policy.",
        compatible_formats=_ALL_FORMATS,
        backend_route="POST /v1/pdc/policy",
        produced_artifacts=["pdc_metadata.json"],
        sensitivity=SensitivityLevel.HIGH,
        runtime=RuntimeCategory.FAST,
    ),
]

ANALYSIS_BY_ID: dict[str, AnalysisDefinition] = {a.id: a for a in ANALYSES}
ANALYSIS_IDS: set[str] = {a.id for a in ANALYSES}
