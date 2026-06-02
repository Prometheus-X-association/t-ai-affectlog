"""Compatibility matrix: which analyses are available for each format combination."""

from __future__ import annotations

from enum import StrEnum

from pydantic import BaseModel


class CellState(StrEnum):
    SUPPORTED = "supported"
    SUPPORTED_WITH_MAPPING = "supported_with_mapping"
    REQUIRES_ADDITIONAL_INPUT = "requires_additional_input"
    NOT_APPLICABLE = "not_applicable"
    UNSUPPORTED = "unsupported"


class CompatibilityCell(BaseModel):
    state: CellState
    note: str = ""


# Row keys (dataset types)
FORMAT_ROWS = [
    "maskott_csv_v1",
    "becomino_json",
    "generic_xapi_json",
    "generic_xapi_jsonl",
    "generic_csv_tabular",
    "parquet_tabular",
    "dataset_plus_predictions",
    "dataset_plus_model",
    "dataset_plus_two_models",
    "recommendation_outputs",
    "unsupported_unstructured",
]

# Column keys (analysis categories)
ANALYSIS_COLUMNS = [
    "schema_validation",
    "pii_scan",
    "pseudonymisation",
    "xapi_normalization",
    "statistical_profiling",
    "temporal_profiling",
    "concentration_metrics",
    "representation_metrics",
    "recommender_metrics",
    "classification_metrics",
    "regression_metrics",
    "model_explanations",
    "model_comparison",
    "compliance_graph",
    "sop_export",
    "data_card",
    "model_card",
]

_S = CellState.SUPPORTED
_M = CellState.SUPPORTED_WITH_MAPPING
_A = CellState.REQUIRES_ADDITIONAL_INPUT
_N = CellState.NOT_APPLICABLE
_U = CellState.UNSUPPORTED

COMPATIBILITY_MATRIX: dict[str, dict[str, CompatibilityCell]] = {
    "maskott_csv_v1": {
        "schema_validation": CompatibilityCell(state=_S),
        "pii_scan": CompatibilityCell(state=_S),
        "pseudonymisation": CompatibilityCell(state=_S),
        "xapi_normalization": CompatibilityCell(state=_S),
        "statistical_profiling": CompatibilityCell(state=_S),
        "temporal_profiling": CompatibilityCell(state=_S, note="Requires AccessDate mapping"),
        "concentration_metrics": CompatibilityCell(state=_S),
        "representation_metrics": CompatibilityCell(state=_S),
        "recommender_metrics": CompatibilityCell(state=_A, note="Requires prediction CSV"),
        "classification_metrics": CompatibilityCell(
            state=_A, note="Requires target and prediction fields"
        ),
        "regression_metrics": CompatibilityCell(state=_N, note="Not applicable for trace data"),
        "model_explanations": CompatibilityCell(state=_A, note="Requires model artifact"),
        "model_comparison": CompatibilityCell(state=_A, note="Requires two model artifacts"),
        "compliance_graph": CompatibilityCell(state=_S),
        "sop_export": CompatibilityCell(state=_S),
        "data_card": CompatibilityCell(state=_S),
        "model_card": CompatibilityCell(state=_A, note="Requires model"),
    },
    "becomino_json": {
        "schema_validation": CompatibilityCell(state=_M, note="Template inference required"),
        "pii_scan": CompatibilityCell(state=_S),
        "pseudonymisation": CompatibilityCell(state=_S),
        "xapi_normalization": CompatibilityCell(
            state=_M, note="Requires verb mapping confirmation"
        ),
        "statistical_profiling": CompatibilityCell(state=_S),
        "temporal_profiling": CompatibilityCell(state=_M, note="Requires timestamp mapping"),
        "concentration_metrics": CompatibilityCell(state=_S),
        "representation_metrics": CompatibilityCell(state=_S),
        "recommender_metrics": CompatibilityCell(state=_A, note="Requires prediction CSV"),
        "classification_metrics": CompatibilityCell(state=_N),
        "regression_metrics": CompatibilityCell(state=_N),
        "model_explanations": CompatibilityCell(state=_N),
        "model_comparison": CompatibilityCell(state=_N),
        "compliance_graph": CompatibilityCell(state=_S),
        "sop_export": CompatibilityCell(state=_S),
        "data_card": CompatibilityCell(state=_S),
        "model_card": CompatibilityCell(state=_N),
    },
    "generic_xapi_json": {
        "schema_validation": CompatibilityCell(state=_M),
        "pii_scan": CompatibilityCell(state=_S),
        "pseudonymisation": CompatibilityCell(state=_S),
        "xapi_normalization": CompatibilityCell(state=_M),
        "statistical_profiling": CompatibilityCell(state=_S),
        "temporal_profiling": CompatibilityCell(state=_M),
        "concentration_metrics": CompatibilityCell(state=_S),
        "representation_metrics": CompatibilityCell(state=_S),
        "recommender_metrics": CompatibilityCell(state=_A),
        "classification_metrics": CompatibilityCell(state=_N),
        "regression_metrics": CompatibilityCell(state=_N),
        "model_explanations": CompatibilityCell(state=_N),
        "model_comparison": CompatibilityCell(state=_N),
        "compliance_graph": CompatibilityCell(state=_S),
        "sop_export": CompatibilityCell(state=_S),
        "data_card": CompatibilityCell(state=_S),
        "model_card": CompatibilityCell(state=_N),
    },
    "generic_xapi_jsonl": {
        "schema_validation": CompatibilityCell(state=_M),
        "pii_scan": CompatibilityCell(state=_S),
        "pseudonymisation": CompatibilityCell(state=_S),
        "xapi_normalization": CompatibilityCell(state=_M),
        "statistical_profiling": CompatibilityCell(state=_S),
        "temporal_profiling": CompatibilityCell(state=_M),
        "concentration_metrics": CompatibilityCell(state=_S),
        "representation_metrics": CompatibilityCell(state=_S),
        "recommender_metrics": CompatibilityCell(state=_A),
        "classification_metrics": CompatibilityCell(state=_N),
        "regression_metrics": CompatibilityCell(state=_N),
        "model_explanations": CompatibilityCell(state=_N),
        "model_comparison": CompatibilityCell(state=_N),
        "compliance_graph": CompatibilityCell(state=_S),
        "sop_export": CompatibilityCell(state=_S),
        "data_card": CompatibilityCell(state=_S),
        "model_card": CompatibilityCell(state=_N),
    },
    "generic_csv_tabular": {
        "schema_validation": CompatibilityCell(state=_M),
        "pii_scan": CompatibilityCell(state=_S),
        "pseudonymisation": CompatibilityCell(state=_S),
        "xapi_normalization": CompatibilityCell(state=_N),
        "statistical_profiling": CompatibilityCell(state=_S),
        "temporal_profiling": CompatibilityCell(state=_M),
        "concentration_metrics": CompatibilityCell(state=_M),
        "representation_metrics": CompatibilityCell(state=_M),
        "recommender_metrics": CompatibilityCell(state=_A),
        "classification_metrics": CompatibilityCell(state=_M),
        "regression_metrics": CompatibilityCell(state=_M),
        "model_explanations": CompatibilityCell(state=_A),
        "model_comparison": CompatibilityCell(state=_A),
        "compliance_graph": CompatibilityCell(state=_S),
        "sop_export": CompatibilityCell(state=_S),
        "data_card": CompatibilityCell(state=_S),
        "model_card": CompatibilityCell(state=_A),
    },
    "parquet_tabular": {
        "schema_validation": CompatibilityCell(state=_M),
        "pii_scan": CompatibilityCell(state=_S),
        "pseudonymisation": CompatibilityCell(state=_S),
        "xapi_normalization": CompatibilityCell(state=_N),
        "statistical_profiling": CompatibilityCell(state=_S),
        "temporal_profiling": CompatibilityCell(state=_M),
        "concentration_metrics": CompatibilityCell(state=_M),
        "representation_metrics": CompatibilityCell(state=_M),
        "recommender_metrics": CompatibilityCell(state=_A),
        "classification_metrics": CompatibilityCell(state=_M),
        "regression_metrics": CompatibilityCell(state=_M),
        "model_explanations": CompatibilityCell(state=_A),
        "model_comparison": CompatibilityCell(state=_A),
        "compliance_graph": CompatibilityCell(state=_S),
        "sop_export": CompatibilityCell(state=_S),
        "data_card": CompatibilityCell(state=_S),
        "model_card": CompatibilityCell(state=_A),
    },
    "dataset_plus_predictions": {
        "schema_validation": CompatibilityCell(state=_S),
        "pii_scan": CompatibilityCell(state=_S),
        "pseudonymisation": CompatibilityCell(state=_S),
        "xapi_normalization": CompatibilityCell(state=_N),
        "statistical_profiling": CompatibilityCell(state=_S),
        "temporal_profiling": CompatibilityCell(state=_M),
        "concentration_metrics": CompatibilityCell(state=_S),
        "representation_metrics": CompatibilityCell(state=_S),
        "recommender_metrics": CompatibilityCell(state=_S),
        "classification_metrics": CompatibilityCell(state=_S),
        "regression_metrics": CompatibilityCell(state=_S),
        "model_explanations": CompatibilityCell(state=_N, note="Model artifact required"),
        "model_comparison": CompatibilityCell(state=_N),
        "compliance_graph": CompatibilityCell(state=_S),
        "sop_export": CompatibilityCell(state=_S),
        "data_card": CompatibilityCell(state=_S),
        "model_card": CompatibilityCell(state=_N),
    },
    "dataset_plus_model": {
        "schema_validation": CompatibilityCell(state=_S),
        "pii_scan": CompatibilityCell(state=_S),
        "pseudonymisation": CompatibilityCell(state=_S),
        "xapi_normalization": CompatibilityCell(state=_N),
        "statistical_profiling": CompatibilityCell(state=_S),
        "temporal_profiling": CompatibilityCell(state=_M),
        "concentration_metrics": CompatibilityCell(state=_S),
        "representation_metrics": CompatibilityCell(state=_S),
        "recommender_metrics": CompatibilityCell(state=_A),
        "classification_metrics": CompatibilityCell(state=_S),
        "regression_metrics": CompatibilityCell(state=_S),
        "model_explanations": CompatibilityCell(state=_S),
        "model_comparison": CompatibilityCell(state=_A, note="Requires second model"),
        "compliance_graph": CompatibilityCell(state=_S),
        "sop_export": CompatibilityCell(state=_S),
        "data_card": CompatibilityCell(state=_S),
        "model_card": CompatibilityCell(state=_S),
    },
    "dataset_plus_two_models": {
        "schema_validation": CompatibilityCell(state=_S),
        "pii_scan": CompatibilityCell(state=_S),
        "pseudonymisation": CompatibilityCell(state=_S),
        "xapi_normalization": CompatibilityCell(state=_N),
        "statistical_profiling": CompatibilityCell(state=_S),
        "temporal_profiling": CompatibilityCell(state=_M),
        "concentration_metrics": CompatibilityCell(state=_S),
        "representation_metrics": CompatibilityCell(state=_S),
        "recommender_metrics": CompatibilityCell(state=_A),
        "classification_metrics": CompatibilityCell(state=_S),
        "regression_metrics": CompatibilityCell(state=_S),
        "model_explanations": CompatibilityCell(state=_S),
        "model_comparison": CompatibilityCell(state=_S),
        "compliance_graph": CompatibilityCell(state=_S),
        "sop_export": CompatibilityCell(state=_S),
        "data_card": CompatibilityCell(state=_S),
        "model_card": CompatibilityCell(state=_S),
    },
    "recommendation_outputs": {
        "schema_validation": CompatibilityCell(state=_S),
        "pii_scan": CompatibilityCell(state=_S),
        "pseudonymisation": CompatibilityCell(state=_S),
        "xapi_normalization": CompatibilityCell(state=_N),
        "statistical_profiling": CompatibilityCell(state=_S),
        "temporal_profiling": CompatibilityCell(state=_M),
        "concentration_metrics": CompatibilityCell(state=_S),
        "representation_metrics": CompatibilityCell(state=_S),
        "recommender_metrics": CompatibilityCell(state=_S),
        "classification_metrics": CompatibilityCell(state=_N),
        "regression_metrics": CompatibilityCell(state=_N),
        "model_explanations": CompatibilityCell(state=_N),
        "model_comparison": CompatibilityCell(state=_N),
        "compliance_graph": CompatibilityCell(state=_S),
        "sop_export": CompatibilityCell(state=_S),
        "data_card": CompatibilityCell(state=_S),
        "model_card": CompatibilityCell(state=_N),
    },
    "unsupported_unstructured": {
        col: CompatibilityCell(
            state=_U,
            note="AffectLog does not support raw image/audio/video/text datasets. Convert to tabular or implement an adapter.",
        )
        for col in ANALYSIS_COLUMNS
    },
}


def get_compatibility_for_format(format_row: str) -> dict[str, CompatibilityCell]:
    return COMPATIBILITY_MATRIX.get(format_row, {})


def is_analysis_supported_for_format(analysis_col: str, format_row: str) -> bool:
    row = COMPATIBILITY_MATRIX.get(format_row, {})
    cell = row.get(analysis_col)
    if cell is None:
        return False
    return cell.state in (CellState.SUPPORTED, CellState.SUPPORTED_WITH_MAPPING)
