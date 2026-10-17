import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const packageRoot = resolve("node_modules/sanity");
const packageMetadata = JSON.parse(
  readFileSync(resolve(packageRoot, "package.json"), "utf8"),
);
const cli = resolve(packageRoot, packageMetadata.bin.sanity);
const environment = {
  ...process.env,
  NODE_OPTIONS: `${process.env.NODE_OPTIONS || ""} --use-system-ca`.trim(),
};
const checks = process.argv.includes("--documents-only")
  ? [["documents", "validate", "--yes", "--format", "ndjson"]]
  : [
      ["build", ".next/studio-check", "--yes"],
      ["documents", "validate", "--yes", "--format", "ndjson"],
    ];
for (const args of checks) {
  console.log(`Running Sanity ${args.join(" ")}`);
  const result = spawnSync(process.execPath, [cli, ...args], {
    env: environment,
    encoding: "utf8",
    timeout: 300000,
    maxBuffer: 10 * 1024 * 1024,
  });
  if (result.stdout) process.stdout.write(result.stdout);
  if (result.stderr) process.stderr.write(result.stderr);
  if (result.error || result.status !== 0) {
    console.error(
      result.error?.message ||
        `Sanity exited with status ${result.status}, signal ${result.signal}`,
    );
    process.exit(result.status || 1);
  }
  console.log(`PASS: Sanity ${args[0]} (exit 0)`);
}