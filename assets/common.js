// 共通ヘッダー・フッター・デモ表示リボン（全ページ共通）
(function () {
  "use strict";
  var LOGO =
    '<svg class="mark" viewBox="0 0 40 40" aria-hidden="true">' +
    '<circle cx="20" cy="20" r="19" fill="#4f6b4a"/>' +
    '<path d="M9 27 L20 13 L31 27 Z" fill="#f6f1e9"/>' +
    '<rect x="17" y="21" width="6" height="6" fill="#8a6a48"/>' +
    '<path d="M27 11 q4 2 2 7 q-4 -1 -2 -7z" fill="#cfe0c3"/>' +
    "</svg>";

  var pages = [
    ["index.html", "トップ"],
    ["index.html#rooms", "お部屋・設備"],
    ["index.html#price", "料金"],
    ["booking.html", "予約"],
    ["line-flow.html", "LINEのご案内"],
    ["admin-preview.html", "管理画面のイメージ"]
  ];
  var here = location.pathname.split("/").pop() || "index.html";

  var navItems = pages
    .map(function (p) {
      var cur = p[0] === here ? ' aria-current="page"' : "";
      return '<li><a href="' + p[0] + '"' + cur + ">" + p[1] + "</a></li>";
    })
    .join("");

  var header =
    '<header class="site-header"><div class="container bar">' +
    '<a class="brand" href="index.html">' + LOGO +
    '<span class="name">森ノ音<span class="sub">一棟貸しの宿（架空）</span></span></a>' +
    '<button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav" aria-label="メニューを開く">☰</button>' +
    '<nav class="site-nav" id="site-nav"><ul>' + navItems + "</ul></nav>" +
    "</div></header>";

  var footer =
    '<footer class="site-footer"><div class="container">' +
    '<div class="cols">' +
    "<div><p><strong>森ノ音（もりのね） 一棟貸しの宿</strong></p>" +
    "<p>〒000-0000 架空県 しずく郡 森ノ町 1-2-3<br>2027年 春 開業予定</p>" +
    "<p>旅館業法にもとづく許可を取得予定の施設です。<br>チェックインはすべてオンライン（リモート）で行います。</p></div>" +
    "<div><p><strong>ご案内</strong></p><ul>" +
    '<li><a href="index.html#rooms">お部屋・設備</a></li>' +
    '<li><a href="index.html#price">料金</a></li>' +
    '<li><a href="index.html#access">アクセス</a></li>' +
    '<li><a href="index.html#faq">よくある質問</a></li></ul></div>' +
    "<div><p><strong>ご予約・ご相談</strong></p><ul>" +
    '<li><a href="booking.html">公式サイトで予約</a></li>' +
    '<li><a href="line-flow.html">LINEで相談</a></li>' +
    "<li>予約サイト（一休など）にも掲載予定</li></ul></div>" +
    "</div>" +
    '<p class="note">このサイトは提案用のデモです。施設名・住所・料金はすべて架空のもので、実在の施設とは関係ありません。写真はフリー素材のイメージ写真、ロゴは仮の図形で、あとから差し替えられます。</p>' +
    '<p class="credits">写真の出典：'
    + '外観 Alex Robert／寝室 World Travel Adventures／テラス Sonja Guina（StockSnap・CC0）、'
    + 'キッチン・アプローチ（rawpixel・CC0）、'
    + 'リビング <a href="https://www.flickr.com/photos/25186605@N04/2888118022" rel="noopener">Jeremy Levine Design</a>・'
    + '露天風呂 <a href="https://www.flickr.com/photos/42244487@N04/6435581577" rel="noopener">ThinkGeoEnergy</a>'
    + '（Flickr・<a href="https://creativecommons.org/licenses/by/2.0/" rel="noopener">CC BY 2.0</a>）</p>' +
    "</div></footer>";

  var ribbon = '<div class="demo-ribbon" role="note">デモサイト（架空の施設）</div>';

  var h = document.getElementById("site-header");
  var f = document.getElementById("site-footer");
  if (h) h.outerHTML = header;
  if (f) f.outerHTML = footer;
  document.body.insertAdjacentHTML("beforeend", ribbon);

  var btn = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");
  if (btn && nav) {
    btn.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
      btn.textContent = open ? "×" : "☰";
    });
    nav.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        nav.classList.remove("open");
        btn.setAttribute("aria-expanded", "false");
        btn.textContent = "☰";
      }
    });
  }
})();
