// DOM Elements
const timeDisplay = document.getElementById('timeDisplay');
const hoursElement = document.getElementById('hours');
const minutesElement = document.getElementById('minutes');
const secondsElement = document.getElementById('seconds');
const millisecondsElement = document.getElementById('milliseconds');
const statusIndicator = document.getElementById('statusIndicator');
const statusDot = statusIndicator.querySelector('.status-dot');
const statusText = statusIndicator.querySelector('.status-text');

const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const resetBtn = document.getElementById('resetBtn');
const lapBtn = document.getElementById('lapBtn');
const clearLapsBtn = document.getElementById('clearLapsBtn');

const lapContainer = document.getElementById('lapContainer');
const noLaps = document.getElementById('noLaps');
const totalLapsElement = document.getElementById('totalLaps');
const fastestLapElement = document.getElementById('fastestLap');
const slowestLapElement = document.getElementById('slowestLap');
const averageLapElement = document.getElementById('averageLap');

// Stopwatch State
let startTime = 0;
let elapsedTime = 0;
let timerInterval = null;
let isRunning = false;
let lapTimes = [];
let lapCounter = 0;

// Time formatting function
function formatTime(milliseconds) {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const ms = Math.floor((milliseconds % 1000) / 10);

    return {
        hours: hours.toString().padStart(2, '0'),
        minutes: minutes.toString().padStart(2, '0'),
        seconds: seconds.toString().padStart(2, '0'),
        milliseconds: ms.toString().padStart(2, '0')
    };
}

// Update display
function updateDisplay() {
    const time = formatTime(elapsedTime);
    hoursElement.textContent = time.hours;
    minutesElement.textContent = time.minutes;
    secondsElement.textContent = time.seconds;
    millisecondsElement.textContent = time.milliseconds;
}

// Update timer
function updateTimer() {
    elapsedTime = Date.now() - startTime;
    updateDisplay();
}

// Start stopwatch
function startStopwatch() {
    if (!isRunning) {
        startTime = Date.now() - elapsedTime;
        timerInterval = setInterval(updateTimer, 10);
        isRunning = true;
        
        // Update UI
        startBtn.disabled = true;
        pauseBtn.disabled = false;
        lapBtn.disabled = false;
        
        statusDot.classList.add('running');
        statusText.textContent = 'Running';
        
        // Button animations
        startBtn.style.transform = 'scale(0.95)';
        setTimeout(() => {
            startBtn.style.transform = '';
        }, 150);
    }
}

// Pause stopwatch
function pauseStopwatch() {
    if (isRunning) {
        clearInterval(timerInterval);
        isRunning = false;
        
        // Update UI
        startBtn.disabled = false;
        pauseBtn.disabled = true;
        lapBtn.disabled = true;
        
        statusDot.classList.remove('running');
        statusDot.classList.add('paused');
        statusText.textContent = 'Paused';
        
        // Button animations
        pauseBtn.style.transform = 'scale(0.95)';
        setTimeout(() => {
            pauseBtn.style.transform = '';
        }, 150);
    }
}

// Reset stopwatch
function resetStopwatch() {
    clearInterval(timerInterval);
    isRunning = false;
    elapsedTime = 0;
    
    // Update UI
    updateDisplay();
    startBtn.disabled = false;
    pauseBtn.disabled = true;
    lapBtn.disabled = true;
    
    statusDot.classList.remove('running', 'paused');
    statusText.textContent = 'Ready';
    
    // Button animations
    resetBtn.style.transform = 'scale(0.95)';
    setTimeout(() => {
        resetBtn.style.transform = '';
    }, 150);
    
    // Clear lap times
    clearLaps();
}

// Add lap time
function addLap() {
    if (isRunning) {
        lapCounter++;
        const currentTime = elapsedTime;
        const lapTime = lapCounter === 1 ? currentTime : currentTime - (lapTimes.length > 0 ? lapTimes[lapTimes.length - 1].total : 0);
        
        const lap = {
            number: lapCounter,
            lapTime: lapTime,
            total: currentTime
        };
        
        lapTimes.push(lap);
        displayLap(lap);
        updateStatistics();
        
        // Button animation
        lapBtn.style.transform = 'scale(0.95)';
        setTimeout(() => {
            lapBtn.style.transform = '';
        }, 150);
        
        // Hide no laps message
        if (noLaps.style.display !== 'none') {
            noLaps.style.display = 'none';
        }
    }
}

// Display lap
function displayLap(lap) {
    const lapElement = document.createElement('div');
    lapElement.className = 'lap-item';
    
    const time = formatTime(lap.lapTime);
    const timeString = `${time.hours}:${time.minutes}:${time.seconds}.${time.milliseconds}`;
    
    // Calculate lap difference
    let diffElement = '';
    if (lapTimes.length > 1) {
        const prevLap = lapTimes[lapTimes.length - 2];
        const diff = lap.lapTime - prevLap.lapTime;
        const diffTime = formatTime(Math.abs(diff));
        const diffString = `${diffTime.minutes}:${diffTime.seconds}.${diffTime.milliseconds}`;
        
        if (diff > 0) {
            diffElement = `<span class="lap-diff slower">+${diffString}</span>`;
        } else if (diff < 0) {
            diffElement = `<span class="lap-diff faster">-${diffString}</span>`;
        } else {
            diffElement = `<span class="lap-diff">±${diffString}</span>`;
        }
    }
    
    lapElement.innerHTML = `
        <span class="lap-number">Lap ${lap.number}</span>
        <span class="lap-time">${timeString}</span>
        ${diffElement}
    `;
    
    lapContainer.insertBefore(lapElement, lapContainer.firstChild);
    
    // Scroll to top to show new lap
    lapContainer.scrollTop = 0;
}

// Clear all laps
function clearLaps() {
    lapTimes = [];
    lapCounter = 0;
    
    // Clear lap container
    const lapItems = lapContainer.querySelectorAll('.lap-item');
    lapItems.forEach(item => item.remove());
    
    // Show no laps message
    noLaps.style.display = 'block';
    
    // Reset statistics
    updateStatistics();
}

// Update statistics
function updateStatistics() {
    totalLapsElement.textContent = lapTimes.length;
    
    if (lapTimes.length === 0) {
        fastestLapElement.textContent = '--:--:--';
        slowestLapElement.textContent = '--:--:--';
        averageLapElement.textContent = '--:--:--';
        return;
    }
    
    // Find fastest and slowest laps
    const fastest = Math.min(...lapTimes.map(lap => lap.lapTime));
    const slowest = Math.max(...lapTimes.map(lap => lap.lapTime));
    
    // Calculate average
    const average = lapTimes.reduce((sum, lap) => sum + lap.lapTime, 0) / lapTimes.length;
    
    // Format and display
    const fastestTime = formatTime(fastest);
    const slowestTime = formatTime(slowest);
    const averageTime = formatTime(average);
    
    fastestLapElement.textContent = `${fastestTime.minutes}:${fastestTime.seconds}.${fastestTime.milliseconds}`;
    slowestLapElement.textContent = `${slowestTime.minutes}:${slowestTime.seconds}.${slowestTime.milliseconds}`;
    averageLapElement.textContent = `${averageTime.minutes}:${averageTime.seconds}.${averageTime.milliseconds}`;
    
    // Highlight best lap
    const lapItems = lapContainer.querySelectorAll('.lap-item');
    lapItems.forEach((item, index) => {
        const lapIndex = lapTimes.length - 1 - index;
        const lap = lapTimes[lapIndex];
        
        const diffSpan = item.querySelector('.lap-diff');
        if (diffSpan) {
            diffSpan.classList.remove('best');
            if (lap.lapTime === fastest) {
                diffSpan.classList.add('best');
                diffSpan.textContent = 'BEST LAP';
            }
        }
    });
}

// Keyboard shortcuts
function handleKeyboardShortcuts(event) {
    // Prevent if user is typing in an input
    if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
        return;
    }
    
    switch (event.code) {
        case 'Space':
            event.preventDefault();
            if (isRunning) {
                pauseStopwatch();
            } else {
                startStopwatch();
            }
            break;
        case 'KeyR':
            event.preventDefault();
            resetStopwatch();
            break;
        case 'KeyL':
            event.preventDefault();
            if (isRunning) {
                addLap();
            }
            break;
    }
}

// Event Listeners
startBtn.addEventListener('click', startStopwatch);
pauseBtn.addEventListener('click', pauseStopwatch);
resetBtn.addEventListener('click', resetStopwatch);
lapBtn.addEventListener('click', addLap);
clearLapsBtn.addEventListener('click', clearLaps);
document.addEventListener('keydown', handleKeyboardShortcuts);

// Touch gestures for mobile
let touchStartY = 0;
let touchEndY = 0;

timeDisplay.addEventListener('touchstart', (e) => {
    touchStartY = e.changedTouches[0].screenY;
});

timeDisplay.addEventListener('touchend', (e) => {
    touchEndY = e.changedTouches[0].screenY;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartY - touchEndY;
    
    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            // Swipe up - Start/Pause
            if (isRunning) {
                pauseStopwatch();
            } else {
                startStopwatch();
            }
        } else {
            // Swipe down - Add lap
            if (isRunning) {
                addLap();
            }
        }
    }
}

// Initialize display
updateDisplay();

// Save/Load state (optional - for persistence)
function saveState() {
    const state = {
        elapsedTime,
        lapTimes,
        lapCounter,
        isRunning
    };
    localStorage.setItem('stopwatchState', JSON.stringify(state));
}

function loadState() {
    const savedState = localStorage.getItem('stopwatchState');
    if (savedState) {
        const state = JSON.parse(savedState);
        elapsedTime = state.elapsedTime || 0;
        lapTimes = state.lapTimes || [];
        lapCounter = state.lapCounter || 0;
        
        updateDisplay();
        
        // Restore laps
        if (lapTimes.length > 0) {
            noLaps.style.display = 'none';
            lapTimes.forEach(lap => displayLap(lap));
            updateStatistics();
        }
    }
}

// Auto-save state periodically
setInterval(saveState, 1000);

// Load state on page load
window.addEventListener('load', loadState);

// Save state before page unload
window.addEventListener('beforeunload', saveState);

// Add visual feedback for button presses
[startBtn, pauseBtn, resetBtn, lapBtn].forEach(btn => {
    btn.addEventListener('mousedown', () => {
        btn.style.transform = 'scale(0.95)';
    });
    
    btn.addEventListener('mouseup', () => {
        setTimeout(() => {
            btn.style.transform = '';
        }, 100);
    });
    
    btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
    });
});

// Add sound effects (optional)
function playSound(frequency = 800, duration = 100) {
    if (typeof AudioContext !== 'undefined' || typeof webkitAudioContext !== 'undefined') {
        const audioContext = new (AudioContext || webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = frequency;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration / 1000);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + duration / 1000);
    }
}

// Add sound to buttons (uncomment to enable)
// startBtn.addEventListener('click', () => playSound(600, 150));
// pauseBtn.addEventListener('click', () => playSound(400, 150));
// resetBtn.addEventListener('click', () => playSound(300, 200));
// lapBtn.addEventListener('click', () => playSound(800, 100));