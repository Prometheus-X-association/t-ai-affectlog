# ADR 0006: Public Homepage and Branding

## Status
Accepted

## Context

AffectLog is both a project deliverable and a public open-source product. The public-facing homepage must:
- Present the platform accurately for external audiences
- Not expose internal project identifiers (deliverable numbers, TRL levels)
- Acknowledge EU funding correctly
- Not misuse EU or Prometheus-X branding
- Be maintainable by non-developers (content separated from components)

## Decision

**Content/component separation**:
- All homepage copy in `frontend/src/content/homepage.ts` as typed objects
- Components render from content file — no hardcoded strings in JSX
- Maintainers edit content without touching React components

**EU funding acknowledgement** (following Digital Europe Programme guidelines):
- "Co-funded by the European Union" — neutral, accurate statement
- No claim of European Commission endorsement beyond project funding
- Footer links to EDGE-Skills project page, Prometheus-X BB04, and GitHub
- Placeholder SVG brand assets with clear replacement instructions

**Forbidden terms on public homepage**:
- D3.7, deliverable numbering, TRL levels, "reporting period"
- These belong in `docs/deliverable-final-pack.md` (maintainer-only)

**Test enforcement**:
- `test_email_templates.py` and `tests/e2e/developer-homepage.spec.ts` verify no forbidden terms appear

## Consequences

- Homepage requires separate content review from code review
- Brand assets (EU, EDGE-Skills, Prometheus-X, AffectLog logos) must be replaced with official versions before public release
- Logo placement instructions documented in `docs/edge-skills-branding.md`
