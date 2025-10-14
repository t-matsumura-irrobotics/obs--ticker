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
    
    // データが存在する場合の処理
    if (data) {
        // ラベルを更新
        labelDiv.textContent = data.label || 'INFO';

        // 流れる文字を更新
        const items = data.items || ['...'];
        if (items.length > 0) {
            const newsHtml = items.map(item => `<span class="ticker-item">${item}</span>`).join('');
            // 切れ目なく表示するために内容を2回繰り返す
            tickerMoveDiv.innerHTML = newsHtml.repeat(2);
        } else {
            tickerMoveDiv.innerHTML = `<span class="ticker-item">表示する情報がありません</span>`;
        }
    } else {
        // データがまだ無い場合の初期表示
        labelDiv.textContent = '待機中';
        tickerMoveDiv.innerHTML = `<span class="ticker-item">コントロールパネルからデータを更新してください...</span>`;
    }
});

// 時計を更新する関数
function updateClock() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    clockSpan.textContent = `${hours}:${minutes}:${seconds}`;
}

// 1秒ごとに時計を更新
setInterval(updateClock, 1000);
updateClock(); // 初回実行