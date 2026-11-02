"""손으로 든 드림빌딩 영상(38200 계열)에서 '유창시스템' 띠와 1551-0849를 프레임마다 지운다.
기준 프레임의 간판 위치를 템플릿 매칭으로 따라가며 다각형 영역을 패널 색으로 덮는다.

사용법: python3 hide_sign_video.py <입력.mp4> <출력_무음.mp4>
"""
import sys
import cv2
import numpy as np

# 기준 프레임(0.2초) 기준 좌표 (1920x1080)
BAND = np.array([[258, 184], [818, 236], [818, 332], [258, 292]], np.int32)   # 파란 띠
PHONE = np.array([[446, 300], [656, 316], [656, 349], [446, 340]], np.int32)  # 1551-0849
TPL = (230, 160, 860, 380)  # 추적용 템플릿 영역 x0,y0,x1,y1


def fill_poly(frame, poly, keep):
    """poly 안을 같은 행에서 keep 조건을 만족하는 픽셀의 중앙값으로 칠한다."""
    mask = np.zeros(frame.shape[:2], np.uint8)
    cv2.fillPoly(mask, [poly], 255)
    ys, xs = np.where(mask > 0)
    if len(ys) == 0:
        return
    f = frame.astype(np.float32)
    k = keep(f)
    last = None
    for y in range(ys.min(), ys.max() + 1):
        row = mask[y] > 0
        if not row.any():
            continue
        cand = row & k[y]
        if cand.sum() > 5:
            last = np.median(f[y][cand], axis=0)
        if last is not None:
            frame[y][row] = last.astype(np.uint8)


def panel(f):
    b, g, r = f[..., 0], f[..., 1], f[..., 2]
    return ((b - r) > 30) & ((b - g) > 12) & (r < 90) & (g < 120)


def not_red(f):
    b, g, r = f[..., 0], f[..., 1], f[..., 2]
    red = ((r - g) > 25) & ((r - b) > 15)
    return ~cv2.dilate(red.astype(np.uint8), np.ones((9, 9), np.uint8)).astype(bool)


def main(src, dst):
    cap = cv2.VideoCapture(src)
    fps = cap.get(cv2.CAP_PROP_FPS)
    cap.set(cv2.CAP_PROP_POS_MSEC, 200)
    ok, ref = cap.read()
    x0, y0, x1, y1 = TPL
    tpl = cv2.cvtColor(ref[y0:y1, x0:x1], cv2.COLOR_BGR2GRAY)
    cap.set(cv2.CAP_PROP_POS_FRAMES, 0)
    w, h = int(cap.get(3)), int(cap.get(4))
    vw = cv2.VideoWriter(dst, cv2.VideoWriter_fourcc(*"mp4v"), fps, (w, h))
    m = 120
    while True:
        ok, fr = cap.read()
        if not ok:
            break
        gray = cv2.cvtColor(fr, cv2.COLOR_BGR2GRAY)
        sx0, sy0 = max(0, x0 - m), max(0, y0 - m)
        win = gray[sy0:min(h, y1 + m), sx0:min(w, x1 + m)]
        res = cv2.matchTemplate(win, tpl, cv2.TM_CCOEFF_NORMED)
        _, _, _, loc = cv2.minMaxLoc(res)
        d = np.array([sx0 + loc[0] - x0, sy0 + loc[1] - y0])
        # 테두리 안쪽 여백을 조금 넉넉히 줘서 흔들림 잔상을 덮는다
        fill_poly(fr, PHONE + d, not_red)
        fill_poly(fr, BAND + d, panel)
        vw.write(fr)
    vw.release()
    print("done", dst)


if __name__ == "__main__":
    main(*sys.argv[1:3])
