"""드림빌딩 사진·영상에서 상단 '유창시스템' 간판 글자와 1551-0849 번호를 지워 빈 파란 띠로 만든다.

사용법:
  python3 hide_sign.py image <입력.jpg> <출력.jpg>
  python3 hide_sign.py video <입력.mp4> <출력.mp4>   (오디오는 ffmpeg로 따로 붙임)
"""
import sys
import cv2
import numpy as np


def find_band(img):
    """진한 파란 간판 띠(가장 큰 진파랑 영역)의 bbox를 찾는다. 없으면 None."""
    b, g, r = [img[:, :, i].astype(int) for i in range(3)]
    blue = ((b - r) > 40) & ((b - g) > 20) & (r < 70) & (g < 100) & (b > 40) & (b < 170)
    blue = cv2.morphologyEx(blue.astype(np.uint8) * 255, cv2.MORPH_CLOSE, np.ones((9, 9), np.uint8))
    n, _, stats, _ = cv2.connectedComponentsWithStats(blue)
    if n < 2:
        return None
    # 가로로 긴(간판 띠 모양) 덩어리 중 가장 큰 것. 진한 하늘색 덩어리는 모양으로 걸러낸다.
    cands = [s for s in stats[1:] if s[2] >= s[3] * 2 and s[4] >= img.shape[0] * img.shape[1] * 0.002]
    if not cands:
        return None
    x, y, w, h, _ = max(cands, key=lambda s: s[4])
    # 행별 파랑 비율로 실제 띠 높이만 남긴다(아래 회색·현수막으로 번진 부분 제외)
    ratio = blue[y:y + h, x:x + w].mean(axis=1) / 255
    rows = np.where(ratio > 0.2)[0]
    if len(rows) == 0:
        return None
    top, bot = rows[0], rows[0]
    for rr in rows[1:]:
        if rr - bot > 12:
            break
        bot = rr
    return x, y + top, w, bot - top + 1


def clean(img):
    box = find_band(img)
    if box is None:
        return img
    x, y, w, h = box
    out = img.copy()
    f = img.astype(np.float32)
    b, g, r = f[:, :, 0], f[:, :, 1], f[:, :, 2]
    # 칠할 가로 범위: 띠 바로 아래 줄에서 하늘이 아니고(회색 벽) 빨간 테두리도 아닌 열의 가장 긴 구간
    sy0, sy1 = y + h, min(img.shape[0], y + h + max(3, int(h * 0.4)))
    xs0, xs1 = max(0, x - 5), min(img.shape[1], x + w + 5)
    sb, sg, sr = b[sy0:sy1, xs0:xs1], g[sy0:sy1, xs0:xs1], r[sy0:sy1, xs0:xs1]
    sky = ((sb - sr) > 25) & (sb > 185)
    redb = ((sr - sg) > 40) & ((sr - sb) > 30)
    ok = (sky.mean(axis=0) < 0.5) & (redb.mean(axis=0) < 0.8)
    best, cur, bs = (0, 0), 0, 0
    for j, v in enumerate(ok):
        if v:
            if cur == 0:
                bs = j
            cur += 1
            if cur > best[1] - best[0]:
                best = (bs, j + 1)
        else:
            cur = 0
    m = int((best[1] - best[0]) * 0.02) + 2  # 건물 빨간 테두리를 남기기 위한 여백
    x, w = xs0 + best[0] + m, best[1] - best[0] - 2 * m
    if w < 20:
        return img
    # 1) 파란 띠: 글자·로고를 빼고 패널 색만으로 다시 칠한다(행 평균색 + 열 방향 밝기 변화)
    panel = ((b - r) > 30) & ((b - g) > 12) & (r < 80) & (g < 110)
    bb = (slice(y, y + h), slice(x, x + w))
    pm = panel[bb]
    band = f[bb]
    row = np.array([np.median(band[i][pm[i]], axis=0) if pm[i].sum() > 5 else [np.nan] * 3 for i in range(h)])
    good = ~np.isnan(row[:, 0])
    if good.sum() < 2:
        return img
    for c in range(3):
        row[:, c] = np.interp(np.arange(h), np.where(good)[0], row[good, c])
    col_l = np.array([np.median(band[:, j][pm[:, j]].mean(axis=1)) if pm[:, j].sum() > 3 else np.nan for j in range(w)])
    ok = ~np.isnan(col_l)
    if ok.sum() < 2:
        return img
    col_l = np.interp(np.arange(w), np.where(ok)[0], col_l[ok])
    col_l = cv2.GaussianBlur(col_l.reshape(1, -1).astype(np.float32), (0, 0), w / 20).ravel()
    gain = col_l / max(col_l.mean(), 1)
    fill = row[:, None, :] * gain[None, :, None]
    out[bb] = np.clip(fill, 0, 255).astype(np.uint8)
    # 2) 띠 아래 회색 줄의 빨간 전화번호: 같은 줄의 빨갛지 않은 픽셀 평균으로 덮는다
    y2, y3 = y + h, min(img.shape[0], y + h + int(h * 0.4))
    red = ((r - g) > 25) & ((r - b) > 15)
    red = cv2.dilate(red.astype(np.uint8), np.ones((11, 11), np.uint8)).astype(bool)
    for yy in range(y2, y3):
        seg = f[yy, x:x + w]
        m = red[yy, x:x + w]
        if m.any() and (~m).sum() > 5:
            out[yy, x:x + w][m] = np.median(seg[~m], axis=0).astype(np.uint8)
    return out


if __name__ == "__main__":
    mode, src, dst = sys.argv[1:4]
    if mode == "image":
        cv2.imwrite(dst, clean(cv2.imread(src)), [cv2.IMWRITE_JPEG_QUALITY, 92])
    else:
        cap = cv2.VideoCapture(src)
        fps = cap.get(cv2.CAP_PROP_FPS)
        w, h = int(cap.get(3)), int(cap.get(4))
        vw = cv2.VideoWriter(dst, cv2.VideoWriter_fourcc(*"mp4v"), fps, (w, h))
        while True:
            ok, f = cap.read()
            if not ok:
                break
            vw.write(clean(f))
        vw.release()
    print("done", dst)
