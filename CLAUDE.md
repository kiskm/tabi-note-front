# tabi-note-front — Claude Context

## 概要

旅行メモアプリ「tabi-note」のフロントエンド。Next.js App Router + Tailwind CSS で構成。

## 技術スタック

| 項目 | 内容 |
|-----|------|
| フレームワーク | Next.js 16 |
| UI | React 19 + Tailwind CSS 4 |
| 言語 | TypeScript 5 |
| ポート | 3000 |

## 画面構成

詳細は `../docs/screen-design.md` を参照。

| パス | 画面 |
|-----|------|
| `/` | トップ（旅行一覧） |
| `/trips/[id]` | 旅行詳細 |

## ディレクトリ構成

```
app/
├── page.tsx              # トップページ（旅行一覧）
├── layout.tsx            # ルートレイアウト
├── actions.ts            # Server Actions（API 呼び出し）
├── trips/[id]/
│   └── page.tsx          # 旅行詳細ページ
└── components/
    ├── TripListTabs.tsx   # タブ付き旅行リスト
    ├── AddTripModal.tsx   # 旅行作成モーダル
    ├── AddSpotForm.tsx    # スポット追加フォーム
    ├── AddExpenseForm.tsx # 費用追加フォーム
    ├── SpotCheckButton.tsx
    ├── TripActions.tsx
    ├── EditButton.tsx
    └── DeleteButton.tsx
lib/
├── types.ts              # 型定義（Trip / Spot / Expense）
└── api.ts                # API クライアント（getTrips / getTrip）
```

## データフロー

- **データ取得**: `lib/api.ts` → Server Component で fetch（`cache: "no-store"`）
- **データ変更**: `app/actions.ts` の Server Actions → `revalidatePath()` でキャッシュ更新

## API 接続

- 環境変数 `API_URL`（デフォルト: `http://api:8000`）
- Docker Compose 内では `http://api:8000` でサービス間通信

## 注意事項

- Next.js 16 は破壊的変更を含む新バージョン。コードを書く前に `node_modules/next/dist/docs/` を確認すること
- Server Components がデフォルト。クライアント操作が必要な場合のみ `"use client"` を使用
