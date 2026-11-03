// 업체별 광고 크리에이티브(시안) 렌더: node render_creatives.js
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const leads = JSON.parse(fs.readFileSync(path.join(__dirname, 'leads.json')));
const font = f => 'data:font/otf;base64,' + fs.readFileSync(path.join(__dirname, '../proposal/fonts', f)).toString('base64');
const css = `@font-face{font-family:P;src:url(${font('Pretendard-Bold.otf')});font-weight:700}
@font-face{font-family:P;src:url(${font('Pretendard-Black.otf')});font-weight:900}
@font-face{font-family:P;src:url(${font('Pretendard-Medium.otf')});font-weight:500}
*{margin:0;box-sizing:border-box}body{font-family:P}
.c{width:var(--w);height:var(--h);background:var(--bg);color:#fff;display:flex;flex-direction:column;justify-content:center;padding:8%;position:relative;overflow:hidden}
.c:before{content:"";position:absolute;right:-20%;top:-20%;width:80%;height:80%;border-radius:50%;background:var(--ac);opacity:.18}
.k{font-weight:700;color:var(--ac);font-size:calc(var(--w)*.06);margin-bottom:4%}
.h{font-weight:900;font-size:calc(var(--w)*.12);line-height:1.18;white-space:pre-line;letter-spacing:-.02em}
.s{font-weight:500;font-size:calc(var(--w)*.05);margin-top:6%;opacity:.9}
.n{position:absolute;left:8%;bottom:7%;font-weight:700;font-size:calc(var(--w)*.045);opacity:.85}`;
(async () => {
  const b = await chromium.launch(); const p = await b.newPage();
  for (const L of leads) for (const [tag, w, h] of [['led', 900, 900], ['ev', 900, 1000]]) {
    await p.setViewportSize({ width: w, height: h });
    await p.setContent(`<style>${css}</style><div class="c" style="--w:${w}px;--h:${h}px;--bg:${L.bg};--ac:${L.accent}"><div class="k">${L.kicker}</div><div class="h">${L.head}</div><div class="s">${L.sub}</div><div class="n">${L.name}</div></div>`);
    await p.evaluate(() => document.fonts.ready);
    await p.screenshot({ path: path.join(__dirname, 'mockups', `cr-${L.key}-${tag}.png`) });
  }
  await b.close(); console.log('ok');
})().catch(e => { console.error(e); process.exit(1); });
