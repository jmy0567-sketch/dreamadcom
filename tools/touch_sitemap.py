# 블로그 반영으로 바뀐 index·cases의 sitemap lastmod를 오늘(KST)로 바꾼다
import datetime, re, subprocess, sys
from pathlib import Path
root = Path(sys.argv[1] if len(sys.argv) > 1 else '.')
sm = root / 'sitemap.xml'
changed = subprocess.run(['git', 'diff', '--name-only', '--', 'index.html', 'cases.html'], cwd=root, capture_output=True, text=True).stdout.split()
if not changed or not sm.exists():
    sys.exit(0)
today = (datetime.datetime.utcnow() + datetime.timedelta(hours=9)).strftime('%Y-%m-%d')
t = sm.read_text(encoding='utf-8')
for name in changed:
    loc = 'dreamadcom/' + ('' if name == 'index.html' else name)
    t = re.sub(r'(<loc>[^<]*' + re.escape(loc) + r'</loc>\s*<lastmod>)[^<]*(</lastmod>)', lambda m: m.group(1) + today + m.group(2), t)
sm.write_text(t, encoding='utf-8', newline='\n')
print('sitemap lastmod', today, changed)
