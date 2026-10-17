import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = new URL("../public/", import.meta.url);
const monogram = `<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256"><rect width="256" height="256" rx="32" fill="#0a1628"/><rect x="20" y="20" width="216" height="216" rx="18" fill="none" stroke="#c8963e" stroke-width="8"/><text x="128" y="165" text-anchor="middle" font-family="Georgia,serif" font-size="114" font-weight="bold" fill="#e4bc66">A2</text></svg>`;
await writeFile(new URL("icon.svg", root), monogram);
await sharp(Buffer.from(monogram))
  .resize(180, 180)
  .png()
  .toFile(fileURLToPath(new URL("apple-touch-icon.png", root)));
await writeFile(
  new URL("logo.png", root),
  await sharp(Buffer.from(monogram)).resize(256, 256).png().toBuffer(),
);
const icon = await sharp(Buffer.from(monogram)).resize(32, 32).png().toBuffer();
const ico = Buffer.alloc(22);
ico.writeUInt16LE(1, 2);
ico.writeUInt16LE(1, 4);
ico[6] = 32;
ico[7] = 32;
ico.writeUInt16LE(1, 10);
ico.writeUInt16LE(32, 12);
ico.writeUInt32LE(icon.length, 14);
ico.writeUInt32LE(22, 18);
await writeFile(new URL("favicon.ico", root), Buffer.concat([ico, icon]));
const photo = await sharp(await readFile(new URL("trade-port.jpg", root)))
  .resize(1200, 630, { fit: "cover" })
  .toBuffer();
await writeFile(
  new URL("hero-port.webp", root),
  await sharp(await readFile(new URL("trade-port.jpg", root)))
    .resize(1600)
    .webp({ quality: 68 })
    .toBuffer(),
);
const overlay = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630"><rect width="1200" height="630" fill="#060e1a" opacity=".76"/><rect x="68" y="67" width="76" height="76" rx="8" fill="#c8963e"/><text x="106" y="119" text-anchor="middle" font-family="Georgia,serif" font-size="39" font-weight="bold" fill="#0a1628">A2</text><text x="68" y="280" font-family="Georgia,serif" font-size="77" font-weight="bold" fill="#ffffff">A2 Meridian</text><text x="68" y="370" font-family="Georgia,serif" font-size="77" font-weight="bold" fill="#ffffff">Associates</text><text x="72" y="454" font-family="sans-serif" font-size="31" fill="#e4bc66">Import &amp; Export | Greater Noida, India</text><rect x="72" y="493" width="140" height="4" fill="#c8963e"/></svg>`;
await writeFile(
  new URL("og-image.jpg", root),
  await sharp(photo)
    .composite([{ input: Buffer.from(overlay) }])
    .jpeg({ quality: 88 })
    .toBuffer(),
);
console.log(
  "Generated OG 1200x630, A2 logo, SVG/ICO favicon, and 180px Apple icon.",
);
