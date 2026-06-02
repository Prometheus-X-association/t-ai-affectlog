"""
Security audit logging — write immutable audit trail entries to DB.
"""
from __future__ import annotations

import uuid
from datetime import datetime, timezone
from typing import Optional

from sqlalchemy.ext.asyncio import AsyncSession

from affectlog.db.models import AuditLogEntry


async def log_event(
    db: AsyncSession,
    action: str,
    *,
    actor_id: Optional[uuid.UUID] = None,
    actor_email: Optional[str] = None,
    resource_type: Optional[str] = None,
    resource_id: Optional[str] = None,
    detail: Optional[str] = None,
    ip_address: Optional[str] = None,
    success: bool = True,
) -> None:
    entry = AuditLogEntry(
        actor_id=actor_id,
        actor_email=actor_email,
        action=action,
        resource_type=resource_type,
        resource_id=resource_id,
        detail=detail,
        ip_address=ip_address,
        success=success,
        logged_at=datetime.now(timezone.utc),
    )
    db.add(entry)
    await db.flush()
