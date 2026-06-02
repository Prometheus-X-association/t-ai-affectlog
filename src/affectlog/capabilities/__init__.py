"""AffectLog Capability Registry — single source of truth for all supported formats,
analyses, plots, exports, model adapters, task types, and guardrails."""

from affectlog.capabilities.registry import (
    CAPABILITY_REGISTRY,
    get_all_analyses,
    get_all_exports,
    get_all_formats,
    get_all_model_adapters,
    get_all_plots,
    get_analyses_for_format,
    get_capability_json,
    get_plots_for_analyses,
    is_format_supported,
)

__all__ = [
    "CAPABILITY_REGISTRY",
    "get_all_formats",
    "get_all_analyses",
    "get_all_plots",
    "get_all_exports",
    "get_all_model_adapters",
    "get_analyses_for_format",
    "get_plots_for_analyses",
    "is_format_supported",
    "get_capability_json",
]
