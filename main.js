// main.js
const { app, BrowserWindow, ipcMain, globalShortcut, Menu, screen } = require('electron');
const path = require('path');
const fs = require('fs');
// （如果要自動更新，需額外安裝 electron-updater）
const { autoUpdater } = require('electron-updater');

let settings = null;
let settingsWindow = null;
let mainWindow = null;

/*=======================
  設定檔存取：改用 app.getPath('userData')
========================*/
function getSettingsPath() {
  return path.join(app.getPath('userData'), 'settings.json');
}

function loadSettings() {
  const filePath = getSettingsPath();
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
  const filePath = getSettingsPath();
  fs.writeFileSync(filePath, JSON.stringify(settings, null, 2));
}

/*=======================
  視窗管理函式
========================*/
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
        // 若要在網頁端用 require('electron')，需設定成 true
        nodeIntegration: false,
        contextIsolation: false,
        preload: path.join(__dirname, 'windows', 'mainWindow.js')
      }
    });
    Menu.setApplicationMenu(null);

    // 載入 YouTube Shorts 頁面
    mainWindow.loadURL('https://www.youtube.com/shorts');

    // 當網頁載入完成或在頁面內導覽變更時，根據 URL 調整視窗大小
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

/*=======================
  調整視窗大小
  問題1：移除自動定位至右下角，只改變大小，不改變目前位置
========================*/
function setWindowSizeAndPosition(type) {
  if (!mainWindow) return;
  let w, h;
  if (type === 'short') {
    // 直向影片尺寸
    w = 500;
    h = 800;
  } else {
    // 橫向影片尺寸
    w = 950;
    h = 600;
  }
  // 僅調整視窗大小，不改變現有位置
  mainWindow.setSize(w, h);
}

/*=======================
  根據 URL 切換影片模式
  問題2：橫版影片時不自動啟用劇院模式與最高畫質，避免干擾其他功能
========================*/
function handleNavigation(url) {
  if (!mainWindow) return;

  if (url.includes('/shorts/')) {
    // 短影片：調整尺寸並自動切換劇院模式與最高畫質
    setWindowSizeAndPosition('short');
    setTimeout(() => {
      attemptTheaterMode(0);
      attemptMaxQuality(0);
    }, 1500);
  } else if (url.includes('/watch')) {
    // 長影片（橫版）：僅調整尺寸，不呼叫自動劇院與畫質設定
    setWindowSizeAndPosition('long');
  }
}

/*=======================
  劇院模式與最高畫質
  保留原有重複嘗試機制（只在直向影片中啟用）
========================*/
function attemptTheaterMode(attempt) {
  if (attempt > 1) return;
  mainWindow.webContents.executeJavaScript(`
    (function(){
      const btn = document.querySelector('button.ytp-size-button');
      if(btn) {
        btn.click();
        return "OK";
      } else {
        return "NOT_FOUND";
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

function attemptMaxQuality(attempt) {
  if (attempt > 1) return;
  mainWindow.webContents.executeJavaScript(`
    (function(){
      const gear = document.querySelector('.ytp-settings-button');
      if(!gear) return "NO_GEAR";
      gear.click();
      const menuItems = document.querySelectorAll('.ytp-menuitem-label');
      let qualityItem = null;
      menuItems.forEach(item => {
        if(item.innerText.trim().toLowerCase() === 'quality') {
          qualityItem = item;
        }
      });
      if(!qualityItem) return "NO_QUALITY_MENU";
      qualityItem.click();
      const qualityOptions = document.querySelectorAll('.ytp-menuitem-label');
      if(!qualityOptions.length) return "NO_QUALITY_OPTION";
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

/*=======================
  全域快捷鍵註冊
========================*/
function registerHotkeys() {
  const { bossKey, pauseKey, muteKey, volUpKey, volDownKey, closeKey } = settings.hotkeys;

  // Boss Key：隱藏時暫停影片；恢復時根據 autoPlay 進行播放
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
        mainWindow.webContents.send('resume-video', settings.autoPlay);
      }
    });
  }

  // Pause Key：切換暫停/播放
  if (pauseKey) {
    globalShortcut.register(pauseKey, () => {
      if (mainWindow) {
        mainWindow.webContents.send('toggle-pause');
      }
    });
  }

  // Mute Key：切換靜音（問題2：橫版影片中請確保此功能可用）
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

  // Ctrl+Shift+S：重新開啟設定視窗
  globalShortcut.register('Ctrl+Shift+S', () => {
    console.log('Ctrl+Shift+S triggered => open settings window');
    createSettingsWindow();
  });
}

/*=======================
  IPC 處理：取得與儲存設定
========================*/
ipcMain.handle('get-current-settings', () => {
  return settings;
});

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

/*=======================
  單一執行個體處理
========================*/
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });

  /*=======================
    App Lifecycle
  ========================*/
  app.whenReady().then(() => {
    loadSettings();
    if (!settings.alreadyConfigured) {
      createSettingsWindow();
    } else {
      createMainWindow();
      registerHotkeys();
    }

    // 檢查更新（若使用 electron-updater）
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
}
