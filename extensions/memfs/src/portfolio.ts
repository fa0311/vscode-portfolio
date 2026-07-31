/**
 * The portfolio content, seeded into the in-memory workspace at startup.
 * Paths are absolute within the memfs: scheme.
 *
 * Facts sourced from public GitHub data (github.com/fa0311), as of 2026-07.
 */
export const PORTFOLIO_ROOT = "/portfolio";

export const PORTFOLIO_FILES: Readonly<Record<string, string>> = {
  [`${PORTFOLIO_ROOT}/README.md`]: `# 👋 ふぁ / fa0311

## 💖 Loves

![Flutter](https://img.shields.io/badge/Flutter-02569B?style=for-the-badge&logo=flutter&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![Twitter](https://img.shields.io/badge/Twitter-000000?style=for-the-badge&logo=x&logoColor=white)

## 📦 Projects

- [fa0311/TwitterInternalAPIDocument](https://github.com/fa0311/TwitterInternalAPIDocument) — Twitter(X) 内部 API の解析・ドキュメント・SDK 群
- [fa0311/twitter_api_safe_relay](https://github.com/fa0311/twitter_api_safe_relay) — Playwright で開いたログイン済みブラウザから Twitter(X) 内部 API を安全に叩くリレー
- [fa0311/DMMGamePlayerFastLauncher](https://github.com/fa0311/DMMGamePlayerFastLauncher) — DMM Game Player 高速起動ランチャー
- [OpenAPITools/openapi-generator](https://github.com/OpenAPITools/openapi-generator) — OpenAPI Generator の Python 用テンプレートをメンテナンス

## 🤝 Used by

- [zedeus/nitter](https://github.com/zedeus/nitter) — X-Client-Transaction-Id の生成に [fa0311/x-client-transaction-id-pair-dict](https://github.com/fa0311/x-client-transaction-id-pair-dict) を利用
- [danbooru/danbooru](https://github.com/danbooru/danbooru) — Transaction ID 生成の実装で [解析記事](https://fa0311.github.io/antibot_blog_archives/web/twitter-header-part-1.html) と [fa0311/twitter-tid-deobf-fork](https://github.com/fa0311/twitter-tid-deobf-fork) を参照
- [jackwener/OpenCLI](https://github.com/jackwener/OpenCLI) — GraphQL queryId の解決に [fa0311/twitter-openapi](https://github.com/fa0311/twitter-openapi) を利用

## 🔗 Links

- ⭐ [Contribute List](https://github.com/stars/fa0311/lists/contribute-100)
- 🩵 [Twitter](https://x.com/faa0311)
- 🤗 [Hugging Face](https://huggingface.co/fa0311)
- 🍺 [GitHub Sponsors](https://github.com/sponsors/fa0311)

---

[このサイトのソース](https://github.com/fa0311/vscode-portfolio)
`,
};
