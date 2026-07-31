/**
 * Browser bootstrap: reads the desired workspace from the URL and boots the
 * VS Code workbench with the memfs extension as an additional builtin.
 * Everything is resolved against document.baseURI, so the site works from
 * any origin or base path.
 */
import { create, URI, type IWorkspace, type IWorkspaceProvider } from "vscode-web/workbench";

const DEFAULT_FOLDER = "memfs:/portfolio";

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
  // The memfs extension opens README.md itself once it has seeded the
  // workspace. Opening it here via defaultLayout would deadlock on first
  // visit: editor restore waits for the memfs provider, which only registers
  // after startup finishes.
  configurationDefaults: {
    "workbench.startupEditor": "none",
    // Handed to the memfs extension, which applies the layout with vscode
    // commands — the extension runs in a worker and cannot see the viewport.
    "portfolio.startupLayout":
      window.innerWidth >= 1300
        ? "full"
        : window.innerWidth >= 900
          ? "preview-and-source"
          : "preview",
  },
  additionalBuiltinExtensions: [
    {
      scheme: memfsExtensionUrl.protocol.replace(/:$/, ""),
      authority: memfsExtensionUrl.host,
      path: memfsExtensionUrl.pathname,
    },
  ],
  productConfiguration: {
    nameShort: "ふぁ | Portfolio",
    nameLong: "ふぁ — Portfolio",
    // Serve the extension-host iframe from our own origin instead of the
    // default vscode-cdn.net template. Webviews (markdown preview etc.) are
    // NOT overridden: their bootstrap requires a per-webview subdomain
    // (sha-256 origin check), which only the official wildcard CDN provides.
    webEndpointUrlTemplate: vscodeBaseUrl,
    // The Microsoft marketplace may not be used outside official products;
    // Open VSX is the compliant gallery for self-hosted builds.
    extensionsGallery: {
      serviceUrl: "https://open-vsx.org/vscode/gallery",
      itemUrl: "https://open-vsx.org/vscode/item",
      resourceUrlTemplate: "https://open-vsx.org/vscode/unpkg/{publisher}/{name}/{version}/{path}",
    },
  },
});
