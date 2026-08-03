# 旅ノート フロントエンド

旅行記録アプリ「旅ノート」のフロントエンド。

## 概要

ユーザーが旅行の記録を作成・共有できる Web アプリ。
個人開発のポートフォリオとして制作。

バックエンドリポジトリ: [tabi-note-api](https://github.com/kiskm/tabi-note-api)

## デモ

TODO

## 主な機能

- ユーザー登録・ログイン・ログアウト（JWT 認証、未ログイン時はログインページへリダイレクト）
- 旅行記の作成・編集・削除（エリア・期間・予算・ステータス管理）
- 訪問スポットの作成・編集・削除・訪問チェック切り替え
- 費用の記録・編集・削除とカテゴリ別集計・予算に対する達成率表示
- 参加者の追加・編集・削除

## 技術スタック

| カテゴリ         | 採用技術             |
| ---------------- | -------------------- |
| 言語             | TypeScript            |
| フレームワーク   | Next.js (App Router)  |
| スタイリング     | Tailwind CSS           |
| データ取得・更新 | Server Actions / fetch |
| アイコン         | Tabler Icons           |
| コンテナ         | Docker                |
| CI               | GitHub Actions        |

## 技術選定の理由

TODO

### Next.js を選んだ理由

TODO

### App Router を選んだ理由

（同上）

## セットアップ

```bash
# 依存関係インストール
npm install

# 開発サーバー起動
npm run dev
```

開発サーバーが http://localhost:3000 で起動します。

APIの接続先は環境変数 `API_URL` で設定します（未設定時は `http://localhost:8000`）。

### Docker での起動

リポジトリルート（[tabi-note-deploy](https://github.com/kiskm/tabi-note-deploy)）の `docker-compose.yml` から、DB・API・フロントエンドをまとめて起動できます。

```bash
docker compose up
```

## ディレクトリ構成

```
app/
├── actions.ts        # Server Actions（API呼び出し）
├── components/        # 再利用可能なコンポーネント（auth / trip / spot / expense / participant / ui）
├── constants/          # 定数（エリア、フォーム、バリデーション、UI）
├── login/              # ログインページ
├── register/           # 登録ページ
└── trips/[id]/         # 旅行詳細ページ
lib/
├── api.ts              # API呼び出し共通処理
├── auth.ts             # 認証トークン取得
└── types.ts             # 型定義
middleware.ts            # 未ログイン時のリダイレクト制御
```

## 今後の改善予定
