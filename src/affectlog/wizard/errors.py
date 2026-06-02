"""Typed wizard errors with user-facing remediation and diagnostic context."""

from __future__ import annotations

from enum import StrEnum
from typing import Any

from pydantic import BaseModel


class WizardErrorCode(StrEnum):
    UNSUPPORTED_FORMAT = "UNSUPPORTED_FORMAT"
    MISSING_REQUIRED_FIELD = "MISSING_REQUIRED_FIELD"
    AMBIGUOUS_SCHEMA = "AMBIGUOUS_SCHEMA"
    INVALID_FIELD_MAPPING = "INVALID_FIELD_MAPPING"
    PRIVACY_RISK_BLOCKED = "PRIVACY_RISK_BLOCKED"
    UNSUPPORTED_MODEL_ADAPTER = "UNSUPPORTED_MODEL_ADAPTER"
    MISSING_MODEL = "MISSING_MODEL"
    MISSING_PREDICTION = "MISSING_PREDICTION"
    MISSING_GROUND_TRUTH = "MISSING_GROUND_TRUTH"
    MISSING_GROUP_FIELD = "MISSING_GROUP_FIELD"
    TASK_TYPE_MISMATCH = "TASK_TYPE_MISMATCH"
    QUOTA_EXCEEDED = "QUOTA_EXCEEDED"
    FILE_TOO_LARGE = "FILE_TOO_LARGE"
    INVALID_RECIPE = "INVALID_RECIPE"
    PLOT_UNAVAILABLE = "PLOT_UNAVAILABLE"
    ANALYSIS_UNAVAILABLE = "ANALYSIS_UNAVAILABLE"
    EXPORT_BLOCKED = "EXPORT_BLOCKED"
    TENANT_PERMISSION_DENIED = "TENANT_PERMISSION_DENIED"
    CROSS_TENANT_ACCESS_DENIED = "CROSS_TENANT_ACCESS_DENIED"
    JOB_EXECUTION_ERROR = "JOB_EXECUTION_ERROR"
    RECOVERABLE_STAGE_ERROR = "RECOVERABLE_STAGE_ERROR"


class WizardError(BaseModel):
    code: WizardErrorCode
    title: str
    what_happened: str
    why_it_matters: str
    how_to_fix: str
    affected_step: int | None = None
    recoverable: bool = False
    analysis_id: str | None = None
    plot_id: str | None = None
    field_name: str | None = None
    support_reference_id: str | None = None


ERROR_CATALOG: dict[WizardErrorCode, dict[str, Any]] = {
    WizardErrorCode.UNSUPPORTED_FORMAT: {
        "title": "Unsupported input format",
        "what_happened": "The uploaded file uses a format that is not supported by AffectLog.",
        "why_it_matters": "AffectLog can only analyse structured/tabular datasets, xAPI-style educational traces, and compatible model artifacts.",
        "how_to_fix": "Convert the input to a supported format (CSV, JSON, JSONL, Parquet) or implement a compatible adapter. See docs/analysis-scope-and-guardrails.md.",
        "recoverable": False,
        "affected_step": 2,
    },
    WizardErrorCode.MISSING_REQUIRED_FIELD: {
        "title": "Required field not mapped",
        "what_happened": "A field required by the selected analysis is missing from the schema mapping.",
        "why_it_matters": "Without this field, the analysis cannot run and will produce no output.",
        "how_to_fix": "Return to Step 3 and map the required field, or deselect the analysis in Step 6.",
        "recoverable": True,
        "affected_step": 3,
    },
    WizardErrorCode.AMBIGUOUS_SCHEMA: {
        "title": "Schema ambiguous — confirmation required",
        "what_happened": "The format detector identified multiple possible schema interpretations.",
        "why_it_matters": "Running with the wrong schema interpretation will produce incorrect metrics.",
        "how_to_fix": "Return to Step 2 and select the correct format, or confirm the detected schema in Step 3.",
        "recoverable": True,
        "affected_step": 2,
    },
    WizardErrorCode.INVALID_FIELD_MAPPING: {
        "title": "Invalid field mapping",
        "what_happened": "The mapped field does not match the expected type or role for the selected analysis.",
        "why_it_matters": "Mapping the wrong field type (e.g., a numeric ID as a timestamp) will produce nonsensical results.",
        "how_to_fix": "Return to Step 3 and correct the field mapping.",
        "recoverable": True,
        "affected_step": 3,
    },
    WizardErrorCode.PRIVACY_RISK_BLOCKED: {
        "title": "Privacy risk blocks export",
        "what_happened": "A sensitive export was requested without the required privacy acknowledgement.",
        "why_it_matters": "Exporting data containing personal identifiers without explicit acknowledgement violates AffectLog's privacy controls.",
        "how_to_fix": "Return to Step 4 and confirm the privacy acknowledgement, or remove the sensitive export from your plan.",
        "recoverable": True,
        "affected_step": 4,
    },
    WizardErrorCode.UNSUPPORTED_MODEL_ADAPTER: {
        "title": "Model adapter not supported",
        "what_happened": "The uploaded model file type does not match any supported model adapter.",
        "why_it_matters": "Without a compatible adapter, AffectLog cannot load, predict, or explain the model.",
        "how_to_fix": "Upload a model in a supported format (sklearn .pkl, ONNX, PyTorch .pt, Keras .h5) or register an HTTP endpoint.",
        "recoverable": False,
        "affected_step": 5,
    },
    WizardErrorCode.MISSING_MODEL: {
        "title": "Model artifact required",
        "what_happened": "A model-aware analysis was selected but no model artifact or endpoint was provided.",
        "why_it_matters": "Model explanations, feature importance, and model cards cannot be produced without a registered model.",
        "how_to_fix": "Return to Step 1 and upload a model artifact, or return to Step 6 and deselect model-dependent analyses.",
        "recoverable": True,
        "affected_step": 1,
    },
    WizardErrorCode.MISSING_PREDICTION: {
        "title": "Prediction output required",
        "what_happened": "A performance or evaluation analysis was selected but no prediction file was provided.",
        "why_it_matters": "Precision, Recall, nDCG, and classification metrics require prediction outputs to compute.",
        "how_to_fix": "Return to Step 1 and upload a prediction CSV, or deselect evaluation analyses.",
        "recoverable": True,
        "affected_step": 1,
    },
    WizardErrorCode.MISSING_GROUND_TRUTH: {
        "title": "Ground truth required",
        "what_happened": "An evaluation analysis was selected but no ground-truth labels or interactions were provided.",
        "why_it_matters": "Performance metrics cannot be computed without verified ground-truth labels.",
        "how_to_fix": "Return to Step 1 and upload a ground-truth CSV, or deselect evaluation analyses.",
        "recoverable": True,
        "affected_step": 1,
    },
    WizardErrorCode.MISSING_GROUP_FIELD: {
        "title": "Group field required for fairness analysis",
        "what_happened": "Fairness-by-group was selected but no group/segment field was mapped.",
        "why_it_matters": "Fairness-by-group computes per-group metrics and cannot run without a defined grouping.",
        "how_to_fix": "Return to Step 3 and map an ethically appropriate group field, or deselect fairness-by-group.",
        "recoverable": True,
        "affected_step": 3,
    },
    WizardErrorCode.TASK_TYPE_MISMATCH: {
        "title": "Task type mismatch",
        "what_happened": "The selected analyses require a task type (e.g., classification) that contradicts the registered model's declared task.",
        "why_it_matters": "Running classification metrics on a regression model produces undefined behaviour.",
        "how_to_fix": "Return to Step 5 and confirm the correct model task type.",
        "recoverable": True,
        "affected_step": 5,
    },
    WizardErrorCode.QUOTA_EXCEEDED: {
        "title": "File exceeds tenant quota",
        "what_happened": "The uploaded file is larger than the tenant's configured storage quota.",
        "why_it_matters": "The file cannot be stored or processed without exceeding your allocation.",
        "how_to_fix": "Contact your administrator to increase the quota, or split the dataset into smaller chunks.",
        "recoverable": False,
        "affected_step": 1,
    },
    WizardErrorCode.FILE_TOO_LARGE: {
        "title": "File too large for direct upload",
        "what_happened": "The file exceeds the maximum allowed upload size for this request.",
        "why_it_matters": "Large files must be streamed or chunked via the large-file upload API.",
        "how_to_fix": "Use the chunked upload endpoint or reduce the file size.",
        "recoverable": False,
        "affected_step": 1,
    },
    WizardErrorCode.INVALID_RECIPE: {
        "title": "Invalid analysis recipe",
        "what_happened": "The selected analyses cannot be combined into a valid recipe.",
        "why_it_matters": "Incompatible analyses in the same recipe may produce conflicting outputs or fail mid-run.",
        "how_to_fix": "Review the analysis scope in Step 6 and remove conflicting selections.",
        "recoverable": True,
        "affected_step": 6,
    },
    WizardErrorCode.PLOT_UNAVAILABLE: {
        "title": "Plot unavailable",
        "what_happened": "A selected plot cannot be generated because a required analysis or input is missing.",
        "why_it_matters": "The plot will not appear in the dashboard output.",
        "how_to_fix": "Check the plot's required inputs in Step 7 and ensure the prerequisite analysis is enabled.",
        "recoverable": True,
        "affected_step": 7,
    },
    WizardErrorCode.ANALYSIS_UNAVAILABLE: {
        "title": "Analysis unavailable",
        "what_happened": "A selected analysis cannot run because a required input, field, or model is missing.",
        "why_it_matters": "The analysis will not execute and its metrics will be absent from the output.",
        "how_to_fix": "Return to the relevant step and provide the required input, or deselect this analysis.",
        "recoverable": True,
        "affected_step": 6,
    },
    WizardErrorCode.EXPORT_BLOCKED: {
        "title": "Export blocked by privacy controls",
        "what_happened": "A sensitive export artifact cannot be generated without explicit privacy acknowledgement or administrator permission.",
        "why_it_matters": "Exporting sensitive data without authorisation violates privacy controls.",
        "how_to_fix": "Request administrator approval or remove the export from your plan.",
        "recoverable": True,
        "affected_step": 4,
    },
    WizardErrorCode.TENANT_PERMISSION_DENIED: {
        "title": "Permission denied",
        "what_happened": "Your tenant account does not have permission to perform this action.",
        "why_it_matters": "Certain actions (raw identifier inspection, cross-tenant access) require elevated permissions.",
        "how_to_fix": "Contact your tenant administrator to request the required permission.",
        "recoverable": False,
        "affected_step": None,
    },
    WizardErrorCode.CROSS_TENANT_ACCESS_DENIED: {
        "title": "Cross-tenant access denied",
        "what_happened": "A wizard run or resource from another tenant was accessed.",
        "why_it_matters": "Cross-tenant data access is prohibited and logged.",
        "how_to_fix": "Ensure you are accessing resources within your own tenant.",
        "recoverable": False,
        "affected_step": None,
    },
    WizardErrorCode.JOB_EXECUTION_ERROR: {
        "title": "Analysis job failed",
        "what_happened": "The background analysis job encountered an unrecoverable error.",
        "why_it_matters": "One or more analysis stages did not complete. Check the run manifest for partial outputs.",
        "how_to_fix": "Review the server-side logs (via your administrator) or retry the run with a simplified analysis plan.",
        "recoverable": False,
        "affected_step": 9,
    },
    WizardErrorCode.RECOVERABLE_STAGE_ERROR: {
        "title": "Analysis stage warning",
        "what_happened": "A pipeline stage encountered a non-fatal issue and continued with degraded output.",
        "why_it_matters": "The affected metric or artifact may be incomplete or absent from the results.",
        "how_to_fix": "Review the warnings in the run manifest. The overall run has completed with caveats.",
        "recoverable": True,
        "affected_step": 9,
    },
}


def make_error(
    code: WizardErrorCode,
    *,
    analysis_id: str | None = None,
    plot_id: str | None = None,
    field_name: str | None = None,
    support_reference_id: str | None = None,
    override: dict[str, Any] | None = None,
) -> WizardError:
    base = ERROR_CATALOG[code].copy()
    if override:
        base.update(override)
    return WizardError(
        code=code,
        title=base["title"],
        what_happened=base["what_happened"],
        why_it_matters=base["why_it_matters"],
        how_to_fix=base["how_to_fix"],
        affected_step=base.get("affected_step"),
        recoverable=base.get("recoverable", False),
        analysis_id=analysis_id,
        plot_id=plot_id,
        field_name=field_name,
        support_reference_id=support_reference_id,
    )
