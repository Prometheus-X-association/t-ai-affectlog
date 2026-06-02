"""Contextual help text for every wizard step and analysis."""

from __future__ import annotations

from pydantic import BaseModel


class StepHelp(BaseModel):
    step: int
    title: str
    short_help: str
    why_it_matters: str
    required_inputs: str
    privacy_implications: str
    expected_outputs: str
    common_mistakes: str
    developer_extension_path: str


class AnalysisHelp(BaseModel):
    analysis_id: str
    short_help: str
    why_it_matters: str
    required_inputs: str
    privacy_implications: str
    expected_outputs: str
    common_mistakes: str
    developer_extension_path: str


STEP_HELP: dict[int, StepHelp] = {
    1: StepHelp(
        step=1,
        title="Input Source",
        short_help="Tell AffectLog what data you want to assess.",
        why_it_matters="The input type determines which analyses are possible. Uploading the wrong file type or missing a prediction file will silently remove valid metrics from your plan.",
        required_inputs="At minimum, a dataset file (CSV, JSON, JSONL, or Parquet). Optionally: a model artifact, prediction CSV, or ground-truth CSV.",
        privacy_implications="AffectLog does not transmit raw data externally. Files are stored in your tenant's secure storage directory. Raw personal data is never displayed by default.",
        expected_outputs="A file reference registered to your session, ready for format detection.",
        common_mistakes="Uploading a raw model output CSV as the main dataset. Prediction CSVs should be uploaded separately, not as the primary input.",
        developer_extension_path="Add new supported formats by implementing a reader in src/affectlog/ingest/ and registering the format in src/affectlog/capabilities/formats.py.",
    ),
    2: StepHelp(
        step=2,
        title="Format Detection",
        short_help="AffectLog automatically identifies the input format and schema.",
        why_it_matters="Format detection determines the pre-built analyses available. An incorrect detection will constrain or misdirect the analysis plan.",
        required_inputs="The uploaded or referenced file from Step 1.",
        privacy_implications="Detection reads file headers and a sample of rows. No personal data is stored beyond the session.",
        expected_outputs="Detected format ID, confidence score, row count estimate, detected schema, and xAPI compatibility score.",
        common_mistakes="Accepting an incorrect format detection without reviewing the field list. Always check that key fields (entity ID, timestamp, item ID) are detected correctly.",
        developer_extension_path="Add detection rules in src/affectlog/ingest/schema_infer.py and register the format in src/affectlog/capabilities/formats.py.",
    ),
    3: StepHelp(
        step=3,
        title="Schema Mapping",
        short_help="Confirm or correct how dataset fields map to AffectLog concepts.",
        why_it_matters="Incorrect field mappings silently invalidate downstream metrics. For example, mapping a session ID as the entity ID will produce meaningless concentration metrics.",
        required_inputs="The detected schema from Step 2. For Maskott CSV, all fields are pre-mapped. For generic formats, manual mapping is required.",
        privacy_implications="Mapping a direct identifier field as the entity ID will expose it in reports unless HMAC pseudonymisation is applied. AffectLog will warn for any likely-identifier field.",
        expected_outputs="Confirmed field mapping that unlocks the analysis plan in Step 6.",
        common_mistakes="Skipping the group field mapping when planning fairness analysis. Fairness-by-group cannot run without an explicit group/segment field.",
        developer_extension_path="Add new semantic field types in src/affectlog/wizard/schemas.py FieldRole enum.",
    ),
    4: StepHelp(
        step=4,
        title="Privacy Review",
        short_help="Review and confirm privacy controls before any analysis runs.",
        why_it_matters="Privacy controls are enforced server-side. This step is your final opportunity to confirm that identifier fields will be pseudonymised, free-text fields will be redacted, and raw personal data will not appear in outputs.",
        required_inputs="The field inventory from Step 2 and field mappings from Step 3.",
        privacy_implications="Raw identifier export is blocked by default. Tenant administrators can unlock raw inspection only for GDPR-compliant purposes. All privacy decisions are logged to the audit manifest.",
        expected_outputs="Privacy settings that are embedded in the output contract and enforced by the pipeline.",
        common_mistakes="Assuming that uploading pseudonymised data means no further privacy controls are needed. AffectLog always re-evaluates privacy risk on the actual field values.",
        developer_extension_path="Extend pseudonymisation options in src/affectlog/privacy/pseudonymizer.py.",
    ),
    5: StepHelp(
        step=5,
        title="Model Context",
        short_help="Register your model to enable explanation and performance analyses.",
        why_it_matters="Model-aware analyses (SHAP, PDP, model card, comparison) are only available when a compatible model is registered. Without a model, AffectLog performs dataset-only assessment.",
        required_inputs="A model artifact (.pkl, .onnx, .pt, .h5) or an HTTP endpoint URL. Optionally: feature schema, class labels, and probability output flag.",
        privacy_implications="Feature schemas do not contain personal data. The model artifact itself is stored in your tenant's secure storage and is never shared.",
        expected_outputs="A registered model ID, confirmed adapter type, and unlocked explanation analyses.",
        common_mistakes="Registering a model without declaring its feature schema — this blocks local explanation analyses. Declaring classification when the model is a regression model — this will misclassify available metrics.",
        developer_extension_path="Implement new model adapters in src/affectlog/models/ following the base adapter interface.",
    ),
    6: StepHelp(
        step=6,
        title="Analysis Scope",
        short_help="Review exactly which analyses are available, conditionally available, and out of scope.",
        why_it_matters="The scope matrix is your guarantee: only listed Available analyses will run. Conditionally available analyses show you exactly what additional inputs are needed. Out-of-scope analyses include a clear explanation and developer extension path.",
        required_inputs="All prior step decisions.",
        privacy_implications="Enabling fairness-by-group requires ethically and legally appropriate grouping metadata. Enabling sensitive exports requires privacy acknowledgement.",
        expected_outputs="A confirmed analysis selection that feeds into the output contract.",
        common_mistakes="Selecting all available analyses without considering runtime. Slow analyses (model explanations) significantly increase assessment time. Select only what you need.",
        developer_extension_path="Add new analyses by implementing the analysis function, registering it in src/affectlog/capabilities/analyses.py, and wiring it to a recipe stage.",
    ),
    7: StepHelp(
        step=7,
        title="Plot Selection",
        short_help="Choose which visualisations to generate for this assessment.",
        why_it_matters="Plots are generated as structured data payloads consumed by the dashboard. Selecting too many plots increases runtime and artifact size. Select only the plots relevant to your audience.",
        required_inputs="The analysis scope from Step 6.",
        privacy_implications="Pseudonymised plots (e.g., top entities bar) display only HMAC-hashed entity IDs. Restricted plots (fairness tables, PII heatmaps) require privacy acknowledgement.",
        expected_outputs="A list of plot specifications included in the output contract.",
        common_mistakes="Selecting ROC/PR curves without confirming probability output availability. These plots will fail silently if probabilities are not present.",
        developer_extension_path="Add new plot definitions in src/affectlog/capabilities/plots.py and implement the generator in src/affectlog/reports/.",
    ),
    8: StepHelp(
        step=8,
        title="Output Contract",
        short_help="Review and approve the precise scope of this assessment before execution.",
        why_it_matters="The output contract is a binding description of what this run will produce. It documents inputs, analyses, plots, privacy settings, limitations, and expected artifacts. It is included in the audit manifest.",
        required_inputs="All prior step decisions.",
        privacy_implications="The output contract records which privacy controls are active and which fields are pseudonymised or redacted.",
        expected_outputs="Your explicit approval triggers the assessment run.",
        common_mistakes="Not reading the Limitations section. AffectLog does not certify legal compliance, guarantee absence of bias, or replace qualified human review.",
        developer_extension_path="The output contract schema is defined in src/affectlog/wizard/output_contract.py.",
    ),
    9: StepHelp(
        step=9,
        title="Run Progress",
        short_help="Monitor the assessment pipeline as it runs.",
        why_it_matters="Pipeline stages can be long-running (especially SHAP explanations on large datasets). Warnings during execution indicate data quality issues, not failures — the run will complete with caveats noted in the manifest.",
        required_inputs="An approved output contract.",
        privacy_implications="No raw personal data is logged. Diagnostic logs are retained server-side with the request and tenant ID.",
        expected_outputs="A completed run directory with all contracted artifacts.",
        common_mistakes="Cancelling a run during a recoverable warning stage. Wait for the warning to resolve before cancelling.",
        developer_extension_path="Add new pipeline stages in src/affectlog/recipes/ and register them in a recipe YAML.",
    ),
    10: StepHelp(
        step=10,
        title="Results & Guidance",
        short_help="Review your assessment outputs and recommended next actions.",
        why_it_matters="Results guidance distinguishes between what was measured, what was not measured, and why. This prevents misinterpretation of partial assessments.",
        required_inputs="A completed run.",
        privacy_implications="Artifact downloads respect privacy controls. Raw identifier exports remain blocked unless explicitly unlocked.",
        expected_outputs="A completed assessment with downloadable artifacts and next-action recommendations.",
        common_mistakes="Treating a dataset-only assessment as equivalent to a model-aware assessment. The scope column clearly distinguishes these.",
        developer_extension_path="Extend the results guidance by adding remediation suggestions in src/affectlog/wizard/help.py.",
    ),
}

ANALYSIS_HELP: dict[str, AnalysisHelp] = {
    "coverage_at_k": AnalysisHelp(
        analysis_id="coverage_at_k",
        short_help="Coverage@K estimates how broadly resources appear across top-K interaction lists.",
        why_it_matters="High Coverage@K indicates that a wide variety of resources are engaged with. Low values indicate that only a small fraction of available content receives significant attention.",
        required_inputs="An entity/user field and an item/resource field. K is configurable (default 1–20).",
        privacy_implications="Coverage is computed at the aggregate level. No individual interaction data is exposed.",
        expected_outputs="coverage_at_k object in metrics.json with per-K coverage fractions.",
        common_mistakes="Interpreting Coverage@K as a quality metric. It measures breadth of exposure, not quality of content.",
        developer_extension_path="Coverage is implemented in src/affectlog/metrics/coverage.py. Extend with new K configurations via recipe parameters.",
    ),
    "gini_concentration": AnalysisHelp(
        analysis_id="gini_concentration",
        short_help="Gini measures inequality in event or resource contribution.",
        why_it_matters="High Gini values (close to 1) indicate that a small number of entities or items dominate the dataset. This is important for detecting popularity bias in recommender datasets.",
        required_inputs="An entity/user field. If applied to resources, an item/resource field.",
        privacy_implications="Gini is computed at the aggregate level and exposes no individual data.",
        expected_outputs="gini_coefficient value and lorenz_curve data in metrics.json.",
        common_mistakes="Confusing Gini with a quality or fairness metric. It measures distributional inequality, not fairness in the legal or ethical sense.",
        developer_extension_path="Gini is implemented in src/affectlog/metrics/concentration.py.",
    ),
    "xapi_compatibility_check": AnalysisHelp(
        analysis_id="xapi_compatibility_check",
        short_help="Scores how closely the dataset conforms to the xAPI specification.",
        why_it_matters="xAPI compatibility determines whether the dataset can be normalised into canonical xAPI format and compared with other xAPI-compatible datasets. Low scores indicate missing required fields.",
        required_inputs="Any dataset with activity/event records. Maskott CSV is pre-scored.",
        privacy_implications="None. The compatibility check analyses field presence and structure, not values.",
        expected_outputs="xapi_compatibility_score (0–1), missing_required_fields list, verb_coverage fraction.",
        common_mistakes="Assuming a high xAPI compatibility score means the data is privacy-safe. Compatibility is purely structural.",
        developer_extension_path="xAPI compatibility rules are in src/affectlog/transform/normalizer.py.",
    ),
    "maskott_csv_to_xapi_transform": AnalysisHelp(
        analysis_id="maskott_csv_to_xapi_transform",
        short_help="Transforms Maskott/Tactileo CSV into canonical xAPI JSONL using AffectLog's normalization pipeline.",
        why_it_matters="xAPI normalization makes platform-specific verbs and activity structures comparable across platforms, so downstream metrics are consistent and reproducible across different educational systems.",
        required_inputs="A maskott_csv_v1 format dataset.",
        privacy_implications="Identifier fields (EntityId, EntityUaiCode) are HMAC-pseudonymised during transformation. The original CSV is not modified.",
        expected_outputs="transformed.jsonl — a normalised xAPI JSONL file. transform_report.json — mapping and error statistics.",
        common_mistakes="Running the xAPI transform on a non-Maskott CSV. This will fail schema validation.",
        developer_extension_path="The transformer is in src/affectlog/transform/maskott_csv_to_xapi.py. Extend by adding new verb mappings to configs/mappings/.",
    ),
    "fairness_by_group": AnalysisHelp(
        analysis_id="fairness_by_group",
        short_help="Computes demographic parity, equalised odds, and predictive parity across user-defined groups.",
        why_it_matters="Fairness-by-group reveals whether a model's predictions are systematically biased against specific subgroups, which is required for EU AI Act high-risk system assessments.",
        required_inputs="A group/segment field (ethically and legally appropriate), a target field, and a prediction field. AffectLog does not infer sensitive attributes.",
        privacy_implications="The group field must be ethically appropriate and lawfully collected. AffectLog treats group fields as sensitive and restricts export of raw group-level data.",
        expected_outputs="Per-group precision, recall, F1, demographic parity difference, and equalised odds difference in metrics.json.",
        common_mistakes="Using a proxy field (e.g., institution code) as a group field without ethical and legal justification. AffectLog will warn but will not block this.",
        developer_extension_path="Fairness metrics are in src/affectlog/metrics/fairness.py. Add new fairness criteria by extending the FairnessMetric enum.",
    ),
    "model_feature_importance": AnalysisHelp(
        analysis_id="model_feature_importance",
        short_help="SHAP or permutation-based global feature importance for the registered model.",
        why_it_matters="Feature importance is the primary model explanation artifact for EU AI Act transparency requirements. It shows which input features most influence model predictions.",
        required_inputs="A compatible model artifact and a feature matrix matching the model's expected input schema.",
        privacy_implications="SHAP values are computed on a sample and reported as aggregate importance scores. No individual sample data is included in the output.",
        expected_outputs="feature_importance ranking in metrics.json, consumed by feature_importance_bar plot.",
        common_mistakes="Registering a model without its feature schema. This blocks SHAP computation because AffectLog cannot determine which features to attribute.",
        developer_extension_path="SHAP adapter is in src/affectlog/explanations/shap_adapter.py. Add support for new model architectures via the adapter interface.",
    ),
    "pii_scan": AnalysisHelp(
        analysis_id="pii_scan",
        short_help="Detects columns containing personally identifiable information using pattern matching and heuristics.",
        why_it_matters="PII detection is a prerequisite for GDPR compliance. Running an audit on a dataset with unknown PII fields creates legal and ethical risk.",
        required_inputs="Any dataset file.",
        privacy_implications="The PII scan reads field values to detect patterns (email, phone, name, ID). The scan result is stored in the privacy report, not the detected values themselves.",
        expected_outputs="pii_fields list, quasi_identifier_candidates, free_text_fields, and risk_level in privacy_report.json.",
        common_mistakes="Assuming PII scan covers all possible identifier types. Pattern-based PII detection has false negatives. Domain-specific identifiers (e.g., student ID formats) may require custom rules.",
        developer_extension_path="PII detection rules are in src/affectlog/privacy/pii_detector.py. Add custom patterns via the PII_PATTERNS registry.",
    ),
}


def get_step_help(step: int) -> StepHelp | None:
    return STEP_HELP.get(step)


def get_analysis_help(analysis_id: str) -> AnalysisHelp | None:
    return ANALYSIS_HELP.get(analysis_id)
