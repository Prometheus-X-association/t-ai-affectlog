# ADR 0005: OpenAPI and PDC Interoperability

## Status
Accepted

## Context

AffectLog must integrate with the Prometheus-X data space ecosystem and expose a machine-readable API contract for external tools, connectors, and the CARiSMA/LOLA integration stubs.

## Decision

**OpenAPI 3.1** (not 3.0):
- JSON Schema draft 2020-12 support
- Better discriminated union and nullable handling
- Generated automatically by FastAPI from route type hints and Pydantic v2 models

**PDC mock server**:
- A local mock of the Prometheus-X Data Space Connector (PDC)
- Allows development and testing without a live Prometheus-X instance
- ODRL policy evaluation scaffold included

**CARiSMA/LOLA as metadata-exchange stubs**:
- No live service calls unless endpoint explicitly configured
- JSON schema defines the exchange format
- Import endpoints allow CARiSMA/LOLA results to be ingested as external evidence

## Consequences

- All API changes automatically reflected in `/docs` and `/openapi.json`
- Third-party tools can generate clients from the OpenAPI spec
- PDC integration can be upgraded to live mode by setting `AFFECTLOG_PDC_URL`
- CARiSMA/LOLA live integration requires partner service endpoints (not yet available publicly)
