# YouTube Shorts Desktop

An Electron-based desktop application that allows you to view YouTube Shorts and regular YouTube videos in a floating window.  
It features global hotkeys, auto theater mode, automatic high-quality video settings, persistent configurations, and single-instance enforcement.

---

# YouTube Shorts 桌面版

這是一個基於 Electron 的桌面應用程式，可讓你在懸浮視窗中觀看 YouTube Shorts 以及一般 YouTube 影片。  
本應用具備全域快捷鍵、預設劇院模式、自動設定最高畫質、設定持久化以及單一執行個體等功能。

---

## Features / 特色

### Global Hotkeys / 全域快捷鍵
- **Description / 說明：**  
  Customize and use hotkeys to control playback (pause/play), mute, adjust volume, and toggle window visibility.  
  可自訂並使用快捷鍵來控制影片播放、靜音、音量調整及視窗顯示/隱藏。

### Auto Theater Mode & High Quality (For Shorts Only) / 自動劇院模式與最高畫質 (僅針對 Shorts)
- **Description / 說明：**  
  For vertical (Shorts) videos, the app automatically switches to theater mode and sets the highest available quality.  
  當觀看直向短影片時，程式會自動啟用劇院模式並調整至最高畫質。

### Landscape Video Behavior / 橫版影片行為調整
- **Description / 說明：**  
  For regular (landscape) videos, auto theater mode and high-quality auto-setting are disabled. This ensures proper playback continuation when minimized and allows mute toggling to work.  
  對於一般（橫向）影片，將不自動切換劇院模式及畫質設定，以確保縮小後持續播放與切換靜音功能正常運作。

### Floating Window / 懸浮視窗
- **Description / 說明：**  
  The window remains on top for uninterrupted viewing while you work.  
  視窗會懸浮在其他應用程式之上，方便你在工作時持續觀看影片。

### Persistent Settings / 設定持久化
- **Description / 說明：**  
  Your customized hotkeys and preferences are saved in your user data folder, ensuring they are retained across sessions.  
  使用者設定會存放在使用者資料夾中，即使重啟應用程式也能保留你的自訂設定。

### Single Instance Enforcement / 單一執行個體
- **Description / 說明：**  
  The application prevents multiple instances from running concurrently. If a second instance is launched, the existing window is focused.  
  程式只允許一個實例運行，若再次啟動則會自動聚焦現有視窗。

---

## Installation / 安裝方式

### 1. Download Installer from GitHub Releases / 從 GitHub Releases 下載安裝程式

**English:**  
1. Visit our [GitHub Releases](https://github.com/Weitsenyu/YouTube-Shorts-Desktop/releases) page.  
2. Download the latest installer (e.g., `YouTube Shorts Desktop Setup 1.0.1.exe`).  
3. Run the installer and follow the on-screen instructions.  
4. Launch the app from the Start Menu or desktop shortcut.

**中文：**  
1. 前往 [GitHub Releases](https://github.com/Weitsenyu/YouTube-Shorts-Desktop/releases) 頁面。  
2. 下載最新版本的安裝程式（例如：`YouTube Shorts Desktop Setup 1.0.1.exe`）。  
3. 執行安裝程式，依照畫面指示完成安裝。  
4. 從開始選單或桌面捷徑啟動應用程式。

### 2. Direct Download of the EXE File / 直接下載 EXE 檔案

**English:**  
1. Download the standalone executable directly from the GitHub Releases page.  
2. Extract the ZIP file and run the executable without installing.

**中文：**  
1. 直接從 GitHub Releases 頁面下載獨立的執行檔。  
2. 解壓縮後即可直接執行，無需安裝程序。

---

## Usage / 使用說明

- **Launching the App / 啟動應用程式**  
  When launched, the app will automatically load YouTube Shorts by default.  
  啟動後，預設會載入 YouTube Shorts。

- **Switching Video Types / 切換影片類型**  
  To view a regular YouTube video, simply navigate to a URL containing `/watch` or click a YouTube link.  
  若要觀看一般影片，請瀏覽含有 `/watch` 的連結或直接點擊影片連結。

- **Hotkeys / 快捷鍵**  
  Customize global hotkeys via the settings window (opened with `Ctrl+Shift+S`).  
  可透過設定視窗（按下 Ctrl+Shift+S 開啟）自訂快捷鍵，設定將持久保存。

---

## Troubleshooting / 疑難排解

- **Hotkeys Not Saved / 快捷鍵未保存**  
  Ensure that the settings file is created in your user data folder and that the app has write permission.

- **Video Playback Issues / 影片播放問題**  
  If theater mode or quality settings are not applying as expected, verify your network connection and restart the app.

- **Multiple Instances / 多重執行個體**  
  The app now enforces a single instance. If you experience multiple windows, please update to the latest version.

---

## Contributions & License / 貢獻與授權

Feel free to fork the repository and submit pull requests. For any issues or suggestions, please open an issue on GitHub.  
歡迎 Fork 此專案並提交 Pull Request，有任何問題或建議，請於 GitHub 上開啟 issue。  

This project is licensed under the MIT License.  
本專案採用 MIT 授權條款。

---

## Contact / 聯絡方式

For any questions or feedback, please contact [Weitsenyu](mailto:tsenyuwork@gmail.com).  
如有疑問或回饋，請聯絡 [Weitsenyu](mailto:tsenyuwork@gmail.com).
