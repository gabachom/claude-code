#!/usr/bin/env node
// 有料資料カードのプレビュー画面（preview.html）を生成する。
//
// 使い方: node build-preview.mjs [資料ディレクトリ]   （既定: ./paid-materials）
//
// <資料ディレクトリ>/wordpress/paid-NNN-*.html を番号順に読み込み、
// すべてのカードを埋め込んだ単体の <資料ディレクトリ>/preview.html を書き出す。
// 埋め込み方式なので file:// で直接開いても動作する（fetch 不要）。

import { readdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';

const root = resolve(process.argv[2] ?? 'paid-materials');
const cardDir = join(root, 'wordpress');
if (!existsSync(cardDir)) {
  console.error(`カードのディレクトリが見つかりません: ${cardDir}`);
  process.exit(1);
}

const cards = readdirSync(cardDir)
  .map(file => ({ file, m: /^paid-(\d{3})-.+\.html$/.exec(file) }))
  .filter(x => x.m)
  .sort((a, b) => a.m[1].localeCompare(b.m[1]))
  .map(({ file, m }) => ({
    id: m[1],
    file: `wordpress/${file}`,
    html: readFileSync(join(cardDir, file), 'utf8'),
  }));

if (cards.length === 0) {
  console.error(`paid-NNN-*.html が ${cardDir} にありません`);
  process.exit(1);
}

// </script> 等で埋め込みが途切れないよう < をエスケープ
const data = JSON.stringify(cards).replace(/</g, '\\u003c');

const page = `<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>有料資料 WordPressプレビュー</title>
<style>
  body { margin: 0; background: #eef1f4; font-family: "Hiragino Sans", "Noto Sans JP", sans-serif; color: #1f2933; }
  a { color: #0f2a47; }
  a:hover { color: #1d4e89; }
  .wrap { max-width: 1040px; margin: 0 auto; padding: 32px 20px 64px; display: flex; flex-direction: column; gap: 24px; }
  .bar { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 12px; }
  .bar-left { display: flex; flex-direction: column; gap: 8px; }
  .crumb { font-size: 13px; color: #5b6675; }
  .tabs, .actions { display: flex; gap: 8px; flex-wrap: wrap; }
  button { cursor: pointer; font: inherit; font-size: 14px; font-weight: 700; border-radius: 4px; }
  button:focus-visible, textarea:focus-visible { outline: 2px solid #c9a24a; outline-offset: 2px; }
  .tab { padding: 8px 16px; border: 1px solid #0f2a47; background: #fff; color: #0f2a47; }
  .tab[aria-pressed="true"] { background: #0f2a47; color: #fff; }
  .btn-outline { border: 1px solid #0f2a47; background: #fff; color: #0f2a47; padding: 12px 20px; }
  .btn-solid { border: none; background: #0f2a47; color: #fff; padding: 12px 20px; }
  .raw { display: flex; flex-direction: column; gap: 8px; }
  .raw[hidden] { display: none; }
  .raw label { font-size: 13px; color: #5b6675; }
  .raw textarea { width: 100%; box-sizing: border-box; height: 320px; font-family: monospace; font-size: 12px; padding: 12px; border: 1px solid #d6dde6; border-radius: 4px; }
  .panel { background: #fff; padding: 32px 20px; border-radius: 6px; }
  .panel h1 { font-size: 22px; font-weight: 700; color: #1f2933; margin: 0 0 24px; }
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
      <button type="button" class="btn-outline" id="toggleRaw" aria-expanded="false" aria-controls="raw">HTMLを表示</button>
      <button type="button" class="btn-solid" id="copy"></button>
    </div>
  </div>
  <div class="raw" id="raw" hidden>
    <label for="rawText">クリックで全選択されます。Ctrl+C（Mac: ⌘+C）でコピーしてください。</label>
    <textarea id="rawText" readonly></textarea>
  </div>
  <div class="panel">
    <h1>有料資料</h1>
    <div id="host"></div>
  </div>
</div>
<script>
const CARDS = ${data};
let cur = CARDS.length - 1; // 既定は最新カード
let copied = false;
const $ = id => document.getElementById(id);

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
    b.onclick = () => { cur = i; copied = false; render(); };
    $('tabs').appendChild(b);
  });
  $('host').innerHTML = c.html;
  $('rawText').value = c.html;
  setCopyLabel();
}

// コピー状態の表示だけ更新（プレビューを再描画すると開いた詳細が閉じるため）
function setCopyLabel() {
  $('copy').textContent = copied ? 'コピーしました' : '#' + CARDS[cur].id + ' のHTMLをコピー';
}

function showRaw(on) {
  $('raw').hidden = !on;
  $('toggleRaw').setAttribute('aria-expanded', String(on));
  $('toggleRaw').textContent = on ? 'HTMLを隠す' : 'HTMLを表示';
}

$('toggleRaw').onclick = () => showRaw($('raw').hidden);
$('rawText').onclick = $('rawText').onfocus = e => e.target.select();

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
  copied = true;
  setCopyLabel();
  setTimeout(() => { copied = false; setCopyLabel(); }, 2000);
};

render();
</script>
</body>
</html>
`;

const out = join(root, 'preview.html');
writeFileSync(out, page);
console.log(`${cards.length} 枚のカードで ${out} を生成しました（最新: #${cards.at(-1).id}）`);
