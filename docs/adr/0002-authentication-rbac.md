# ADR 0002: Authentication and RBAC Architecture

## Status
Accepted

## Context

AffectLog is a multi-tenant assessment platform handling potentially sensitive educational dataset metadata. It requires:
- Admin-controlled user onboarding (not open self-registration)
- Fine-grained access control scoped to workspaces
- Secure sessions that survive page reloads
- Email-based activation for new accounts
- Audit trail for all auth events

## Decision

**Session-cookie auth** over JWT:
- HttpOnly, SameSite=Lax cookies prevent XSS token theft
- Server-side session revocation is immediate (JWT cannot be revoked before expiry)
- Sessions stored in PostgreSQL with SHA-256 hashed tokens

**Argon2id password hashing** with configurable pepper:
- Current best practice for password hashing
- Pepper adds HSM-like protection if DB is compromised alone
- bcrypt acceptable only as fallback

**Permission-based RBAC** (not role-name checks):
- Roles are collections of permissions stored in DB
- Route guards check `permission:name` strings, not role names
- Roles can be modified without code changes
- Superadmin shortcut bypasses DB lookups for performance

**Workspace tenancy**:
- All dataset/run/model artifacts scoped to a workspace
- Users must be members of a workspace to access its artifacts
- Superadmins have cross-workspace access

**Admin-approval flow**:
- Prevents spam and unauthorised access to sensitive assessment tools
- `PendingRegistration` table decoupled from `User` table
- Activation tokens: 24h TTL, single-use, SHA-256 hashed in DB, plaintext shown/emailed exactly once

## Consequences

- Slightly more complex onboarding than open registration
- Admin must be bootstrapped via CLI before any users can register
- Sessions require DB lookup on every request (mitigated by connection pooling)
- Cookie auth requires CSRF protection on state-changing requests (handled by SameSite=Lax)
