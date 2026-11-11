# 有料資料 WordPress カード

amiko.consulting「お役立ち資料 > 有料資料」欄に貼る HTML カードと、そのプレビュー／コピー用画面です。

## 使い方

1. Claude Code に原稿（タイトル・キャッチコピー・お悩み・価値・価格/形式・決済方法）を貼るか、既存カードの修正を指示します。`paid-material-card` スキル（`.claude/skills/paid-material-card/SKILL.md`）に沿ってカードが作成・更新されます。
2. プレビューを再生成します（スキル実行時は自動で行われます）。

   ```bash
   node wordpress-paid-materials/build-preview.mjs
   ```

3. `preview.html` をブラウザで開き、番号タブでカードを選んで表示を確認します。
4. 「#NNN のHTMLをコピー」を押し、WordPress の「カスタムHTML」ブロックに貼り付けます。コピーできない環境では「HTMLを表示」からテキストを選択してコピーしてください。
5. 貼り付け後、購入URLのプレースホルダ（`STRIPE_URL` / `MEMBERPRESS_URL`、各カード2か所）を実際のURLに差し替えます。

`preview.html?card=003` のように開くと、指定した番号のカードを最初に表示します（指定なしは最新番号）。

## 構成

| パス | 内容 |
|------|------|
| `cards/paid-NNN-*.html` | カード本体（インラインスタイルのみ） |
| `template/card-template.html` | 新規カードの雛形 |
| `build-preview.mjs` | `cards/` を埋め込んだ `preview.html` を生成 |
| `preview.html` | 自動生成のプレビュー画面（直接編集しない） |
