"""Tests: capability registry validity and serialisability."""

from __future__ import annotations

import json

from affectlog.capabilities.analyses import ANALYSIS_BY_ID
from affectlog.capabilities.exports import EXPORT_BY_ID
from affectlog.capabilities.formats import (
    FORMAT_BY_ID,
    SUPPORTED_FORMAT_IDS,
    UNSUPPORTED_FORMAT_IDS,
)
from affectlog.capabilities.plots import PLOT_BY_ID
from affectlog.capabilities.registry import CAPABILITY_REGISTRY, get_capability_json

# ── Registry structure ─────────────────────────────────────────────────────


def test_registry_has_all_sections():
    catalog = get_capability_json()
    assert "formats" in catalog
    assert "analyses" in catalog
    assert "plots" in catalog
    assert "exports" in catalog
    assert "model_adapters" in catalog
    assert "compatibility" in catalog


def test_registry_is_json_serialisable():
    catalog = get_capability_json()
    raw = json.dumps(catalog)
    restored = json.loads(raw)
    assert len(restored["formats"]) == len(CAPABILITY_REGISTRY.formats)
    assert len(restored["analyses"]) == len(CAPABILITY_REGISTRY.analyses)
    assert len(restored["plots"]) == len(CAPABILITY_REGISTRY.plots)
    assert len(restored["exports"]) == len(CAPABILITY_REGISTRY.exports)


def test_all_format_ids_are_strings():
    for f in CAPABILITY_REGISTRY.formats:
        assert isinstance(f.id, str) and f.id
        assert isinstance(f.label, str) and f.label


def test_all_analysis_ids_are_strings():
    for a in CAPABILITY_REGISTRY.analyses:
        assert isinstance(a.id, str) and a.id
        assert isinstance(a.label, str) and a.label


def test_all_plot_ids_are_strings():
    for p in CAPABILITY_REGISTRY.plots:
        assert isinstance(p.id, str) and p.id
        assert isinstance(p.produced_artifact, str)


def test_all_export_ids_are_strings():
    for e in CAPABILITY_REGISTRY.exports:
        assert isinstance(e.id, str) and e.id
        assert isinstance(e.filename_template, str) and e.filename_template


# ── Format scope ────────────────────────────────────────────────────────────


def test_maskott_is_supported():
    assert "maskott_csv_v1" in SUPPORTED_FORMAT_IDS
    assert "maskott_csv_v1" in FORMAT_BY_ID


def test_unsupported_image_audio_video():
    for fmt_id in ("raw_image_dataset", "raw_audio_dataset", "raw_video_dataset"):
        assert fmt_id in UNSUPPORTED_FORMAT_IDS
    assert "raw_image_dataset" not in SUPPORTED_FORMAT_IDS


def test_unsupported_formats_have_user_messages():
    from affectlog.capabilities.formats import UNSUPPORTED_FORMATS

    for f in UNSUPPORTED_FORMATS:
        assert f.user_message, f"UnsupportedFormat '{f.id}' has no user_message"
        assert len(f.user_message) > 30, f"UnsupportedFormat '{f.id}' user_message too short"


# ── Analysis coverage ───────────────────────────────────────────────────────


def test_expected_analyses_present():
    expected = [
        "schema_validation",
        "xapi_compatibility_check",
        "pii_scan",
        "gini_concentration",
        "coverage_at_k",
        "fairness_by_group",
        "model_feature_importance",
        "jsonld_compliance_graph",
        "sop_export",
        "maskott_csv_to_xapi_transform",
        "recommender_ndcg_at_k",
    ]
    for analysis_id in expected:
        assert analysis_id in ANALYSIS_BY_ID, f"Missing analysis: {analysis_id}"


def test_fairness_requires_group_flag():
    a = ANALYSIS_BY_ID["fairness_by_group"]
    assert a.requires_group_field is True
    assert a.requires_predictions is True
    assert a.requires_ground_truth is True


def test_model_explanation_requires_model():
    for aid in (
        "model_feature_importance",
        "model_prediction_explanation",
        "model_partial_dependence",
    ):
        a = ANALYSIS_BY_ID[aid]
        assert a.requires_model is True


def test_recommender_metrics_require_predictions_and_gt():
    for aid in ("recommender_precision_at_k", "recommender_recall_at_k", "recommender_ndcg_at_k"):
        a = ANALYSIS_BY_ID[aid]
        assert a.requires_predictions is True
        assert a.requires_ground_truth is True


def test_analyses_have_unavailable_messages_where_conditional():
    conditional_analyses = [
        "fairness_by_group",
        "model_feature_importance",
        "recommender_ndcg_at_k",
        "temporal_density_profile",
        "classification_performance",
    ]
    for aid in conditional_analyses:
        a = ANALYSIS_BY_ID[aid]
        assert a.unavailable_message, f"'{aid}' has no unavailable_message"


# ── Plot coverage ───────────────────────────────────────────────────────────


def test_expected_plots_present():
    expected = [
        "schema_overview_table",
        "pii_field_heatmap",
        "lorenz_curve",
        "coverage_at_k_curve",
        "feature_importance_bar",
        "roc_curve",
        "fairness_metric_table",
        "jsonld_graph_preview",
        "audit_pipeline_timeline",
    ]
    for pid in expected:
        assert pid in PLOT_BY_ID, f"Missing plot: {pid}"


def test_every_plot_has_produced_artifact():
    for p in CAPABILITY_REGISTRY.plots:
        assert p.produced_artifact, f"Plot '{p.id}' has no produced_artifact"


def test_roc_pr_calibration_require_probabilities():
    for pid in ("roc_curve", "pr_curve", "calibration_curve"):
        p = PLOT_BY_ID[pid]
        assert p.requires_probability_output is True, f"'{pid}' should require probability outputs"


def test_fairness_plot_requires_group_field():
    p = PLOT_BY_ID["fairness_metric_table"]
    assert p.requires_group_field is True


# ── Export coverage ─────────────────────────────────────────────────────────


def test_expected_exports_present():
    expected = [
        "metrics_json",
        "metrics_csv",
        "privacy_report_json",
        "compliance_graph_jsonld",
        "sop_markdown",
        "audit_manifest_json",
    ]
    for eid in expected:
        assert eid in EXPORT_BY_ID, f"Missing export: {eid}"


def test_sensitive_exports_blocked_without_ack():
    for eid in ("privacy_report_json", "pdc_metadata_json"):
        e = EXPORT_BY_ID[eid]
        assert e.blocked_without_privacy_ack is True


# ── Compatibility matrix ────────────────────────────────────────────────────


def test_compatibility_matrix_has_all_rows():
    from affectlog.capabilities.compatibility import COMPATIBILITY_MATRIX, FORMAT_ROWS

    for row in FORMAT_ROWS:
        assert row in COMPATIBILITY_MATRIX


def test_unsupported_unstructured_is_all_unsupported():
    from affectlog.capabilities.compatibility import (
        ANALYSIS_COLUMNS,
        COMPATIBILITY_MATRIX,
        CellState,
    )

    row = COMPATIBILITY_MATRIX["unsupported_unstructured"]
    for col in ANALYSIS_COLUMNS:
        assert col in row
        assert row[col].state == CellState.UNSUPPORTED


def test_maskott_xapi_normalization_supported():
    from affectlog.capabilities.compatibility import COMPATIBILITY_MATRIX, CellState

    cell = COMPATIBILITY_MATRIX["maskott_csv_v1"]["xapi_normalization"]
    assert cell.state == CellState.SUPPORTED


def test_model_card_requires_model():
    from affectlog.capabilities.compatibility import COMPATIBILITY_MATRIX, CellState

    # Generic CSV alone cannot produce model card without model
    cell = COMPATIBILITY_MATRIX["generic_csv_tabular"]["model_card"]
    assert cell.state == CellState.REQUIRES_ADDITIONAL_INPUT
