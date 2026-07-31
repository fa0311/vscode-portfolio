import * as vscode from "vscode";

const TOGGLE_COMMAND = "portfolio.toggleTheme";
const AUTO_DETECT = "window.autoDetectColorScheme";

/**
 * Adds a status bar button that flips between light and dark.
 *
 * Until it is pressed the workbench follows the OS colour scheme
 * (`window.autoDetectColorScheme`); pressing it is an explicit choice, so
 * auto-detection is turned off to stop the OS from overriding the visitor.
 */
export function registerThemeToggle(context: vscode.ExtensionContext): void {
  const item = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right,
    Number.MAX_SAFE_INTEGER,
  );
  item.command = TOGGLE_COMMAND;
  item.tooltip = "Toggle light / dark theme";
  item.show();

  const render = () => {
    item.text = isDark() ? "$(color-mode) Dark" : "$(color-mode) Light";
  };
  render();

  context.subscriptions.push(
    item,
    vscode.window.onDidChangeActiveColorTheme(render),
    vscode.commands.registerCommand(TOGGLE_COMMAND, async () => {
      const target = vscode.ConfigurationTarget.Global;
      const config = vscode.workspace.getConfiguration();
      if (config.get<boolean>(AUTO_DETECT)) {
        await config.update(AUTO_DETECT, false, target);
      }
      await config.update(
        "workbench.colorTheme",
        isDark() ? "Default Light Modern" : "Default Dark Modern",
        target,
      );
    }),
  );
}

function isDark(): boolean {
  const kind = vscode.window.activeColorTheme.kind;
  return kind === vscode.ColorThemeKind.Dark || kind === vscode.ColorThemeKind.HighContrast;
}
