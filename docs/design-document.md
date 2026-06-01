# AffectLog's Trustworthy AI (ALT-AI) - Design Document

AffectLog's Trustworthy AI (ALT-AI) provides a set of tools for explaining, visualizing, and understanding complex machine learning models. It aims to facilitate model transparency, interpretability, and aid compliance with emerging regulatory standards (e.g., GDPR, EU AI Act). ALT-AI helps data scientists, analysts, and stakeholders interpret model predictions, identify feature importance, assess fairness, and evaluate whether models align with ethical and legal requirements.

## Technical Usage Scenarios & Features

ALT-AI supports both global (overall model behavior) and local (individual predictions) explanations. It helps users:

- Understand which features influence model outcomes the most  
- Compare different models for performance and fairness  
- Ensure no demographic group is disproportionately affected  

The toolbox is designed to be flexible and scalable, while prioritizing privacy, security, and compliance.

### Features/Main Functionalities

- **Model Explanation:** Provides global and local explanations to clarify how models derive their predictions.  
- **Feature Importance:** Quantifies each feature's impact, aiding interpretability and better feature selection/engineering decisions.  
- **Model Comparison:** Compares different models based on predefined metrics and segments, helping select the most suitable model.  
- **Fairness Analysis:** Evaluates models for fairness and potential biases across sensitive groups.

### Technical Usage Scenarios

- **Model Development & Validation:** Data scientists use ALT-AI to ensure models meet business, ethical, and regulatory standards before deployment.  
- **Audit & Compliance:** ALT-AI facilitates documentation and transparency required for audits, potentially aiding with GDPR adherence and upcoming EU AI Act considerations.  
- **Feature Engineering:** By understanding feature importance, practitioners can refine and enhance their model inputs.

## Requirements

- **R1:** MUST support integration with popular Python-based ML frameworks, including scikit-learn, and, where feasible, TensorFlow and PyTorch models via wrappers. Also supports numpy, pandas for data handling, and onnxruntime for ONNX models.  
- **R2:** MUST provide APIs for generating explanations, feature importance scores, and model comparisons.  
- **R3:** MUST ensure data privacy, security, and must not require access to raw personal data for explanation generation.  
- **R4:** SHOULD leverage partner infrastructure for scalability and handle large datasets and complex models efficiently.  

**Timeline:** Feasibility discussions (e.g., integration with Decentralized AI Training BB) are tentatively planned for Q1 2025. After these discussions, a more precise project timeline and roadmap will be established. A high-level work plan has been shared with the relevant Building Block (BB) and Work Package leader for consideration.

## Integrations

### Direct Integrations with Other BBs

- **Decentralized AI Training BB:** ALT-AI may integrate with models produced by the Decentralized AI Training BB to provide post-training analyses. Integration feasibility is subject to discussion with the Decentralized AI Training BB team. The intent is to securely retrieve the resulting trained models—under appropriate consent and policy enforcement via the Prometheus-X Data Space Connector (PDC)—and then perform AI risk assessment and explainability tasks.

### Integrations via Connector

- **Decentralized AI Training BB:** If deemed feasible, ALT-AI could access trained models through the PDC with secure connectors, enforcing ODRL policies and user consent frameworks. ALT-AI would operate on aggregated model artifacts rather than raw data, preserving privacy.

## Relevant Standards

- **Data Format Standards:** Adheres to common data exchange formats (JSON, CSV).  
- **Model Cards:** Follows Mitchell et al. (2019) to document model purpose, performance, and ethical considerations.  
- **Data Cards:** Follows Gebru et al. (2018) to document dataset provenance, collection methods, and known biases.  
- **GDPR Compliance:** ALT-AI operates on aggregated model artifacts and anonymized datasets.  
- **EU AI Act Alignment:** ALT-AI emphasizes fairness, transparency, and explainability.  
- **PDC Integration (If Feasible):** Respects ODRL policies and user consent frameworks in a data-minimized manner.  
- **Interoperability Standards:** Follows DSSC guidelines for data space interoperability.

## Input / Output Data

### Supported Model Types

- **Scikit-learn Models:** Directly supported via joblib or pickle serialization.  
- **ONNX Models:** Supported via onnxruntime wrappers.  
- **TensorFlow/Keras & PyTorch Models:** Supported by scikit-learn-like wrappers.

### Supported Data Formats

- **Tabular Data:** Pandas DataFrames or NumPy arrays are the primary input formats.  
- **CSV, JSON, Parquet:** For ingestion, with conversion to DataFrame/NumPy as needed.

## Architecture

ALT-AI comprises several components:

- **Model Adapter:** Adapts various types of ML models to a standardized format.  
- **Explanation Generator:** Generates explanations, feature importances, and comparisons.  
- **Results Processor:** Organizes explanation results for easy consumption.  
- **Security Layer:** Ensures privacy and security during explanation processes.

*(See `classDiagram-v1.1.png` for a class diagram, `sequenceDiagram-v1.1.png` for dynamic behavior.)*

## Configuration and Deployment Settings

- Configuration options: model type, explanation type (global/local), resource allocation.  
- Logging: includes process tracking, error handling, and performance metrics.  
- Usage limits: possible maximum on features, records, or model complexity.

## Third Party Components & Licenses

- **Pandas/Numpy:** BSD-3-Clause  
- **scikit-learn:** BSD-3-Clause  
- **TensorFlow:** Apache-2.0  
- **PyTorch:** BSD-style  
- **ONNX & onnxruntime:** MIT License

## Implementation Details

Built with flexibility, compliance, and scalability in mind. Integration feasibility with the Decentralized AI Training BB will be assessed in Q1 2025, after which a detailed roadmap will be provided.

## Partners & Roles

- **Prometheus-X Organization:** Governance and infrastructure frameworks.  
- **AffectLog:** Develops and maintains ALT-AI.  
- **Data Providers & Model Developers:** Supply data and models plus Data/Model Cards.  
- **End Users:** Data scientists, analysts, regulators for interpretability insights.

## Usage In The Dataspace

- **Interoperability:** Standard formats and documentation templates.  
- **Data Governance:** If integrated with Decentralized AI Training BB, leverages privacy-preserving infrastructure.  
- **Scalability & Regulatory Readiness:** Handles large datasets, monitors compliance with regulations (GDPR, EU AI Act).

## Leveraging AffectLog for Organizational Skill Gap Analysis

ALT-AI can interpret models for skill gap analysis, clarifying key features driving skill shortages and verifying fairness. If combined with decentralized training, privacy is enhanced.

## OpenAPI Specification

The implemented system exposes a full OpenAPI 3.1 specification at `/openapi.json` (served by the FastAPI backend) and committed at `docs/openapi.yaml`. Endpoints cover dataset ingestion, audit execution, model explanations, compliance exports, and PDC connector operations. The specification is validated in CI via `scripts/validate_openapi.sh`.

---

## Test Specification

The acceptance test criteria defined here are fulfilled by the automated test suite in `tests/`. Run with:

```bash
make test        # unit + integration (fast)
make test-slow   # 1 M-row performance benchmark
make security    # bandit static analysis + pip-audit
```

| **Requirement** | **Test Module** | **What Is Verified** |
| --------------- | -------------- | -------------------- |
| R1 — ML framework adapters | `tests/unit/test_model_adapters.py` | Each adapter (sklearn, ONNX, PyTorch, TF, HTTP, dummy) accepts a numpy input and returns a prediction dict |
| R2 — Explanation APIs | `tests/unit/test_explanations.py` | Feature importance, permutation importance, and multi-model comparison return correctly structured dicts |
| R2 — OpenAPI contract | `tests/integration/test_api_openapi_contract.py` | Live FastAPI server matches committed `docs/openapi.yaml` spec |
| R3 — PII detection | `tests/unit/test_pii_detection.py` | Regex patterns flag direct identifiers; known Maskott fields (`EntityId`, `ActivitySessionId`) detected |
| R3 — Pseudonymisation | `tests/unit/test_pseudonymizer.py` | HMAC-SHA256 output is deterministic for same key, non-reversible, and different across keys |
| R4 — Scalability | `tests/performance/test_synthetic_million_rows.py` | 1 M-row CSV processed end-to-end (ingest → profile → metrics) within time bound |
| Fairness metrics | `tests/unit/test_metrics_fairness.py`, `test_metrics_concentration.py`, `test_metrics_coverage.py` | Gini ∈ [0,1]; balance ratio ∈ [0,1]; Coverage@K monotonically non-decreasing with K |
| xAPI transform | `tests/unit/test_csv_to_xapi_transform.py`, `test_maskott_csv_schema.py` | Maskott CSV rows produce valid xAPI statements with required fields |
| Recipe pipeline | `tests/unit/test_recipes.py`, `tests/integration/test_cli_audit_pipeline.py` | YAML recipe loads, runs, and produces reproducible `config_hash` |
| JSON-LD export | `tests/unit/test_jsonld_export.py` | Output is valid JSON-LD with `@context`, `@type: AISystem`, and EU AI Act Annex IV fields |
| PDC connector | `tests/integration/test_pdc_mock.py` | Mock PDC server accepts ODRL-policy-gated requests and returns dataset catalog |

For a full capability-to-test mapping, D3.7 requirements traceability, and the formal TRL 5 evidence statement, see [docs/trl-assessment.md](trl-assessment.md).

---

## D3.7 Alignment

This design document is the conceptual baseline (TRL 1–2) for the EDGE-Skills WP3 D3.7 deliverable. The progression from concept to validated implementation follows this chain:

1. **This document** (`docs/design-document.md`) — requirements, architecture, standards alignment.
2. **D3.7 deliverable** (`docs/deliverables/D3.7-final-BB-Trustworthy AI.docx`) — scoped building-block description within the Trustworthy AI BB (alongside CARiSMA and LOLA), submitted to the EDGE-Skills consortium.
3. **Implementation** (`src/affectlog/`) — all R1–R4 requirements implemented; v0.1.0 released 2024-12-20.
4. **TRL assessment** (`docs/trl-assessment.md`) — formal TRL 5 evidence, D3.7 capability checklist, and verification procedure against production datasets.
