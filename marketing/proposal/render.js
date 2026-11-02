// 제안서 HTML → PDF + 페이지별 미리보기 PNG: node render.js
const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1600, height: 900 } });
  await p.goto('file://' + path.join(__dirname, 'dream-building.html'));
  await p.evaluate(() => document.fonts.ready);
  await p.pdf({ path: path.join(__dirname, '드림빌딩_벽면광고_제안서_수정본.pdf'), width: '1600px', height: '900px', printBackground: true });
  const pages = await p.$$('.pg');
  for (let i = 0; i < pages.length; i++) await pages[i].screenshot({ path: path.join(__dirname, `preview-${i + 1}.png`) });
  await b.close();
  console.log('pages', pages.length);
})().catch(e => { console.error(e); process.exit(1); });
