// トップの動画切り替え＋スクロールでふわっと出る動き（トップページ用）
(function () {
  "use strict";
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var saveData = navigator.connection && navigator.connection.saveData;

  // ---- トップの動画：8秒ずつ順番に切り替える（動きを減らす設定・データ節約中は写真のまま）
  var vids = Array.prototype.slice.call(document.querySelectorAll(".hero-media video"));
  if (vids.length && !reduce && !saveData) {
    var cur = 0;
    var load = function (v) { if (!v.src) { v.src = v.getAttribute("data-src"); v.load(); } };
    var show = function (i) {
      var v = vids[i];
      load(v);
      v.currentTime = 0;
      var p = v.play();
      if (p && p.catch) p.catch(function () {});
      vids.forEach(function (o, j) { o.classList.toggle("is-on", j === i); });
      load(vids[(i + 1) % vids.length]); // 次の1本だけ先に読む
    };
    vids.forEach(function (v, i) {
      v.addEventListener("ended", function () { cur = (i + 1) % vids.length; show(cur); });
    });
    document.querySelector(".hero").classList.add("has-video");
    show(0);
  }

  // ---- スクロールでふわっと出る（JSが動かない時は最初から全部見える）
  if (reduce || !("IntersectionObserver" in window)) return;
  document.documentElement.classList.add("motion");
  var sel = ".hero .inner > *, .section .eyebrow, .section h2, .section .lead, .card, .info, " +
            ".band-inner > *, .table-wrap, details.faq, .news-list li, .map-ph";
  var els = Array.prototype.slice.call(document.querySelectorAll(sel));
  els.forEach(function (el) {
    el.classList.add("reveal");
    var sib = el.parentElement ? Array.prototype.indexOf.call(el.parentElement.children, el) : 0;
    el.style.transitionDelay = Math.min(sib, 5) * 90 + "ms"; // 並んだ物は少しずつずらす
  });
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); }
    });
  }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });
  els.forEach(function (el) { io.observe(el); });
})();
