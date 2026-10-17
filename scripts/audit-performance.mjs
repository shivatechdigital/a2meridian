import { existsSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import lighthouse from "lighthouse";
import * as chromeLauncher from "chrome-launcher";

const candidates = [
  process.env.CHROME_PATH,
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
].filter(Boolean);
const chromePath = candidates.find((path) => existsSync(path));
if (!chromePath)
  throw new Error(
    "Chrome or Edge not found. Set CHROME_PATH to a Chromium executable.",
  );
const url = process.env.AUDIT_URL || "http://localhost:3002/";
const destination = ".next/audits";
await mkdir(destination, { recursive: true });
const summary = [];
for (const device of ["mobile", "desktop"]) {
  const chrome = await chromeLauncher.launch({
    chromePath,
    chromeFlags: ["--headless=new", "--disable-gpu", "--no-first-run"],
  });
  try {
    const settings = {
      port: chrome.port,
      logLevel: "error",
      output: ["json", "html"],
      onlyCategories: ["performance", "accessibility", "best-practices", "seo"],
      ...(device === "desktop" ? { preset: "desktop" } : {}),
    };
    const result = await lighthouse(url, settings);
    if (!result) throw new Error("No Lighthouse result");
    await writeFile(join(destination, `${device}.json`), result.report[0]);
    await writeFile(join(destination, `${device}.html`), result.report[1]);
    const { lhr } = result;
    const scores = Object.fromEntries(
      Object.entries(lhr.categories).map(([name, category]) => [
        name,
        Math.round(category.score * 100),
      ]),
    );
    const metrics = Object.fromEntries(
      [
        "first-contentful-paint",
        "largest-contentful-paint",
        "total-blocking-time",
        "cumulative-layout-shift",
        "speed-index",
      ].map((name) => [name, lhr.audits[name]?.displayValue]),
    );
    const failures = Object.values(lhr.audits)
      .filter((audit) => typeof audit.score === "number" && audit.score < 1)
      .map((audit) => ({
        id: audit.id,
        title: audit.title,
        value: audit.displayValue,
      }));
    const item = {
      device,
      url,
      fetchedAt: lhr.fetchTime,
      lighthouseVersion: lhr.lighthouseVersion,
      scores,
      metrics,
      failures,
      warnings: lhr.runWarnings,
    };
    summary.push(item);
    console.log(JSON.stringify(item, null, 2));
  } finally {
    await chrome.kill();
  }
}
await writeFile(
  join(destination, "summary.json"),
  JSON.stringify(summary, null, 2),
);
