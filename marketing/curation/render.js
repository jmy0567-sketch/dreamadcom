// 갤러리아 광고 자리 큐레이션 캐러셀(1080×1350, 블랙·골드): node marketing/curation/render.js
// 레퍼런스: 쉐어잇 'BEST 10 스팟 큐레이션·선점' 구조를 고급 톤으로. 금액 없음, 확인된 숫자만.
const { chromium } = require('playwright'); const fs = require('fs'), path = require('path');
const R = p => path.join(__dirname, '..', p);
const F = f => 'data:font/otf;base64,' + fs.readFileSync(R('proposal/fonts/' + f)).toString('base64');
const IMG = f => 'data:image/jpeg;base64,' + fs.readFileSync(R('reels/series/img/' + f)).toString('base64');
const QR = 'data:image/png;base64,' + fs.readFileSync(R('house-ads/qr-tel.png')).toString('base64');
const css = `@font-face{font-family:P;src:url(${F('Pretendard-Medium.otf')});font-weight:500}@font-face{font-family:P;src:url(${F('Pretendard-Bold.otf')});font-weight:700}@font-face{font-family:P;src:url(${F('Pretendard-Black.otf')});font-weight:900}
*{margin:0;box-sizing:border-box}body{width:1080px;height:1350px;font-family:P;background:#0b0b0c;color:#f5f1e8;overflow:hidden;position:relative;word-break:keep-all}
.g{color:#c9a96e}.k{letter-spacing:.18em;font-weight:700;font-size:26px;color:#c9a96e}
.line{position:absolute;left:80px;right:80px;height:1px;background:linear-gradient(90deg,#c9a96e,transparent)}
.foot{position:absolute;left:80px;right:80px;bottom:60px;display:flex;justify-content:space-between;font-size:22px;color:#8a8478;font-weight:500}`;

const stores = {
  cheonan: {
    en: 'GALLERIA CENTERCITY · CHEONAN', ko: '갤러리아 천안 센터시티', n: '네',
    spots: [
      { img: 'parking-entry.jpg', name: '주차장 입구 · 출구', why: '차로 오는 모든 고객이 반드시 지나는 자리.<br>들어올 때 한 번, 나갈 때 또 한 번.', fact: '일 평균 약 3.3만 명 · 3,000×2,000mm 후면 조명' },
      { img: '1f-west.jpg', name: '1층 명품관 엘리베이터홀', why: '명품을 사러 온 고객이<br>엘리베이터를 기다리는 바로 앞.', fact: '1인당 평균 4.2회 노출 · 가로형·세로형 2곳' },
      { img: 'b1-west.jpg', name: '지하 1층 식품관 엘리베이터홀', why: '매일 오는 고객이<br>가장 오래 머무는 자리.', fact: '하루 약 1.5만 명 · 평균 체류 42분' },
      { img: 'ev-near.jpg', name: '엘리베이터홀 화면 18곳', why: '층마다 같은 영상이 동시에.<br>기다리는 순간이 곧 노출.', fact: '570×1,000mm · 영상 광고 가능' },
    ],
    src: '수치: 드림애드컴 자체 AI 측정',
  },
  jinju: {
    en: 'GALLERIA · JINJU', ko: '갤러리아 진주점', n: '세',
    spots: [
      { img: 'j-led.jpg', name: '서문 출입구 LED', why: '주차하고 들어오는 문의 정면.<br>들어서는 순간 가장 먼저 보입니다.', fact: '1,500×2,400mm · 이미지 광고' },
      { img: 'j-esc.jpg', name: '무빙워크 · 에스컬레이터 화면', why: '층을 옮기는 내내<br>고객 눈앞을 따라갑니다.', fact: '900×500mm · 10기 동시 송출' },
      { img: 'j-ev.jpg', name: '엘리베이터 안 화면', why: '문이 닫히는 순간,<br>시선이 머무는 단 하나의 화면.', fact: '300×540mm · 1~4호기 4기' },
    ],
    src: '진주점 하루 방문 약 1만 명(매출 규모 기준 추정)',
  },
};

const cover = s => `<div style="position:absolute;inset:0;background:radial-gradient(circle at 78% 18%,rgba(201,169,110,.20),transparent 48%),#0b0b0c"></div>
<div class="k" style="position:absolute;left:80px;top:120px">${s.en}</div>
<div class="line" style="top:175px"></div>
<div style="position:absolute;left:80px;top:260px;font-weight:900;font-size:104px;line-height:1.14">갤러리아에<br>처음 열린<br><span class="g">광고 자리</span></div>
<div style="position:absolute;left:80px;top:700px;font-weight:500;font-size:40px;line-height:1.6;color:#d9d4c7">그동안 외부 브랜드에게<br>한 번도 열리지 않았던 자리,<br>그중 가장 좋은 ${s.n} 곳을 소개합니다.</div>
<div style="position:absolute;left:80px;bottom:150px;font-weight:700;font-size:30px;color:#c9a96e">넘겨서 보기 →</div>
<div class="foot"><span>${s.ko}</span><span>THE FIRST SPOTS</span></div>`;

const spot = (s, sp, i) => `<div style="position:absolute;left:0;top:0;width:1080px;height:760px;background:url(${IMG(sp.img)}) center/cover"></div>
<div style="position:absolute;left:0;top:520px;width:1080px;height:240px;background:linear-gradient(transparent,#0b0b0c)"></div>
<div style="position:absolute;left:80px;top:690px;font-weight:900;font-size:120px;line-height:1" class="g">0${i + 1}</div>
<div style="position:absolute;left:80px;top:840px;font-weight:900;font-size:62px;line-height:1.2">${sp.name}</div>
<div class="line" style="top:940px"></div>
<div style="position:absolute;left:80px;right:80px;top:975px;font-weight:500;font-size:40px;line-height:1.55;color:#e8e3d6">${sp.why}</div>
<div style="position:absolute;left:80px;right:80px;top:1135px;font-weight:700;font-size:30px;color:#c9a96e">${sp.fact}</div>
<div class="foot"><span>${s.ko}</span><span>${i + 1} / ${s.spots.length}</span></div>`;

const cta = s => `<div style="position:absolute;inset:0;background:radial-gradient(circle at 20% 85%,rgba(201,169,110,.18),transparent 50%),#0b0b0c"></div>
<div class="k" style="position:absolute;left:80px;top:120px">BY INVITATION</div>
<div class="line" style="top:175px"></div>
<div style="position:absolute;left:80px;top:250px;font-weight:900;font-size:86px;line-height:1.2">자리는 정해져 있고,<br>첫 번째는<br><span class="g">한 번뿐입니다.</span></div>
<div style="position:absolute;left:80px;top:640px;font-weight:500;font-size:42px;line-height:1.6;color:#e8e3d6">이 자리의 <b style="color:#fff">첫 번째 브랜드</b>를 모십니다.<br>계약 전, 실제 자리에 걸린 시안을<br>먼저 보여 드립니다.</div>
<div style="position:absolute;left:80px;bottom:200px">
 <div style="font-weight:700;font-size:30px;color:#bbb">광고 상담</div>
 <div style="font-weight:900;font-size:110px;line-height:1.05" class="g">1599-3611</div>
 <div style="font-weight:700;font-size:32px;color:#d9d4c7;margin-top:14px">DM에 "광고" → 매체 소개서 바로 전송</div>
</div>
<img src="${QR}" style="position:absolute;right:80px;bottom:210px;width:200px;height:200px;border-radius:12px">
<div class="foot"><span>${s.src}</span><span>갤러리아 공식 광고대행사 (주)드림애드컴</span></div>`;

(async () => {
  const out = path.join(__dirname, 'out'); fs.mkdirSync(out, { recursive: true });
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1350 } });
  for (const [key, s] of Object.entries(stores)) {
    const pages = [cover(s), ...s.spots.map((sp, i) => spot(s, sp, i)), cta(s)];
    for (let i = 0; i < pages.length; i++) {
      await p.setContent(`<style>${css}</style>${pages[i]}`); await p.evaluate(() => document.fonts.ready);
      await p.screenshot({ path: path.join(out, `${key}-${i + 1}.jpg`), type: 'jpeg', quality: 90 });
    }
  }
  await b.close(); console.log('ok');
})().catch(e => { console.error(e); process.exit(1); });
