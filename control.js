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

const labelInput = document.getElementById('label');
const itemsTextarea = document.getElementById('items');
const updateButton = document.getElementById('updateButton');
const statusP = document.getElementById('status');

// データベースから読み込み、テキストエリアに整形して表示
tickerDataRef.on('value', (snapshot) => {
    const data = snapshot.val();
    if (data) {
        labelInput.value = data.label || '';
        if (data.stockItems) {
            const text = data.stockItems.map(item => `${item.name},${item.code},${item.price},${item.change}`).join('\n');
            itemsTextarea.value = text;
        } else {
            itemsTextarea.value = '';
        }
    }
});

// 更新ボタンの処理
updateButton.addEventListener('click', () => {
    const label = labelInput.value;
    const lines = itemsTextarea.value.split('\n').filter(line => line.trim() !== '');

    const stockItems = lines.map(line => {
        const parts = line.split(',');
        return {
            name: parts[0] || '',
            code: parts[1] || '',
            price: parts[2] || '-',
            change: parts[3] || '-'
        };
    });

    updateButton.disabled = true;
    updateButton.textContent = '更新中...';

    tickerDataRef.set({
        label: label,
        stockItems: stockItems, // 新しい株式データ構造
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