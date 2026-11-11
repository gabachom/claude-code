#!/usr/bin/env node
// 有料資料カード（cards/paid-NNN-*.html）を読み込み、
// ブラウザで直接開ける preview.html を生成する。
//
//   node wordpress-paid-materials/build-preview.mjs
//
// カードは preview.html に埋め込まれるため、file:// で開いてもプレビュー・コピーが動く。

import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));
const cardsDir = join(root, 'cards');

const cards = readdirSync(cardsDir)
  .map((file) => ({ file, m: /^paid-(\d{3})-.+\.html$/.exec(file) }))
  .filter(({ m }) => m)
  .sort((a, b) => Number(a.m[1]) - Number(b.m[1]))
  .map(({ file, m }) => ({
    id: m[1],
    file: `cards/${file}`,
    html: readFileSync(join(cardsDir, file), 'utf8'),
  }));

if (cards.length === 0) {
  console.error('cards/ に paid-NNN-*.html が見つかりません');
  process.exit(1);
}

// </script> などでインラインスクリプトが途切れないよう < をエスケープ
const data = JSON.stringify(cards).replace(/</g, '\\u003c');

const page = `<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>有料資料 WordPressプレビュー</title>
<!-- 自動生成ファイル。編集せず build-preview.mjs を実行してください。 -->
<style>
body{margin:0;background:#eef1f4;font-family:"Hiragino Sans","Noto Sans JP",sans-serif;color:#1f2933;}
a{color:#0f2a47;}a:hover{color:#1d4e89;}
.wrap{max-width:1040px;margin:0 auto;padding:32px 20px 64px;display:flex;flex-direction:column;gap:24px;}
.bar{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:12px;}
.bar-left{display:flex;flex-direction:column;gap:8px;}
.crumb,.hint{font-size:13px;color:#5b6675;}
.tabs,.actions{display:flex;gap:8px;flex-wrap:wrap;}
button{cursor:pointer;font-family:inherit;font-weight:700;border-radius:4px;border:1px solid #0f2a47;}
button:focus-visible{outline:2px solid #c9a24a;outline-offset:2px;}
.tab{font-size:14px;padding:8px 16px;background:#fff;color:#0f2a47;}
.tab[aria-pressed="true"]{background:#0f2a47;color:#fff;}
.btn{font-size:14px;padding:12px 20px;}
.btn-outline{background:#fff;color:#0f2a47;}
.btn-solid{background:#0f2a47;color:#fff;border-color:#0f2a47;}
.raw{display:flex;flex-direction:column;gap:8px;}
.raw[hidden]{display:none;}
.raw textarea{width:100%;box-sizing:border-box;height:320px;font-family:monospace;font-size:12px;padding:12px;border:1px solid #d6dde6;border-radius:4px;}
.stage{background:#fff;padding:32px 20px;border-radius:6px;}
.stage h1{font-size:22px;font-weight:700;color:#1f2933;margin:0 0 24px;}
</style>
</head>
<body>
<div class="wrap">
  <div class="bar">
    <div class="bar-left">
      <div class="crumb">amiko.consulting / お役立ち資料 / 有料資料</div>
      <div class="tabs" id="tabs" role="group" aria-label="カードを選択"></div>
    </div>
    <div class="actions">
      <button type="button" class="btn btn-outline" id="toggleRaw" aria-expanded="false" aria-controls="raw">HTMLを表示</button>
      <button type="button" class="btn btn-solid" id="copy"></button>
    </div>
  </div>
  <div class="raw" id="raw" hidden>
    <label class="hint" for="rawText">クリックで全選択されます。Ctrl+C（Mac: ⌘+C）でコピーしてください。</label>
    <textarea id="rawText" readonly></textarea>
  </div>
  <div class="stage">
    <h1>有料資料</h1>
    <div id="host"></div>
  </div>
</div>
<script>
const CARDS = ${data};
const $ = (id) => document.getElementById(id);
const params = new URLSearchParams(location.search);
let cur = Math.max(0, CARDS.findIndex((c) => c.id === params.get('card')));
if (!params.get('card')) cur = CARDS.length - 1;
let copiedTimer = null;

function render() {
  const c = CARDS[cur];
  $('tabs').innerHTML = '';
  CARDS.forEach((x, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'tab';
    b.textContent = '#' + x.id;
    b.title = x.file;
    b.setAttribute('aria-pressed', String(i === cur));
    b.onclick = () => { cur = i; clearTimeout(copiedTimer); render(); };
    $('tabs').appendChild(b);
  });
  $('host').innerHTML = c.html;
  $('rawText').value = c.html;
  $('copy').textContent = '#' + c.id + ' のHTMLをコピー';
}

function showRaw(show) {
  $('raw').hidden = !show;
  $('toggleRaw').setAttribute('aria-expanded', String(show));
  $('toggleRaw').textContent = show ? 'HTMLを隠す' : 'HTMLを表示';
}

$('toggleRaw').onclick = () => showRaw($('raw').hidden);
$('rawText').onclick = $('rawText').onfocus = (e) => e.target.select();

$('copy').onclick = async () => {
  const html = CARDS[cur].html;
  let ok = false;
  try { await navigator.clipboard.writeText(html); ok = true; } catch (e) {}
  if (!ok) {
    const ta = document.createElement('textarea');
    ta.value = html;
    ta.setAttribute('readonly', '');
    ta.style.cssText = 'position:fixed;top:0;left:0;opacity:0;';
    document.body.appendChild(ta);
    ta.select();
    try { ok = document.execCommand('copy'); } catch (e) {}
    document.body.removeChild(ta);
  }
  if (!ok) { showRaw(true); $('rawText').focus(); return; }
  $('copy').textContent = 'コピーしました';
  clearTimeout(copiedTimer);
  copiedTimer = setTimeout(render, 2000);
};

render();
</script>
</body>
</html>
`;

writeFileSync(join(root, 'preview.html'), page);
console.log(`preview.html を生成しました（${cards.length} 枚: ${cards.map((c) => '#' + c.id).join(' ')}）`);
