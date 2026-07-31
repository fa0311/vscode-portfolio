/**
 * The portfolio content, seeded into the in-memory workspace at startup.
 * Paths are absolute within the memfs: scheme.
 *
 * Facts sourced from public GitHub data (github.com/fa0311), as of 2026-07.
 */
export const PORTFOLIO_ROOT = "/portfolio";

export const PORTFOLIO_FILES: Readonly<Record<string, string>> = {
  [`${PORTFOLIO_ROOT}/README.md`]: `# 👋 ふぁ / fa0311

Flutter / TypeScript / Python が好き。

- [TwitterInternalAPIDocument](https://github.com/fa0311/TwitterInternalAPIDocument) — Twitter(X) 内部 API の解析・ドキュメント・SDK 群。nitter / twscrape / twikit などが直接依存
- [twitter_api_safe_relay](https://github.com/fa0311/twitter_api_safe_relay) — Playwright で開いたログイン済みブラウザから Twitter(X) 内部 API を安全に叩くリレー
- [DMMGamePlayerFastLauncher](https://github.com/fa0311/DMMGamePlayerFastLauncher) — DMM Game Player 高速起動ランチャー
- OSS 貢献: [openapi-generator](https://github.com/OpenAPITools/openapi-generator) ほか — [一覧](https://github.com/stars/fa0311/lists/contribute-100)

## Links

- GitHub: https://github.com/fa0311
- X: https://x.com/faa0311

---

[このサイトのソース](https://github.com/fa0311/vscode-portfolio)
`,
};
