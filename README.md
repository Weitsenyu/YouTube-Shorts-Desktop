# YouTube Shorts Desktop

An Electron-based desktop application that allows you to view YouTube Shorts and regular YouTube videos in a floating window.  
It features global hotkeys, auto theater mode, and automatic high quality video settings.

---

# YouTube Shorts 桌面版

這是一個基於 Electron 的桌面應用程式，可讓你在懸浮視窗中觀看 YouTube Shorts 與一般 YouTube 影片。  
本應用具備全域快捷鍵、預設劇院模式以及自動設定最高畫質的功能。

---

## Features / 特色

- **Global Hotkeys / 全域快捷鍵**  
  Control playback, mute, volume, and window visibility using customizable hotkeys.  
  使用自訂的快捷鍵控制影片播放、靜音、音量調整以及視窗切換。

- **Auto Theater Mode & High Quality / 自動劇院模式及最高畫質**  
  The application automatically switches to theater mode and sets the highest available quality based on the video type (Shorts or regular).  
  當切換至 Shorts 或一般影片時，程式會自動啟用劇院模式並設定最高畫質。

- **Floating Window / 懸浮視窗**  
  Always on top window to enable continuous viewing while working.  
  懸浮在其他視窗之上，方便你在工作時也能持續觀看影片。

---

## Installation / 安裝方式

There are two available installation methods:

### 1. Download Installer from GitHub Releases  
- **English:**  
  1. Visit our [GitHub Releases](https://github.com/Weitsenyu/YouTube-Shorts-Desktop/releases) page.
  2. Download the latest installer (e.g., `YouTube Shorts Desktop Setup 1.0.0.exe`).
  3. Double-click the installer and follow the on-screen instructions.
  4. Launch the application from your Start Menu or desktop shortcut.
  
- **中文：**  
  1. 前往我們的 [GitHub Releases](https://github.com/Weitsenyu/YouTube-Shorts-Desktop/releases) 頁面。
  2. 下載最新版本的安裝檔（例如：`YouTube Shorts Desktop Setup 1.0.0.exe`）。
  3. 雙擊安裝檔，依照畫面指示進行安裝。
  4. 安裝完成後，從開始選單或桌面捷徑啟動應用程式。

### 2. Direct Download of the EXE File  
- **English:**  
  1. Alternatively, you can download the standalone executable file directly from GitHub Releases.
  2. Simply extract the executable from the ZIP file and run it directly without installation.
  
- **中文：**  
  1. 或者，你也可以直接從 GitHub Releases 下載獨立的 EXE 檔案。
  2. 下載後解壓縮，即可直接執行，不需要進行安裝程序。

---

## Usage / 使用說明

- **Launching the App / 啟動應用程式**  
  Upon launch, the app will automatically load YouTube Shorts by default.  
  啟動後，應用程式會預設載入 YouTube Shorts。

- **Switching Video Types / 切換影片類型**  
  To watch a regular YouTube video, simply navigate to a URL containing `/watch` or click any YouTube link.  
  若要觀看一般影片，請點擊含有 `/watch` 的連結或輸入對應網址。

- **Hotkeys / 快捷鍵**  
  You can customize global hotkeys through the settings window (accessed via `Ctrl+Shift+S`).  
  你可以透過設定視窗（使用 Ctrl+Shift+S 快捷鍵開啟）自訂各項全域快捷鍵。  
  > **Note / 注意：** Changes to hotkeys are saved persistently, so your custom settings will be retained between sessions.

---

## Configuration / 設定

- **Hotkeys Settings / 快捷鍵設定**  
  In the settings window, you can set the following keys (suggested defaults provided):  
  - **Boss Key (隱藏/顯示視窗)：** e.g., `Shift+Q`  
  - **Pause Key (暫停/播放)：** e.g., `Shift+P`  
  - **Mute Key (靜音/恢復)：** e.g., `Shift+M`  
  - **Volume Up Key (調高音量)：** e.g., `Shift+Up Arrow`  
  - **Volume Down Key (調低音量)：** e.g., `Shift+Down Arrow`  
  - **Close Window (關閉視窗)：** e.g., `Alt+Q`  
  - Additionally, you can choose whether the app auto-plays when the window is restored.
  
- **Persistent Settings / 設定保存**  
  The application stores your settings in a persistent file (located in your user data folder). This ensures your hotkeys and other preferences are remembered even after you close the app.

---

## Troubleshooting / 疑難排解

- **Hotkeys Not Saved / 快捷鍵未保存**  
  If your hotkey settings do not persist between sessions, ensure that your settings file is located in the correct user data folder and that the app has permission to write to it.
  
- **Video Playback Issues / 影片播放問題**  
  If the app fails to switch to theater mode or set high quality automatically, please verify your network connection and try restarting the app.

---

## Additional Information / 附加資訊

- **Source Code & Contributions / 原始碼與貢獻**  
  Feel free to fork the repository and submit pull requests. For any issues or suggestions, please open an issue on GitHub.
  
- **License / 授權條款**  
  This project is licensed under the MIT License.

---

## Conclusion / 結語

This README aims to provide a complete and detailed guide for installing, using, and configuring the YouTube Shorts Desktop application. Both English and Chinese instructions are provided to assist users in setting up the application and troubleshooting any issues that may arise.

---
