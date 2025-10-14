// ===================================================
// ★★★ 設定エリア ★★★
// あなたのFirebaseプロジェクトの接続情報
// ===================================================
const firebaseConfig = {
  apiKey: "AIzaSyCyZwqTMZ6GUccNDDB9avOpBxIbRxMWJtw",
  authDomain: "obs-ticker-system.firebaseapp.com",
  databaseURL: "https://obs-ticker-system-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "obs-ticker-system",
  storageBucket: "obs-ticker-system.appspot.com",
  messagingSenderId: "597498199333",
  appId: "1:597498199333:web:fa6382b92ec4b2e29b2ecc"
};
// ===================================================

// Firebaseを初期化
firebase.initializeApp(firebaseConfig);
const database = firebase.database();
const tickerDataRef = database.ref('tickerData');

// HTML要素を取得
const labelDiv = document.getElementById('ticker-label-text');
const tickerMoveDiv = document.getElementById('ticker-move');
const clockSpan = document.getElementById('clock');

// データベースの変更をリアルタイムで監視する
tickerDataRef.on('value', (snapshot) => {
    const data = snapshot.val();
    
    if (data) {
        labelDiv.textContent = data.label || 'INFO';
        const items = data.items || ['...'];
        if (items.length > 0) {
            const newsHtml = items.map(item => `<span class="ticker-item">${item}</span>`).join('');
            tickerMoveDiv.innerHTML = newsHtml.repeat(2);
        } else {
            tickerMoveDiv.innerHTML = `<span class="ticker-item">表示する情報がありません</span>`;
        }
    } else {
        labelDiv.textContent = '待機中';
        tickerMoveDiv.innerHTML = `<span class="ticker-item">コントロールパネルからデータを更新してください...</span>`;
    }
});

// 時計を更新する関数【秒の表示を削除】
function updateClock() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    // 秒（seconds）の取得と表示処理を削除
    clockSpan.textContent = `${hours}:${minutes}`;
}

// 1秒ごとに時計を更新
setInterval(updateClock, 1000);
updateClock(); // 初回実行