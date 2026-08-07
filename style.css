* {
    box-sizing: border-box;
    user-select: none;
    -webkit-user-select: none;
    margin: 0;
    padding: 0;
}

body {
    background: #120c08;
    font-family: Arial, Helvetica, sans-serif;
    color: #332d29;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    padding: 10px;
}

/* Bodi Kayu Mahoni Klasik */
.vintage-player {
    width: 100%;
    max-width: 420px;
    background: radial-gradient(circle at center, #7a4623 0%, #40210c 70%, #210e03 100%);
    border: 8px solid #140802;
    border-radius: 14px;
    box-shadow: 0 15px 35px rgba(0,0,0,0.95);
    padding: 14px;
    position: relative;
}

/* Top Bar */
.top-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 11px;
    color: #ffd89b;
    margin-bottom: 12px;
    border-bottom: 1px dashed rgba(255, 216, 155, 0.3);
    padding-bottom: 6px;
    font-weight: bold;
    font-family: 'Courier New', monospace;
}

.brand-tag { color: #f1c40f; }
.dev-tag {
    background: #b8860b;
    color: #fff;
    padding: 2px 8px;
    border-radius: 10px;
    font-size: 10px;
}
.dev-tag i { color: #fff; font-style: normal; }

/* Radio Dial Display */
.radio-display {
    background: #120a02;
    border: 3px solid #54371b;
    border-radius: 6px;
    height: 55px;
    position: relative;
    overflow: hidden;
    margin-bottom: 12px;
    box-shadow: inset 0 0 10px #000;
}

.radio-light {
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    background: radial-gradient(circle, rgba(255, 160, 50, 0.3) 0%, rgba(10, 5, 0, 0.85) 85%);
    pointer-events: none;
    transition: opacity 0.1s ease;
}

.dial-scale {
    color: #ffb84d;
    font-size: 10px;
    padding: 6px 10px;
    font-family: 'Courier New', monospace;
}

.dial-scale .khz { color: #d99b00; margin-top: 3px; }

.dial-needle {
    position: absolute;
    top: 0; bottom: 0; left: 0%;
    width: 3px;
    background: #ff3300;
    box-shadow: 0 0 6px #ff3300;
    transition: left 0.2s linear;
    z-index: 2;
}

/* Middle Layout */
.middle-section {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 8px;
    margin-bottom: 12px;
}

.vu-meter {
    width: 65px;
    height: 95px;
    background: #fcf8ec;
    border: 3px solid #4a2e16;
    border-radius: 6px;
    padding: 4px;
    text-align: center;
    box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
}

.vu-label { font-size: 8px; font-weight: bold; color: #4a2e16; font-family: monospace; }
.vu-dial { height: 70px; position: relative; border-bottom: 2px solid #aaa; }
.vu-needle {
    position: absolute; bottom: 0; left: 50%;
    width: 2px; height: 50px;
    background: #d32f2f;
    transform-origin: bottom center;
    transform: rotate(-40deg);
    transition: transform 0.08s ease-out;
}

/* === DESAIN KASET PITA ALAMI & PROPORSIONAL === */
.cassette-deck {
    flex: 1;
    min-width: 0;
    height: 120px; /* Ukuran proporsional fisik kaset */
    background: #110c08;
    border: 4px solid #4a2e16;
    border-radius: 8px;
    padding: 6px;
    box-shadow: inset 0 0 12px #000;
}

.cassette-body {
    width: 100%;
    height: 100%;
    background: #2a2826; /* Body kaset mika hitam alami */
    border: 1px solid #444;
    border-radius: 6px;
    padding: 5px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.cassette-label-sticker {
    background: #fdfdfa;
    padding: 3px 6px;
    border-radius: 3px;
    border-left: 5px solid #c62828;
    box-shadow: 0 1px 3px rgba(0,0,0,0.3);
}

.sticker-brand {
    font-size: 8px;
    font-weight: bold;
    color: #666;
    display: block;
    font-family: monospace;
}

/* Running Text Standar & Sangat Jelas Dibaca */
.ticker-wrapper {
    width: 100%;
    overflow: hidden;
    white-space: nowrap;
    margin-top: 2px;
}

.clean-running-title {
    display: inline-block;
    font-size: 13px;
    font-weight: bold;
    color: #111;
    font-family: Arial, sans-serif;
    padding-left: 100%;
    animation: marquee 12s linear infinite;
}

@keyframes marquee {
    0% { transform: translate(0, 0); }
    100% { transform: translate(-100%, 0); }
}

/* Kaca & Gulungan Pita Kaset Alami */
.tape-window {
    background: rgba(15, 15, 15, 0.85);
    border: 2px solid #555;
    border-radius: 4px;
    height: 52px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 12px;
    position: relative;
    overflow: hidden;
    cursor: grab;
}

/* Gulungan Pita Cokelat Gelap (Alami) */
.reel-spool-left, .reel-spool-right {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
}

.tape-roll {
    position: absolute;
    border-radius: 50%;
    background: #3d2314; /* Warna pita kaset magnetik alami */
    border: 1px solid #26140a;
    width: 38px;
    height: 38px;
    z-index: 1;
}

.reel-hub {
    width: 24px;
    height: 24px;
    background: #e6e6e6; /* Plastik hub kaset putih matte */
    border: 2px solid #aaa;
    border-radius: 50%;
    z-index: 2;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
}

.hub-teeth {
    width: 8px;
    height: 8px;
    background: #333;
    clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
}

.spinning { animation: spinHub 2.5s linear infinite; }
@keyframes spinHub { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

/* Volume Slider */
.knob-panel { width: 50px; text-align: center; }
.knob-container label { font-size: 8px; font-weight: bold; color: #ffd89b; display: block; margin-bottom: 4px; font-family: monospace; }
.knob-container input[type=range] { width: 60px; transform: rotate(-90deg); margin-top: 20px; accent-color: #b8860b; }

/* Panel Booster */
.booster-panel {
    background: #211208;
    border: 2px solid #4a2e16;
    border-radius: 6px;
    padding: 6px;
    margin-bottom: 10px;
}

.booster-title {
    font-size: 9px;
    font-weight: bold;
    text-align: center;
    color: #ffd89b;
    margin-bottom: 4px;
    font-family: monospace;
}

.booster-controls { display: flex; justify-content: space-around; }
.booster-item { display: flex; flex-direction: column; align-items: center; gap: 2px; }
.booster-item label { font-size: 8px; font-weight: bold; color: #b8860b; font-family: monospace; }

.toggle-btn {
    background: #120904;
    border: 1px solid #b8860b;
    color: #888;
    font-size: 8px;
    font-weight: bold;
    padding: 3px 10px;
    border-radius: 3px;
    cursor: pointer;
}

.toggle-btn.active {
    background: #b8860b;
    color: #000;
    box-shadow: 0 0 6px #ffdf00;
}

/* Tombol Fisik */
.button-panel { display: flex; gap: 5px; margin-bottom: 10px; }
.btn-tape {
    flex: 1; height: 44px;
    background: linear-gradient(to bottom, #7a4623, #40210c);
    border: 2px solid #140802; border-radius: 4px;
    color: #fdf8e6; font-size: 9px; font-weight: bold;
    cursor: pointer;
    box-shadow: 0 3px 0 #100501;
    display: flex; align-items: center; justify-content: center;
}
.btn-tape:active, .btn-tape.active {
    transform: translateY(2px);
    box-shadow: 0 1px 0 #100501;
}
.btn-open { background: linear-gradient(to bottom, #96281b, #5c140b); }

/* Playlist Card */
.playlist-card {
    background: #fdfbf7;
    border: 2px solid #7a4623;
    border-radius: 4px; padding: 6px;
    max-height: 110px; overflow-y: auto;
}
.card-title { font-size: 9px; font-weight: bold; color: #40210c; padding-bottom: 3px; margin-bottom: 4px; border-bottom: 1px dashed #cca385; font-family: monospace; }
.playlist-list { list-style: none; }
.playlist-list li { font-size: 10px; padding: 4px; border-bottom: 1px dashed #e8d7c8; cursor: pointer; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.playlist-list li.playing { font-weight: bold; color: #b71c1c; background: #f5e8d0; }
.empty-msg { color: #888; font-style: italic; }
