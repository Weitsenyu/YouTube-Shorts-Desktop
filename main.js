// main.js
const { app, BrowserWindow, ipcMain, globalShortcut, Menu, screen } = require('electron');
const path = require('path');
const fs = require('fs');
// （如果要自動更新，需額外安裝 electron-updater）
const { autoUpdater } = require('electron-updater');

let settings = null;
let settingsWindow = null;
let mainWindow = null;

function loadSettings() {
  const filePath = path.join(__dirname, 'settings.json');
  if (!fs.existsSync(filePath)) {
    const defaultSettings = {
      hotkeys: {
        bossKey: "",
        pauseKey: "",
        muteKey: "",
        volUpKey: "",
        volDownKey: "",
        closeKey: ""
      },
      autoPlay: true,
      alreadyConfigured: false
    };
    fs.writeFileSync(filePath, JSON.stringify(defaultSettings, null, 2));
    settings = defaultSettings;
  } else {
    const data = fs.readFileSync(filePath, 'utf-8');
    settings = JSON.parse(data);
  }
}

function saveSettings() {
  const filePath = path.join(__dirname, 'settings.json');
  fs.writeFileSync(filePath, JSON.stringify(settings, null, 2));
}

function closeMainWindow() {
  if (mainWindow) {
    mainWindow.close();
    mainWindow = null;
  }
}

function createSettingsWindow() {
  closeMainWindow();
  globalShortcut.unregisterAll();
  settingsWindow = new BrowserWindow({
    width: 700,
    height: 780,
    minWidth: 700,
    minHeight: 600,
    resizable: true,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });
  settingsWindow.loadFile(path.join(__dirname, 'windows', 'settingsWindow.html'));
  settingsWindow.on('closed', () => {
    settingsWindow = null;
  });
}

function createMainWindow() {
  if (!mainWindow) {
    mainWindow = new BrowserWindow({
      width: 500,
      height: 800,
      frame: true,
      resizable: true,
      webPreferences: {
        // 重要：原本你是 nodeIntegration: false, contextIsolation: false
        // 若你之後還是想在網頁端用 require('electron')，就要設成 true
        nodeIntegration: false,
        contextIsolation: false,
        preload: path.join(__dirname, 'windows', 'mainWindow.js')
      }
    });
    Menu.setApplicationMenu(null);

    mainWindow.loadURL('https://www.youtube.com/shorts');

    // 改用主程序檢測 URL
    mainWindow.webContents.on('did-finish-load', () => {
      const url = mainWindow.webContents.getURL();
      handleNavigation(url);
    });

    mainWindow.webContents.on('did-navigate-in-page', (event, url) => {
      handleNavigation(url);
    });

    mainWindow.on('closed', () => {
      mainWindow = null;
    });
  }
}

// 用來根據 URL 判斷「短 / 長」影片，並做對應處理
function handleNavigation(url) {
  if (!mainWindow) return;

  if (url.includes('/shorts/')) {
    // 短影片
    setWindowSizeAndPosition('short');
    // 短影片也預設劇院 & 最高畫質
    setTimeout(() => {
      attemptTheaterMode(0);
      attemptMaxQuality(0);
    }, 1500);
  } else if (url.includes('/watch')) {
    // 長影片
    setWindowSizeAndPosition('long');
    // 長影片預設劇院 & 最高畫質
    setTimeout(() => {
      attemptTheaterMode(0);
      attemptMaxQuality(0);
    }, 1500);
  }
}

// 根據 short/long 調整視窗大小、位置
function setWindowSizeAndPosition(type) {
  if (!mainWindow) return;
  const { width: sw, height: sh } = screen.getPrimaryDisplay().workAreaSize;
  const gap = 20;
  let w, h;
  if (type === 'short') {
    // 短影片（直向）
    w = 500;
    h = 800;
  } else {
    // 長影片（橫向）可自行調整
    w = 950;
    h = 600;
  }
  const x = sw - w - gap;
  const y = sh - h - gap;
  mainWindow.setBounds({ x, y, width: w, height: h });
}

// 重複嘗試點擊「劇院模式」按鈕
function attemptTheaterMode(attempt) {
  if (attempt > 1) return;
  mainWindow.webContents.executeJavaScript(`
    (function(){
      const btn = document.querySelector('button.ytp-size-button');
      if(btn) {
        btn.click();
        "OK"
      } else {
        "NOT_FOUND"
      }
    })();
  `).then(result => {
    if (result === "NOT_FOUND") {
      setTimeout(() => attemptTheaterMode(attempt + 1), 1000);
    } else {
      console.log('Theater mode enabled');
    }
  }).catch(err => {
    console.log('attemptTheaterMode error:', err);
  });
}

// 重複嘗試設定「最高畫質」(假設為英文介面：Quality)
function attemptMaxQuality(attempt) {
  if (attempt > 1) return;
  mainWindow.webContents.executeJavaScript(`
    (function(){
      const gear = document.querySelector('.ytp-settings-button');
      if(!gear) return "NO_GEAR";
      gear.click(); // 打開設定選單

      // 尋找 "Quality" 選單
      const menuItems = document.querySelectorAll('.ytp-menuitem-label');
      let qualityItem = null;
      menuItems.forEach(item => {
        if(item.innerText.trim().toLowerCase() === 'quality') {
          qualityItem = item;
        }
      });
      if(!qualityItem) return "NO_QUALITY_MENU";
      qualityItem.click();

      // 再找可用畫質(最頂的應該是最高畫質)
      const qualityOptions = document.querySelectorAll('.ytp-menuitem-label');
      if(!qualityOptions.length) return "NO_QUALITY_OPTION";

      // 取第一個 (最高畫質)
      qualityOptions[0].click();
      return "OK";
    })();
  `).then(result => {
    if (result === "NO_GEAR" || result === "NO_QUALITY_MENU" || result === "NO_QUALITY_OPTION") {
      setTimeout(() => attemptMaxQuality(attempt + 1), 1000);
    } else if (result === "OK") {
      console.log('Max Quality set');
    }
  }).catch(err => {
    console.log('attemptMaxQuality error:', err);
  });
}

function registerHotkeys() {
  const { bossKey, pauseKey, muteKey, volUpKey, volDownKey, closeKey } = settings.hotkeys;

  // Boss Key => 隱藏時暫停
  if (bossKey) {
    globalShortcut.register(bossKey, () => {
      if (!mainWindow) return;
      if (mainWindow.isVisible()) {
        mainWindow.webContents.send('pause-video');
        mainWindow.hide();
        mainWindow.setSkipTaskbar(true);
      } else {
        mainWindow.show();
        mainWindow.setSkipTaskbar(false);
        // 還原後 => autoPlay
        mainWindow.webContents.send('resume-video', settings.autoPlay);
      }
    });
  }

  // Pause Key => 可在隱藏狀態使用
  if (pauseKey) {
    globalShortcut.register(pauseKey, () => {
      if (mainWindow) {
        mainWindow.webContents.send('toggle-pause');
      }
    });
  }

  // Mute Key
  if (muteKey) {
    globalShortcut.register(muteKey, () => {
      if (mainWindow) {
        mainWindow.webContents.send('toggle-mute');
      }
    });
  }

  // Volume Up
  if (volUpKey) {
    globalShortcut.register(volUpKey, () => {
      if (mainWindow) {
        mainWindow.webContents.send('volume-up');
      }
    });
  }

  // Volume Down
  if (volDownKey) {
    globalShortcut.register(volDownKey, () => {
      if (mainWindow) {
        mainWindow.webContents.send('volume-down');
      }
    });
  }

  // Close Window
  if (closeKey) {
    globalShortcut.register(closeKey, () => {
      if (mainWindow) {
        mainWindow.close();
      }
    });
  }

  // Ctrl+Shift+S => 重新設定
  globalShortcut.register('Ctrl+Shift+S', () => {
    console.log('Ctrl+Shift+S triggered => open settings window');
    createSettingsWindow();
  });
}

// IPC：取得設定
ipcMain.handle('get-current-settings', () => {
  return settings;
});

// IPC：儲存設定
ipcMain.on('save-hotkeys', (event, data) => {
  settings.hotkeys.bossKey = data.bossKey;
  settings.hotkeys.pauseKey = data.pauseKey;
  settings.hotkeys.muteKey = data.muteKey;
  settings.hotkeys.volUpKey = data.volUpKey;
  settings.hotkeys.volDownKey = data.volDownKey;
  settings.hotkeys.closeKey = data.closeKey;
  settings.autoPlay = data.autoPlay;
  settings.alreadyConfigured = true;
  saveSettings();

  if (settingsWindow) {
    settingsWindow.close();
  }
  if (!mainWindow) {
    createMainWindow();
  }
  globalShortcut.unregisterAll();
  registerHotkeys();
});

// ----------------------
// app lifecycle
// ----------------------
app.whenReady().then(() => {
  loadSettings();
  if (!settings.alreadyConfigured) {
    createSettingsWindow();
  } else {
    createMainWindow();
    registerHotkeys();
  }

  // （若使用 electron-updater，可在這裡檢查更新）
  autoUpdater.checkForUpdatesAndNotify();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      if (!settings.alreadyConfigured) {
        createSettingsWindow();
      } else {
        createMainWindow();
        registerHotkeys();
      }
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
