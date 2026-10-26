/* 드림애드컴 공통 스크립트: 헤더·푸터, 메뉴, 히어로 슬라이드, 갤러리 필터, 라이트박스 */
(function () {
  document.documentElement.classList.add("js");
  var TEL = "1599-3611";
  var TEL_LINK = "tel:15993611";
  var ICON_PHONE = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.6a1 1 0 0 1-.25 1z"/></svg>';
  var ICON_MSG = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M4 4h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H8l-4 4V6a2 2 0 0 1 2-2z"/></svg>';

  var page = document.body.getAttribute("data-page") || "home";
  var nav = [
    ["promo.html", "LED 홍보차", "promo"],
    ["election.html", "선거 유세차", "election"],
    ["protest.html", "LED 시위차", "protest"],
    ["screen.html", "LED 스크린 대여", "screen"],
    ["index.html#cases", "현장 사례", "cases"],
    ["index.html#contact", "견적 문의", "contact"]
  ];

  var header = document.getElementById("site-header");
  if (header) {
    header.className = "site-header";
    header.innerHTML =
      '<div class="wrap">' +
      '<a class="logo" href="index.html"><span class="logo-mark">D</span><span>드림애드컴<small>LED 홍보차 · LED 스크린</small></span></a>' +
      '<nav class="nav" id="nav">' +
      nav.map(function (n) { return '<a href="' + n[0] + '"' + (n[2] === page ? ' class="active"' : "") + ">" + n[1] + "</a>"; }).join("") +
      "</nav>" +
      '<a class="header-call" href="' + TEL_LINK + '">' + ICON_PHONE.replace("<svg", '<svg width="18" height="18"') + " " + TEL + "</a>" +
      '<button class="menu-btn" aria-label="메뉴 열기" id="menu-btn"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg></button>' +
      "</div>";
    var btn = document.getElementById("menu-btn");
    var navEl = document.getElementById("nav");
    btn.addEventListener("click", function () { navEl.classList.toggle("open"); });
    navEl.addEventListener("click", function (e) { if (e.target.tagName === "A") navEl.classList.remove("open"); });
  }

  var footer = document.getElementById("site-footer");
  if (footer) {
    footer.className = "site-footer";
    footer.innerHTML =
      '<div class="wrap">' +
      '<div><a class="logo" href="index.html" style="color:#fff;margin-bottom:14px"><span class="logo-mark">D</span><span>(주)드림애드컴</span></a>' +
      "<p>LED 홍보차 · 선거 유세차 · LED 시위차 제작·임대<br>실내외 LED 스크린 대여·설치<br>천안 자사 공장 직영 · 전국(제주 포함) 배차</p></div>" +
      '<div><h4>상담 · 견적</h4><ul>' +
      '<li>대표전화 <a href="' + TEL_LINK + '" style="color:#d7ff3c;font-weight:800">' + TEL + "</a></li>" +
      '<li>이메일 <a href="mailto:ad3611@naver.com">ad3611@naver.com</a></li>' +
      '<li><a href="https://blog.naver.com/dreamadcom_" target="_blank" rel="noopener">네이버 블로그 (현장 소식)</a></li>' +
      "</ul></div>" +
      "<div><h4>찾아오시는 길</h4><ul>" +
      "<li><b style=\"color:#cfd4dd\">본사</b> 충남 천안시 서북구 불당34길 3-16</li>" +
      "<li><b style=\"color:#cfd4dd\">공장</b> 충남 천안시 서북구 입장면 홍천길 127</li>" +
      "</ul></div>" +
      '<p class="copy">(주)드림애드컴은 특정 정당을 지지하지 않습니다. 선거 차량 사진은 2014년부터 진행한 유세 차량 렌털 포트폴리오입니다.<br>© ' + new Date().getFullYear() + " DreamAdcom. All rights reserved.</p>" +
      "</div>";
  }

  // 모바일 하단 고정 바 + 데스크톱 플로팅 전화 버튼
  var bar = document.createElement("div");
  bar.className = "mobile-bar";
  bar.innerHTML =
    '<a class="m-call" href="' + TEL_LINK + '">' + ICON_PHONE + " 전화 상담 " + TEL + "</a>" +
    '<a class="m-sms" href="sms:15993611">' + ICON_MSG + " 문자 문의</a>";
  document.body.appendChild(bar);
  var fl = document.createElement("a");
  fl.className = "float-call";
  fl.href = TEL_LINK;
  fl.innerHTML = ICON_PHONE + " " + TEL;
  document.body.appendChild(fl);

  // 히어로 슬라이드
  var slides = document.querySelectorAll(".hero-slides img");
  if (slides.length > 1) {
    var dots = document.querySelector(".hero-dots");
    var cur = 0, timer;
    slides.forEach(function (s, i) {
      var d = document.createElement("button");
      d.setAttribute("aria-label", (i + 1) + "번 사진");
      d.addEventListener("click", function () { go(i); restart(); });
      dots && dots.appendChild(d);
    });
    function go(i) {
      slides[cur].classList.remove("on");
      dots && dots.children[cur].classList.remove("on");
      cur = i;
      slides[cur].classList.add("on");
      dots && dots.children[cur].classList.add("on");
    }
    function restart() { clearInterval(timer); timer = setInterval(function () { go((cur + 1) % slides.length); }, 5500); }
    slides[0].classList.add("on");
    dots && dots.children[0].classList.add("on");
    restart();
  } else if (slides.length === 1) {
    slides[0].classList.add("on");
  }

  // 갤러리 필터
  document.querySelectorAll("[data-filter-for]").forEach(function (group) {
    var target = document.getElementById(group.getAttribute("data-filter-for"));
    group.addEventListener("click", function (e) {
      var b = e.target.closest("button");
      if (!b) return;
      group.querySelectorAll("button").forEach(function (x) { x.classList.toggle("on", x === b); });
      var f = b.getAttribute("data-f");
      target.querySelectorAll("figure").forEach(function (fig) {
        fig.classList.toggle("hide", f !== "all" && fig.getAttribute("data-cat") !== f);
      });
    });
  });

  // 라이트박스
  var lb = document.createElement("div");
  lb.className = "lightbox";
  lb.innerHTML = '<button class="lb-btn lb-close" aria-label="닫기">×</button><button class="lb-btn lb-prev" aria-label="이전">‹</button><img alt=""><p></p><button class="lb-btn lb-next" aria-label="다음">›</button>';
  document.body.appendChild(lb);
  var lbImg = lb.querySelector("img"), lbCap = lb.querySelector("p"), list = [], idx = 0;
  function show(i) {
    idx = (i + list.length) % list.length;
    var fig = list[idx];
    lbImg.src = fig.querySelector("img").src;
    lbImg.alt = fig.querySelector("img").alt;
    var c = fig.querySelector("figcaption");
    lbCap.textContent = c ? c.textContent : "";
  }
  document.addEventListener("click", function (e) {
    var fig = e.target.closest(".gallery figure");
    if (!fig) return;
    list = Array.prototype.filter.call(fig.parentNode.querySelectorAll("figure"), function (f) { return !f.classList.contains("hide"); });
    show(list.indexOf(fig));
    lb.classList.add("open");
  });
  lb.addEventListener("click", function (e) {
    if (e.target.classList.contains("lb-prev")) show(idx - 1);
    else if (e.target.classList.contains("lb-next")) show(idx + 1);
    else if (e.target === lb || e.target.classList.contains("lb-close")) lb.classList.remove("open");
  });
  document.addEventListener("keydown", function (e) {
    if (!lb.classList.contains("open")) return;
    if (e.key === "Escape") lb.classList.remove("open");
    if (e.key === "ArrowLeft") show(idx - 1);
    if (e.key === "ArrowRight") show(idx + 1);
  });

  // 스크롤 등장 효과
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
    }, { threshold: 0.12 });
    document.querySelectorAll(".reveal").forEach(function (el) { io.observe(el); });
  } else {
    document.querySelectorAll(".reveal").forEach(function (el) { el.classList.add("in"); });
  }
})();
