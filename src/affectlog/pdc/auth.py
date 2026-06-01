"""PDC authentication helpers (stub)."""

from __future__ import annotations


def get_bearer_token(_pdc_url: str, _client_id: str, _client_secret: str) -> str | None:
    """Obtain a bearer token from the PDC OAuth endpoint (stub)."""
    # In production: POST to pdc_url/oauth/token with client credentials
    return None
