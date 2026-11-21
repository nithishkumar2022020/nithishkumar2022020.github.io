(() => {
  const escape = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  let count = 0;
  class ProjectRoadmap extends HTMLElement {
    async connectedCallback() {
      this.abort?.abort();
      this.abort = new AbortController();
      this.innerHTML = '<p class="roadmap-loading">Loading roadmap…</p>';
      try {
        const response = await fetch(this.getAttribute('src'), {signal: this.abort.signal});
        if (!response.ok) throw new Error('Roadmap unavailable');
        this.data = await response.json();
      } catch (error) {
        if (error.name !== 'AbortError') {
          this.innerHTML = '<p class="roadmap-loading">The roadmap could not load. Please refresh to try again.</p>';
          this.dispatchEvent(new CustomEvent('roadmap-ready'));
        }
      }
    }
    disconnectedCallback() { this.abort?.abort(); }
    set data(value) {
      this._data = value;
      const heading = `project-roadmap-${++count}`;
      const stateFor = milestone => milestone.status === 'In Progress' ? 'current' : ['Core Complete', 'Complete', 'Completed'].includes(milestone.status) ? 'complete' : 'planned';
      const latestComplete = [...value.milestones].reverse().find(milestone => stateFor(milestone) === 'complete')?.id;
      const demoUrl = value.demo?.href ? new URL(value.demo.href, document.baseURI) : null;
      const demoLink = demoUrl && ['http:', 'https:'].includes(demoUrl.protocol) ? `<a class="roadmap-demo-link" href="${escape(demoUrl.href)}"><span aria-hidden="true">▶</span>${escape(value.demo.label || 'Try the working demo')}</a>` : '';
      const groups = milestone => (milestone.groups || []).map(group => `<div class="roadmap-detail-group"><h4>${escape(group.title)}</h4><ul>${group.items.map(item => `<li>${escape(item)}</li>`).join('')}</ul></div>`).join('');
      this.innerHTML = `<section class="project-roadmap" aria-labelledby="${heading}">
        <header class="roadmap-heading"><p class="roadmap-eyebrow">Engineering progression</p><h2 id="${heading}">${escape(value.title)}</h2><p>${escape(value.intro)}</p></header>
        <div class="roadmap-client"><div><h3>Flutter today</h3><p>${escape(value.client.current)}</p></div><div><h3>Flutter’s evolving role</h3><p>${escape(value.client.future)}</p></div><p class="roadmap-engine">${escape(value.client.engine)}</p></div>
        <ol class="roadmap-timeline">${value.milestones.map(milestone => `<li class="roadmap-step" data-state="${stateFor(milestone)}">
          <span class="roadmap-marker" aria-hidden="true">${escape(milestone.id)}</span>
          <article class="roadmap-card" aria-labelledby="${heading}-${escape(milestone.id)}">
            <div class="roadmap-title-row"><h3 id="${heading}-${escape(milestone.id)}"><span class="roadmap-sr-only">${escape(milestone.id)} — </span>${escape(milestone.title)}</h3><span class="roadmap-status">${escape(milestone.status)}</span></div>
            <p class="roadmap-purpose">${escape(milestone.purpose)}</p>
            <p class="roadmap-use-case"><span>Use case</span>${escape(milestone.useCase)}</p>
            ${milestone.id === latestComplete ? demoLink : ''}
            <details><summary aria-label="Engineering details for ${escape(milestone.id)}: ${escape(milestone.title)}">Engineering details<span class="roadmap-expand" aria-hidden="true">+</span></summary>
              <div class="roadmap-details"><div class="roadmap-detail-group"><h4>Why this milestone</h4><p>${escape(milestone.why)}</p></div>${groups(milestone)}${milestone.focus ? `<div class="roadmap-detail-group"><h4>Engineering focus</h4><p>${escape(milestone.focus)}</p></div>` : ''}<div class="roadmap-detail-group"><h4>Outcome</h4><p>${escape(milestone.outcome)}</p></div>${milestone.note ? `<p class="roadmap-note">${escape(milestone.note)}</p>` : ''}</div>
            </details>
          </article>
        </li>`).join('')}</ol>
      </section>`;
      this.dispatchEvent(new CustomEvent('roadmap-ready'));
    }
    get data() { return this._data; }
  }
  customElements.define('project-roadmap', ProjectRoadmap);
})();
