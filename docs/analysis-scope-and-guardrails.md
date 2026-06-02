# Analysis Scope and Guardrails

## Scope Model

Every analysis has one of three scope states for a given input:

| State | Meaning |
|---|---|
| **Available** | All required fields, format, and inputs are present |
| **Conditional** | Becomes available if additional input is provided |
| **Out of scope** | Cannot run for this input — developer extension path provided |

## Guardrail Rules

Guardrails are evaluated server-side during `POST /v1/wizard/validate-plan`. Each rule produces a `block`, `warn`, or `info` issue.

| Rule ID | Severity | Condition |
|---|---|---|
| `fairness_requires_group` | BLOCK | fairness_by_group selected without group_field |
| `classification_requires_labels` | BLOCK | classification analysis without target+prediction |
| `regression_requires_numeric_target` | BLOCK | regression with non-numeric target |
| `recommender_requires_predictions` | BLOCK | recommender metrics without prediction file |
| `recommender_requires_ground_truth` | BLOCK | precision/recall/nDCG without ground truth |
| `explanation_requires_model` | BLOCK | explanation analysis without model |
| `roc_pr_requires_probabilities` | BLOCK | ROC/PR/calibration without probability output |
| `temporal_requires_timestamp` | WARN | temporal analysis without timestamp field |
| `xapi_transform_requires_maskott` | BLOCK | xAPI transform on non-Maskott format |
| `privacy_acknowledgement_required` | BLOCK | sensitive export without privacy acknowledgement |
| `quota_exceeded` | BLOCK | file larger than tenant quota |
| `unsupported_extension` | BLOCK | blocked file extension |
| `no_analyses_selected` | BLOCK | empty analysis selection |
| `unknown_analysis` | BLOCK | analysis ID not in registry |
| `unknown_plot` | BLOCK | plot ID not in registry |
| `unsupported_format` | BLOCK | format in unsupported list |
| `unrecognised_format` | WARN | format not in registry |

## Unsupported Format Messages

When an unsupported format is detected, the wizard shows:

> "This input is outside the current AffectLog analysis scope. AffectLog currently supports structured/tabular datasets, xAPI-style educational traces, pre-trained tabular ML models, and compatible prediction outputs. Convert this input into a structured representation or add a new adapter/recipe."

Each unsupported format also provides an `extension_path` describing how to add support.

## Analysis Unavailability Messages

Each analysis has an `unavailable_message` that is shown when the analysis is blocked:

- `model_feature_importance`: "Model explanations are unavailable because no compatible model artifact or endpoint was supplied."
- `fairness_by_group`: "Fairness-by-group is unavailable because no group/segment field was selected."
- `recommender_ndcg_at_k`: "nDCG@K requires a ranked recommendation list and ground-truth interaction set."
- `temporal_density_profile`: "Temporal density profile requires a timestamp field."

## Legal Compliance Scope

AffectLog generates structured audit evidence and compliance metadata. It does not certify legal compliance. The output contract always includes:

> "Legal compliance certification is outside scope; AffectLog generates structured evidence and audit metadata, not legal certification."
