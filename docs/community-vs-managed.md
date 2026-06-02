# Community Edition vs Managed Edition

## Relationship

Both editions are built from the same open-source codebase.

The **Community Edition** is what you deploy yourself from the public repository.
The **Managed Edition** is the same platform operated by AffectLog as a hosted service.

There is no "demo vs enterprise" split. Community Edition is a fully functional,
production-grade platform. Managed Edition adds hosted infrastructure and operational
services on top of the same core.

## Community Edition

**License:** MIT  
**Deployment:** Self-hosted, local, or on-premise  
**Suitable for:** Universities, public-sector institutions, research labs, EdTechs,
data providers, auditors who need local execution where datasets stay under institutional control.

**What you get:**
- Full dataset audit workflow (ingest, validate, PII scan, normalize, profile, metrics, export)
- xAPI verb normalization and event profiling
- GDPR-aware PII scanning and pseudonymisation
- Gini, Coverage@K, dominance ratio, entropy, representation index metrics
- Model adapter framework (scikit-learn, PyTorch, custom APIs)
- SOP report, Data Card, JSON-LD compliance graph exports
- OpenAPI-first FastAPI backend
- RBAC with admin-approved registration
- Docker Compose deployment (api + worker + postgres + redis + frontend)
- Celery async job processing
- Synthetic sample datasets for development and testing
- YAML-defined assessment recipes
- GitHub Actions CI
- Local artifact storage (S3-compatible optional)

**What you do not need:**
- AffectLog Cloud
- AffectLog support subscription
- Any payment

**Raw dataset handling:**
Datasets are never committed to the repository. Synthetic samples are provided for
testing. Real datasets remain under your institution's control in your deployment.

## Managed Edition

**Operated by:** AffectLog  
**Suitable for:** Organizations that want the same assessment workflows without managing infrastructure.

**What AffectLog manages:**
- Hosting, server, database, and worker infrastructure
- Multi-tenant workspace provisioning
- Admin-approved organization onboarding and domain allowlisting
- Automatic backups with configurable retention
- Platform monitoring and uptime status
- Managed email and notification delivery
- Usage metering, quota enforcement, and reporting
- Security updates and platform upgrades
- Optional dedicated tenant / bring-your-own-cloud deployment

**What is proprietary (not in the public repository):**
- Hosted infrastructure configuration
- Platform-level monitoring stack
- Backup orchestration scripts
- Billing scaffolding (placeholder, not active)
- Internal support tooling

**What remains open-source even in managed mode:**
- All assessment engine code
- All API route handlers
- All metric implementations
- All model adapters
- All recipe system code
- All export formats

## Choosing an Edition

| Need | Community Edition | Managed Edition |
|------|:-:|:-:|
| Datasets must stay on-premise | ✅ | — |
| No cloud dependency | ✅ | — |
| Fastest path to a running system | — | ✅ |
| No infrastructure to maintain | — | ✅ |
| Multi-tenant organization workspaces | — | ✅ |
| Admin-approved onboarding with org flow | — | ✅ |
| Managed backups and monitoring | — | ✅ |
| SLA-ready operational support | — | ✅ |
| Free forever | ✅ | — |
| Contribution and extension friendly | ✅ | ✅ |

## License and Edition Boundaries

Community Edition source code in the public repository is released under the **MIT License**.

Managed Edition services may include proprietary operational components **not included in
this repository**. The core remains fully usable without AffectLog Cloud.

See also: [docs/licensing-and-editions.md](./licensing-and-editions.md)
