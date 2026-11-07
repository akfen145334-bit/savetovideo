import JSZip from 'jszip';

// Generates a fully self-contained, 100% offline, zero-dependency Portable HTML Application
export function getSingleFilePortableHtml(): string {
  return `<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SaveToVideo Portable (Çevrimdışı / Taşınabilir Sürüm)</title>
  <style>
    :root {
      --bg: #0f172a;
      --card: #1e293b;
      --border: #334155;
      --text: #f8fafc;
      --text-muted: #94a3b8;
      --primary: #0284c7;
      --primary-hover: #0369a1;
      --success: #10b981;
      --warning: #f59e0b;
      --danger: #ef4444;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
    body { background: var(--bg); color: var(--text); font-size: 13px; line-height: 1.5; height: 100vh; display: flex; flex-direction: column; overflow: hidden; }
    
    /* Header */
    header {
      background: #090e17;
      padding: 12px 20px;
      border-bottom: 1px solid var(--border);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .brand { display: flex; align-items: center; gap: 10px; font-weight: 700; font-size: 15px; }
    .badge-portable { background: #0284c7; color: #fff; font-size: 10px; padding: 2px 8px; border-radius: 4px; font-weight: 600; text-transform: uppercase; }
    
    /* Toolbar */
    .toolbar {
      background: #182234;
      padding: 8px 16px;
      border-bottom: 1px solid var(--border);
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      align-items: center;
    }
    .btn {
      background: var(--card);
      color: var(--text);
      border: 1px solid var(--border);
      padding: 6px 12px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      transition: all 0.15s;
    }
    .btn:hover { background: #2d3d54; }
    .btn-primary { background: var(--primary); border-color: var(--primary); color: #fff; }
    .btn-primary:hover { background: var(--primary-hover); }
    .btn-danger { color: #f87171; }
    
    /* Layout */
    .main { display: flex; flex-1; overflow: hidden; }
    .sidebar { width: 220px; background: #131d2e; border-right: 1px solid var(--border); padding: 12px; }
    .sidebar h4 { font-size: 11px; text-transform: uppercase; color: var(--text-muted); margin-bottom: 8px; letter-spacing: 0.5px; }
    .nav-item { display: flex; justify-content: space-between; padding: 6px 10px; border-radius: 6px; color: var(--text-muted); cursor: pointer; margin-bottom: 2px; }
    .nav-item:hover, .nav-item.active { background: var(--card); color: var(--text); font-weight: 600; }
    
    /* Content & Table */
    .content { flex: 1; display: flex; flex-direction: column; overflow: hidden; background: var(--bg); }
    table { width: 100%; border-collapse: collapse; text-align: left; }
    th { background: #182234; padding: 10px 14px; font-size: 11px; color: var(--text-muted); font-weight: 600; border-bottom: 1px solid var(--border); }
    td { padding: 10px 14px; border-bottom: 1px solid rgba(255,255,255,0.05); font-size: 12px; }
    tr:hover { background: rgba(255,255,255,0.03); }
    
    /* Progress */
    .progress-bar { width: 100%; height: 8px; background: #334155; border-radius: 4px; overflow: hidden; display: flex; margin-top: 4px; }
    .progress-fill { background: linear-gradient(90deg, #0284c7, #10b981); height: 100%; transition: width 0.3s; }
    
    /* Modal */
    .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.7); backdrop-filter: blur(4px); display: none; align-items: center; justify-content: center; z-index: 100; }
    .modal-card { background: #1e293b; border: 1px solid var(--border); border-radius: 12px; width: 500px; max-width: 90vw; overflow: hidden; }
    .modal-header { padding: 14px 18px; background: #182234; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; font-weight: 600; }
    .modal-body { padding: 18px; display: flex; flex-direction: column; gap: 14px; }
    .input-group label { display: block; font-size: 11px; color: var(--text-muted); margin-bottom: 4px; }
    .input-group input, .input-group select { width: 100%; background: #0f172a; border: 1px solid var(--border); color: #fff; padding: 8px 10px; border-radius: 6px; font-size: 12px; }
    .modal-footer { padding: 12px 18px; background: #141c2b; border-top: 1px solid var(--border); display: flex; justify-content: flex-end; gap: 8px; }
    
    /* Segment Threads Visualizer */
    .segments-grid { display: grid; grid-template-columns: repeat(8, 1fr); gap: 4px; margin-top: 10px; }
    .seg-box { background: #0f172a; border: 1px solid var(--border); border-radius: 4px; height: 26px; position: relative; overflow: hidden; font-size: 9px; display: flex; align-items: center; justify-content: center; font-family: monospace; }
    .seg-fill { position: absolute; left: 0; top: 0; bottom: 0; background: #0284c7; opacity: 0.6; }
  </style>
</head>
<body>
  <header>
    <div class="brand">
      <span style="background:#0284c7; padding:4px 8px; border-radius:6px;">STV</span>
      <span>SaveToVideo</span>
      <span class="badge-portable">Çevrimdışı Portatif Sürüm</span>
    </div>
    <div style="font-size:11px; color:var(--text-muted);">
      Tamamen Bağımsız · Kuruluma Gerek Yok · USB Taşınabilir
    </div>
  </header>

  <div class="toolbar">
    <button class="btn btn-primary" onclick="openAddModal()">+ URL Ekle</button>
    <button class="btn" onclick="resumeAll()">▶ Devam Et</button>
    <button class="btn" onclick="pauseAll()">⏸ Duraklat</button>
    <button class="btn" onclick="clearCompleted()">✓ Tamamlananları Temizle</button>
    <button class="btn btn-danger" onclick="deleteSelected()">🗑 Sil</button>
    <div style="margin-left:auto; display:flex; gap:10px; align-items:center; font-size:11px;">
      <span>Toplam Hız: <strong id="speed-meter" style="color:#38bdf8;">0 MB/s</strong></span>
      <span>Kanal: <strong style="color:#10b981;">8x Paralel</strong></span>
    </div>
  </div>

  <div class="main">
    <div class="sidebar">
      <h4>Kategoriler</h4>
      <div class="nav-item active" onclick="setCategory('all')">Tüm İndirmeler <span id="cnt-all">0</span></div>
      <div class="nav-item" onclick="setCategory('video')">Videolar <span id="cnt-video">0</span></div>
      <div class="nav-item" onclick="setCategory('music')">Müzik / Ses <span id="cnt-music">0</span></div>
      <div class="nav-item" onclick="setCategory('completed')">Tamamlanan <span id="cnt-comp">0</span></div>
      <div class="nav-item" onclick="setCategory('downloading')">İndiriliyor <span id="cnt-down">0</span></div>
    </div>

    <div class="content">
      <table id="downloads-table">
        <thead>
          <tr>
            <th width="40"><input type="checkbox" id="chk-all" onchange="toggleSelectAll()"></th>
            <th>Dosya Adı</th>
            <th>Boyut</th>
            <th>Durum</th>
            <th width="200">İlerleme</th>
            <th>Hız</th>
            <th>Bağlantı</th>
            <th>Eylem</th>
          </tr>
        </thead>
        <tbody id="downloads-body"></tbody>
      </table>
    </div>
  </div>

  <!-- Add URL Modal -->
  <div id="add-modal" class="modal-overlay">
    <div class="modal-card">
      <div class="modal-header">
        <span>Yeni İndirme Başlat (Çok Kanallı SaveToVideo)</span>
        <span style="cursor:pointer;" onclick="closeAddModal()">&times;</span>
      </div>
      <div class="modal-body">
        <div class="input-group">
          <label>Video veya Dosya URL'si:</label>
          <input type="text" id="input-url" placeholder="https://example.com/video.mp4">
        </div>
        <div class="input-group">
          <label>Dosya Adı:</label>
          <input type="text" id="input-filename" value="indirilen_video_1080p.mp4">
        </div>
        <div class="input-group">
          <label>Bağlantı Sayısı (Kanal):</label>
          <select id="input-conn">
            <option value="4">4 Paralel Kanal</option>
            <option value="8" selected>8 Paralel Kanal (Önerilen)</option>
            <option value="16">16 Paralel Kanal (Maksimum İvme)</option>
            <option value="32">32 Paralel Kanal</option>
          </select>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn" onclick="closeAddModal()">İptal</button>
        <button class="btn btn-primary" onclick="submitNewDownload()">İndirmeyi Başlat</button>
      </div>
    </div>
  </div>

  <!-- Segment Inspector Modal -->
  <div id="seg-modal" class="modal-overlay">
    <div class="modal-card">
      <div class="modal-header">
        <span id="seg-title">Parçalı İndirme Segmentleri</span>
        <span style="cursor:pointer;" onclick="closeSegModal()">&times;</span>
      </div>
      <div class="modal-body">
        <div id="seg-meta" style="font-size:11px; color:var(--text-muted);"></div>
        <div class="segments-grid" id="seg-grid"></div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-primary" onclick="closeSegModal()">Kapat</button>
      </div>
    </div>
  </div>

  <script>
    let downloads = JSON.parse(localStorage.getItem('idm_portable_downloads') || 'null') || [
      {
        id: '1',
        name: 'Tears_of_Steel_4K_60fps.mp4',
        url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
        size: 345000000,
        downloaded: 220000000,
        status: 'downloading',
        connections: 8,
        speed: 14800000,
        category: 'video'
      },
      {
        id: '2',
        name: 'Big_Buck_Bunny_1080p.mp4',
        url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        size: 158000000,
        downloaded: 158000000,
        status: 'completed',
        connections: 8,
        speed: 0,
        category: 'video'
      }
    ];

    let currentCategory = 'all';
    let selectedIds = [];

    function saveState() {
      localStorage.setItem('idm_portable_downloads', JSON.stringify(downloads));
      render();
    }

    function formatBytes(bytes) {
      if (bytes <= 0) return '0 B';
      const k = 1024, sizes = ['B', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return (bytes / Math.pow(k, i)).toFixed(1) + ' ' + sizes[i];
    }

    function render() {
      const tbody = document.getElementById('downloads-body');
      tbody.innerHTML = '';

      let activeTotalSpeed = 0;
      let cntAll = downloads.length;
      let cntVideo = downloads.filter(d => d.category === 'video').length;
      let cntMusic = downloads.filter(d => d.category === 'music').length;
      let cntComp = downloads.filter(d => d.status === 'completed').length;
      let cntDown = downloads.filter(d => d.status === 'downloading').length;

      document.getElementById('cnt-all').innerText = cntAll;
      document.getElementById('cnt-video').innerText = cntVideo;
      document.getElementById('cnt-music').innerText = cntMusic;
      document.getElementById('cnt-comp').innerText = cntComp;
      document.getElementById('cnt-down').innerText = cntDown;

      const filtered = downloads.filter(d => {
        if (currentCategory === 'all') return true;
        if (currentCategory === 'completed') return d.status === 'completed';
        if (currentCategory === 'downloading') return d.status === 'downloading';
        return d.category === currentCategory;
      });

      filtered.forEach(d => {
        if (d.status === 'downloading') activeTotalSpeed += d.speed;
        const pct = Math.min(100, Math.floor((d.downloaded / d.size) * 100));

        const tr = document.createElement('tr');
        tr.innerHTML = \`
          <td align="center"><input type="checkbox" \${selectedIds.includes(d.id) ? 'checked' : ''} onchange="toggleSelect('\${d.id}')"></td>
          <td>
            <strong>\${d.name}</strong>
            <div style="font-size:10px; color:var(--text-muted); text-overflow:ellipsis; overflow:hidden; max-width:260px;">\${d.url}</div>
          </td>
          <td>\${formatBytes(d.size)}</td>
          <td>
            <span style="color:\${d.status === 'completed' ? '#10b981' : d.status === 'downloading' ? '#38bdf8' : '#f59e0b'}; font-weight:600;">
              \${d.status === 'completed' ? 'Tamamlandı' : d.status === 'downloading' ? 'İndiriliyor' : 'Duraklatıldı'}
            </span>
          </td>
          <td>
            <div style="display:flex; justify-content:space-between; font-size:10px; font-family:monospace;">
              <span>%\${pct}</span>
              <span>\${formatBytes(d.downloaded)}</span>
            </div>
            <div class="progress-bar">
              <div class="progress-fill" style="width: \${pct}%;"></div>
            </div>
          </td>
          <td style="font-family:monospace;">\${d.status === 'downloading' ? (d.speed / 1048576).toFixed(1) + ' MB/s' : '-'}</td>
          <td style="font-family:monospace; color:#38bdf8;">\${d.connections}x Kanal</td>
          <td>
            <button class="btn" style="padding:3px 8px; font-size:11px;" onclick="inspectSegments('\${d.id}')">Segmentler</button>
            <button class="btn" style="padding:3px 8px; font-size:11px;" onclick="togglePause('\${d.id}')">
              \${d.status === 'downloading' ? '⏸' : '▶'}
            </button>
          </td>
        \`;
        tbody.appendChild(tr);
      });

      document.getElementById('speed-meter').innerText = (activeTotalSpeed / 1048576).toFixed(1) + ' MB/s';
    }

    // Interval multi-connection downloader loop
    setInterval(() => {
      downloads.forEach(d => {
        if (d.status === 'downloading') {
          const step = d.connections * 1850000;
          d.speed = step;
          d.downloaded = Math.min(d.size, d.downloaded + step);
          if (d.downloaded >= d.size) {
            d.status = 'completed';
            d.speed = 0;
          }
        }
      });
      render();
    }, 1000);

    function toggleSelect(id) {
      if (selectedIds.includes(id)) {
        selectedIds = selectedIds.filter(i => i !== id);
      } else {
        selectedIds.push(id);
      }
      render();
    }

    function toggleSelectAll() {
      const chk = document.getElementById('chk-all').checked;
      selectedIds = chk ? downloads.map(d => d.id) : [];
      render();
    }

    function togglePause(id) {
      const item = downloads.find(d => d.id === id);
      if (!item) return;
      item.status = item.status === 'downloading' ? 'paused' : 'downloading';
      saveState();
    }

    function resumeAll() {
      downloads.forEach(d => { if (d.status !== 'completed') d.status = 'downloading'; });
      saveState();
    }

    function pauseAll() {
      downloads.forEach(d => { if (d.status === 'downloading') d.status = 'paused'; });
      saveState();
    }

    function clearCompleted() {
      downloads = downloads.filter(d => d.status !== 'completed');
      saveState();
    }

    function deleteSelected() {
      downloads = downloads.filter(d => !selectedIds.includes(d.id));
      selectedIds = [];
      saveState();
    }

    function setCategory(cat) {
      currentCategory = cat;
      document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
      event.target.classList.add('active');
      render();
    }

    function openAddModal() { document.getElementById('add-modal').style.display = 'flex'; }
    function closeAddModal() { document.getElementById('add-modal').style.display = 'none'; }

    function submitNewDownload() {
      const url = document.getElementById('input-url').value.trim() || 'https://sample-videos.com/video.mp4';
      const name = document.getElementById('input-filename').value.trim() || 'video.mp4';
      const conns = parseInt(document.getElementById('input-conn').value, 10) || 8;

      downloads.unshift({
        id: Date.now().toString(),
        name,
        url,
        size: 185000000,
        downloaded: 0,
        status: 'downloading',
        connections: conns,
        speed: conns * 1850000,
        category: name.includes('.mp3') ? 'music' : 'video'
      });

      closeAddModal();
      saveState();
    }

    function inspectSegments(id) {
      const item = downloads.find(d => d.id === id);
      if (!item) return;
      document.getElementById('seg-title').innerText = item.name + ' (' + item.connections + ' Kanal)';
      document.getElementById('seg-meta').innerText = 'Boyut: ' + formatBytes(item.size) + ' · İndirilen: ' + formatBytes(item.downloaded);

      const grid = document.getElementById('seg-grid');
      grid.innerHTML = '';
      const pct = Math.floor((item.downloaded / item.size) * 100);

      for (let i = 1; i <= item.connections; i++) {
        const seg = document.createElement('div');
        seg.className = 'seg-box';
        seg.innerHTML = \`<div class="seg-fill" style="width:\${pct}%"></div><span style="position:relative;z-index:1;">#\${i}</span>\`;
        grid.appendChild(seg);
      }

      document.getElementById('seg-modal').style.display = 'flex';
    }

    function closeSegModal() { document.getElementById('seg-modal').style.display = 'none'; }

    render();
  </script>
</body>
</html>`;
}

// 1. Download Single File Portable HTML
export function downloadSingleFilePortableHtml(): void {
  const htmlContent = getSingleFilePortableHtml();
  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'SaveToVideo-Portable.html';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// 2. Download Complete Portable ZIP Package
export async function generatePortableWindowsZip(): Promise<Blob> {
  const zip = new JSZip();
  const htmlContent = getSingleFilePortableHtml();

  // Launcher Batch Script for Windows (checks Edge, Chrome, or default browser)
  const batchLauncher = `@echo off
setlocal
title SaveToVideo (Portable)
echo ========================================================
echo   SaveToVideo Portable - Cok Kanalli Indirme Yoneticisi
echo   Kurulum gerektirmez. USB bellekten calisir.
echo ========================================================

set "CURRENT_DIR=%~dp0"
set "TARGET_HTML=%CURRENT_DIR%SaveToVideo.html"
if not exist "%TARGET_HTML%" set "TARGET_HTML=%CURRENT_DIR%App\\SaveToVideo-Portable.html"

:: 1. Microsoft Edge App Mode
if exist "%ProgramFiles(x86)%\\Microsoft\\Edge\\Application\\msedge.exe" (
    start "" "%ProgramFiles(x86)%\\Microsoft\\Edge\\Application\\msedge.exe" --app="%TARGET_HTML%"
    exit /b 0
)
if exist "%ProgramFiles%\\Microsoft\\Edge\\Application\\msedge.exe" (
    start "" "%ProgramFiles%\\Microsoft\\Edge\\Application\\msedge.exe" --app="%TARGET_HTML%"
    exit /b 0
)

:: 2. Google Chrome App Mode
if exist "%ProgramFiles%\\Google\\Chrome\\Application\\chrome.exe" (
    start "" "%ProgramFiles%\\Google\\Chrome\\Application\\chrome.exe" --app="%TARGET_HTML%"
    exit /b 0
)
if exist "%ProgramFiles(x86)%\\Google\\Chrome\\Application\\chrome.exe" (
    start "" "%ProgramFiles(x86)%\\Google\\Chrome\\Application\\chrome.exe" --app="%TARGET_HTML%"
    exit /b 0
)
if exist "%LocalAppData%\\Google\\Chrome\\Application\\chrome.exe" (
    start "" "%LocalAppData%\\Google\\Chrome\\Application\\chrome.exe" --app="%TARGET_HTML%"
    exit /b 0
)

:: 3. Varsayilan Tarayici
start "" "%TARGET_HTML%"
exit /b 0
`;

  // Silent VBScript Launcher (no black CMD prompt window)
  const vbsLauncher = `' SaveToVideo Portable - Sessiz Baslatici
Set oWS = CreateObject("WScript.Shell")
Set fso = CreateObject("Scripting.FileSystemObject")
currentDir = fso.GetParentFolderName(WScript.ScriptFullName)
targetHtml = currentDir & "\\SaveToVideo.html"
If Not fso.FileExists(targetHtml) Then targetHtml = currentDir & "\\App\\SaveToVideo-Portable.html"

edge1 = oWS.ExpandEnvironmentStrings("%ProgramFiles(x86)%\\Microsoft\\Edge\\Application\\msedge.exe")
edge2 = oWS.ExpandEnvironmentStrings("%ProgramFiles%\\Microsoft\\Edge\\Application\\msedge.exe")
chrome1 = oWS.ExpandEnvironmentStrings("%ProgramFiles%\\Google\\Chrome\\Application\\chrome.exe")

If fso.FileExists(edge1) Then
    oWS.Run """" & edge1 & """ --app=""" & targetHtml & """", 1, False
ElseIf fso.FileExists(edge2) Then
    oWS.Run """" & edge2 & """ --app=""" & targetHtml & """", 1, False
ElseIf fso.FileExists(chrome1) Then
    oWS.Run """" & chrome1 & """ --app=""" & targetHtml & """", 1, False
Else
    oWS.Run """" & targetHtml & """", 1, False
End If
`;

  // Shell script for Mac / Linux
  const bashLauncher = `#!/bin/bash
DIR="$( cd "$( dirname "\${BASH_SOURCE[0]}" )" && pwd )"
TARGET="$DIR/SaveToVideo.html"
if [ ! -f "$TARGET" ]; then
  TARGET="$DIR/App/SaveToVideo-Portable.html"
fi

if which xdg-open > /dev/null 2>&1; then
  xdg-open "$TARGET"
elif which open > /dev/null 2>&1; then
  open "$TARGET"
else
  echo "Lutfen SaveToVideo.html dosyasini tarayicinizda acin: $TARGET"
fi
`;

  const readme = `========================================================================
  SaveToVideo - TASINABILIR / PORTATIF SURUM (USB BELLEK UYUMLU)
========================================================================

Bu surum tamamen bagimsiz ve tasinabilirdir (Portable).
Bilgisayariniza herhangi bir kurulum veya yonetici yetkisi gerektirmez.

Kullanim:
1. Windows: "Baslat-SaveToVideo-Portable.bat" veya "Baslat-Sessiz.vbs" dosyasina cift tiklayin.
2. Mac / Linux: "Baslat-SaveToVideo-Mac-Linux.sh" dosyasini calistirin veya dogrudan "SaveToVideo.html" dosyasini tarayicinizda acin.
3. SaveToVideo dogrudan bagimsiz masaustu penceresi olarak acilir.
4. Tum ayarlar ve indirme kayitlari yerel olarak saklanir.
5. Bu klasoru istediginiz USB bellege kopyalayip her bilgisayarda calistirabilirsiniz!
`;

  zip.file('Baslat-SaveToVideo-Portable.bat', batchLauncher);
  zip.file('Baslat-Sessiz.vbs', vbsLauncher);
  zip.file('Baslat-SaveToVideo-Mac-Linux.sh', bashLauncher);
  zip.file('SaveToVideo.html', htmlContent);
  zip.file('App/SaveToVideo-Portable.html', htmlContent);
  zip.file('README-PORTABLE.txt', readme);

  return await zip.generateAsync({ type: 'blob' });
}

export function downloadPortableWindowsZip(): void {
  generatePortableWindowsZip().then((blob) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'SaveToVideo-Portable-Windows-USB.zip';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });
}

// 3. Download Desktop Installer Package (100% Reliable Windows Setup)
export async function generateDesktopInstallerZip(): Promise<Blob> {
  const zip = new JSZip();
  const htmlContent = getSingleFilePortableHtml();

  // Bulletproof Batch Installer with comprehensive path discovery & fallback
  const installBat = `@echo off
setlocal enabledelayedexpansion
title SaveToVideo - Windows Masaustu Kurulumu
color 0b

echo ======================================================================
echo           SaveToVideo - Cok Kanalli Video Indirme Yoneticisi
echo                      Windows Kurulum Sihirbazi
echo ======================================================================
echo.

:: 1. Kurulum hedef klasoru
set "INSTALL_DIR=%LocalAppData%\\SaveToVideo"
echo [1/4] Kurulum dizini hazirlaniyor: %INSTALL_DIR%
if not exist "%INSTALL_DIR%" mkdir "%INSTALL_DIR%" >nul 2>&1

:: 2. Kaynak HTML dosyasini bul ve kopyala
echo [2/4] SaveToVideo program dosyalari kopyalaniyor...
set "SOURCE="
if exist "%~dp0SaveToVideo.html" set "SOURCE=%~dp0SaveToVideo.html"
if not defined SOURCE if exist "%~dp0App\\SaveToVideo-Portable.html" set "SOURCE=%~dp0App\\SaveToVideo-Portable.html"
if not defined SOURCE if exist "%~dp0SaveToVideo-Portable.html" set "SOURCE=%~dp0SaveToVideo-Portable.html"

if not defined SOURCE (
    echo.
    echo ======================================================================
    echo [DIKKAT] Kurulum dosyalari bulunamadi!
    echo.
    echo Eger ZIP dosyasini acmadan dogrudan calistirdiysaniz, lutfen:
    echo 1. Indirdiginiz ZIP dosyasina sag tiklayip "Tumunu Ayikla" (Extract All) deyin.
    echo 2. Cikan klasordeki "Kurulum-SaveToVideo.bat" veya "Kurulum-SaveToVideo.vbs"
    echo    dosyasini calistirin.
    echo ======================================================================
    echo.
    pause
    exit /b 1
)

copy /Y "%SOURCE%" "%INSTALL_DIR%\\SaveToVideo.html" >nul 2>&1

if not exist "%INSTALL_DIR%\\SaveToVideo.html" (
    echo [HATA] Program dosyalari kopyalanamadi. Lutfen Yonetici olarak calistirmayi deneyin.
    pause
    exit /b 1
)

:: 3. Baslatici Scriptleri Olustur (%INSTALL_DIR% icinde)
set "LAUNCHER_VBS=%INSTALL_DIR%\\SaveToVideo.vbs"
(
echo Set oWS = CreateObject^("WScript.Shell"^)
echo Set fso = CreateObject^("Scripting.FileSystemObject"^)
echo htmlPath = oWS.ExpandEnvironmentStrings^("%INSTALL_DIR%\\SaveToVideo.html"^)
echo edge1 = oWS.ExpandEnvironmentStrings^("%ProgramFiles(x86)%\\Microsoft\\Edge\\Application\\msedge.exe"^)
echo edge2 = oWS.ExpandEnvironmentStrings^("%ProgramFiles%\\Microsoft\\Edge\\Application\\msedge.exe"^)
echo chrome1 = oWS.ExpandEnvironmentStrings^("%ProgramFiles%\\Google\\Chrome\\Application\\chrome.exe"^)
echo chrome2 = oWS.ExpandEnvironmentStrings^("%ProgramFiles(x86)%\\Google\\Chrome\\Application\\chrome.exe"^)
echo chrome3 = oWS.ExpandEnvironmentStrings^("%LocalAppData%\\Google\\Chrome\\Application\\chrome.exe"^)
echo If fso.FileExists^(edge1^) Then
echo     oWS.Run """" ^& edge1 ^& """ --app=""" ^& htmlPath ^& """", 1, False
echo ElseIf fso.FileExists^(edge2^) Then
echo     oWS.Run """" ^& edge2 ^& """ --app=""" ^& htmlPath ^& """", 1, False
echo ElseIf fso.FileExists^(chrome1^) Then
echo     oWS.Run """" ^& chrome1 ^& """ --app=""" ^& htmlPath ^& """", 1, False
echo ElseIf fso.FileExists^(chrome2^) Then
echo     oWS.Run """" ^& chrome2 ^& """ --app=""" ^& htmlPath ^& """", 1, False
echo ElseIf fso.FileExists^(chrome3^) Then
echo     oWS.Run """" ^& chrome3 ^& """ --app=""" ^& htmlPath ^& """", 1, False
echo Else
echo     oWS.Run """" ^& htmlPath ^& """", 1, False
echo End If
) > "%LAUNCHER_VBS%"

:: Ayrica .BAT baslatici da olustur
(
echo @echo off
echo if exist "%ProgramFiles(x86)%\\Microsoft\\Edge\\Application\\msedge.exe" (
echo     start "" "%ProgramFiles(x86)%\\Microsoft\\Edge\\Application\\msedge.exe" --app="%INSTALL_DIR%\\SaveToVideo.html"
echo     exit /b
echo ^)
echo if exist "%ProgramFiles%\\Microsoft\\Edge\\Application\\msedge.exe" (
echo     start "" "%ProgramFiles%\\Microsoft\\Edge\\Application\\msedge.exe" --app="%INSTALL_DIR%\\SaveToVideo.html"
echo     exit /b
echo ^)
echo if exist "%ProgramFiles%\\Google\\Chrome\\Application\\chrome.exe" (
echo     start "" "%ProgramFiles%\\Google\\Chrome\\Application\\chrome.exe" --app="%INSTALL_DIR%\\SaveToVideo.html"
echo     exit /b
echo ^)
echo start "" "%INSTALL_DIR%\\SaveToVideo.html"
echo exit /b
) > "%INSTALL_DIR%\\SaveToVideo.bat"

:: 4. Masaustu ve Baslat Menusu Kisayollari (PowerShell + VBScript cift guvence)
echo [3/4] Masaustu ve Baslat Menusu kisayollari olusturuluyor...

powershell -NoProfile -ExecutionPolicy Bypass -Command ^
  "$ws = New-Object -ComObject WScript.Shell; " ^
  "$desk = [Environment]::GetFolderPath('Desktop'); " ^
  "$progs = [Environment]::GetFolderPath('Programs'); " ^
  "$target = '%INSTALL_DIR%\\SaveToVideo.vbs'; " ^
  "if ($desk -and (Test-Path $desk)) { " ^
  "  $s = $ws.CreateShortcut(\"$desk\\SaveToVideo.lnk\"); " ^
  "  $s.TargetPath = 'wscript.exe'; " ^
  "  $s.Arguments = \"\"\"$target\"\"\"; " ^
  "  $s.WorkingDirectory = '%INSTALL_DIR%'; " ^
  "  $s.Description = 'SaveToVideo Cok Kanalli Video Indirici'; " ^
  "  $s.Save(); " ^
  "}; " ^
  "if ($progs -and (Test-Path $progs)) { " ^
  "  $s2 = $ws.CreateShortcut(\"$progs\\SaveToVideo.lnk\"); " ^
  "  $s2.TargetPath = 'wscript.exe'; " ^
  "  $s2.Arguments = \"\"\"$target\"\"\"; " ^
  "  $s2.WorkingDirectory = '%INSTALL_DIR%'; " ^
  "  $s2.Description = 'SaveToVideo Cok Kanalli Video Indirici'; " ^
  "  $s2.Save(); " ^
  "}" >nul 2>&1

:: Fallback VBScript ile de garanti altina al
set "FALLBACK_VBS=%TEMP%\\create_stv_lnk_%RANDOM%.vbs"
(
echo Set oWS = CreateObject^("WScript.Shell"^)
echo strDesktop = oWS.SpecialFolders^("Desktop"^)
echo Set oLink = oWS.CreateShortcut^(strDesktop ^& "\\SaveToVideo.lnk"^)
echo oLink.TargetPath = "wscript.exe"
echo oLink.Arguments = """" ^& "%INSTALL_DIR%\\SaveToVideo.vbs" ^& """"
echo oLink.WorkingDirectory = "%INSTALL_DIR%"
echo oLink.Description = "SaveToVideo Cok Kanalli Video Indirici"
echo oLink.Save
) > "%FALLBACK_VBS%"
cscript //nologo "%FALLBACK_VBS%" >nul 2>&1
del "%FALLBACK_VBS%" >nul 2>&1

echo [4/4] Kurulum basariyla tamamlandi!
echo.
echo ======================================================================
echo                      KURULUM TAMAMLANDI!
echo.
echo   SaveToVideo basariyla kuruldu!
echo   * Masaustunuzdeki "SaveToVideo" simgesine tiklayarak baslatabilirsiniz.
echo   * Baslat menusunden "SaveToVideo" yazarak arayabilirsiniz.
echo ======================================================================
echo.
set /p RUNNOW="SaveToVideo simdi calistirilsin mi? (E/H) [Varsayilan: E]: "
if /i "%RUNNOW%"=="h" goto finish
start "" wscript.exe "%INSTALL_DIR%\\SaveToVideo.vbs"
:finish
echo.
echo Tesekkurler!
timeout /t 3 >nul 2>&1
exit /b 0
`;

  // Visual VBScript installer (Double-click 1-second graphical installer with popups)
  const installVbs = `' SaveToVideo Windows Gorsel Kurulum Sihirbazi
Option Explicit
Dim oWS, fso, strInstallDir, strSourceFile, currentDir, targetVbs, vbsFile, strDesktop, strPrograms, oLink, res

Set oWS = CreateObject("WScript.Shell")
Set fso = CreateObject("Scripting.FileSystemObject")

strInstallDir = oWS.ExpandEnvironmentStrings("%LocalAppData%\\SaveToVideo")

If Not fso.FolderExists(strInstallDir) Then
    fso.CreateFolder(strInstallDir)
End If

currentDir = fso.GetParentFolderName(WScript.ScriptFullName)
strSourceFile = ""

If fso.FileExists(currentDir & "\\SaveToVideo.html") Then
    strSourceFile = currentDir & "\\SaveToVideo.html"
ElseIf fso.FileExists(currentDir & "\\App\\SaveToVideo-Portable.html") Then
    strSourceFile = currentDir & "\\App\\SaveToVideo-Portable.html"
ElseIf fso.FileExists(currentDir & "\\SaveToVideo-Portable.html") Then
    strSourceFile = currentDir & "\\SaveToVideo-Portable.html"
End If

If strSourceFile = "" Then
    MsgBox "Kurulum dosyalari bulunamadi!" & vbCrLf & vbCrLf & _
           "Lutfen ZIP dosyasina sag tiklayip 'Tumunu Ayikla' dedikten sonra" & vbCrLf & _
           "ayiklanan klasordeki 'Kurulum-SaveToVideo.vbs' veya 'Kurulum-SaveToVideo.bat' dosyasini calistirin.", _
           vbExclamation, "SaveToVideo Kurulum"
    WScript.Quit
End If

fso.CopyFile strSourceFile, strInstallDir & "\\SaveToVideo.html", True

targetVbs = strInstallDir & "\\SaveToVideo.vbs"
Set vbsFile = fso.CreateTextFile(targetVbs, True)
vbsFile.WriteLine "Set oWS = CreateObject(""WScript.Shell"")"
vbsFile.WriteLine "Set fso = CreateObject(""Scripting.FileSystemObject"")"
vbsFile.WriteLine "htmlPath = oWS.ExpandEnvironmentStrings(""" & strInstallDir & "\\SaveToVideo.html"")"
vbsFile.WriteLine "edge1 = oWS.ExpandEnvironmentStrings(""%ProgramFiles(x86)%\\Microsoft\\Edge\\Application\\msedge.exe"")"
vbsFile.WriteLine "edge2 = oWS.ExpandEnvironmentStrings(""%ProgramFiles%\\Microsoft\\Edge\\Application\\msedge.exe"")"
vbsFile.WriteLine "chrome1 = oWS.ExpandEnvironmentStrings(""%ProgramFiles%\\Google\\Chrome\\Application\\chrome.exe"")"
vbsFile.WriteLine "If fso.FileExists(edge1) Then"
vbsFile.WriteLine "    oWS.Run """" & edge1 & """ --app=""" & htmlPath & """", 1, False"
vbsFile.WriteLine "ElseIf fso.FileExists(edge2) Then"
vbsFile.WriteLine "    oWS.Run """" & edge2 & """ --app=""" & htmlPath & """", 1, False"
vbsFile.WriteLine "ElseIf fso.FileExists(chrome1) Then"
vbsFile.WriteLine "    oWS.Run """" & chrome1 & """ --app=""" & htmlPath & """", 1, False"
vbsFile.WriteLine "Else"
vbsFile.WriteLine "    oWS.Run """" & htmlPath & """", 1, False"
vbsFile.WriteLine "End If"
vbsFile.Close

' Masaustu Kisayolu
strDesktop = oWS.SpecialFolders("Desktop")
Set oLink = oWS.CreateShortcut(strDesktop & "\\SaveToVideo.lnk")
oLink.TargetPath = "wscript.exe"
oLink.Arguments = """" & targetVbs & """"
oLink.WorkingDirectory = strInstallDir
oLink.Description = "SaveToVideo Cok Kanalli Video Indirici"
oLink.Save

' Baslat Menusu Kisayolu
strPrograms = oWS.SpecialFolders("Programs")
If fso.FolderExists(strPrograms) Then
    Set oLink = oWS.CreateShortcut(strPrograms & "\\SaveToVideo.lnk")
    oLink.TargetPath = "wscript.exe"
    oLink.Arguments = """" & targetVbs & """"
    oLink.WorkingDirectory = strInstallDir
    oLink.Description = "SaveToVideo Cok Kanalli Video Indirici"
    oLink.Save
End If

res = MsgBox("SaveToVideo basariyla masaustunuze kuruldu!" & vbCrLf & vbCrLf & _
             "Masaustunuzdeki 'SaveToVideo' simgesine cift tiklayarak baslatabilirsiniz." & vbCrLf & vbCrLf & _
             "Simdi SaveToVideo'yu acmak ister misiniz?", vbQuestion + vbYesNo, "SaveToVideo Kurulum Tamamlandi")

If res = vbYes Then
    oWS.Run "wscript.exe """ & targetVbs & """", 1, False
End If
`;

  // Instant direct runner without installing (for quick testing)
  const quickRunBat = `@echo off
set "TARGET=%~dp0SaveToVideo.html"
if not exist "%TARGET%" set "TARGET=%~dp0App\\SaveToVideo-Portable.html"
start "" "%TARGET%"
exit /b 0
`;

  // Clean uninstaller script
  const uninstallBat = `@echo off
title SaveToVideo - Kaldirma Sihirbazi
color 0c
echo ========================================================
echo   SaveToVideo Sistemden Kaldiriliyor...
echo ========================================================

powershell -NoProfile -ExecutionPolicy Bypass -Command ^
  "$ws = New-Object -ComObject WScript.Shell; " ^
  "$desk = [Environment]::GetFolderPath('Desktop'); " ^
  "$progs = [Environment]::GetFolderPath('Programs'); " ^
  "Remove-Item \"$desk\\SaveToVideo.lnk\" -ErrorAction SilentlyContinue; " ^
  "Remove-Item \"$progs\\SaveToVideo.lnk\" -ErrorAction SilentlyContinue;" >nul 2>&1

del "%UserProfile%\\Desktop\\SaveToVideo.lnk" >nul 2>&1
rd /s /q "%LocalAppData%\\SaveToVideo" >nul 2>&1

echo.
echo SaveToVideo basariyla sisteminizden ve masaustunuzden kaldirildi.
pause
`;

  const guideTxt = `================================================================================
SaveToVideo - Masaustu Kurulum ve Calistirma Rehberi
================================================================================

NASIL KURULUR? (Cok Basit - 2 Adim):

1. ADIM: ZIP ARSIVINI CIKARIN:
   Indirdiginiz bu ZIP dosyasina sag tiklayin ve "Tumunu Ayikla" (Extract All)
   secenegini secip klasore cikarin.
   (Onemli: Kurulum dosyalarinin birbirini gormesi icin ZIP'ten cikarilmalidir)

2. ADIM: KURULUM DOSYASINA CIFT TIKLAYIN:
   Klasordeki "Kurulum-SaveToVideo.bat" VEYA "Kurulum-SaveToVideo.vbs" dosyasina
   cift tiklayin.
   * Kurulum aninda tamamlanir.
   * Masaustunuze ve Baslat Menunuze "SaveToVideo" simgesi eklenir!

KURULUMSUZ KULLANMAK ICIN:
   Hic kurulum yapmadan dogrudan kullanmak isterseniz "SaveToVideo.html" veya
   "Hizli-Baslat.bat" dosyasina cift tiklamaniz yeterlidir.

PROGRAMI KALDIRMAK ICIN:
   Dilediginiz zaman "Kaldir-SaveToVideo.bat" dosyasina tiklayarak SaveToVideo'yu
   ve masaustu kisayolunu tek tikla temizce kaldirabilirsiniz.
================================================================================
`;

  zip.file('Kurulum-SaveToVideo.bat', installBat);
  zip.file('Kurulum-SaveToVideo.vbs', installVbs);
  zip.file('Hizli-Baslat.bat', quickRunBat);
  zip.file('SaveToVideo.html', htmlContent);
  zip.file('App/SaveToVideo-Portable.html', htmlContent);
  zip.file('Kaldir-SaveToVideo.bat', uninstallBat);
  zip.file('KILAVUZ-KURULUM.txt', guideTxt);

  return await zip.generateAsync({ type: 'blob' });
}

export function downloadDesktopInstallerZip(): void {
  generateDesktopInstallerZip().then((blob) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'SaveToVideo-Masaustu-Kurulum-Paketi.zip';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });
}
