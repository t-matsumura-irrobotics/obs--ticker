// ===================================================
// ★★★ 設定エリア：ここを編集してください ★★★
// ===================================================

// 1. 左側のラベルに表示する文字
const labelText = "NEWS"; 

// 2. スクロールさせたい文字 (好きなだけ追加・削除できます)
const newsData = [
    "左側のラベルは自由に変更できます。",
    "このティッカーは everystocknews.com のデザインを参考にしています。",
    "GitHub Pages を利用してOBSに表示します。",
    "九州の天気 15日(水) 晴れのち曇り 最高気温31度",
    "次の項目です。フォントにはNoto Sans JPを採用しました。",
];

// ===================================================
// ★★★ 設定エリアはここまで ★★★
// ===================================================


// 時計を更新する関数
function updateClock() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    document.getElementById('clock').textContent = `${hours}:${minutes}:${seconds}`;
}

// ページが読み込まれたら実行する処理
document.addEventListener('DOMContentLoaded', () => {
    // --- 変更点：設定したラベルテキストをHTMLに反映 ---
    document.getElementById('ticker-label-text').textContent = labelText;
    
    // ニュースデータをHTMLに挿入
    const tickerMove = document.querySelector('.ticker-move');
    let newsHtml = '';
    newsData.forEach(item => {
        newsHtml += `<span class="ticker-item">${item}</span>`;
    });
    
    // 切れ目なく表示するために内容を2回繰り返す
    tickerMove.innerHTML = (newsHtml + newsHtml);

    // 時計を1秒ごとに更新
    setInterval(updateClock, 1000);
    updateClock();
});