import * as vscode from "vscode";

/** Opens the README preview, unless the visitor already has tabs open. */
export async function applyStartupLayout(readme: vscode.Uri): Promise<void> {
  // Never steal the layout from tabs restored from a previous session.
  const hasOpenTabs = vscode.window.tabGroups.all.some((group) => group.tabs.length > 0);
  if (hasOpenTabs) {
    return;
  }
  await vscode.commands.executeCommand("markdown.showPreview", readme);
}
