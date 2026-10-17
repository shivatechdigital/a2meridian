import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { compile } from "@tailwindcss/node";

const source = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");
const compiler = await compile(source, {
  base: fileURLToPath(new URL("../", import.meta.url)),
  onDependency() {},
});
const candidates = [
  "bg-navy-900", "text-gold-500", "bg-offwhite",
  "font-heading", "font-body", "font-mono",
  "animate-fade-in-up", "animate-fade-in",
  "animate-slide-in-left", "animate-slide-in-right",
  "animate-pulse-glow", "animate-float", "animate-marquee",
  "scrollbar-hide", "text-gradient-gold", "glass", "glass-dark",
];
const css = compiler.build(candidates);

for (const candidate of candidates) {
  assert.ok(css.includes(`.${candidate}`), `Missing utility: ${candidate}`);
}
assert.ok(css.includes("@keyframes fadeInUp"));
assert.ok(css.includes("#0a1628"));
assert.ok(css.includes("--font-playfair-display"));
console.log("PASS: all 17 foundation utilities, keyframes, palette, and fonts.");