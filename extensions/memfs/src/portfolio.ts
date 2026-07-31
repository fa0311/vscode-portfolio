/**
 * The portfolio content, seeded into the in-memory workspace at startup.
 * Paths are absolute within the memfs: scheme.
 *
 * TODO マークの箇所は実際の内容に差し替える。
 */
export const PORTFOLIO_ROOT = "/portfolio";

export const PORTFOLIO_FILES: Readonly<Record<string, string>> = {
  [`${PORTFOLIO_ROOT}/README.md`]: `# 👋 ふぁ

ようこそ。ここは **VS Code for the Web の上で動くポートフォリオサイト**です。

ファイルはすべてメモリ上(\`memfs:\` スキーム)にあり、サーバーは存在しません。
自由に編集して遊んでください — リロードすれば元通りです。

## 歩き方

| ファイル | 内容 |
| --- | --- |
| [about.ts](./about.ts) | プロフィール(型チェック可能な自己紹介) |
| [projects/](./projects/) | 作ったもの |
| [skills.json](./skills.json) | 技術スタック |
| [contact.md](./contact.md) | 連絡先 |

<!-- TODO: 自己紹介の本文をここに書く -->
`,

  [`${PORTFOLIO_ROOT}/about.ts`]: `/**
 * プロフィール。このファイル自体が型チェックの通る自己紹介です。
 * (\`satisfies\` で形を保証しつつ、値はリテラル型のまま)
 */
interface Profile {
	readonly name: string;
	readonly role: string;
	readonly location?: string;
	readonly interests: readonly string[];
}

export const profile = {
	name: "ふぁ",
	role: "Software Engineer", // TODO: 肩書き
	interests: ["TypeScript", "Web"], // TODO: 興味分野
} as const satisfies Profile;
`,

  [`${PORTFOLIO_ROOT}/projects/vscode-web-memfs.md`]: `# vscode-web-memfs(このサイト)

いま見ているこのサイトそのものです。

- Microsoft 公式の VS Code web-standalone ビルドを**無改変**で静的配信
- \`FileSystemProvider\` 拡張によるメモリ上ワークスペース(サーバー処理なし)
- TypeScript / esbuild / import map、GitHub Pages にデプロイ
- 拡張ホスト・webview も同一オリジン配信で完全自己完結

ソース: <!-- TODO: リポジトリ URL -->
`,

  [`${PORTFOLIO_ROOT}/projects/_template.md`]: `# プロジェクト名 <!-- TODO -->

<!-- TODO: 何を作ったか・使った技術・工夫した点・リンク -->
`,

  [`${PORTFOLIO_ROOT}/skills.json`]: `{
	"languages": ["TypeScript"],
	"tools": ["VS Code", "pnpm", "esbuild", "oxc"],
	"_TODO": "自分のスタックに書き換える"
}
`,

  [`${PORTFOLIO_ROOT}/contact.md`]: `# Contact

<!-- TODO: 実際のリンクに差し替える -->

- GitHub: https://github.com/your-account
- X: https://x.com/your-account
`,
};
