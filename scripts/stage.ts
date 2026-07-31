#!/usr/bin/env node
/**
 * Stages the static deploy payload into dist-site/ — exactly the files a
 * static host (GitHub Pages, etc.) needs, nothing else.
 */
import { cp, mkdir, rm } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { styleText } from "node:util";

const root = new URL("../", import.meta.url);
const site = new URL("dist-site/", root);

await rm(site, { recursive: true, force: true });
await mkdir(site, { recursive: true });

const targets: readonly string[] = [
  "index.html",
  "assets",
  "vscode-dist",
  "extensions/memfs/package.json",
  "extensions/memfs/package.nls.json",
  "extensions/memfs/dist",
];

for (const target of targets) {
  await cp(new URL(target, root), new URL(target, site), { recursive: true });
}

console.log(styleText("green", `Staged ${targets.length} entries into ${fileURLToPath(site)}`));
