---
name: pro-lp-builder
description: Astro製のプロ品質ランディングページ(LP)を、完成済みテンプレートのプレースホルダを自社情報に差し替えるだけで一気に立ち上げるスキル。ヒーロー/実績ロゴ/サービス/活用事例/FAQ/CTAなど15セクションのワンページLP。デザイン/SEO/セキュリティ/レスポンシブ/構造化データ/パフォーマンス最適化は最初から入っている。ゼロからLPを書くのではなく、完成LPをテンプレ化したものを「詰め替える」発想。
---

# pro-lp-builder — 完成テンプレートから作るプロ品質ワンページLP

検索上位を狙える本番LPを「完成テンプレート」化したスキル。中身(コピー・画像・色・会社情報)を差し替えるだけで、新しいLPとして立ち上がる。

このテンプレートは特定企業のLPを汎用化したもので、識別情報(社名・個人名・SNS・顧客ロゴ・連絡先・計測ID・固有実績)はすべて `{{プレースホルダ}}` 化済み。誰のLPにも安全に転用できる。

## When to invoke(発動条件)

- 「LP/ランディングページを作って」「サービスサイトを1枚で」
- 商品・サービス・採用・イベント・診断などの集客型LP
- 「このLPと同じ作りで別ブランドのを作りたい」「既存LPを横展開」
- Astro + Vercel で静的・高速・SEOに強いLPを最短で立ち上げたい
- すでにあるラフ案/要件メモ/旧サイト内容を、見栄えするLPに落とし込みたい

## 前提

- Node.js 18+ / npm が使えること
- デプロイ先は Vercel を想定(`references/deploy-guide.md`)。他ホスティングでも静的出力なので流用可

## 手順

### Step 1: ヒアリング(詰め替え情報の収集)

`references/content-map.md` のプレースホルダ一覧を上から順に埋める。ユーザーから提供されていない項目は**推測で埋めずに質問する**。最低限必要なのは:

1. `{{PRIMARY_KEYWORD}}` — 検索で1位を獲りたい購買直結キーワード(例:「◯◯ 法人導入」)
2. `{{COMPANY_NAME}}` / `{{SERVICE_NAME}}` / `{{SITE_URL}}`
3. `{{HERO_COPY}}` — ヒーローの一言(なければ Step 2 で提案する)
4. `{{AUTHOR_NAME}}` と実績 — E-E-A-T の核。著者ページに使う
5. CTA の種類 — 無料診断 / 資料請求 / 無料相談 のどれを最前面に置くか

### Step 2: コピーの提案

情報が足りないセクションは、`references/section-catalog.md` の各セクションの「目的」に沿ってコピー案を3案ずつ提示し、ユーザーに選んでもらう。煽り表現・誇大表現は使わない(安全ゲート基準は blog-automation スキルの safety-gate.md と共通)。

### Step 3: プロジェクト生成と詰め替え

```bash
npm create astro@latest {{project-name}} -- --template minimal --no-install --no-git --yes
cd {{project-name}} && npm install
```

1. `references/lp-template.astro` を `src/pages/index.astro` にコピー
2. `references/design-system.md` の規約に従い、ブランドカラー2色(ベース+アクセント)を CSS 変数で差し替え
3. `content-map.md` で埋めた値でプレースホルダを全置換
4. 不要なセクションは**削除ではなくコメントアウト**(後で復活させやすくするため)
5. `grep -n "{{" src/pages/index.astro` で置換漏れゼロを確認

### Step 4: SEO・構造化データの確認

テンプレートに JSON-LD(Organization / Person / FAQPage / BreadcrumbList)、OGP、canonical が埋め込み済み。以下を確認:

- FAQ セクションの Q&A と FAQPage JSON-LD の内容が一致しているか
- `alternateName` に表記ゆれ(カタカナ/英語/略称)を登録したか
- 画像は 100KB 以下に圧縮したか(`npx sharp-cli` または `npx @squoosh/cli`)

より深い SEO 施策(著者ページ・robots.txt・sitemap)は **seo-foundation スキル**に委譲する。

### Step 5: ビルド確認とデプロイ

```bash
npm run build   # dist/ に静的出力
npx serve dist  # ローカル確認
```

- Lighthouse(またはPageSpeed Insights)で Performance / SEO 90+ を確認
- `references/vercel.json` をプロジェクト直下にコピーしてから `references/deploy-guide.md` の手順でデプロイ

## 設計思想(なぜこの作りか)

1. **速い・素のHTML**: フレームワークJSを配らない静的出力。Googleが読みやすく、表示が速い
2. **誰が書いたかを機械に伝える**: 構造化データ+著者情報 = E-E-A-T。検索エンジン向けの"名刺データ"
3. **LPは入口、記事で強くする**: LP単体では上がらない。blog-automation スキルで記事を積み、内部リンクで束ねる

## 関連スキル

- `seo-foundation` — 構造化データ・著者ページ・robots.txt・sitemap の作り込み
- `blog-automation` — ブログ自動化パイプライン(毎日記事を積む)
- `lead-capture` — 診断・ホワイトペーパー・自動返信でリードを取る
- `seo-growth` — 公開後に Search Console 実データで育てる
