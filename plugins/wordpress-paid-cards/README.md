# WordPress Paid Cards Plugin

amiko.consulting「お役立ち資料 > 有料資料」欄に貼る、WordPress「カスタムHTML」ブロック用の有料資料カードを作るプラグインです。
Claude Design で行っていた「指示 → HTML出力を確認 → HTMLをコピー」の流れを Claude Code 上で再現します。

## 使い方

1. 原稿を渡す

   ```
   /paid-card
   📌 タイトル：【有料レポート】…（arXiv:XXXX.XXXXX／2026年◯月◯日発表）
   💡 キャッチコピー：「…」…
   🔍 お悩み：…
   📄 得られる価値：…
   💰 価格・形式：500円（税込）／PDF資料
   🚀 決済方法：Stripe
   ```

   原稿をそのまま貼るだけでも `paid-material-card` スキルが起動します。

2. プレビューで確認する — `paid-materials/preview.html` をブラウザで開きます。
   - `#001`〜 のタブでカードを切替
   - 「HTMLを表示」でソースを確認
   - 「#NNN のHTMLをコピー」でクリップボードへコピー → WordPress のカスタムHTMLブロックに貼り付け

3. 気になる点を指示する（例：「#008 のキャッチコピーを短く」）→ プレビューが更新されるので再確認。

プレビューだけを再生成するには:

```bash
node plugins/wordpress-paid-cards/skills/paid-material-card/scripts/build-preview.mjs paid-materials
```

## 構成

```
wordpress-paid-cards/
├── .claude-plugin/plugin.json
├── commands/paid-card.md                    # /paid-card
└── skills/paid-material-card/
    ├── SKILL.md                             # 原稿 → カードの変換ルール
    ├── template.html                        # カード雛形（インラインスタイル）
    └── scripts/build-preview.mjs            # preview.html を生成（カードを埋め込み、file:// で動作）
```

カード本体とプレビューはプロジェクト直下の `paid-materials/` に置きます。
