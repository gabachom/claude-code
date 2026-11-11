# 有料資料カード

- `wordpress/paid-NNN-*.html` — WordPress「カスタムHTML」ブロックにそのまま貼るカード
- `preview.html` — 確認・コピー用プレビュー（ブラウザで開く。タブ切替／HTMLを表示／HTMLをコピー）

新しいカードは原稿を `/paid-card` に渡すと作成されます（`plugins/wordpress-paid-cards`）。
プレビューの再生成:

```bash
node plugins/wordpress-paid-cards/skills/paid-material-card/scripts/build-preview.mjs paid-materials
```
