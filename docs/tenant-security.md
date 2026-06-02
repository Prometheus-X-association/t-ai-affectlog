# Tenant Security Model

## Overview

AffectLog's tenant security model is designed around three principles:

1. **Isolation** — tenant data cannot be accessed by other tenants
2. **Minimal privilege** — support staff have no permanent access to tenant data
3. **Full auditability** — every sensitive action within a tenant is logged

This document applies to the **Managed Edition** (multi-tenant). Community Edition
uses single-tenant mode and these policies apply to the single admin-managed instance.

## Tenant Isolation

### Database Layer

All tenant-scoped resources carry a `tenant_id` column indexed in the database.
SQLAlchemy queries in managed-mode routes are filtered by the authenticated user's
resolved `tenant_id` from `TenantMembership`.

Isolation is enforced at the service layer (not just UI). Changing a URL slug or
tenant identifier in a request **does not** grant access to another tenant's data.

### Authentication Layer

User sessions are bound to a single tenant context. Cross-tenant requests are
rejected with HTTP 403.

### Tests

Cross-tenant access denial is tested in `tests/test_tenant_isolation.py` (to be created).

## Role-Based Access Control

Within a tenant, roles enforce what each user can do:

| Role | Can run assessments | Can manage users | Can view audit log | Can grant support access |
|------|:-:|:-:|:-:|:-:|
| Tenant Owner | ✅ | ✅ | ✅ | ✅ |
| Tenant Admin | ✅ | ✅ | ✅ | ❌ |
| Tenant Auditor | Read only | ❌ | ✅ | ❌ |
| Tenant Researcher | ✅ | ❌ | Own actions | ❌ |
| Tenant Viewer | Read only | ❌ | ❌ | ❌ |

## Support Access Protocol

### Normal Operations

AffectLog support staff have **no access** to tenant environments in normal operations.

### When Support Access Is Required

1. The **tenant owner** creates a support access grant:
   - Reason (required)
   - Scope (required — what systems the support engineer can access)
   - Expiry date (required)
   - `raw_data_access` (defaults to `False`)

2. The grant is stored in `SupportAccessGrant` and logged in `TenantAuditLog`

3. The support engineer authenticates to the platform and their access is
   constrained to the grant's scope

4. All actions taken by the support engineer are written to `TenantAuditLog`
   with `actor_email` identifying the support staff member

5. Access expires automatically at `expires_at`

6. The tenant owner can revoke at any time

### Raw Dataset Access

By default, even with a support access grant, support staff **cannot access raw datasets**.

`raw_data_access = True` requires explicit opt-in by the tenant owner at grant creation.
This is audited and the tenant owner is notified.

### Break-Glass Procedure

A platform-level emergency access procedure exists but is:
- Not enabled by default
- Requires Platform Super Admin authorization
- Fully audited at both platform and tenant level
- Subject to post-incident review

Break-glass usage is never routine.

## Audit Logging

`TenantAuditLog` captures all sensitive events within a tenant:

- User login / logout
- Admin approvals and rejections
- Support access grants and revocations
- Dataset uploads and deletions
- Audit run creation and completion
- Artifact access and download
- Settings changes
- Role assignments

Audit logs are retained according to `TenantStoragePolicy.audit_log_retention_days`
(default: 365 days).

## Data Retention

Per-tenant retention policies are configured in `TenantStoragePolicy`:

```
artifact_retention_days    default: 90
audit_log_retention_days   default: 365
```

Community Edition does not enforce automated retention. Managed Edition enforces
retention via scheduled cleanup jobs.

## Encryption

- Passwords are hashed using bcrypt (minimum cost 12)
- SMTP passwords in `TenantSmtpSettings` are stored encrypted at rest
- TLS is required for all production endpoints
- S3 artifact storage uses server-side encryption

## Responsible Disclosure

Security vulnerabilities should be reported via GitHub's security advisory system.
See [SECURITY.md](../SECURITY.md).
