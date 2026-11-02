// 갤러리아 매체 소개서 PDF·미리보기 렌더: node render-galleria.js
const { chromium } = require('playwright');
const path = require('path');
const files = { cheonan: '갤러리아_천안센터시티_매체소개서.pdf', jinju: '갤러리아_진주점_매체소개서.pdf' };
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1600, height: 900 } });
  for (const [k, out] of Object.entries(files)) {
    await p.goto('file://' + path.join(__dirname, `galleria-${k}.html`));
    await p.evaluate(() => document.fonts.ready);
    await p.pdf({ path: path.join(__dirname, out), width: '1600px', height: '900px', printBackground: true });
    const pages = await p.$$('.pg');
    for (let i = 0; i < pages.length; i++) await pages[i].screenshot({ path: path.join(__dirname, `preview-${k}-${i + 1}.png`) });
    console.log(k, pages.length);
  }
  await b.close();
})().catch(e => { console.error(e); process.exit(1); });
