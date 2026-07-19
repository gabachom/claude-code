# design-system.md — デザインシステム規約

「クリーム+オレンジ基調」の元LPを汎用化した2色システム。ブランドに合わせて CSS 変数だけ差し替える。

## カラー

```css
:root {
  --color-bg: #FDF9F2;        /* ベース(クリーム系の淡色。真っ白より温度感が出る) */
  --color-surface: #FFFFFF;   /* カード背景 */
  --color-accent: #E8590C;    /* アクセント(CTA・見出し装飾・数値) */
  --color-accent-weak: #FFF0E6;
  --color-text: #1F2937;      /* 本文(真っ黒は使わない) */
  --color-text-muted: #6B7280;
  --color-dark: #1A2333;      /* 反転セクション(ヒーロー等)の背景 */
}
```

ルール:
- アクセント色は **CTA・実績数値・セクション見出しの装飾のみ**。多用すると安っぽくなる
- 隣接セクションは `--color-bg` と `--color-surface` を交互にして区切りを作る(罫線より背景色)
- コントラスト比は本文 7:1 以上、UI要素 4.5:1 以上(WCAG AA)

## タイポグラフィ

```css
font-family: "Hiragino Sans", "Noto Sans JP", system-ui, sans-serif;
```

- Webフォントは読み込まない(パフォーマンス優先・システムフォントで十分)
- 見出し: 太字(700)+サイズで階層。h1: clamp(28px, 5vw, 44px) / h2: clamp(22px, 3.5vw, 32px)
- 本文: 16px / 行間 1.8。日本語は `line-break: strict;`
- 数値の強調はアクセント色+2倍サイズ(実績バッジで多用)

## レイアウト・レスポンシブ

- コンテンツ最大幅 1080px、左右パディング `clamp(16px, 4vw, 40px)`
- カード類は `display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));` — メディアクエリを書かずに自動折返し
- ブレークポイントを増やさない。必要な場合のみ 768px の1本
- タップ領域は 44px 四方以上

## パフォーマンス規約(SEOの土台)

- 画像: WebP/AVIF、1枚 100KB 以下(ヒーローも 50KB 目標。元記事は 498KB→46KB に圧縮)
- JSは計測タグと診断フォームのみ。**UI装飾のためのJSライブラリ禁止**
- X(Twitter)埋め込み・YouTube埋め込みは遅延読み込み(クリックで初めてiframe生成)。初回表示のデータ量を数MB単位で削れる
- アニメーションは CSS のみ(`prefers-reduced-motion` を尊重)
