/**
 * Output artifact catalog — all expected output files with format, description, and privacy level.
 */

export type ExportFormat = "json" | "jsonl" | "csv" | "markdown" | "html" | "jsonld";

export interface OutputArtifact {
  id: string;
  label: string;
  description: string;
  format: ExportFormat;
  filenameTemplate: string;
  requiresAnalyses: string[];
  requiresModel: boolean;
  privacySensitive: boolean;
  blockedWithoutPrivacyAck: boolean;
  notes: string;
}

export const OUTPUT_CATALOG: OutputArtifact[] = [
  { id: "transformed_jsonl", label: "Transformed xAPI JSONL", description: "Normalised xAPI statements in JSONL format.", format: "jsonl", filenameTemplate: "transformed.jsonl", requiresAnalyses: ["maskott_csv_to_xapi_transform"], requiresModel: false, privacySensitive: false, blockedWithoutPrivacyAck: false, notes: "" },
  { id: "transformed_json", label: "Transformed xAPI JSON", description: "Normalised xAPI statements as a JSON array.", format: "json", filenameTemplate: "transformed.json", requiresAnalyses: ["maskott_csv_to_xapi_transform"], requiresModel: false, privacySensitive: false, blockedWithoutPrivacyAck: false, notes: "" },
  { id: "metrics_json", label: "Metrics JSON", description: "All computed metrics in a structured JSON file.", format: "json", filenameTemplate: "metrics.json", requiresAnalyses: [], requiresModel: false, privacySensitive: false, blockedWithoutPrivacyAck: false, notes: "" },
  { id: "metrics_csv", label: "Metrics CSV", description: "Flat CSV export of key metric values.", format: "csv", filenameTemplate: "metrics.csv", requiresAnalyses: [], requiresModel: false, privacySensitive: false, blockedWithoutPrivacyAck: false, notes: "" },
  { id: "dashboard_payload_json", label: "Dashboard Payload JSON", description: "Structured JSON consumed by the AffectLog dashboard.", format: "json", filenameTemplate: "dashboard_payload.json", requiresAnalyses: [], requiresModel: false, privacySensitive: false, blockedWithoutPrivacyAck: false, notes: "" },
  { id: "field_inventory_csv", label: "Field Inventory CSV", description: "CSV listing all fields, types, cardinalities, missing rates, and PII flags.", format: "csv", filenameTemplate: "field_inventory.csv", requiresAnalyses: ["schema_validation", "pii_scan"], requiresModel: false, privacySensitive: true, blockedWithoutPrivacyAck: false, notes: "" },
  { id: "privacy_report_json", label: "Privacy Report JSON", description: "Structured privacy risk report.", format: "json", filenameTemplate: "privacy_report.json", requiresAnalyses: ["pii_scan", "privacy_risk_profile"], requiresModel: false, privacySensitive: true, blockedWithoutPrivacyAck: true, notes: "" },
  { id: "data_card_json", label: "Data Card JSON", description: "Dataset documentation card (Google/Hugging Face format).", format: "json", filenameTemplate: "data_card.json", requiresAnalyses: ["data_card_export"], requiresModel: false, privacySensitive: false, blockedWithoutPrivacyAck: false, notes: "" },
  { id: "model_card_json", label: "Model Card JSON", description: "Model documentation card with intended use and limitations.", format: "json", filenameTemplate: "model_card.json", requiresAnalyses: ["model_card_export"], requiresModel: true, privacySensitive: false, blockedWithoutPrivacyAck: false, notes: "" },
  { id: "compliance_graph_jsonld", label: "Compliance Graph JSON-LD", description: "Machine-readable audit evidence graph aligned with EU AI Act Annex IV.", format: "jsonld", filenameTemplate: "compliance_graph.jsonld", requiresAnalyses: ["jsonld_compliance_graph"], requiresModel: false, privacySensitive: false, blockedWithoutPrivacyAck: false, notes: "" },
  { id: "sop_markdown", label: "SOP Markdown", description: "Human-readable Standard Operating Procedure document.", format: "markdown", filenameTemplate: "SOP.md", requiresAnalyses: ["sop_export"], requiresModel: false, privacySensitive: false, blockedWithoutPrivacyAck: false, notes: "" },
  { id: "sop_html", label: "SOP HTML", description: "HTML-rendered SOP for browser display or archiving.", format: "html", filenameTemplate: "SOP.html", requiresAnalyses: ["sop_export"], requiresModel: false, privacySensitive: false, blockedWithoutPrivacyAck: false, notes: "" },
  { id: "audit_manifest_json", label: "Audit Manifest JSON", description: "Signed manifest of all audit inputs, parameters, and artifact hashes.", format: "json", filenameTemplate: "audit_manifest.json", requiresAnalyses: ["audit_manifest_export"], requiresModel: false, privacySensitive: false, blockedWithoutPrivacyAck: false, notes: "" },
  { id: "carisma_metadata_json", label: "Interoperability Metadata JSON", description: "Audit metadata in Prometheus-X BB04 interoperability format.", format: "json", filenameTemplate: "interop_metadata.json", requiresAnalyses: ["carisma_metadata_export"], requiresModel: false, privacySensitive: false, blockedWithoutPrivacyAck: false, notes: "" },
  { id: "lola_metadata_json", label: "Evaluation Scenario Metadata JSON", description: "Dataset metadata in standardised evaluation scenario format.", format: "json", filenameTemplate: "eval_metadata.json", requiresAnalyses: ["lola_metadata_export"], requiresModel: false, privacySensitive: false, blockedWithoutPrivacyAck: false, notes: "" },
  { id: "pdc_metadata_json", label: "PDC Metadata JSON", description: "Consent and policy metadata for the Personal Data Cooperative.", format: "json", filenameTemplate: "pdc_metadata.json", requiresAnalyses: ["pdc_metadata_export"], requiresModel: false, privacySensitive: true, blockedWithoutPrivacyAck: true, notes: "" },
];

export const OUTPUT_BY_ID = Object.fromEntries(OUTPUT_CATALOG.map((o) => [o.id, o]));

export const LIMITATIONS = [
  "AffectLog does not issue legal compliance certifications.",
  "AffectLog does not guarantee the absence of bias — it measures and documents it.",
  "Raw personal data is not exported by default.",
  "Outputs depend on data quality and the accuracy of field mappings.",
  "Interpretation of results requires qualified human review.",
  "Model explanations are approximations — SHAP values are not causal.",
  "Statistical samples are used for large datasets; exact counts may differ.",
  "Legal compliance certification is outside scope; AffectLog generates structured evidence and audit metadata, not legal certification.",
];
