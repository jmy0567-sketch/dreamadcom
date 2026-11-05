// 갤러리아 '처음 열린 광고 자리' 자사 광고 시안 렌더: node render.js
const { chromium } = require('playwright'); const fs=require('fs'), path=require('path');
const F=f=>'data:font/otf;base64,'+fs.readFileSync(path.join(__dirname,'../proposal/fonts',f)).toString('base64');
const QR='data:image/png;base64,'+fs.readFileSync(path.join(__dirname,'qr-tel.png')).toString('base64');
const css=`@font-face{font-family:P;src:url(${F('Pretendard-Bold.otf')});font-weight:700}@font-face{font-family:P;src:url(${F('Pretendard-Black.otf')});font-weight:900}@font-face{font-family:P;src:url(${F('Pretendard-Medium.otf')});font-weight:500}
*{margin:0;box-sizing:border-box}body{font-family:P;background:#0f1115;color:#fff;overflow:hidden;position:relative}
.ac{color:#d7ff3c}.or{color:#ff9a2e}`;
// 단위: px, 실제 매체 비율 그대로
const ads=[
 {name:'cheonan-ev-lcd',w:1140,h:2000,store:'갤러리아 천안 센터시티',layout:'tall'},   // 570×1000mm
 {name:'cheonan-wide',w:2400,h:1600,store:'갤러리아 천안 센터시티',layout:'wide'},     // 3000×2000mm
 {name:'cheonan-ev-wall-tall',w:1200,h:1600,store:'갤러리아 천안 센터시티',layout:'tall'}, // 1500×2000mm
 {name:'jinju-led',w:1000,h:1600,store:'갤러리아 진주점',layout:'tall'},              // 1500×2400mm
 {name:'jinju-escalator-lcd',w:1800,h:1000,store:'갤러리아 진주점',layout:'wide'},     // 900×500mm
 {name:'jinju-ev-lcd',w:900,h:1620,store:'갤러리아 진주점',layout:'tall'},            // 300×540mm
];
const tall=(a)=>{const u=a.w/100;return `<div style="position:absolute;inset:0;background:radial-gradient(circle at 80% 15%,rgba(215,255,60,.22),transparent 45%),#0f1115"></div>
<div style="position:absolute;left:${8*u}px;top:${10*u}px;font-weight:700;font-size:${5.2*u}px" class="or">${a.store}</div>
<div style="position:absolute;left:${8*u}px;top:${18*u}px;font-weight:900;font-size:${13*u}px;line-height:1.12">처음으로<br>광고 자리가<br><span class="ac">열렸습니다</span></div>
<div style="position:absolute;left:${8*u}px;right:${8*u}px;top:${a.h*0.52}px;font-weight:500;font-size:${5.4*u}px;line-height:1.5;color:#e5e7eb">지금 보고 계신 이 화면에<br><b style="color:#fff">당신의 가게 이름</b>이 걸립니다</div>
<div style="position:absolute;left:${8*u}px;right:${8*u}px;bottom:${8*u}px;display:flex;align-items:flex-end;justify-content:space-between">
 <div><div style="font-weight:700;font-size:${4.4*u}px;color:#bbb">광고 문의 · 무료 시안</div><div style="font-weight:900;font-size:${10.5*u}px;line-height:1;white-space:nowrap" class="ac">1599-3611</div><div style="font-weight:700;font-size:${4*u}px;color:#bbb;margin-top:${1.5*u}px">(주)드림애드컴</div></div>
 <img src="${QR}" style="width:${22*u}px;height:${22*u}px;border-radius:${1.5*u}px">
</div>`};
const wide=(a)=>{const u=a.h/100;return `<div style="position:absolute;inset:0;background:radial-gradient(circle at 85% 20%,rgba(215,255,60,.22),transparent 45%),#0f1115"></div>
<div style="position:absolute;left:${7*u}px;top:${9*u}px;font-weight:700;font-size:${6.5*u}px" class="or">${a.store}</div>
<div style="position:absolute;left:${7*u}px;top:${19*u}px;font-weight:900;font-size:${17*u}px;line-height:1.1">처음으로 광고 자리가<br><span class="ac">열렸습니다</span></div>
<div style="position:absolute;left:${7*u}px;top:${60*u}px;font-weight:500;font-size:${6.5*u}px;color:#e5e7eb">이 자리에 <b style="color:#fff">당신의 가게 이름</b>이 걸립니다</div>
<div style="position:absolute;right:${7*u}px;bottom:${9*u}px;text-align:right;display:flex;gap:${4*u}px;align-items:flex-end">
 <div><div style="font-weight:900;font-size:${15*u}px;line-height:1;white-space:nowrap" class="ac">1599-3611</div><div style="font-weight:700;font-size:${5*u}px;color:#bbb;margin-top:${1.5*u}px">광고 문의 · 무료 시안 · (주)드림애드컴</div></div>
 <img src="${QR}" style="width:${24*u}px;height:${24*u}px;border-radius:${2*u}px">
</div>`};
(async()=>{const b=await chromium.launch();const p=await b.newPage();
for(const a of ads){await p.setViewportSize({width:a.w,height:a.h});
 await p.setContent(`<style>${css}</style>`+(a.layout==='tall'?tall(a):wide(a)));await p.evaluate(()=>document.fonts.ready);
 await p.screenshot({path:path.join(__dirname,a.name+'.png')});}
await b.close();console.log('ok')})().catch(e=>{console.error(e);process.exit(1)});
