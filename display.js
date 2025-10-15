const firebaseConfig = {
  apiKey: "AIzaSyCyZwqTMZ6GUccNDDB9avOpBxIbRxMWJtw",
  authDomain: "obs-ticker-system.firebaseapp.com",
  databaseURL: "https://obs-ticker-system-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "obs-ticker-system",
  storageBucket: "obs-ticker-system.appspot.com",
  messagingSenderId: "597498199333",
  appId: "1:597498199333:web:fa6382b92ec4b2e29b2ecc"
};

const SCROLL_SPEED_PPS = 144;

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
        headerLabelDiv.textContent = data.header || '日経平均株価';
        startScrolling(data.scrollingText || 'コントロールパネルから情報を更新してください...');
    } else {
        headerLabelDiv.textContent = '日経平均株価';
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
    liveLabel.style.display = 'none';
    liveLabel.classList.remove('live-animating');
    clockSpan.classList.add('bounce-in-animation');
    clockSpan.style.display = 'block';
    
    setTimeout(() => {
        clockSpan.style.display = 'none';
        clockSpan.classList.remove('bounce-in-animation');
        liveLabel.style.display = 'flex';
        liveLabel.classList.add('live-animating');

        setTimeout(() => {
            manageClockDisplay();
        }, 10000); 
    }, 20000);
}

setInterval(updateClock, 1000);

document.addEventListener('DOMContentLoaded', () => {
    updateClock();
    manageClockDisplay();
});