const { ipcRenderer } = require('electron');

window.addEventListener('DOMContentLoaded', () => {
  ipcRenderer.invoke('get-current-settings').then((data) => {
    if (data) {
      const { bossKey, pauseKey, muteKey, volUpKey, volDownKey, closeKey } = data.hotkeys;
      const autoPlay = data.autoPlay;
      if (bossKey) document.getElementById('bossKey').value = bossKey;
      if (pauseKey) document.getElementById('pauseKey').value = pauseKey;
      if (muteKey) document.getElementById('muteKey').value = muteKey;
      if (volUpKey) document.getElementById('volUpKey').value = volUpKey;
      if (volDownKey) document.getElementById('volDownKey').value = volDownKey;
      if (closeKey) document.getElementById('closeKey').value = closeKey;
      document.getElementById('autoPlay').value = autoPlay ? "true" : "false";
    }
  });
});

function captureHotkey(inputElement, event) {
  event.preventDefault();
  let keys = [];
  if (event.ctrlKey) keys.push('Ctrl');
  if (event.shiftKey) keys.push('Shift');
  if (event.altKey) keys.push('Alt');
  if (event.metaKey) keys.push('Meta');
  const key = event.key;
  if (key && !["Control", "Shift", "Alt", "Meta"].includes(key)) {
    keys.push(key);
  }
  inputElement.value = keys.join('+');
}

document.querySelectorAll('input.hotkey').forEach((input) => {
  input.addEventListener('keydown', (e) => {
    captureHotkey(input, e);
  });
});

document.getElementById('finish').addEventListener('click', () => {
  const hotkeys = {
    bossKey: document.getElementById('bossKey').value,
    pauseKey: document.getElementById('pauseKey').value,
    muteKey: document.getElementById('muteKey').value,
    volUpKey: document.getElementById('volUpKey').value,
    volDownKey: document.getElementById('volDownKey').value,
    closeKey: document.getElementById('closeKey').value
  };
  const autoPlay = (document.getElementById('autoPlay').value === 'true');

  if (!hotkeys.bossKey || !hotkeys.pauseKey || !hotkeys.muteKey || !hotkeys.closeKey) {
    alert('請至少設定 Boss Key、Pause Key、Mute Key 與 Close Window！');
    return;
  }
  ipcRenderer.send('save-hotkeys', { ...hotkeys, autoPlay });
});
