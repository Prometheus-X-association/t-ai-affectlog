"""Wizard executor — converts a validated plan into an audit run via the production recipe runner."""

from __future__ import annotations

import datetime
import json
import logging
from pathlib import Path
from typing import Any

from affectlog.config import get_settings
from affectlog.core.ids import new_run_id
from affectlog.wizard.output_contract import build_output_contract
from affectlog.wizard.schemas import (
    OutputContractArtifact,
    WizardPlan,
    WizardRunRequest,
    WizardRunResponse,
    WizardRunResultsResponse,
    WizardRunStatusResponse,
)
from affectlog.wizard.validator import validate_plan

log = logging.getLogger(__name__)

# In-memory run store (replace with DB in production)
_WIZARD_RUNS: dict[str, dict[str, Any]] = {}


def _run_background(wizard_run_id: str, plan: WizardPlan) -> None:
    settings = get_settings()
    run_dir = Path(settings.runs_dir) / wizard_run_id
    run_dir.mkdir(parents=True, exist_ok=True)

    try:
        from affectlog.core.paths import resolve_safe_path
        from affectlog.recipes.loader import load_recipe
        from affectlog.recipes.runner import run_audit

        _WIZARD_RUNS[wizard_run_id]["status"] = "running"
        _WIZARD_RUNS[wizard_run_id]["current_stage"] = "initialising"

        dataset_path = plan.inputs.get("dataset_path") or plan.inputs.get("dataset_reference")
        if not dataset_path:
            _WIZARD_RUNS[wizard_run_id]["status"] = "failed"
            _WIZARD_RUNS[wizard_run_id]["errors"] = ["No dataset path in plan."]
            return

        safe_input = resolve_safe_path(Path.cwd(), dataset_path)

        recipe_config_path = (
            Path(settings.data_dir).parent / "configs" / "recipes" / f"{plan.detected_format}.yaml"
        )
        if not recipe_config_path.exists():
            recipe_config_path = (
                Path(settings.data_dir).parent / "configs" / "recipes" / "maskott_tactileo.yaml"
            )

        _WIZARD_RUNS[wizard_run_id]["current_stage"] = "loading_recipe"
        recipe = load_recipe(str(recipe_config_path))

        _WIZARD_RUNS[wizard_run_id]["current_stage"] = "running_pipeline"
        ctx = run_audit(
            safe_input,
            recipe,
            run_dir,
            hash_secret=settings.hash_secret,
        )

        # Write wizard metadata
        wizard_meta = {
            "wizard_run_id": wizard_run_id,
            "plan": plan.model_dump(),
            "artifacts": ctx.artifacts,
            "completed_at": datetime.datetime.utcnow().isoformat(),
        }
        (run_dir / "wizard_meta.json").write_text(json.dumps(wizard_meta, indent=2))

        _WIZARD_RUNS[wizard_run_id].update(
            {
                "status": "completed",
                "current_stage": None,
                "artifacts": ctx.artifacts,
                "stages_completed": ["schema_validation", "profiling", "privacy", "compliance"],
            }
        )

    except Exception as exc:
        log.exception("Wizard run %s failed: %s", wizard_run_id, exc)
        _WIZARD_RUNS[wizard_run_id].update(
            {
                "status": "failed",
                "errors": [str(exc)],
                "current_stage": None,
            }
        )


def create_run(req: WizardRunRequest) -> WizardRunResponse:
    if not req.output_contract_confirmed:
        raise ValueError("Output contract must be confirmed before execution.")

    validation = validate_plan(req.plan)
    if validation.status.value == "fail":
        raise ValueError(
            f"Plan validation failed with {validation.blocking_count} blocking issue(s). "
            "Resolve all blocking issues before running."
        )

    wizard_run_id = new_run_id()
    _WIZARD_RUNS[wizard_run_id] = {
        "wizard_run_id": wizard_run_id,
        "status": "queued",
        "plan": req.plan.model_dump(),
        "current_stage": None,
        "stages_completed": [],
        "rows_processed": None,
        "warnings": [],
        "errors": [],
        "progress_pct": 0.0,
        "created_at": datetime.datetime.utcnow().isoformat(),
    }

    return WizardRunResponse(
        wizard_run_id=wizard_run_id,
        status="queued",
        plan_summary={
            "format": req.plan.detected_format,
            "analyses": len(req.plan.selected_analyses),
            "plots": len(req.plan.selected_plots),
            "purpose": req.plan.purpose.value,
        },
        created_at=_WIZARD_RUNS[wizard_run_id]["created_at"],
    )


def start_run_background(wizard_run_id: str, plan: WizardPlan) -> None:
    import threading

    t = threading.Thread(target=_run_background, args=(wizard_run_id, plan), daemon=True)
    t.start()


def get_run_status(wizard_run_id: str) -> WizardRunStatusResponse | None:
    run = _WIZARD_RUNS.get(wizard_run_id)
    if not run:
        return None
    return WizardRunStatusResponse(
        wizard_run_id=wizard_run_id,
        status=run.get("status", "unknown"),
        current_stage=run.get("current_stage"),
        stages_completed=run.get("stages_completed", []),
        rows_processed=run.get("rows_processed"),
        warnings=run.get("warnings", []),
        errors=run.get("errors", []),
        progress_pct=run.get("progress_pct"),
    )


def get_run_results(wizard_run_id: str) -> WizardRunResultsResponse | None:
    run = _WIZARD_RUNS.get(wizard_run_id)
    if not run:
        return None
    if run.get("status") != "completed":
        return WizardRunResultsResponse(
            wizard_run_id=wizard_run_id,
            status=run.get("status", "unknown"),
        )

    plan = WizardPlan(**run["plan"])
    contract = build_output_contract(plan)

    analyzed = list(plan.selected_analyses)
    not_analyzed: list[str] = []

    from affectlog.capabilities.analyses import ANALYSES

    developer_suggestions: list[str] = []
    for a in ANALYSES:
        if a.id not in plan.selected_analyses:
            if a.requires_model and not plan.inputs.get("model_reference"):
                not_analyzed.append(a.label)
                developer_suggestions.append(
                    f"To enable {a.label}: add a compatible pre-trained model artifact or HTTP endpoint."
                )
            elif a.requires_group_field and not plan.field_mappings.get("group_field"):
                not_analyzed.append(a.label)
                developer_suggestions.append(
                    f"To enable {a.label}: provide an ethically appropriate group/segment field and confirm lawful use."
                )
            elif a.requires_predictions and not plan.inputs.get("predictions_reference"):
                not_analyzed.append(a.label)
                developer_suggestions.append(
                    f"To enable {a.label}: upload ranked predictions and ground-truth interactions."
                )

    key_findings = [
        f"Assessment completed for {len(analyzed)} selected analyses.",
        f"{len(contract.expected_artifacts)} artifacts produced.",
    ]
    if run.get("warnings"):
        key_findings.append(
            f"{len(run['warnings'])} pipeline warnings recorded — review audit_manifest.json."
        )

    next_actions = [
        "Download metrics.json and review key findings.",
        "Share SOP.md with stakeholders for transparency.",
        "Register compliance_graph.jsonld with your data space connector.",
    ]
    if not_analyzed:
        next_actions.append("Review developer extension suggestions to unlock additional analyses.")

    artifacts = [
        OutputContractArtifact(
            filename=a.filename,
            format=a.format,
            description=a.description,
            privacy_level=a.privacy_level,
        )
        for a in contract.expected_artifacts
    ]

    return WizardRunResultsResponse(
        wizard_run_id=wizard_run_id,
        status="completed",
        what_was_analyzed=analyzed,
        what_was_not_analyzed=not_analyzed[:10],
        key_findings=key_findings,
        recommended_next_actions=next_actions,
        artifacts=artifacts,
        developer_extension_suggestions=list(set(developer_suggestions))[:5],
    )
