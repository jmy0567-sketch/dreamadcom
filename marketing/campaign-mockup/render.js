// "댓글에 브랜드명 → 무료 시안" 캐러셀(1080x1350) 렌더: node render.js
const { chromium } = require('playwright'); const fs=require('fs'), path=require('path');
const F=f=>'data:font/otf;base64,'+fs.readFileSync(path.join(__dirname,'../proposal/fonts',f)).toString('base64');
const IMG=f=>'data:image/jpeg;base64,'+fs.readFileSync(path.join(__dirname,'..',f)).toString('base64');
const css=`@font-face{font-family:P;src:url(${F('Pretendard-Medium.otf')});font-weight:500}@font-face{font-family:P;src:url(${F('Pretendard-Bold.otf')});font-weight:700}@font-face{font-family:P;src:url(${F('Pretendard-Black.otf')});font-weight:900}
*{margin:0;box-sizing:border-box}body{width:1080px;height:1350px;font-family:P;background:#0b0b0c;color:#f5f1e8;position:relative;overflow:hidden}
.g{color:#c9a96e}.k{position:absolute;left:90px;top:110px;font-weight:700;font-size:40px;letter-spacing:.06em}.t{position:absolute;left:90px;top:190px;font-weight:900;font-size:92px;line-height:1.18}
.s{position:absolute;left:90px;font-weight:500;font-size:42px;line-height:1.55;color:#ddd}.foot{position:absolute;left:90px;right:90px;bottom:80px;display:flex;justify-content:space-between;font-size:30px;color:#999;font-weight:700}
.ph{position:absolute;left:90px;right:90px;top:430px;height:700px;border-radius:24px;background-size:cover;background-position:center}
.step{display:flex;gap:30px;align-items:flex-start;margin-bottom:46px}.n{flex:none;width:84px;height:84px;border-radius:50%;background:#c9a96e;color:#0b0b0c;font-weight:900;font-size:46px;display:flex;align-items:center;justify-content:center}.step b{display:block;font-size:46px;font-weight:900;margin-bottom:6px}.step span{font-size:34px;color:#ccc}`;
const stores={jinju:{name:'갤러리아 진주점',img:'house-ads/mockup-sample-jinju.jpg',cap:'예시 · 진주점 서문 출입구 LED'},cheonan:{name:'갤러리아 천안 센터시티',img:'house-ads/mockup-sample-cheonan.jpg',cap:'예시 · 센터시티 엘리베이터홀 벽면'}};
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1350}});
for(const [key,s] of Object.entries(stores)){
 const pages=[
 `<div class="k g">${s.name}</div><div class="t">우리 브랜드가<br>갤러리아에 걸리면<br><span class="g">어떤 모습일까요?</span></div><div class="s" style="top:720px">처음 열린 광고 자리,<br><b style="color:#fff">댓글에 브랜드명</b>만 남겨 주세요.<br>실제 자리에 걸린 시안을<br>DM으로 무료로 보내 드려요.</div><div class="foot"><span>옆으로 넘겨 보세요 →</span><span class="g">무료 시안</span></div>`,
 `<div class="k g">이렇게 만들어 드려요</div><div class="t" style="font-size:72px">실제 자리에<br>걸린 모습 그대로</div><div class="ph" style="background-image:url(${IMG(s.img)})"></div><div class="foot"><span>${s.cap}</span><span class="g">SAMPLE</span></div>`,
 `<div class="k g">신청 방법</div><div style="position:absolute;left:90px;right:90px;top:220px"><div class="step"><div class="n">1</div><div><b>댓글에 브랜드명</b><span>예) ○○치과, ○○필라테스</span></div></div><div class="step"><div class="n">2</div><div><b>DM으로 시안 도착</b><span>실제 매체 사진에 합성해 보내 드려요</span></div></div><div class="step"><div class="n">3</div><div><b>마음에 들면 상담</b><span>광고비는 기간에 따라 협의</span></div></div></div><div class="s" style="top:1000px;font-size:46px;color:#fff;font-weight:900">☎ <span class="g">1599-3611</span></div><div class="foot"><span>갤러리아 공식 광고대행사 (주)드림애드컴</span></div>`];
 for(const [i,h] of pages.entries()){await p.setContent(`<style>${css}</style>${h}`);await p.evaluate(()=>document.fonts.ready);await p.screenshot({path:path.join(__dirname,`${key}-${i+1}.png`)});}}
await b.close();console.log('ok')})().catch(e=>{console.error(e);process.exit(1)});
