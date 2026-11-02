// 인스타그램 카드(1080x1350) 렌더러: node render.js <폰트폴더>
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const dir = __dirname, font = process.argv[2];
const cards = JSON.parse(fs.readFileSync(path.join(dir, 'cards.json'), 'utf8'));
// setContent 페이지는 file:// 폰트를 못 읽으므로 base64로 임베드
const ff = w => `url(data:font/otf;base64,${fs.readFileSync(path.join(font, 'Pretendard-' + w + '.otf')).toString('base64')})`;
const css = `
@font-face{font-family:P;font-weight:500;src:${ff('Medium')}}
@font-face{font-family:P;font-weight:700;src:${ff('Bold')}}
@font-face{font-family:P;font-weight:900;src:${ff('Black')}}
*{box-sizing:border-box;margin:0}
body{width:1080px;height:1350px;font-family:P,sans-serif;background:#0d0f14;color:#fff;padding:96px 88px;display:flex;flex-direction:column;word-break:keep-all;
 background-image:radial-gradient(circle at 85% 12%,rgba(215,255,60,.16),transparent 45%),repeating-linear-gradient(90deg,rgba(255,255,255,.025) 0 2px,transparent 2px 40px)}
.tag{align-self:flex-start;background:#d7ff3c;color:#0d0f14;font-weight:900;font-size:34px;padding:14px 28px;border-radius:999px}
h1{font-weight:900;font-size:104px;line-height:1.18;letter-spacing:-.04em;margin-top:70px}
h1 em{font-style:normal;color:#d7ff3c}
.sub{font-weight:700;font-size:40px;color:#c9ced8;margin-top:44px}
ul{list-style:none;padding:0;margin-top:auto;border-top:2px solid rgba(255,255,255,.14);padding-top:40px}
li{font-weight:500;font-size:38px;padding:9px 0;color:#e8ebf0}
li:before{content:"✔ ";color:#d7ff3c;font-weight:900}
.foot{display:flex;justify-content:space-between;align-items:center;margin-top:48px}
.logo{display:flex;align-items:center;gap:18px;font-weight:900;font-size:40px}
.mark{width:64px;height:64px;border-radius:16px;background:#d7ff3c;color:#0d0f14;display:grid;place-items:center;font-size:36px}
.tel{background:#e8202a;font-weight:900;font-size:46px;padding:16px 34px;border-radius:999px}`;
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1080, height: 1350 } });
  for (const c of cards) {
    await p.setContent(`<html><head><style>${css}</style></head><body>
      <span class="tag">${c.tag}</span><h1>${c.title}</h1><p class="sub">${c.sub}</p>
      <ul>${c.pts.map(x => `<li>${x}</li>`).join('')}</ul>
      <div class="foot"><span class="logo"><span class="mark">D</span>드림애드컴</span><span class="tel">☎ 1599-3611</span></div></body></html>`);
    await p.evaluate(() => document.fonts.ready);
    await p.screenshot({ path: path.join(dir, c.id + '.png') });
    console.log('ok', c.id);
  }
  await b.close();
})().catch(e => { console.error(e); process.exit(1); });
