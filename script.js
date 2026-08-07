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

// Web Audio API Node (Untuk Booster & Equalizer)
let audioCtx, source, gainNode, bassFilter, analyser, dataArray;
let isBoostOn = false;
let isBassOn = false;

// Kumpulan warna stiker kaset tulisan tangan (Random tiap lagu)
const stickerColors = [
    { bg: '#fdfcf7', border: '#d32f2f' },
    { bg: '#fffde7', border: '#1976d2' },
    { bg: '#f3e5f5', border: '#388e3c' },
    { bg: '#e0f2f1', border: '#f57c00' },
    { bg: '#fff3e0', border: '#7b1fa2' }
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
    
    // Ganti teks judul dengan gaya tulisan tangan
    songTitle.textContent = file.name.replace(/\.[^/.]+$/, "");
    
    // Randomize Stiker Kaset
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

// Update Dial & Seeking
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

// --- FITUR 4: AUDIO BOOSTER & BASS EQUALIZER ---
function initWebAudio() {
    if (audioCtx) return;
    try {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        source = audioCtx.createMediaElementSource(audio);
        
        // Gain Node (Penguat Volume Super Boost)
        gainNode = audioCtx.createGain();
        gainNode.gain.value = 1.0;

        // Bass Filter Node (Low Shelf Filter)
        bassFilter = audioCtx.createBiquadFilter();
        bassFilter.type = 'lowshelf';
        bassFilter.frequency.value = 200; // Frekuensi Bass
        bassFilter.gain.value = 0; // Default Off

        // Analyser untuk VU Meter & Lampu Tabung Warm Glow
        analyser = audioCtx.createAnalyser();
        analyser.fftSize = 64;
        dataArray = new Uint8Array(analyser.frequencyBinCount);

        // Sambungkan Jalur Audio
        source.connect(bassFilter);
        bassFilter.connect(gainNode);
        gainNode.connect(analyser);
        analyser.connect(audioCtx.destination);

        renderAudioEffects();
    } catch (e) {
        console.log("WebAudio initialized");
    }
}

// Toggle Volume Booster
btnBoost.addEventListener('click', () => {
    initWebAudio();
    isBoostOn = !isBoostOn;
    if (isBoostOn) {
        gainNode.gain.value = 2.5; // Menguatkan suara hingga 2.5x lipat
        btnBoost.textContent = "ON (200%)";
        btnBoost.classList.add('active');
    } else {
        gainNode.gain.value = 1.0;
        btnBoost.textContent = "OFF";
        btnBoost.classList.remove('active');
    }
});

// Toggle Bass Punch
btnBass.addEventListener('click', () => {
    initWebAudio();
    isBassOn = !isBassOn;
    if (isBassOn) {
        bassFilter.gain.value = 12; // Mendongkrak bass +12dB
        btnBass.textContent = "ON (+12dB)";
        btnBass.classList.add('active');
    } else {
        bassFilter.gain.value = 0;
        btnBass.textContent = "OFF";
        btnBass.classList.remove('active');
    }
});

// --- FITUR 2: LAMPU TABUNG REAKSI (WARM GLOW) & VU METER ---
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

    // Gerakkan Jarum VU Meter
    let angle = -40 + (avg / 255) * 80;
    vuNeedle.style.transform = `rotate(${angle}deg)`;

    // Pendaran Lampu Mengikuti Irama Musik (Warm Glow)
    let glowIntensity = 0.3 + (avg / 255) * 0.7;
    radioLight.style.opacity = glowIntensity.toString();
}

// --- FITUR 4 (Lanjutan): SWIPE / DRAG ROADS KASET DENGAN JARI ---
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
    
    // Geser kanan = Fast Forward, Geser kiri = Rewind
    audio.currentTime += deltaX * 0.05;
    startX = e.clientX;

    // Putar visual roda saat diseret
    leftReel.style.transform = `rotate(${audio.currentTime * 50}deg)`;
    rightReel.style.transform = `rotate(${audio.currentTime * 50}deg)`;
});

window.addEventListener('pointerup', () => { isDragging = false; });
