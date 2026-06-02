"""
Editions and managed-access public API endpoints.
No authentication required.

  GET  /api/public/editions
  GET  /api/public/cloud
  POST /api/public/request-managed-access
"""
from __future__ import annotations

import logging
from typing import Any, Optional

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, EmailStr
from sqlalchemy.ext.asyncio import AsyncSession

from affectlog.db.session import get_db
from affectlog.editions.base import get_deployment_mode, get_tenant_mode, get_edition_defaults
from affectlog.editions.features import Feature

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/public", tags=["public"])


class ManagedAccessRequestIn(BaseModel):
    name: str
    email: EmailStr
    organization: str
    country: str
    sector: str
    intended_use: str
    expected_volume: Optional[str] = None
    deployment_pref: str = "managed_cloud"
    compliance_needs: Optional[str] = None
    message: Optional[str] = None
    consent: bool


@router.get("/editions")
async def editions_info() -> dict[str, Any]:
    mode = get_deployment_mode()
    tenant_mode = get_tenant_mode()
    defaults = get_edition_defaults()
    return {
        "deployment_mode": mode,
        "tenant_mode": tenant_mode,
        "edition": {
            "community": mode == "community",
            "managed": mode in ("managed", "enterprise_private"),
        },
        "features": {
            "multi_tenant":    defaults.get(Feature.MULTI_TENANT, False),
            "managed_backups": defaults.get(Feature.MANAGED_BACKUPS, False),
            "support_access":  defaults.get(Feature.SUPPORT_ACCESS, False),
            "enterprise_sso":  defaults.get(Feature.ENTERPRISE_SSO, False),
        },
        "links": {
            "community_edition": "https://github.com/Prometheus-X-association/t-ai-affectlog",
            "managed_edition":   "/cloud",
            "request_access":    "/request-access",
            "prometheus_x":      "https://prometheus-x.org/bb04-trustworthy-ai-assessment/",
        },
    }


@router.get("/cloud")
async def cloud_info() -> dict[str, Any]:
    return {
        "name": "AffectLog Managed Edition",
        "description": (
            "AffectLog-hosted and operated environment for organizations "
            "that want the same assessment workflows without managing infrastructure."
        ),
        "features": [
            "Multi-tenant workspace provisioning",
            "Admin-approved organization onboarding",
            "Managed backups and retention policies",
            "Platform monitoring and structured audit logs",
            "Managed email and notifications",
            "Usage metering and quota enforcement",
            "Support and upgrade path",
            "Optional private tenant deployment",
        ],
        "contact": "/request-access",
        "open_source_core": "https://github.com/Prometheus-X-association/t-ai-affectlog",
    }


@router.post("/request-managed-access", status_code=status.HTTP_201_CREATED)
async def request_managed_access(
    body: ManagedAccessRequestIn,
    db: AsyncSession = Depends(get_db),
) -> dict[str, str]:
    if not body.consent:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Consent is required.",
        )
    try:
        from affectlog.tenancy.models import ManagedAccessRequest
        req = ManagedAccessRequest(
            name=body.name,
            email=str(body.email),
            organization=body.organization,
            country=body.country,
            sector=body.sector,
            intended_use=body.intended_use,
            expected_volume=body.expected_volume,
            deployment_pref=body.deployment_pref,
            compliance_needs=body.compliance_needs,
            message=body.message,
            status="pending",
        )
        db.add(req)
        await db.flush()
        logger.info("Managed access request from %s (%s)", body.email, body.organization)
        return {
            "status": "received",
            "message": "Your request has been received. Our team will contact you within 2 business days.",
        }
    except Exception as exc:
        logger.error("Failed to save access request: %s", exc)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to save request. Please try again.",
        ) from exc
