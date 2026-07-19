# deploy-guide.md — Vercelデプロイ手順

静的出力(`dist/`)なので Vercel 以外(Cloudflare Pages / Netlify / GitHub Pages)でも同じ考え方で動く。

## 初回デプロイ

```bash
# 1. ビルド確認(ローカル)
npm run build && npx serve dist

# 2. GitHubリポジトリを作成してpush(private推奨)
git init && git add -A && git commit -m "initial LP"
git remote add origin <repo-url> && git push -u origin main

# 3. Vercelにインポート
#    https://vercel.com/new → リポジトリ選択 → Framework: Astro(自動検出) → Deploy
#    以後は main への push だけで自動デプロイされる
```

CLI派なら `npx vercel --prod` でも可。

## 独自ドメイン

1. Vercel → Project → Settings → Domains でドメイン追加
2. DNS に CNAME(または A レコード)を設定
3. `config.siteUrl` を独自ドメインに更新して再デプロイ(canonical / OGP / JSON-LD が正しいURLになる)

## vercel.json(同梱)

`references/vercel.json` をプロジェクト直下に置く。内容:

- セキュリティヘッダ(X-Content-Type-Options / X-Frame-Options / Referrer-Policy / Permissions-Policy)
- 静的アセットの長期キャッシュ

## デプロイ後チェックリスト

- [ ] `https://{{ドメイン}}/` が表示され、httpからリダイレクトされる
- [ ] [リッチリザルトテスト](https://search.google.com/test/rich-results) で Organization / Person / FAQPage が検出される
- [ ] PageSpeed Insights で Performance / SEO 90+
- [ ] OGP確認(Xでカード表示されるか)。**サムネはSVG不可、PNG/JPEGで用意**(SVGはX/Slackで表示されない)
- [ ] Google Search Console にプロパティ登録し sitemap.xml を送信(→ seo-foundation スキル)

## 注意: sitemapのlastmodを"デプロイ日"にしない

デプロイのたびに全ページの lastmod が今日になる設定は、「更新していないのに更新した」とGoogleに申告し続けることになり信頼を削る。lastmod は**コンテンツの実際の最終更新日**(gitの最終コミット日など)から生成すること。
