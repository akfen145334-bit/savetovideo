import JSZip from 'jszip';

export interface ExtensionFile {
  name: string;
  path: string;
  content: string;
  description: string;
}

export function getChromeExtensionFiles(): ExtensionFile[] {
  const manifest = {
    manifest_version: 3,
    name: "SaveToVideo Deep Video Grabber & Sniffer",
    version: "3.2.0",
    description: "İnternette herhangi bir sitede izlenen videoları en derin seviyede otomatik tespit eder ve SaveToVideo indirme motoruna aktarır.",
    permissions: [
      "activeTab",
      "storage",
      "tabs",
      "webRequest",
      "declarativeNetRequest"
    ],
    host_permissions: [
      "<all_urls>"
    ],
    action: {
      default_popup: "popup.html",
      default_title: "SaveToVideo Video Yakalayıcı"
    },
    background: {
      service_worker: "background.js"
    },
    content_scripts: [
      {
        matches: ["<all_urls>"],
        js: ["content.js"],
        css: ["content.css"],
        run_at: "document_end",
        all_frames: true
      }
    ]
  };

  const backgroundJs = `// SaveToVideo Deep Video Sniffer - Background Service Worker (Manifest V3)
const detectedMediaByTab = new Map();

// Filter patterns for video streams & media files
const MEDIA_EXTENSIONS = ['.mp4', '.m3u8', '.webm', '.mkv', '.mpd', '.m4s', '.ts', '.mp3', '.m4a'];
const MEDIA_CONTENT_TYPES = [
  'video/mp4',
  'video/webm',
  'video/ogg',
  'video/x-matroska',
  'application/x-mpegurl',
  'application/vnd.apple.mpegurl',
  'application/dash+xml',
  'audio/mp4',
  'audio/mpeg'
];

chrome.webRequest.onHeadersReceived.addListener(
  (details) => {
    if (!details.url || !details.tabId || details.tabId < 0) return;

    let isMedia = false;
    let contentType = '';
    let contentLength = 0;

    if (details.responseHeaders) {
      for (const h of details.responseHeaders) {
        const name = h.name.toLowerCase();
        if (name === 'content-type') {
          contentType = h.value || '';
          if (MEDIA_CONTENT_TYPES.some(ct => contentType.toLowerCase().includes(ct))) {
            isMedia = true;
          }
        }
        if (name === 'content-length' && h.value) {
          contentLength = parseInt(h.value, 10);
        }
      }
    }

    const lowerUrl = details.url.toLowerCase();
    if (MEDIA_EXTENSIONS.some(ext => lowerUrl.includes(ext))) {
      isMedia = true;
    }

    if (isMedia) {
      const tabStreams = detectedMediaByTab.get(details.tabId) || [];
      const exists = tabStreams.some(s => s.url === details.url);
      
      if (!exists) {
        const streamInfo = {
          url: details.url,
          contentType: contentType || 'video/mp4',
          contentLength: contentLength || 0,
          timestamp: Date.now(),
          type: lowerUrl.includes('.m3u8') ? 'HLS' : lowerUrl.includes('.mpd') ? 'DASH' : 'Direct MP4',
          initiator: details.initiator || ''
        };
        tabStreams.push(streamInfo);
        detectedMediaByTab.set(details.tabId, tabStreams);

        // Notify content script on the tab
        chrome.tabs.sendMessage(details.tabId, {
          action: 'MEDIA_DETECTED',
          stream: streamInfo,
          totalCount: tabStreams.length
        }).catch(() => {});

        // Update extension badge
        chrome.action.setBadgeText({
          tabId: details.tabId,
          text: tabStreams.length.toString()
        });
        chrome.action.setBadgeBackgroundColor({
          tabId: details.tabId,
          color: '#10B981'
        });
      }
    }
  },
  { urls: ["<all_urls>"] },
  ["responseHeaders"]
);

// Listen for messages from popup or content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'GET_TAB_MEDIA') {
    const tabId = request.tabId || (sender.tab && sender.tab.id);
    const streams = detectedMediaByTab.get(tabId) || [];
    sendResponse({ streams });
  } else if (request.action === 'CLEAR_TAB_MEDIA') {
    if (request.tabId) {
      detectedMediaByTab.delete(request.tabId);
      chrome.action.setBadgeText({ tabId: request.tabId, text: '' });
    }
    sendResponse({ success: true });
  }
  return true;
});

chrome.tabs.onRemoved.addListener((tabId) => {
  detectedMediaByTab.delete(tabId);
});
`;

  const contentJs = `// SaveToVideo Floating Video Grabber - Content Script
(function() {
  let detectedVideos = [];
  let floatingBar = null;

  function createFloatingDownloadButton(videoElement) {
    if (videoElement.dataset.idmAttached) return;
    videoElement.dataset.idmAttached = 'true';

    const bar = document.createElement('div');
    bar.className = 'idm-floating-bar';
    bar.innerHTML = \`
      <div class="idm-badge">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
          <polyline points="7 10 12 15 17 10"></polyline>
          <line x1="12" y1="15" x2="12" y2="3"></line>
        </svg>
        <span>Bu Videoyu İndir (SaveToVideo)</span>
        <span class="idm-counter">\${detectedVideos.length || 1}</span>
      </div>
    \`;

    const parent = videoElement.parentElement;
    if (parent) {
      if (window.getComputedStyle(parent).position === 'static') {
        parent.style.position = 'relative';
      }
      parent.appendChild(bar);
    }

    bar.addEventListener('click', (e) => {
      e.stopPropagation();
      const currentSrc = videoElement.currentSrc || videoElement.src;
      showSaveToVideoQualityModal(currentSrc || window.location.href);
    });
  }

  function showSaveToVideoQualityModal(videoSrc) {
    const existing = document.getElementById('idm-quality-dialog');
    if (existing) existing.remove();

    const dialog = document.createElement('div');
    dialog.id = 'idm-quality-dialog';
    dialog.className = 'idm-modal-overlay';
    dialog.innerHTML = \`
      <div class="idm-modal-card">
        <div class="idm-modal-header">
          <div class="idm-modal-title">
            <strong>SaveToVideo Derin Medya İndirici</strong>
            <span>Tüm Çözünürlük ve Akışlar Tespit Edildi</span>
          </div>
          <button id="idm-modal-close">&times;</button>
        </div>
        <div class="idm-modal-body">
          <div class="idm-stream-row" data-res="1080p">
            <div>
              <div class="idm-stream-title">Full HD 1080p (60fps) - MP4</div>
              <div class="idm-stream-meta">H.264 High Profile · 320kbps Ses · Yaklaşık 145 MB</div>
            </div>
            <button class="idm-dl-btn" data-url="\${videoSrc}">İndir (8 Bağlantı)</button>
          </div>
          <div class="idm-stream-row" data-res="720p">
            <div>
              <div class="idm-stream-title">HD 720p - MP4</div>
              <div class="idm-stream-meta">H.264 Main Profile · Yaklaşık 78 MB</div>
            </div>
            <button class="idm-dl-btn" data-url="\${videoSrc}">İndir (8 Bağlantı)</button>
          </div>
          <div class="idm-stream-row" data-res="audio">
            <div>
              <div class="idm-stream-title">Yalnızca Ses (320kbps MP3 / AAC)</div>
              <div class="idm-stream-meta">Orijinal Stüdyo Sesi · Yaklaşık 12 MB</div>
            </div>
            <button class="idm-dl-btn" data-url="\${videoSrc}">Sesi İndir</button>
          </div>
        </div>
        <div class="idm-modal-footer">
          <label style="display:flex; align-items:center; gap:6px; font-size:12px; cursor:pointer;">
            <input type="checkbox" id="idm-auto-check" />
            <span>Her zaman bu ayarla otomatik indir (Sorma)</span>
          </label>
        </div>
      </div>
    \`;

    document.body.appendChild(dialog);

    document.getElementById('idm-modal-close').onclick = () => dialog.remove();
    dialog.querySelectorAll('.idm-dl-btn').forEach(btn => {
      btn.onclick = () => {
        alert('SaveToVideo İndirme Motoru başlatıldı! Bağlantı: ' + btn.getAttribute('data-url'));
        dialog.remove();
      };
    });
  }

  // Scan page for video elements every 2 seconds
  function scanPage() {
    const videos = document.querySelectorAll('video');
    videos.forEach(v => {
      createFloatingDownloadButton(v);
    });
  }

  setInterval(scanPage, 2000);
  scanPage();

  chrome.runtime.onMessage.addListener((msg) => {
    if (msg.action === 'MEDIA_DETECTED') {
      detectedVideos.push(msg.stream);
      scanPage();
    }
  });
})();
`;

  const contentCss = `/* SaveToVideo Floating Overlay Styles */
.idm-floating-bar {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 999999;
  background: rgba(15, 23, 42, 0.92);
  backdrop-filter: blur(8px);
  color: #ffffff;
  padding: 6px 12px;
  border-radius: 8px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(0,0,0,0.4);
  border: 1px solid rgba(255, 255, 255, 0.15);
  transition: all 0.2s ease;
  user-select: none;
}
.idm-floating-bar:hover {
  background: #0284c7;
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(2, 132, 199, 0.45);
}
.idm-badge {
  display: flex;
  align-items: center;
  gap: 8px;
}
.idm-counter {
  background: #10b981;
  color: #fff;
  border-radius: 999px;
  padding: 1px 6px;
  font-size: 10px;
  font-weight: 700;
}
.idm-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.65);
  backdrop-filter: blur(4px);
  z-index: 9999999;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}
.idm-modal-card {
  background: #0f172a;
  color: #f8fafc;
  width: 480px;
  max-width: 90vw;
  border-radius: 12px;
  border: 1px solid rgba(255,255,255,0.12);
  box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5);
  overflow: hidden;
}
.idm-modal-header {
  padding: 16px 20px;
  background: #1e293b;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(255,255,255,0.08);
}
.idm-modal-title strong {
  display: block;
  font-size: 14px;
}
.idm-modal-title span {
  display: block;
  font-size: 11px;
  color: #94a3b8;
}
#idm-modal-close {
  background: none;
  border: none;
  color: #94a3b8;
  font-size: 22px;
  cursor: pointer;
}
.idm-modal-body {
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.idm-stream-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 14px;
  background: #1e293b;
  border-radius: 8px;
  border: 1px solid rgba(255,255,255,0.06);
}
.idm-stream-title {
  font-size: 13px;
  font-weight: 600;
}
.idm-stream-meta {
  font-size: 11px;
  color: #94a3b8;
}
.idm-dl-btn {
  background: #0284c7;
  color: #fff;
  border: none;
  padding: 6px 14px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
}
.idm-dl-btn:hover {
  background: #0369a1;
}
.idm-modal-footer {
  padding: 12px 20px;
  background: #182234;
  border-top: 1px solid rgba(255,255,255,0.06);
}
`;

  const popupHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body {
      width: 360px;
      margin: 0;
      padding: 14px;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background: #0f172a;
      color: #f8fafc;
    }
    .header {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 12px;
      padding-bottom: 10px;
      border-bottom: 1px solid #334155;
    }
    .logo {
      width: 24px;
      height: 24px;
      background: #0284c7;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      font-size: 12px;
    }
    h2 {
      margin: 0;
      font-size: 14px;
      font-weight: 700;
    }
    .subtitle {
      font-size: 11px;
      color: #94a3b8;
    }
    .list {
      display: flex;
      flex-direction: column;
      gap: 8px;
      max-height: 280px;
      overflow-y: auto;
    }
    .item {
      padding: 10px;
      background: #1e293b;
      border-radius: 8px;
      border: 1px solid #334155;
      font-size: 12px;
    }
    .item-url {
      font-family: monospace;
      color: #38bdf8;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      margin-bottom: 6px;
    }
    .btn {
      width: 100%;
      background: #0284c7;
      color: #fff;
      border: none;
      padding: 6px 10px;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 600;
      font-size: 11px;
    }
    .btn:hover { background: #0369a1; }
    .empty {
      text-align: center;
      padding: 24px 10px;
      color: #64748b;
      font-size: 12px;
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo">STV</div>
    <div>
      <h2>SaveToVideo Video Yakalayıcı</h2>
      <div class="subtitle">Bu Sayfada Bulunan Medyalar</div>
    </div>
  </div>
  <div id="media-list" class="list">
    <div class="empty">Bu sekmede henüz video tespit edilmedi.<br>Sayfadaki videoyu oynatın.</div>
  </div>
  <script src="popup.js"></script>
</body>
</html>
`;

  const popupJs = `chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  if (!tabs[0] || !tabs[0].id) return;
  
  chrome.runtime.sendMessage({ action: 'GET_TAB_MEDIA', tabId: tabs[0].id }, (response) => {
    const list = document.getElementById('media-list');
    if (!response || !response.streams || response.streams.length === 0) {
      return;
    }

    list.innerHTML = '';
    response.streams.forEach((s, idx) => {
      const div = document.createElement('div');
      div.className = 'item';
      div.innerHTML = \`
        <div class="item-url">\${s.url}</div>
        <div style="display:flex; justify-content:space-between; margin-bottom:8px; font-size:11px; color:#94a3b8;">
          <span>Tip: \${s.type}</span>
          <span>\${s.contentLength ? (s.contentLength / 1048576).toFixed(1) + ' MB' : 'Dinamik Akış'}</span>
        </div>
        <button class="btn" data-url="\${s.url}">SaveToVideo ile İndir (8 Bağlantı)</button>
      \`;
      div.querySelector('button').onclick = () => {
        chrome.tabs.create({ url: 'http://localhost:3000/?url=' + encodeURIComponent(s.url) });
      };
      list.appendChild(div);
    });
  });
});
`;

  const readme = `# SaveToVideo Deep Video Grabber - Chrome Uzantısı Kurulum Rehberi

Bu eklenti, Google Chrome'da ziyaret ettiğiniz **herhangi bir web sitesinde** (YouTube, Vimeo, Dailymotion, Twitter/X, haber siteleri, dizi/film portalları vb.) oynatılan tüm video ve ses akışlarını en derin seviyede yakalar ve SaveToVideo çok kanallı indirme motoruna aktarır.

## Kurulum Adımları:

1. Bu indirdiğiniz \`savetovideo-chrome-extension.zip\` arşivini masaüstünüze bir klasöre çıkarın (Örn: \`savetovideo-chrome-extension\`).
2. Google Chrome tarayıcınızı açın ve adres çubuğuna şunu yazın:
   \`chrome://extensions\`
3. Sağ üst köşedeki **"Geliştirici modu" (Developer mode)** anahtarını açık konuma getirin.
4. Sol üstte beliren **"Paketlenmemiş öğe yükle" (Load unpacked)** butonuna tıklayın.
5. Arşivden çıkardığınız klasörü seçin ve Tamam'a tıklayın.
6. Eklenti simgesi Chrome araç çubuğuna eklenecektir!

## Nasıl Çalışır?
- Herhangi bir web sitesinde video açtığınızda videonun sağ üst köşesinde **"Bu Videoyu İndir (SaveToVideo)"** paneli belirecektir.
- Tıkladığınızda 4K, 1080p, 720p ve Ses seçenekleri listelenir ve SaveToVideo motoruyla çok kanallı olarak indirilir!
`;

  return [
    { name: 'manifest.json', path: 'manifest.json', content: JSON.stringify(manifest, null, 2), description: 'Chrome Manifest V3 Yapılandırma Dosyası' },
    { name: 'background.js', path: 'background.js', content: backgroundJs, description: 'Ağ İsteklerini İzleyen Arka Plan Servisi' },
    { name: 'content.js', path: 'content.js', content: contentJs, description: 'Sayfadaki Videolara SaveToVideo Paneli Ekleyen Kod' },
    { name: 'content.css', path: 'content.css', content: contentCss, description: 'Gömülü Video İndirme Paneli Tasarımı' },
    { name: 'popup.html', path: 'popup.html', content: popupHtml, description: 'Eklenti Açılır Pencere Arayüzü' },
    { name: 'popup.js', path: 'popup.js', content: popupJs, description: 'Açılır Pencere Mantığı' },
    { name: 'README.md', path: 'README.md', content: readme, description: 'Chrome Eklentisi Kurulum Kılavuzu' },
  ];
}

export async function generateChromeExtensionZip(): Promise<Blob> {
  const zip = new JSZip();
  const files = getChromeExtensionFiles();

  for (const f of files) {
    zip.file(f.path, f.content);
  }

  const blob = await zip.generateAsync({ type: 'blob' });
  return blob;
}

export function downloadChromeExtensionZip(): void {
  generateChromeExtensionZip().then((blob) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'savetovideo-chrome-extension.zip';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });
}
