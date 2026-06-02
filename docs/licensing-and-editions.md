# Licensing and Edition Boundaries

## Community Edition License

The AffectLog Community Edition source code in this public repository is released under
the **MIT License**. See [LICENSE](../LICENSE) for the full text.

You may use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
of the software, subject to the MIT License conditions.

## What is Open Source

All of the following is open source and included in this repository:

- Complete dataset audit engine (`src/affectlog/`)
- All API route handlers
- All authentication and RBAC code
- All metric implementations (Gini, Coverage@K, sparsity, entropy, etc.)
- All model adapter framework code
- All recipe system and YAML configuration
- All export formats (SOP, JSON-LD, Data Card, etc.)
- All frontend UI code (`src/affectlog/frontend/`)
- All test fixtures and synthetic data generators
- Docker Compose and deployment configuration
- All documentation

## What is Not in This Repository

The following is **not** included in the public repository and may be proprietary
to AffectLog's managed hosting operations:

- Internal hosted infrastructure configuration (Kubernetes manifests, cloud-specific IaC)
- AffectLog-internal monitoring stack configuration
- Backup orchestration tooling beyond what is documented in `docs/managed-operations.md`
- Internal billing scaffolding (when/if active)
- Internal support access tooling beyond the protocol described in `docs/managed-operations.md`

## Community Edition Without AffectLog Cloud

The Community Edition is fully functional without AffectLog Cloud.

You can run the complete dataset audit workflow, model assessment, and compliance
export pipeline on your own hardware using the Docker Compose stack.
No AffectLog Cloud account, API key, or internet connection is required for core functionality.

## Managed Edition Services

AffectLog Managed Edition is a hosted service built on top of the Community Edition
open-source core. Organizations that use Managed Edition:

- Run on AffectLog-operated infrastructure
- Receive managed backups, monitoring, and support
- May use proprietary AffectLog operational tooling
- Are subject to AffectLog's service terms

Managed Edition does not restrict or remove any open-source features from the core.

## License Change Policy

> License changes must be reviewed by maintainers and all contributors
> before any public release. Any material change to the license of the
> community core requires explicit consent from contributors.

If a future license change is considered (e.g., AGPL, EUPL, or a Business Source
License), this will be discussed publicly via the governance process documented in
[GOVERNANCE.md](../GOVERNANCE.md).

## Raw Dataset Policy

Raw partner datasets are **never** committed to this repository.

Synthetic samples and schemas are provided for development, testing, and contribution.
See `data/samples/` and `scripts/generate_synthetic_maskott_csv.py`.

## Patent and Trademark Notice

The AffectLog name and logo are trademarks of AffectLog. Use of the MIT License
does not grant rights to AffectLog's trademarks.

## Citation

If you use AffectLog in academic work, please cite using [CITATION.cff](../CITATION.cff).
