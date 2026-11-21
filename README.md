# Personal Portfolio

Live website: https://nithishkumar.pages.dev/

GitHub Pages mirror: https://nithishkumar2022020.github.io/

Repository: https://github.com/nithishkumar2022020/nithishkumar2022020.github.io

Nithish Kumar Reddy — Generative AI Engineer. Built from the supplied HTML mockup, with animated canvas visualizers, project case studies, technology filters, and an Info view.

## Preview

Run `python3 -m http.server 4173` and open http://localhost:4173.

The committed HTML and CSS can be hosted directly on any static host. Google Fonts requires an internet connection.

## Update styles

Run `npm install`, then `npm run build:css` after changing utility classes in index.html.

The implementation blueprint is included for reference.

## Synqra project content

Synqra is a deployed hybrid RAG application with a Flutter experimentation client, FastAPI backend, Gemini generation, BM25/dense retrieval with RRF, page citations, R2 documents, and Milvus/Zilliz vectors. EC2, Docker Compose, Nginx HTTPS, Cognito JWT auth, and GitHub Actions/GHCR form the deployment foundation.

The RAG foundation is Core Complete. Cloud infrastructure, security, and observability are In Progress: existing application logs and health checks should not be described as completed CloudWatch integration, custom metrics, dashboards, or alerts. Event-driven log processing, AI incident investigation, agentic workflows, and an observability MVP are Planned. Flutter will evolve into a remote monitoring companion; backend services will run processing and investigations.

Keep the project card, case study, `assets/synqra-roadmap.json`, demo introduction, and resume consistent when updating status. The embedded demo demonstrates the RAG foundation with sample data and simulated responses, without backend AI calls. It does not demonstrate the planned observability platform.

Rebuild the downloadable resume from `resume.html` using `python3 tools/build-resume-pdf.py` in an environment with ReportLab. The builder uses Arial fonts from the macOS system font directory.
