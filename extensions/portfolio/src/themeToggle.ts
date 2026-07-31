import * as vscode from "vscode";

const TOGGLE_COMMAND = "portfolio.toggleTheme";
const AUTO_DETECT = "window.autoDetectColorScheme";

/**
 * Registers the light/dark toggle. The button itself is contributed to the
 * editor title bar (see contributes.menus in package.json).
 *
 * Until it is pressed the workbench follows the OS colour scheme
 * (`window.autoDetectColorScheme`); pressing it is an explicit choice, so
 * auto-detection is turned off to stop the OS from overriding the visitor.
 */
export function registerThemeToggle(context: vscode.ExtensionContext): void {
  context.subscriptions.push(
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
