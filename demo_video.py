"""見本動画（asset-library 用）。出力は ~/projects/asset-library/_videos/7-x146-lodging-site-booking.mp4。サンドボックスの外で実行。
架空の施設（森ノ音）のデモ。公式サイト→空室カレンダー→支払い（模擬）→LINE自動案内→管理画面。"""
import os
import pathlib
import sys

sys.path.insert(0, os.path.expanduser("~/projects/asset-library/tools"))
from demo_rec import recorder  # noqa: E402

HERE = pathlib.Path(__file__).parent.resolve()
U = lambda name: (HERE / name).as_uri()  # noqa: E731


def scroll(p, dy, ms=1400):
    p.mouse.move(640, 400)
    p.mouse.wheel(0, dy)
    p.wait_for_timeout(ms)


with recorder("7-x146-lodging-site-booking", "宿泊施設の公式サイト＋予約導線＋LINE自動案内") as (p, cap):
    p.goto(U("index.html"))
    p.wait_for_load_state("load")
    cap("トップは実写の映像と写真で、高級感のある公式サイト", 3600)
    scroll(p, 900)
    cap("スクロールに合わせて客室・設備の写真が現れます", 3000)
    scroll(p, 1100)
    cap("料金・アクセス・よくある質問まで1ページで案内", 2800)
    p.goto(U("booking.html"))
    p.wait_for_selector("#cal button.day[data-d]")
    cap("予約ページ：空室カレンダーに1泊ごとの料金を表示", 3000)
    p.click("#nextM")
    p.wait_for_timeout(400)
    days = p.locator("#cal button.day:not(.past):not(.full)")
    for i in range(days.count() - 2):
        p.locator("#cal button.day:not(.past):not(.full)").nth(i).click()
        p.locator("#cal button.day:not(.past):not(.full)").nth(i + 2).click()
        p.wait_for_timeout(200)
        if p.locator("#to2").is_enabled():
            break
    cap("チェックイン・チェックアウトを選び、人数を入れるだけ", 2800)
    p.click("#to2")
    p.wait_for_timeout(600)
    cap("プランを選ぶと、料金の内訳と合計を自動計算", 3000)
    p.click("#to3")
    p.wait_for_timeout(600)
    p.fill("#nm", "甲野 太郎")
    p.fill("#em", "demo@example.invalid")
    p.fill("#tel", "000-0000-0000")
    cap("お支払い画面（デモではカード決済は模擬）", 2600)
    p.click("#payForm button[type=submit]")
    p.wait_for_selector("#done:not([hidden])")
    cap("予約番号つきで受付完了", 2600)
    p.goto(U("line-flow.html"))
    p.wait_for_selector("#nextMsg")
    cap("予約の後は、LINEで自動案内（前日の道案内・チェックイン方法など）", 3000)
    for _ in range(3):
        p.click("#nextMsg")
        p.wait_for_timeout(900)
    cap("案内は日程に合わせて自動で送られます", 2400)
    p.goto(U("admin-preview.html"))
    p.wait_for_timeout(600)
    cap("管理画面：料金・写真・よくある質問・ブログを施設側で更新", 3000)
    p.click("[data-p=photo]")
    p.wait_for_timeout(1200)
    p.click("[data-p=blog]")
    cap("専門知識なしで、サイトの中身を自分たちで直せます", 2800)
