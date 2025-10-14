// ===================================================
// ★★★ 設定エリア ★★★
// ステップ1でコピーしたfirebaseConfigのコードをここに貼り付けてください
// ===================================================
const firebaseConfig = {
    apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXX",
    authDomain: "your-project-id.firebaseapp.com",
    databaseURL: "https://your-project-id.firebaseio.com",
    projectId: "your-project-id",
    storageBucket: "your-project-id.appspot.com",
    messagingSenderId: "123456789012",
    appId: "1:123456789012:web:xxxxxxxxxxxxxxxxxxxxxx"
};
// ===================================================

// Firebaseを初期化
firebase.initializeApp(firebaseConfig);
const database = firebase.database();
const tickerDataRef = database.ref('tickerData');

// HTML要素を取得
const labelInput = document.getElementById('label');
const itemsTextarea = document.getElementById('items');
const updateButton = document.getElementById('updateButton');
const statusP = document.getElementById('status');

// データベースから現在のデータを読み込んでフォームに表示
tickerDataRef.on('value', (snapshot) => {
    const data = snapshot.val();
    if (data) {
        labelInput.value = data.label || '';
        itemsTextarea.value = data.items ? data.items.join('\n') : '';
    }
});

// 更新ボタンが押されたときの処理
updateButton.addEventListener('click', () => {
    const label = labelInput.value;
    const items = itemsTextarea.value.split('\n').filter(line => line.trim() !== '');

    tickerDataRef.set({
        label: label,
        items: items,
        updatedAt: new Date().toISOString()
    }).then(() => {
        statusP.textContent = '✅ 更新に成功しました！';
        statusP.style.color = '#28a745';
    }).catch((error) => {
        statusP.textContent = `❌ 更新に失敗しました: ${error.message}`;
        statusP.style.color = '#dc3545';
    });

    setTimeout(() => { statusP.textContent = ''; }, 3000);
});