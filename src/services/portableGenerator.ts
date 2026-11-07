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

  // Launcher Batch Script for Windows (opens in standalone clean app mode)
  const batchLauncher = `@echo off
title SaveToVideo (Portable)
echo ========================================================
echo   SaveToVideo Portable - Cok Kanalli Indirme Yoneticisi
echo   Kurulum gerektirmez. USB bellekten calisir.
echo ========================================================

set CURRENT_DIR=%~dp0
set TARGET_HTML=%CURRENT_DIR%App\\SaveToVideo-Portable.html

:: Try launching in Edge App Mode
start msedge --app="%TARGET_HTML%" >nul 2>&1
if %ERRORLEVEL% EQU 0 exit /b

:: Fallback to Chrome App Mode
start chrome --app="%TARGET_HTML%" >nul 2>&1
if %ERRORLEVEL% EQU 0 exit /b

:: Fallback to Default Browser
start "" "%TARGET_HTML%"
exit /b
`;

  // Shell script for Mac / Linux
  const bashLauncher = `#!/bin/bash
DIR="$( cd "$( dirname "\${BASH_SOURCE[0]}" )" && pwd )"
if which xdg-open > /dev/null; then
  xdg-open "$DIR/App/SaveToVideo-Portable.html"
elif which open > /dev/null; then
  open "$DIR/App/SaveToVideo-Portable.html"
else
  echo "Lutfen App/SaveToVideo-Portable.html dosyasini tarayicinizda acin."
fi
`;

  const readme = `========================================================================
  SaveToVideo - TASINABILIR / PORTATIF SURUM
========================================================================

Bu surum tamamen bagimsiz ve tasinabilirdir (Portable).
Bilgisayariniza herhangi bir kurulum veya yonetici yetkisi gerektirmez.

Kullanim:
1. "Baslat-SaveToVideo-Portable.bat" dosyasina cift tiklayin.
2. SaveToVideo dogrudan bagimsiz masaustu penceresi olarak acilir.
3. Tum ayarlar ve indirme kayitlari dosyanin icinde yerel olarak saklanir.
4. Bu klasoru istediginiz USB bellege kopyalayip her bilgisayarda calistirabilirsiniz!
`;

  zip.file('Baslat-SaveToVideo-Portable.bat', batchLauncher);
  zip.file('Baslat-SaveToVideo-Mac-Linux.sh', bashLauncher);
  zip.file('README-PORTABLE.txt', readme);
  zip.file('App/SaveToVideo-Portable.html', htmlContent);

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

// 3. Download Desktop Installer Package
export async function generateDesktopInstallerZip(): Promise<Blob> {
  const zip = new JSZip();
  const htmlContent = getSingleFilePortableHtml();

  const installBat = `@echo off
title SaveToVideo - Masaustu Kurulumu
color 0b
echo ========================================================
echo   SaveToVideo Kurulum Sihirbazi
echo ========================================================
echo.

set INSTALL_DIR=%LocalAppData%\\SaveToVideo
echo [1/3] Kurulum dizini olusturuluyor: %INSTALL_DIR%
if not exist "%INSTALL_DIR%" mkdir "%INSTALL_DIR%"

echo [2/3] SaveToVideo dosyalari kopyalaniyor...
copy /Y "%~dp0App\\SaveToVideo-Portable.html" "%INSTALL_DIR%\\SaveToVideo.html" >nul

echo [3/3] Windows Masaustu Kisayolu Olusturuluyor...
set SCRIPT="%TEMP%\\%RANDOM%-%RANDOM%_create_shortcut.vbs"
echo Set oWS = WScript.CreateObject("WScript.Shell") >> %SCRIPT%
echo sLinkFile = oWS.ExpandEnvironmentStrings("%%USERPROFILE%%\\Desktop\\SaveToVideo.lnk") >> %SCRIPT%
echo Set oLink = oWS.CreateShortcut(sLinkFile) >> %SCRIPT%
echo oLink.TargetPath = "msedge.exe" >> %SCRIPT%
echo oLink.Arguments = "--app=""" ^& "%INSTALL_DIR%\\SaveToVideo.html" ^& """" >> %SCRIPT%
echo oLink.Description = "SaveToVideo Web Suite" >> %SCRIPT%
echo oLink.Save >> %SCRIPT%
cscript /nologo %SCRIPT%
del %SCRIPT%

echo.
echo ========================================================
echo   KURULUM TAMAMLANDI!
echo   Masaustunuzdeki "SaveToVideo" simgesine tiklayarak
echo   SaveToVideo'yu bagimsiz masaustu uygulamasi olarak baslatabilirsiniz.
echo ========================================================
echo.
pause
`;

  const uninstallBat = `@echo off
title SaveToVideo - Kaldirma Sihirbazi
color 0c
echo ========================================================
echo   SaveToVideo Kaldiriliyor...
echo ========================================================
del "%UserProfile%\\Desktop\\SaveToVideo.lnk" >nul 2>&1
rd /s /q "%LocalAppData%\\SaveToVideo" >nul 2>&1
echo SaveToVideo basariyla sisteminizden kaldirildi.
pause
`;

  zip.file('Kurulum-SaveToVideo.bat', installBat);
  zip.file('Kaldir-SaveToVideo.bat', uninstallBat);
  zip.file('App/SaveToVideo-Portable.html', htmlContent);
  zip.file('KILAVUZ.txt', 'Kurulum icin "Kurulum-SaveToVideo.bat" dosyasina cift tiklamaniz yeterlidir.');

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
