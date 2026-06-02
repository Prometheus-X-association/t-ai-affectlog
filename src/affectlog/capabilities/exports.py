"""Export artifact definitions."""

from __future__ import annotations

from enum import StrEnum

from pydantic import BaseModel, Field


class ExportFormat(StrEnum):
    JSON = "json"
    JSONL = "jsonl"
    CSV = "csv"
    MARKDOWN = "markdown"
    HTML = "html"
    JSONLD = "jsonld"


class ExportDefinition(BaseModel):
    id: str
    label: str
    description: str
    format: ExportFormat
    filename_template: str
    requires_analyses: list[str] = Field(default_factory=list)
    requires_model: bool = False
    privacy_sensitive: bool = False
    blocked_without_privacy_ack: bool = False
    notes: str = ""


EXPORTS: list[ExportDefinition] = [
    ExportDefinition(
        id="transformed_jsonl",
        label="Transformed xAPI JSONL",
        description="Normalised xAPI statements in newline-delimited JSON format, after platform-specific transformation.",
        format=ExportFormat.JSONL,
        filename_template="transformed.jsonl",
        requires_analyses=["maskott_csv_to_xapi_transform"],
    ),
    ExportDefinition(
        id="transformed_json",
        label="Transformed xAPI JSON",
        description="Normalised xAPI statements as a JSON array.",
        format=ExportFormat.JSON,
        filename_template="transformed.json",
        requires_analyses=["maskott_csv_to_xapi_transform"],
    ),
    ExportDefinition(
        id="metrics_json",
        label="Metrics JSON",
        description="All computed metrics in a structured JSON file.",
        format=ExportFormat.JSON,
        filename_template="metrics.json",
        requires_analyses=[],
    ),
    ExportDefinition(
        id="metrics_csv",
        label="Metrics CSV",
        description="Flat CSV export of key metric values for spreadsheet consumption.",
        format=ExportFormat.CSV,
        filename_template="metrics.csv",
        requires_analyses=[],
    ),
    ExportDefinition(
        id="dashboard_payload_json",
        label="Dashboard Payload JSON",
        description="Structured JSON payload consumed by the AffectLog dashboard visualisation layer.",
        format=ExportFormat.JSON,
        filename_template="dashboard_payload.json",
        requires_analyses=[],
    ),
    ExportDefinition(
        id="field_inventory_csv",
        label="Field Inventory CSV",
        description="CSV listing all fields, inferred types, cardinalities, missing rates, and PII flags.",
        format=ExportFormat.CSV,
        filename_template="field_inventory.csv",
        requires_analyses=["schema_validation", "pii_scan"],
        privacy_sensitive=True,
    ),
    ExportDefinition(
        id="privacy_report_json",
        label="Privacy Report JSON",
        description="Structured privacy risk report including PII flags, re-identification risk scores, and recommended actions.",
        format=ExportFormat.JSON,
        filename_template="privacy_report.json",
        requires_analyses=["pii_scan", "privacy_risk_profile"],
        privacy_sensitive=True,
        blocked_without_privacy_ack=True,
    ),
    ExportDefinition(
        id="data_card_json",
        label="Data Card JSON",
        description="Dataset documentation card (Google/Hugging Face format) summarising provenance, composition, and limitations.",
        format=ExportFormat.JSON,
        filename_template="data_card.json",
        requires_analyses=["data_card_export"],
    ),
    ExportDefinition(
        id="model_card_json",
        label="Model Card JSON",
        description="Model documentation card with intended use, performance, ethical considerations, and limitations.",
        format=ExportFormat.JSON,
        filename_template="model_card.json",
        requires_analyses=["model_card_export"],
        requires_model=True,
    ),
    ExportDefinition(
        id="compliance_graph_jsonld",
        label="Compliance Graph JSON-LD",
        description="Machine-readable audit evidence graph aligned with EU AI Act Annex IV and GDPR article documentation requirements.",
        format=ExportFormat.JSONLD,
        filename_template="compliance_graph.jsonld",
        requires_analyses=["jsonld_compliance_graph"],
    ),
    ExportDefinition(
        id="sop_markdown",
        label="SOP Markdown",
        description="Human-readable Standard Operating Procedure document describing the audit pipeline.",
        format=ExportFormat.MARKDOWN,
        filename_template="SOP.md",
        requires_analyses=["sop_export"],
    ),
    ExportDefinition(
        id="sop_html",
        label="SOP HTML",
        description="HTML-rendered version of the Standard Operating Procedure for browser display or archiving.",
        format=ExportFormat.HTML,
        filename_template="SOP.html",
        requires_analyses=["sop_export"],
    ),
    ExportDefinition(
        id="audit_manifest_json",
        label="Audit Manifest JSON",
        description="Signed manifest of all audit inputs, parameters, artifact hashes, and pipeline metadata.",
        format=ExportFormat.JSON,
        filename_template="audit_manifest.json",
        requires_analyses=["audit_manifest_export"],
    ),
    ExportDefinition(
        id="carisma_metadata_json",
        label="CARiSMA Metadata JSON",
        description="Audit metadata in CARiSMA format for Prometheus-X data space interoperability.",
        format=ExportFormat.JSON,
        filename_template="carisma_metadata.json",
        requires_analyses=["carisma_metadata_export"],
    ),
    ExportDefinition(
        id="lola_metadata_json",
        label="LOLA Metadata JSON",
        description="Dataset and audit metadata in LOLA format for learning object linkage.",
        format=ExportFormat.JSON,
        filename_template="lola_metadata.json",
        requires_analyses=["lola_metadata_export"],
    ),
    ExportDefinition(
        id="pdc_metadata_json",
        label="PDC Metadata JSON",
        description="Consent and policy metadata exported to the Personal Data Cooperative.",
        format=ExportFormat.JSON,
        filename_template="pdc_metadata.json",
        requires_analyses=["pdc_metadata_export"],
        privacy_sensitive=True,
        blocked_without_privacy_ack=True,
    ),
]

EXPORT_BY_ID: dict[str, ExportDefinition] = {e.id: e for e in EXPORTS}
EXPORT_IDS: set[str] = {e.id for e in EXPORTS}
