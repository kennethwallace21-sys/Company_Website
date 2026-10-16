// Build-time check for the Services offerings (src/data/offerings.js).
// Run with: npm run test:offerings
//   --write  regenerate the dormant Services blocks in index.html and
//            public/sitemap.xml from offerings.js, then check.
// Checks:
//   1. offerings.js itself: unique slugs, required fields, known group, image file exists.
//   2. Every ServiceDetail?service=<slug> link in src/, index.html and public/sitemap.xml
//      names a slug defined in offerings.js.
//   3. The SERVICES_HIDDEN JSON-LD block in index.html and the SERVICES_HIDDEN sitemap
//      block match what offerings.js generates (same slugs, titles, blurbs, order).
import { readFileSync, writeFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join, relative, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { offerings, SERVICE_GROUPS, DEFAULT_SERVICE_SLUG } from '../src/data/offerings.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SITE_URL = 'https://www.catalystappliedai.com';
const WRITE = process.argv.includes('--write');
const LINK_RE = /ServiceDetail\?service=([A-Za-z0-9_-]+)/g;
const REQUIRED = ['slug', 'title', 'blurb', 'tagline', 'image', 'icon', 'group'];
const REQUIRED_DETAIL = ['heroImage', 'description', 'benefits', 'process'];

const rows = [];
const check = (ok, name, info = '') => rows.push({ ok: Boolean(ok), name, info });

// --- 1. offerings.js ---
const slugs = offerings.map((o) => o.slug);
check(new Set(slugs).size === slugs.length, 'slugs are unique', slugs.join(', '));
check(slugs.includes(DEFAULT_SERVICE_SLUG), 'DEFAULT_SERVICE_SLUG is a defined slug', DEFAULT_SERVICE_SLUG);
for (const o of offerings) {
    const missing = REQUIRED.filter((k) => !o[k]).concat(REQUIRED_DETAIL.filter((k) => !o.detail?.[k]).map((k) => `detail.${k}`));
    check(missing.length === 0, `${o.slug}: required fields present`, missing.join(', '));
    check(/^[a-z0-9-]+$/.test(o.slug), `${o.slug}: slug is lowercase kebab-case`);
    check(SERVICE_GROUPS.includes(o.group), `${o.slug}: group is in SERVICE_GROUPS`, o.group);
    check(existsSync(join(ROOT, 'public', o.image)), `${o.slug}: image exists in public/`, o.image);
}

// --- 3 (generation). Dormant blocks, generated from offerings.js ---
const indent = (text, n) => text.split('\n').map((l) => (l ? ' '.repeat(n) + l : l)).join('\n');

function jsonLdBlock() {
    const data = {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: 'AI Build & Deployment Services',
        description: 'Production AI systems built and deployed in your environment',
        itemListElement: offerings.map((o, i) => ({
            '@type': 'Service',
            position: i + 1,
            name: o.title,
            description: o.blurb,
            provider: { '@type': 'Organization', name: 'Catalyst Applied AI' },
            url: `${SITE_URL}/ServiceDetail?service=${o.slug}`,
        })),
    };
    const json = JSON.stringify(data, null, 4);
    return [
        '    <!-- SERVICES_HIDDEN: JSON-LD Structured Data: Services. Remove this comment wrapper to restore (and set SHOW_SERVICES = true in src/config/features.js). Generated from src/data/offerings.js by scripts/check-offerings.mjs in write mode; do not edit by hand.',
        '    <script type="application/ld+json">',
        indent(json, 4),
        '    </script>',
        '    SERVICES_HIDDEN -->',
    ].join('\n');
}

function sitemapBlock(lastmod) {
    const urls = offerings.map((o) => [
        '  <url>',
        `    <loc>${SITE_URL}/ServiceDetail?service=${o.slug}</loc>`,
        `    <lastmod>${lastmod}</lastmod>`,
        '    <changefreq>monthly</changefreq>',
        '    <priority>0.8</priority>',
        '  </url>',
    ].join('\n'));
    return [
        '  <!-- SERVICES_HIDDEN: Service Detail Pages. Remove this comment wrapper to restore. Generated from src/data/offerings.js by scripts/check-offerings.mjs in write mode; do not edit by hand.',
        urls.join('\n\n'),
        '  SERVICES_HIDDEN -->',
    ].join('\n');
}

// Finds the SERVICES_HIDDEN block whose first line contains `marker`, including the
// leading indentation, and returns [start, end] offsets or null.
function findBlock(text, marker) {
    const at = text.indexOf(marker);
    if (at < 0) return null;
    const start = text.lastIndexOf('\n', at) + 1;
    const close = text.indexOf('SERVICES_HIDDEN -->', at);
    if (close < 0) return null;
    return [start, close + 'SERVICES_HIDDEN -->'.length];
}

const targets = [
    {
        file: 'index.html',
        marker: '<!-- SERVICES_HIDDEN: JSON-LD Structured Data: Services.',
        build: () => jsonLdBlock(),
    },
    {
        file: 'public/sitemap.xml',
        marker: '<!-- SERVICES_HIDDEN: Service Detail Pages.',
        // Keep the existing lastmod so --write does not churn the date on every run.
        build: (current) => sitemapBlock(current.match(/<lastmod>([^<]+)<\/lastmod>/)?.[1] ?? new Date().toISOString().slice(0, 10)),
    },
];

for (const t of targets) {
    const path = join(ROOT, t.file);
    const text = readFileSync(path, 'utf8');
    const eol = text.includes('\r\n') ? '\r\n' : '\n';
    const lf = text.replace(/\r\n/g, '\n');
    const range = findBlock(lf, t.marker);
    if (!range) {
        check(false, `${t.file}: SERVICES_HIDDEN block present`);
        continue;
    }
    const current = lf.slice(range[0], range[1]);
    const expected = t.build(current);
    if (WRITE && current !== expected) {
        writeFileSync(path, (lf.slice(0, range[0]) + expected + lf.slice(range[1])).replace(/\n/g, eol));
        console.log(`wrote ${t.file}`);
    }
    check(WRITE || current === expected, `${t.file}: SERVICES_HIDDEN block matches offerings.js`, WRITE ? '' : 'run: node scripts/check-offerings.mjs --write');
}

// --- 2. Every ServiceDetail link names a defined slug ---
function walk(dir) {
    return readdirSync(dir).flatMap((name) => {
        const p = join(dir, name);
        return statSync(p).isDirectory() ? walk(p) : /\.(jsx?|mjs|html|xml)$/.test(name) ? [p] : [];
    });
}
const files = [...walk(join(ROOT, 'src')), join(ROOT, 'index.html'), join(ROOT, 'public', 'sitemap.xml')];
let linkCount = 0;
for (const file of files) {
    const text = readFileSync(file, 'utf8');
    for (const m of text.matchAll(LINK_RE)) {
        linkCount += 1;
        const line = text.slice(0, m.index).split('\n').length;
        check(slugs.includes(m[1]), `link slug defined: ${m[1]}`, `${relative(ROOT, file).replace(/\\/g, '/')}:${line}`);
    }
}
check(linkCount >= offerings.length * 2, 'found ServiceDetail links in index.html and sitemap.xml', `${linkCount} links`);

// --- Report ---
const failed = rows.filter((r) => !r.ok);
for (const r of rows) {
    if (!r.ok || process.argv.includes('--verbose')) {
        console.log(`${r.ok ? 'PASS' : 'FAIL'} ${r.name}${r.info ? `  (${r.info})` : ''}`);
    }
}
console.log(`\n${rows.length - failed.length}/${rows.length} passed (${offerings.length} offerings, ${linkCount} literal ServiceDetail links)`);
if (failed.length > 0) {
    process.exitCode = 1;
}
