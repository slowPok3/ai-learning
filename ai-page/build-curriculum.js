#!/usr/bin/env node
// Regenerates course-curriculum.js from course-curriculum.md.
//
// Why this exists: index.html loads the curriculum via a <script> tag so the
// page keeps working when opened directly as a file:// URL (browsers block
// fetch() of local files under file://, so a plain `fetch('course-curriculum.md')`
// only works once the page is served over http/https). Encoding the Markdown
// with JSON.stringify (instead of a hand-written template literal) means any
// character in the content — backticks, ${...}, quotes — is safely escaped,
// so editing course-curriculum.md can never break the generated JS.
//
// Usage: edit course-curriculum.md, then run `node build-curriculum.js`.

const fs = require('fs');
const path = require('path');

const mdPath = path.join(__dirname, 'course-curriculum.md');
const jsPath = path.join(__dirname, 'course-curriculum.js');

const markdown = fs.readFileSync(mdPath, 'utf8');

const output = `// course-curriculum.js — GENERATED FILE, do not edit by hand.
//
// Source of truth is course-curriculum.md. To change the curriculum:
//   1. Edit course-curriculum.md
//   2. Run: node build-curriculum.js
//   3. Commit both files.
//
// Wrapped in a JS variable (rather than fetched as plain Markdown) so
// index.html keeps working when opened directly as a file:// URL, which
// blocks fetch() of local files. Once this page is always served over
// http(s), this file and build-curriculum.js can be deleted in favor of
// fetch('course-curriculum.md') directly in index.html.

const curriculumMarkdown = ${JSON.stringify(markdown)};
`;

fs.writeFileSync(jsPath, output);
console.log(`Wrote ${jsPath} from ${mdPath} (${markdown.length} chars).`);
