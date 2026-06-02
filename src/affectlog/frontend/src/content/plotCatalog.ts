/**
 * Plot catalog — all supported plots with required analyses, data, and privacy levels.
 * All IDs must match /v1/capabilities/plots.
 */

export type PlotPrivacyLevel = "public" | "pseudonymised" | "restricted";

export interface PlotCatalogEntry {
  id: string;
  label: string;
  purpose: string;
  requiredAnalyses: string[];
  requiredFields: string[];
  producedArtifact: string;
  privacyLevel: PlotPrivacyLevel;
  limitations: string;
  compatibleFormats: string[];
  requiresModel: boolean;
  requiresPredictions: boolean;
  requiresGroundTruth: boolean;
  requiresGroupField: boolean;
  requiresProbabilityOutput: boolean;
  unavailableMessage: string;
}

const ALL = ["maskott_csv_v1", "becomino_json", "generic_xapi_json", "generic_xapi_jsonl", "generic_csv_tabular", "parquet_tabular"];
const XAPI = ["maskott_csv_v1", "becomino_json", "generic_xapi_json", "generic_xapi_jsonl"];
const TAB = ["generic_csv_tabular", "parquet_tabular"];

export const PLOT_CATALOG: PlotCatalogEntry[] = [
  { id: "schema_overview_table", label: "Schema Overview Table", purpose: "Displays field names, inferred types, cardinalities, and missing rates.", requiredAnalyses: ["schema_validation", "type_profile"], requiredFields: [], producedArtifact: "dashboard_payload.json", privacyLevel: "public", limitations: "Field names are shown.", compatibleFormats: ALL, requiresModel: false, requiresPredictions: false, requiresGroundTruth: false, requiresGroupField: false, requiresProbabilityOutput: false, unavailableMessage: "" },
  { id: "missingness_matrix", label: "Missingness Matrix", purpose: "Visual heatmap showing which fields and rows have missing values.", requiredAnalyses: ["missingness_profile"], requiredFields: [], producedArtifact: "dashboard_payload.json", privacyLevel: "public", limitations: "", compatibleFormats: ALL, requiresModel: false, requiresPredictions: false, requiresGroundTruth: false, requiresGroupField: false, requiresProbabilityOutput: false, unavailableMessage: "" },
  { id: "completeness_bar", label: "Completeness Bar Chart", purpose: "Per-field completeness as a percentage bar chart.", requiredAnalyses: ["completeness_profile"], requiredFields: [], producedArtifact: "dashboard_payload.json", privacyLevel: "public", limitations: "", compatibleFormats: ALL, requiresModel: false, requiresPredictions: false, requiresGroundTruth: false, requiresGroupField: false, requiresProbabilityOutput: false, unavailableMessage: "" },
  { id: "type_distribution_bar", label: "Field Type Distribution", purpose: "Bar chart of inferred field types.", requiredAnalyses: ["type_profile"], requiredFields: [], producedArtifact: "dashboard_payload.json", privacyLevel: "public", limitations: "", compatibleFormats: ALL, requiresModel: false, requiresPredictions: false, requiresGroundTruth: false, requiresGroupField: false, requiresProbabilityOutput: false, unavailableMessage: "" },
  { id: "entropy_bar", label: "Entropy Bar Chart", purpose: "Shannon entropy per categorical field.", requiredAnalyses: ["entropy_profile"], requiredFields: [], producedArtifact: "dashboard_payload.json", privacyLevel: "public", limitations: "", compatibleFormats: ALL, requiresModel: false, requiresPredictions: false, requiresGroundTruth: false, requiresGroupField: false, requiresProbabilityOutput: false, unavailableMessage: "" },
  { id: "pii_field_heatmap", label: "PII Field Heatmap", purpose: "Heatmap showing which fields are flagged as PII or quasi-identifiers.", requiredAnalyses: ["pii_scan"], requiredFields: [], producedArtifact: "privacy_report.json", privacyLevel: "restricted", limitations: "Displayed as a summary. Raw field values never shown.", compatibleFormats: ALL, requiresModel: false, requiresPredictions: false, requiresGroundTruth: false, requiresGroupField: false, requiresProbabilityOutput: false, unavailableMessage: "" },
  { id: "verb_distribution_bar", label: "Verb / ViewContext Distribution", purpose: "Bar chart of the frequency of each activity verb.", requiredAnalyses: ["verb_distribution"], requiredFields: [], producedArtifact: "dashboard_payload.json", privacyLevel: "public", limitations: "", compatibleFormats: XAPI, requiresModel: false, requiresPredictions: false, requiresGroundTruth: false, requiresGroupField: false, requiresProbabilityOutput: false, unavailableMessage: "" },
  { id: "event_frequency_timeline", label: "Event Frequency Timeline", purpose: "Time-series of event counts per day/week.", requiredAnalyses: ["event_frequency_profile", "temporal_density_profile"], requiredFields: ["timestamp_field"], producedArtifact: "dashboard_payload.json", privacyLevel: "public", limitations: "Requires timestamp field.", compatibleFormats: [...XAPI, ...TAB], requiresModel: false, requiresPredictions: false, requiresGroundTruth: false, requiresGroupField: false, requiresProbabilityOutput: false, unavailableMessage: "Event frequency timeline requires a timestamp field." },
  { id: "temporal_density_histogram", label: "Temporal Density Histogram", purpose: "Distribution of events across time bins.", requiredAnalyses: ["temporal_density_profile"], requiredFields: ["timestamp_field"], producedArtifact: "dashboard_payload.json", privacyLevel: "public", limitations: "", compatibleFormats: [...XAPI, ...TAB], requiresModel: false, requiresPredictions: false, requiresGroundTruth: false, requiresGroupField: false, requiresProbabilityOutput: false, unavailableMessage: "Temporal density histogram requires a timestamp field." },
  { id: "session_density_histogram", label: "Session Density Histogram", purpose: "Distribution of session lengths and events-per-session.", requiredAnalyses: ["session_density_profile"], requiredFields: ["session_field"], producedArtifact: "dashboard_payload.json", privacyLevel: "public", limitations: "", compatibleFormats: [...XAPI, ...TAB], requiresModel: false, requiresPredictions: false, requiresGroundTruth: false, requiresGroupField: false, requiresProbabilityOutput: false, unavailableMessage: "Session density histogram requires session and timestamp fields." },
  { id: "resource_type_bar", label: "Resource Type Distribution", purpose: "Bar chart of interaction counts per ResourceType.", requiredAnalyses: ["resource_type_distribution"], requiredFields: ["item_field"], producedArtifact: "dashboard_payload.json", privacyLevel: "public", limitations: "", compatibleFormats: ALL, requiresModel: false, requiresPredictions: false, requiresGroundTruth: false, requiresGroupField: false, requiresProbabilityOutput: false, unavailableMessage: "" },
  { id: "top_resources_bar", label: "Top Resources Bar Chart", purpose: "Top 20 most-interacted resources by total interaction count.", requiredAnalyses: ["resource_dominance"], requiredFields: ["item_field"], producedArtifact: "dashboard_payload.json", privacyLevel: "public", limitations: "Resource IDs shown — confirm they do not constitute PII.", compatibleFormats: ALL, requiresModel: false, requiresPredictions: false, requiresGroundTruth: false, requiresGroupField: false, requiresProbabilityOutput: false, unavailableMessage: "" },
  { id: "top_entities_bar_pseudonymised", label: "Top Entities (Pseudonymised)", purpose: "Top 20 most-active entities — entity IDs are HMAC-pseudonymised.", requiredAnalyses: ["entity_dominance", "pseudonymisation_benchmark"], requiredFields: ["entity_field"], producedArtifact: "dashboard_payload.json", privacyLevel: "pseudonymised", limitations: "Entity IDs are HMAC-hashed and never shown in raw form.", compatibleFormats: ALL, requiresModel: false, requiresPredictions: false, requiresGroundTruth: false, requiresGroupField: false, requiresProbabilityOutput: false, unavailableMessage: "" },
  { id: "long_tail_curve", label: "Long-Tail Curve", purpose: "Ranks resources by interaction count and plots cumulative fraction.", requiredAnalyses: ["long_tail_profile"], requiredFields: ["item_field"], producedArtifact: "dashboard_payload.json", privacyLevel: "public", limitations: "", compatibleFormats: ALL, requiresModel: false, requiresPredictions: false, requiresGroundTruth: false, requiresGroupField: false, requiresProbabilityOutput: false, unavailableMessage: "" },
  { id: "lorenz_curve", label: "Lorenz Curve", purpose: "Cumulative share of interactions vs cumulative share of entities.", requiredAnalyses: ["gini_concentration"], requiredFields: ["entity_field"], producedArtifact: "dashboard_payload.json", privacyLevel: "public", limitations: "", compatibleFormats: ALL, requiresModel: false, requiresPredictions: false, requiresGroundTruth: false, requiresGroupField: false, requiresProbabilityOutput: false, unavailableMessage: "" },
  { id: "gini_summary_card", label: "Gini Summary Card", purpose: "Displays the Gini coefficient value with interpretation.", requiredAnalyses: ["gini_concentration"], requiredFields: [], producedArtifact: "dashboard_payload.json", privacyLevel: "public", limitations: "", compatibleFormats: ALL, requiresModel: false, requiresPredictions: false, requiresGroundTruth: false, requiresGroupField: false, requiresProbabilityOutput: false, unavailableMessage: "" },
  { id: "coverage_at_k_curve", label: "Coverage@K Curve", purpose: "Plots Coverage@K for K = 1 to 20.", requiredAnalyses: ["coverage_at_k"], requiredFields: ["entity_field", "item_field"], producedArtifact: "dashboard_payload.json", privacyLevel: "public", limitations: "", compatibleFormats: ALL, requiresModel: false, requiresPredictions: false, requiresGroundTruth: false, requiresGroupField: false, requiresProbabilityOutput: false, unavailableMessage: "" },
  { id: "sparsity_heatmap_sample", label: "Interaction Sparsity Heatmap (Sample)", purpose: "Sampled user-item interaction matrix heatmap.", requiredAnalyses: ["sparsity_analysis"], requiredFields: ["entity_field", "item_field"], producedArtifact: "dashboard_payload.json", privacyLevel: "pseudonymised", limitations: "Sample of up to 50 entities and 50 resources. Entity IDs pseudonymised.", compatibleFormats: ALL, requiresModel: false, requiresPredictions: false, requiresGroundTruth: false, requiresGroupField: false, requiresProbabilityOutput: false, unavailableMessage: "" },
  { id: "cooccurrence_network", label: "Co-occurrence Network", purpose: "Graph of resource/verb co-occurrences within sessions.", requiredAnalyses: ["cooccurrence_summary"], requiredFields: ["entity_field", "item_field"], producedArtifact: "dashboard_payload.json", privacyLevel: "public", limitations: "Edges are aggregate co-occurrence counts, never individual sessions.", compatibleFormats: XAPI, requiresModel: false, requiresPredictions: false, requiresGroundTruth: false, requiresGroupField: false, requiresProbabilityOutput: false, unavailableMessage: "" },
  { id: "representation_index_bar", label: "Representation Index Bar", purpose: "Bar chart of the composite representation score.", requiredAnalyses: ["representation_index"], requiredFields: [], producedArtifact: "dashboard_payload.json", privacyLevel: "public", limitations: "", compatibleFormats: ALL, requiresModel: false, requiresPredictions: false, requiresGroundTruth: false, requiresGroupField: false, requiresProbabilityOutput: false, unavailableMessage: "" },
  { id: "group_distribution_bar", label: "Group Distribution Bar", purpose: "Event/sample count per group/segment.", requiredAnalyses: ["fairness_by_group"], requiredFields: ["group_field"], producedArtifact: "dashboard_payload.json", privacyLevel: "restricted", limitations: "", compatibleFormats: TAB, requiresModel: false, requiresPredictions: false, requiresGroundTruth: false, requiresGroupField: true, requiresProbabilityOutput: false, unavailableMessage: "Group distribution requires a group field." },
  { id: "fairness_metric_table", label: "Fairness Metric Table", purpose: "Per-group precision, recall, and parity gap values.", requiredAnalyses: ["fairness_by_group"], requiredFields: ["group_field", "target_field", "prediction_field"], producedArtifact: "dashboard_payload.json", privacyLevel: "restricted", limitations: "", compatibleFormats: TAB, requiresModel: false, requiresPredictions: true, requiresGroundTruth: true, requiresGroupField: true, requiresProbabilityOutput: false, unavailableMessage: "Fairness table requires group field, target, and predictions." },
  { id: "confusion_matrix", label: "Confusion Matrix", purpose: "Matrix of true/false positive/negative counts per class.", requiredAnalyses: ["classification_performance"], requiredFields: ["target_field", "prediction_field"], producedArtifact: "dashboard_payload.json", privacyLevel: "public", limitations: "", compatibleFormats: TAB, requiresModel: false, requiresPredictions: true, requiresGroundTruth: true, requiresGroupField: false, requiresProbabilityOutput: false, unavailableMessage: "Confusion matrix requires target and prediction class labels." },
  { id: "roc_curve", label: "ROC Curve", purpose: "Receiver Operating Characteristic curve.", requiredAnalyses: ["classification_performance"], requiredFields: ["target_field", "prediction_field"], producedArtifact: "dashboard_payload.json", privacyLevel: "public", limitations: "", compatibleFormats: TAB, requiresModel: false, requiresPredictions: true, requiresGroundTruth: true, requiresGroupField: false, requiresProbabilityOutput: true, unavailableMessage: "ROC curve requires probability outputs from the classifier." },
  { id: "pr_curve", label: "Precision-Recall Curve", purpose: "Precision-recall curve for imbalanced classification.", requiredAnalyses: ["classification_performance"], requiredFields: ["target_field", "prediction_field"], producedArtifact: "dashboard_payload.json", privacyLevel: "public", limitations: "", compatibleFormats: TAB, requiresModel: false, requiresPredictions: true, requiresGroundTruth: true, requiresGroupField: false, requiresProbabilityOutput: true, unavailableMessage: "PR curve requires probability outputs from the classifier." },
  { id: "calibration_curve", label: "Calibration Curve", purpose: "Predicted probability vs observed frequency.", requiredAnalyses: ["classification_performance"], requiredFields: [], producedArtifact: "dashboard_payload.json", privacyLevel: "public", limitations: "", compatibleFormats: TAB, requiresModel: false, requiresPredictions: true, requiresGroundTruth: true, requiresGroupField: false, requiresProbabilityOutput: true, unavailableMessage: "Calibration curve requires probability outputs." },
  { id: "residual_plot", label: "Residual Plot", purpose: "Residuals vs predicted values.", requiredAnalyses: ["regression_performance", "model_residual_diagnostics"], requiredFields: [], producedArtifact: "dashboard_payload.json", privacyLevel: "public", limitations: "", compatibleFormats: TAB, requiresModel: false, requiresPredictions: true, requiresGroundTruth: true, requiresGroupField: false, requiresProbabilityOutput: false, unavailableMessage: "Residual plot requires numeric target and prediction fields." },
  { id: "prediction_error_histogram", label: "Prediction Error Histogram", purpose: "Distribution of |prediction − ground_truth| errors.", requiredAnalyses: ["regression_performance"], requiredFields: [], producedArtifact: "dashboard_payload.json", privacyLevel: "public", limitations: "", compatibleFormats: TAB, requiresModel: false, requiresPredictions: true, requiresGroundTruth: true, requiresGroupField: false, requiresProbabilityOutput: false, unavailableMessage: "" },
  { id: "feature_importance_bar", label: "Feature Importance Bar Chart", purpose: "Global SHAP or permutation feature importance.", requiredAnalyses: ["model_feature_importance"], requiredFields: [], producedArtifact: "dashboard_payload.json", privacyLevel: "public", limitations: "", compatibleFormats: TAB, requiresModel: true, requiresPredictions: false, requiresGroundTruth: false, requiresGroupField: false, requiresProbabilityOutput: false, unavailableMessage: "Feature importance requires a compatible model and feature schema." },
  { id: "local_explanation_waterfall", label: "Local Explanation Waterfall", purpose: "SHAP waterfall plot for a single prediction.", requiredAnalyses: ["model_prediction_explanation"], requiredFields: [], producedArtifact: "dashboard_payload.json", privacyLevel: "pseudonymised", limitations: "Uses a representative sample row. Row identity is pseudonymised.", compatibleFormats: TAB, requiresModel: true, requiresPredictions: false, requiresGroundTruth: false, requiresGroupField: false, requiresProbabilityOutput: false, unavailableMessage: "Local explanation requires a compatible model and feature schema." },
  { id: "partial_dependence_plot", label: "Partial Dependence Plot", purpose: "Marginal effect of top features on model output.", requiredAnalyses: ["model_partial_dependence"], requiredFields: [], producedArtifact: "dashboard_payload.json", privacyLevel: "public", limitations: "", compatibleFormats: TAB, requiresModel: true, requiresPredictions: false, requiresGroundTruth: false, requiresGroupField: false, requiresProbabilityOutput: false, unavailableMessage: "Partial dependence requires a compatible model adapter." },
  { id: "model_comparison_radar", label: "Model Comparison Radar", purpose: "Radar chart comparing metrics across two models.", requiredAnalyses: ["model_comparison"], requiredFields: [], producedArtifact: "dashboard_payload.json", privacyLevel: "public", limitations: "", compatibleFormats: TAB, requiresModel: true, requiresPredictions: false, requiresGroundTruth: false, requiresGroupField: false, requiresProbabilityOutput: false, unavailableMessage: "Model comparison radar requires two compatible model artifacts." },
  { id: "jsonld_graph_preview", label: "JSON-LD Compliance Graph Preview", purpose: "Interactive visualisation of the audit evidence graph.", requiredAnalyses: ["jsonld_compliance_graph"], requiredFields: [], producedArtifact: "compliance_graph.jsonld", privacyLevel: "public", limitations: "", compatibleFormats: ALL, requiresModel: false, requiresPredictions: false, requiresGroundTruth: false, requiresGroupField: false, requiresProbabilityOutput: false, unavailableMessage: "" },
  { id: "audit_pipeline_timeline", label: "Audit Pipeline Timeline", purpose: "Step-by-step visual timeline of audit pipeline stages.", requiredAnalyses: ["audit_manifest_export"], requiredFields: [], producedArtifact: "audit_manifest.json", privacyLevel: "public", limitations: "", compatibleFormats: ALL, requiresModel: false, requiresPredictions: false, requiresGroundTruth: false, requiresGroupField: false, requiresProbabilityOutput: false, unavailableMessage: "" },
  { id: "artifact_stack_view", label: "Artifact Stack View", purpose: "Summary card list of all produced artifacts.", requiredAnalyses: [], requiredFields: [], producedArtifact: "audit_manifest.json", privacyLevel: "public", limitations: "", compatibleFormats: ALL, requiresModel: false, requiresPredictions: false, requiresGroundTruth: false, requiresGroupField: false, requiresProbabilityOutput: false, unavailableMessage: "" },
];

export const PLOT_BY_ID = Object.fromEntries(PLOT_CATALOG.map((p) => [p.id, p]));

export function getPlotById(id: string): PlotCatalogEntry | undefined {
  return PLOT_BY_ID[id];
}

export function getDefaultPlotsForFormat(formatId: string): string[] {
  const defaults: Record<string, string[]> = {
    maskott_csv_v1: [
      "schema_overview_table", "pii_field_heatmap", "verb_distribution_bar",
      "temporal_density_histogram", "session_density_histogram", "resource_type_bar",
      "top_resources_bar", "top_entities_bar_pseudonymised", "long_tail_curve",
      "lorenz_curve", "coverage_at_k_curve", "sparsity_heatmap_sample",
      "audit_pipeline_timeline", "jsonld_graph_preview",
    ],
    becomino_json: [
      "schema_overview_table", "verb_distribution_bar", "event_frequency_timeline",
      "cooccurrence_network", "resource_type_bar", "audit_pipeline_timeline",
      "jsonld_graph_preview",
    ],
    generic_xapi_json: [
      "schema_overview_table", "pii_field_heatmap", "verb_distribution_bar",
      "temporal_density_histogram", "resource_type_bar", "audit_pipeline_timeline",
    ],
    generic_xapi_jsonl: [
      "schema_overview_table", "pii_field_heatmap", "verb_distribution_bar",
      "temporal_density_histogram", "resource_type_bar", "audit_pipeline_timeline",
    ],
    generic_csv_tabular: [
      "schema_overview_table", "missingness_matrix", "completeness_bar",
      "type_distribution_bar", "pii_field_heatmap", "entropy_bar",
    ],
    parquet_tabular: [
      "schema_overview_table", "missingness_matrix", "completeness_bar",
      "type_distribution_bar", "pii_field_heatmap", "entropy_bar",
    ],
  };
  return defaults[formatId] ?? ["schema_overview_table", "audit_pipeline_timeline"];
}
