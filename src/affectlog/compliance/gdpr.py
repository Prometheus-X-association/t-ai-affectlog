"""GDPR-oriented field inventory and compliance mapping."""

from __future__ import annotations

from pathlib import Path
from typing import Any

MASKOTT_GDPR_FIELD_INVENTORY: list[dict[str, Any]] = [
    {
        "field": "_id",
        "category": "identifier",
        "gdpr_personal": True,
        "action": "hash",
        "basis": "pseudonymisation",
    },
    {
        "field": "AccessDate",
        "category": "temporal",
        "gdpr_personal": False,
        "action": "retain",
        "basis": "aggregation",
    },
    {
        "field": "ViewContext",
        "category": "activity",
        "gdpr_personal": False,
        "action": "retain",
        "basis": "aggregation",
    },
    {
        "field": "ResourceId",
        "category": "resource",
        "gdpr_personal": False,
        "action": "retain",
        "basis": "aggregation",
    },
    {
        "field": "ResourceType",
        "category": "resource_meta",
        "gdpr_personal": False,
        "action": "retain",
        "basis": "aggregation",
    },
    {
        "field": "CollectionId",
        "category": "group",
        "gdpr_personal": False,
        "action": "retain",
        "basis": "aggregation",
    },
    {
        "field": "ActivitySessionId",
        "category": "session",
        "gdpr_personal": True,
        "action": "hash",
        "basis": "pseudonymisation",
    },
    {
        "field": "Duration",
        "category": "behavioral",
        "gdpr_personal": False,
        "action": "retain",
        "basis": "aggregation",
    },
    {
        "field": "EntityId",
        "category": "identifier",
        "gdpr_personal": True,
        "action": "hash",
        "basis": "pseudonymisation",
    },
    {
        "field": "EntityUaiCode",
        "category": "quasi_identifier",
        "gdpr_personal": True,
        "action": "hash",
        "basis": "pseudonymisation",
    },
    {
        "field": "IsViewerAuthor",
        "category": "role",
        "gdpr_personal": False,
        "action": "retain",
        "basis": "aggregation",
    },
    {
        "field": "IsViewerAnonymous",
        "category": "anonymity_flag",
        "gdpr_personal": True,
        "action": "retain_flag_only",
        "basis": "necessity",
    },
]


def export_field_inventory(output_path: Path | str) -> None:
    out = Path(output_path)
    out.parent.mkdir(parents=True, exist_ok=True)
    import csv

    with out.open("w", newline="") as f:
        writer = csv.DictWriter(
            f, fieldnames=["field", "category", "gdpr_personal", "action", "basis"]
        )
        writer.writeheader()
        writer.writerows(MASKOTT_GDPR_FIELD_INVENTORY)
