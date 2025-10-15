const firebaseConfig = {
  apiKey: "AIzaSyCyZwqTMZ6GUccNDDB9avOpBxIbRxMWJtw",
  authDomain: "obs-ticker-system.firebaseapp.com",
  databaseURL: "https://obs-ticker-system-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "obs-ticker-system",
  storageBucket: "obs-ticker-system.appspot.com",
  messagingSenderId: "597498199333",
  appId: "1:597498199333:web:fa6382b92ec4b2e29b2ecc"
};

const SCROLL_SPEED_PPS = 120;

firebase.initializeApp(firebaseConfig);
const database = firebase.database();
const tickerDataRef = database.ref('tickerData');

const headerLabelDiv = document.getElementById('header-label');
const centerWrapDiv = document.getElementById('center-wrap');
const clockSpan = document.getElementById('clock');
const liveLabel = document.getElementById('live-label');
let currentAnimation = null;

function startScrolling(text) {
    if (currentAnimation) {
        currentAnimation.cancel();
    }
    centerWrapDiv.innerHTML = '';
    const textElement = document.createElement('div');
    textElement.className = 'scrolling-text';
    textElement.textContent = text;
    centerWrapDiv.appendChild(textElement);
    
    const textWidth = textElement.offsetWidth;
    const wrapWidth = centerWrapDiv.offsetWidth;
    
    if (textWidth < wrapWidth) {
        textElement.style.transform = `translateX(0px)`;
        return;
    }
    
    const durationSeconds = (wrapWidth + textWidth) / SCROLL_SPEED_PPS;

    currentAnimation = textElement.animate([
        { transform: `translateX(${wrapWidth}px)` },
        { transform: `translateX(-${textWidth}px)` }
    ], {
        duration: durationSeconds * 1000,
        iterations: Infinity,
        easing: 'linear'
    });
}

tickerDataRef.on('value', (snapshot) => {
    const data = snapshot.val();
    if (data) {
        headerLabelDiv.textContent = data.header || 'INFO';
        startScrolling(data.scrollingText || 'コントロールパネルから情報を更新してください...');
    } else {
        headerLabelDiv.textContent = '待機中';
        startScrolling('コントロールパネルから情報を更新してください...');
    }
});

function updateClock() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    clockSpan.textContent = `${hours}:${minutes}`;
}

function manageClockDisplay() {
    // 1. Show Time for 20 seconds
    liveLabel.style.display = 'none';
    clockSpan.style.display = 'block';
    
    setTimeout(() => {
        // 2. Show LIVE for 10 seconds
        clockSpan.style.display = 'none';
        liveLabel.style.display = 'block';
        liveLabel.classList.add('bounce-animation');

        setTimeout(() => {
            // 3. Restart the cycle
            liveLabel.classList.remove('bounce-animation');
            manageClockDisplay();
        }, 10000); // 10 seconds for LIVE
    }, 20000); // 20 seconds for Time
}

// Keep updating the clock time every second in the background
setInterval(updateClock, 1000);

// Start the initial display cycle
document.addEventListener('DOMContentLoaded', () => {
    updateClock();
    manageClockDisplay();
});