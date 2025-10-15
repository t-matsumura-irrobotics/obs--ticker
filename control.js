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
// ===================================================

firebase.initializeApp(firebaseConfig);
const database = firebase.database();
const tickerDataRef = database.ref('tickerData');

const labelInput = document.getElementById('label');
const itemsTextarea = document.getElementById('items');
const updateButton = document.getElementById('updateButton');
const statusP = document.getElementById('status');

// データベースから読み込み、テキストエリアに表示
tickerDataRef.on('value', (snapshot) => {
    const data = snapshot.val();
    if (data) {
        labelInput.value = data.label || '';
        itemsTextarea.value = data.scrollingText || '';
    }
});

// 更新ボタンの処理
updateButton.addEventListener('click', () => {
    const label = labelInput.value;
    // 改行を半角スペース3つに変換して、1行のテキストにする
    const scrollingText = itemsTextarea.value.replace(/\n/g, '   ');

    updateButton.disabled = true;
    updateButton.textContent = '更新中...';

    tickerDataRef.set({
        label: label,
        scrollingText: scrollingText,
        updatedAt: new Date().toISOString()
    }).then(() => {
        statusP.textContent = '✅ 更新に成功しました！';
        statusP.style.color = '#28a745';
    }).catch((error) => {
        statusP.textContent = `❌ 更新に失敗しました: ${error.message}`;
        statusP.style.color = '#dc3545';
    }).finally(() => {
        updateButton.disabled = false;
        updateButton.textContent = '更新する';
        setTimeout(() => { statusP.textContent = ''; }, 3000);
    });
});