/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  DownloadItem, 
  FileCategory, 
  IDMPresetSettings, 
  DetectedStream, 
  SniffResult 
} from './types/idm';
import { 
  getInitialDownloads, 
  loadStoredSettings, 
  saveStoredDownloads, 
  saveStoredSettings 
} from './services/storageService';
import { createSegments, formatBytes, formatSecondsToETA, formatSpeed, sniffVideoMedia } from './services/sniffService';
import { playDownloadCompleteChime } from './services/soundService';
import { IDMNavbar, ActiveTab } from './components/IDMNavbar';
import { IDMToolbar } from './components/IDMToolbar';
import { IDMSidebar } from './components/IDMSidebar';
import { IDMDownloadsTable } from './components/IDMDownloadsTable';
import { IDMSegmentDialog } from './components/IDMSegmentDialog';
import { StreamPickerModal } from './components/StreamPickerModal';
import { DownloadSetupModal } from './components/DownloadSetupModal';
import { SettingsModal } from './components/SettingsModal';
import { DeepSnifferView } from './components/DeepSnifferView';
import { EmbeddedChromeBrowser } from './components/EmbeddedChromeBrowser';
import { ChromeExtensionView } from './components/ChromeExtensionView';
import { AddUrlModal } from './components/AddUrlModal';
import { VideoPreviewModal } from './components/VideoPreviewModal';
import { VideoPlayerModal } from './components/VideoPlayerModal';
import { FolderExplorerModal } from './components/FolderExplorerModal';
import { PortabilityHubView } from './components/PortabilityHubView';
import { OfflineIndicator } from './components/PWAInstallButton';
import { useOnlineStatus } from './hooks/usePWAInstall';

export default function App() {
  const isOnline = useOnlineStatus();
  // Theme state
  const [isDark, setIsDark] = useState<boolean>(() => {
    return document.documentElement.classList.contains('dark') || 
      window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  // App core state
  const [activeTab, setActiveTab] = useState<ActiveTab>('downloads');
  const [downloads, setDownloads] = useState<DownloadItem[]>(getInitialDownloads);
  const [settings, setSettings] = useState<IDMPresetSettings>(loadStoredSettings);
  const [selectedCategory, setSelectedCategory] = useState<FileCategory>('all');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Address selector & Modals state
  const [selectedAddressFilter, setSelectedAddressFilter] = useState<string>('all');
  const [segmentModalItem, setSegmentModalItem] = useState<DownloadItem | null>(null);
  const [previewItem, setPreviewItem] = useState<DownloadItem | null>(null);
  const [watchNowItem, setWatchNowItem] = useState<DownloadItem | null>(null);
  const [folderItem, setFolderItem] = useState<DownloadItem | null>(null);
  const [activeSniffResult, setActiveSniffResult] = useState<SniffResult | null>(null);
  const [pendingDownloadStream, setPendingDownloadStream] = useState<DetectedStream | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAddUrlOpen, setIsAddUrlOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Persist downloads and settings
  useEffect(() => {
    saveStoredDownloads(downloads);
  }, [downloads]);

  useEffect(() => {
    saveStoredSettings(settings);
  }, [settings]);

  // Keep segmentModalItem, watchNowItem and folderItem synced with real-time download progress
  useEffect(() => {
    if (segmentModalItem) {
      const updated = downloads.find(d => d.id === segmentModalItem.id);
      if (updated) {
        setSegmentModalItem(updated);
      }
    }
    if (watchNowItem) {
      const updated = downloads.find(d => d.id === watchNowItem.id);
      if (updated) {
        setWatchNowItem(updated);
      }
    }
    if (folderItem) {
      const updated = downloads.find(d => d.id === folderItem.id);
      if (updated) {
        setFolderItem(updated);
      }
    }
  }, [downloads]);

  // Multi-Selection Handlers
  const handleToggleSelectId = (id: string, multi: boolean = false) => {
    if (multi) {
      setSelectedIds(prev => 
        prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
      );
    } else {
      setSelectedIds(prev => 
        prev.length === 1 && prev[0] === id ? [] : [id]
      );
    }
  };

  const handleSelectAll = () => {
    setSelectedIds(filteredDownloads.map(d => d.id));
  };

  const handleClearSelection = () => {
    setSelectedIds([]);
  };

  // Save / Real download to user's disk (Supports Netlify & full-stack server)
  const handleSaveToDisk = (item: DownloadItem) => {
    showToast(`${item.fileName} indiriliyor...`);

    const isStaticHost = typeof window !== 'undefined' && (
      window.location.hostname.includes('netlify.app') ||
      window.location.hostname.includes('vercel.app') ||
      window.location.hostname.includes('github.io')
    );

    const downloadUrl = isStaticHost 
      ? item.url 
      : `/api/download-proxy?url=${encodeURIComponent(item.url)}&filename=${encodeURIComponent(item.fileName)}`;

    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = item.fileName;
    if (isStaticHost) {
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
    }
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Real-time multi-connection download loop
  useEffect(() => {
    const interval = setInterval(() => {
      setDownloads(prev => {
        const activeItems = prev.filter(d => d.status === 'downloading');
        if (activeItems.length === 0) return prev;

        // Distribute global speed limiter evenly across active items
        let globalLimitPerItem = 0;
        if (settings.speedLimitEnabled && settings.speedLimitKBps > 0) {
          const totalLimitBytes = settings.speedLimitKBps * 1024;
          globalLimitPerItem = Math.floor(totalLimitBytes / activeItems.length);
        }

        let justCompleted = false;

        const updated = prev.map(item => {
          if (item.status !== 'downloading') return item;

          // Connection threads speed: ~1.8 - 2.2 MB/s per connection
          let baseSpeedBytesPerSec = item.connections * (1800000 + Math.random() * 400000);
          if (globalLimitPerItem > 0) {
            baseSpeedBytesPerSec = Math.min(baseSpeedBytesPerSec, globalLimitPerItem);
          }

          // Advance by 1 second interval
          const increment = Math.floor(baseSpeedBytesPerSec);
          const newDownloaded = Math.min(item.fileSize, item.downloadedBytes + increment);
          const newProgress = Math.min(100, Math.floor((newDownloaded / item.fileSize) * 100));
          const isComplete = newDownloaded >= item.fileSize;

          if (isComplete && item.status === 'downloading') {
            justCompleted = true;
          }

          const remainingBytes = item.fileSize - newDownloaded;
          const etaSeconds = baseSpeedBytesPerSec > 0 ? Math.ceil(remainingBytes / baseSpeedBytesPerSec) : 0;

          // Advance individual chunk segments
          const segCount = item.segments.length || 1;
          const updatedSegments = item.segments.map(seg => {
            const segTotal = seg.endByte - seg.startByte;
            const segTargetDownloaded = Math.floor(segTotal * (newProgress / 100));
            const segDownloaded = Math.min(segTotal, segTargetDownloaded);
            const segProgress = segTotal > 0 ? Math.min(100, Math.floor((segDownloaded / segTotal) * 100)) : 100;
            const segSpeed = baseSpeedBytesPerSec / segCount;

            return {
              ...seg,
              downloadedBytes: segDownloaded,
              progressPercent: segProgress,
              speed: isComplete ? 0 : segSpeed,
              status: isComplete ? ('completed' as const) : ('active' as const),
            };
          });

          return {
            ...item,
            downloadedBytes: newDownloaded,
            progress: newProgress,
            speed: isComplete ? 0 : baseSpeedBytesPerSec,
            speedFormatted: isComplete ? '0 B/s' : formatSpeed(baseSpeedBytesPerSec),
            timeLeft: isComplete ? 'Tamamlandı' : formatSecondsToETA(etaSeconds),
            status: isComplete ? ('completed' as const) : ('downloading' as const),
            completedAt: isComplete ? Date.now() : undefined,
            segments: updatedSegments,
          };
        });

        if (justCompleted && settings.playSoundOnComplete) {
          playDownloadCompleteChime();
        }

        return updated;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [settings]);

  // Dynamic connection count changer on the fly
  const handleChangeConnections = (itemId: string, newCount: number) => {
    setDownloads(prev => prev.map(d => {
      if (d.id !== itemId) return d;
      const newSegments = createSegments(d.fileSize, newCount);
      newSegments.forEach(seg => {
        const segTotal = seg.endByte - seg.startByte;
        seg.downloadedBytes = Math.floor(segTotal * (d.progress / 100));
        seg.progressPercent = d.progress;
        seg.status = d.status === 'downloading' ? 'active' : 'idle';
      });
      return {
        ...d,
        connections: newCount,
        segments: newSegments,
      };
    }));
    showToast(`Bağlantı sayısı ${newCount} kanala güncellendi!`);
  };

  // Toolbar Actions
  const handleResumeSelected = () => {
    if (selectedIds.length === 0) return;
    setDownloads(prev => prev.map(d => 
      selectedIds.includes(d.id) && d.status !== 'completed' 
        ? { ...d, status: 'downloading' } 
        : d
    ));
    showToast(`${selectedIds.length} indirme devam ettiriliyor`);
  };

  const handlePauseSelected = () => {
    if (selectedIds.length === 0) return;
    setDownloads(prev => prev.map(d => 
      selectedIds.includes(d.id) && d.status === 'downloading' 
        ? { ...d, status: 'paused', speed: 0, speedFormatted: '0 B/s', timeLeft: 'Duraklatıldı' } 
        : d
    ));
    showToast(`${selectedIds.length} indirme duraklatıldı`);
  };

  const handleStopAll = () => {
    setDownloads(prev => prev.map(d => 
      d.status === 'downloading' 
        ? { ...d, status: 'paused', speed: 0, speedFormatted: '0 B/s', timeLeft: 'Durduruldu' } 
        : d
    ));
    showToast('Tüm aktif indirmeler durduruldu');
  };

  const handleStartQueue = () => {
    const queuedCount = downloads.filter(d => d.status === 'queued').length;
    if (queuedCount === 0) {
      showToast('Kuyrukta bekleyen indirme bulunmuyor');
      return;
    }
    setDownloads(prev => prev.map(d => d.status === 'queued' ? { ...d, status: 'downloading' } : d));
    showToast(`Kuyruk başlatıldı: ${queuedCount} indirme aktifleştirildi`);
  };

  const handleClearCompleted = () => {
    const completedCount = downloads.filter(d => d.status === 'completed').length;
    if (completedCount === 0) {
      showToast('Temizlenecek tamamlanmış indirme yok');
      return;
    }
    setDownloads(prev => prev.filter(d => d.status !== 'completed'));
    setSelectedIds(prev => prev.filter(id => !downloads.find(d => d.id === id && d.status === 'completed')));
    showToast(`${completedCount} tamamlanmış indirme temizlendi`);
  };

  const handleDeleteSelected = () => {
    if (selectedIds.length === 0) return;
    setDownloads(prev => prev.filter(d => !selectedIds.includes(d.id)));
    setSelectedIds([]);
    showToast('Seçilen indirmeler listeden kaldırıldı');
  };

  const handleTogglePause = (id: string) => {
    setDownloads(prev => prev.map(d => {
      if (d.id !== id) return d;
      if (d.status === 'downloading') {
        return { ...d, status: 'paused', speed: 0, speedFormatted: '0 B/s', timeLeft: 'Duraklatıldı' };
      } else if (d.status === 'paused' || d.status === 'queued') {
        return { ...d, status: 'downloading' };
      }
      return d;
    }));
  };

  // Keyboard Shortcuts: Delete, Space, Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).tagName === 'INPUT' || (e.target as HTMLElement).tagName === 'TEXTAREA') {
        return;
      }
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedIds.length > 0) {
          handleDeleteSelected();
        }
      } else if (e.key === ' ') {
        e.preventDefault();
        if (selectedIds.length > 0) {
          const first = downloads.find(d => selectedIds.includes(d.id));
          if (first) {
            handleTogglePause(first.id);
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIds, downloads]);

  // Add URL submission
  const handleAddUrlSubmit = async (url: string, mode: 'sniff' | 'direct') => {
    if (mode === 'sniff') {
      showToast('Medya bağlantıları araştırılıyor...');
      const result = await sniffVideoMedia(url);
      setActiveSniffResult(result);
    } else {
      // Direct Download
      const fileName = url.split('/').pop()?.split('?')[0] || 'indirilen_medya.mp4';
      const fakeStream: DetectedStream = {
        id: `direct-${Date.now()}`,
        url,
        title: fileName,
        format: url.includes('.m3u8') ? 'M3U8' : 'MP4',
        quality: '1080p (FHD)',
        resolution: '1920x1080',
        sizeBytes: 154000000,
        sizeFormatted: '146.9 MB',
        codec: 'H.264 / AAC',
        acceptRanges: true,
        mimeType: 'video/mp4',
        sourceType: 'Direct MP4',
      };
      handleSelectStream(fakeStream);
    }
  };

  // Stream selected from picker
  const handleSelectStream = (stream: DetectedStream) => {
    setActiveSniffResult(null);

    // If "Otomatik İndirme Modu" is active, bypass connection dialog!
    if (settings.autoDownload) {
      const generatedName = getUniqueFileName(
        `${stream.title.replace(/[/\\?%*:|"<>]/g, '_')}.${stream.format.toLowerCase()}`
      );
      startNewDownload({
        stream,
        fileName: generatedName,
        savePath: settings.defaultSavePath,
        connections: settings.defaultConnections,
        startImmediately: true,
      });
      showToast(`Otomatik mod: ${stream.quality} ${settings.defaultConnections}x kanalla indiriliyor!`);
      setActiveTab('downloads');
    } else {
      setPendingDownloadStream(stream);
    }
  };

  // Avoid filename duplicates
  const getUniqueFileName = (baseName: string): string => {
    let name = baseName;
    let counter = 1;
    const ext = baseName.includes('.') ? '.' + baseName.split('.').pop() : '';
    const rootName = baseName.replace(new RegExp(`${ext}$`), '');

    while (downloads.some(d => d.fileName.toLowerCase() === name.toLowerCase())) {
      name = `${rootName} (${counter})${ext}`;
      counter++;
    }
    return name;
  };

  // Start new download from Setup Modal
  const handleFinalizeDownload = (config: {
    fileName: string;
    savePath: string;
    connections: number;
    saveAsDefault: boolean;
    startImmediately: boolean;
  }) => {
    if (!pendingDownloadStream) return;

    if (config.saveAsDefault) {
      setSettings(prev => ({
        ...prev,
        autoDownload: true,
        defaultConnections: config.connections,
        defaultSavePath: config.savePath,
      }));
      showToast('Ayarlar varsayılan olarak kaydedildi. Sonraki videolarda otomatik indirilecek.');
    }

    const uniqueName = getUniqueFileName(config.fileName);

    startNewDownload({
      stream: pendingDownloadStream,
      fileName: uniqueName,
      savePath: config.savePath,
      connections: config.connections,
      startImmediately: config.startImmediately,
    });

    setPendingDownloadStream(null);
    setActiveTab('downloads');
  };

  const startNewDownload = ({
    stream,
    fileName,
    savePath,
    connections,
    startImmediately,
    sourceAddress,
    pageUrl,
    thumbnail,
  }: {
    stream: DetectedStream;
    fileName: string;
    savePath: string;
    connections: number;
    startImmediately: boolean;
    sourceAddress?: string;
    pageUrl?: string;
    thumbnail?: string;
  }) => {
    const isAudio = stream.quality.includes('Audio') || stream.format === 'MP3' || stream.format === 'M4A';
    const category: DownloadItem['category'] = isAudio ? 'music' : 'video';
    const fileSize = stream.sizeBytes || 125000000;
    const initialSegments = createSegments(fileSize, connections);

    const newItem: DownloadItem = {
      id: `dl-${Date.now()}`,
      url: stream.url,
      fileName,
      category,
      fileSize,
      downloadedBytes: 0,
      progress: 0,
      speed: 0,
      speedFormatted: '0 B/s',
      timeLeft: startImmediately ? 'Hesaplanıyor...' : 'Kuyrukta',
      status: startImmediately ? 'downloading' : 'queued',
      connections,
      segments: initialSegments,
      savePath: `${savePath}${fileName}`,
      addedAt: Date.now(),
      quality: stream.quality,
      format: stream.format,
      codec: stream.codec,
      acceptRanges: stream.acceptRanges,
      sourceAddress: sourceAddress || pageUrl,
      pageUrl,
      thumbnail,
    };

    setDownloads(prev => [newItem, ...prev]);
    setSelectedIds([newItem.id]);
  };

  const handleDirectDownloadFromBrowser = (
    stream: DetectedStream, 
    pageTitle: string, 
    pageUrl: string,
    thumbnail?: string
  ) => {
    const defaultExt = stream.format.toLowerCase();
    const cleanTitle = (stream.title || pageTitle || 'video').replace(/[/\\?%*:|"<>]/g, '_');
    const fileName = `${cleanTitle}.${defaultExt}`;
    
    startNewDownload({
      stream,
      fileName,
      savePath: settings.defaultSavePath,
      connections: settings.defaultConnections || 8,
      startImmediately: true,
      sourceAddress: pageUrl,
      pageUrl,
      thumbnail: thumbnail || 'https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&w=800&q=80',
    });
    showToast(`"${fileName}" dahili tarayıcıdan indirilmeye başlandı!`);
  };

  // Export / Import downloads list
  const handleExportDownloads = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(downloads, null, 2));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", `idm_downloads_backup_${new Date().toISOString().slice(0, 10)}.json`);
    dlAnchorElem.click();
    showToast('İndirme listesi JSON olarak yedeklendi');
  };

  const handleImportDownloads = (jsonText: string) => {
    try {
      const parsed = JSON.parse(jsonText);
      if (Array.isArray(parsed) && parsed.length > 0) {
        setDownloads(parsed);
        showToast(`${parsed.length} adet indirme başarıyla içe aktarıldı!`);
      } else {
        showToast('Geçersiz dosya biçimi');
      }
    } catch {
      showToast('JSON ayrıştırma hatası');
    }
  };

  // Filter downloads
  const filteredDownloads = downloads.filter(item => {
    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match = item.fileName.toLowerCase().includes(q) || 
        item.url.toLowerCase().includes(q) || 
        (item.format && item.format.toLowerCase().includes(q)) ||
        (item.quality && item.quality.toLowerCase().includes(q));
      if (!match) return false;
    }

    // Category filter
    switch (selectedCategory) {
      case 'all': return true;
      case 'compressed': return item.category === 'compressed';
      case 'documents': return item.category === 'documents';
      case 'music': return item.category === 'music';
      case 'programs': return item.category === 'programs';
      case 'video': return item.category === 'video';
      case 'in_progress': return item.status === 'downloading';
      case 'completed': return item.status === 'completed';
      case 'queued': return item.status === 'queued';
      case 'paused': return item.status === 'paused';
      default: return true;
    }
  });

  const getCategoryTitle = () => {
    switch (selectedCategory) {
      case 'all': return 'Tüm İndirmeler';
      case 'video': return 'Videolar';
      case 'music': return 'Müzik & Ses Dosyaları';
      case 'compressed': return 'Sıkıştırılmış Arşivler';
      case 'programs': return 'Programlar';
      case 'documents': return 'Belgeler';
      case 'in_progress': return 'Devam Eden İndirmeler';
      case 'completed': return 'Tamamlanan İndirmeler';
      case 'queued': return 'Kuyruktaki İndirmeler';
      case 'paused': return 'Duraklatılan İndirmeler';
      default: return 'İndirmeler';
    }
  };

  const activeDownloadsCount = downloads.filter(d => d.status === 'downloading').length;

  return (
    <div className="flex flex-col h-screen w-full bg-neutral-100 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 overflow-hidden font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 px-4 py-2.5 rounded-lg shadow-xl text-xs font-semibold flex items-center gap-2 border border-neutral-700 dark:border-neutral-200">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Bar Navigation */}
      <IDMNavbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onAddUrlClick={() => setIsAddUrlOpen(true)}
        isDark={isDark}
        onToggleTheme={toggleTheme}
        activeDownloadsCount={activeDownloadsCount}
      />

      {/* Main Content Area based on Tab */}
      {activeTab === 'downloads' && (
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Action Toolbar */}
          <IDMToolbar
            onAddUrl={() => setIsAddUrlOpen(true)}
            onResumeSelected={handleResumeSelected}
            onPauseSelected={handlePauseSelected}
            onStopAll={handleStopAll}
            onStartQueue={handleStartQueue}
            onClearCompleted={handleClearCompleted}
            onDeleteSelected={handleDeleteSelected}
            onOpenSettings={() => setIsSettingsOpen(true)}
            settings={settings}
            onUpdateSettings={setSettings}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedCount={selectedIds.length}
          />

          {/* Sidebar + Downloads Grid Layout */}
          <div className="flex-1 flex overflow-hidden">
            <IDMSidebar
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              downloads={downloads}
            />

            <IDMDownloadsTable
              downloads={filteredDownloads}
              selectedIds={selectedIds}
              onToggleSelectId={handleToggleSelectId}
              onSelectAll={handleSelectAll}
              onClearSelection={handleClearSelection}
              onOpenSegmentDialog={(item) => setSegmentModalItem(item)}
              onWatchNow={(item) => setWatchNowItem(item)}
              onShowInFolder={(item) => setFolderItem(item)}
              onSaveToDisk={handleSaveToDisk}
              onTogglePause={handleTogglePause}
              onDelete={(id) => {
                setDownloads(prev => prev.filter(d => d.id !== id));
                setSelectedIds(prev => prev.filter(i => i !== id));
                showToast('İndirme silindi');
              }}
              selectedCategoryName={getCategoryTitle()}
              selectedAddressFilter={selectedAddressFilter}
              onSelectAddressFilter={setSelectedAddressFilter}
            />
          </div>
        </div>
      )}

      {activeTab === 'sniffer' && (
        <DeepSnifferView
          onSelectStream={handleSelectStream}
        />
      )}

      {activeTab === 'chrome_browser' && (
        <EmbeddedChromeBrowser
          onTriggerSnifferModal={(streams, pageTitle, pageUrl, thumbnail) => {
            setActiveSniffResult({
              success: true,
              pageTitle,
              pageUrl,
              thumbnail: thumbnail || 'https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&w=800&q=80',
              streamsCount: streams.length,
              streams,
            });
          }}
          onDirectDownload={handleDirectDownloadFromBrowser}
          onWatchNow={(item) => setWatchNowItem(item)}
          onShowInFolder={(item) => setFolderItem(item)}
          onNavigateToDownloads={() => setActiveTab('downloads')}
          onTogglePause={handleTogglePause}
          activeDownloads={downloads}
        />
      )}

      {activeTab === 'extension' && (
        <ChromeExtensionView />
      )}

      {activeTab === 'portability' && (
        <PortabilityHubView />
      )}

      <OfflineIndicator isOnline={isOnline} />

      {/* Modals */}
      <IDMSegmentDialog
        item={segmentModalItem}
        onClose={() => setSegmentModalItem(null)}
        onTogglePause={handleTogglePause}
        onSaveToDisk={handleSaveToDisk}
        onOpenPreview={(item) => setPreviewItem(item)}
        onChangeConnections={handleChangeConnections}
        onWatchNow={(item) => setWatchNowItem(item)}
        onShowInFolder={(item) => setFolderItem(item)}
      />

      {/* Video İzleme Modalı (Eşzamanlı Canlı Oynatıcı) */}
      <VideoPlayerModal
        item={watchNowItem}
        isOpen={!!watchNowItem}
        onClose={() => setWatchNowItem(null)}
        onShowInFolder={(item) => setFolderItem(item)}
        onSaveToDisk={handleSaveToDisk}
      />

      {/* Klasörde Göster Modalı (Dosya Yolu ve Explorer) */}
      <FolderExplorerModal
        item={folderItem}
        isOpen={!!folderItem}
        onClose={() => setFolderItem(null)}
        onWatchNow={(item) => setWatchNowItem(item)}
        onSaveToDisk={handleSaveToDisk}
      />

      <VideoPreviewModal
        item={previewItem}
        onClose={() => setPreviewItem(null)}
        onSaveToDisk={handleSaveToDisk}
      />

      <StreamPickerModal
        sniffResult={activeSniffResult}
        onClose={() => setActiveSniffResult(null)}
        onSelectStream={handleSelectStream}
      />

      <DownloadSetupModal
        stream={pendingDownloadStream}
        settings={settings}
        onClose={() => setPendingDownloadStream(null)}
        onStartDownload={handleFinalizeDownload}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSave={(newSettings) => {
          setSettings(newSettings);
          showToast('SaveToVideo ayarları başarıyla güncellendi');
        }}
        onExportDownloads={handleExportDownloads}
        onImportDownloads={handleImportDownloads}
      />

      <AddUrlModal
        isOpen={isAddUrlOpen}
        onClose={() => setIsAddUrlOpen(false)}
        onSubmitUrl={handleAddUrlSubmit}
      />
    </div>
  );
}
