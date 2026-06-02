# Client Input Guide

## Accepted Dataset Formats

| Format | Extensions | Description |
|---|---|---|
| Maskott CSV v1 | .csv | Maskott/Tactileo educational platform export. All fields pre-mapped. |
| Becomino JSON | .json | Becomino platform activity export with templated structures. |
| Generic xAPI JSON | .json | Standard xAPI statement array (ADL spec). |
| Generic xAPI JSONL | .jsonl, .ndjson | xAPI statements in newline-delimited JSON. |
| Generic CSV | .csv, .tsv | Any structured CSV with a header row. Requires field mapping. |
| Parquet | .parquet, .pq | Apache Parquet columnar format. |

## Accepted Model Formats

| Format | Extensions | Adapter | Explanation Support |
|---|---|---|---|
| scikit-learn | .pkl, .joblib | sklearn_adapter | Full SHAP |
| ONNX | .onnx | onnx_adapter | Permutation only |
| PyTorch | .pt, .pth | torch_adapter | Gradient attribution |
| TensorFlow/Keras | .h5, .keras | tensorflow_adapter | Partial |
| HTTP Endpoint | URL | http_adapter | None by default |

## Maskott CSV Schema

The following fields are required for full analysis coverage:

| Field | Type | Role |
|---|---|---|
| `_id` | String | Record identifier (pseudonymised) |
| `AccessDate` | Timestamp | Event timestamp |
| `ViewContext` | String | Activity verb / view type |
| `ResourceId` | String | Item / resource identifier |
| `ResourceType` | String | Content type category |
| `CollectionId` | String | Collection / playlist identifier |
| `ActivitySessionId` | String | Session identifier (pseudonymised) |
| `Duration` | Number | Interaction duration (seconds) |
| `EntityId` | String | Entity / learner identifier (pseudonymised) |
| `EntityUaiCode` | String | Institution code (quasi-identifier) |
| `IsViewerAuthor` | Boolean | Author flag |
| `IsViewerAnonymous` | Boolean | Anonymity flag |

## Generic Dataset Field Mapping Guide

For datasets not matching a known schema, map the following roles:

| Role | Semantic | Required For |
|---|---|---|
| `entity_field` | Learner/user identifier | All entity-level metrics |
| `item_field` | Resource/content identifier | Coverage@K, Gini, long-tail |
| `timestamp_field` | Event date/time | Temporal analyses |
| `session_field` | Session identifier | Session density |
| `target_field` | Ground-truth label | Classification/regression metrics |
| `prediction_field` | Model prediction output | Performance metrics |
| `group_field` | Fairness/cohort grouping | Fairness-by-group |

## Sample Files

Sample datasets for testing are available in `data/samples/`:
- `maskott_csv_sample.csv` — 1,000-row Maskott CSV example
- `xapi_sample.jsonl` — 500-statement generic xAPI JSONL example
- `tabular_sample.csv` — Generic tabular CSV example

## File Size Limits

- Direct upload: configurable per tenant (default 500 MB)
- Recommended max rows for interactive wizard: 5,000,000 rows
- Large files (> 1M rows) are processed with statistical sampling where indicated

## Privacy Requirements

Before uploading any dataset:
1. Confirm you have a valid legal basis for processing under applicable data protection regulations
2. Ensure entity identifiers are either pseudonymised at source or will be pseudonymised by AffectLog
3. Obtain necessary consents or document the legitimate interest basis
4. Confirm that group/segment fields used in fairness analysis are ethically appropriate and lawfully collected
