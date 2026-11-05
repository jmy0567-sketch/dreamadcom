// 천안 센터시티 "갤러리아 광고는 드림애드컴" 릴스 슬라이드(1080x1920) 렌더: node slides.js
const { chromium } = require('playwright'); const fs=require('fs'), path=require('path');
const F=f=>'data:font/otf;base64,'+fs.readFileSync(path.join(__dirname,'../../proposal/fonts',f)).toString('base64');
const IMG=f=>'data:image/jpeg;base64,'+fs.readFileSync(path.join(__dirname,'../../media/galleria-drive',f)).toString('base64');
const css=`@font-face{font-family:P;src:url(${F('Pretendard-Bold.otf')});font-weight:700}@font-face{font-family:P;src:url(${F('Pretendard-Black.otf')});font-weight:900}@font-face{font-family:P;src:url(${F('Pretendard-Medium.otf')});font-weight:500}
*{margin:0;box-sizing:border-box}body{width:1080px;height:1920px;background:#121212;font-family:P;color:#fff;position:relative;overflow:hidden}
.k{position:absolute;left:90px;top:300px;font-weight:700;font-size:46px;color:#ff9a2e}.t{position:absolute;left:90px;top:370px;font-weight:900;font-size:84px;line-height:1.2;white-space:pre-line}
.s{position:absolute;left:90px;top:600px;font-weight:500;font-size:40px;color:#ddd;white-space:pre-line;line-height:1.45}
.ph{position:absolute;left:60px;right:60px;top:820px;height:960px;border-radius:28px;background-size:cover;background-position:center}
.tag{position:absolute;left:90px;bottom:70px;font-size:34px;font-weight:700;color:#bbb}.tel{position:absolute;right:90px;bottom:66px;font-size:40px;font-weight:900;color:#d7ff3c}
.big{position:absolute;left:90px;right:90px;top:620px;font-weight:900;font-size:110px;line-height:1.15;white-space:pre-line}
.box{position:absolute;left:90px;right:90px;bottom:300px;background:#d7ff3c;color:#111;border-radius:30px;padding:46px 54px}.box b{display:block;font-size:52px;font-weight:900}.box span{font-size:96px;font-weight:900}`;
const S=[
 {big:'갤러리아 천안\n센터시티 광고,\n드림애드컴이\n운영합니다', k:'갤러리아 천안 센터시티', end:false},
 {k:'주차장 출입구 와이드',t:'들어갈 때 한 번\n나올 때 또 한 번',s:'3,000×2,000mm · 후면 조명\n일 평균 3.3만 명 (드림애드컴 AI 측정)',img:'cc-parking-entry-far.jpg'},
 {k:'1F · B1F 엘리베이터홀 벽면',t:'기다리는 고객\n바로 정면',s:'1,500×2,000 / 3,000×2,000mm\nB1 평균 체류 42분 (자체 측정)',img:'cc-1f-north-far.jpg'},
 {k:'엘리베이터홀 벽면 · 근경',t:'이렇게\n걸립니다',s:'실제 집행 사진',img:'cc-b1-north-near.jpg'},
 {k:'엘리베이터홀 LCD',t:'19대 전 화면\n같은 광고 동시 송출',s:'570×1,000mm 디지털 포스터',img:'cc-ev-lcd-far.jpg'},
 {k:'엘리베이터홀 LCD · 근경',t:'층마다\n다시 보입니다',s:'1층 명품관 E/V홀 1인당 4.2회 노출 (자체 측정)',img:'cc-ev-lcd-near.jpg'},
 {end:true}
];
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1920}});
for(const [i,x] of S.entries()){let h;
 if(x.end) h=`<div class="k" style="top:420px">갤러리아 천안 센터시티</div><div class="big" style="top:500px;font-size:96px">광고 상담은\n20년째 광고판 거는\n드림애드컴</div><div class="box"><b>견적·무료 시안 상담</b><span>1599-3611</span></div><div class="tag">광고비는 협의 · 갤러리아 공식 광고대행사 (주)드림애드컴</div>`;
 else if(x.big) h=`<div class="k" style="top:520px">${x.k}</div><div class="big">${x.big}</div><div class="tag">THE GALLERIA · CENTERCITY</div><div class="tel">1599-3611</div>`;
 else h=`<div class="k">${x.k}</div><div class="t">${x.t}</div><div class="s">${x.s}</div><div class="ph" style="background-image:url(${IMG(x.img)})"></div><div class="tag">(주)드림애드컴 · 갤러리아 천안 센터시티</div><div class="tel">1599-3611</div>`;
 await p.setContent(`<style>${css}</style>${h}`);await p.evaluate(()=>document.fonts.ready);await p.screenshot({path:path.join(__dirname,`s${i}.png`)});}
await b.close();console.log('ok')})().catch(e=>{console.error(e);process.exit(1)});
