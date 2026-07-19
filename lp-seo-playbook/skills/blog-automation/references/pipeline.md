# pipeline.md — GitHub Actions cron構成例

Claude Code をヘッドレス実行(`claude -p`)して記事を生成するワークフロー。
このリポジトリ(anthropics/claude-code)の `.github/workflows/claude-issue-triage.yml` 等が同型の実例。

## 構成: 3本のワークフロー

| ワークフロー | スケジュール(UTC) | 役割 |
|---|---|---|
| blog-morning.yml | `0 22 * * *`(JST 7:00) | 本流記事2本: キュー先頭2件を執筆→安全ゲート→公開 |
| blog-evening.yml | `0 8 * * *`(JST 17:00) | ニュース記事1本: 当日の業界ニュースから執筆→安全ゲート→公開 |
| blog-weekly-rewrite.yml | `0 0 * * 1`(JST 月曜9:00) | リライト: Search Consoleデータで選定した記事を改稿(PRで出す) |

## blog-morning.yml の例

```yaml
name: Blog morning articles
on:
  schedule:
    - cron: "0 22 * * *"   # JST 7:00
  workflow_dispatch: {}     # 手動実行も可能に

jobs:
  write-and-publish:
    runs-on: ubuntu-latest
    permissions:
      contents: write
    steps:
      - uses: actions/checkout@v4

      - name: Install Claude Code
        run: npm install -g @anthropic-ai/claude-code

      - name: Write articles (執筆AI)
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
        run: |
          claude -p "content/queue/ の先頭2件のネタチケットを読み、blog-automation スキルの執筆基準(ハブへの内部リンク・一次情報・frontmatter必須項目)に従って記事を content/drafts/ に2本書いてください。サムネSVGも生成しPNGに変換してください。" \
            --allowedTools "Read,Write,Edit,Bash,Glob,Grep"

      - name: Safety gate (チェックAI — 執筆とは別プロセス)
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
        run: |
          claude -p "content/drafts/ の記事を references/safety-gate.md の基準のみで審査してください。合格は content/blog/ へ移動、不合格は content/rejected/ へ理由ファイル付きで移動。判定JSONを reports/gate-$(date +%F).json に保存。" \
            --allowedTools "Read,Write,Edit,Bash,Glob,Grep"

      - name: Publish (git push → ホスティングが自動デプロイ)
        run: |
          git config user.name "blog-bot"
          git config user.email "bot@example.com"
          git add content/ public/ reports/
          git diff --cached --quiet || git commit -m "blog: auto-publish $(date +%F)"
          git push

      - name: Notify search engines
        run: |
          # IndexNow ping(APIキーは https://www.indexnow.org/ で発行し public/ に設置)
          curl -s "https://api.indexnow.org/indexnow?url={{SITE_URL}}&key=${{ secrets.INDEXNOW_KEY }}"

      - name: Daily report to Slack
        if: always()
        run: |
          curl -s -X POST -H 'Content-type: application/json' \
            --data "{\"text\":\"📝 本日の自動公開が完了。詳細: reports/gate-$(date +%F).json\"}" \
            ${{ secrets.SLACK_WEBHOOK_URL }}
```

## 必要なSecrets

| Secret | 用途 |
|---|---|
| `ANTHROPIC_API_KEY` | Claude Code ヘッドレス実行 |
| `SLACK_WEBHOOK_URL` | 日次レポート・アラート通知 |
| `INDEXNOW_KEY` | 検索エンジンへの更新通知 |

## 運用の段階導入(重要)

1. **第1段階(〜2週間)**: `git push` の代わりに PR 作成(`gh pr create`)にして人がマージ。安全ゲートの判定品質を確認
2. **第2段階**: 合格率が安定したら自動push(自動公開)に切替え
3. **常時**: 不合格が続く・レポートが来ない場合は即 `workflow_dispatch` で手動確認
