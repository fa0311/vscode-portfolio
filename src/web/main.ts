/**
 * Browser bootstrap: reads the desired workspace from the URL and boots the
 * VS Code workbench with the memfs extension as an additional builtin.
 * Everything is resolved against document.baseURI, so the site works from
 * any origin or base path.
 */
import { create, URI, type IWorkspace, type IWorkspaceProvider } from "vscode-web/workbench";

const DEFAULT_FOLDER = "memfs:/sample";

class WorkspaceProvider implements IWorkspaceProvider {
  static fromLocation(): WorkspaceProvider {
    const params = new URLSearchParams(location.search);
    if (params.has("ew")) {
      return new WorkspaceProvider(undefined);
    }
    const folder = params.get("folder");
    if (folder) {
      return new WorkspaceProvider({ folderUri: URI.parse(folder) });
    }
    const workspace = params.get("workspace");
    if (workspace) {
      return new WorkspaceProvider({ workspaceUri: URI.parse(workspace) });
    }
    return new WorkspaceProvider({ folderUri: URI.parse(DEFAULT_FOLDER) });
  }

  readonly trusted = true;

  private constructor(readonly workspace: IWorkspace) {}

  async open(workspace: IWorkspace, options?: { reuse?: boolean }): Promise<boolean> {
    const target = new URL(location.pathname, location.href);
    if (!workspace) {
      target.searchParams.set("ew", "true");
    } else if ("folderUri" in workspace) {
      target.searchParams.set("folder", URI.revive(workspace.folderUri).toString(true));
    } else {
      target.searchParams.set("workspace", URI.revive(workspace.workspaceUri).toString(true));
    }
    if (options?.reuse) {
      location.href = target.href;
      return true;
    }
    return window.open(target.href) !== null;
  }
}

const memfsExtensionUrl = new URL("./extensions/memfs", document.baseURI);
const vscodeBaseUrl = new URL("./vscode-dist", document.baseURI).href;

create(document.body, {
  workspaceProvider: WorkspaceProvider.fromLocation(),
  additionalBuiltinExtensions: [
    {
      scheme: memfsExtensionUrl.protocol.replace(/:$/, ""),
      authority: memfsExtensionUrl.host,
      path: memfsExtensionUrl.pathname,
    },
  ],
  productConfiguration: {
    nameShort: "VS Code Web (memfs)",
    nameLong: "VS Code for the Web — in-memory workspace",
    // Serve the extension-host iframe and webviews from our own origin
    // instead of the default vscode-cdn.net template, so the site is
    // fully self-contained.
    webEndpointUrlTemplate: vscodeBaseUrl,
    webviewContentExternalBaseUrlTemplate: `${vscodeBaseUrl}/out/vs/workbench/contrib/webview/browser/pre/`,
    // The Microsoft marketplace may not be used outside official products;
    // Open VSX is the compliant gallery for self-hosted builds.
    extensionsGallery: {
      serviceUrl: "https://open-vsx.org/vscode/gallery",
      itemUrl: "https://open-vsx.org/vscode/item",
      resourceUrlTemplate: "https://open-vsx.org/vscode/unpkg/{publisher}/{name}/{version}/{path}",
    },
  },
});
