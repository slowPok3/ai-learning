// ─────────────────────────────────────────────────────────────────
// VIEW 4: TOPIC EXPLORER
// ─────────────────────────────────────────────────────────────────
const CardsView = (function () {
    let initialized = false;
    let filterCards = null;
    let _filterTimer = null;

    function build(model, palette) {
        const grid = document.getElementById("grid");
        const search = document.getElementById("search");
        const domainFilter = document.getElementById("domainFilter");

        const domains = model.domains.map(d => d.name);
        domains.forEach(d => {
            const opt = document.createElement("option");
            opt.value = d;
            opt.textContent = d;
            domainFilter.appendChild(opt);
        });

        filterCards = function () {
            const q = search.value.toLowerCase();
            const filterDomain = domainFilter.value;
            grid.innerHTML = "";
            let matchCount = 0;

            model.domains.forEach((domain, domainIdx) => {
                if (filterDomain !== "all" && domain.name !== filterDomain) return;

                const clusterColor = palette[domainIdx % palette.length].base;

                domain.subjects.forEach(subject => {
                    subject.topics.forEach(sub => {
                        const searchString = `${sub.name} ${subject.name} ${sub.desc}`.toLowerCase();
                        if (searchString.includes(q)) {
                            matchCount++;
                            const card = document.createElement("button");
                            card.type = "button";
                            card.className = "card";
                            card.style.borderLeft = `4px solid ${clusterColor}`;
                            card.innerHTML = `
                                <div class="id" style="color:${clusterColor}">${escapeHtml(sub.id)}</div>
                                <h3 style="color:var(--text)">${escapeHtml(sub.name)}</h3>
                                <p>${escapeHtml(sub.desc)}</p>
                                <span class="phase-tag" style="color:${clusterColor};background:${clusterColor}20">
                                    ${escapeHtml(domain.name)} • ${escapeHtml(subject.name)}
                                </span>`;
                            card.onclick = () => Panel.openTopic(sub, clusterColor, domain.name, subject.name);
                            // ── CARD-STAGGER-START: staggered entrance ─────
                            card.classList.add('card-enter');
                            card.style.animationDelay = `${matchCount * 30}ms`;
                            // ── CARD-STAGGER-END ──────────────────────────
                            grid.appendChild(card);
                        }
                    });
                });
            });

            if (matchCount === 0) {
                grid.innerHTML = '<div class="empty">No matches found</div>';
            }

            const status = document.getElementById('search-status');
            if (status) {
                status.textContent = matchCount === 0
                    ? 'No matches found'
                    : `${matchCount} topic${matchCount === 1 ? '' : 's'} found`;
            }
        };

        domainFilter.addEventListener("change", filterCards);
        filterCards();
    }

    function toggleClearButton(value) {
        document.getElementById('custom-clear-btn').style.display = value.length > 0 ? 'block' : 'none';
    }

    // Debounce: wait until the user pauses typing (~150ms) before rebuilding
    // the card grid, so fast typing doesn't trigger a rebuild on every keystroke.
    function onSearchInput(value) {
        toggleClearButton(value);
        clearTimeout(_filterTimer);
        _filterTimer = setTimeout(() => { if (filterCards) filterCards(); }, 150);
    }

    function clearSearch() {
        const input = document.getElementById('search');
        input.value = '';
        toggleClearButton('');
        if (filterCards) filterCards();
        input.focus();
    }

    return {
        activate(model, palette) {
            if (!initialized) { build(model, palette); initialized = true; }
        },
        deactivate() {},
        resize() {},
        onSearchInput,
        clearSearch
    };
})();
