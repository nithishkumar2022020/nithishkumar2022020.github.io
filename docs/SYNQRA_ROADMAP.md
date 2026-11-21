# Synqra portfolio roadmap

The reusable `<project-roadmap src="…">` component loads structured milestone content from `assets/synqra-roadmap.json`. Native details/summary elements provide keyboard-operable disclosure without dependencies. Statuses are editorial data and never derived from time.

## Evidence and status boundaries

Backend source reviewed: `nithishkumar2022020/RAG_BACKEND`, commit `31ec5aeeff581bbca7185b778d17a924e65332e3`.

- `app/main.py`: application logging for ingestion/query failures and a public `/health` endpoint.
- `app/services/rag.py`: retrieval and ingestion log calls.
- `docker-compose.yml` and `docker-compose.prod.yml`: API and Nginx health checks.
- `.github/workflows/ci.yml`: Python checks, offline evaluation, GHCR image publication, and EC2 deployment configuration.
- `app/core/auth.py`, `app/stores/document_storage.py`, and the project documentation provide the authentication and storage context already reported in the portfolio and request.
- `docs/PROJECT_DOCUMENTATION.md` lists production-grade observability/logging as a limitation. The reviewed tree and application configuration do not establish completed CloudWatch delivery, structured JSON logging, custom metric publication, dashboards, or alerting.

The roadmap therefore distinguishes existing log calls and health checks from ongoing observability work. This is source verification, not an audit of the live AWS account. Existing claims that all CloudWatch instrumentation was complete were corrected within the Synqra card and case study.

The portfolio's interactive demo continues to use mock data; it is separate from the deployed backend's authentication and infrastructure capabilities. Existing demo links, project description, technology badges, and visualizers remain available.

## Editing

Update the JSON to change milestone copy or implementation state. Keep M1 Core Complete, M2 In Progress, and M3–M6 Planned unless there is implementation evidence for a change. Do not add dates, deadlines, forecast durations, or unsupported completion percentages. Keep detailed technical material in the expandable groups rather than duplicating the existing overview and stack.
