# Capability Registry

The capability registry is the single source of truth for all AffectLog analyses, plots, exports, model adapters, and format support. It is maintained in Python and exposed as a JSON API for frontend consumption.

## Location

- **Backend:** `src/affectlog/capabilities/`
- **API endpoint:** `GET /v1/capabilities`
- **Frontend catalogs:** `src/affectlog/frontend/src/content/`

## Registry Modules

| Module | Contents |
|---|---|
| `formats.py` | Supported and unsupported input formats |
| `analyses.py` | All analysis definitions |
| `plots.py` | All plot definitions |
| `exports.py` | All export artifact definitions |
| `models.py` | Model adapter definitions |
| `guardrails.py` | Guardrail rule functions |
| `compatibility.py` | Format × analysis compatibility matrix |
| `help_text.py` | Step and analysis contextual help |
| `registry.py` | Central registry class and public helpers |

## Adding a Capability

1. Add the definition to the appropriate module (e.g., `analyses.py`)
2. Import it in `registry.py` if needed
3. Mirror it in the corresponding frontend catalog TypeScript file
4. Add contextual help in `help_text.py`
5. Update the compatibility matrix in `compatibility.py`
6. Add tests in `tests/unit/test_capability_registry.py`

## API Response Shape

```json
{
  "formats": [...],
  "unsupported_formats": [...],
  "analyses": [...],
  "plots": [...],
  "exports": [...],
  "model_adapters": [...],
  "compatibility": {
    "rows": [...],
    "columns": [...],
    "matrix": {
      "maskott_csv_v1": {
        "schema_validation": { "state": "supported", "note": "" },
        ...
      }
    }
  }
}
```

## Compatibility Cell States

| State | Meaning |
|---|---|
| `supported` | Analysis runs immediately for this format |
| `supported_with_mapping` | Available after field mapping confirmation |
| `requires_additional_input` | Needs model, predictions, ground truth, or group field |
| `not_applicable` | Technically not applicable for this input type |
| `unsupported` | Cannot be performed — provides developer extension path |
