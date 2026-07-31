import * as vscode from "vscode";

/**
 * Layout classes, decided by the bootstrap (src/web/main.ts) from the
 * viewport width and handed over via the `portfolio.startupLayout`
 * configuration default:
 *
 * - "preview"            — README preview only (small screens)
 * - "preview-and-source" — README source to the right of the preview
 * - "full"               — the above plus the explorer sidebar
 */
export type StartupLayout = "preview" | "preview-and-source" | "full";

export async function applyStartupLayout(readme: vscode.Uri): Promise<void> {
  // Never steal the layout from tabs restored from a previous session.
  const hasOpenTabs = vscode.window.tabGroups.all.some((group) => group.tabs.length > 0);
  if (hasOpenTabs) {
    return;
  }

  const layout =
    vscode.workspace.getConfiguration("portfolio").get<StartupLayout>("startupLayout") ?? "full";

  await vscode.commands.executeCommand("markdown.showPreview", readme);
  if (layout !== "preview") {
    await vscode.window.showTextDocument(readme, {
      viewColumn: vscode.ViewColumn.Beside,
      preserveFocus: true,
    });
  }
  if (layout !== "full") {
    await vscode.commands.executeCommand("workbench.action.closeSidebar");
  }
}
