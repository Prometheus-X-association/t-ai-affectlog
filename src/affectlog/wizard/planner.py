"""Wizard planner — builds a WizardPlan from user step decisions."""

from __future__ import annotations

from typing import Any

from affectlog.wizard.schemas import (
    InspectInputResponse,
    WizardPlan,
    WizardPurpose,
)


def build_plan(
    inspection: InspectInputResponse,
    purpose: WizardPurpose,
    field_mappings: dict[str, str],
    field_types: dict[str, str],
    selected_analyses: list[str],
    selected_plots: list[str],
    selected_exports: list[str],
    privacy_settings: dict[str, Any],
    inputs: dict[str, Any],
    model_context: dict[str, Any] | None = None,
) -> WizardPlan:
    detected_format = inspection.detected_format or "generic_csv_tabular"
    return WizardPlan(
        detected_format=detected_format,
        field_mappings=field_mappings,
        field_types=field_types,
        selected_analyses=selected_analyses,
        selected_plots=selected_plots,
        selected_exports=selected_exports,
        privacy_settings=privacy_settings,
        inputs=inputs,
        purpose=purpose,
        model_context=model_context or {},
    )
