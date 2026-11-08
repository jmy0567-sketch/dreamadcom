import cv2, numpy as np, sys
ad = cv2.imread('../../house-ads/cheonan-ev-lcd.png')
h, w = ad.shape[:2]
src = np.float32([[0,0],[w,0],[w,h],[0,h]])
jobs = {
 'ev-far':  [[338,220],[502,222],[500,507],[337,506]],
 'ev-near': [[149,19],[594,21],[590,797],[143,797]],
}
for name, q in jobs.items():
    base = cv2.imread(f'img/{name}-orig.jpg')
    H, W = base.shape[:2]
    M = cv2.getPerspectiveTransform(src, np.float32(q))
    warped = cv2.warpPerspective(ad, M, (W, H), flags=cv2.INTER_AREA)
    mask = cv2.warpPerspective(np.full((h,w),255,np.uint8), M, (W, H))
    mask = cv2.GaussianBlur(mask, (3,3), 0).astype(np.float32)/255
    # keep a little of the original glass reflection for realism
    gray = cv2.cvtColor(base, cv2.COLOR_BGR2GRAY).astype(np.float32)
    glare = np.zeros_like(gray)[...,None]
    out = warped.astype(np.float32)*(1-glare) + 255*glare
    res = base.astype(np.float32)*(1-mask[...,None]) + out*mask[...,None]
    cv2.imwrite(f'img/{name}.jpg', np.clip(res,0,255).astype(np.uint8), [cv2.IMWRITE_JPEG_QUALITY, 94])
print('ok')
