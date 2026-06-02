"""Central capability registry — single source of truth for all supported capabilities.

Exports a JSON-serialisable snapshot via get_capability_json() for frontend consumption.
"""

from __future__ import annotations

from typing import Any

from affectlog.capabilities.analyses import ANALYSES, ANALYSIS_BY_ID, AnalysisDefinition
from affectlog.capabilities.compatibility import ANALYSIS_COLUMNS, COMPATIBILITY_MATRIX, FORMAT_ROWS
from affectlog.capabilities.exports import EXPORT_BY_ID, EXPORTS, ExportDefinition
from affectlog.capabilities.formats import (
    FORMAT_BY_ID,
    SUPPORTED_FORMATS,
    UNSUPPORTED_FORMATS,
    SupportedFormat,
    UnsupportedFormat,
)
from affectlog.capabilities.models import (
    MODEL_ADAPTER_BY_ID,
    MODEL_ADAPTERS,
    ModelAdapterDefinition,
)
from affectlog.capabilities.plots import PLOT_BY_ID, PLOTS, PlotDefinition


class CapabilityRegistry:
    """Immutable registry of all AffectLog capabilities."""

    def __init__(self) -> None:
        self.formats: list[SupportedFormat] = SUPPORTED_FORMATS
        self.unsupported_formats: list[UnsupportedFormat] = UNSUPPORTED_FORMATS
        self.analyses: list[AnalysisDefinition] = ANALYSES
        self.plots: list[PlotDefinition] = PLOTS
        self.exports: list[ExportDefinition] = EXPORTS
        self.model_adapters: list[ModelAdapterDefinition] = MODEL_ADAPTERS
        self.compatibility_matrix = COMPATIBILITY_MATRIX
        self.compatibility_rows = FORMAT_ROWS
        self.compatibility_columns = ANALYSIS_COLUMNS

    def get_format(self, format_id: str) -> SupportedFormat | None:
        return FORMAT_BY_ID.get(format_id)

    def get_analysis(self, analysis_id: str) -> AnalysisDefinition | None:
        return ANALYSIS_BY_ID.get(analysis_id)

    def get_plot(self, plot_id: str) -> PlotDefinition | None:
        return PLOT_BY_ID.get(plot_id)

    def get_export(self, export_id: str) -> ExportDefinition | None:
        return EXPORT_BY_ID.get(export_id)

    def get_model_adapter(self, adapter_id: str) -> ModelAdapterDefinition | None:
        return MODEL_ADAPTER_BY_ID.get(adapter_id)

    def to_dict(self) -> dict[str, Any]:
        return {
            "formats": [f.model_dump() for f in self.formats],
            "unsupported_formats": [f.model_dump() for f in self.unsupported_formats],
            "analyses": [a.model_dump() for a in self.analyses],
            "plots": [p.model_dump() for p in self.plots],
            "exports": [e.model_dump() for e in self.exports],
            "model_adapters": [m.model_dump() for m in self.model_adapters],
            "compatibility": {
                "rows": self.compatibility_rows,
                "columns": self.compatibility_columns,
                "matrix": {
                    row_key: {col_key: cell.model_dump() for col_key, cell in row_data.items()}
                    for row_key, row_data in self.compatibility_matrix.items()
                },
            },
        }


CAPABILITY_REGISTRY = CapabilityRegistry()


# ── Public helpers ─────────────────────────────────────────────────────────


def get_all_formats() -> list[SupportedFormat]:
    return CAPABILITY_REGISTRY.formats


def get_all_analyses() -> list[AnalysisDefinition]:
    return CAPABILITY_REGISTRY.analyses


def get_all_plots() -> list[PlotDefinition]:
    return CAPABILITY_REGISTRY.plots


def get_all_exports() -> list[ExportDefinition]:
    return CAPABILITY_REGISTRY.exports


def get_all_model_adapters() -> list[ModelAdapterDefinition]:
    return CAPABILITY_REGISTRY.model_adapters


def is_format_supported(format_id: str) -> bool:
    return format_id in FORMAT_BY_ID


def get_analyses_for_format(format_id: str) -> list[AnalysisDefinition]:
    return [a for a in ANALYSES if not a.compatible_formats or format_id in a.compatible_formats]


def get_plots_for_analyses(selected_analysis_ids: list[str]) -> list[PlotDefinition]:
    analysis_set = set(selected_analysis_ids)
    return [
        p
        for p in PLOTS
        if not p.required_analyses or bool(analysis_set.intersection(p.required_analyses))
    ]


def get_capability_json() -> dict[str, Any]:
    """Frontend-safe JSON snapshot of the full capability registry."""
    return CAPABILITY_REGISTRY.to_dict()
