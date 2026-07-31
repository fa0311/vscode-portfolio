/**
 * Minimal typings for the API surface of VS Code's built web bundle
 * (vscode-dist/out/vs/workbench/workbench.web.main.internal.js), which is
 * mapped to the bare specifier "vscode-web/workbench" via the import map in
 * index.html. Shapes follow microsoft/vscode's src/vs/workbench/browser/web.api.ts.
 */
declare module "vscode-web/workbench" {
  export interface UriComponents {
    scheme: string;
    authority?: string;
    path?: string;
    query?: string;
    fragment?: string;
  }

  export class URI implements UriComponents {
    readonly scheme: string;
    readonly authority: string;
    readonly path: string;
    readonly query: string;
    readonly fragment: string;
    static parse(value: string): URI;
    static revive(components: UriComponents): URI;
    static from(components: UriComponents): URI;
    with(change: Partial<UriComponents>): URI;
    toString(skipEncoding?: boolean): string;
  }

  export type IWorkspace =
    | { folderUri: UriComponents }
    | { workspaceUri: UriComponents }
    | undefined;

  export interface IWorkspaceProvider {
    readonly workspace: IWorkspace;
    readonly trusted?: boolean;
    readonly payload?: object;
    open(workspace: IWorkspace, options?: { reuse?: boolean; payload?: object }): Promise<boolean>;
  }

  export interface IDefaultEditor {
    readonly viewColumn?: number;
    readonly uri: UriComponents;
    readonly options?: Record<string, unknown>;
  }

  export interface IDefaultLayout {
    readonly editors?: readonly IDefaultEditor[];
    readonly force?: boolean;
  }

  export interface IInitialColorTheme {
    readonly themeType: "light" | "dark" | "hcLight" | "hcDark";
    readonly colors?: Record<string, string>;
  }

  export interface IWorkbenchConstructionOptions {
    readonly workspaceProvider?: IWorkspaceProvider;
    readonly additionalBuiltinExtensions?: readonly (string | UriComponents)[];
    readonly productConfiguration?: Record<string, unknown>;
    readonly defaultLayout?: IDefaultLayout;
    readonly configurationDefaults?: Record<string, unknown>;
    readonly initialColorTheme?: IInitialColorTheme;
  }

  export interface IDisposable {
    dispose(): void;
  }

  export function create(
    domElement: HTMLElement,
    options: IWorkbenchConstructionOptions,
  ): IDisposable;
}
