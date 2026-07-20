---
name: aio-optimization
description: AI検索時代の最適化(AIO/GEO/LLMO)スキル。AI Overviews・ChatGPT・Perplexity等の「AIの回答に引用される」ためのサイト整備 — AIクローラーのrobots.txt許可、llms.txt/llms-full.txt生成、引用されやすい文章整形(定義文・出典時点付き数値・Q&A)、AI引用モニタリング。「AIに引用されるようにして」「llms.txtを作って」「AI検索対策して」「LLMO/GEO対策」で発動。
---

# aio-optimization — 「検索1位」から「AIに引用される」へ

AI Overviews表示時は1位ですらCTRが34.5%以上下がる環境では、順位だけでなく**AIの回答に自サイトが引用されること**が新しい獲得面になる。従来SEO(seo-foundation)の上に載せるレイヤー。

## When to invoke(発動条件)

- 「AIに引用されるようにして」「AI検索対策して」「LLMO/GEO/AIO対策して」
- 「llms.txtを作って」
- seo-foundation 適用後のサイト(前提: 構造化データ・sitemap設置済み)

## 手順

### Step 1: 取得層 — AIクローラーに読ませる

robots.txt に主要AIクローラーの扱いを**明示**する(引用されたいなら許可):

```
# AI検索・アシスタントのクローラー(引用経由の流入を得たい場合は許可)
User-agent: GPTBot
User-agent: OAI-SearchBot
User-agent: ClaudeBot
User-agent: PerplexityBot
User-agent: Google-Extended
Allow: /
```

注意: これは経営判断。学習利用を避けたい場合は `Google-Extended` や `GPTBot` を拒否しつつ検索用Bot(`OAI-SearchBot`)だけ許可する切り分けもある。判断をユーザーに確認してから書く。

- JSはコンテンツ表示に使わない(pro-lp-builderの静的HTML方針はここでも有利)
- 主要ページのMarkdown版を用意できるならなお良い(LLMはHTMLよりMarkdownを安定して解釈する)

### Step 2: llms.txt / llms-full.txt の生成

サイトルートに設置する、AI向けのキュレーション済み案内板:

```markdown
# {{SERVICE_NAME}}

> {{1〜2文のサービス定義(誰の何をどうするか)}}

## 主要ページ
- [サービス概要]({{SITE_URL}}/): {{1行説明}}
- [料金]({{SITE_URL}}/pricing/): {{1行説明}}
- [完全ガイド]({{SITE_URL}}/blog/complete-guide/): {{1行説明}}
- [著者・運営者]({{SITE_URL}}/author/): {{1行説明}}

## FAQ
- {{よくある質問と1行回答 × 5〜10}}
```

`llms-full.txt` には主要ページの全文プレーンテキストを連結して置く。ブログ公開時に自動再生成するよう blog-automation のパイプラインに組み込む。

### Step 3: 引用されやすい文章整形(citability)

既存・新規コンテンツに以下のパターンを適用する:

1. **冒頭に定義文**: 各ページ・記事の最初の段落で「◯◯とは、…である」と結論を完結した1文で書く(LLMが切り出せる単位)
2. **数値は自立した一文で**: 「2026年7月時点の当社実測では、◯◯の導入により△△が34%短縮された(n=12社)」— 出典・時点・条件付きの一文は、そのままAI回答に引用される形
3. **Q&Aブロック**: 会話型クエリに対応する「質問見出し+2〜3文の直接回答」を各記事に2〜3個
4. **一次データを持つ**: AIは「その情報の出どころ」を探して引用する。独自調査・実測・事例データが最強の引用誘因(07-measurement-loop.md の権威構築と同じ施策が効く)
5. エンティティ表記の一貫性: 社名・サービス名・人名の表記を全ページ・外部プロフィールで統一(構造化データ sameAs と一致させる)

### Step 4: AI引用モニタリング(月次)

1. 狙いクエリに対応する**質問セット(10〜20問)**を作る(例: 「◯◯の導入費用は?」「◯◯と△△の違いは?」)
2. 月1回、ChatGPT(検索モード)/ Perplexity / Google AI Overviews に同じ質問を投げ、自サイトの引用有無・引用された文を記録(CSV追記)
3. GA4でAI経由リファラ(chatgpt.com / perplexity.ai / copilot 等)を専用チャネルグループに分離
4. 「引用ゼロが3ヶ月続く」ページは Step 3 のチェックリストを再適用

## 完了チェックリスト

- [ ] robots.txt にAIクローラーの方針が明示されている(ユーザー確認済みの判断で)
- [ ] llms.txt / llms-full.txt が設置され、ブログ公開時に自動更新される
- [ ] 主要ページ・新規記事が citability 5パターンを満たす
- [ ] 質問セットとAI引用記録の月次運用が始まっている

## 関連スキル

- `seo-foundation` — 前提となる構造化データ・sitemap
- `seo-validity` — AI引用を含む3層KPIの計測
- `blog-automation` — llms.txt自動更新・引用されやすい記事整形の組み込み先
