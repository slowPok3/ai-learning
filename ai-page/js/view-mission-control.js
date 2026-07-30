// ─────────────────────────────────────────────────────────────────
// VIEW 3: MISSION CONTROL
// ─────────────────────────────────────────────────────────────────
const MissionControlView = (function () {
    let initialized = false;

    function build(model, palette) {
        const grid = document.getElementById("visual-grid");
        // NOTE: numSubs counts ### Subjects (one per heading), numTopics counts
        // * Topics (bullet items across all subjects). Variable names follow the
        // display labels: "X subjects · Y topics".
        let numTopics = 0;
        let numSubs = 0;

        model.domains.forEach((domain, idx) => {
            const domainName = domain.name;
            const clusterColor = palette[idx % palette.length].base;
            const clusterBg = palette[idx % palette.length].rgba.replace('0.75', '0.15');

            const subjects = domain.subjects;
            numSubs += subjects.length;

            const pills = subjects.map(s =>
                `<span class="subject-pill" style="color:${clusterColor};background:${clusterBg};border:1px solid ${clusterColor}33">${escapeHtml(s.name)}</span>`
            ).join('');

            const allTopics = subjects.flatMap(s => s.topics);
            numTopics += allTopics.length;

            const tags = allTopics.slice(0, 10).map(s =>
                `<span class="moon-tag" style="background:${clusterColor}15;border:1px solid #334155;color:${clusterColor}">${escapeHtml(s.name)}</span>`
            ).join('') + (allTopics.length > 10
                ? `<span class="moon-tag" style="background:${clusterColor}15;border:1px solid #334155;color:${clusterColor}">+${allTopics.length - 10} more</span>`
                : '');

            const card = document.createElement('div');
            card.className = 'visual-card';
            card.onclick = () => Panel.openDomain(domainName, model, palette);
            card.innerHTML = `
              <div class="visual-card-header">
                <div>
                  <h3 style="color:${clusterColor}">${escapeHtml(domainName)}</h3>
                  <div style="font-size:0.7rem;color:var(--muted);margin-top:2px">
                    ${subjects.length} subjects · ${allTopics.length} topics
                  </div>
                </div>
              </div>
              <div class="subject-pill-list">${pills}</div>
              <div class="moon-tag-list">${tags}</div>`;
            // ── CARD-STAGGER-START: staggered entrance ─────
            card.classList.add('card-enter');
            card.style.animationDelay = `${idx * 30}ms`;
            // ── CARD-STAGGER-END ──────────────────────────
            grid.appendChild(card);
        });

        document.getElementById('stat-domains').textContent = model.domains.length;
        document.getElementById('stat-subs').textContent = numSubs;
        document.getElementById('stat-topics').textContent = numTopics;
    }

    return {
        activate(model, palette) {
            if (!initialized) { build(model, palette); initialized = true; }
        },
        deactivate() {},
        resize() {}
    };
})();
