"""Wizard plan validator — returns strict pass/warning/fail before execution."""

from __future__ import annotations

from affectlog.capabilities.analyses import ANALYSIS_BY_ID
from affectlog.capabilities.guardrails import run_all_guardrails
from affectlog.capabilities.plots import PLOT_BY_ID
from affectlog.wizard.schemas import (
    ValidatePlanResponse,
    ValidationIssue,
    ValidationStatus,
    WizardPlan,
)


def validate_plan(plan: WizardPlan) -> ValidatePlanResponse:
    issues: list[ValidationIssue] = []

    # ── Guardrail checks ───────────────────────────────────────────────
    guardrail_results = run_all_guardrails(
        analyses=plan.selected_analyses,
        plots=plan.selected_plots,
        exports=plan.selected_exports,
        field_mappings=plan.field_mappings,
        field_types=plan.field_types,
        inputs=plan.inputs,
        privacy_settings=plan.privacy_settings,
        detected_format=plan.detected_format,
    )
    for gr in guardrail_results:
        issues.append(
            ValidationIssue(
                severity=gr.severity.value,
                rule_id=gr.rule_id,
                title=gr.title,
                message=gr.message,
                remediation=gr.remediation,
                affected_step=gr.affected_step,
            )
        )

    # ── Analysis existence checks ──────────────────────────────────────
    for analysis_id in plan.selected_analyses:
        if analysis_id not in ANALYSIS_BY_ID:
            issues.append(
                ValidationIssue(
                    severity="block",
                    rule_id="unknown_analysis",
                    title=f"Unknown analysis: {analysis_id}",
                    message=f"'{analysis_id}' is not in the capability registry.",
                    remediation="Remove this analysis from the plan — it does not exist.",
                    affected_step=6,
                )
            )

    # ── Plot existence checks ──────────────────────────────────────────
    for plot_id in plan.selected_plots:
        if plot_id not in PLOT_BY_ID:
            issues.append(
                ValidationIssue(
                    severity="block",
                    rule_id="unknown_plot",
                    title=f"Unknown plot: {plot_id}",
                    message=f"'{plot_id}' is not in the plot catalog.",
                    remediation="Remove this plot from the plan — it does not exist.",
                    affected_step=7,
                )
            )

    # ── Format check ───────────────────────────────────────────────────
    from affectlog.capabilities.formats import FORMAT_BY_ID, UNSUPPORTED_FORMAT_IDS

    if plan.detected_format in UNSUPPORTED_FORMAT_IDS:
        issues.append(
            ValidationIssue(
                severity="block",
                rule_id="unsupported_format",
                title="Unsupported dataset format",
                message=f"Format '{plan.detected_format}' is not supported by AffectLog.",
                remediation="Convert the input to a supported format or implement a compatible adapter.",
                affected_step=2,
            )
        )
    elif plan.detected_format not in FORMAT_BY_ID:
        issues.append(
            ValidationIssue(
                severity="warn",
                rule_id="unrecognised_format",
                title="Unrecognised format identifier",
                message=f"'{plan.detected_format}' is not in the format registry. Analysis may be limited.",
                remediation="Return to Step 2 and confirm the correct format.",
                affected_step=2,
            )
        )

    # ── Privacy acknowledgement for sensitive exports ──────────────────
    from affectlog.capabilities.exports import EXPORT_BY_ID

    for export_id in plan.selected_exports:
        export_def = EXPORT_BY_ID.get(export_id)
        if (
            export_def
            and export_def.blocked_without_privacy_ack
            and not plan.privacy_settings.get("privacy_acknowledged")
        ):
            issues.append(
                ValidationIssue(
                    severity="block",
                    rule_id=f"privacy_ack_required_{export_id}",
                    title=f"Privacy acknowledgement required for {export_def.label}",
                    message="This export requires explicit privacy acknowledgement.",
                    remediation="Return to Step 4 and confirm the privacy acknowledgement.",
                    affected_step=4,
                )
            )

    # ── Minimum analysis check ────────────────────────────────────────
    if not plan.selected_analyses:
        issues.append(
            ValidationIssue(
                severity="block",
                rule_id="no_analyses_selected",
                title="No analyses selected",
                message="At least one analysis must be selected to run an assessment.",
                remediation="Return to Step 6 and select at least one analysis.",
                affected_step=6,
            )
        )

    # ── Tally ─────────────────────────────────────────────────────────
    blocking = sum(1 for i in issues if i.severity == "block")
    warnings = sum(1 for i in issues if i.severity == "warn")
    infos = sum(1 for i in issues if i.severity == "info")

    if blocking > 0:
        status = ValidationStatus.FAIL
    elif warnings > 0:
        status = ValidationStatus.WARN
    else:
        status = ValidationStatus.PASS

    return ValidatePlanResponse(
        status=status,
        issues=issues,
        blocking_count=blocking,
        warning_count=warnings,
        info_count=infos,
    )
