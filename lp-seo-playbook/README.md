# LP×SEO集客システム プレイブック

チャエン氏のnote記事『Claude Codeで2時間。AIだけで作ったLPがSEO検索1位になり、問い合わせ100件以上、初月受注三千万円超え』([note](https://note.com/chaen_channel/n/n13e9b5da0e46))で公開された手法をリバースエンジニアリングし、**自分の事業に適用できる手順書+Claude Code skill一式**として再構築したもの。

> 元記事の実績(2026年7月時点・同社集計): 「Claude Code 法人導入」で検索1位 / 問い合わせ累計100件超(最初の3週間で約70件) / 流入の約55%が検索(広告費ゼロ) / 受注約3,200万円・商談の読み7,000〜8,000万円(受注率58%)
> ※結果は事業内容・運用に依存する。順位は時期・環境で変動する。
>
> **⚠️ 交絡の注意(v2)**: この実績は著者の知名度(フォロワー19万・既存ドメイン・指名検索)と手法の効果が分離されていない。無名の事業者が同じ施策で同じ結果を期待してはいけない。何がそのまま効き、何を割り引き、何を置き換えるべきかの専門家評価は [docs/06-expert-review.md](docs/06-expert-review.md) を先に読むこと。

## 全体像 — 「1枚のLP」ではなく「集客の仕組み」を作る

```
 ①LP作成          ②SEOの土台         ③ブログ自動化       ④リード獲得        ⑤問い合わせ後
 (2時間で骨格) → (数日で作り込み) → (毎日3本自動)  →  (診断・資料)   →  (全自動→人が商談)
 pro-lp-builder    seo-foundation     blog-automation    lead-capture      lead-capture
                                                                           + seo-growth
```

自動化するのは「リード獲得(人に会うまで)」。商談そのものは人がやる — この線引きが少人数で商談数を積める理由。

## 手順書(フェーズ順に読む)

| フェーズ | ドキュメント | ゴール |
|---|---|---|
| 1 | [01-lp-build.md](docs/01-lp-build.md) | 15セクションのLPを2時間で骨格→公開 |
| 2 | [02-seo-foundation.md](docs/02-seo-foundation.md) | 検索に強くする3つの土台(軽量HTML/構造化データ・著者ページ/内部リンク) |
| 3 | [03-blog-automation.md](docs/03-blog-automation.md) | 毎日3本の記事が自動で積み上がるパイプライン |
| 4 | [04-lead-capture.md](docs/04-lead-capture.md) | 診断・ホワイトペーパーで訪問者をリード化 |
| 5 | [05-ops-automation.md](docs/05-ops-automation.md) | 問い合わせ後の全自動化+検索実データでの育成 |
| ─ | [06-expert-review.md](docs/06-expert-review.md) | **専門家評価(v2)**: 著名人交絡の分析・量産リスク・手法の仕分け |
| 6 | [07-measurement-loop.md](docs/07-measurement-loop.md) | **測定駆動ループ(v2)**: 事前登録→質ゲート→交絡除去計測→判定の閉ループ+AIO層 |

## スキルのインストール

```bash
# プロジェクト単位で使う場合(推奨)
mkdir -p <あなたのプロジェクト>/.claude/skills
cp -r lp-seo-playbook/skills/* <あなたのプロジェクト>/.claude/skills/

# 全プロジェクト共通で使う場合
cp -r lp-seo-playbook/skills/* ~/.claude/skills/
```

その後 Claude Code で「pro-lp-builder スキルで◯◯のLPを作って」のように依頼する。

| スキル | 役割 |
|---|---|
| [pro-lp-builder](skills/pro-lp-builder/SKILL.md) | 完成テンプレ(15セクション・Astro)を`{{プレースホルダ}}`詰め替えでLP化。デザイン/SEO/セキュリティ/レスポンシブ込み |
| [seo-foundation](skills/seo-foundation/SKILL.md) | 構造化データ・著者ページ(E-E-A-T)・robots.txt・sitemap・軽量化 |
| [blog-automation](skills/blog-automation/SKILL.md) | ネタ収集→執筆→サムネ→安全ゲート→自動公開→検索通知→日次レポート |
| [lead-capture](skills/lead-capture/SKILL.md) | 8問診断(リードゲート)・ホワイトペーパー・自動返信・日程調整・Slack通知 |
| [seo-growth](skills/seo-growth/SKILL.md) | Search Console実データでの強化・順位監視自動化・週次リライト選定 |
| [aio-optimization](skills/aio-optimization/SKILL.md) | **(v2)** AI検索対策(GEO/LLMO): AIクローラー許可・llms.txt・引用されやすい整形・AI引用モニタリング |
| [seo-validity](skills/seo-validity/SKILL.md) | **(v2)** 効果検証: 事前登録・ブランド/非ブランド分離・記事コホート測定・刈り込み判定 |

## 元記事から読み取った成功の本質(5行で)

1. LPの見た目は本質ではない。**「検索で見つかる」「勝手に問い合わせが生まれ続ける」仕組み**を1枚に詰め込む
2. キーワードは**購買につながる複合語**を1つ選んで獲りにいく(ビッグワードではなく)
3. LP1枚では上がらない。**記事を出し続けて内部リンクで束ねる**(そのために自動化する)
4. 訪問者には**心理的ハードルの低い入口(診断)**を最前面に。価値(資料・動画)を渡して連絡先をもらう
5. 公開後は**Search Consoleの実データ**で育てる。勘で直さない

## v2で加えた「さらに良い方法」(3行で)

1. **測ってから信じる**: 施策は事前登録し、KPIは非ブランド検索・AI引用・検索起点リードの3層のみ(合計流入は知名度が混ざるので使わない)
2. **量より情報利得**: 毎日3本ではなく、検索上位10件にない一次情報を持つ記事だけを出す(scaled content abuse 回避+AI引用の獲得)
3. **AIの回答に引用される**: AI Overviews時代は1位でもクリックが減る。llms.txt・引用されやすい整形・AI引用モニタリングを標準装備にする

## 注意事項(元記事のFAQより)

- 特商法・プライバシーポリシーは専門家に確認。個人情報取得時は目的明示・同意・配信停止導線を
- このスキル群は「土台」を一瞬で用意するもの。**刺さるコピーや事例は、あなたの一次情報を入れてこそ強くなる**
- 数値はすべて元記事の社内集計(2026年7月時点)。結果は事業内容や運用で変わる

## 本再構築の忠実度について

元記事の無料パート(第1〜3章)全文と、配布スキル `pro-lp-builder` の公開されていた構造(SKILL.md + references 7ファイル・15セクション・プレースホルダ方式・発動条件)に基づいて再構築した。有料パートの配布ファイル本体は参照していないため、テンプレートの実装・文言は本プレイブック独自のもの。配布スキル実物を入手した場合は `skills/pro-lp-builder/` を実物ベースに差し替えるとより忠実になる。
