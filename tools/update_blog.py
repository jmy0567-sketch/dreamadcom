"""네이버 블로그(dreamadcom_) 최신 LED 차량 글을 홈페이지에 넣는다.
<!--BLOG-START--> ~ <!--BLOG-END--> 사이를 새 목록으로 바꾼다. GitHub Actions가 매일 돌린다.
사용: python tools/update_blog.py [사이트 폴더]"""
import html
import re
import sys
import urllib.request
import xml.etree.ElementTree as ET
from email.utils import parsedate_to_datetime
from pathlib import Path

ROOT = Path(sys.argv[1] if len(sys.argv) > 1 else ".")
RSS = "https://rss.blog.naver.com/dreamadcom_.xml"
# LED 차량·스크린 글만 (택배차·갤러리아 등 다른 매체 글은 뺀다)
KEEP = re.compile(r"LED|시위|유세|선거|전광판 차량|스크린|홍보차")
SKIP_CAT = re.compile(r"택배|갤러리아|버스|엘리베이터|문자|비즈챗|이마트|방송")
TARGETS = {"index.html": 6, "cases.html": 9}


def fetch():
    req = urllib.request.Request(RSS, headers={"User-Agent": "Mozilla/5.0"})
    root = ET.fromstring(urllib.request.urlopen(req, timeout=30).read())
    posts = []
    for it in root.iter("item"):
        title = (it.findtext("title") or "").strip()
        cat = (it.findtext("category") or "").replace("\xa0", " ")
        if SKIP_CAT.search(cat) or not (KEEP.search(cat) or KEEP.search(title)):
            continue
        link = re.sub(r"\?.*", "", it.findtext("link") or "")
        d = parsedate_to_datetime(it.findtext("pubDate"))
        posts.append((d, title, link))
    return posts


def block(posts):
    li = "\n".join(
        f'        <a class="blog-item" href="{html.escape(l)}" target="_blank" rel="noopener">'
        f'<span class="blog-date">{d:%Y.%m.%d}</span><span class="blog-title">{html.escape(t)}</span></a>'
        for d, t, l in posts)
    return f'<!--BLOG-START-->\n      <div class="blog-list reveal">\n{li}\n      </div>\n      <!--BLOG-END-->'


def main():
    posts = fetch()
    if not posts:
        print("no posts, skip"); return
    for name, n in TARGETS.items():
        f = ROOT / name
        if not f.exists():
            continue
        t = f.read_text(encoding="utf-8")
        new = re.sub(r"<!--BLOG-START-->.*?<!--BLOG-END-->", lambda m: block(posts[:n]), t, flags=re.S)
        if new != t:
            f.write_text(new, encoding="utf-8", newline="\n")
            print("updated", name)


if __name__ == "__main__":
    main()
