# Instagram → GBP 同期管理システム

Instagram投稿をGoogle ビジネスプロフィール（GBP）に同期するための管理システムです。

## 機能

- Instagram投稿の一覧表示
- 同期状況の管理（同期済み/未同期）
- 投稿のフィルタリング機能
- 統計情報の表示（総投稿数、同期済み数、未同期数）
- レスポンシブデザイン

## 技術スタック

- **Frontend**: React 19 + TypeScript + Vite
- **Styling**: CSS（カスタムCSS）
- **Database**: Supabase
- **Icons**: Lucide React
- **Date Handling**: date-fns

## セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 環境変数の設定

`env.example`ファイルを参考に、`.env`ファイルを作成してSupabaseの設定を追加してください。

```bash
cp env.example .env
```

`.env`ファイルに以下の値を設定：

```
VITE_SUPABASE_URL=your_supabase_project_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### 3. Supabaseテーブルの設定

以下のテーブル構造でSupabaseにテーブルを作成してください：

```sql
CREATE TABLE instagram_posts (
  id TEXT PRIMARY KEY,
  instagram_id TEXT NOT NULL,
  media_url TEXT,
  caption TEXT,
  timestamp TIMESTAMP,
  is_synced BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  media_type TEXT,
  permalink TEXT
);
```

### 4. 開発サーバーの起動

```bash
npm run dev
```

### 5. ビルド

```bash
npm run build
```

## プロジェクト構造

```
src/
├── components/          # Reactコンポーネント
│   ├── Filter.tsx      # フィルタリング機能
│   ├── Header.tsx      # ヘッダーコンポーネント
│   ├── InstagramPostsUI.tsx  # メインUI
│   ├── LoadingSpinner.tsx     # ローディング表示
│   ├── PostList.tsx    # 投稿一覧
│   └── StatsCard.tsx   # 統計カード
├── lib/
│   └── supabase.ts     # Supabase設定
├── types/
│   └── insta.ts        # 型定義
├── App.tsx             # アプリケーションルート
├── index.css           # メインスタイル
└── main.tsx            # エントリーポイント
```

## 今後の開発予定

- [ ] 実際のGBP API連携機能の実装
- [ ] 認証機能の追加
- [ ] 投稿の自動同期機能
- [ ] エラーハンドリングの改善
- [ ] ユニットテストの追加

## ライセンス

MIT License
