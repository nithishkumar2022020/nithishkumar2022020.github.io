# Portfolio Website Implementation Blueprint
**Subject:** Reddyvari Nithish Kumar Reddy — Generative AI Engineer  
**Purpose:** Complete developer handoff specification covering visual design tokens, layout architecture, navigation & FLIP morph transitions, interactive 3D glass tech stack, live 60fps canvas visualizers, case study views, Info/resume sections, and contact flows.

---

## 1. Visual Design System & Typography

### Color Palette (Dark-First Obsidian & Glass)
- **Primary Canvas / Background (`obsidian`):** `#09090B`
- **Elevated Surface (`surface`):** `#111114`
- **Primary Text (`ink`):** `#F4F4F6` (high-contrast white `#FFFFFF` for headings/active controls)
- **Muted / Secondary Text (`muted`):** `#9CA3AF`
- **Glassmorphic Card Gradient:** `linear-gradient(180deg, rgba(255, 255, 255, 0.035) 0%, rgba(255, 255, 255, 0.012) 100%)`
- **Glass Card Border:** `1px solid rgba(255, 255, 255, 0.08)` (hovers to `rgba(255, 255, 255, 0.24)`)
- **Glass Card Shadow:** `inset 0 1px 0 rgba(255, 255, 255, 0.06), 0 20px 60px -24px rgba(0, 0, 0, 0.9)`
- **Visualizer Stage Background (`.viz-stage`):** `radial-gradient(circle at 50% 45%, rgba(255, 255, 255, 0.03), rgba(9, 9, 11, 0.72) 82%)` with `1px solid rgba(255, 255, 255, 0.07)`
- **Top Radial Spotlight:** Fixed non-interactive overlay (`pointer-events-none fixed inset-x-0 top-0 h-[440px] z-0`) with `radial-gradient(ellipse 65% 55% at 50% 0%, rgba(255, 255, 255, 0.07), rgba(9, 9, 11, 0) 72%)`
- **Accent Tones Used Across Badges & Visualizers:**
  - Emerald (`#34D399` / `#6EE7B7` / `emerald-300` / `emerald-400`): RAG, citations, HTTPS/deployment, copy confirmation
  - Sky (`#38BDF8` / `sky-300` / `sky-400`): ONNX speech inference, embeddings/BM25, Flutter/Docker
  - Indigo / Violet (`#818CF8` / `#A5B4FC` / `#A78BFA` / `indigo-300`): MCP tools, reflective loop, GitLab/progress tracking
  - Amber (`#FBBF24` / `amber-300` / `amber-400`): 4-bit QLoRA training, critique/refine loops, AWS/cloud
  - Teal (`#2DD4BF` / `teal-300` / `teal-400`): Ingestion/semantic chunking, Verilog timing waveforms, FastAPI

### Typography
- **Google Fonts Loaded:**
  - `Inter` (weights `400`, `500`, `600`) — `font-sans`
  - `Instrument Serif` (normal & `italic`) — `font-serif`, used in italic accents inside hero headlines (e.g., *"retrieval to runtime."*)
  - `JetBrains Mono` (weights `400`, `500`) — `font-mono`, used for eyebrows, tags, metadata, buttons, telemetry captions, and visualizer labels

---

## 2. Top Navigation Bar & Contact Popover

### Sticky Header (`sticky top-0 z-40`)
- Container: `max-w-5xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between gap-3`, `backdrop-blur-md bg-obsidian/75 border-b border-white/[0.06]`.
- **Left Identity Button:**
  - Title: `Nithish Reddy`
  - Subtitle: `Generative AI Engineer`
  - Action: Navigates to `work` view.
- **Center Segmented Pill Toggle (`pill-nav`):**
  - Sliding indicator (`#nav-pill-slider`, `w-[68px]`, `transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]`) moves `translateX(0px)` for `Work` and `translateX(68px)` for `Info`.
  - Tabs: `Work` and `Info`.
- **Right Utility Links:**
  - `GitHub` -> `https://github.com/nithishkumar2022020` (opens in new tab)
  - `LinkedIn` -> `https://www.linkedin.com/in/reddyvari-nithish-kumar-reddy` (opens in new tab)
  - `Contact` button -> Toggles `#contact-popover` open/closed.

### Contact Popover (`#contact-popover`)
- Displays:
  - **Email:** `reddynithish15@gmail.com` (clicking copies to clipboard and triggers toast: `"Email copied: reddynithish15@gmail.com"`)
  - **Location:** `Hyderabad, Telangana`
  - **Mail App** link: `mailto:reddynithish15@gmail.com`
  - **Close** button: Hides popover.
- **Privacy Rule:** Do **not** display a phone number anywhere in the header popover, Info view, or footer.

---

## 3. Page Views & Navigation State Machine

The app has three views managed inside `#app-main`:
1. **`#view-work` (Default Landing View):** Hero section, 5 stacked featured project cards, 3-card compact "Additional Builds & Experiments" grid, and interactive 3D Tech Stack section.
2. **`#view-case-study` (Project Detail View):** Back button (`← Back to Work`), breadcrumb (`Case Study / <tag>`), project title & subtitle, 4-column metadata strip, large interactive Hero Visualizer stage (`h-[280px] sm:h-[340px] lg:h-[370px]`), architecture overview + numbered/arrowed engineering highlights, technology badges with outlined SVG icons, and a "Next Case Study →" card.
3. **`#view-info` (About / Resume View):** Profile summary (`Reddyvari Nithish Kumar Reddy`), contact & social card, work experience timeline (Cloud Security Web LLC, Viswam, Digi Quanta), categorized technical skills matrix with outlined SVG logos, and 3-column grid for Leadership & Roles, Certifications, and Education.

### Keyboard & Scroll Behavior
- Pressing `Escape` while a case study is active calls `closeCaseStudyWithMorph()`.
- Opening a case study saves `savedWorkScrollY = window.scrollY || 0` and scrolls to top; closing a case study restores `savedWorkScrollY` (`behavior: 'instant'`).
- Switching between `Work` and `Info` via header or identity button destroys any active hero visualizer, resets `activeCaseStudyId = null`, scrolls smoothly to top, and remounts card visualizers when returning to `work`.

---

## 4. FLIP Card-to-Page Morphing Animation

- **Overlay Element (`#flip-morph-overlay`):** `position: fixed; z-index: 60; pointer-events: none;` with dark glass gradient, `1px solid rgba(255, 255, 255, 0.16)`, and deep shadow.
- **Opening (`openCaseStudyWithMorph(projectId, sourceCardEl)`):**
  1. Reads `sourceCardEl.getBoundingClientRect()` (`left`, `top`, `width`, `height`) and places `#flip-morph-overlay` over the clicked card with `borderRadius: 24px` and `opacity: 1`, dimming `#app-main` to `0.35`.
  2. On the next `requestAnimationFrame`, transitions (`460ms cubic-bezier(0.22, 1, 0.36, 1)`) the overlay toward a centered modal-like frame (`targetW = Math.min(vw * 0.92, 1040)`, `targetH = Math.min(vh * 0.84, 720)`, `borderRadius: 32px`).
  3. At `260ms`, switches `#view-work` to hidden, renders and displays `#view-case-study`, scrolls to `(0, 0)`, fades `#flip-morph-overlay` out (`260ms ease`), restores `#app-main` opacity to `1`, and hides the overlay after `270ms`.
- **Closing (`closeCaseStudyWithMorph()`):**
  1. Destroys the hero visualizer, hides `#view-case-study`, shows `#view-work`, restores `savedWorkScrollY`, and remounts card visualizers.
  2. Positions `#flip-morph-overlay` at the centered starting rect (`startW = Math.min(vw * 0.88, 960)`, `startH = Math.min(vh * 0.72, 540)`, `borderRadius: 32px`, `opacity: 0.85`) and animates (`400ms cubic-bezier(0.22, 1, 0.36, 1)`) back into `targetCard.getBoundingClientRect()` (`borderRadius: 24px`, `opacity: 0`).
- **Reduced Motion:** Skips morph animation when `window.matchMedia('(prefers-reduced-motion: reduce)').matches` is true.

---

## 5. Featured Projects, Case Studies & Live Canvas Visualizers

Each work card is a 12-column responsive card (`lg:col-span-5` text/stack/CTA on left, `lg:col-span-7` `.viz-stage` canvas on right) with `role="button"`, `tabindex="0"`, `Enter`/`Space` keyboard support, top-left status pill, bottom-right `Click card →` cue, and an `Open Case Study ↗` pill button.

All canvases scale for retina displays using `dpr = Math.min(window.devicePixelRatio || 1, 2)` and pause offscreen card canvases using `IntersectionObserver` (`threshold: 0.05`).

### Project 1: Synqra (`id: "synqra"`)
- **Card Tag:** `Synqra · Cloud RAG '26`
- **Card Headline:** `Hybrid RAG with page citations & AWS EC2 HTTPS deployment.`
- **Card Summary:** Combines BM25 + dense vector retrieval with RRF, semantic chunking, Milvus/Zilliz, FastAPI, Flutter, Cognito auth, Nginx HTTPS with auto-renewal, and CloudWatch monitoring.
- **Card Inline Stack:** `Python`, `FastAPI`, `Milvus`, `BM25 / Hybrid RRF`, `AWS`, `Docker`, `Nginx`, `Flutter`
- **Card Visualizer (`data-viz="rag_flow"`):**
  - Renders an animated RAG flow stage with ingestion/chunking (`INGEST`, `CHUNK`) feeding `MILVUS DB`, and query routing (`QUERY` -> `EMBED` -> `BM25+RRF` -> `MILVUS DB` -> `CHUNKS` -> `PROMPT` -> `GEMINI` -> `ANSWER`) with moving teal, emerald, and sky packets and footer caption `INGEST -> SEMANTIC CHUNK -> EMBED / BM25+RRF -> CITATIONS -> LLM`.
- **Case Study View:**
  - **Title:** `Synqra — Cloud-Deployed Hybrid RAG Application (HTTPS)`
  - **4 Metadata Cards:** Role (`GenAI & Full-Stack Builder`), Hosting & TLS (`AWS EC2 · Nginx HTTPS`), Retrieval Eval (`1.00 Hit Rate / MRR / NDCG`), Answer & Cite (`0.67 F1 · 0.38 Cite Prec.`)
  - **Default Hero Visualizer (`vizState.synqraHeroType === "synqra"`):** 3D-rotated vector point cloud with proximity edges, top-K highlighting, an ambient green query dot travelling toward the vector cluster, and a single-shot expanding wave (`synqraPulseWave`) when triggered.
  - **Case Study Controls:**
    - `Trigger Query Pulse`: Sets `synqraPulseBoost = 1.0` and starts `synqraPulseWave = 0.0` (advances `+0.022` per frame until `> 1`, then resets to `-1`).
    - `Toggle Pipeline View`: Switches `vizState.synqraHeroType` between `'synqra'` (vector space) and `'rag_flow'` (full RAG pipeline) and updates `#case-viz-badge-label`.
  - **Highlights:** Hybrid retrieval (BM25 + dense vectors with RRF) and semantic chunking with page-level citations; AWS EC2 HTTPS deployment via Docker Compose and Nginx with automated TLS renewal, AWS Cognito JWT auth, and GitHub Actions CI/CD to GHCR; CloudWatch logging and custom metrics for RAG latency, API performance, and vector DB operations; evaluation on 6 benchmark questions (1.0 hit rate, MRR, and NDCG; 0.67 answer F1; 0.38 citation precision diagnosed for fix).

### Project 2: Speech Inference Engine (`id: "speech"`)
- **Card Tag:** `Speech Inference Engine · Cloud Security Web '26`
- **Card Headline:** `5.5× faster CPU speech inference with ONNX Runtime.`
- **Card Summary:** Cut Parakeet TDT 0.6B speech latency from 2,409 ms to 435 ms and SymSpell post-processing from 2,330 ms to 282 ms, alongside WER & diarization evaluation.
- **Card Inline Stack:** `ONNX Runtime`, `PyTorch`, `Python`, `Azure`, `Docker`
- **Card & Case Study Visualizer (`type="speech"`):**
  - Top animated waveform (`72` samples) + 3 horizontal benchmark bars (`2,409 ms` PyTorch baseline vs. `435 ms` ONNX Runtime CPU 5.5x vs. `282 ms` SymSpell post-proc in `'latency'` mode; `1.59% WER` LibriSpeech, `14.03% WER` Medical, and `Eval Suite` in `'wer'` mode).
- **Case Study View:**
  - **Title:** `Speech Inference & Post-Processing Optimization`
  - **4 Metadata Cards:** Role (`Associate Software Engineer`), Speedup (`2,409 ms → 435 ms (~5.5×)`), Post-Process (`SymSpell 2,330 → 282 ms`), Parakeet Q8_0 (`14.03% Med / 1.59% Libri WER`)
  - **Controls:** `Latency Race` (`setSpeechVizMode('latency')`) and `WER Benchmarks` (`setSpeechVizMode('wer')`).
  - **Context:** Cloud Security Web LLC (Mar 2026 – Aug 2026, Remote), exporting Parakeet TDT 0.6B to ONNX on CPU vs. PyTorch baseline, evaluating Parakeet, MedASR, and Nemotron, speaker diarization post-processing, and Dockerized workers on Azure Container Apps and Service Bus.

### Project 3: MCP Tools & Reflective Coding Agent (`id: "mcp"`)
- **Card Tag:** `MCP Tools & Reflective Agent · Agentic Systems '25`
- **Card Headline:** `Custom MCP utilities & self-refining coding loops.`
- **Card Summary:** Built Claude MCP tools for local file counting, PDF Q&A, chat saving, greeting, and link threat checks, paired with a generate-evaluate-refine coding agent.
- **Card Inline Stack:** `MCP`, `Claude Code`, `LangChain`, `Python`
- **Card Visualizer (`data-viz="mcp_flow"`):**
  - Renders `MCP HOST`, `JSON-RPC`, `MCP SERVER`, `TOOLS/PDF` (with sky packet) on the left/center and `GENERATE`, `EVALUATE`, `REFINE` loop (with amber packet) on the right, with caption `MCP HOST/CLIENT/SERVER + GENERATE -> EVALUATE -> REFINE LOOP`.
- **Case Study View:**
  - **Title:** `Custom MCP Tools & Reflective Coding Agent`
  - **4 Metadata Cards:** Protocol (`Model Context Protocol (MCP)`), MCP Tools (`5 Local & Security Utilities`), Agent Pattern (`Generate → Critique → Refine`), Stack (`Python · Claude Code · LangChain`)
  - **Default Hero Visualizer (`vizState.mcpHeroType === "mcp"`):** Elliptical ring connecting `GENERATE`, `MCP TOOLS`, `EVALUATE`, and `REFINE` nodes with a glowing orbiting packet and step offset support.
  - **Controls:** `Advance Cycle` (`stepMcpCycle()`) and `Toggle MCP/Ring View` (`toggleMcpHeroViz()`).
  - **Highlights:** 5 Claude MCP tools (`Greeter`, `File Counter`, `Chat Saver`, `Local PDF File Analysis`, `Vulnerability Checker`), reflective coding assistant using an iterative generate-evaluate-refine loop, and local agentic RAG workflows.

### Project 4: Distributed LLM Fine-Tuning & Clinical ASR (`id: "distributed"`)
- **Card Tag:** `Fine-Tuning & Clinical ASR · Viswam & Digi Quanta '25`
- **Card Headline:** `4-bit QLoRA tuning, Petals swarm & Telugu clinical AI.`
- **Card Summary:** Fine-tuned Qwen 2.5 0.5B with Unsloth on 2× T4 GPUs, explored Petals distributed inference, and built Telugu ASR, clinical prompts, and Flutter/Streamlit apps.
- **Card Inline Stack:** `PyTorch`, `Ollama`, `Flutter`, `Streamlit`, `Git`
- **Visualizer (`type="distributed"`):**
  - Grid + animated decaying training loss curve (`60` steps) above 5 pulsing peer/component nodes (`2x T4 QLoRA`, `Qwen 2.5 0.5B`, `Petals Peer A`, `Petals Peer B`, `Telugu ASR`).
- **Case Study Controls:** `Pulse Swarm` (`pulseDistributedSwarm()`).

### Project 5: Verilog Waveform VS Code Extension (`id: "verilog"`)
- **Card Tag:** `Verilog Waveform Extension · VS Code & Python '25`
- **Card Headline:** `Simulated Verilog timing waveforms inside VS Code.`
- **Card Summary:** Translates Verilog logic into Python simulation scripts and renders clean Matplotlib digital waveforms directly inside VS Code without anomalies.
- **Card Inline Stack:** `Python`, `Claude Code`, `Codex`, `Git`
- **Visualizer (`type="verilog"`):**
  - Three square-wave logic lanes (`CLK`, `DATA_IN`, `SIM_OUT`) with vertical edge transitions and toggleable clock speed (`vizState.verilogFastClock`: `5.5` vs `11` rate).
- **Case Study Controls:** `Toggle Clock Rate` (`toggleVerilogClock()`).

### Additional Builds & Experiments Strip (3-Column Grid)
1. **Local Agentic RAG** (`Offline Retrieval Agent`) — Agentic RAG workflow locally using a local LLM for private document querying and multi-step retrieval.
2. **Video Lip Sync & Streamlit** (`Audio-to-Video Lip Sync UI`) — Audio-driven lip synchronization on photos/videos and a Streamlit showcase app for a video generation model.
3. **GitLab API & Progress Web** (`Intern Tracker & Notion-Style Log`) — Python/Shell GitLab API wrapper to verify onboarding and track intern progress, plus a personal learning tracker website.

---

## 6. Interactive 3D Glass Tech Stack System

- **Permanent Style:** Rendered in `3D Glass` mode with per-card CSS custom properties (`--tech-glow`, `--tech-glow-strong`, `--tech-border`, `--tech-shadow`), radial cursor-following glow (`--mx`, `--my`), and 3D perspective tilt (`perspective(700px) rotateX(...) rotateY(...) translateY(-2px)`) on `mousemove`, resetting cleanly on `mouseleave`.
- **Category Filter Pills:** `All`, `GenAI & LLM`, `Retrieval`, `Inference & ML`, `Cloud & DevOps`, `Languages`.
- **Included Technologies (`TECH_ICONS`):**
  - `PyTorch`, `ONNX Runtime`, `LangChain`, `Ollama`, `vLLM`, `MCP`, `Claude Code`, `Antigravity`, `Codex`, `Milvus`, `Zilliz Cloud`, `BM25 / Hybrid RRF`, `PostgreSQL`, `AWS`, `Docker`, `Nginx`, `GitHub Actions`, `Azure`, `Python`, `FastAPI`, `Flutter`, `Streamlit`, `Git`.
- Each technology has a custom `viewBox="0 0 24 24"` outlined SVG (`fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"`), display name, category list, and short capability subtitle.

---

## 7. Info View Data & Bottom "Let's Connect" Footer

### Info View Sections
- **About & Profile:** Reddyvari Nithish Kumar Reddy, GenAI/RAG/LoRA/QLoRA/inference engineer, B.Tech in Electronics & Communication Engineering from Vignana Bharathi Institute of Technology, Hyderabad.
- **Experience Timeline:**
  - *Cloud Security Web LLC* — Associate Software Engineer (Remote, Mar 2026 – Aug 2026)
  - *Viswam* — Machine Learning Intern (Mar 2025 – Jun 2025)
  - *Digi Quanta* — Machine Learning Intern (Mar 2025 – Jun 2025)
- **Categorized Technical Stack Matrix:** 4 grouped cards (*GenAI, Agents & Coding Tools*, *Retrieval, Search & Databases*, *Inference, ML & Cloud*, *Languages & Frameworks*) rendering outlined SVG badges.
- **Leadership & Roles:** IEEE VBIT SB (Resource & Skill Coordinator Jun 2024–Present; CommSoc Treasurer Aug 2023–Jun 2024), Google Crowdsource VBIT (Secretary May 2023–Jun 2024), DYUTHI NSS VBIT (Treasurer May 2023–Jun 2024).
- **Certifications:** JNCIA-Cloud (Juniper Open Learning), Java Full Stack (Wipro), Python Fundamentals (Infosys Springboard), Android App Security (CDAC), Cybersecurity Virtual Internship (Palo Alto).
- **Education:** B.Tech ECE — Vignana Bharathi Institute of Technology, Hyderabad (Nov 2021 – Present); Intermediate — Sri Chaitanya Junior Kalasala (Sep 2019 – Mar 2021); High School — Sri Chaitanya Olympiad School (Jan 2012 – Jul 2019).

### Bottom "Let's Connect" Section & Footer
- Glassmorphic card at the top of `<footer>` with eyebrow `Let's Connect`, heading `Reddyvari Nithish Kumar Reddy`, role/availability/location line (`Generative AI Engineer · Open to GenAI, LLM Systems & Inference roles · Hyderabad, Telangana, India`), one-click `Copy Email · reddynithish15@gmail.com` button, and `GitHub ↗` and `LinkedIn ↗` buttons.
- Bottom bar with copyright (`© 2026 Reddyvari Nithish Kumar Reddy. Built with care & strong filter coffee.`) and direct `reddynithish15@gmail.com`, `GitHub`, and `LinkedIn` links.