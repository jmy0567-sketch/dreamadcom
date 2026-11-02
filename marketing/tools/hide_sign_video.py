"""손으로 든 드림빌딩 영상(38200 계열)에서 '유창시스템' 띠와 1551-0849를 프레임마다 지운다.
기준 프레임의 간판 위치를 템플릿 매칭으로 따라가며 다각형 영역을 패널 색으로 덮는다.

사용법: python3 hide_sign_video.py <입력.mp4> <출력_무음.mp4> <fence|road>
"""
import sys
import cv2
import numpy as np

# 영상별 구간 설정: (시작초, 끝초, 기준초, 파란 띠 다각형, 전화번호 다각형, 추적 템플릿 x0,y0,x1,y1) — 1920x1080 기준
CLIPS = {
    # 38200: 도로 옆 펜스 쪽, 손에 들고 촬영 (하행면)
    "fence": [(0, 99, 0.2,
               [[258, 184], [818, 236], [818, 332], [258, 292]],
               [[446, 300], [656, 316], [656, 349], [446, 340]],
               (230, 160, 860, 380))],
    # 38193: 반대쪽(진입로) 구도, 중간에 줌이 바뀌어 두 구간 (상행면)
    "road": [(0, None, 2.0,
              [[1002, 154], [1742, 112], [1742, 252], [1002, 290]],
              [[1225, 262], [1505, 256], [1505, 314], [1225, 320]],
              (970, 90, 1780, 340)),
             (None, 99, 10.0,
              [[991, 289], [1449, 253], [1449, 349], [991, 371]],
              [[1125, 352], [1300, 346], [1300, 386], [1125, 390]],
              (960, 230, 1480, 410))],
}


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


def find_cut(src):
    """줌이 바뀌는 지점(연속 프레임 차이가 가장 큰 곳)을 초 단위로 찾는다."""
    cap = cv2.VideoCapture(src)
    fps = cap.get(cv2.CAP_PROP_FPS)
    prev, best, bi, i = None, 0, 0, 0
    while True:
        ok, f = cap.read()
        if not ok:
            break
        g = cv2.resize(cv2.cvtColor(f, cv2.COLOR_BGR2GRAY), (192, 108)).astype(np.float32)
        if prev is not None:
            d = np.abs(g - prev).mean()
            if d > best:
                best, bi = d, i
        prev, i = g, i + 1
    return bi / fps


def load_ref(src, t, box):
    cap = cv2.VideoCapture(src)
    cap.set(cv2.CAP_PROP_POS_MSEC, t * 1000)
    ok, ref = cap.read()
    x0, y0, x1, y1 = box
    return cv2.cvtColor(ref[y0:y1, x0:x1], cv2.COLOR_BGR2GRAY)


def main(src, dst, kind):
    segs = CLIPS[kind]
    if len(segs) > 1:
        cut = find_cut(src)
        print("cut at", round(cut, 2))
        segs = [(s0 if s0 is not None else cut, s1 if s1 is not None else cut, *rest) for s0, s1, *rest in segs]
    refs = [load_ref(src, sg[2], sg[5]) for sg in segs]
    cap = cv2.VideoCapture(src)
    fps = cap.get(cv2.CAP_PROP_FPS)
    w, h = int(cap.get(3)), int(cap.get(4))
    vw = cv2.VideoWriter(dst, cv2.VideoWriter_fourcc(*"mp4v"), fps, (w, h))
    m, i = 120, 0
    while True:
        ok, fr = cap.read()
        if not ok:
            break
        t = i / fps
        i += 1
        k = next((j for j, sg in enumerate(segs) if sg[0] <= t < sg[1]), len(segs) - 1)
        _, _, _, band, phone, (x0, y0, x1, y1) = segs[k]
        gray = cv2.cvtColor(fr, cv2.COLOR_BGR2GRAY)
        sx0, sy0 = max(0, x0 - m), max(0, y0 - m)
        win = gray[sy0:min(h, y1 + m), sx0:min(w, x1 + m)]
        res = cv2.matchTemplate(win, refs[k], cv2.TM_CCOEFF_NORMED)
        _, _, _, loc = cv2.minMaxLoc(res)
        d = np.array([sx0 + loc[0] - x0, sy0 + loc[1] - y0])
        fill_poly(fr, np.array(phone, np.int32) + d, not_red)
        fill_poly(fr, np.array(band, np.int32) + d, panel)
        vw.write(fr)
    vw.release()
    print("done", dst)


if __name__ == "__main__":
    main(*sys.argv[1:4])
