// 천안 분양 4곳 영업용 시안 크리에이티브(세로 750x1000): node make.js
const { chromium } = require('playwright'); const fs=require('fs'), path=require('path');
const F=f=>'data:font/otf;base64,'+fs.readFileSync(path.join(__dirname,'../../proposal/fonts',f)).toString('base64');
const L=[
 ['purgio','두정역 푸르지오 그랑피크','두정역 초역세권','1,438세대 대단지','#0b3b2e','#d8c27a'],
 ['elif','엘리프 성성호수공원','성성호수 영구 조망','선착순 계약 진행 중','#123a5c','#9fd0f0'],
 ['byeoksan','천안 삼거리 벽산블루밍','GTX-C 천안','내 집처럼 살다 내 집으로','#2a1f4a','#c9b6ff'],
 ['xi','백석시그니처자이','불당 생활권','1,174세대','#1d1d1f','#c9a96e']];
const css=`@font-face{font-family:P;src:url(${F('Pretendard-Bold.otf')});font-weight:700}@font-face{font-family:P;src:url(${F('Pretendard-Black.otf')});font-weight:900}*{margin:0}body{font-family:P}`;
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:750,height:1000}});
for(const [k,n,a,s,bg,ac] of L){await p.setContent(`<style>${css}</style><div style="width:750px;height:1000px;background:${bg};color:#fff;display:flex;flex-direction:column;justify-content:center;padding:0 64px;box-sizing:border-box"><div style="font-weight:700;font-size:40px;color:${ac}">${a}</div><div style="font-weight:900;font-size:86px;line-height:1.15;margin:24px 0">${n.replace(' ','<br>')}</div><div style="font-weight:700;font-size:44px">${s}</div><div style="margin-top:70px;font-weight:700;font-size:30px;opacity:.75">분양 문의 · 모델하우스 방문 예약</div></div>`);await p.evaluate(()=>document.fonts.ready);await p.screenshot({path:path.join(__dirname,`cr-${k}.png`)});}
await b.close();console.log('ok')})();
