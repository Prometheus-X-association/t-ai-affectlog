# Wizard Error Handling

## Design Principles

1. Stack traces are never shown to users
2. Every error has a user-facing title, explanation, and remediation
3. Every error identifies the affected step
4. Recoverable errors allow the user to fix and retry
5. All diagnostic detail is logged server-side with request ID and tenant ID

## Error Codes

| Code | Title | Recoverable |
|---|---|---|
| `UNSUPPORTED_FORMAT` | Unsupported input format | No |
| `MISSING_REQUIRED_FIELD` | Required field not mapped | Yes |
| `AMBIGUOUS_SCHEMA` | Schema ambiguous | Yes |
| `INVALID_FIELD_MAPPING` | Invalid field mapping | Yes |
| `PRIVACY_RISK_BLOCKED` | Privacy risk blocks export | Yes |
| `UNSUPPORTED_MODEL_ADAPTER` | Model adapter not supported | No |
| `MISSING_MODEL` | Model artifact required | Yes |
| `MISSING_PREDICTION` | Prediction output required | Yes |
| `MISSING_GROUND_TRUTH` | Ground truth required | Yes |
| `MISSING_GROUP_FIELD` | Group field required | Yes |
| `TASK_TYPE_MISMATCH` | Task type mismatch | Yes |
| `QUOTA_EXCEEDED` | File exceeds tenant quota | No |
| `FILE_TOO_LARGE` | File too large for upload | No |
| `INVALID_RECIPE` | Invalid analysis recipe | Yes |
| `PLOT_UNAVAILABLE` | Plot unavailable | Yes |
| `ANALYSIS_UNAVAILABLE` | Analysis unavailable | Yes |
| `EXPORT_BLOCKED` | Export blocked by privacy controls | Yes |
| `TENANT_PERMISSION_DENIED` | Permission denied | No |
| `CROSS_TENANT_ACCESS_DENIED` | Cross-tenant access denied | No |
| `JOB_EXECUTION_ERROR` | Analysis job failed | No |
| `RECOVERABLE_STAGE_ERROR` | Analysis stage warning | Yes |

## Error Schema

```python
class WizardError(BaseModel):
    code: WizardErrorCode
    title: str
    what_happened: str
    why_it_matters: str
    how_to_fix: str
    affected_step: int | None
    recoverable: bool
    analysis_id: str | None
    plot_id: str | None
    field_name: str | None
    support_reference_id: str | None
```

## Creating Errors

```python
from affectlog.wizard.errors import make_error, WizardErrorCode

error = make_error(
    WizardErrorCode.MISSING_GROUP_FIELD,
    analysis_id="fairness_by_group",
    support_reference_id=request_id,
)
```

## Server-Side Logging

All errors are logged with:
- `request_id` (from `X-Request-ID` header)
- `tenant_id` (from authenticated session)
- Full exception traceback
- Input parameters (sanitised — no raw personal data)
