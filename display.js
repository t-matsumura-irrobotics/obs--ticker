// ===================================================
// ★★★ 設定エリア ★★★
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

firebase.initializeApp(firebaseConfig);
const database = firebase.database();
const tickerDataRef = database.ref('tickerData');

const labelDiv = document.getElementById('ticker-label');
const wrapDiv = document.getElementById('ticker-wrap');
const clockSpan = document.getElementById('clock');

// 前日比の色を決定するヘルパー関数
function getChangeClass(changeValue) {
    const str = String(changeValue);
    if (str.startsWith('+')) return 'change-plus';
    if (str.startsWith('-') || str.startsWith('▼') || str.startsWith('▲')) return 'change-minus';
    return ''; // プラマイなしの場合
}
// 記号を統一するヘルパー関数
function formatChangeValue(changeValue) {
    const str = String(changeValue);
    if (str.startsWith('+')) return `▲${str.substring(1)}`;
    if (str.startsWith('-')) return `▼${str.substring(1)}`;
    if (str.startsWith('▲') || str.startsWith('▼')) return str;
    if (parseFloat(str) > 0) return `▲${str}`;
    if (parseFloat(str) < 0) return `▼${Math.abs(parseFloat(str))}`;
    return str;
}


tickerDataRef.on('value', (snapshot) => {
    const data = snapshot.val();
    if (data) {
        labelDiv.textContent = data.label || '主要株価';
        
        if (data.stockItems && data.stockItems.length > 0) {
            const itemsHtml = data.stockItems.map(item => {
                const changeClass = getChangeClass(item.change);
                const formattedChange = formatChangeValue(item.change);
                return `
                <div class="stock-item">
                    <span class="stock-name">${item.name}</span>
                    <span class="stock-code">${item.code}</span>
                    <span class="stock-price">${item.price}</span>
                    <span class="stock-change ${changeClass}">${formattedChange}</span>
                </div>
            `}).join('');
            wrapDiv.innerHTML = itemsHtml;
        } else {
            wrapDiv.innerHTML = '';
        }
    } else {
        labelDiv.textContent = '待機中';
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