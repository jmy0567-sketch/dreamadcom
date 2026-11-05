// 진주점 "갤러리아 광고는 드림애드컴" 릴스 슬라이드(1080x1920) 렌더: node slides.js
const { chromium } = require('playwright'); const fs=require('fs'), path=require('path');
const F=f=>'data:font/otf;base64,'+fs.readFileSync(path.join(__dirname,'../../proposal/fonts',f)).toString('base64');
const IMG=f=>'data:image/jpeg;base64,'+fs.readFileSync(path.join(__dirname,'../../proposal/img',f)).toString('base64');
const css=`@font-face{font-family:P;src:url(${F('Pretendard-Bold.otf')});font-weight:700}@font-face{font-family:P;src:url(${F('Pretendard-Black.otf')});font-weight:900}@font-face{font-family:P;src:url(${F('Pretendard-Medium.otf')});font-weight:500}
*{margin:0;box-sizing:border-box}body{width:1080px;height:1920px;background:#121212;font-family:P;color:#fff;position:relative;overflow:hidden}
.k{position:absolute;left:90px;top:300px;font-weight:700;font-size:46px;color:#ff9a2e}.t{position:absolute;left:90px;top:370px;font-weight:900;font-size:84px;line-height:1.2;white-space:pre-line}
.s{position:absolute;left:90px;top:600px;font-weight:500;font-size:40px;color:#ddd;white-space:pre-line;line-height:1.45}
.ph{position:absolute;left:60px;right:60px;top:820px;height:960px;border-radius:28px;background-size:cover;background-position:center}
.tag{position:absolute;left:90px;bottom:70px;font-size:34px;font-weight:700;color:#bbb}.tel{position:absolute;right:90px;bottom:66px;font-size:40px;font-weight:900;color:#d7ff3c}
.big{position:absolute;left:90px;right:90px;top:620px;font-weight:900;font-size:110px;line-height:1.15;white-space:pre-line}
.box{position:absolute;left:90px;right:90px;bottom:300px;background:#d7ff3c;color:#111;border-radius:30px;padding:46px 54px}.box b{display:block;font-size:52px;font-weight:900}.box span{font-size:96px;font-weight:900}`;
const S=[
 {big:'갤러리아\n진주점 광고,\n드림애드컴이\n운영합니다', k:'갤러리아 진주점'},
 {k:'서문 출입구 LED 전광판',t:'백화점 정문\n첫 시선',s:'1,500×2,400mm · 이미지 광고',img:'jinju-led.jpg'},
 {k:'에스컬레이터 LCD',t:'10기 전 화면\n같은 광고 동시 송출',s:'900×500mm 디지털 포스터',img:'jinju-escalator.jpg'},
 {k:'엘리베이터 LCD',t:'1~4호기\n엘리베이터 안',s:'300×540mm · 가장 많이 타는 4대',img:'jinju-elevator.jpg'},
 {k:'1F · 12F 이벤트·분양 부스',t:'고객과\n직접 만나는 자리',s:'10일 단위 운영 · 엘리베이터홀 앞',img:'jinju-booth-blur.jpg'},
 {k:'우수고객 LMS 문자',t:'5만 명에게\n매주 금요일',s:'백화점 우수고객 대상 광고 문자',img:'jinju-building.jpg'},
 {end:true}
];
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1920}});
for(const [i,x] of S.entries()){let h;
 if(x.end) h=`<div class="k" style="top:420px">갤러리아 진주점</div><div class="big" style="top:500px;font-size:96px">광고 상담은\n20년째 광고판 거는\n드림애드컴</div><div class="box"><b>견적·무료 시안 상담</b><span>1599-3611</span></div><div class="tag">광고비는 협의 · 갤러리아 공식 광고대행사 (주)드림애드컴</div>`;
 else if(x.big) h=`<div class="k" style="top:520px">${x.k}</div><div class="big">${x.big}</div><div class="tag">THE GALLERIA · JINJU</div><div class="tel">1599-3611</div>`;
 else h=`<div class="k">${x.k}</div><div class="t">${x.t}</div><div class="s">${x.s}</div><div class="ph" style="background-image:url(${IMG(x.img)})"></div><div class="tag">(주)드림애드컴 · 갤러리아 진주점</div><div class="tel">1599-3611</div>`;
 await p.setContent(`<style>${css}</style>${h}`);await p.evaluate(()=>document.fonts.ready);await p.screenshot({path:path.join(__dirname,`s${i}.png`)});}
await b.close();console.log('ok')})().catch(e=>{console.error(e);process.exit(1)});
