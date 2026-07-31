/**
 * The portfolio content, seeded into the in-memory workspace at startup.
 * Paths are absolute within the memfs: scheme.
 *
 * Facts sourced from public GitHub data (github.com/fa0311), as of 2026-07.
 */
export const PORTFOLIO_ROOT = "/portfolio";

export const PORTFOLIO_FILES: Readonly<Record<string, string>> = {
  [`${PORTFOLIO_ROOT}/README.md`]: `# 👋 ふぁ / fa0311

Web API のリバースエンジニアリングと自動化ツールを作っています。

- 🐦 Twitter(X) 内部 API の解析・ドキュメント・SDK 群(★700+)
- 🔧 公開リポジトリ 270+、OSS への外部貢献多数
- 📝 Blog: https://blog.yuki0311.com

## 歩き方

| ファイル | 内容 |
| --- | --- |
| [about.ts](./about.ts) | プロフィール(型チェック可能) |
| [projects/](./projects/) | 作ったもの・OSS 貢献 |
| [skills.json](./skills.json) | 技術スタック |
| [contact.md](./contact.md) | 連絡先 |

> このサイトは VS Code for the Web 上で動いています。ファイルはすべてメモリ上 —
> 自由に編集して遊んでください。リロードすれば元通りです。
> 仕組みは [projects/this-site.md](./projects/this-site.md) を参照。
`,

  [`${PORTFOLIO_ROOT}/about.ts`]: `/**
 * プロフィール。このファイル自体が型チェックの通る自己紹介です。
 */
interface Profile {
	readonly name: string;
	readonly handle: string;
	readonly role: string;
	readonly interests: readonly string[];
	readonly links: Readonly<Record<string, string>>;
}

export const profile = {
	name: "ふぁ",
	handle: "fa0311",
	role: "Software Engineer",
	interests: [
		"Web API リバースエンジニアリング",
		"OpenAPI / SDK 生成",
		"自動化 (GitHub Actions)",
		"セルフホスト",
	],
	links: {
		github: "https://github.com/fa0311",
		x: "https://x.com/faa0311",
		blog: "https://blog.yuki0311.com",
	},
} as const satisfies Profile;
`,

  [`${PORTFOLIO_ROOT}/projects/twitter-internal-api.md`]: `# Twitter(X) Internal API エコシステム

内部 GraphQL API を解析し、ドキュメント化 → 仕様化 → SDK まで一気通貫で提供。

- [TwitterInternalAPIDocument](https://github.com/fa0311/TwitterInternalAPIDocument) ★700+ — 内部 API ドキュメント(自動生成)
- [twitter-openapi](https://github.com/fa0311/twitter-openapi) ★190+ — OpenAPI (Swagger) 仕様
- [twitter-openapi-typescript](https://github.com/fa0311/twitter-openapi-typescript) ★220+ — TypeScript クライアント
- [twitter_openapi_python](https://github.com/fa0311/twitter_openapi_python) ★95+ — Python クライアント(pydantic 検証付き)
- [twitter_api_safe_relay](https://github.com/fa0311/twitter_api_safe_relay) ★95+ — Playwright 経由で安全に API を叩くリレー
- [twitter-snap](https://github.com/fa0311/twitter-snap) ★55+ — ツイートを画像/動画化するアーカイバ
- X-Client-Transaction-Id の解析・生成([x-client-transaction-id-pair-dict](https://github.com/fa0311/x-client-transaction-id-pair-dict) ほか)
`,

  [`${PORTFOLIO_ROOT}/projects/dmm-game-player-fast-launcher.md`]: `# DMMGamePlayerFastLauncher

[DMMGamePlayerFastLauncher](https://github.com/fa0311/DMMGamePlayerFastLauncher) ★190+

- DMM Game Player のゲームを高速・安全に直接起動するランチャー(Python)
- 継続メンテ中
`,

  [`${PORTFOLIO_ROOT}/projects/automation-tools.md`]: `# 自動化・セルフホスト

- [xserver-auto-renew](https://github.com/fa0311/xserver-auto-renew) ★80+ — Xserver 無料 VPS の自動更新
- [latest-user-agent](https://github.com/fa0311/latest-user-agent) — 主要ブラウザの最新 UA を JSON 配信(GitHub Actions で自動更新)
- [github-archiver](https://github.com/fa0311/github-archiver) — GitHub リポジトリをローカルミラーとして丸ごとアーカイブする CLI
- [discord-voice-status-summary](https://github.com/fa0311/discord-voice-status-summary) — Discord 通話を要約してチャンネルステータスに反映する bot
- [docker-dtv-aio-server](https://github.com/fa0311/docker-dtv-aio-server) — 日本のデジタル TV 受信/録画/配信オールインワン Docker
`,

  [`${PORTFOLIO_ROOT}/projects/oss-contributions.md`]: `# OSS への貢献(抜粋)

- [openapi-generator](https://github.com/OpenAPITools/openapi-generator) — merged PR 25 件(Python クライアントの型改善ほか)
- [Radiata](https://github.com/ddPn08/Radiata) — 73 commits(Stable Diffusion WebUI)
- microsoft/vscode、flutter/packages、AUTOMATIC1111/stable-diffusion-webui — merged PR
- ほか nitter / Nextcloud / ArchiveBox / wg-easy / RustDesk docs / KonomiTV など多数に修正 PR
`,

  [`${PORTFOLIO_ROOT}/projects/this-site.md`]: `# このサイト

いま見ているポートフォリオそのものです。

- Microsoft 公式の VS Code web-standalone ビルドを**無改変**で静的配信
- \`FileSystemProvider\` 拡張によるメモリ上ワークスペース(サーバー処理なし)
- 画面幅に応じて起動レイアウトを出し分け(プレビューのみ / +ソース / +エクスプローラー)
- TypeScript / esbuild / import map、GitHub Actions で GitHub Pages にデプロイ

ソース: https://github.com/fa0311/vscode-portfolio
`,

  [`${PORTFOLIO_ROOT}/skills.json`]: `{
	"languages": ["Python", "TypeScript", "JavaScript", "Dart", "PHP", "Go"],
	"areas": [
		"Web API リバースエンジニアリング",
		"OpenAPI / SDK 生成",
		"GitHub Actions 自動化",
		"Docker / セルフホスト",
		"Flutter"
	],
	"asOf": "2026-07"
}
`,

  [`${PORTFOLIO_ROOT}/contact.md`]: `# Contact

- GitHub: https://github.com/fa0311
- X: https://x.com/faa0311
- Blog: https://blog.yuki0311.com
`,
};
