/*---------------------------------------------------------------------------------------------
 * In-memory FileSystemProvider, based on the official VS Code fsprovider-sample (MemFS).
 * All state lives in this object graph — nothing ever touches disk.
 *--------------------------------------------------------------------------------------------*/
import * as vscode from "vscode";

export class File implements vscode.FileStat {
  readonly type = vscode.FileType.File;
  ctime: number;
  mtime: number;
  size = 0;
  data?: Uint8Array;

  constructor(readonly name: string) {
    this.ctime = Date.now();
    this.mtime = Date.now();
  }
}

export class Directory implements vscode.FileStat {
  readonly type = vscode.FileType.Directory;
  ctime: number;
  mtime: number;
  size = 0;
  readonly entries = new Map<string, Entry>();

  constructor(readonly name: string) {
    this.ctime = Date.now();
    this.mtime = Date.now();
  }
}

export type Entry = File | Directory;

export class MemFS implements vscode.FileSystemProvider {
  private readonly root = new Directory("");

  // --- manage file metadata

  stat(uri: vscode.Uri): vscode.FileStat {
    return this.lookup(uri, false);
  }

  readDirectory(uri: vscode.Uri): [string, vscode.FileType][] {
    const entry = this.lookupAsDirectory(uri, false);
    return [...entry.entries.entries()].map(([name, child]) => [name, child.type]);
  }

  // --- manage file contents

  readFile(uri: vscode.Uri): Uint8Array {
    const data = this.lookupAsFile(uri, false).data;
    if (data) {
      return data;
    }
    throw vscode.FileSystemError.FileNotFound(uri);
  }

  writeFile(
    uri: vscode.Uri,
    content: Uint8Array,
    options: { create: boolean; overwrite: boolean },
  ): void {
    const basename = this.basename(uri.path);
    const parent = this.lookupParentDirectory(uri);
    let entry = parent.entries.get(basename);
    if (entry instanceof Directory) {
      throw vscode.FileSystemError.FileIsADirectory(uri);
    }
    if (!entry && !options.create) {
      throw vscode.FileSystemError.FileNotFound(uri);
    }
    if (entry && options.create && !options.overwrite) {
      throw vscode.FileSystemError.FileExists(uri);
    }
    if (!entry) {
      entry = new File(basename);
      parent.entries.set(basename, entry);
      this.fireSoon({ type: vscode.FileChangeType.Created, uri });
    }
    entry.mtime = Date.now();
    entry.size = content.byteLength;
    entry.data = content;
    this.fireSoon({ type: vscode.FileChangeType.Changed, uri });
  }

  // --- manage files/folders

  rename(oldUri: vscode.Uri, newUri: vscode.Uri, options: { overwrite: boolean }): void {
    if (!options.overwrite && this.lookup(newUri, true)) {
      throw vscode.FileSystemError.FileExists(newUri);
    }
    const entry = this.lookup(oldUri, false);
    const oldParent = this.lookupParentDirectory(oldUri);
    const newParent = this.lookupParentDirectory(newUri);
    const newName = this.basename(newUri.path);

    oldParent.entries.delete(entry.name);
    const renamed = entry instanceof File ? new File(newName) : new Directory(newName);
    renamed.mtime = entry.mtime;
    renamed.ctime = entry.ctime;
    renamed.size = entry.size;
    if (entry instanceof File && renamed instanceof File) {
      renamed.data = entry.data;
    }
    if (entry instanceof Directory && renamed instanceof Directory) {
      for (const [name, child] of entry.entries) {
        renamed.entries.set(name, child);
      }
    }
    newParent.entries.set(newName, renamed);

    this.fireSoon(
      { type: vscode.FileChangeType.Deleted, uri: oldUri },
      { type: vscode.FileChangeType.Created, uri: newUri },
    );
  }

  delete(uri: vscode.Uri): void {
    const dirname = uri.with({ path: this.dirname(uri.path) });
    const basename = this.basename(uri.path);
    const parent = this.lookupAsDirectory(dirname, false);
    if (!parent.entries.has(basename)) {
      throw vscode.FileSystemError.FileNotFound(uri);
    }
    parent.entries.delete(basename);
    parent.mtime = Date.now();
    parent.size -= 1;
    this.fireSoon(
      { type: vscode.FileChangeType.Changed, uri: dirname },
      { uri, type: vscode.FileChangeType.Deleted },
    );
  }

  createDirectory(uri: vscode.Uri): void {
    const basename = this.basename(uri.path);
    const dirname = uri.with({ path: this.dirname(uri.path) });
    const parent = this.lookupAsDirectory(dirname, false);

    const entry = new Directory(basename);
    parent.entries.set(entry.name, entry);
    parent.mtime = Date.now();
    parent.size += 1;
    this.fireSoon(
      { type: vscode.FileChangeType.Changed, uri: dirname },
      { type: vscode.FileChangeType.Created, uri },
    );
  }

  // --- lookup

  private lookup(uri: vscode.Uri, silent: false): Entry;
  private lookup(uri: vscode.Uri, silent: boolean): Entry | undefined;
  private lookup(uri: vscode.Uri, silent: boolean): Entry | undefined {
    const parts = uri.path.split("/");
    let entry: Entry = this.root;
    for (const part of parts) {
      if (!part) {
        continue;
      }
      let child: Entry | undefined;
      if (entry instanceof Directory) {
        child = entry.entries.get(part);
      }
      if (!child) {
        if (!silent) {
          throw vscode.FileSystemError.FileNotFound(uri);
        }
        return undefined;
      }
      entry = child;
    }
    return entry;
  }

  private lookupAsDirectory(uri: vscode.Uri, silent: boolean): Directory {
    const entry = this.lookup(uri, silent);
    if (entry instanceof Directory) {
      return entry;
    }
    throw vscode.FileSystemError.FileNotADirectory(uri);
  }

  private lookupAsFile(uri: vscode.Uri, silent: boolean): File {
    const entry = this.lookup(uri, silent);
    if (entry instanceof File) {
      return entry;
    }
    throw vscode.FileSystemError.FileIsADirectory(uri);
  }

  private lookupParentDirectory(uri: vscode.Uri): Directory {
    const dirname = uri.with({ path: this.dirname(uri.path) });
    return this.lookupAsDirectory(dirname, false);
  }

  private basename(path: string): string {
    path = path.replace(/\/+$/, "");
    return path.slice(path.lastIndexOf("/") + 1);
  }

  private dirname(path: string): string {
    path = path.replace(/\/+$/, "");
    const dir = path.slice(0, path.lastIndexOf("/"));
    return dir || "/";
  }

  // --- manage file events

  private readonly emitter = new vscode.EventEmitter<vscode.FileChangeEvent[]>();
  private bufferedEvents: vscode.FileChangeEvent[] = [];
  private fireSoonHandle?: ReturnType<typeof setTimeout>;

  readonly onDidChangeFile: vscode.Event<vscode.FileChangeEvent[]> = this.emitter.event;

  watch(): vscode.Disposable {
    // ignore, fires for all changes
    return new vscode.Disposable(() => undefined);
  }

  private fireSoon(...events: vscode.FileChangeEvent[]): void {
    this.bufferedEvents.push(...events);
    if (this.fireSoonHandle) {
      clearTimeout(this.fireSoonHandle);
    }
    this.fireSoonHandle = setTimeout(() => {
      this.emitter.fire(this.bufferedEvents);
      this.bufferedEvents = [];
    }, 5);
  }
}
