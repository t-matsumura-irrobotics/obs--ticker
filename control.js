document.addEventListener('DOMContentLoaded', () => {
    const firebaseConfig = {
      apiKey: "AIzaSyCyZwqTMZ6GUccNDDB9avOpBxIbRxMWJtw",
      authDomain: "obs-ticker-system.firebaseapp.com",
      databaseURL: "https://obs-ticker-system-default-rtdb.asia-southeast1.firebasedatabase.app",
      projectId: "obs-ticker-system",
      storageBucket: "obs-ticker-system.appspot.com",
      messagingSenderId: "597498199333",
      appId: "1:597498199333:web:fa6382b92ec4b2e29b2ecc"
    };

    firebase.initializeApp(firebaseConfig);
    const database = firebase.database();
    const tickerDataRef = database.ref('tickerData');

    const labelLeftInput = document.getElementById('labelLeft');
    const scrollingTextInput = document.getElementById('scrollingText');
    const updateButton = document.getElementById('updateButton');
    const statusP = document.getElementById('status');

    tickerDataRef.on('value', (snapshot) => {
        const data = snapshot.val();
        if (data) {
            labelLeftInput.value = data.labelLeft || '';
            scrollingTextInput.value = data.scrollingText ? data.scrollingText.replace(/   /g, '\n') : '';
        }
    });

    updateButton.addEventListener('click', () => {
        const labelLeft = labelLeftInput.value;
        const scrollingText = scrollingTextInput.value.replace(/\n/g, '   ');

        updateButton.disabled = true;
        updateButton.textContent = '更新中...';

        tickerDataRef.set({
            labelLeft: labelLeft,
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
});