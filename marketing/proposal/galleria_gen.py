# 갤러리아 천안 센터시티·진주점 매체 소개서 HTML 생성: python3 galleria_gen.py
import re, pathlib
here = pathlib.Path(__file__).parent
css = re.search(r'<style>(.*?)</style>', (here / 'dream-building.html').read_text(), re.S).group(1)
css += '.cover{background:#0d0f14 radial-gradient(circle at 80% 20%,rgba(215,255,60,.18),transparent 50%)}.cover:after{display:none}'

STORES = {
 'cheonan': dict(
  name='갤러리아백화점 천안 센터시티', short='천안 센터시티', addr='충남 천안시 서북구 불당동',
  area='천안·아산 생활권', region='천안·아산',
  why=[('01 상권','천안 대표 상권 한가운데','불당·신부동 생활권과 천안아산역·터미널 동선이 만나는 천안 최대 쇼핑 거점입니다.'),
       ('02 소비자','구매력 있는 방문객','백화점을 찾는 가족 단위·직장인 소비자에게 브랜드를 반복 노출합니다.'),
       ('03 신뢰','"백화점에 걸린 브랜드"','지역 1등 쇼핑몰과 같은 자리에 걸리는 것만으로 신뢰가 생깁니다.')],
  targets=[('병원·의원','개원·이전·진료과 추가 3개월 전 노출'),('학원·교육','겨울방학·신학기 모집 시즌 집중'),('분양','천안·아산 신규 단지 모델하우스 유입'),('프랜차이즈·매장','오픈 시즌 지역 인지도 확보')]),
 'jinju': dict(
  name='갤러리아백화점 진주점', short='진주점', addr='경남 진주시 진주대로 1095 (평안동)',
  area='진주·사천·하동 서부경남 생활권', region='진주·서부경남',
  why=[('01 상권','서부경남 대표 백화점','진주·사천·하동 등 서부경남 소비자가 모이는 지역 대표 쇼핑 거점입니다.'),
       ('02 소비자','지역 구매 결정권자','주말 가족 쇼핑객과 지역 직장인에게 반복 노출합니다.'),
       ('03 신뢰','"지역에서 제대로 하는 곳"','백화점에 이름이 걸리면 서부경남에서 믿을 만한 브랜드로 보입니다.')],
  targets=[('병원·의원','진주·사천권 개원·확장 홍보'),('분양','진주 신규 단지·혁신도시 인근 분양'),('지역 기업','기업 이미지·채용 브랜딩'),('학원·교육','방학·신학기 모집 시즌')]),
}

def page(no, body, foot='{name} 옥외광고'):
    return f'<section class="pg"><span class="no">{no:02d}</span>{body}<div class="foot"><span>{foot}</span><span><b>1599-3611</b></span></div></section>'

for key, s in STORES.items():
    P = []
    P.append(f'''<section class="pg cover"><div class="in"><span class="tag">옥외광고 매체 소개서</span>
<h1>{s["name"].replace("갤러리아백화점 ","갤러리아백화점<br><em>")}</em><br>옥외광고</h1><p>{s["addr"]} · {s["area"]}</p></div>
<div class="foot"><span>(주)드림애드컴</span><span>대표번호 <b>1599-3611</b> · 천안시 서북구 불당34길 3-16 · ad3611@naver.com</span></div></section>''')
    cards = ''.join(f'<div class="card"><span class="n">{n}</span><h3>{h}</h3><p>{p}</p></div>' for n, h, p in s['why'])
    P.append(page(2, f'<span class="kick">WHY</span><h2>{s["short"]} 매체를 <em>선택해야 하는 이유</em></h2><div class="grid3">{cards}</div>'))
    tg = ''.join(f'<div class="card"><h3 style="font-size:28px">{a}</h3><p>{b}</p></div>' for a, b in s['targets'])
    P.append(page(3, f'<span class="kick">FOR WHOM</span><h2>{s["region"]}에서 <em>이런 광고주</em>가 효과를 봅니다</h2><div class="grid3" style="grid-template-columns:repeat(2,1fr)">{tg}</div>'))
    P.append(page(4, f'''<span class="kick">MEDIA</span><h2>매체 개요</h2>
<table><tr><th>매체</th><td>{s["name"]} 옥외광고</td></tr><tr><th>위치</th><td>{s["addr"]}</td></tr>
<tr><th>운영</th><td>(주)드림애드컴 직접 운영 · 대행 수수료 없음</td></tr>
<tr><th>규격·광고면</th><td>상담 시 현장 사진과 함께 안내</td></tr><tr><th>광고료</th><td>기간·면에 따라 맞춤 견적 (VAT 별도)</td></tr>
<tr><th>제작·시공</th><td>시안 → 출력 → 시공 → 게시 사진 보고까지 일괄 진행</td></tr></table>
<p class="note">잔여 일정과 정확한 규격·광고료는 1599-3611로 문의하시면 당일 안내합니다.</p>'''))
    P.append(page(5, f'''<span class="kick">LAUNCH OFFER</span><h2>첫 광고주 특가 <em>· 선착순 1곳</em></h2>
<p class="lead">2026년 11월 30일까지 계약하시는 첫 광고주 한 곳에 적용합니다.</p>
<table><tr><th style="width:240px">구분</th><td style="color:#6b7280">기본 조건</td><td style="color:#2d5bd7">첫 광고주 특가</td></tr>
<tr><th>계약 기간</th><td>장기 계약</td><td><span class="hl">3개월부터</span></td></tr>
<tr><th>첫 달 광고비</th><td>정상가</td><td><span class="hl">50% 할인</span></td></tr>
<tr><th>제작비</th><td>실비</td><td><span class="hl">50% 지원</span></td></tr>
<tr><th>시안</th><td>계약 후 제작</td><td><span class="hl">계약 전 무료 시안</span></td></tr></table>
<p class="note">※ 둘째 달부터는 정상 광고비가 적용됩니다. VAT 별도. 한 곳이 계약하면 특가는 마감됩니다.</p>'''))
    P.append(page(6, '''<span class="kick">PROCESS</span><h2>상담부터 게시까지 <em>드림애드컴이 직접</em></h2>
<div class="steps"><div class="step"><b>STEP 1</b><h4>상담</h4><p>희망 기간·업종을 알려 주시면 잔여 일정과 조건을 안내합니다.</p></div>
<div class="step"><b>STEP 2</b><h4>무료 시안</h4><p>로고와 문구만 주시면 매체에 맞춘 시안을 먼저 보여드립니다.</p></div>
<div class="step"><b>STEP 3</b><h4>계약</h4><p>기간 확정, 세금계산서 발행.</p></div>
<div class="step"><b>STEP 4</b><h4>제작·시공</h4><p>출력과 시공을 직접 진행합니다.</p></div>
<div class="step"><b>STEP 5</b><h4>게시 보고</h4><p>게시 사진으로 결과를 보고합니다.</p></div></div>
<div class="card" style="margin-top:28px"><span class="n">함께 쓰면 좋은 매체</span><p style="margin-top:8px">경부고속도로변 드림빌딩 벽면 · LED 홍보차 · LED 스크린을 묶은 통합 캠페인도 제안해 드립니다.</p></div>
<div class="cta"><span class="t">잔여 일정은 전화 한 통이면 바로 안내합니다</span><span class="tel">1599-3611</span></div>''', foot='(주)드림애드컴 · ad3611@naver.com'))
    html = f'<!doctype html><html lang="ko"><head><meta charset="utf-8"><title>{s["name"]} 옥외광고 매체 소개서</title><style>{css}</style></head><body>' + ''.join(P).replace('{name}', s['name']) + '</body></html>'
    (here / f'galleria-{key}.html').write_text(html)
    print('wrote', key)
