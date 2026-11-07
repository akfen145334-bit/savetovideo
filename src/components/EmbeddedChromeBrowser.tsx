import React, { useState, useRef } from 'react';
import { 
  ArrowLeft, 
  ArrowRight, 
  RotateCw, 
  Home,
  Lock, 
  Download, 
  Terminal,
  Activity,
  Plus,
  X,
  Search,
  ExternalLink,
  Zap,
  Play,
  Folder,
  CheckCircle2,
  List,
  Film,
  Sparkles,
  ChevronDown,
  Globe,
  Pause,
  PlayCircle
} from 'lucide-react';
import { DetectedStream, DownloadItem } from '../types/idm';
import { sniffVideoMedia } from '../services/sniffService';

export interface EmbeddedChromeBrowserProps {
  onTriggerSnifferModal: (streams: DetectedStream[], pageTitle: string, pageUrl: string, thumbnail?: string) => void;
  onDirectDownload: (stream: DetectedStream, pageTitle: string, pageUrl: string, thumbnail?: string) => void;
  onWatchNow?: (item: DownloadItem) => void;
  onShowInFolder?: (item: DownloadItem) => void;
  onNavigateToDownloads?: () => void;
  onTogglePause?: (id: string) => void;
  activeDownloads?: DownloadItem[];
}

interface WebPageTab {
  id: string;
  title: string;
  url: string;
  videoSrc: string;
  poster: string;
  desc: string;
  streams: DetectedStream[];
  isHome?: boolean;
}

const DEFAULT_BOOKMARKS = [
  {
    name: 'The Dog Stars (HDFilmCehennemi)',
    url: 'https://www.hdfilmcehennemi.nl/the-dog-stars-2/',
    icon: '🎬',
    badge: '1080p FHD'
  },
  {
    name: 'YouTube (Speaking Challenge)',
    url: 'https://www.youtube.com/watch?v=wCyyVuDIsrg',
    icon: '📺',
    badge: 'YouTube'
  },
  {
    name: 'Tears of Steel (4K Cinema)',
    url: 'https://cinema-stream.org/watch/tears-of-steel',
    icon: '🚀',
    badge: '4K Ultra'
  },
  {
    name: 'Big Buck Bunny (HD)',
    url: 'https://animation-portal.com/watch/big-buck-bunny',
    icon: '🐰',
    badge: 'Animasyon'
  },
  {
    name: 'Mux HLS Canlı Akış',
    url: 'https://live-broadcasting.tv/stream/mux-adaptive',
    icon: '📡',
    badge: '.m3u8'
  }
];

export const EmbeddedChromeBrowser: React.FC<EmbeddedChromeBrowserProps> = ({
  onTriggerSnifferModal,
  onDirectDownload,
  onWatchNow,
  onShowInFolder,
  onNavigateToDownloads,
  onTogglePause,
  activeDownloads = [],
}) => {
  const initialTabs: WebPageTab[] = [
    {
      id: 'tab-yt',
      title: 'YouTube (Shadowing Speaking Challenge)',
      url: 'https://www.youtube.com/watch?v=wCyyVuDIsrg',
      videoSrc: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
      poster: 'https://i.ytimg.com/vi/wCyyVuDIsrg/hqdefault.jpg',
      desc: 'English Learners Podcast: Shadowing English Speaking Practice | Speak Fluently 5-Day English Speaking Challenge. SaveToVideo, YouTube akışlarını otomatik yakaladı.',
      streams: [
        {
          id: 'yt-1080p60',
          url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
          title: 'Shadowing English Speaking Practice - 1080p 60fps Full HD',
          format: 'MP4',
          quality: '1080p (FHD)',
          resolution: '1920x1080',
          sizeBytes: 508559360,
          sizeFormatted: '485 MB',
          bitrate: '9.2 Mbps',
          fps: 60,
          codec: 'H.264 High@4.2 + AAC',
          acceptRanges: true,
          mimeType: 'video/mp4',
          sourceType: 'Direct MP4',
        },
        {
          id: 'yt-720p',
          url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
          title: 'Shadowing English Speaking Practice - 720p HD',
          format: 'MP4',
          quality: '720p (HD)',
          resolution: '1280x720',
          sizeBytes: 241172480,
          sizeFormatted: '230 MB',
          bitrate: '4.1 Mbps',
          fps: 30,
          codec: 'H.264 / AAC',
          acceptRanges: true,
          mimeType: 'video/mp4',
          sourceType: 'Direct MP4',
        },
        {
          id: 'yt-audio',
          url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
          title: 'Shadowing English Speaking Practice - Ses Parçası (320 kbps)',
          format: 'M4A',
          quality: 'Audio (320k)',
          resolution: 'Audio Only',
          sizeBytes: 39845888,
          sizeFormatted: '38 MB',
          bitrate: '320 kbps',
          codec: 'AAC High Quality',
          acceptRanges: true,
          mimeType: 'audio/mp4',
          sourceType: 'Audio Track',
        }
      ],
    },
    {
      id: 'tab-hdf',
      title: 'The Dog Stars (HDFilmCehennemi 2026)',
      url: 'https://www.hdfilmcehennemi.nl/the-dog-stars-2/',
      videoSrc: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
      poster: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&w=800&q=80',
      desc: 'The Dog Stars (Köpek ve Yıldızlar 2026) - Yönetmen: Ridley Scott · Başroller: Jacob Elordi, Josh Brolin. Cehennem Player 1080p Full HD Türkçe Dublaj.',
      streams: [
        {
          id: 'hdf-1080p',
          url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
          title: 'The Dog Stars (2026) - 1080p Full HD (Türkçe Dublaj & Altyazılı)',
          format: 'MP4',
          quality: '1080p (FHD)',
          resolution: '1920x1080',
          sizeBytes: 2125996032,
          sizeFormatted: '1.98 GB',
          bitrate: '8.4 Mbps',
          fps: 60,
          codec: 'H.264 / AAC 5.1 Dual Dublaj',
          acceptRanges: true,
          mimeType: 'video/mp4',
          sourceType: 'Direct MP4',
        },
        {
          id: 'hdf-720p',
          url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
          title: 'The Dog Stars (2026) - 720p HD Hızlı İndirme',
          format: 'MP4',
          quality: '720p (HD)',
          resolution: '1280x720',
          sizeBytes: 1181116006,
          sizeFormatted: '1.10 GB',
          bitrate: '4.2 Mbps',
          fps: 30,
          codec: 'H.264 / AAC',
          acceptRanges: true,
          mimeType: 'video/mp4',
          sourceType: 'Direct MP4',
        },
        {
          id: 'hdf-m3u8',
          url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
          title: 'The Dog Stars (2026) - HLS Master Playlist (.m3u8 Parçalı)',
          format: 'M3U8',
          quality: '1080p (FHD)',
          resolution: '1920x1080',
          sizeBytes: 2125996032,
          sizeFormatted: '1.98 GB (Bölütlenmiş TS)',
          bitrate: 'Dinamik',
          codec: 'HLS / TS Segments',
          acceptRanges: true,
          mimeType: 'application/x-mpegURL',
          sourceType: 'HLS Stream',
        }
      ],
    },
    {
      id: 'tab-tos',
      title: 'Tears of Steel (4K Sci-Fi Cinema)',
      url: 'https://cinema-stream.org/watch/tears-of-steel',
      videoSrc: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
      poster: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&w=800&q=80',
      desc: 'Amsterdam VFX tarafından üretilen açık kaynaklı 4K bilim kurgu filmi. SaveToVideo, sayfadaki video oynatıcıyı otomatik tespit etmiştir.',
      streams: [
        {
          id: 'tos-4k',
          url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
          title: 'Tears of Steel - 4K Master Ultra HD (2160p 60fps)',
          format: 'MP4',
          quality: '2160p (4K)',
          resolution: '3840x2160',
          sizeBytes: 812400000,
          sizeFormatted: '774.7 MB',
          bitrate: '14.8 Mbps',
          fps: 60,
          codec: 'H.264 High@5.2 + AAC',
          acceptRanges: true,
          mimeType: 'video/mp4',
          sourceType: 'Direct MP4',
        },
        {
          id: 'tos-1080p',
          url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
          title: 'Tears of Steel - Full HD (1080p 60fps) [Önerilen]',
          format: 'MP4',
          quality: '1080p (FHD)',
          resolution: '1920x1080',
          sizeBytes: 329000000,
          sizeFormatted: '313.8 MB',
          bitrate: '6.4 Mbps',
          fps: 60,
          codec: 'H.264 High@4.2 + AAC',
          acceptRanges: true,
          mimeType: 'video/mp4',
          sourceType: 'Direct MP4',
        }
      ],
    }
  ];

  const [tabs, setTabs] = useState<WebPageTab[]>(initialTabs);
  const [activeTabId, setActiveTabId] = useState('tab-hdf');
  const activeTab = tabs.find(t => t.id === activeTabId) || tabs[0];
  const [urlInput, setUrlInput] = useState(activeTab.url);
  const [historyStack, setHistoryStack] = useState<string[]>([activeTab.url]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoadingPage, setIsLoadingPage] = useState(false);
  const [showNetworkSniffer, setShowNetworkSniffer] = useState(false);
  const [showQualityDropdown, setShowQualityDropdown] = useState(false);
  const [isDockMinimized, setIsDockMinimized] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Pick best stream (highest resolution)
  const bestStream = activeTab.streams && activeTab.streams.length > 0 
    ? activeTab.streams[0] 
    : null;

  const handleTabSwitch = (t: WebPageTab) => {
    setActiveTabId(t.id);
    setUrlInput(t.url);
    setIsPlaying(false);
    setShowQualityDropdown(false);
    setHistoryStack([t.url]);
    setHistoryIndex(0);
  };

  const handleCloseTab = (e: React.MouseEvent, tabId: string) => {
    e.stopPropagation();
    if (tabs.length === 1) {
      // If closing the only tab, open fresh home tab
      handleOpenNewTab();
      setTabs(prev => prev.filter(t => t.id !== tabId));
      return;
    }
    const remainingTabs = tabs.filter(t => t.id !== tabId);
    setTabs(remainingTabs);
    if (activeTabId === tabId) {
      const nextTab = remainingTabs[remainingTabs.length - 1];
      setActiveTabId(nextTab.id);
      setUrlInput(nextTab.url);
    }
  };

  const handleOpenNewTab = (prefillUrl?: string) => {
    const isBlank = !prefillUrl;
    const newTab: WebPageTab = {
      id: `tab-${Date.now()}`,
      title: isBlank ? 'Yeni Sekme' : 'Yükleniyor...',
      url: prefillUrl || 'stv://home',
      videoSrc: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
      poster: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&w=800&q=80',
      desc: isBlank ? 'SaveToVideo Hızlı Erişim ve Video Arama' : 'Sayfa yükleniyor...',
      streams: [],
      isHome: isBlank,
    };

    setTabs(prev => [...prev, newTab]);
    setActiveTabId(newTab.id);
    setUrlInput(prefillUrl || '');
    if (prefillUrl) {
      handleNavigateUrl(prefillUrl, newTab.id);
    }
  };

  const handleNavigateUrl = async (targetUrl: string, targetTabId?: string) => {
    let cleanUrl = targetUrl.trim();
    if (!cleanUrl) return;

    // Check if user entered search terms or domain
    if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://') && !cleanUrl.startsWith('stv://')) {
      if (cleanUrl.includes('.') && !cleanUrl.includes(' ')) {
        cleanUrl = `https://${cleanUrl}`;
      } else {
        // Query search
        cleanUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(cleanUrl)}`;
      }
    }

    setUrlInput(cleanUrl);
    setIsLoadingPage(true);

    try {
      const sniffResult = await sniffVideoMedia(cleanUrl);
      const tabToUpdate = targetTabId || activeTabId;

      setTabs(prev => prev.map(t => {
        if (t.id === tabToUpdate) {
          return {
            ...t,
            title: sniffResult.pageTitle || 'Web Sayfası',
            url: cleanUrl,
            videoSrc: sniffResult.streams[0]?.url || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
            poster: sniffResult.thumbnail || 'https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&w=800&q=80',
            desc: `SaveToVideo bu sayfada ${sniffResult.streamsCount} adet indirilebilir akış ve çözünürlük buldu.`,
            streams: sniffResult.streams,
            isHome: false,
          };
        }
        return t;
      }));

      setHistoryStack(prev => [...prev.slice(0, historyIndex + 1), cleanUrl]);
      setHistoryIndex(prev => prev + 1);
    } finally {
      setIsLoadingPage(false);
    }
  };

  const handleBack = () => {
    if (historyIndex > 0) {
      const prevUrl = historyStack[historyIndex - 1];
      setHistoryIndex(historyIndex - 1);
      setUrlInput(prevUrl);
      handleNavigateUrl(prevUrl);
    }
  };

  const handleForward = () => {
    if (historyIndex < historyStack.length - 1) {
      const nextUrl = historyStack[historyIndex + 1];
      setHistoryIndex(historyIndex + 1);
      setUrlInput(nextUrl);
      handleNavigateUrl(nextUrl);
    }
  };

  // Direct 1-click Download (Kendi Tarayıcısından Hemen İndir)
  const handleDirectDownloadClick = (streamToDownload?: DetectedStream) => {
    const stream = streamToDownload || bestStream;
    if (!stream) {
      onTriggerSnifferModal(activeTab.streams, activeTab.title, activeTab.url, activeTab.poster);
      return;
    }
    setShowQualityDropdown(false);
    onDirectDownload(stream, activeTab.title, activeTab.url, activeTab.poster);
  };

  // Most recent or active download for the in-browser dock
  const currentDownloadingItem = activeDownloads.find(d => d.status === 'downloading') || activeDownloads[0];

  return (
    <div className="flex-1 overflow-auto bg-neutral-100 dark:bg-neutral-950 p-4 md:p-6 flex flex-col gap-3 text-xs font-sans">
      {/* Top Banner / Feature Callout */}
      <div className="bg-gradient-to-r from-sky-600 via-indigo-600 to-sky-700 text-white rounded-xl p-4 shadow-md flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shrink-0">
            <Globe className="w-5 h-5 text-sky-200" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm tracking-tight">
                SaveToVideo Dahili Web Tarayıcısı
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/90 text-white text-[10px] font-semibold tracking-wide flex items-center gap-1">
                <Zap className="w-3 h-3" />
                Dahili Doğrudan İndirme Aktif
              </span>
            </div>
            <p className="text-xs text-sky-100/90 mt-0.5">
              İstediğiniz video adresine gidin; SaveToVideo videoyu otomatik yakalar ve <strong>"Bu Tarayıcıdan Hemen İndir"</strong> ile tek tıkla doğrudan indirir.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {bestStream && (
            <button
              onClick={() => handleDirectDownloadClick(bestStream)}
              className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold rounded-lg shadow-md flex items-center gap-1.5 transition-all transform hover:scale-102 active:scale-98"
            >
              <Zap className="w-4 h-4 fill-neutral-950" />
              <span>Bu Tarayıcıdan Hemen İndir ({bestStream.quality})</span>
            </button>
          )}

          <button
            onClick={() => onTriggerSnifferModal(activeTab.streams, activeTab.title, activeTab.url, activeTab.poster)}
            className="px-3.5 py-2 bg-white/15 hover:bg-white/25 border border-white/30 text-white font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Kalite Seçenekleri ({activeTab.streams.length})</span>
          </button>
        </div>
      </div>

      {/* Main Internal Browser Window Frame */}
      <div className="w-full bg-white dark:bg-neutral-900 rounded-xl border border-neutral-300 dark:border-neutral-800 shadow-2xl overflow-hidden flex flex-col min-h-[620px]">
        {/* Browser Tab Bar */}
        <div className="bg-neutral-200 dark:bg-neutral-800/90 px-3 pt-2.5 flex items-center gap-2 select-none border-b border-neutral-300/80 dark:border-neutral-700/80">
          {/* OS-Style Window Buttons */}
          <div className="flex items-center gap-1.5 px-1 mr-1">
            <div className="w-3 h-3 rounded-full bg-rose-500/90 hover:opacity-80 transition-opacity" />
            <div className="w-3 h-3 rounded-full bg-amber-500/90 hover:opacity-80 transition-opacity" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/90 hover:opacity-80 transition-opacity" />
          </div>

          {/* Tab Strip */}
          <div className="flex items-center gap-1 overflow-x-auto flex-1 scrollbar-none">
            {tabs.map((t) => (
              <div
                key={t.id}
                onClick={() => handleTabSwitch(t)}
                className={`group flex items-center gap-2 px-3 py-1.5 rounded-t-lg text-xs font-medium cursor-pointer transition-all max-w-[220px] select-none ${
                  activeTabId === t.id
                    ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 shadow-2xs border-t-2 border-t-sky-500'
                    : 'bg-neutral-300/50 dark:bg-neutral-800/50 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-300/80 dark:hover:bg-neutral-700/70'
                }`}
              >
                <div className="w-2 h-2 rounded-full bg-sky-500 shrink-0" />
                <span className="truncate flex-1">{t.title}</span>
                <button
                  onClick={(e) => handleCloseTab(e, t.id)}
                  title="Sekmeyi Kapat"
                  className="opacity-0 group-hover:opacity-100 hover:bg-neutral-400/40 dark:hover:bg-neutral-600 rounded p-0.5 transition-all text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}

            <button
              onClick={() => handleOpenNewTab()}
              title="Yeni Sekme Aç"
              className="p-1.5 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 rounded-md hover:bg-neutral-300/70 dark:hover:bg-neutral-700 transition-colors shrink-0 ml-1"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Browser Omnibox Toolbar */}
        <div className="bg-white dark:bg-neutral-900 px-3 py-2 border-b border-neutral-200 dark:border-neutral-800 flex items-center gap-2 relative">
          <div className="flex items-center gap-1 text-neutral-600 dark:text-neutral-400">
            <button 
              onClick={handleBack}
              disabled={historyIndex <= 0}
              title="Geri"
              className={`p-1.5 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 ${historyIndex > 0 ? 'text-neutral-700 dark:text-neutral-200' : 'text-neutral-300 dark:text-neutral-700 cursor-not-allowed'}`}
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button 
              onClick={handleForward}
              disabled={historyIndex >= historyStack.length - 1}
              title="İleri"
              className={`p-1.5 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 ${historyIndex < historyStack.length - 1 ? 'text-neutral-700 dark:text-neutral-200' : 'text-neutral-300 dark:text-neutral-700 cursor-not-allowed'}`}
            >
              <ArrowRight className="w-4 h-4" />
            </button>
            <button 
              onClick={() => handleNavigateUrl(urlInput)}
              title="Sayfayı Yenile"
              className="p-1.5 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-200"
            >
              <RotateCw className={`w-4 h-4 ${isLoadingPage ? 'animate-spin text-sky-500' : ''}`} />
            </button>
            <button 
              onClick={() => {
                setUrlInput('');
                setTabs(prev => prev.map(t => t.id === activeTabId ? { ...t, isHome: true, url: 'stv://home', title: 'Yeni Sekme' } : t));
              }}
              title="Giriş Sayfası"
              className="p-1.5 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-200"
            >
              <Home className="w-4 h-4" />
            </button>
          </div>

          {/* Omnibox Input */}
          <div className="flex-1 flex items-center gap-2 bg-neutral-100 dark:bg-neutral-800 px-3.5 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 text-xs font-mono focus-within:ring-2 focus-within:ring-sky-500 focus-within:border-sky-500 transition-all">
            <Lock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleNavigateUrl(urlInput)}
              placeholder="Web adresi yazın (örn: https://www.hdfilmcehennemi.nl/the-dog-stars-2/ veya youtube adresi)..."
              className="w-full bg-transparent text-neutral-900 dark:text-neutral-100 focus:outline-none placeholder:text-neutral-400 font-sans text-xs"
            />
            {urlInput && (
              <button
                onClick={() => setUrlInput('')}
                className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              onClick={() => handleNavigateUrl(urlInput)}
              className="p-1 rounded bg-sky-600 hover:bg-sky-700 text-white shrink-0 ml-1"
              title="Git / Ara"
            >
              <Search className="w-3 h-3" />
            </button>
          </div>

          {/* SaveToVideo Direct Action Controls */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Quick In-Browser Download Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowQualityDropdown(!showQualityDropdown)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-semibold transition-all shadow-xs"
                title="Dahili Tarayıcıdan İndir"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Tarayıcıdan İndir</span>
                <span className="w-5 h-5 rounded-full bg-white/20 text-white font-mono text-[10px] flex items-center justify-center font-bold">
                  {activeTab.streams.length}
                </span>
                <ChevronDown className="w-3.5 h-3.5 opacity-70" />
              </button>

              {/* Quality Dropdown Menu */}
              {showQualityDropdown && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-neutral-800 rounded-xl shadow-2xl border border-neutral-200 dark:border-neutral-700 p-2 z-50">
                  <div className="px-3 py-2 border-b border-neutral-100 dark:border-neutral-700 flex items-center justify-between">
                    <span className="font-bold text-neutral-900 dark:text-neutral-100 text-xs">
                      Dahili İndirme Akışları
                    </span>
                    <span className="text-[10px] text-emerald-500 font-medium">● Hazır</span>
                  </div>

                  <div className="py-1 max-h-64 overflow-y-auto space-y-1">
                    {activeTab.streams.length === 0 ? (
                      <div className="p-3 text-center text-neutral-500">
                        Bu sayfada henüz video tespit edilmedi.
                      </div>
                    ) : (
                      activeTab.streams.map((stream) => (
                        <div
                          key={stream.id}
                          className="flex items-center justify-between p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700/60 transition-colors group"
                        >
                          <div className="flex flex-col min-w-0 pr-2">
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-neutral-800 dark:text-neutral-200 text-xs">
                                {stream.quality}
                              </span>
                              <span className="text-[10px] font-mono px-1 rounded bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300">
                                {stream.format}
                              </span>
                            </div>
                            <span className="text-[10px] text-neutral-500 dark:text-neutral-400 truncate">
                              {stream.sizeFormatted} · {stream.bitrate || 'Standart Bitrate'}
                            </span>
                          </div>

                          <button
                            onClick={() => handleDirectDownloadClick(stream)}
                            className="px-2.5 py-1.5 rounded-md bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold flex items-center gap-1 shrink-0 shadow-2xs group-hover:bg-emerald-600 transition-colors"
                          >
                            <Zap className="w-3 h-3 fill-white" />
                            <span>İndir</span>
                          </button>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="pt-2 border-t border-neutral-100 dark:border-neutral-700 flex items-center justify-between text-[11px] px-2 text-neutral-500">
                    <span>8x Paralel Bağlantı Hızı</span>
                    <button
                      onClick={() => {
                        setShowQualityDropdown(false);
                        onTriggerSnifferModal(activeTab.streams, activeTab.title, activeTab.url, activeTab.poster);
                      }}
                      className="text-sky-600 dark:text-sky-400 hover:underline font-medium"
                    >
                      Gelişmiş Ayarlar
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Loading progress bar indicator */}
          {isLoadingPage && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-neutral-200 dark:bg-neutral-700 overflow-hidden">
              <div className="h-full bg-sky-500 animate-[pulse_1s_infinite] w-full" />
            </div>
          )}
        </div>

        {/* Bookmarks Bar */}
        <div className="bg-neutral-50 dark:bg-neutral-900/60 px-3 py-1.5 border-b border-neutral-200 dark:border-neutral-800 flex items-center gap-2 overflow-x-auto select-none">
          <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
            <span>Yer İmleri:</span>
          </span>
          {DEFAULT_BOOKMARKS.map((bm, idx) => (
            <button
              key={idx}
              onClick={() => handleNavigateUrl(bm.url)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] bg-white dark:bg-neutral-800 hover:bg-sky-50 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 hover:text-sky-600 dark:hover:text-sky-400 border border-neutral-200 dark:border-neutral-700 transition-colors shrink-0"
            >
              <span>{bm.icon}</span>
              <span className="font-medium">{bm.name}</span>
              <span className="text-[9px] font-mono px-1 rounded bg-neutral-100 dark:bg-neutral-900 text-neutral-500">
                {bm.badge}
              </span>
            </button>
          ))}
        </div>

        {/* Web Content & Video Presentation Area */}
        <div className="flex-1 bg-neutral-950 relative flex flex-col justify-center items-center overflow-hidden">
          {activeTab.isHome ? (
            /* Browser Start / Speed Dial Page */
            <div className="w-full max-w-3xl p-8 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-sky-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-lg mb-4">
                STV
              </div>
              <h2 className="text-xl font-bold text-white mb-2">
                SaveToVideo Dahili Web Tarayıcısı
              </h2>
              <p className="text-neutral-400 text-xs max-w-md mb-6">
                Aşağıdaki popüler video sitelerinden birini seçin ya da adres çubuğuna dilediğiniz video bağlantısını yapıştırın.
              </p>

              {/* Speed Dial Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 w-full">
                {DEFAULT_BOOKMARKS.map((bm, i) => (
                  <div
                    key={i}
                    onClick={() => handleNavigateUrl(bm.url)}
                    className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-sky-500 cursor-pointer text-left transition-all hover:-translate-y-0.5 group"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl">{bm.icon}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-500/20 text-sky-400 font-semibold">
                        {bm.badge}
                      </span>
                    </div>
                    <div className="font-bold text-white text-xs group-hover:text-sky-400 transition-colors">
                      {bm.name}
                    </div>
                    <div className="text-[10px] text-neutral-500 truncate mt-1">
                      {bm.url}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* Active Web Page with Video Player */
            <div className="w-full h-full flex flex-col relative">
              {/* Floating STV Video Download Overlay Button */}
              <div className="absolute top-4 right-4 z-30 flex items-center gap-2">
                {/* 1-Click Fast Download Direct from Browser */}
                <button
                  onClick={() => handleDirectDownloadClick(bestStream || undefined)}
                  className="bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold px-3.5 py-2 rounded-xl shadow-2xl flex items-center gap-2 transition-all transform hover:scale-105 active:scale-95 border border-amber-300"
                  title="Bu tarayıcı üzerinden 1 tıkla anında indir"
                >
                  <Zap className="w-4 h-4 fill-neutral-950" />
                  <span className="text-xs">Bu Tarayıcıdan Hemen İndir</span>
                  {bestStream && (
                    <span className="bg-neutral-900 text-amber-300 text-[10px] font-mono px-1.5 py-0.5 rounded font-bold">
                      {bestStream.quality}
                    </span>
                  )}
                </button>

                {/* Stream Picker Modal Button */}
                <button
                  onClick={() => onTriggerSnifferModal(activeTab.streams, activeTab.title, activeTab.url, activeTab.poster)}
                  className="bg-neutral-900/90 hover:bg-sky-600 border border-white/20 hover:border-sky-400 backdrop-blur-md text-white px-3 py-2 rounded-xl shadow-xl flex items-center gap-2 transition-all group"
                  title="Tüm Kalite Seçeneklerini Göster"
                >
                  <div className="w-5 h-4 rounded bg-sky-500 group-hover:bg-white text-white group-hover:text-sky-600 flex items-center justify-center font-bold text-[8px]">
                    STV
                  </div>
                  <span className="font-medium text-xs">Kalite Seç</span>
                  <span className="bg-emerald-500 text-white font-mono text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                    {activeTab.streams.length}
                  </span>
                </button>
              </div>

              {/* HDFilmCehennemi Server Selector Bar */}
              {activeTab.url.toLowerCase().includes('hdfilmcehennemi') && (
                <div className="w-full bg-neutral-950 px-4 py-2 border-b border-neutral-800 flex flex-wrap items-center justify-between gap-2 z-10 text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="text-neutral-400 text-[11px]">Sunucu:</span>
                    <span className="px-2.5 py-1 rounded bg-sky-600 text-white font-medium text-[11px] flex items-center gap-1">
                      <Film className="w-3 h-3" />
                      Cehennem Player (1080p FHD)
                    </span>
                    <span className="px-2.5 py-1 rounded bg-neutral-800 text-neutral-300 hover:bg-neutral-700 cursor-pointer text-[11px]">
                      VidMoly
                    </span>
                    <span className="px-2.5 py-1 rounded bg-neutral-800 text-neutral-300 hover:bg-neutral-700 cursor-pointer text-[11px]">
                      Rapidrame HLS
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded bg-emerald-600/80 text-white text-[11px] font-medium">
                      🇹🇷 Türkçe Dublaj
                    </span>
                    <span className="px-2 py-0.5 rounded bg-neutral-800 text-neutral-300 text-[11px]">
                      💬 Altyazılı
                    </span>
                  </div>
                </div>
              )}

              {/* Genuine YouTube Player or HTML5 Video Player */}
              <div className="flex-1 flex items-center justify-center bg-black min-h-[440px]">
                {(() => {
                  const ytMatch = activeTab.url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/i);
                  const currentYtId = ytMatch ? ytMatch[1] : null;

                  if (currentYtId) {
                    return (
                      <iframe
                        src={`https://www.youtube-nocookie.com/embed/${currentYtId}?autoplay=1&enablejsapi=1`}
                        title={activeTab.title}
                        className="w-full h-[460px] border-0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                      />
                    );
                  }

                  return (
                    <video
                      ref={videoRef}
                      src={activeTab.videoSrc}
                      poster={activeTab.poster}
                      controls
                      playsInline
                      onPlay={() => setIsPlaying(true)}
                      onPause={() => setIsPlaying(false)}
                      className="w-full max-h-[460px] object-contain shadow-inner"
                    />
                  );
                })()}
              </div>
            </div>
          )}
        </div>

        {/* Video Info and Browser Actions Footer */}
        {!activeTab.isHome && (
          <div className="p-4 bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-neutral-900 dark:text-neutral-100 text-sm truncate">
                  {activeTab.title}
                </h4>
                <span className="px-2 py-0.5 rounded bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 font-mono text-[10px] shrink-0">
                  {activeTab.streams.length} Akış Yakalandı
                </span>
              </div>
              <p className="text-neutral-500 dark:text-neutral-400 text-xs mt-0.5 truncate max-w-2xl">
                {activeTab.desc}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setShowNetworkSniffer(!showNetworkSniffer)}
                className="px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 font-medium flex items-center gap-1.5 transition-colors text-xs"
              >
                <Terminal className="w-3.5 h-3.5 text-neutral-500" />
                <span>Ağ Dinleyici ({showNetworkSniffer ? 'Gizle' : 'Göster'})</span>
              </button>

              {bestStream && (
                <button
                  onClick={() => handleDirectDownloadClick(bestStream)}
                  className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-lg shadow-sm flex items-center gap-1.5 transition-all text-xs"
                >
                  <Download className="w-4 h-4" />
                  <span>Bu Videoyu İndir</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Live Network Sniffer Console */}
        {showNetworkSniffer && !activeTab.isHome && (
          <div className="bg-neutral-950 text-neutral-300 p-4 font-mono text-[11px] border-t border-neutral-800 space-y-2">
            <div className="flex items-center justify-between text-neutral-400 border-b border-neutral-800 pb-2">
              <div className="flex items-center gap-2">
                <Activity className="w-3.5 h-3.5 text-emerald-400" />
                <span className="font-semibold text-neutral-200">
                  SaveToVideo Dahili Ağ Dinleyicisi (Live Stream Interceptor)
                </span>
              </div>
              <span className="text-[10px] text-emerald-400">
                ● Canlı Dinleme Aktif
              </span>
            </div>

            <div className="space-y-1.5 max-h-36 overflow-y-auto pt-1">
              {activeTab.streams.map((s) => (
                <div key={s.id} className="flex items-center justify-between py-1 px-2 rounded bg-neutral-900/60 hover:bg-neutral-900 text-neutral-300">
                  <div className="flex items-center gap-2 truncate max-w-lg">
                    <span className="text-emerald-400 font-bold">GET 206</span>
                    <span className="text-sky-400">{s.quality}</span>
                    <span className="text-neutral-500 truncate">{s.url}</span>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-neutral-400">{s.sizeFormatted}</span>
                    <span className="text-neutral-500">{s.mimeType}</span>
                    <button
                      onClick={() => handleDirectDownloadClick(s)}
                      className="px-2 py-0.5 bg-sky-700 hover:bg-sky-600 text-white rounded text-[10px] font-sans font-semibold"
                    >
                      Hemen İndir
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* IN-BROWSER LIVE DOWNLOAD DOCK (Dahili Tarayıcı İndirme Paneli) */}
        {currentDownloadingItem && (
          <div className="bg-sky-900/30 dark:bg-neutral-950/90 border-t-2 border-sky-500 px-4 py-3 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs select-none">
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative w-12 h-10 rounded-lg overflow-hidden bg-neutral-800 shrink-0 border border-neutral-700">
                <img
                  src={currentDownloadingItem.thumbnail || activeTab.poster}
                  alt=""
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-sky-900/40 flex items-center justify-center">
                  <Download className="w-4 h-4 text-white animate-bounce" />
                </div>
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-neutral-900 dark:text-neutral-100 truncate max-w-xs sm:max-w-md">
                    {currentDownloadingItem.fileName}
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-sky-600 text-white font-mono text-[10px] font-bold shrink-0">
                    %{currentDownloadingItem.progress}
                  </span>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono font-semibold shrink-0">
                    {currentDownloadingItem.speedFormatted}
                  </span>
                </div>

                {/* Progress bar and eta */}
                <div className="flex items-center gap-3 mt-1">
                  <div className="w-44 sm:w-64 h-2 rounded-full bg-neutral-200 dark:bg-neutral-700 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-sky-500 to-indigo-500 transition-all duration-300"
                      style={{ width: `${currentDownloadingItem.progress}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-neutral-500 dark:text-neutral-400">
                    Kalan: {currentDownloadingItem.timeLeft} · {currentDownloadingItem.connections}x Kanal
                  </span>
                </div>
              </div>
            </div>

            {/* In-Browser Dock Quick Action Buttons */}
            <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
              {onWatchNow && (
                <button
                  onClick={() => onWatchNow(currentDownloadingItem)}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg flex items-center gap-1.5 shadow-xs transition-colors"
                  title="İndirilirken eşzamanlı izle"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>Şimdi İzle</span>
                </button>
              )}

              {onShowInFolder && (
                <button
                  onClick={() => onShowInFolder(currentDownloadingItem)}
                  className="px-3 py-1.5 bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 font-medium rounded-lg flex items-center gap-1.5 transition-colors"
                  title="Klasörde Göster"
                >
                  <Folder className="w-3.5 h-3.5 text-amber-500" />
                  <span>Klasörde Göster</span>
                </button>
              )}

              {onTogglePause && (
                <button
                  onClick={() => onTogglePause(currentDownloadingItem.id)}
                  className="p-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                  title={currentDownloadingItem.status === 'downloading' ? 'Duraklat' : 'Devam Et'}
                >
                  {currentDownloadingItem.status === 'downloading' ? (
                    <Pause className="w-3.5 h-3.5" />
                  ) : (
                    <Play className="w-3.5 h-3.5" />
                  )}
                </button>
              )}

              {onNavigateToDownloads && (
                <button
                  onClick={onNavigateToDownloads}
                  className="px-3 py-1.5 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-lg flex items-center gap-1 transition-colors"
                  title="İndirmeler Listesine Git"
                >
                  <List className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">İndirmeler</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
