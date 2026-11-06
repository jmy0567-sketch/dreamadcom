#!/bin/bash
# 자리별 릴스 빌드: bash make.sh <key...>  (없으면 전체). 슬라이드 PNG(out/<key>/s*.png) → 천천히 확대되는 컷 → BGM
# BGM: marketing/tools/bgm_synth.py 로 만든 bgm_norm.wav (환경변수 BGM 으로 경로 지정)
set -euo pipefail
cd "$(dirname "$0")"
BGM="${BGM:?BGM 경로를 지정하세요 (bgm_synth.py 출력 wav)}"
rm -rf out && node render.js
keys="$@"; [ -z "$keys" ] && keys=$(python3 -c "import json;print(' '.join(r['key'] for r in json.load(open('series.json'))))")
for k in $keys; do
  d=out/$k; n=$(ls $d/s*.png | wc -l); list=$d/list.txt; : > $list
  for i in $(seq 0 $((n-1))); do
    dur=2.7; [ $i -eq $((n-1)) ] && dur=3.4      # 마지막(전화번호) 컷은 조금 길게
    fr=$(python3 -c "print(int($dur*30))")
    ffmpeg -v error -y -i $d/s$i.png -vf "scale=2160:3840,zoompan=z='min(zoom+0.0006,1.06)':x='iw/2-iw/zoom/2':y='ih/2-ih/zoom/2':d=$fr:s=1080x1920:fps=30,format=yuv420p" -t $dur -c:v libx264 -preset veryfast -crf 20 $d/c$i.mp4
    echo "file 'c$i.mp4'" >> $list
  done
  ffmpeg -v error -y -f concat -safe 0 -i $list -c copy $d/v.mp4
  T=$(ffprobe -v error -show_entries format=duration -of csv=p=0 $d/v.mp4)
  ffmpeg -v error -y -i $d/v.mp4 -i "$BGM" -filter_complex "[1:a]atrim=0:$T,afade=t=in:d=0.6,afade=t=out:st=$(python3 -c "print($T-1.2)"):d=1.2,volume=0.8[a]" -map 0:v -map "[a]" -c:v copy -c:a aac -b:a 160k -shortest $k.mp4
  cp $d/s0.png $k-cover.png
  echo "$k: ${T}s"
done
