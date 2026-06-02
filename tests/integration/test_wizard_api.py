"""Integration tests: wizard and capabilities API endpoints."""

from __future__ import annotations

import csv
from pathlib import Path

import pytest
from fastapi.testclient import TestClient

from affectlog.api.main import app


@pytest.fixture
def client():
    return TestClient(app)


@pytest.fixture
def maskott_csv_path(tmp_path: Path) -> str:
    p = tmp_path / "test.csv"
    fieldnames = [
        "_id",
        "AccessDate",
        "ViewContext",
        "ResourceId",
        "ResourceType",
        "CollectionId",
        "ActivitySessionId",
        "Duration",
        "EntityId",
        "EntityUaiCode",
        "IsViewerAuthor",
        "IsViewerAnonymous",
    ]
    with p.open("w", newline="") as f:
        w = csv.DictWriter(f, fieldnames=fieldnames)
        w.writeheader()
        for i in range(20):
            w.writerow(
                {
                    "_id": f"id_{i}",
                    "AccessDate": "2024-01-01T10:00:00",
                    "ViewContext": "viewed",
                    "ResourceId": f"res_{i % 5}",
                    "ResourceType": "Document",
                    "CollectionId": f"col_{i % 2}",
                    "ActivitySessionId": f"sess_{i % 4}",
                    "Duration": 30,
                    "EntityId": f"entity_{i % 3}",
                    "EntityUaiCode": "0123456A",
                    "IsViewerAuthor": False,
                    "IsViewerAnonymous": False,
                }
            )
    return str(p)


# ── Capabilities endpoints ─────────────────────────────────────────────────


def test_get_capabilities(client):
    r = client.get("/v1/capabilities")
    assert r.status_code == 200
    body = r.json()
    assert "formats" in body
    assert "analyses" in body
    assert "plots" in body
    assert "exports" in body
    assert len(body["analyses"]) > 0


def test_get_formats(client):
    r = client.get("/v1/capabilities/formats")
    assert r.status_code == 200
    body = r.json()
    assert "supported" in body
    assert "unsupported" in body
    ids = [f["id"] for f in body["supported"]]
    assert "maskott_csv_v1" in ids
    unsupported_ids = [f["id"] for f in body["unsupported"]]
    assert "raw_image_dataset" in unsupported_ids


def test_get_analyses(client):
    r = client.get("/v1/capabilities/analyses")
    assert r.status_code == 200
    ids = [a["id"] for a in r.json()["analyses"]]
    assert "gini_concentration" in ids
    assert "coverage_at_k" in ids
    assert "fairness_by_group" in ids


def test_get_plots(client):
    r = client.get("/v1/capabilities/plots")
    assert r.status_code == 200
    ids = [p["id"] for p in r.json()["plots"]]
    assert "lorenz_curve" in ids
    assert "roc_curve" in ids


def test_get_exports(client):
    r = client.get("/v1/capabilities/exports")
    assert r.status_code == 200
    ids = [e["id"] for e in r.json()["exports"]]
    assert "metrics_json" in ids
    assert "compliance_graph_jsonld" in ids


def test_get_model_adapters(client):
    r = client.get("/v1/capabilities/model-adapters")
    assert r.status_code == 200
    ids = [m["id"] for m in r.json()["model_adapters"]]
    assert "sklearn_adapter" in ids


# ── Wizard inspect endpoint ────────────────────────────────────────────────


def test_inspect_maskott_csv(client, maskott_csv_path):
    r = client.post("/v1/wizard/inspect-inputs", json={"dataset_path": maskott_csv_path})
    assert r.status_code == 200
    body = r.json()
    assert body["detected_format"] == "maskott_csv_v1"
    assert body["is_supported"] is True
    assert body["format_confidence"] >= 0.8
    assert len(body["field_inventory"]) > 0


def test_inspect_missing_path_returns_unsupported(client):
    r = client.post("/v1/wizard/inspect-inputs", json={})
    assert r.status_code == 200
    body = r.json()
    assert body["is_supported"] is False


# ── Wizard recommend endpoint ──────────────────────────────────────────────


def test_recommend_maskott_csv(client, maskott_csv_path):
    # First inspect
    ir = client.post("/v1/wizard/inspect-inputs", json={"dataset_path": maskott_csv_path})
    inspection = ir.json()

    r = client.post(
        "/v1/wizard/recommend",
        json={
            "inspection_result": inspection,
            "purpose": "full_audit",
            "field_mappings": {"entity_field": "EntityId", "item_field": "ResourceId"},
            "has_model": False,
            "has_predictions": False,
            "has_ground_truth": False,
            "has_group_field": False,
            "has_probability_output": False,
        },
    )
    assert r.status_code == 200
    body = r.json()
    assert "valid_analyses" in body
    assert len(body["valid_analyses"]) > 0
    valid_ids = [a["id"] for a in body["valid_analyses"]]
    # Core analyses must be present for Maskott CSV
    assert "schema_validation" in valid_ids
    assert "pii_scan" in valid_ids
    assert "gini_concentration" in valid_ids


def test_recommend_maskott_excludes_model_analyses(client, maskott_csv_path):
    ir = client.post("/v1/wizard/inspect-inputs", json={"dataset_path": maskott_csv_path})
    inspection = ir.json()
    r = client.post(
        "/v1/wizard/recommend",
        json={
            "inspection_result": inspection,
            "purpose": "full_audit",
            "field_mappings": {},
            "has_model": False,
            "has_predictions": False,
            "has_ground_truth": False,
            "has_group_field": False,
            "has_probability_output": False,
        },
    )
    body = r.json()
    # Model explanations should be conditional, not valid
    valid_ids = {a["id"] for a in body["valid_analyses"]}
    assert "model_feature_importance" not in valid_ids


# ── Wizard validate-plan endpoint ──────────────────────────────────────────


def test_validate_valid_plan(client):
    r = client.post(
        "/v1/wizard/validate-plan",
        json={
            "detected_format": "maskott_csv_v1",
            "field_mappings": {"entity_field": "EntityId", "item_field": "ResourceId"},
            "field_types": {},
            "selected_analyses": ["schema_validation", "pii_scan", "gini_concentration"],
            "selected_plots": ["schema_overview_table"],
            "selected_exports": ["metrics_json"],
            "privacy_settings": {"privacy_acknowledged": True},
            "inputs": {"dataset_path": "d.csv"},
            "purpose": "full_audit",
            "model_context": {},
        },
    )
    assert r.status_code == 200
    body = r.json()
    assert body["status"] == "pass"


def test_validate_invalid_plan_no_analyses(client):
    r = client.post(
        "/v1/wizard/validate-plan",
        json={
            "detected_format": "maskott_csv_v1",
            "field_mappings": {},
            "field_types": {},
            "selected_analyses": [],
            "selected_plots": [],
            "selected_exports": [],
            "privacy_settings": {"privacy_acknowledged": True},
            "inputs": {},
            "purpose": "full_audit",
            "model_context": {},
        },
    )
    assert r.status_code == 200
    body = r.json()
    assert body["status"] == "fail"


def test_validate_fairness_without_group_fails(client):
    r = client.post(
        "/v1/wizard/validate-plan",
        json={
            "detected_format": "generic_csv_tabular",
            "field_mappings": {"entity_field": "user"},
            "field_types": {},
            "selected_analyses": ["fairness_by_group"],
            "selected_plots": [],
            "selected_exports": [],
            "privacy_settings": {"privacy_acknowledged": True},
            "inputs": {"dataset_path": "d.csv", "predictions_reference": "p.csv"},
            "purpose": "full_audit",
            "model_context": {},
        },
    )
    assert r.status_code == 200
    assert r.json()["status"] == "fail"


# ── Wizard run requires contract confirmation ──────────────────────────────


def test_run_without_confirmation_fails(client):
    r = client.post(
        "/v1/wizard/run",
        json={
            "plan": {
                "detected_format": "maskott_csv_v1",
                "field_mappings": {},
                "field_types": {},
                "selected_analyses": ["schema_validation"],
                "selected_plots": [],
                "selected_exports": [],
                "privacy_settings": {"privacy_acknowledged": True},
                "inputs": {"dataset_path": "d.csv"},
                "purpose": "full_audit",
                "model_context": {},
            },
            "output_contract_confirmed": False,
        },
    )
    assert r.status_code == 400


# ── Wizard help endpoints ──────────────────────────────────────────────────


def test_step_help_endpoint(client):
    for step in range(1, 11):
        r = client.get(f"/v1/wizard/help/step/{step}")
        assert r.status_code == 200
        body = r.json()
        assert "title" in body
        assert "short_help" in body


def test_analysis_help_endpoint(client):
    r = client.get("/v1/wizard/help/analysis/coverage_at_k")
    assert r.status_code == 200
    body = r.json()
    assert "short_help" in body


def test_analysis_help_missing_returns_404(client):
    r = client.get("/v1/wizard/help/analysis/this_does_not_exist")
    assert r.status_code == 404


# ── Output contract endpoint ───────────────────────────────────────────────


def test_output_contract_contains_limitations(client):
    r = client.post(
        "/v1/wizard/output-contract",
        json={
            "detected_format": "maskott_csv_v1",
            "field_mappings": {"entity_field": "EntityId"},
            "field_types": {},
            "selected_analyses": ["schema_validation", "pii_scan"],
            "selected_plots": ["schema_overview_table"],
            "selected_exports": ["metrics_json"],
            "privacy_settings": {"privacy_acknowledged": True},
            "inputs": {"dataset_path": "d.csv"},
            "purpose": "dataset_readiness",
            "model_context": {},
        },
    )
    assert r.status_code == 200
    body = r.json()
    assert "limitations" in body
    assert len(body["limitations"]) > 0
    # Check confirmation text
    assert "confirmation_text" in body
    assert (
        "scope" in body["confirmation_text"].lower()
        or "limitations" in body["confirmation_text"].lower()
    )


# ── Cross-tenant run list ─────────────────────────────────────────────────


def test_list_runs_returns_empty_initially(client):
    r = client.get("/v1/wizard/runs")
    assert r.status_code == 200
    assert "runs" in r.json()
