"""Tests: wizard dataset inspector."""

from __future__ import annotations

import csv
import json
import tempfile
from pathlib import Path

from affectlog.wizard.inspector import inspect
from affectlog.wizard.schemas import InspectInputRequest, UserHints


def _write_maskott_csv(path: Path, rows: int = 10) -> Path:
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
    with path.open("w", newline="") as f:
        w = csv.DictWriter(f, fieldnames=fieldnames)
        w.writeheader()
        for i in range(rows):
            w.writerow(
                {
                    "_id": f"id_{i}",
                    "AccessDate": "2024-01-01T10:00:00",
                    "ViewContext": "viewed",
                    "ResourceId": f"res_{i % 5}",
                    "ResourceType": "Document",
                    "CollectionId": f"col_{i % 3}",
                    "ActivitySessionId": f"sess_{i % 4}",
                    "Duration": 30,
                    "EntityId": f"entity_{i % 3}",
                    "EntityUaiCode": "0123456A",
                    "IsViewerAuthor": False,
                    "IsViewerAnonymous": False,
                }
            )
    return path


def _write_xapi_jsonl(path: Path, rows: int = 5) -> Path:
    with path.open("w") as f:
        for i in range(rows):
            stmt = {
                "actor": {"account": {"name": f"user_{i}"}},
                "verb": {"id": "http://adlnet.gov/expapi/verbs/experienced"},
                "object": {"id": f"http://example.com/activity/{i}"},
                "timestamp": "2024-01-01T10:00:00Z",
            }
            f.write(json.dumps(stmt) + "\n")
    return path


def _write_generic_csv(path: Path) -> Path:
    with path.open("w", newline="") as f:
        w = csv.DictWriter(f, fieldnames=["user_id", "item_id", "score", "date"])
        w.writeheader()
        for i in range(20):
            w.writerow(
                {
                    "user_id": f"u{i}",
                    "item_id": f"item{i % 5}",
                    "score": i * 0.1,
                    "date": "2024-01-01",
                }
            )
    return path


# ── Maskott CSV ──────────────────────────────────────────────────────────


def test_maskott_detected():
    with tempfile.NamedTemporaryFile(suffix=".csv", delete=False) as tmp:
        p = Path(tmp.name)
    _write_maskott_csv(p)
    req = InspectInputRequest(dataset_path=str(p))
    result = inspect(req)
    assert result.detected_format == "maskott_csv_v1"
    assert result.is_supported is True
    assert result.format_confidence >= 0.8


def test_maskott_pre_mapped_fields():
    with tempfile.NamedTemporaryFile(suffix=".csv", delete=False) as tmp:
        p = Path(tmp.name)
    _write_maskott_csv(p)
    req = InspectInputRequest(dataset_path=str(p))
    result = inspect(req)
    assert "entity_field" in result.pre_mapped_fields
    assert "item_field" in result.pre_mapped_fields
    assert "timestamp_field" in result.pre_mapped_fields


def test_maskott_row_count():
    with tempfile.NamedTemporaryFile(suffix=".csv", delete=False) as tmp:
        p = Path(tmp.name)
    _write_maskott_csv(p, rows=25)
    req = InspectInputRequest(dataset_path=str(p))
    result = inspect(req)
    assert result.row_count_estimate == 25


def test_maskott_field_inventory_not_empty():
    with tempfile.NamedTemporaryFile(suffix=".csv", delete=False) as tmp:
        p = Path(tmp.name)
    _write_maskott_csv(p)
    req = InspectInputRequest(dataset_path=str(p))
    result = inspect(req)
    assert len(result.field_inventory) > 0
    names = [f.name for f in result.field_inventory]
    assert "_id" in names
    assert "EntityId" in names


def test_maskott_pii_flags_entity_fields():
    with tempfile.NamedTemporaryFile(suffix=".csv", delete=False) as tmp:
        p = Path(tmp.name)
    _write_maskott_csv(p)
    req = InspectInputRequest(dataset_path=str(p))
    result = inspect(req)
    pii_names = {f.name for f in result.field_inventory if f.pii_flag}
    # EntityId and EntityUaiCode should be flagged
    assert "EntityId" in pii_names or "EntityUaiCode" in pii_names or "_id" in pii_names


# ── xAPI JSONL ───────────────────────────────────────────────────────────


def test_xapi_jsonl_detected():
    with tempfile.NamedTemporaryFile(suffix=".jsonl", delete=False) as tmp:
        p = Path(tmp.name)
    _write_xapi_jsonl(p)
    req = InspectInputRequest(dataset_path=str(p))
    result = inspect(req)
    assert result.detected_format == "generic_xapi_jsonl"
    assert result.is_supported is True


def test_xapi_jsonl_row_count():
    with tempfile.NamedTemporaryFile(suffix=".jsonl", delete=False) as tmp:
        p = Path(tmp.name)
    _write_xapi_jsonl(p, rows=15)
    req = InspectInputRequest(dataset_path=str(p))
    result = inspect(req)
    assert result.row_count_estimate == 15


# ── Generic CSV ──────────────────────────────────────────────────────────


def test_generic_csv_detected():
    with tempfile.NamedTemporaryFile(suffix=".csv", delete=False) as tmp:
        p = Path(tmp.name)
    _write_generic_csv(p)
    req = InspectInputRequest(dataset_path=str(p))
    result = inspect(req)
    assert result.detected_format == "generic_csv_tabular"
    assert result.is_supported is True


def test_generic_csv_no_pre_mapping():
    with tempfile.NamedTemporaryFile(suffix=".csv", delete=False) as tmp:
        p = Path(tmp.name)
    _write_generic_csv(p)
    req = InspectInputRequest(dataset_path=str(p))
    result = inspect(req)
    # No pre-mapped fields for generic CSV
    assert result.pre_mapped_fields is not None


# ── Unsupported / missing ─────────────────────────────────────────────────


def test_missing_path_returns_unsupported():
    req = InspectInputRequest()
    result = inspect(req)
    assert result.is_supported is False


def test_user_hint_overrides_detection():
    with tempfile.NamedTemporaryFile(suffix=".csv", delete=False) as tmp:
        p = Path(tmp.name)
    _write_maskott_csv(p)
    req = InspectInputRequest(
        dataset_path=str(p),
        user_hints=UserHints(dataset_type="generic_csv_tabular"),
    )
    result = inspect(req)
    # User hint should override
    assert result.detected_format == "generic_csv_tabular"
