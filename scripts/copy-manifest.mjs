#!/usr/bin/env node
/**
 * Copy manifest — the guarantee that a redesign changes the look, not the words.
 *
 * Parses every .tsx under src/ with the TypeScript compiler and collects the
 * strings a visitor can actually read:
 *   - JSX text nodes
 *   - string literals passed to copy-bearing JSX attributes (title, alt, ...)
 *   - string literals on copy-bearing keys of object literals (title, body, ...),
 *     which is how content that is declared as data and rendered by a component
 *     reaches the page — HERO_PANELS, FAQS, the StickyScroll entries
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
  "text",
  "body",
  "q",
  "a",
  "name",
  "answer",
  "question",
  "summary",
  "words",
  "phrase",
  "line",
  "note",
  "t",
  "d",
  "q",
  "a",
]);

const files = [];
(function walk(dir) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) walk(p);
    else if (p.endsWith(".tsx")) files.push(p);
  }
})(ROOT);

/** The five entities JSX text carries. A JSX *attribute* value arrives from
 * the compiler already decoded, JSX *text* does not, so the same sentence
 * compared across a move from one to the other would read as removed-and-added
 * when nothing about the rendered page changed. Normalise both to the decoded
 * form, which is what a visitor actually sees. */
const ENTITIES = { "&quot;": '"', "&apos;": "'", "&amp;": "&", "&lt;": "<", "&gt;": ">" };
const decode = (text) => text.replace(/&(?:quot|apos|amp|lt|gt);/g, (m) => ENTITIES[m] ?? m);

const seen = new Set();
const add = (raw) => {
  const text = decode(String(raw)).replace(/\s+/g, " ").trim();
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

    // const BBI_US = ["...", "..."] — a list of sentences held as a plain
    // array and mapped into <li> at render. Restricted to CONSTANT_CASE
    // declarations so that arrays of slugs, class names and query keys
    // elsewhere in the tree are not swept up as prose.
    if (ts.isArrayLiteralExpression(node)) {
      const decl = node.parent;
      const name =
        decl && ts.isVariableDeclaration(decl) && ts.isIdentifier(decl.name)
          ? decl.name.text
          : "";
      if (/^[A-Z][A-Z0-9_]*$/.test(name)) {
        for (const element of node.elements) {
          if (ts.isStringLiteral(element) || ts.isNoSubstitutionTemplateLiteral(element)) {
            add(element.text);
          }
        }
      }
    }

    // { title: "...", body: "..." } — copy declared as data rather than markup.
    if (
      ts.isPropertyAssignment(node) &&
      (ts.isIdentifier(node.name) || ts.isStringLiteral(node.name)) &&
      COPY_ATTRS.has(node.name.text)
    ) {
      const value = node.initializer;
      if (ts.isStringLiteral(value) || ts.isNoSubstitutionTemplateLiteral(value)) add(value.text);
    }

    ts.forEachChild(node, visit);
  };
  visit(source);
}

for (const line of [...seen].sort()) console.log(line);
console.error(`${seen.size} unique copy strings across ${files.length} .tsx files`);
