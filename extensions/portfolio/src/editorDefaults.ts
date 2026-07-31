import * as vscode from "vscode";

/**
 * Turns word wrap off for markdown.
 *
 * This cannot be done from the workbench `configurationDefaults`: VS Code
 * ships `"[markdown]": { "editor.wordWrap": "on" }` as a language default,
 * which outranks a plain default for `editor.wordWrap`. Writing a real
 * language-scoped setting from the extension does outrank it.
 */
export async function applyEditorDefaults(): Promise<void> {
  const markdown = vscode.workspace.getConfiguration("editor", { languageId: "markdown" });
  if (markdown.get<string>("wordWrap") !== "off") {
    await markdown.update("wordWrap", "off", vscode.ConfigurationTarget.Global, true);
  }
}
