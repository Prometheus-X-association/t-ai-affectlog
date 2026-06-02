/**
 * Wizard contextual help content for all steps.
 */

export interface StepHelp {
  step: number;
  title: string;
  shortHelp: string;
  whyItMatters: string;
  requiredInputs: string;
  privacyImplications: string;
  expectedOutputs: string;
  commonMistakes: string;
  developerExtensionPath: string;
}

export interface AnalysisHelp {
  analysisId: string;
  shortHelp: string;
  whyItMatters: string;
  requiredInputs: string;
  privacyImplications: string;
  expectedOutputs: string;
  commonMistakes: string;
  developerExtensionPath: string;
}

export const STEP_HELP: Record<number, StepHelp> = {
  1: {
    step: 1,
    title: "Input Source",
    shortHelp: "Tell AffectLog what data you want to assess.",
    whyItMatters: "The input type determines which analyses are possible. Uploading the wrong file type or missing a prediction file will silently remove valid metrics from your plan.",
    requiredInputs: "At minimum, a dataset file (CSV, JSON, JSONL, or Parquet). Optionally: a model artifact, prediction CSV, or ground-truth CSV.",
    privacyImplications: "AffectLog does not transmit raw data externally. Files are stored in your tenant's secure storage. Raw personal data is never displayed by default.",
    expectedOutputs: "A file reference registered to your session, ready for format detection.",
    commonMistakes: "Uploading a raw model output CSV as the main dataset. Prediction CSVs should be uploaded separately.",
    developerExtensionPath: "Add new supported formats by implementing a reader in src/affectlog/ingest/ and registering the format in src/affectlog/capabilities/formats.py.",
  },
  2: {
    step: 2,
    title: "Format Detection",
    shortHelp: "AffectLog automatically identifies the input format and schema.",
    whyItMatters: "Format detection determines the pre-built analyses available. An incorrect detection will constrain or misdirect the analysis plan.",
    requiredInputs: "The uploaded or referenced file from Step 1.",
    privacyImplications: "Detection reads file headers and a sample of rows. No personal data is stored beyond the session.",
    expectedOutputs: "Detected format ID, confidence score, row count estimate, detected schema, and xAPI compatibility score.",
    commonMistakes: "Accepting an incorrect format detection without reviewing the field list. Always check that key fields (entity ID, timestamp, item ID) are detected correctly.",
    developerExtensionPath: "Add detection rules in src/affectlog/ingest/schema_infer.py and register the format in src/affectlog/capabilities/formats.py.",
  },
  3: {
    step: 3,
    title: "Schema Mapping",
    shortHelp: "Confirm or correct how dataset fields map to AffectLog concepts.",
    whyItMatters: "Incorrect field mappings silently invalidate downstream metrics. Mapping a session ID as the entity ID will produce meaningless concentration metrics.",
    requiredInputs: "The detected schema from Step 2. For Maskott CSV, all fields are pre-mapped.",
    privacyImplications: "Mapping a direct identifier field as entity ID will expose it in reports unless HMAC pseudonymisation is applied.",
    expectedOutputs: "Confirmed field mapping that unlocks the analysis plan in Step 6.",
    commonMistakes: "Skipping the group field mapping when planning fairness analysis. Fairness-by-group cannot run without an explicit group/segment field.",
    developerExtensionPath: "Add new semantic field types in src/affectlog/wizard/schemas.py FieldRole enum.",
  },
  4: {
    step: 4,
    title: "Privacy Review",
    shortHelp: "Review and confirm privacy controls before any analysis runs.",
    whyItMatters: "Privacy controls are enforced server-side. This step is your final opportunity to confirm that identifier fields will be pseudonymised and raw personal data will not appear in outputs.",
    requiredInputs: "The field inventory from Step 2 and field mappings from Step 3.",
    privacyImplications: "Raw identifier export is blocked by default. All privacy decisions are logged to the audit manifest.",
    expectedOutputs: "Privacy settings embedded in the output contract and enforced by the pipeline.",
    commonMistakes: "Assuming that uploading pseudonymised data means no further privacy controls are needed. AffectLog always re-evaluates privacy risk.",
    developerExtensionPath: "Extend pseudonymisation options in src/affectlog/privacy/pseudonymizer.py.",
  },
  5: {
    step: 5,
    title: "Model Context",
    shortHelp: "Register your model to enable explanation and performance analyses.",
    whyItMatters: "Model-aware analyses (SHAP, PDP, model card, comparison) are only available when a compatible model is registered.",
    requiredInputs: "A model artifact (.pkl, .onnx, .pt, .h5) or HTTP endpoint URL. Optionally: feature schema, class labels, probability output flag.",
    privacyImplications: "Feature schemas do not contain personal data. The model artifact is stored in your tenant's secure storage.",
    expectedOutputs: "A registered model ID, confirmed adapter type, and unlocked explanation analyses.",
    commonMistakes: "Registering a model without its feature schema — this blocks local explanation analyses.",
    developerExtensionPath: "Implement new model adapters in src/affectlog/models/ following the base adapter interface.",
  },
  6: {
    step: 6,
    title: "Analysis Scope",
    shortHelp: "Review exactly which analyses are available, conditionally available, and out of scope.",
    whyItMatters: "The scope matrix is your guarantee: only listed Available analyses will run. Conditionally available analyses show exactly what additional inputs are needed.",
    requiredInputs: "All prior step decisions.",
    privacyImplications: "Enabling fairness-by-group requires ethically and legally appropriate grouping metadata.",
    expectedOutputs: "A confirmed analysis selection that feeds into the output contract.",
    commonMistakes: "Selecting all available analyses without considering runtime. Slow analyses (model explanations) significantly increase assessment time.",
    developerExtensionPath: "Add new analyses by implementing the analysis function, registering it in src/affectlog/capabilities/analyses.py, and wiring it to a recipe stage.",
  },
  7: {
    step: 7,
    title: "Plot Selection",
    shortHelp: "Choose which visualisations to generate for this assessment.",
    whyItMatters: "Plots are generated as structured data payloads consumed by the dashboard. Select only the plots relevant to your audience.",
    requiredInputs: "The analysis scope from Step 6.",
    privacyImplications: "Restricted plots (fairness tables, PII heatmaps) require privacy acknowledgement.",
    expectedOutputs: "A list of plot specifications included in the output contract.",
    commonMistakes: "Selecting ROC/PR curves without confirming probability output availability.",
    developerExtensionPath: "Add new plot definitions in src/affectlog/capabilities/plots.py.",
  },
  8: {
    step: 8,
    title: "Output Contract",
    shortHelp: "Review and approve the precise scope of this assessment before execution.",
    whyItMatters: "The output contract documents inputs, analyses, plots, privacy settings, limitations, and expected artifacts. It is included in the audit manifest.",
    requiredInputs: "All prior step decisions.",
    privacyImplications: "The output contract records which privacy controls are active.",
    expectedOutputs: "Your explicit approval triggers the assessment run.",
    commonMistakes: "Not reading the Limitations section. AffectLog does not certify legal compliance or replace qualified human review.",
    developerExtensionPath: "The output contract schema is defined in src/affectlog/wizard/output_contract.py.",
  },
  9: {
    step: 9,
    title: "Run Progress",
    shortHelp: "Monitor the assessment pipeline as it runs.",
    whyItMatters: "Pipeline stages can be long-running. Warnings during execution indicate data quality issues, not failures.",
    requiredInputs: "An approved output contract.",
    privacyImplications: "No raw personal data is logged. Diagnostic logs are retained server-side.",
    expectedOutputs: "A completed run directory with all contracted artifacts.",
    commonMistakes: "Cancelling a run during a recoverable warning stage.",
    developerExtensionPath: "Add new pipeline stages in src/affectlog/recipes/ and register them in a recipe YAML.",
  },
  10: {
    step: 10,
    title: "Results & Guidance",
    shortHelp: "Review your assessment outputs and recommended next actions.",
    whyItMatters: "Results guidance distinguishes between what was measured, what was not measured, and why.",
    requiredInputs: "A completed run.",
    privacyImplications: "Artifact downloads respect privacy controls.",
    expectedOutputs: "A completed assessment with downloadable artifacts and next-action recommendations.",
    commonMistakes: "Treating a dataset-only assessment as equivalent to a model-aware assessment.",
    developerExtensionPath: "Extend results guidance by adding remediation suggestions in src/affectlog/wizard/help.py.",
  },
};

export const ANALYSIS_HELP: Record<string, AnalysisHelp> = {
  coverage_at_k: {
    analysisId: "coverage_at_k",
    shortHelp: "Coverage@K estimates how broadly resources appear across top-K interaction lists.",
    whyItMatters: "High Coverage@K indicates that a wide variety of resources are engaged with. Low values indicate that only a small fraction of content receives significant attention.",
    requiredInputs: "An entity/user field and an item/resource field. K is configurable (default 1–20).",
    privacyImplications: "Coverage is computed at the aggregate level. No individual interaction data is exposed.",
    expectedOutputs: "coverage_at_k object in metrics.json with per-K coverage fractions.",
    commonMistakes: "Interpreting Coverage@K as a quality metric. It measures breadth of exposure, not quality.",
    developerExtensionPath: "Coverage is implemented in src/affectlog/metrics/coverage.py.",
  },
  gini_concentration: {
    analysisId: "gini_concentration",
    shortHelp: "Gini measures inequality in event or resource contribution.",
    whyItMatters: "High Gini values (close to 1) indicate that a small number of entities or items dominate the dataset.",
    requiredInputs: "An entity/user field. If applied to resources, an item/resource field.",
    privacyImplications: "Gini is computed at the aggregate level and exposes no individual data.",
    expectedOutputs: "gini_coefficient value and lorenz_curve data in metrics.json.",
    commonMistakes: "Confusing Gini with a quality or fairness metric. It measures distributional inequality.",
    developerExtensionPath: "Gini is implemented in src/affectlog/metrics/concentration.py.",
  },
  fairness_by_group: {
    analysisId: "fairness_by_group",
    shortHelp: "Computes demographic parity, equalised odds, and predictive parity across user-defined groups.",
    whyItMatters: "Required for EU AI Act high-risk system assessments. Reveals systematic prediction bias against subgroups.",
    requiredInputs: "A group/segment field (ethically and legally appropriate), a target field, and a prediction field.",
    privacyImplications: "The group field must be ethically appropriate and lawfully collected. Export of raw group-level data is restricted.",
    expectedOutputs: "Per-group precision, recall, F1, demographic parity difference, and equalised odds difference.",
    commonMistakes: "Using a proxy field as a group field without ethical and legal justification.",
    developerExtensionPath: "Fairness metrics are in src/affectlog/metrics/fairness.py.",
  },
  model_feature_importance: {
    analysisId: "model_feature_importance",
    shortHelp: "SHAP or permutation-based global feature importance for the registered model.",
    whyItMatters: "The primary model explanation artifact for EU AI Act transparency requirements.",
    requiredInputs: "A compatible model artifact and a feature matrix matching the model's expected input schema.",
    privacyImplications: "SHAP values are computed on a sample and reported as aggregate importance scores.",
    expectedOutputs: "feature_importance ranking in metrics.json.",
    commonMistakes: "Registering a model without its feature schema — this blocks SHAP computation.",
    developerExtensionPath: "SHAP adapter is in src/affectlog/explanations/shap_adapter.py.",
  },
  pii_scan: {
    analysisId: "pii_scan",
    shortHelp: "Detects columns containing personally identifiable information.",
    whyItMatters: "A prerequisite for GDPR compliance. Running without PII detection creates legal and ethical risk.",
    requiredInputs: "Any dataset file.",
    privacyImplications: "The PII scan reads field values to detect patterns. Detected values are never stored — only the flag.",
    expectedOutputs: "pii_fields list, quasi_identifier_candidates, free_text_fields, and risk_level in privacy_report.json.",
    commonMistakes: "Assuming PII scan covers all possible identifier types. Pattern-based detection has false negatives.",
    developerExtensionPath: "PII detection rules are in src/affectlog/privacy/pii_detector.py.",
  },
  maskott_csv_to_xapi_transform: {
    analysisId: "maskott_csv_to_xapi_transform",
    shortHelp: "Transforms Maskott/Tactileo CSV into canonical xAPI JSONL.",
    whyItMatters: "xAPI normalization makes platform-specific verbs and activity structures comparable across platforms.",
    requiredInputs: "A maskott_csv_v1 format dataset.",
    privacyImplications: "Entity identifiers are HMAC-pseudonymised during transformation.",
    expectedOutputs: "transformed.jsonl — normalised xAPI JSONL. transform_report.json — mapping and error statistics.",
    commonMistakes: "Running the xAPI transform on a non-Maskott CSV.",
    developerExtensionPath: "The transformer is in src/affectlog/transform/maskott_csv_to_xapi.py.",
  },
};

export function getStepHelp(step: number): StepHelp | undefined {
  return STEP_HELP[step];
}

export function getAnalysisHelp(analysisId: string): AnalysisHelp | undefined {
  return ANALYSIS_HELP[analysisId];
}
