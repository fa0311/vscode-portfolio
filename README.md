# vscode-portfolio

VS Code for the Web の中でポートフォリオを閲覧・編集できるポートフォリオサイト。
中身(自己紹介・プロジェクト等)は `extensions/portfolio/src/portfolio.ts` で定義され、起動時にメモリ上ワークスペース `memfs:/portfolio` としてシードされます。

VS Code for the Web をブラウザ完結・完全オンメモリで動かす最小構成。
サーバー処理なし(静的配信のみ)で、ワークスペースは `memfs:` スキームの RAM 上仮想ファイルシステム。ページをリロードすると全て消えます。

## 仕組み

- **vscode-dist/** — Microsoft 公式の [web-standalone ビルド](https://update.code.visualstudio.com/latest/web-standalone/stable)をそのまま展開したもの(無改変・gitignore)
- **src/web/main.ts** — 起動ブートストラップ。import map 経由で workbench 本体を読み込み `create()` を呼ぶ
- **extensions/portfolio/** — サイトを動かす Web 拡張。`FileSystemProvider` で `memfs:` を実装([公式サンプル](https://github.com/microsoft/vscode-extension-samples/tree/main/fsprovider-sample)ベース)
- 拡張ホスト iframe・webview も同一オリジンから配信するよう product 設定を上書きしており、外部 CDN に依存しない

VS Code 本体のコードには一切手を入れていません。カスタマイズは拡張機能・起動オプション・product 設定の公式ポイントのみ。

## 使い方

Node.js 24+ / pnpm が必要。

```sh
pnpm install
pnpm start        # ダウンロード(初回のみ) + ビルド + http://127.0.0.1:8080
```

- `pnpm run build` — ビルドのみ(`fetch-vscode` → 拡張 → ブートストラップ)
- `pnpm test` — 型チェック + `oxfmt --check` + `oxlint`
- `pnpm run fmt` — oxfmt で整形(VS Code なら保存時に自動整形)
- `VSCODE_VERSION=1.xx.x pnpm run fetch-vscode` — VS Code のバージョン固定

`pnpm start` はデプロイ成果物 `dist-site/` を `vite preview` でそのまま配信します(ローカルで見るもの = 本番に上がるもの)。URL リライトを行う配信系(例: vercel/serve の cleanUrls)は拡張ホスト iframe の `.html` をリダイレクトして起動を壊すため使わないこと。エディタ連携は `.vscode/`(推奨拡張: [Oxc](https://marketplace.visualstudio.com/items?itemName=oxc.oxc-vscode)、TypeScript Native Preview)を参照。

URL パラメータ: `?folder=<uri>` / `?workspace=<uri>` / `?ew=true`(空ウィンドウ)

## デプロイ

`pnpm run stage` で `dist-site/` に配信物一式(約200MB)が揃うので、静的ホスティングに置くだけ(サブパス配下でも動作)。

**GitHub Pages**: `.github/workflows/deploy-pages.yml` を同梱済み。

1. GitHub にリポジトリを作って push
2. リポジトリの Settings → Pages → Source を「GitHub Actions」にする
3. main への push で自動デプロイ → `https://<user>.github.io/<repo>/`

## 制約

- ターミナル・デバッガ・タスク実行は不可(ブラウザ完結型の仕様)
- ワークスペース横断のテキスト検索は未実装(`FileSearchProvider`/`TextSearchProvider` が proposed API のため)
- 拡張機能マーケットプレイスは [Open VSX](https://open-vsx.org)(Microsoft Marketplace は公式製品以外から利用不可)

## ライセンス

このリポジトリのコードは MIT。`vscode-dist/` の中身は [Code - OSS](https://github.com/microsoft/vscode)(MIT)のビルド成果物で、ダウンロード時に同梱の LICENSE が適用されます。
