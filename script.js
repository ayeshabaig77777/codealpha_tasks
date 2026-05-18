// Master Track Database Object Array
const trackList = [
    {
        title: "Synthwaves Chillout",
        artist: "Neon Breeze",
        art: "🌌",
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
    },
    {
        title: "Cybernetic Echoes",
        artist: "Glitch Matrix",
        art: "⚡",
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
    },
    {
        title: "Digital Horizon",
        artist: "Pixel Wanderer",
        art: "🌅",
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3"
    }
];

let trackIndex = 0;
let isPlaying = false;
const audioPlayer = new Audio(); // HTML5 Core Audio Wrapper Object API

// Get Document Node DOM Handlers
const playBtn = document.getElementById('play-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const title = document.getElementById('title');
const artist = document.getElementById('artist');
const art = document.getElementById('art');
const progressBar = document.getElementById('progress-bar');
const currentTimeDisplay = document.getElementById('current-time');
const totalDurationDisplay = document.getElementById('total-duration');
const volumeSlider = document.getElementById('volume-slider');
const playlistQueue = document.getElementById('playlist-queue');

// 1. CHOOSE & MOUNT AUDIO TRACK
function loadTrack(index) {
    trackIndex = index;
    audioPlayer.src = trackList[trackIndex].url;
    title.innerText = trackList[trackIndex].title;
    artist.innerText = trackList[trackIndex].artist;
    art.innerText = trackList[trackIndex].art;
    
    audioPlayer.load();
    updatePlaylistUI();
}

// 2. PLAY / PAUSE LOGIC ROUTINES
function togglePlay() {
    if (!isPlaying) {
        audioPlayer.play();
        isPlaying = true;
        playBtn.innerHTML = "&#10074;&#10074;"; // Toggle Pause Icon Character
    } else {
        audioPlayer.pause();
        isPlaying = false;
        playBtn.innerHTML = "&#9654;"; // Toggle Play Icon Character
    }
}

playBtn.addEventListener('click', togglePlay);

// 3. NEXT & PREVIOUS BUTTON INTERACTION WRAPPERS
function nextTrack() {
    trackIndex = (trackIndex + 1) % trackList.length; // Loops cleanly back to 0
    loadTrack(trackIndex);
    if (isPlaying) audioPlayer.play();
}

function prevTrack() {
    trackIndex = (trackIndex - 1 + trackList.length) % trackList.length;
    loadTrack(trackIndex);
    if (isPlaying) audioPlayer.play();
}

nextBtn.addEventListener('click', nextTrack);
prevBtn.addEventListener('click', prevTrack);

// 4. TIMELINE TRACK PROGRESS METRICS HANDLERS
audioPlayer.addEventListener('timeupdate', () => {
    if (audioPlayer.duration) {
        // Compute running completion percentage calculation
        const progressPercentage = (audioPlayer.currentTime / audioPlayer.duration) * 100;
        progressBar.value = progressPercentage;

        // Time calculations parsing helpers 
        currentTimeDisplay.innerText = formatTime(audioPlayer.currentTime);
        totalDurationDisplay.innerText = formatTime(audioPlayer.duration);
    }
});

// Skip on timeline drag input change tracking
progressBar.addEventListener('input', () => {
    const skipToTime = (progressBar.value / 100) * audioPlayer.duration;
    audioPlayer.currentTime = skipToTime;
});

function formatTime(seconds) {
    let mins = Math.floor(seconds / 60);
    let secs = Math.floor(seconds % 60);
    if (secs < 10) secs = `0${secs}`;
    return `${mins}:${secs}`;
}

// 5. VOLUME ADJUSTMENT API DRIVER 
volumeSlider.addEventListener('input', (e) => {
    audioPlayer.volume = e.target.value;
});

// 6. BONUS: PLAYLIST INJECTION AND AUTOPLAY LOOP TRACKERS
function buildPlaylistUI() {
    playlistQueue.innerHTML = "";
    trackList.forEach((track, idx) => {
        const liNode = document.createElement('li');
        liNode.innerText = `${track.title} - ${track.artist}`;
        liNode.addEventListener('click', () => {
            loadTrack(idx);
            isPlaying = false;
            togglePlay();
        });
        playlistQueue.appendChild(liNode);
    });
}

function updatePlaylistUI() {
    const listItems = playlistQueue.querySelectorAll('li');
    listItems.forEach((li, idx) => {
        if (idx === trackIndex) {
            li.className = "active-track";
        } else {
            li.className = "";
        }
    });
}

// BONUS: Autoplay next track systematically upon song completion termination event
audioPlayer.addEventListener('ended', nextTrack);

// Initial Execution Lifecycle entry point
buildPlaylistUI();
loadTrack(trackIndex);