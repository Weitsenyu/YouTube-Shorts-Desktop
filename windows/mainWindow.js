const { ipcRenderer } = require('electron');
let currentVolume = 1.0;

ipcRenderer.on('pause-video', () => {
  pauseVideo();
});

ipcRenderer.on('resume-video', (_, autoPlay) => {
  if (autoPlay) playVideo();
});

ipcRenderer.on('toggle-pause', () => {
  togglePause();
});

ipcRenderer.on('toggle-mute', () => {
  toggleMute();
});

ipcRenderer.on('volume-up', () => {
  currentVolume = Math.min(1, currentVolume + 0.1);
  setVolume(currentVolume);
  showVolumeOverlay(currentVolume);
});

ipcRenderer.on('volume-down', () => {
  currentVolume = Math.max(0, currentVolume - 0.1);
  setVolume(currentVolume);
  showVolumeOverlay(currentVolume);
});

function getVideoElement() {
  let video = document.querySelector('video');
  if (!video) {
    video = document.querySelector('.html5-main-video');
  }
  return video;
}

function pauseVideo() {
  const video = getVideoElement();
  if (video && !video.paused) video.pause();
}
function playVideo() {
  const video = getVideoElement();
  if (video && video.paused) video.play();
}
function setVolume(vol) {
  const video = getVideoElement();
  if (video) {
    video.volume = vol;
  }
}
function togglePause() {
  const video = getVideoElement();
  if (!video) return;
  if (video.paused) {
    video.play();
  } else {
    video.pause();
  }
}
function toggleMute() {
  const video = getVideoElement();
  if (!video) return;
  video.muted = !video.muted;
}

// 顯示音量浮動提示
function showVolumeOverlay(vol) {
  let overlay = document.getElementById('volume-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'volume-overlay';
    overlay.style.position = 'fixed';
    overlay.style.right = '30px';
    overlay.style.bottom = '30px';
    overlay.style.padding = '10px 14px';
    overlay.style.background = 'rgba(0,0,0,0.7)';
    overlay.style.color = '#fff';
    overlay.style.fontSize = '14px';
    overlay.style.borderRadius = '4px';
    overlay.style.zIndex = '999999';
    document.body.appendChild(overlay);
  }
  overlay.textContent = `音量：${(vol * 100).toFixed(0)}%`;
  overlay.style.display = 'block';

  clearTimeout(window._volumeTimer);
  window._volumeTimer = setTimeout(() => {
    overlay.style.display = 'none';
  }, 1000);
}
