// Side panel: shared detail view opened by Topic Explorer cards and
// Mission Control domain cards. Decoupled from view internals — a view
// that needs to re-fit itself when the panel opens/closes (Cosmos,
// Knowledge Web) registers a callback via Panel.onResize() instead of
// Panel reaching into that view's state directly.
const Panel = (function () {
    const resizeListeners = [];

    function onResize(fn) { resizeListeners.push(fn); }
    function notifyResize() { resizeListeners.forEach(fn => fn()); }

    function open(htmlContent) {
        const panel = document.getElementById('side-panel');
        document.getElementById('panel-content').innerHTML = htmlContent;
        panel.scrollTop = 0;
        panel.classList.add('open');
        document.body.classList.add('panel-open');
        notifyResize();
        // Re-fit views again after the panel's 0.3s slide transition finishes.
        setTimeout(notifyResize, 320);
    }

    function close() {
        document.getElementById('side-panel').classList.remove('open');
        document.body.classList.remove('panel-open');
        setTimeout(notifyResize, 300);
        setTimeout(notifyResize, 320);
    }

    function openTopic(sub, color, domainName, subjectName) {
        document.getElementById('side-panel').style.setProperty('--accent', color);

        const html = `
            <div class="id" style="color:${color};font-size:0.8rem;letter-spacing:1px">${escapeHtml(sub.id)}</div>
            <h2 style="color:${color};margin-top:0.5rem;margin-bottom:1rem;">${escapeHtml(sub.name)}</h2>
            <p style="color:var(--text);line-height:1.6;font-size:0.95rem;">${escapeHtml(sub.desc)}</p>
            <div style="margin-top:2rem;padding-top:1rem;border-top:1px solid #334155">
                <span class="phase-tag" style="color:${color};background:${color}20">
                    ${escapeHtml(domainName)}
                </span>
                <div style="color:var(--muted);font-size:0.8rem;margin-top:8px">${escapeHtml(subjectName)}</div>
            </div>`;
        open(html);
    }

    function openDomain(domainName, model, palette) {
        const domainIndex = model.domains.findIndex(d => d.name === domainName);
        if (domainIndex === -1) return;
        const domain = model.domains[domainIndex];

        const domainColor = palette[domainIndex % palette.length].base;

        document.getElementById('side-panel').style.setProperty('--accent', domainColor);

        let topicsHtml = '';
        domain.subjects.forEach(subject => {
            let subjectsHtml = subject.topics.map(sub => `
                <li style="margin-bottom:12px;">
                    <strong style="color:var(--text); display:inline-block; font-size:0.95rem;">${escapeHtml(sub.name)}</strong>
                    <span style="display:block; font-size:0.85rem; color:var(--muted); margin-top:2px; line-height:1.4;">${escapeHtml(sub.desc)}</span>
                </li>
            `).join('');
            topicsHtml += `
                <h3 style="color:var(--text);margin-top:1.5rem;margin-bottom:0.75rem;font-size:1.05rem;border-bottom:1px solid #33415533;padding-bottom:4px;">${escapeHtml(subject.name)}</h3>
                <ul style="padding-left:15px;margin:0;">${subjectsHtml}</ul>
            `;
        });

        const html = `
            <h2 style="color:${domainColor};margin-top:0;margin-bottom:1rem;font-size:1.4rem;">${escapeHtml(domainName)}</h2>
            ${topicsHtml}
        `;
        open(html);
    }

    return { open, close, openTopic, openDomain, onResize };
})();
