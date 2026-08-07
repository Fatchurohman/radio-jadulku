const audio = document.getElementById('audioEngine');
const fileInput = document.getElementById('fileInput');
const songTitle = document.getElementById('songTitle');
const playlistView = document.getElementById('playlistView');
const dialNeedle = document.getElementById('dialNeedle');
const vuNeedle = document.getElementById('vuNeedle');
const volumeControl = document.getElementById('volumeControl');
const leftReel = document.getElementById('leftReel');
const rightReel = document.getElementById('rightReel');
const freqDisplay = document.getElementById('freqDisplay');
const radioLight = document.getElementById('radioLight');
const stickerTheme = document.getElementById('stickerTheme');
const reelsArea = document.getElementById('reelsArea');

const btnPlay = document.getElementById('btnPlay');
const btnPause = document.getElementById('btnPause');
const btnPrev = document.getElementById('btnPrev');
const btnNext = document.getElementById('btnNext');
const btnBoost = document.getElementById('btnBoost');
const btnBass = document.getElementById('btnBass');

let playlist = [];
let currentIndex = 0;

let audioCtx, source, gainNode, bassFilter, compressor, analyser, dataArray;
let isBoostOn = false;
let isBassOn = false;

const stickerColors = [
    { bg: '#fcf8ec', border: '#d32f2f' },
    { bg: '#f0f4c3', border: '#1976d2' },
    { bg: '#f3e5f5', border: '#388e3c' },
    { bg: '#e0f2f1', border: '#f57c00' }
];

fileInput.addEventListener('change', (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    playlist = files;
    currentIndex = 0;
    renderPlaylist();
    loadSong(currentIndex);
});

function renderPlaylist() {
    playlistView.innerHTML = '';
    playlist.forEach((file, index) => {
        const li = document.createElement('li');
        li.textContent = `${index + 1}. ${file.name.replace(/\.[^/.]+$/, "")}`;
        if (index === currentIndex) li.classList.add('playing');
        li.addEventListener('click', () => {
            currentIndex = index;
            loadSong(currentIndex);
            playAudio();
        });
        playlistView.appendChild(li);
    });
}

function loadSong(index) {
    if (!playlist[index]) return;
    const file = playlist[index];
    audio.src = URL.createObjectURL(file);
    
    // Set teks judul running text & reset animasi
    songTitle.textContent = file.name.replace(/\.[^/.]+$/, "");
    songTitle.style.animation = 'none';
    songTitle.offsetHeight; /* trigger reflow */
    songTitle.style.animation = 'marquee 10s linear infinite';
    
    const theme = stickerColors[Math.floor(Math.random() * stickerColors.length)];
    stickerTheme.style.background = theme.bg;
    stickerTheme.style.borderLeftColor = theme.border;
    
    renderPlaylist();
}

function playAudio() {
    if (!audio.src) return;
    initWebAudio();
    if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    audio.play();
    leftReel.classList.add('spinning');
    rightReel.classList.add('spinning');
    btnPlay.classList.add('active');
    btnPause.classList.remove('active');
}

function pauseAudio() {
    audio.pause();
    leftReel.classList.remove('spinning');
    rightReel.classList.remove('spinning');
    btnPlay.classList.remove('active');
    btnPause.classList.add('active');
}

btnPlay.addEventListener('click', playAudio);
btnPause.addEventListener('click', pauseAudio);

btnNext.addEventListener('click', () => {
    if (playlist.length === 0) return;
    currentIndex = (currentIndex + 1) % playlist.length;
    loadSong(currentIndex);
    playAudio();
});

btnPrev.addEventListener('click', () => {
    if (playlist.length === 0) return;
    currentIndex = (currentIndex - 1 + playlist.length) % playlist.length;
    loadSong(currentIndex);
    playAudio();
});

audio.addEventListener('timeupdate', () => {
    if (audio.duration) {
        const progress = (audio.currentTime / audio.duration) * 100;
        dialNeedle.style.left = `${progress}%`;
    }
});

freqDisplay.addEventListener('click', (e) => {
    if (!audio.duration) return;
    const rect = freqDisplay.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    audio.currentTime = (clickX / rect.width) * audio.duration;
});

volumeControl.addEventListener('input', (e) => {
    audio.volume = e.target.value;
});

audio.addEventListener('ended', () => btnNext.click());

// Web Audio API Aman Tanpa Pecah/Distorsi
function initWebAudio() {
    if (audioCtx) return;
    try {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        source = audioCtx.createMediaElementSource(audio);
        
        // Gain Node (Clarity Boost Aman)
        gainNode = audioCtx.createGain();
        gainNode.gain.value = 1.0;

        // Bass Filter
        bassFilter = audioCtx.createBiquadFilter();
        bassFilter.type = 'lowshelf';
        bassFilter.frequency.value = 180;
        bassFilter.gain.value = 0;

        // Dynamic Compressor (Pembersih Suara Pecah/Clipping)
        compressor = audioCtx.createDynamicsCompressor();
        compressor.threshold.value = -12;
        compressor.knee.value = 30;
        compressor.ratio.value = 12;
        compressor.attack.value = 0.003;
        compressor.release.value = 0.25;

        analyser = audioCtx.createAnalyser();
        analyser.fftSize = 64;
        dataArray = new Uint8Array(analyser.frequencyBinCount);

        // Rantai Koneksi Audio
        source.connect(bassFilter);
        bassFilter.connect(gainNode);
        gainNode.connect(compressor);
        compressor.connect(analyser);
        analyser.connect(audioCtx.destination);

        renderAudioEffects();
    } catch (e) {
        console.log("Audio Engine Ready");
    }
}

btnBoost.addEventListener('click', () => {
    initWebAudio();
    isBoostOn = !isBoostOn;
    if (isBoostOn) {
        gainNode.gain.value = 1.35; // Boost jernih aman tanpa distorsi
        btnBoost.textContent = "ON";
        btnBoost.classList.add('active');
    } else {
        gainNode.gain.value = 1.0;
        btnBoost.textContent = "OFF";
        btnBoost.classList.remove('active');
    }
});

btnBass.addEventListener('click', () => {
    initWebAudio();
    isBassOn = !isBassOn;
    if (isBassOn) {
        bassFilter.gain.value = 7; // Bass punch halus & hangat
        btnBass.textContent = "ON";
        btnBass.classList.add('active');
    } else {
        bassFilter.gain.value = 0;
        btnBass.textContent = "OFF";
        btnBass.classList.remove('active');
    }
});

function renderAudioEffects() {
    requestAnimationFrame(renderAudioEffects);
    if (!analyser || audio.paused) {
        vuNeedle.style.transform = 'rotate(-40deg)';
        radioLight.style.opacity = '0.3';
        return;
    }
    
    analyser.getByteFrequencyData(dataArray);
    let sum = 0;
    for (let i = 0; i < dataArray.length; i++) {
        sum += dataArray[i];
    }
    let avg = sum / dataArray.length;

    let angle = -40 + (avg / 255) * 80;
    vuNeedle.style.transform = `rotate(${angle}deg)`;

    let glowIntensity = 0.3 + (avg / 255) * 0.7;
    radioLight.style.opacity = glowIntensity.toString();
}

// Drag Reels
let startX = 0;
let isDragging = false;

reelsArea.addEventListener('pointerdown', (e) => {
    if (!audio.src) return;
    isDragging = true;
    startX = e.clientX;
});

window.addEventListener('pointermove', (e) => {
    if (!isDragging || !audio.duration) return;
    let deltaX = e.clientX - startX;
    audio.currentTime += deltaX * 0.05;
    startX = e.clientX;

    leftReel.style.transform = `rotate(${audio.currentTime * 50}deg)`;
    rightReel.style.transform = `rotate(${audio.currentTime * 50}deg)`;
});

window.addEventListener('pointerup', () => { isDragging = false; });
