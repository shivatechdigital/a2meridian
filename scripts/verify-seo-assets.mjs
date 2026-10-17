import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import sharp from "sharp";

for (const [file, width, height] of [["og-image.jpg", 1200, 630], ["apple-touch-icon.png", 180, 180], ["logo.png", 256, 256]]) {
  const metadata = await sharp(await readFile(new URL(`../public/${file}`, import.meta.url))).metadata();
  assert.equal(metadata.width, width, `${file} width`);
  assert.equal(metadata.height, height, `${file} height`);
}
const icon = await readFile(new URL("../public/favicon.ico", import.meta.url));
assert.equal(icon.readUInt16LE(2), 1);
assert.equal(icon.readUInt16LE(4), 1);
assert.equal(icon[6], 32);
assert.equal(icon[7], 32);
const hero = await sharp(await readFile(new URL("../public/hero-port.webp", import.meta.url))).metadata();
assert.equal(hero.format, "webp");
assert.equal(hero.width, 1600);
console.log("PASS: social image, Apple icon, logo, 32px ICO, and optimized hero dimensions.");