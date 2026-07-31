import * as vscode from "vscode";
import { MemFS } from "./fileSystemProvider";

const SCHEME = "memfs";
const textEncoder = new TextEncoder();

export function activate(context: vscode.ExtensionContext): void {
  const memFs = new MemFS();
  context.subscriptions.push(
    vscode.workspace.registerFileSystemProvider(SCHEME, memFs, { isCaseSensitive: true }),
  );
  seed(memFs);
}

function seed(memFs: MemFS): void {
  const write = (path: string, content: string) =>
    memFs.writeFile(vscode.Uri.from({ scheme: SCHEME, path }), textEncoder.encode(content), {
      create: true,
      overwrite: true,
    });

  memFs.createDirectory(vscode.Uri.from({ scheme: SCHEME, path: "/sample" }));
  write(
    "/sample/README.md",
    [
      "# In-memory workspace",
      "",
      "This workspace lives entirely in RAM (`memfs:` scheme).",
      "Everything you create or edit here disappears when you reload the page.",
      "",
    ].join("\n"),
  );
  write(
    "/sample/hello.ts",
    ["export function hello(name: string): string {", "\treturn `Hello, ${name}!`;", "}", ""].join(
      "\n",
    ),
  );
}
