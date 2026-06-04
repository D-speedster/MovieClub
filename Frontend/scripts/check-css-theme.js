#!/usr/bin/env node
/**
 * CSS Theme Regression Guard
 * Checks component CSS files for theme violations to prevent regressions.
 * Requirement 3.6
 *
 * Usage: node scripts/check-css-theme.js
 * Exit code: 0 = all checks passed, 1 = one or more checks failed
 */

'use strict';

const fs = require('fs');
const path = require('path');

// Resolve paths relative to the Frontend project root (one level above scripts/)
const ROOT = path.resolve(__dirname, '..');

/**
 * Component CSS files to scan for Netflix red colors and undefined variable refs.
 */
const COMPONENT_CSS_FILES = [
  'src/components/Layout/Header/Header.css',
  'src/components/Layout/MobileNav/MobileNav.css',
  'src/components/Layout/Footer/Footer.css',
  'src/components/UI/MovieCard/MovieCard.css',
  'src/components/UI/MovieSlider/MovieSlider.css',
  'src/components/UI/HeroSection/HeroSection.css',
  'src/components/UI/SearchOverlay/SearchOverlay.css',
  'src/Pages/Movies/Movies.css',
  'src/Pages/Series/Series.css',
  'src/Pages/Home/Home.redesigned.css',
];

// ─── Helpers ────────────────────────────────────────────────────────────────

/**
 * Read a file and return its content, or null if the file does not exist.
 * @param {string} relativePath - Path relative to ROOT
 * @returns {string|null}
 */
function readFile(relativePath) {
  const abs = path.join(ROOT, relativePath);
  if (!fs.existsSync(abs)) {
    return null;
  }
  return fs.readFileSync(abs, 'utf8');
}

/**
 * Print a pass/fail line and return whether it passed.
 * @param {boolean} passed
 * @param {string} message
 * @returns {boolean}
 */
function report(passed, message) {
  const icon = passed ? '✅' : '❌';
  console.log(`${icon}  ${message}`);
  return passed;
}

// ─── Check 1: No Netflix red colors in component CSS files ──────────────────

/**
 * Returns an array of {file, matches} for each file that contains Netflix red.
 */
function checkNetflixRed() {
  const NETFLIX_RED = /#e50914|#c40812|#B20710|#b20710/gi;
  const violations = [];

  for (const relPath of COMPONENT_CSS_FILES) {
    const content = readFile(relPath);
    if (content === null) {
      // File missing — not a red-color violation; missing-file issues surface elsewhere
      continue;
    }
    const found = content.match(NETFLIX_RED);
    if (found) {
      violations.push({ file: relPath, matches: [...new Set(found)] });
    }
  }

  const passed = violations.length === 0;
  report(passed, 'No Netflix red colors (#e50914, #c40812, #B20710, #b20710) in component CSS files');
  if (!passed) {
    for (const { file, matches } of violations) {
      console.log(`     └─ ${file}: ${matches.join(', ')}`);
    }
  }
  return passed;
}

// ─── Check 2: No undefined variable references ──────────────────────────────

/**
 * Returns an array of {file, matches} for each file that references undefined vars.
 */
function checkUndefinedVars() {
  const UNDEFINED_VARS = /var\(--accent-primary\)|var\(--bg-tertiary\)|var\(--accent-secondary\)/g;
  const violations = [];

  for (const relPath of COMPONENT_CSS_FILES) {
    const content = readFile(relPath);
    if (content === null) {
      continue;
    }
    const found = content.match(UNDEFINED_VARS);
    if (found) {
      violations.push({ file: relPath, matches: [...new Set(found)] });
    }
  }

  const passed = violations.length === 0;
  report(
    passed,
    'No undefined variable references (var(--accent-primary), var(--bg-tertiary), var(--accent-secondary))'
  );
  if (!passed) {
    for (const { file, matches } of violations) {
      console.log(`     └─ ${file}: ${matches.join(', ')}`);
    }
  }
  return passed;
}

// ─── Check 3: src/theme/colors.css has no :root block ───────────────────────

function checkColorsNoRoot() {
  const relPath = 'src/theme/colors.css';
  const content = readFile(relPath);

  if (content === null) {
    // File does not exist — treat as pass (nothing to violate)
    return report(true, `${relPath} has no :root block (file not found — skipped)`);
  }

  const hasRoot = /:root\s*\{/.test(content);
  return report(!hasRoot, `${relPath} has no :root { } block`);
}

// ─── Check 4: global-theme.css has no !important outside html/body/#root/.App ─

/**
 * Parses global-theme.css rule-blocks and checks whether any block whose selector
 * does NOT cover only html / body / #root / .App contains !important.
 *
 * Strategy:
 *   1. Strip CSS comments.
 *   2. Split on closing braces to identify rule blocks.
 *   3. For each block, separate selector(s) from declarations.
 *   4. If declarations contain !important AND the selector is not exclusively
 *      html / body / #root / .App (or combinations thereof), it is a violation.
 */
function checkGlobalThemeImportant() {
  const relPath = 'src/theme/global-theme.css';
  const content = readFile(relPath);

  if (content === null) {
    return report(true, `${relPath} has no !important outside html/body/#root/.App (file not found — skipped)`);
  }

  // Remove CSS comments
  const stripped = content.replace(/\/\*[\s\S]*?\*\//g, '');

  // The only selectors that are allowed to contain !important
  // A selector is "safe" if every comma-separated part is one of:
  //   html | body | #root | .App
  const SAFE_SELECTOR_PARTS = /^\s*(html|body|#root|\.App)\s*$/;

  function isSelectorSafe(selector) {
    return selector
      .split(',')
      .every((part) => SAFE_SELECTOR_PARTS.test(part));
  }

  // Extract rule blocks: everything up to and including the next `}`
  // We look for patterns like: <selector> { <declarations> }
  // We do this with a simple state machine rather than a complex regex,
  // to handle nested {} (e.g. @media) gracefully.
  const violations = [];
  let i = 0;
  while (i < stripped.length) {
    // Find the next opening brace
    const openIdx = stripped.indexOf('{', i);
    if (openIdx === -1) break;

    const selector = stripped.slice(i, openIdx).trim();

    // Find the matching closing brace (handle nesting)
    let depth = 1;
    let j = openIdx + 1;
    while (j < stripped.length && depth > 0) {
      if (stripped[j] === '{') depth++;
      else if (stripped[j] === '}') depth--;
      j++;
    }

    const blockBody = stripped.slice(openIdx + 1, j - 1);

    // Skip @-rules that wrap other blocks (e.g. @media, @keyframes)
    const isAtRule = /^@/.test(selector);

    if (!isAtRule && blockBody.includes('!important')) {
      if (!isSelectorSafe(selector)) {
        violations.push(selector);
      }
    }

    i = j;
  }

  const passed = violations.length === 0;
  report(passed, `${relPath} has no !important outside html/body/#root/.App selectors`);
  if (!passed) {
    for (const sel of violations) {
      console.log(`     └─ Selector: ${sel}`);
    }
  }
  return passed;
}

// ─── Main ────────────────────────────────────────────────────────────────────

function main() {
  console.log('');
  console.log('CSS Theme Regression Guard');
  console.log('══════════════════════════════════════════════════');
  console.log('');

  const results = [
    checkNetflixRed(),
    checkUndefinedVars(),
    checkColorsNoRoot(),
    checkGlobalThemeImportant(),
  ];

  console.log('');
  console.log('══════════════════════════════════════════════════');

  const allPassed = results.every(Boolean);
  if (allPassed) {
    console.log('✅  All checks passed.');
    process.exit(0);
  } else {
    const failed = results.filter((r) => !r).length;
    console.log(`❌  ${failed} check(s) failed.`);
    process.exit(1);
  }
}

main();
