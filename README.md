# AffectLog – Trustworthy AI Assessment

[![CI](https://github.com/roy-saurabh/edge_affectlog/actions/workflows/ci.yml/badge.svg)](https://github.com/roy-saurabh/edge_affectlog/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Python 3.11+](https://img.shields.io/badge/python-3.11+-blue.svg)](https://www.python.org/)
[![OpenAPI 3.1](https://img.shields.io/badge/OpenAPI-3.1-green.svg)](docs/openapi.yaml)

**Open-source and managed Trustworthy AI assessment for education and skills data spaces.**  
Part of the [Prometheus-X Trustworthy AI Assessment ecosystem (BB04)](https://prometheus-x.org/bb04-trustworthy-ai-assessment/).

---

## Two ways to run AffectLog

### Community Edition — self-hosted open source

Self-hostable platform for universities, public-sector institutions, research labs,
EdTechs, data providers, and auditors who need local or on-premise execution.
Datasets remain under the control of the deploying institution.

```bash
git clone https://github.com/roy-saurabh/edge_affectlog
docker compose up
make seed && make create-admin
# → http://localhost:3000
```

### Managed Edition — AffectLog-operated

The same open-source platform hosted and operated by AffectLog.
Provides tenant provisioning, managed backups, monitoring, support,
managed email, usage metering, and optional enterprise services.

→ [Request managed access](https://affectlog.ai/request-access)

---

**Key statements:**

- The public repository contains the open-source Community Edition core.
- Managed Edition services may include proprietary operational components not included in this repository.
- The Community Edition core is fully usable without AffectLog Cloud.
- Raw partner datasets are never included. Synthetic samples are provided.
- Community Edition is MIT licensed.

---

---

## What is ALT-AI?

ALT-AI (AffectLog Trustworthy AI) implements D3.7 of the EDGE-Skills Prometheus-X project. It applies **at operation time** where an AI model and/or data pipeline exists, supporting:

- **Dataset–model interface profiling**: schema/PII inspection, xAPI normalization, sparsity/temporal/concentration indicators
- **Fairness metrics**: Gini index, Coverage@K, representation index, entity/resource dominance
- **Privacy-by-default**: HMAC-SHA256 pseudonymisation, PII detection, residual risk scoring
- **Compliance exports**: JSON-LD graph, Data Card (Gebru 2018), Model Card (Mitchell 2019), GDPR field inventory, EU AI Act Annex IV, SOP markdown
- **Scalable processing**: 1M+ rows via Polars lazy scanning, never loads full dataset into memory
- **Model explainability**: SHAP, permutation importance, multi-model comparison
- **PDC interoperability**: Mock and real Prometheus-X connector integration

---

## Dataset Privacy Warning

> **Raw partner datasets (Maskott/Tactileo, Inokufu/Becomino) are NOT included in this repository.**
>
> Only synthetic samples are committed under `data/samples/`. Real data must be placed under `data/raw/` (git-ignored) under a lawful data-sharing agreement.
> See [docs/data-governance.md](docs/data-governance.md).

---

## Quick Start

```bash
pip install -e ".[dev]"

# Generate 1M synthetic rows
affectlog generate-synthetic --rows 1000000 --output data/samples/maskott_1m.csv

# Validate
affectlog validate-csv --input data/samples/maskott_1m.csv --schema maskott_csv_v1

# Convert CSV → normalized xAPI JSONL (streaming)
affectlog convert-csv \
  --input data/samples/maskott_1m.csv \
  --recipe configs/recipes/maskott_tactileo.yaml \
  --output data/processed/maskott_1m.normalized.jsonl \
  --format jsonl --chunk-size 100000

# Run audit
affectlog audit \
  --input data/processed/maskott_1m.normalized.jsonl \
  --recipe configs/recipes/maskott_tactileo.yaml \
  --output runs/demo_1m

# Export compliance artifacts
affectlog compliance-export --run runs/demo_1m --format jsonld --output runs/demo_1m/compliance_graph.jsonld
affectlog sop --run runs/demo_1m --output runs/demo_1m/SOP.md

# Start API server + check health
affectlog serve --host 0.0.0.0 --port 8000
curl http://localhost:8000/healthz
curl http://localhost:8000/openapi.json
```

---

## Makefile Commands

| Command | Description |
|---|---|
| `make install` | Install all dependencies |
| `make test` | Run tests (excluding slow) |
| `make test-slow` | Run 1M-row performance tests |
| `make lint` | ruff check + format |
| `make typecheck` | mypy |
| `make security` | bandit + pip-audit |
| `make synthetic-1m` | Generate 1M synthetic rows |
| `make benchmark` | Full benchmark |
| `make docker-up` | Start with Docker Compose |

---

## Docker Compose

```bash
cp .env.example .env  # Edit AFFECTLOG_HASH_SECRET
docker compose up --build
curl http://localhost:8000/healthz
```

---

## Documentation

- [Architecture](docs/architecture.md)
- [API Reference](docs/api.md)
- [Data Governance](docs/data-governance.md)
- [Recipes](docs/recipes.md)
- [Model Adapters](docs/model-adapters.md)
- [Compliance Mapping](docs/compliance-mapping.md)
- [Privacy & Security](docs/privacy-and-security.md)

---

## License

MIT — see [LICENSE](LICENSE). Citation: [CITATION.cff](CITATION.cff).
