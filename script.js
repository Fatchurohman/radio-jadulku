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

const btnPlay = document.getElementById('btnPlay');
const btnPause = document.getElementById('btnPause');
const btnPrev = document.getElementById('btnPrev');
const btnNext = document.getElementById('btnNext');

let playlist = [];
let currentIndex = 0;
let audioCtx, analyser, dataArray;

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
    const fileURL = URL.createObjectURL(file);
    audio.src = fileURL;
    songTitle.textContent = file.name.replace(/\.[^/.]+$/, "");
    renderPlaylist();
}

function playAudio() {
    if (!audio.src) return;
    audio.play();
    leftReel.classList.add('spinning');
    rightReel.classList.add('spinning');
    btnPlay.classList.add('active');
    btnPause.classList.remove('active');
    setupWebAudio();
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

// Jarum Radio bergerak sesuai progress durasi lagu
audio.addEventListener('timeupdate', () => {
    if (audio.duration) {
        const progress = (audio.currentTime / audio.duration) * 100;
        dialNeedle.style.left = `${progress}%`;
    }
});

// Klik pada Skala Radio untuk lompat durasi (seek)
freqDisplay.addEventListener('click', (e) => {
    if (!audio.duration) return;
    const rect = freqDisplay.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newTime = (clickX / rect.width) * audio.duration;
    audio.currentTime = newTime;
});

volumeControl.addEventListener('input', (e) => {
    audio.volume = e.target.value;
});

audio.addEventListener('ended', () => {
    btnNext.click();
});

// Efek Animasi Jarum S-Meter (VU Meter)
function setupWebAudio() {
    if (audioCtx) return;
    try {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioCtx.createAnalyser();
        const source = audioCtx.createMediaElementSource(audio);
        source.connect(analyser);
        analyser.connect(audioCtx.destination);
        analyser.fftSize = 64;
        dataArray = new Uint8Array(analyser.frequencyBinCount);
        updateVUMeter();
    } catch(e) {
        console.log("WebAudio initialized");
    }
}

function updateVUMeter() {
    requestAnimationFrame(updateVUMeter);
    if (!analyser || audio.paused) {
        vuNeedle.style.transform = 'rotate(-40deg)';
        return;
    }
    analyser.getByteFrequencyData(dataArray);
    let sum = 0;
    for (let i = 0; i < dataArray.length; i++) {
        sum += dataArray[i];
    }
    let average = sum / dataArray.length;
    let angle = -40 + (average / 255) * 80;
    vuNeedle.style.transform = `rotate(${angle}deg)`;
}

