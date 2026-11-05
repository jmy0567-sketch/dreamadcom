// 보도자료 PDF 렌더: node render.js
const { chromium } = require('playwright'); const fs=require('fs'), path=require('path');
const F=f=>'data:font/otf;base64,'+fs.readFileSync(path.join(__dirname,'../proposal/fonts',f)).toString('base64');
const IMG=f=>'data:image/jpeg;base64,'+fs.readFileSync(path.join(__dirname,'..',f)).toString('base64');
let md=fs.readFileSync(path.join(__dirname,'press-release-galleria-open.md'),'utf8').split('※ 배포 전 확인할 것')[0];
let html=md.replace(/^---$/gm,'<hr>').replace(/^# (.*)$/gm,'<h1>$1</h1>').replace(/^## (.*)$/gm,'<h2>$1</h2>').replace(/^### (.*)$/gm,'<h3>$1</h3>')
 .replace(/\*\*(.+?)\*\*/g,'<b>$1</b>').replace(/ \[대표님 확인 후 수정\]/g,'').split(/\n\n+/).map(b=>b.startsWith('<')?b:`<p>${b.replace(/\n/g,'<br>')}</p>`).join('\n');
const photos=`<div class="ph"><figure><img src="${IMG('media/galleria-drive/cc-ev-lcd-far.jpg')}"><figcaption>천안 센터시티 엘리베이터홀 디지털 화면</figcaption></figure><figure><img src="${IMG('media/galleria-drive/cc-1f-north-far.jpg')}"><figcaption>천안 센터시티 1층 엘리베이터홀 벽면</figcaption></figure><figure><img src="${IMG('proposal/img/jinju-led.jpg')}"><figcaption>진주점 서문 출입구 LED</figcaption></figure></div>`;
html=html.replace('<h3>천안 센터시티',photos+'<h3>천안 센터시티');
const css=`@font-face{font-family:P;src:url(${F('Pretendard-Medium.otf')});font-weight:500}@font-face{font-family:P;src:url(${F('Pretendard-Bold.otf')});font-weight:700}@font-face{font-family:P;src:url(${F('Pretendard-Black.otf')});font-weight:900}
body{font-family:P;font-weight:500;color:#111;font-size:14.5px;line-height:1.75;margin:0;padding:48px 60px}h1{font-weight:900;font-size:27px;line-height:1.35;margin:10px 0 6px}h2{font-weight:700;font-size:16px;color:#2d5bd7;margin:0 0 18px}h3{font-size:16px;margin:22px 0 4px}p{margin:8px 0}hr{border:0;border-top:1px solid #ddd;margin:18px 0}
.ph{display:flex;gap:10px;margin:14px 0}.ph figure{margin:0;flex:1}.ph img{width:100%;height:150px;object-fit:cover;border-radius:6px}.ph figcaption{font-size:11px;color:#555;margin-top:4px}`;
(async()=>{const b=await chromium.launch();const p=await b.newPage();await p.setContent(`<style>${css}</style>${html}`);await p.evaluate(()=>document.fonts.ready);
await p.pdf({path:path.join(__dirname,'보도자료_갤러리아_천안진주_광고자리_최초개방.pdf'),format:'A4',printBackground:true});await b.close();console.log('ok')})();
