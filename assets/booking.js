// 予約フローのデモ（架空の空室・料金。送信や決済は一切行わない）
(function () {
  "use strict";
  var BASE_WEEKDAY = 38000, BASE_HOLIDAY_EVE = 52000, ADULT = 6000, KID = 3000, MAX_GUESTS = 8, MAX_NIGHTS = 7;
  var FIRST = new Date(2027, 3, 1); // 2027年4月（開業予定の春）
  var MONTHS = 3;
  var view = 0; // 表示中の月（0〜2）
  var checkIn = null, checkOut = null;

  function $(id) { return document.getElementById(id); }
  function yen(n) { return n.toLocaleString("ja-JP") + "円"; }
  function key(d) { return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate(); }
  function addDays(d, n) { var x = new Date(d); x.setDate(x.getDate() + n); return x; }
  function fmt(d) { return (d.getMonth() + 1) + "月" + d.getDate() + "日（" + "日月火水木金土"[d.getDay()] + "）"; }
  function isEve(d) { return d.getDay() === 5 || d.getDay() === 6; } // 金・土の夜を休前日として扱う
  function nightPrice(d) { return isEve(d) ? BASE_HOLIDAY_EVE : BASE_WEEKDAY; }

  // デモ用の満室日（決め打ち）
  var FULL = {};
  ["2027-4-2", "2027-4-3", "2027-4-10", "2027-4-17", "2027-4-24", "2027-4-28", "2027-4-29", "2027-4-30",
   "2027-5-1", "2027-5-2", "2027-5-3", "2027-5-4", "2027-5-8", "2027-5-15", "2027-5-22", "2027-5-29",
   "2027-6-5", "2027-6-12", "2027-6-19", "2027-6-26"].forEach(function (k) { FULL[k] = true; });
  function isFull(d) { return !!FULL[key(d)]; }

  function rangeHasFull(a, b) {
    for (var d = new Date(a); d < b; d = addDays(d, 1)) if (isFull(d)) return true;
    return false;
  }

  function renderCal() {
    var first = new Date(FIRST.getFullYear(), FIRST.getMonth() + view, 1);
    $("calTitle").textContent = first.getFullYear() + "年 " + (first.getMonth() + 1) + "月";
    $("prevM").disabled = view === 0;
    $("nextM").disabled = view === MONTHS - 1;
    var html = "";
    "日月火水木金土".split("").forEach(function (w, i) {
      html += '<div class="dow' + (i === 0 ? " sun" : i === 6 ? " sat" : "") + '">' + w + "</div>";
    });
    for (var i = 0; i < first.getDay(); i++) html += '<button class="day past" type="button" tabindex="-1" aria-hidden="true"></button>';
    var days = new Date(first.getFullYear(), first.getMonth() + 1, 0).getDate();
    for (var dd = 1; dd <= days; dd++) {
      var d = new Date(first.getFullYear(), first.getMonth(), dd);
      var cls = "day", label, sub;
      if (isFull(d)) { cls += " full"; sub = "満"; label = fmt(d) + " 満室"; }
      else { sub = (nightPrice(d) / 10000).toFixed(1) + "万"; label = fmt(d) + " 空室 " + yen(nightPrice(d)); }
      if (checkIn && key(d) === key(checkIn)) cls += " sel";
      if (checkOut && key(d) === key(checkOut)) cls += " sel";
      if (checkIn && checkOut && d > checkIn && d < checkOut) cls += " in-range";
      html += '<button class="' + cls + '" type="button" data-d="' + d.getTime() + '" aria-label="' + label + '">' +
        dd + "<small>" + sub + "</small></button>";
    }
    $("cal").innerHTML = html;
  }

  function onDay(d) {
    if (!checkIn || checkOut) {
      if (isFull(d)) return toastMsg("この日は満室です");
      checkIn = d; checkOut = null;
    } else {
      if (d <= checkIn) { if (isFull(d)) return toastMsg("この日は満室です"); checkIn = d; }
      else if (rangeHasFull(checkIn, d)) { toastMsg("途中に満室の日があります"); }
      else if ((d - checkIn) / 864e5 > MAX_NIGHTS) { toastMsg("デモでは" + MAX_NIGHTS + "泊までです"); }
      else checkOut = d; // チェックアウト日は満室でも可（その夜は泊まらない）
    }
    renderCal(); updateSummary();
  }

  function nights() { return checkIn && checkOut ? Math.round((checkOut - checkIn) / 864e5) : 0; }

  function fillSelect(id, from, to, def) {
    var s = $(id), h = "";
    for (var i = from; i <= to; i++) h += '<option value="' + i + '"' + (i === def ? " selected" : "") + ">" + i + "名</option>";
    s.innerHTML = h;
  }

  function guests() { return { a: +$("adults").value, k: +$("kids").value, i: +$("infants").value }; }

  function updateSummary() {
    var g = guests(), ok = true, msg;
    if (!checkIn) msg = "日程を選んでください";
    else if (!checkOut) msg = "チェックイン：" + fmt(checkIn) + "<br>次にチェックアウト日を選んでください";
    else msg = "チェックイン：" + fmt(checkIn) + "<br>チェックアウト：" + fmt(checkOut) + "<br>" + nights() + "泊";
    if (g.a + g.k > MAX_GUESTS) { msg += '<br><span style="color:#a7432f">大人と小学生で8名までです</span>'; ok = false; }
    $("dateSummary").innerHTML = msg;
    $("to2").disabled = !(checkIn && checkOut && ok);
  }

  function calc() {
    var g = guests(), plan = +document.querySelector('input[name="plan"]:checked').value;
    var rows = [], base = 0, total = 0, n = nights();
    for (var d = new Date(checkIn); d < checkOut; d = addDays(d, 1)) base += nightPrice(d);
    rows.push(["1棟の基本料金（" + n + "泊）", base]);
    if (g.a) rows.push(["大人 " + g.a + "名 × " + n + "泊", g.a * ADULT * n]);
    if (g.k) rows.push(["小学生 " + g.k + "名 × " + n + "泊", g.k * KID * n]);
    if (g.i) rows.push(["未就学児 " + g.i + "名", 0]);
    if (plan) rows.push(["プラン追加 " + (g.a + g.k) + "名 × " + n + "泊", plan * (g.a + g.k) * n]);
    rows.forEach(function (r) { total += r[1]; });
    return { rows: rows, total: total };
  }

  function renderPrice() {
    var c = calc();
    $("priceList").innerHTML = c.rows.map(function (r) { return "<dt>" + r[0] + "</dt><dd>" + yen(r[1]) + "</dd>"; }).join("");
    $("totalPrice").textContent = yen(c.total);
    $("payTotal").textContent = yen(c.total);
  }

  function go(step) {
    ["step1", "step2", "step3", "done"].forEach(function (id, i) { $(id).hidden = i + 1 !== step; });
    var lis = $("steps").children;
    for (var i = 0; i < lis.length; i++) {
      lis[i].className = i + 1 < step ? "done" : i + 1 === step ? "active" : "";
    }
    $("steps").style.display = step === 4 ? "none" : "";
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  var toastEl;
  function toastMsg(t) {
    if (!toastEl) { toastEl = document.createElement("div"); toastEl.className = "toast"; toastEl.setAttribute("role", "status"); document.body.appendChild(toastEl); }
    toastEl.textContent = t; toastEl.classList.add("show");
    clearTimeout(toastEl._t); toastEl._t = setTimeout(function () { toastEl.classList.remove("show"); }, 1800);
  }

  // 初期化
  fillSelect("adults", 1, 8, 2); fillSelect("kids", 0, 7, 0); fillSelect("infants", 0, 4, 0);
  renderCal(); updateSummary();

  $("cal").addEventListener("click", function (e) {
    var b = e.target.closest("button.day");
    if (b && b.dataset.d) onDay(new Date(+b.dataset.d));
  });
  $("prevM").addEventListener("click", function () { if (view > 0) { view--; renderCal(); } });
  $("nextM").addEventListener("click", function () { if (view < MONTHS - 1) { view++; renderCal(); } });
  ["adults", "kids", "infants"].forEach(function (id) { $(id).addEventListener("change", updateSummary); });
  $("to2").addEventListener("click", function () { renderPrice(); go(2); });
  document.querySelectorAll('input[name="plan"]').forEach(function (r) { r.addEventListener("change", renderPrice); });
  $("to3").addEventListener("click", function () { renderPrice(); go(3); });
  document.querySelectorAll("[data-back]").forEach(function (b) { b.addEventListener("click", function () { go(+b.dataset.back); }); });

  $("payForm").addEventListener("submit", function (e) {
    e.preventDefault();
    if (!$("nm").value.trim()) { toastMsg("お名前を入力してください（架空の名前で大丈夫です）"); $("nm").focus(); return; }
    var g = guests(), c = calc();
    $("resNo").textContent = "DEMO-" + String(Math.floor(Math.random() * 90000) + 10000);
    $("doneSummary").innerHTML =
      "<dl><dt>日程</dt><dd>" + fmt(checkIn) + "〜" + fmt(checkOut) + "（" + nights() + "泊）</dd>" +
      "<dt>人数</dt><dd>大人" + g.a + "名・小学生" + g.k + "名・未就学児" + g.i + "名</dd>" +
      "<dt>お支払い</dt><dd>" + yen(c.total) + "（デモ）</dd></dl>";
    go(4);
  });
})();
