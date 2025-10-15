// ===================================================
// ★★★ 設定エリア ★★★
// ===================================================
const firebaseConfig = {
  apiKey: "AIzaSyCyZwqTMZ6GUccNDDB9avOpBxIbRxMWJtw",
  authDomain: "obs-ticker-system.firebaseapp.com",
  databaseURL: "https://obs-ticker-system-default-rtdb.asia-southeast1.firebasedabase.app",
  projectId: "obs-ticker-system",
  storageBucket: "obs-ticker-system.appspot.com",
  messagingSenderId: "597498199333",
  appId: "1:597498199333:web:fa6382b92ec4b2e29b2ecc"
};
// スクロール速度 (ピクセル/秒)
const SCROLL_SPEED_PPS = 150;
// ===================================================

firebase.initializeApp(firebaseConfig);
const database = firebase.database();
const tickerDataRef = database.ref('tickerData');

const labelDiv = document.getElementById('ticker-label');
const wrapDiv = document.getElementById('ticker-wrap');
const clockSpan = document.getElementById('clock');
let currentAnimation = null;

// テキストを受け取り、スクロールアニメーションを開始する関数
function startScrolling(text) {
    // 既存のアニメーションがあれば停止
    if (currentAnimation) {
        currentAnimation.cancel();
    }
    
    // 表示エリアとテキスト要素を作成
    wrapDiv.innerHTML = ''; // 中身をクリア
    const textElement = document.createElement('div');
    textElement.className = 'scrolling-text';
    textElement.textContent = text + "   ***   "; // 末尾に区切り文字を追加
    wrapDiv.appendChild(textElement);
    
    // テキストと表示エリアの幅を取得
    const textWidth = textElement.offsetWidth;
    const wrapWidth = wrapDiv.offsetWidth;
    
    // アニメーション時間を計算 (距離 ÷ 速度)
    // 距離 = 表示エリアの幅 + テキストの幅
    const durationSeconds = (wrapWidth + textWidth) / SCROLL_SPEED_PPS;

    // Web Animations APIを使用してアニメーションを適用
    currentAnimation = textElement.animate([
        { transform: `translateX(${wrapWidth}px)` }, // 開始位置 (右端の外側)
        { transform: `translateX(-${textWidth}px)` }  // 終了位置 (左端の外側)
    ], {
        duration: durationSeconds * 1000, // ミリ秒に変換
        iterations: Infinity, // 無限に繰り返す
        easing: 'linear' // 一定速度
    });
}


tickerDataRef.on('value', (snapshot) => {
    const data = snapshot.val();
    if (data) {
        labelDiv.textContent = data.label || 'MARKET NEWS';
        startScrolling(data.scrollingText || 'コントロールパネルから情報を更新してください...');
    } else {
        labelDiv.textContent = '待機中';
        startScrolling('コントロールパネルから情報を更新してください...');
    }
});

function updateClock() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    clockSpan.textContent = `${hours}:${minutes}`;
}

setInterval(updateClock, 1000);
updateClock();