#!/usr/bin/env node
/**
 * Copy manifest — the guarantee that a redesign changes the look, not the words.
 *
 * Parses every .tsx under src/ with the TypeScript compiler and collects the
 * strings a visitor can actually read:
 *   - JSX text nodes
 *   - string literals passed to copy-bearing JSX attributes (title, alt, ...)
 *
 * Run it before and after a redesign and diff the two files. Any line that
 * disappears is a word that went missing.
 *
 *   node scripts/copy-manifest.mjs > /tmp/after.txt
 *   diff scripts/copy-baseline.txt /tmp/after.txt
 *
 * This walks the real syntax tree rather than matching angle brackets, so
 * generics (`useRef<T>`), comparisons (`x >= y`) and GLSL in template literals
 * can never be mistaken for prose, and a sentence broken by a `{" "}` container
 * is still captured on both sides.
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import ts from "typescript";

const ROOT = "src";

/** JSX attributes whose string value is shown to, or read out to, a visitor. */
const COPY_ATTRS = new Set([
  "title",
  "label",
  "alt",
  "placeholder",
  "description",
  "heading",
  "subtitle",
  "caption",
  "cta",
  "tooltip",
  "aria-label",
  "ariaLabel",
]);

const files = [];
(function walk(dir) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) walk(p);
    else if (p.endsWith(".tsx")) files.push(p);
  }
})(ROOT);

const seen = new Set();
const add = (raw) => {
  const text = String(raw).replace(/\s+/g, " ").trim();
  if (text.length < 2) return;
  if (!/[A-Za-z]/.test(text)) return;
  seen.add(text);
};

for (const file of files.sort()) {
  const source = ts.createSourceFile(
    file,
    readFileSync(file, "utf8"),
    ts.ScriptTarget.ES2022,
    /* setParentNodes */ true,
    ts.ScriptKind.TSX,
  );

  const visit = (node) => {
    // Text sitting directly between JSX tags. `.text` is already the decoded
    // value, so HTML entities need no special handling.
    if (ts.isJsxText(node)) add(node.text);

    // <Foo title="..." /> and friends.
    if (ts.isJsxAttribute(node) && node.initializer) {
      const name = node.name.getText(source);
      if (COPY_ATTRS.has(name)) {
        const init = node.initializer;
        if (ts.isStringLiteral(init)) add(init.text);
        else if (
          ts.isJsxExpression(init) &&
          init.expression &&
          (ts.isStringLiteral(init.expression) ||
            ts.isNoSubstitutionTemplateLiteral(init.expression))
        ) {
          add(init.expression.text);
        }
      }
    }

    ts.forEachChild(node, visit);
  };
  visit(source);
}

for (const line of [...seen].sort()) console.log(line);
console.error(`${seen.size} unique copy strings across ${files.length} .tsx files`);
