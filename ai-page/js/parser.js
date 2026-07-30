// Curriculum markdown parser, validator, and HTML-escaping helper.
// Shared by app.js's bootstrap and by every view.

/** Converts curriculum markdown into a single canonical model, shared by
 *  all four views (Cosmos, Knowledge Web, Mission Control, Topic Explorer).
 *
 *  Expected markdown structure:
 *    # Course Title        — used as model.title
 *    ## Domain             — e.g. "Mathematics"
 *    ### Subject           — e.g. "1. Algebra" (numeric prefix stripped in .name)
 *    * Topic: description  — bullet items under each subject
 *
 *  Returns: { title, domains: [{ name, subjects: [{ name, rawName, id ("S1"),
 *             topics: [{name, desc, id ("S1-T1")}] }] }] }
 */
function parseCurriculum(mdStr, fallbackTitle = "Curriculum") {
    const lines = mdStr.split('\n');
    let title = fallbackTitle;
    let titleFound = false;
    const domains = [];
    let currentDomain = null;
    let currentSubject = null;
    let subjectCounter = 0;

    lines.forEach(line => {
        line = line.trim();
        if (!line) return;

        if (line.startsWith('# ') && !line.startsWith('## ')) {
            if (!titleFound) {
                title = line.slice(2).trim();
                titleFound = true;
            }
            return;
        }
        else if (line.startsWith('## ') && !line.startsWith('### ')) {
            currentDomain = { name: line.substring(3).trim(), subjects: [] };
            domains.push(currentDomain);
            currentSubject = null;
        }
        else if (line.startsWith('### ') && !line.startsWith('#### ')) {
            if (!currentDomain) return;
            const rawName = line.substring(4).trim();
            subjectCounter++;
            currentSubject = {
                name: rawName.replace(/^\d+\.\s*/, ''),
                rawName,
                id: 'S' + subjectCounter,
                topics: []
            };
            currentDomain.subjects.push(currentSubject);
        }
        else if (line.startsWith('* ')) {
            if (currentDomain && currentSubject) {
                const parts = line.substring(2).split(':');
                const name = parts[0].trim();
                const desc = parts.slice(1).join(':').trim() || '';
                const topicCounter = currentSubject.topics.length + 1;
                currentSubject.topics.push({
                    name,
                    desc,
                    id: currentSubject.id + '-T' + topicCounter
                });
            }
        }
    });

    return { title, domains };
}

// Lightweight validator: warns (in console) about silent content problems
// so a malformed curriculum file doesn't fail invisibly.
function validateCurriculum(mdStr, model) {
    const warnings = [];
    if (!model || model.domains.length === 0) {
        warnings.push('No domains/topics parsed. Check that the file uses "## Domain" and "### Topic" headings.');
    }
    const lines = mdStr.split('\n');
    let sawDomain = false, sawTopic = false;
    lines.forEach((raw, i) => {
        const line = raw.trim();
        if (line.startsWith('## ') && !line.startsWith('### ')) sawDomain = true;
        else if (line.startsWith('### ') && !line.startsWith('#### ')) sawTopic = true;
        else if (line.startsWith('* ')) {
            if (!sawDomain || !sawTopic) {
                warnings.push(`Line ${i + 1}: topic "${line.slice(2).trim()}" appears before any Domain/Topic and will be DROPPED.`);
            }
            const body = line.slice(2);
            if (body.indexOf(':') === -1) {
                warnings.push(`Line ${i + 1}: topic "${body.trim()}" has no ":" description.`);
            }
        }
    });
    // Duplicate topic names within a subject
    model.domains.forEach(d => {
        d.subjects.forEach(s => {
            const names = s.topics.map(t => t.name.toLowerCase());
            const dupes = names.filter((n, idx) => names.indexOf(n) !== idx);
            if (dupes.length) warnings.push(`Subject "${s.rawName}" has duplicate topics: ${[...new Set(dupes)].join(', ')}`);
        });
    });

    if (warnings.length) {
        console.warn(`%c⚠️ Curriculum validation: ${warnings.length} issue(s)`, 'color:#f59e0b;font-weight:bold');
        warnings.forEach(w => console.warn('  • ' + w));
    } else {
        console.log('%c✓ Curriculum validated, no issues.', 'color:#10b981;font-weight:bold');
    }
}

// Escapes text before interpolating it into an HTML template literal.
// Curriculum content is trusted today, but this closes the gap cheaply
// in case that ever changes (or a stray `<`/`&` shows up in a topic name).
function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, c => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));
}
