"""User management schemas for admin endpoints."""
from __future__ import annotations

from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, EmailStr, Field


class PendingRegistrationOut(BaseModel):
    id: UUID
    full_name: str
    email: str
    organization: Optional[str]
    role_description: Optional[str]
    requested_access_profile: Optional[str]
    reason_for_access: Optional[str]
    agreed_to_coc: bool
    agreed_to_data_governance: bool
    status: str
    ip_address: Optional[str]
    created_at: datetime

    model_config = {"from_attributes": True}


class ApproveRegistrationRequest(BaseModel):
    role_name: str = "Viewer"
    workspace_slug: str = "default"
    access_expires_at: Optional[datetime] = None
    admin_notes: Optional[str] = None


class RejectRegistrationRequest(BaseModel):
    admin_notes: Optional[str] = None


class RequestMoreInfoRequest(BaseModel):
    questions: str = Field(..., min_length=10)


class AdminUserOut(BaseModel):
    id: UUID
    email: str
    full_name: str
    organization: Optional[str]
    is_active: bool
    is_superadmin: bool
    must_change_password: bool
    mfa_enabled: bool
    failed_login_count: int
    last_login_at: Optional[datetime]
    created_at: datetime
    roles: list[str] = []

    model_config = {"from_attributes": True}


class AssignRolesRequest(BaseModel):
    role_names: list[str]


class AuditLogEntryOut(BaseModel):
    id: int
    actor_email: Optional[str]
    action: str
    resource_type: Optional[str]
    resource_id: Optional[str]
    detail: Optional[str]
    ip_address: Optional[str]
    success: bool
    logged_at: datetime

    model_config = {"from_attributes": True}


class WorkspaceOut(BaseModel):
    id: int
    slug: str
    name: str
    description: Optional[str]
    is_public_samples: bool
    is_active: bool

    model_config = {"from_attributes": True}
