// 인스타 하이라이트 표지 4종(1080x1920, 가운데 원 안에 보이게): node covers.js
const { chromium } = require('playwright'); const fs=require('fs'), path=require('path');
const F=f=>'data:font/otf;base64,'+fs.readFileSync(path.join(__dirname,'../proposal/fonts',f)).toString('base64');
const css=`@font-face{font-family:P;src:url(${F('Pretendard-Black.otf')});font-weight:900}@font-face{font-family:P;src:url(${F('Pretendard-Bold.otf')});font-weight:700}*{margin:0}body{width:1080px;height:1920px;background:#0b0b0c;display:flex;align-items:center;justify-content:center;font-family:P}
.c{width:700px;height:700px;border-radius:50%;border:6px solid #c9a96e;display:flex;flex-direction:column;align-items:center;justify-content:center;color:#f5f1e8}.c b{font-weight:900;font-size:120px;line-height:1.1}.c span{font-weight:700;font-size:56px;color:#c9a96e;margin-top:20px}`;
const L=[['cheonan','천안','센터시티'],['jinju','진주','진주점'],['mockup','시안','무료 예시'],['contact','문의','1599-3611']];
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1920}});
for(const [n,a,s] of L){await p.setContent(`<style>${css}</style><div class="c"><b>${a}</b><span>${s}</span></div>`);await p.evaluate(()=>document.fonts.ready);await p.screenshot({path:path.join(__dirname,`highlight-${n}.png`)});}
await b.close();console.log('ok')})();
