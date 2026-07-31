import * as vscode from "vscode";
import { MemFS } from "./fileSystemProvider";
import { PORTFOLIO_FILES, PORTFOLIO_ROOT } from "./portfolio";
import { applyEditorDefaults } from "./editorDefaults";
import { applyStartupLayout } from "./startupLayout";
import { registerThemeToggle } from "./themeToggle";

const SCHEME = "memfs";
const textEncoder = new TextEncoder();

export async function activate(context: vscode.ExtensionContext): Promise<void> {
  const memFs = new MemFS();
  context.subscriptions.push(
    vscode.workspace.registerFileSystemProvider(SCHEME, memFs, { isCaseSensitive: true }),
  );
  seed(memFs);
  registerThemeToggle(context);
  await applyEditorDefaults();

  const readme = vscode.Uri.from({ scheme: SCHEME, path: `${PORTFOLIO_ROOT}/README.md` });
  await applyStartupLayout(readme);
}

function seed(memFs: MemFS): void {
  memFs.createDirectory(vscode.Uri.from({ scheme: SCHEME, path: PORTFOLIO_ROOT }));
  const seededDirs = new Set([PORTFOLIO_ROOT]);

  for (const [path, content] of Object.entries(PORTFOLIO_FILES)) {
    // Create intermediate directories (e.g. /portfolio/projects) on demand.
    const segments = path.split("/").slice(1, -1);
    let dir = "";
    for (const segment of segments) {
      dir += `/${segment}`;
      if (!seededDirs.has(dir)) {
        memFs.createDirectory(vscode.Uri.from({ scheme: SCHEME, path: dir }));
        seededDirs.add(dir);
      }
    }
    memFs.writeFile(vscode.Uri.from({ scheme: SCHEME, path }), textEncoder.encode(content), {
      create: true,
      overwrite: true,
    });
  }
}
