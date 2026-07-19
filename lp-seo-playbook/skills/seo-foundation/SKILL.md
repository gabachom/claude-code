---
name: seo-foundation
description: LP・サイトを「検索に強くする3つの土台」を作り込むスキル。①速い・素のHTML(画像圧縮・遅延読み込み) ②構造化データと著者ページでE-E-A-Tを機械可読に伝える ③robots.txt・sitemap・内部リンク設計。「構造化データを入れて」「著者ページを作って」「robots.txtを整えて」「SEOの土台を作って」で発動。
---

# seo-foundation — 検索に強くする3つの土台

LPは公開しただけでは検索に存在しない。順位を決めるのは派手なテクニックではなく、この3つの土台。

## When to invoke(発動条件)

- 「SEOを強くして」「検索で見つかるようにして」
- 「構造化データを入れて」「著者ページを作って」「robots.txtを整えて」
- pro-lp-builder でLPを作った直後(セットで実行推奨)

## 土台① 速い・素のHTML

Googleが読みやすい軽量なHTMLにする。

1. **画像圧縮**: 全画像を WebP/AVIF・100KB以下に。目安: ヒーロー画像 498KB→46KB クラスの圧縮を狙う
   ```bash
   npx sharp-cli --input "public/**/*.{png,jpg}" --output public/ --format webp
   ```
2. **埋め込みの遅延読み込み**: X・YouTube等のiframe埋め込みは「クリックで初めて生成」方式に。初回表示のデータ量を数MB削れる
3. **JSを配らない**: 静的出力を維持。UI装飾のJSライブラリは入れない
4. 計測: PageSpeed Insights で Performance 90+ を合格ラインに

## 土台② 誰が書いたかを機械に伝える(構造化データ+著者ページ)

「どの会社が運営し、誰が書いた記事か」をGoogleが読めるタグで添える。検索エンジン向けの"名刺データ"。これが信頼(E-E-A-T)になる。

1. **JSON-LD 4点セット**(lp-template.astro に雛形あり):
   - `Organization` — 社名・URL・`alternateName`(表記ゆれ: カタカナ/英語/略称を全部登録)
   - `Person` — 著者。`sameAs` でX・YouTubeのプロフィールと紐づける
   - `FAQPage` — FAQセクションと**本文一致**させる(不一致はスパム判定リスク)
   - `BreadcrumbList`
2. **著者プロフィールページ** (`/author/`) を作る:
   - 経歴・実績を数値で(フォロワー数・支援社数・受講者数など実数のみ)
   - X・YouTube・会社サイトへリンク(相互に紐づける)
   - ブログ全記事の author からこのページへリンク
3. 検証: [リッチリザルトテスト](https://search.google.com/test/rich-results) で全タイプ検出を確認

## 土台③ 記事を出し続け、内部リンクでつなぐ

薄いページ1枚では上がらない。

1. **ハブ&スポーク設計**: 「完全ガイド」級の長文記事(ハブ)を中心に置き、関連記事(スポーク)を内部リンクで束ねる。評価が集まりサイト全体が強くなる
2. **robots.txt**:
   ```
   User-agent: *
   Allow: /
   Sitemap: {{SITE_URL}}/sitemap-index.xml
   ```
3. **sitemap**: Astroなら `@astrojs/sitemap` を導入。**lastmodはデプロイ日ではなくコンテンツの実更新日**にする(全ページが毎回「今日更新」になっているとGoogleの信頼を削る)
4. 記事の量産は **blog-automation スキル**に委譲

## 完了チェックリスト

- [ ] PageSpeed Performance / SEO 90+
- [ ] リッチリザルトテストで Organization / Person / FAQPage 検出
- [ ] `/author/` 公開・全記事からリンク
- [ ] robots.txt / sitemap 設置、Search Console にプロパティ登録+sitemap送信
- [ ] 主要ページ間の内部リンクが張られている(孤立ページゼロ)
