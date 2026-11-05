// 가상 브랜드 예시 크리에이티브(합성용): node sample.js
const { chromium } = require('playwright'); const fs=require('fs'), path=require('path');
const F=f=>'data:font/otf;base64,'+fs.readFileSync(path.join(__dirname,'../proposal/fonts',f)).toString('base64');
const css=`@font-face{font-family:P;src:url(${F('Pretendard-Bold.otf')});font-weight:700}@font-face{font-family:P;src:url(${F('Pretendard-Black.otf')});font-weight:900}*{margin:0}body{font-family:P}`;
const mk=(w,h,fs)=>`<div style="width:${w}px;height:${h}px;background:linear-gradient(160deg,#f6efe4,#e7d9c3);display:flex;flex-direction:column;justify-content:center;padding:0 ${w*.09}px;color:#2a2219"><div style="font-weight:700;font-size:${fs*.32}px;letter-spacing:.18em;color:#9a7b4f">YOUR BRAND</div><div style="font-weight:900;font-size:${fs}px;line-height:1.1;margin:${fs*.2}px 0">당신의<br>브랜드가<br>여기에</div><div style="font-weight:700;font-size:${fs*.3}px;color:#6b5a44">SAMPLE · 예시 시안</div></div>`;
(async()=>{const b=await chromium.launch();const p=await b.newPage();
for(const [n,w,h,fs] of [['sample-tall',900,900,150],['sample-wide',1500,1000,150],['sample-v',750,1000,130]]){await p.setViewportSize({width:w,height:h});await p.setContent(`<style>${css}</style>${mk(w,h,fs)}`);await p.evaluate(()=>document.fonts.ready);await p.screenshot({path:path.join(__dirname,n+'.png')});}
await b.close();console.log('ok')})();
