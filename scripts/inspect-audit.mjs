import { readFile } from "node:fs/promises";
const report = JSON.parse(await readFile(".next/audits/mobile.json", "utf8"));
for (const id of [
  "lcp-breakdown-insight",
  "lcp-discovery-insight",
  "bootup-time",
  "mainthread-work-breakdown",
  "label-content-name-mismatch",
  "image-delivery-insight",
  "network-requests",
]) {
  const audit = report.audits[id];
  const items = audit.details?.items || [];
  console.log(
    JSON.stringify(
      {
        id,
        details:
          id === "network-requests"
            ? items
                .filter((item) => item.resourceType === "Script")
                .map((item) => ({ url: item.url, bytes: item.transferSize }))
            : items,
      },
      null,
      2,
    ),
  );
}
