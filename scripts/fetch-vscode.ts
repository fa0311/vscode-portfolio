#!/usr/bin/env node
/**
 * Downloads the official VS Code for the Web (web-standalone) build from
 * Microsoft's update server into vscode-dist/.
 *
 * Env vars:
 *   VSCODE_VERSION  version to fetch (default: "latest")
 *   VSCODE_QUALITY  "stable" or "insider" (default: "stable")
 */
import { createWriteStream } from "node:fs";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { pipeline } from "node:stream/promises";
import { Readable } from "node:stream";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";
import { styleText } from "node:util";
import { z } from "zod";

const execFileAsync = promisify(execFile);

const env = z
  .object({
    VSCODE_VERSION: z.string().min(1).default("latest"),
    VSCODE_QUALITY: z.enum(["stable", "insider"]).default("stable"),
  })
  .parse(process.env);

const DOWNLOAD_URL = `https://update.code.visualstudio.com/${env.VSCODE_VERSION}/web-standalone/${env.VSCODE_QUALITY}`;

const destDir = fileURLToPath(new URL("../vscode-dist/", import.meta.url));
const stampFile = new URL("../vscode-dist/.source-url", import.meta.url);

const response = await fetch(DOWNLOAD_URL);
if (!response.ok || !response.body) {
  throw new Error(`Download failed: ${response.status} ${response.statusText} (${DOWNLOAD_URL})`);
}

// The redirect target is commit-pinned, so it doubles as a cache key.
const resolvedUrl = response.url;
const previousUrl = await readFile(stampFile, "utf8").then(
  (s) => s.trim(),
  () => null,
);
if (previousUrl === resolvedUrl) {
  await response.body.cancel();
  console.log(styleText("green", `vscode-dist/ is up to date (${resolvedUrl})`));
  process.exit(0);
}

console.log(`Downloading ${resolvedUrl} ...`);
const tarball = fileURLToPath(new URL("../vscode-dist.tar.gz.tmp", import.meta.url));
await pipeline(Readable.fromWeb(response.body), createWriteStream(tarball));

console.log("Extracting ...");
await rm(destDir, { recursive: true, force: true });
await mkdir(destDir, { recursive: true });
await execFileAsync("tar", ["-xzf", tarball, "--strip-components=1", "-C", destDir]);
await rm(tarball, { force: true });
await writeFile(stampFile, `${resolvedUrl}\n`);

console.log(styleText("green", `Done: ${destDir}`));
