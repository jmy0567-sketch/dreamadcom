# 시안 크리에이티브를 진주점 실제 매체 사진에 합성하고 카톡용 1장(1080x1350)으로 묶기: python3 compose_mockups.py
import cv2, json, numpy as np, pathlib
from PIL import Image, ImageDraw, ImageFont
here = pathlib.Path(__file__).parent; img = here.parent / 'proposal' / 'img'; F = here.parent / 'proposal' / 'fonts'
SPOTS = {'led': ('jinju-led.jpg', [(522,372),(975,372),(962,828),(522,825)]),
         'ev':  ('jinju-elevator.jpg', [(510,226),(1007,262),(1043,815),(517,812)])}
def warp(bg_path, quad, cr_path):
    bg = cv2.imread(str(bg_path)); cr = cv2.imread(str(cr_path)); h, w = cr.shape[:2]
    M = cv2.getPerspectiveTransform(np.float32([[0,0],[w,0],[w,h],[0,h]]), np.float32(quad))
    out = cv2.warpPerspective(cr, M, (bg.shape[1], bg.shape[0]))
    mask = cv2.warpPerspective(np.full((h,w),255,np.uint8), M, (bg.shape[1], bg.shape[0]))
    mask = cv2.GaussianBlur(mask, (3,3), 0)[...,None]/255.0
    out = cv2.addWeighted(out, 0.93, np.full_like(out,255), 0.07, 0)  # 화면 발광 느낌
    res = (bg*(1-mask) + out*mask).astype(np.uint8)
    return Image.fromarray(cv2.cvtColor(res, cv2.COLOR_BGR2RGB))
f = lambda n, s: ImageFont.truetype(str(F / n), s)
for L in json.load(open(here / 'leads.json')):
    shots = {k: warp(img / p, q, here / 'mockups' / f'cr-{L["key"]}-{k}.png') for k, (p, q) in SPOTS.items()}
    for k, im in shots.items(): im.save(here / 'mockups' / f'{L["key"]}-{k}.jpg', quality=90)
    W, H = 1080, 1350; c = Image.new('RGB', (W, H), '#0d0f14'); d = ImageDraw.Draw(c)
    d.text((60, 56), '갤러리아백화점 진주점 광고 시안', font=f('Pretendard-Bold.otf', 34), fill='#d7ff3c')
    d.text((60, 104), L['name'], font=f('Pretendard-Black.otf', 58), fill='white')
    tiles = [('서문 출입구 LED 전광판 150×240cm', shots['led']), ('엘리베이터 LCD 1~4호기 · 4개소', shots['ev'])]
    for i, (cap, im) in enumerate(tiles):
        x = 60 + i * 490; t = im.resize((470, 520))
        c.paste(t, (x, 220)); d.text((x, 220 + t.height + 16), cap, font=f('Pretendard-Bold.otf', 26), fill='white')
    y = 220 + 520 + 90
    for line in ['에스컬레이터 LCD 10개소 · 1F/12F 부스(10일) · 우수고객 5만 명 문자도 가능',
                 '이 시안은 무료 예시입니다. 문구·디자인은 원하시는 대로 바꿔 드려요',
                 '광고비는 기간·매체 조합에 따라 협의']:
        d.ellipse((62, y+12, 76, y+26), fill='#d7ff3c'); d.text((92, y), line, font=f('Pretendard-Medium.otf', 28), fill='#e5e7eb'); y += 52
    d.rounded_rectangle((60, H - 200, W - 60, H - 70), 24, fill='#d7ff3c')
    d.text((100, H - 180), '(주)드림애드컴 · 갤러리아 진주점 광고 직접 운영 · 옥외광고 20년', font=f('Pretendard-Bold.otf', 30), fill='#0d0f14')
    d.text((100, H - 135), 'TEL 1599-3611', font=f('Pretendard-Black.otf', 48), fill='#0d0f14')
    d.text((W - 60, 20), '시안(예시)', font=f('Pretendard-Medium.otf', 22), fill='#6b7280', anchor='ra')
    c.save(here / 'mockups' / f'시안_{L["name"].split(" (")[0].replace(" ","_")}.jpg', quality=92)
    print('ok', L['key'])
