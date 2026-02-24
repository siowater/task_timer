# Task Timer (Web)

Next.js ベースの Web アプリ。Issue #97 に基づく Expo からの移行。

## 技術スタック

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS
- Supabase

## 環境変数

`web/.env.example` をコピーして `web/.env.local` を作成し、Supabase の URL とキーを設定してください。

## 起動方法

```bash
# プロジェクトルートから
npm run web:dev

# または web/ ディレクトリから
cd web && npm run dev
```

開発サーバー: http://localhost:3000

## ビルド

```bash
npm run web:build
```

## 起動確認（W-004）

- `npm run web:dev` で開発サーバーが起動する
- http://localhost:3000 で初期画面（Task Timer + Supabase 接続表示）が表示される
- `npm run web:build` でビルドが成功する
