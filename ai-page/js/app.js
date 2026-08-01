// ─────────────────────────────────────────────────────────────────
// GLOBAL STATE
// ─────────────────────────────────────────────────────────────────
const views = ['constellation', 'mindmap', 'visual', 'cards'];
let currentViewIndex = 0;
let curriculumModel = { title: "Curriculum", domains: [] };

if (typeof curriculumMarkdown !== 'undefined') {
    curriculumModel = parseCurriculum(curriculumMarkdown);
    document.title = curriculumModel.title;
    validateCurriculum(curriculumMarkdown, curriculumModel);
} else {
    alert('Error: Could not load course-curriculum.js. Make sure it is in the same folder.');
}

// Domain count comes from the parsed model itself, so the palette always
// has exactly enough distinct colors — no hardcoded cap, no wraparound.
const domainCount = curriculumModel.domains.length;

// Tune these 4 numbers to adjust the overall look; everything downstream
// (3D cosmos, mindmap, cards, mission control) reads from this one palette.
const palette = generatePalette(domainCount, {
    // baseSat down to ~65–70 if hues at close angles (e.g., adjacent oranges/yellows) feel too similar — lower saturation increases perceived separation on a dark background less than hue does, but it's worth eyeballing.
    // baseLight down to ~50–55 if colors feel too pastel/washed out at high domain counts.
    // hueOffset is just a fun dial — shifts which hue domain #1 starts at, e.g. hueOffset: 200 starts on blue instead of red.

    baseSat: 75,
    baseLight: 60,
    emSat: 80,
    emLight: 38,
    hueOffset: 0
});

// ─────────────────────────────────────────────────────────────────
// VIEW SWITCHING
// ─────────────────────────────────────────────────────────────────
// Every view module exposes the same interface — activate/deactivate/resize —
// so switching views is a generic loop instead of one branch per view name.
// Adding a 5th view means adding one entry here, not editing switchView.
const viewModules = {
    constellation: CosmosView,
    mindmap: MindmapView,
    visual: MissionControlView,
    cards: CardsView,
};

// Views that need to re-fit themselves when the side panel opens/closes
// register through Panel.onResize() rather than Panel reaching into their
// internals directly.
Panel.onResize(() => CosmosView.resize());
Panel.onResize(() => MindmapView.resize());

/** Transitions to the named view. Handles:
 *  - Closing the side panel
 *  - Updating nav dots and page counter
 *  - Activating the target view module (lazy-inits on first visit, resumes
 *    its animation loop) and deactivating all others (pausing theirs)
 */
function switchView(viewId) {
    Panel.close();
    currentViewIndex = views.indexOf(viewId);
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.getElementById('view-' + viewId).classList.add('active');

    document.querySelectorAll('.nav-dot').forEach(d => { d.classList.remove('active'); d.removeAttribute('aria-current'); });
    const activeDot = document.getElementById('dot-' + viewId);
    activeDot.classList.add('active');
    activeDot.setAttribute('aria-current', 'true');

    Object.entries(viewModules).forEach(([id, mod]) => {
        if (id === viewId) mod.activate(curriculumModel, palette);
        else mod.deactivate();
    });

    const pageNum = currentViewIndex + 1;
    document.getElementById('page-counter').textContent = ` ${pageNum}/${views.length}`;
}

function nextView() { switchView(views[(currentViewIndex + 1) % views.length]); }
function prevView() { switchView(views[(currentViewIndex - 1 + views.length) % views.length]); }

// ─────────────────────────────────────────────────────────────────
// KEYBOARD NAVIGATION
// ─────────────────────────────────────────────────────────────────
window.addEventListener('keydown', e => {
    const tag = (e.target.tagName || '').toLowerCase();
    if (tag === 'input' || tag === 'textarea') return;
    switch (e.key) {
        case 'ArrowLeft':  prevView(); e.preventDefault(); break;
        case 'ArrowRight': nextView(); e.preventDefault(); break;
    }
});

// Close the side panel when clicking outside it (on the view background
// or body). Ignores clicks inside the panel itself, on cards (which open
// their own detail view), and on animation mode buttons.
document.addEventListener('click', e => {
    const sidePanel = document.getElementById('side-panel');

    if (document.body.classList.contains('panel-open')) {
        if (!sidePanel.contains(e.target) &&
            (e.target.closest('.view') || e.target.tagName === 'BODY')) {

            if (!e.target.closest('.card') && !e.target.closest('.visual-card') && !e.target.closest('.anim-btn')) {
                Panel.close();
            }
        }
    }
});

// ─────────────────────────────────────────────────────────────────
// BOOTSTRAP
// ─────────────────────────────────────────────────────────────────
window.onload = () => {
    if (curriculumModel.domains.length > 0) {
        // Build & activate only the default view; others init lazily on first visit.
        switchView('constellation');
    }
};
