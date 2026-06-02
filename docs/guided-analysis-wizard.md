# Guided Assessment Wizard

## Purpose

The Guided Assessment Wizard is the primary client-facing workflow in AffectLog. It guides users through a complete, audit-ready dataset and model assessment while preventing invalid, unsupported, or misleading analyses.

Every available analysis, chart, export, and compliance artifact is derived from a central typed capability registry that is shared by both the backend (Python) and frontend (TypeScript). The frontend never invents analysis names not present in `/v1/capabilities`.

---

## Supported Workflows

| Workflow | Purpose constant | Description |
|---|---|---|
| Dataset Readiness | `dataset_readiness` | Schema validation, profiling, PII scan, completeness, data card |
| Privacy Audit | `privacy_audit` | PII detection, pseudonymisation benchmark, privacy risk profile |
| xAPI Harmonisation | `xapi_harmonisation` | xAPI compatibility check, Maskott CSV → xAPI transform |
| Fairness & Representation | `fairness_or_representation` | Gini, Coverage@K, representation index, fairness-by-group |
| Recommender Evaluation | `recommender_evaluation` | Precision/Recall/nDCG/HitRate@K, diversity, novelty |
| Model Explanation | `model_explanation` | SHAP global/local, PDP, model card |
| Model Comparison | `model_comparison` | Side-by-side performance and explanation comparison |
| Compliance Export | `compliance_export` | JSON-LD, SOP, CARiSMA, LOLA, PDC metadata |
| Full Audit | `full_audit` | All applicable analyses for the detected input |

---

## Unsupported Workflows

The wizard explicitly blocks and explains the following:

- Raw image, audio, or video datasets
- Unstructured free-text corpora without a tabular/vectorised wrapper
- Arbitrary NLP models without an adapter
- Computer vision models without a compatible adapter
- Time-series forecasting models unless represented as tabular features
- Streaming production monitoring (batch snapshots are supported)
- Legal compliance certification (AffectLog produces structured evidence, not certification)

---

## Wizard Steps

### Step 1 — Input Source

User selects the input mode (dataset-only or model-aware) and provides file paths or references for:
- Dataset (required)
- Model artifact or HTTP endpoint (optional)
- Prediction output CSV (optional)
- Ground-truth CSV (optional)

**Guardrails:** file extension validation, quota check, path traversal prevention, sensitive data warning.

### Step 2 — Format Detection

Backend inspects the uploaded file and detects:
- Format (maskott_csv_v1, becomino_json, generic_xapi_jsonl, etc.)
- Confidence score
- Row count estimate
- Field inventory
- xAPI compatibility score
- Maskott schema match score

User can override the detected format from the supported options.

### Step 3 — Schema Mapping

For Maskott CSV: all fields are pre-mapped automatically. For other formats, user maps:
- entity_field, item_field, timestamp_field, session_field, verb_field
- target_field, prediction_field (for ML tasks)
- group_field (for fairness analysis)

**Guardrails:** fairness-by-group requires group_field; classification requires target+prediction; temporal analyses require timestamp_field.

### Step 4 — Privacy Review

Displays detected identifier fields, PII flags, and planned privacy actions. Controls:
- HMAC pseudonymisation (default: on, enforced)
- Free-text redaction
- Timestamp precision suppression
- Raw export disabling (default: on, enforced)

**Guardrails:** privacy acknowledgement required before run; sensitive exports blocked without acknowledgement.

### Step 5 — Model Context (optional)

Only shown when a model was provided. User confirms:
- Adapter type, model task, feature schema availability
- Probability output availability (required for ROC/PR/Calibration)
- Class labels

### Step 6 — Analysis Scope

Three-column scope matrix:
- **Available now** — analyses that can run immediately
- **Available if you add more input** — conditional analyses with exact requirements
- **Out of scope for this input** — unsupported analyses with remediation guidance

### Step 7 — Plot Selection

Shows only plots valid for the selected analyses. Default plots are pre-selected based on the detected format. Each plot shows its required data, produced artifact, privacy level, and limitations.

### Step 8 — Output Contract

Pre-run contract showing: inputs, field mappings, privacy settings, selected analyses, selected plots, expected artifacts, limitations, and assumptions. User must confirm before running.

### Step 9 — Run Progress

Real-time pipeline monitoring: current stage, rows processed, warnings, errors.

### Step 10 — Results & Guidance

Shows what was analyzed, what was not, key findings, recommended next actions, and developer extension suggestions for unavailable analyses.

---

## Input Requirements

| Input | Required | Notes |
|---|---|---|
| Dataset file | Yes | CSV, JSON, JSONL, Parquet |
| Model artifact | No | Required for explanation analyses |
| Prediction CSV | No | Required for performance metrics |
| Ground-truth CSV | No | Required for Precision/Recall/nDCG |

---

## Field Mapping Guide

| Role | Semantic | Example fields |
|---|---|---|
| `entity_field` | Learner/user identifier | EntityId, user_id, actor |
| `item_field` | Resource/content | ResourceId, item_id, object.id |
| `timestamp_field` | Event date/time | AccessDate, timestamp, created_at |
| `session_field` | Session identifier | ActivitySessionId, session_id |
| `verb_field` | Action type | ViewContext, verb.id |
| `target_field` | Ground-truth label | label, outcome, pass_fail |
| `prediction_field` | Model prediction | pred, score, prediction |
| `group_field` | Fairness grouping | cohort, school_type, gender_declared |

---

## Privacy Review Guide

All privacy controls are enforced server-side:
1. Entity identifiers are HMAC-pseudonymised before any analysis
2. Raw identifier export is blocked by default
3. PII scan runs before all other analyses
4. Privacy acknowledgement is required before sensitive exports
5. All privacy decisions are logged to the audit manifest

---

## Model Context Guide

| Adapter | Formats | Supports SHAP | Supports PDP |
|---|---|---|---|
| sklearn_adapter | .pkl, .joblib | ✓ | ✓ |
| onnx_adapter | .onnx | Partial | ✗ |
| torch_adapter | .pt, .pth | ✓ | ✗ |
| tensorflow_adapter | .h5, .keras | Partial | ✗ |
| http_adapter | URL | ✗ | ✗ |

---

## Output Contract

The output contract is produced before execution and includes:
- Dataset and model summary
- Selected recipe, field mappings, privacy settings
- List of selected analyses and plots
- Expected artifacts (filename, format, privacy level)
- Limitations
- Assumptions
- Confirmation requirement

---

## Expected Artifacts

| Artifact | Description | Always produced |
|---|---|---|
| metrics.json | All computed metrics | ✓ |
| metrics.csv | Flat metrics for spreadsheets | ✓ |
| dashboard_payload.json | Dashboard visualisation payload | ✓ |
| audit_manifest.json | Signed manifest of inputs and artifacts | ✓ |
| SOP.md | Standard Operating Procedure | ✓ |
| data_card.json | Dataset documentation card | ✓ |
| compliance_graph.jsonld | EU AI Act Annex IV evidence graph | ✓ |
| model_card.json | Model documentation card | When model provided |
| privacy_report.json | Privacy risk report | When PII scan selected |
| transformed.jsonl | Normalised xAPI JSONL | When transform selected |

---

## Troubleshooting

**"Fairness-by-group" is greyed out**
→ No group field was mapped in Step 3. Return to Step 3 and map an ethically appropriate group/segment field.

**"ROC curve" is unavailable**
→ The model does not expose probability outputs. Confirm `has_probability_output = true` in Step 5.

**"Model explanations" are blocked**
→ No model was provided. Return to Step 1 and upload a compatible model artifact.

**"nDCG@K" is conditional**
→ Ranked prediction outputs and ground-truth interactions are required. Return to Step 1 and upload both files.

---

## Developer Extension Instructions

### Add a new supported format
1. Implement a reader in `src/affectlog/ingest/`
2. Register the format in `src/affectlog/capabilities/formats.py`
3. Add detection rules in `src/affectlog/ingest/schema_infer.py`
4. Mirror the format in `frontend/src/content/analysisCatalog.ts`

### Add a new analysis
1. Implement the analysis function in the appropriate metrics/analysis module
2. Register it in `src/affectlog/capabilities/analyses.py`
3. Wire it to a recipe stage in `configs/recipes/`
4. Add it to `frontend/src/content/analysisCatalog.ts`
5. Add contextual help in `src/affectlog/capabilities/help_text.py`

### Add a new model adapter
1. Implement the adapter in `src/affectlog/models/`
2. Register it in `src/affectlog/capabilities/models.py`
3. Add it to `frontend/src/content/analysisCatalog.ts`
