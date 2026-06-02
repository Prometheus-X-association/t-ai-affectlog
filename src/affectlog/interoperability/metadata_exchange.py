"""Generic metadata exchange utilities for ecosystem interoperability."""
from __future__ import annotations

from typing import Any


def build_exchange_envelope(
    source: str,
    destination: str,
    payload: dict[str, Any],
    run_id: str = "",
) -> dict[str, Any]:
    """Wrap a metadata payload in a standard exchange envelope."""
    from datetime import datetime, timezone
    return {
        "envelopeVersion": "1.0",
        "source": source,
        "destination": destination,
        "runId": run_id,
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "payload": payload,
    }
