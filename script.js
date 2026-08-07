const audio = document.getElementById('audioEngine');
const fileInput = document.getElementById('fileInput');
const songTitle = document.getElementById('songTitle');
const playlistView = document.getElementById('playlistView');
const dialNeedle = document.getElementById('dialNeedle');
const vuNeedle = document.getElementById('vuNeedle');
const leftReel = document.getElementById('leftReel');
const rightReel = document.getElementById('rightReel');
const tapeRollLeft = document.getElementById('tapeRollLeft');
const tapeRollRight = document.getElementById('tapeRollRight');
const freqDisplay = document.getElementById('freqDisplay');
const radioLight = document.getElementById('radioLight');
const reelsArea = document.getElementById('reelsArea');

const btnPlay = document.getElementById('btnPlay');
const btnPause = document.getElementById('btnPause');
const btnPrev = document.getElementById('btnPrev');
const btnNext = document.getElementById('btnNext');
const btnBoost = document.getElementById('btnBoost');
const btnBass = document.getElementById('btnBass');

let playlist = [];
let currentIndex = 0;

let audioCtx, source, gainNode, bassFilter, analyser, dataArray;
let isBoostOn = false;
let isBassOn = false;

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
    
    songTitle.textContent = file.name.replace(/\.[^/.]+$/, "");
    songTitle.style.animation = 'none';
    songTitle.offsetHeight;
    songTitle.style.animation = 'marquee 12s linear infinite';
    
    renderPlaylist();
}

function playAudio() {
    if (!audio.src) return;
    
    if ((isBoostOn || isBassOn) && audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    
    audio.play();
    leftReel.classList.add('spinning');
    rightReel.classList.add('spinning');
    btnPlay.classList.add('active');
    btnPause.classList.remove('active');
    
    if (isBoostOn || isBassOn) {
        initWebAudio();
    }
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

// Update Dial & Pita Magnetik Menerawang
audio.addEventListener('timeupdate', () => {
    if (audio.duration) {
        const progress = (audio.currentTime / audio.duration);
        dialNeedle.style.left = `${progress * 100}%`;

        // Ukuran gulungan pita alami
        let leftSize = 42 - (progress * 16); // Mengurang (42px -> 26px)
        let rightSize = 26 + (progress * 16); // Membesar (26px -> 42px)
        tapeRollLeft.style.width = `${leftSize}px`;
        tapeRollLeft.style.height = `${leftSize}px`;
        tapeRollRight.style.width = `${rightSize}px`;
        tapeRollRight.style.height = `${rightSize}px`;
    }
});

freqDisplay.addEventListener('click', (e) => {
    if (!audio.duration) return;
    const rect = freqDisplay.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    audio.currentTime = (clickX / rect.width) * audio.duration;
});

audio.addEventListener('ended', () => btnNext.click());

// Audio Engine
function initWebAudio() {
    if (audioCtx) return;
    try {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        source = audioCtx.createMediaElementSource(audio);
        
        gainNode = audioCtx.createGain();
        gainNode.gain.value = isBoostOn ? 1.25 : 1.0;

        bassFilter = audioCtx.createBiquadFilter();
        bassFilter.type = 'lowshelf';
        bassFilter.frequency.value = 150;
        bassFilter.gain.value = isBassOn ? 5 : 0;

        analyser = audioCtx.createAnalyser();
        analyser.fftSize = 64;
        dataArray = new Uint8Array(analyser.frequencyBinCount);

        source.connect(bassFilter);
        bassFilter.connect(gainNode);
        gainNode.connect(analyser);
        analyser.connect(audioCtx.destination);

        renderAudioVisuals();
    } catch (e) {
        console.log("Direct Sound Engine Ready");
    }
}

btnBoost.addEventListener('click', () => {
    initWebAudio();
    isBoostOn = !isBoostOn;
    if (gainNode) {
        gainNode.gain.value = isBoostOn ? 1.25 : 1.0;
    }
    btnBoost.textContent = isBoostOn ? "ON" : "OFF";
    btnBoost.classList.toggle('active', isBoostOn);
});

btnBass.addEventListener('click', () => {
    initWebAudio();
    isBassOn = !isBassOn;
    if (bassFilter) {
        bassFilter.gain.value = isBassOn ? 5 : 0;
    }
    btnBass.textContent = isBassOn ? "ON" : "OFF";
    btnBass.classList.toggle('active', isBassOn);
});

// Render Gerakan Jarum S-Meter (Rentang -30deg s/d 30deg Aman dalam Frame)
function renderAudioVisuals() {
    requestAnimationFrame(renderAudioVisuals);
    if (!analyser || audio.paused) {
        vuNeedle.style.transform = 'rotate(-30deg)';
        radioLight.style.opacity = '0.3';
        return;
    }
    
    analyser.getByteFrequencyData(dataArray);
    let sum = 0;
    for (let i = 0; i < dataArray.length; i++) {
        sum += dataArray[i];
    }
    let avg = sum / dataArray.length;

    let angle = -30 + (avg / 255) * 60; // Rentang aman -30deg sampai +30deg
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
