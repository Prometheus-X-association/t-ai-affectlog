# Managed Edition — Operations Guide

## Deployment Model

AffectLog Managed Edition is operated by AffectLog on behalf of tenant organizations.
The Managed Edition is built on the same open-source Community Edition core.

## Tenant Lifecycle

```
Request Managed Access (public form)
    ↓
Platform Admin reviews lead record
    ↓
Admin creates Tenant in platform console
    ↓
Tenant Owner receives onboarding invitation
    ↓
Tenant Owner invites org members
    ↓
Members complete admin-approved registration
    ↓
Active workspace with full assessment capabilities
```

## Multi-Tenant Architecture

All tenant data is isolated at the database level using `tenant_id` foreign keys.
Users cannot access other tenants by manipulating URL slugs or request headers.

Key tenant-scoped tables:
- `tenant_memberships` — user ↔ tenant association + role
- All domain tables (datasets, audit runs, artifacts, compliance exports, etc.)
  will include a `tenant_id` column in managed deployments

## Admin Hierarchy

| Role | What they can do |
|------|-----------------|
| Platform Super Admin | Full platform management, all tenants, all feature flags |
| Platform Operator | Tenant activation, feature flags, usage monitoring |
| Support Engineer | Time-limited, tenant-approved access only |
| Tenant Owner | Manage their workspace, grant support access |
| Tenant Admin | Manage workspace users and settings |
| Tenant Auditor | Read-only audit access within tenant |
| Tenant Researcher | Run assessments, view results |
| Tenant Viewer | View results only |

## Support Access Protocol

AffectLog support staff **do not** have permanent or blanket access to tenant data.

To obtain support access:
1. The **tenant owner** initiates a support access grant
2. They provide: reason, scope, and expiry date
3. The access grant is recorded in `SupportAccessGrant`
4. All support actions within the tenant are written to `TenantAuditLog`
5. `raw_data_access` defaults to `False` — support staff cannot access raw datasets
6. The grant expires automatically at `expires_at`
7. The tenant owner can revoke at any time

Break-glass procedures (platform-level emergency access) are documented internally
and require Super Admin authorization + are audited at the platform level.

## Feature Flags per Tenant

Platform operators can enable or disable individual features per tenant:

```
PATCH /api/platform/tenants/{tenant_id}/feature-flags
{
  "feature": "enterprise_sso",
  "enabled": true
}
```

Available features: see `src/affectlog/editions/features.py`

## Quotas

Default quotas per tenant (configurable in `TenantQuota`):

| Metric | Default |
|--------|---------|
| Audit runs per month | 100 |
| Rows per run | 5,000,000 |
| Storage (GB) | 10 |
| Jobs per day | 200 |
| API calls per hour | 1,000 |
| Model explanation runs | 50 |
| Export artifacts | 500 |

## Usage Metering

Usage is metered per tenant per calendar month in `UsageRecord`:
- Audit runs
- Rows processed
- Storage bytes used
- Jobs run
- Model explanation runs
- Exports generated
- API calls

Usage data is available via `GET /api/platform/usage` (platform admin)
and `GET /api/tenants/{tenant_id}/usage` (tenant admin).

## Email

In managed mode, AffectLog provides managed transactional email for:
- Registration and onboarding
- Approval and rejection notifications
- Invitation emails
- Password resets
- Support access notifications

Tenants with the `TENANT_SMTP` feature can optionally configure their own SMTP
via `TenantSmtpSettings`.

## Managed Request Access Flow

Public form at `/request-access` submits to `POST /api/public/request-managed-access`.

This creates a `ManagedAccessRequest` record (lead) in `pending` status.
**It does not automatically create an active tenant or send login credentials.**

Platform admin reviews leads at `GET /api/platform/access-requests` and
manually creates a tenant record when ready to onboard.

## Storage

Artifacts are stored per-tenant with a tenant-specific prefix:
```
tenant-{tenant_id}/audit-runs/{run_id}/artifacts/
```

Retention policies are configured in `TenantStoragePolicy`:
- `artifact_retention_days` (default: 90)
- `audit_log_retention_days` (default: 365)

## Observability

- Structured JSON logs tagged with `tenant_id` where available
- Platform usage records updated on each billable operation
- Tenant audit log (`TenantAuditLog`) captures all sensitive operations
- Health endpoint: `GET /api/health` (no auth required)
- System health (admin): `GET /api/admin/system`
