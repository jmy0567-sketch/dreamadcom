# 큐레이션 사진 오른쪽 위에 빨간 '광고주 모집' 배지 추가
# 실행: python3 marketing/curation/badge.py  → marketing/curation/badge/{name}.jpg(배지 고정), {name}.gif / {name}.mp4(깜빡임)
import os, subprocess
from PIL import Image, ImageDraw, ImageFont
D = os.path.dirname(os.path.abspath(__file__))
FONT = ImageFont.truetype(os.path.join(D, '..', 'proposal', 'fonts', 'Pretendard-Black.otf'), 64)
NAMES = ['cheonan-1', 'cheonan-2', 'cheonan-3', 'cheonan-4', 'cheonan-5', 'jinju-1', 'jinju-2', 'jinju-3', 'jinju-4']
OUT = os.path.join(D, 'badge'); os.makedirs(OUT, exist_ok=True)

def badge(img, bright=True):
    im = img.copy().convert('RGB'); d = ImageDraw.Draw(im)
    text = '광고주 모집'
    l, t, r, b = d.textbbox((0, 0), text, font=FONT)
    pw, ph = r - l + 84, b - t + 46
    x1, y1 = im.width - 50, 205; x0, y0 = x1 - pw, y1
    # 검은 그림자 + 빨간 배지 + 흰 테두리 (밝을 때) / 어두운 빨강 (꺼질 때)
    d.rounded_rectangle((x0 + 8, y0 + 10, x1 + 8, y0 + ph + 10), 22, fill=(0, 0, 0))
    fill = (230, 0, 18) if bright else (90, 0, 8)
    d.rounded_rectangle((x0, y0, x1, y0 + ph), 22, fill=fill, outline=(255, 255, 255) if bright else (120, 120, 120), width=5)
    tc = (255, 255, 255) if bright else (150, 150, 150)
    d.text((x0 + 42 - l, y0 + 23 - t), text, font=FONT, fill=tc, stroke_width=3, stroke_fill=(0, 0, 0))
    return im

for n in NAMES:
    src = Image.open(os.path.join(D, 'out', n + '.jpg'))
    on, off = badge(src, True), badge(src, False)
    on.save(os.path.join(OUT, n + '.jpg'), quality=90)
    small = [f.resize((540, 675), Image.LANCZOS).quantize(colors=200, dither=Image.FLOYDSTEINBERG) for f in (on, off)]
    small[0].save(os.path.join(OUT, n + '.gif'), save_all=True, append_images=[small[1]], duration=[600, 400], loop=0)
    on.save('/tmp/_on.png'); off.save('/tmp/_off.png')
    # 6초 깜빡임 MP4 (0.6초 켜짐 / 0.4초 꺼짐)
    with open('/tmp/_list.txt', 'w') as f:
        for _ in range(6): f.write("file '/tmp/_on.png'\nduration 0.6\nfile '/tmp/_off.png'\nduration 0.4\n")
        f.write("file '/tmp/_on.png'\n")
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', '/tmp/_list.txt',
                    '-vf', 'fps=30,format=yuv420p', '-c:v', 'libx264', '-movflags', '+faststart', os.path.join(OUT, n + '.mp4')], check=True)
print('ok')
