"""Tests: wizard plan validator guardrails."""

from __future__ import annotations

from affectlog.wizard.schemas import ValidationStatus, WizardPlan, WizardPurpose
from affectlog.wizard.validator import validate_plan


def _base_plan(**kwargs) -> WizardPlan:
    defaults = {
        "detected_format": "maskott_csv_v1",
        "field_mappings": {"entity_field": "EntityId", "item_field": "ResourceId"},
        "field_types": {"EntityId": "str", "ResourceId": "str"},
        "selected_analyses": ["schema_validation", "pii_scan", "gini_concentration"],
        "selected_plots": ["schema_overview_table"],
        "selected_exports": ["metrics_json"],
        "privacy_settings": {"privacy_acknowledged": True},
        "inputs": {"dataset_path": "data/maskott.csv"},
        "purpose": WizardPurpose.FULL_AUDIT,
        "model_context": {},
    }
    defaults.update(kwargs)
    return WizardPlan(**defaults)


def test_valid_plan_passes():
    plan = _base_plan()
    result = validate_plan(plan)
    assert result.status == ValidationStatus.PASS
    assert result.blocking_count == 0


def test_no_analyses_blocks():
    plan = _base_plan(selected_analyses=[])
    result = validate_plan(plan)
    assert result.status == ValidationStatus.FAIL
    assert result.blocking_count >= 1
    assert any(i.rule_id == "no_analyses_selected" for i in result.issues)


def test_fairness_without_group_field_blocks():
    plan = _base_plan(
        selected_analyses=["fairness_by_group"],
        field_mappings={"entity_field": "EntityId"},  # no group_field
        inputs={"dataset_path": "d.csv", "predictions_reference": "p.csv"},
    )
    result = validate_plan(plan)
    assert result.status == ValidationStatus.FAIL
    blocking = [i for i in result.issues if i.rule_id == "fairness_requires_group"]
    assert blocking, "Expected fairness_requires_group blocking issue"


def test_fairness_with_group_field_passes():
    plan = _base_plan(
        detected_format="generic_csv_tabular",
        selected_analyses=["fairness_by_group"],
        field_mappings={
            "entity_field": "user_id",
            "target_field": "label",
            "prediction_field": "pred",
            "group_field": "cohort",
        },
        inputs={
            "dataset_path": "d.csv",
            "predictions_reference": "pred.csv",
        },
        privacy_settings={"privacy_acknowledged": True},
    )
    result = validate_plan(plan)
    # Should not have the fairness guardrail blocking issue
    assert not any(i.rule_id == "fairness_requires_group" for i in result.issues)


def test_model_explanation_without_model_blocks():
    plan = _base_plan(
        selected_analyses=["model_feature_importance"],
        inputs={"dataset_path": "d.csv"},  # no model
    )
    result = validate_plan(plan)
    assert result.status == ValidationStatus.FAIL
    assert any(i.rule_id == "explanation_requires_model" for i in result.issues)


def test_roc_without_probabilities_blocks():
    plan = _base_plan(
        selected_plots=["roc_curve"],
        inputs={"dataset_path": "d.csv", "has_probability_output": False},
    )
    result = validate_plan(plan)
    assert any(i.rule_id == "roc_pr_requires_probabilities" for i in result.issues)


def test_xapi_transform_on_non_maskott_blocks():
    plan = _base_plan(
        detected_format="generic_csv_tabular",
        selected_analyses=["maskott_csv_to_xapi_transform"],
    )
    result = validate_plan(plan)
    assert any(i.rule_id == "xapi_transform_requires_maskott" for i in result.issues)


def test_sensitive_export_without_privacy_ack_blocks():
    plan = _base_plan(
        selected_exports=["privacy_report_json"],
        privacy_settings={"privacy_acknowledged": False},
    )
    result = validate_plan(plan)
    blocking = [i for i in result.issues if "privacy_ack_required" in i.rule_id]
    assert blocking


def test_unknown_analysis_blocks():
    plan = _base_plan(selected_analyses=["this_analysis_does_not_exist"])
    result = validate_plan(plan)
    assert result.status == ValidationStatus.FAIL
    assert any(i.rule_id == "unknown_analysis" for i in result.issues)


def test_unsupported_format_blocks():
    plan = _base_plan(detected_format="raw_image_dataset")
    result = validate_plan(plan)
    assert result.status == ValidationStatus.FAIL
    assert any(i.rule_id == "unsupported_format" for i in result.issues)


def test_recommender_without_predictions_blocks():
    plan = _base_plan(
        selected_analyses=["recommender_ndcg_at_k"],
        field_mappings={"entity_field": "user", "item_field": "item"},
        inputs={"dataset_path": "d.csv"},  # no predictions
    )
    result = validate_plan(plan)
    assert any(
        i.rule_id in ("recommender_requires_predictions", "recommender_requires_ground_truth")
        for i in result.issues
    )


def test_temporal_without_timestamp_warns():
    plan = _base_plan(
        selected_analyses=["temporal_density_profile"],
        field_mappings={"entity_field": "user", "item_field": "item"},  # no timestamp
    )
    result = validate_plan(plan)
    # Temporal requires timestamp — should produce at least a warning
    assert any(i.rule_id == "temporal_requires_timestamp" for i in result.issues)
