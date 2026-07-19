---
name: seo-growth
description: 公開後のサイトをGoogle Search Consoleの"実データ"で育てるスキル。主力ページの強化(FAQ追加)・表記ゆれの回収(alternateName)・順位監視の自動化(下落したらSlackアラート)・週次リライト選定。「検索順位を上げたい」「Search Consoleのデータを見て改善して」「順位監視を自動化して」で発動。
---

# seo-growth — 公開した後は、検索の"実データ"で見て育てる

検索1位は「獲って終わり」ではない。勘ではなくデータで直す。人手ゼロの見張り体制を作る。

## When to invoke(発動条件)

- 「Search Consoleのデータを見て改善して」「検索順位を上げたい」
- 「順位監視を自動化して」「順位が下がったら通知して」
- LP・ブログ公開から2週間以降(データが溜まってから)

## 前提

- Google Search Console にプロパティ登録済み・sitemap送信済み(→ seo-foundation)
- 自動化には Search Console API のサービスアカウント認証を設定

## 育て方① 一番見られているページを、さらに強くする

1. Search Console「ページ」レポートで表示回数の上位を確認。**主力ページは偏る**(元記事では料金ガイド1本がサイト全体の表示回数の59%)
2. 主力ページの「クエリ」を見て、**実際に検索された質問をFAQとして追加**(7問など)。本文とFAQPage構造化データの両方に入れ、検索結果に質問付きで出やすくする
3. タイトル・descriptionを実クエリの言い回しに寄せる

## 育て方② 表記ゆれを拾う

クエリレポートに出てくる別表記(かな/カナ/英語/スペース有無/略称)を `Organization` の `alternateName` に登録し、ゆれた検索も取りこぼさない。

## 育て方③ 順位の見張りを自動化する

順位は放っておくと気づかないうちに下がる。「下がった瞬間に気づける」体制を人手ゼロで:

- **毎週月曜の朝**、主要キーワードの順位を Search Console API で自動記録(平均掲載順位)
- **前回より下がったキーワードがあればSlackにアラート**
- 実装: GitHub Actions cron(`0 0 * * 1` = JST 月曜9:00)+ 記録はリポジトリ内CSVに追記

```yaml
# .github/workflows/rank-watch.yml の骨子
on:
  schedule: [{ cron: "0 0 * * 1" }]
jobs:
  watch:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Fetch rankings & alert
        env:
          GSC_CREDENTIALS: ${{ secrets.GSC_SERVICE_ACCOUNT_JSON }}
          SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}
        run: python scripts/rank_watch.py  # 主要KWの順位を取得→前回比較→下落をSlack通知→CSV追記
```

## 育て方④ 週次リライトの選定

毎週、次の条件で1〜3記事を選びリライト(blog-automation の週次ワークフローに渡す):

1. 表示回数が多いのに CTR が低い → タイトル・description改善
2. 順位 4〜10位のクエリを持つ記事 → 内容加筆で1〜3位を狙う(最も費用対効果が高い帯)
3. 情報が古くなった記事 → 「◯年◯月時点」更新+実更新日でlastmod更新

## 落とし穴チェック(実例に学ぶ)

- [ ] sitemapのlastmodがデプロイ日で毎回更新されていないか(実更新日にする)
- [ ] OGP/サムネ画像がSVGのままになっていないか(X・Slackで表示されない → PNG一括変換)
- [ ] 順位を「すべての検索で1位」と誤解していないか — 見るべきは**購買につながるキーワード**での順位。順位は時期・環境で変動する
