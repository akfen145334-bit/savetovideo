import React, { useState, useRef } from 'react';
import { 
  ArrowLeft, 
  ArrowRight, 
  RotateCw, 
  Lock, 
  Puzzle, 
  Download, 
  Layers, 
  Terminal,
  Activity,
  Plus,
  Search,
  ExternalLink
} from 'lucide-react';
import { DetectedStream } from '../types/idm';
import { sniffVideoMedia } from '../services/sniffService';

interface EmbeddedChromeBrowserProps {
  onTriggerSnifferModal: (streams: DetectedStream[], pageTitle: string, pageUrl: string) => void;
}

interface WebPageTab {
  id: string;
  title: string;
  url: string;
  videoSrc: string;
  poster: string;
  desc: string;
  streams: DetectedStream[];
}

export const EmbeddedChromeBrowser: React.FC<EmbeddedChromeBrowserProps> = ({
  onTriggerSnifferModal,
}) => {
  const initialTabs: WebPageTab[] = [
    {
      id: 'tab-hdf',
      title: 'The Dog Stars 2 (HDFilmCehennemi)',
      url: 'https://www.hdfilmcehennemi.nl/the-dog-stars-2/',
      videoSrc: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
      poster: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&w=800&q=80',
      desc: 'HDFilmCehennemi platformundaki The Dog Stars 2 filmi. SaveToVideo m3u8 adaptif akış ve 1080p Full HD video bağlantılarını anında tespit etmiştir.',
      streams: [
        {
          id: 'hdf-1080p',
          url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
          title: 'The Dog Stars 2 - 1080p Full HD (Türkçe Dublaj & Altyazılı)',
          format: 'MP4',
          quality: '1080p (FHD)',
          resolution: '1920x1080',
          sizeBytes: 2125996032,
          sizeFormatted: '1.98 GB',
          bitrate: '8.4 Mbps',
          fps: 60,
          codec: 'H.264 / AAC 5.1',
          acceptRanges: true,
          mimeType: 'video/mp4',
          sourceType: 'Direct MP4',
        },
        {
          id: 'hdf-720p',
          url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
          title: 'The Dog Stars 2 - 720p HD (Hızlı İndirme)',
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
          title: 'The Dog Stars 2 - HLS Master Playlist (.m3u8 Canlı Parça)',
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
      id: 'tab-yt',
      title: 'YouTube (wCyyVuDIsrg)',
      url: 'https://www.youtube.com/watch?v=wCyyVuDIsrg',
      videoSrc: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      poster: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
      desc: 'YouTube video akışı: wCyyVuDIsrg. SaveToVideo, YouTube akışlarını 60fps 1080p, 720p ve ayrı ses kanalı olarak otomatik ayrıştırmıştır.',
      streams: [
        {
          id: 'yt-1080p60',
          url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
          title: 'YouTube wCyyVuDIsrg - 1080p 60fps Ultra Yüksek Kalite',
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
          url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
          title: 'YouTube wCyyVuDIsrg - 720p HD',
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
          url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
          title: 'YouTube wCyyVuDIsrg - Ses Parçası (256 kbps M4A)',
          format: 'M4A',
          quality: 'Audio (320k)',
          resolution: 'Audio Only',
          sizeBytes: 39845888,
          sizeFormatted: '38 MB',
          bitrate: '256 kbps',
          codec: 'AAC High Quality',
          acceptRanges: true,
          mimeType: 'audio/mp4',
          sourceType: 'Audio Track',
        }
      ],
    },
    {
      id: 'tab-1',
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
        },
        {
          id: 'tos-720p',
          url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
          title: 'Tears of Steel - HD (720p)',
          format: 'MP4',
          quality: '720p (HD)',
          resolution: '1280x720',
          sizeBytes: 154000000,
          sizeFormatted: '146.9 MB',
          bitrate: '3.1 Mbps',
          fps: 30,
          codec: 'H.264 Main@3.1',
          acceptRanges: true,
          mimeType: 'video/mp4',
          sourceType: 'Direct MP4',
        },
        {
          id: 'tos-audio',
          url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
          title: 'Tears of Steel - Surround Ses Parçası (320k)',
          format: 'M4A',
          quality: 'Audio (320k)',
          resolution: 'Audio Only',
          sizeBytes: 24500000,
          sizeFormatted: '23.4 MB',
          bitrate: '320 kbps',
          codec: 'AAC-LC High Fidelity',
          acceptRanges: true,
          mimeType: 'audio/mp4',
          sourceType: 'Audio Track',
        }
      ],
    },
    {
      id: 'tab-2',
      title: 'Big Buck Bunny (HD Animation Hub)',
      url: 'https://animation-portal.com/watch/big-buck-bunny',
      videoSrc: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      poster: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80',
      desc: 'Blender Vakfı animasyon stüdyosu tarafından üretilen klasik 3D animasyon videosu.',
      streams: [
        {
          id: 'bbb-1080p',
          url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
          title: 'Big Buck Bunny - 1080p 60fps',
          format: 'MP4',
          quality: '1080p (FHD)',
          resolution: '1920x1080',
          sizeBytes: 158000000,
          sizeFormatted: '150.7 MB',
          bitrate: '5.8 Mbps',
          fps: 60,
          codec: 'H.264 / AAC',
          acceptRanges: true,
          mimeType: 'video/mp4',
          sourceType: 'Direct MP4',
        },
        {
          id: 'bbb-720p',
          url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
          title: 'Big Buck Bunny - 720p HD',
          format: 'MP4',
          quality: '720p (HD)',
          resolution: '1280x720',
          sizeBytes: 94000000,
          sizeFormatted: '89.6 MB',
          bitrate: '2.8 Mbps',
          fps: 30,
          codec: 'H.264 / AAC',
          acceptRanges: true,
          mimeType: 'video/mp4',
          sourceType: 'Direct MP4',
        }
      ],
    },
    {
      id: 'tab-3',
      title: 'Mux HLS Adaptive Live Stream',
      url: 'https://live-broadcasting.tv/stream/mux-adaptive',
      videoSrc: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      poster: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
      desc: 'Canlı HLS adaptif akış iletimi. SaveToVideo, .m3u8 manifestini ve tüm TS parçalarını anında yakalar.',
      streams: [
        {
          id: 'mux-m3u8',
          url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
          title: 'Mux HLS Canlı Akış - Adaptif Çoklu Bitrate (.m3u8)',
          format: 'M3U8',
          quality: '1080p (FHD)',
          resolution: '1920x1080',
          sizeBytes: 280000000,
          sizeFormatted: '267.0 MB (TS Chunks)',
          bitrate: 'Adaptif Akış',
          fps: 30,
          codec: 'Apple HTTP Live Streaming',
          acceptRanges: true,
          mimeType: 'application/x-mpegURL',
          sourceType: 'HLS Stream',
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
  const [showNetworkSniffer, setShowNetworkSniffer] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleTabSwitch = (t: WebPageTab) => {
    setActiveTabId(t.id);
    setUrlInput(t.url);
    setIsPlaying(false);
    setHistoryStack([t.url]);
    setHistoryIndex(0);
  };

  const handleNavigateUrl = async (targetUrl: string) => {
    if (!targetUrl.trim()) return;
    setIsLoadingPage(true);

    try {
      const sniffResult = await sniffVideoMedia(targetUrl);
      const newTab: WebPageTab = {
        id: `custom-tab-${Date.now()}`,
        title: sniffResult.pageTitle || 'Özel Web Sayfası',
        url: targetUrl,
        videoSrc: sniffResult.streams[0]?.url || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        poster: sniffResult.thumbnail || 'https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&w=800&q=80',
        desc: `SaveToVideo bu sayfada ${sniffResult.streamsCount} adet indirilebilir akış ve çözünürlük buldu.`,
        streams: sniffResult.streams,
      };

      setTabs(prev => [...prev, newTab]);
      setActiveTabId(newTab.id);
      setUrlInput(newTab.url);
      setHistoryStack(prev => [...prev.slice(0, historyIndex + 1), newTab.url]);
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
    }
  };

  const handleForward = () => {
    if (historyIndex < historyStack.length - 1) {
      const nextUrl = historyStack[historyIndex + 1];
      setHistoryIndex(historyIndex + 1);
      setUrlInput(nextUrl);
    }
  };

  const handleSaveToVideoDownloadClick = () => {
    onTriggerSnifferModal(activeTab.streams, activeTab.title, activeTab.url);
  };

  return (
    <div className="flex-1 overflow-auto bg-neutral-100 dark:bg-neutral-950 p-6 flex flex-col gap-4 text-xs font-sans">
      {/* Intro info box */}
      <div className="bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-900/60 rounded-xl p-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-sky-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
            Chrome
          </div>
          <div>
            <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 text-xs">
              Google Chrome İçine Gömülü SaveToVideo Video Yakalayıcı Simülasyonu
            </h3>
            <p className="text-[11px] text-neutral-600 dark:text-neutral-400 mt-0.5">
              Chrome'da açılan her video oynatıcısının üzerinde SaveToVideo'nun meşhur <strong>"Bu Videoyu İndir"</strong> paneli otomatik olarak belirir. Adres çubuğuna dilediğiniz video sitesini yazıp Enter'a basabilirsiniz.
            </p>
          </div>
        </div>

        <button
          onClick={handleSaveToVideoDownloadClick}
          className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-lg shrink-0 shadow-2xs flex items-center gap-1.5 transition-colors"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Bu Videoyu İndir ({activeTab.streams.length} Akış)</span>
        </button>
      </div>

      {/* Chrome Window Frame */}
      <div className="w-full bg-white dark:bg-neutral-900 rounded-xl border border-neutral-300 dark:border-neutral-700 shadow-xl overflow-hidden flex flex-col">
        {/* Chrome Title Bar & Tabs */}
        <div className="bg-neutral-200 dark:bg-neutral-800 px-3 pt-2.5 flex items-center gap-2 select-none">
          {/* Mac / Window control dots */}
          <div className="flex items-center gap-1.5 px-2">
            <div className="w-3 h-3 rounded-full bg-rose-500/80" />
            <div className="w-3 h-3 rounded-full bg-amber-500/80" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
          </div>

          {/* Chrome Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto flex-1">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => handleTabSwitch(t)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-t-lg text-[11px] font-medium transition-all max-w-[200px] truncate ${
                  activeTabId === t.id
                    ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 shadow-2xs'
                    : 'bg-neutral-300/60 dark:bg-neutral-800/60 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-300 dark:hover:bg-neutral-700'
                }`}
              >
                <div className="w-2 h-2 rounded-full bg-sky-500" />
                <span className="truncate">{t.title}</span>
              </button>
            ))}

            <button
              onClick={() => handleNavigateUrl('https://example-media.com/videos/custom-test')}
              title="Yeni Video Sekmesi Aç"
              className="p-1.5 text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200 rounded-full hover:bg-neutral-300/60 dark:hover:bg-neutral-700 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Chrome Navigation & Address Bar */}
        <div className="bg-white dark:bg-neutral-900 px-3 py-2 border-b border-neutral-200 dark:border-neutral-800 flex items-center gap-3">
          <div className="flex items-center gap-1 text-neutral-500">
            <button 
              onClick={handleBack}
              disabled={historyIndex <= 0}
              title="Geri"
              className={`p-1 rounded ${historyIndex > 0 ? 'hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300' : 'text-neutral-300 dark:text-neutral-700 cursor-not-allowed'}`}
            >
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
            <button 
              onClick={handleForward}
              disabled={historyIndex >= historyStack.length - 1}
              title="İleri"
              className={`p-1 rounded ${historyIndex < historyStack.length - 1 ? 'hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300' : 'text-neutral-300 dark:text-neutral-700 cursor-not-allowed'}`}
            >
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button 
              onClick={() => {
                if (videoRef.current) {
                  videoRef.current.load();
                  setIsPlaying(false);
                }
              }}
              title="Sayfayı Yenile"
              className="p-1 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
            >
              <RotateCw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Omnibox / Address URL input */}
          <div className="flex-1 flex items-center gap-2 bg-neutral-100 dark:bg-neutral-800 px-3 py-1.5 rounded-full border border-neutral-200 dark:border-neutral-700 text-xs font-mono">
            <Lock className="w-3 h-3 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleNavigateUrl(urlInput)}
              placeholder="Web adresi girin ve Enter'a basın..."
              className="w-full bg-transparent text-neutral-900 dark:text-neutral-100 focus:outline-none"
            />
            {isLoadingPage && (
              <span className="text-[10px] text-sky-600 animate-pulse font-sans">
                Yükleniyor...
              </span>
            )}
          </div>

          {/* Chrome Extensions Area */}
          <div className="flex items-center gap-2 shrink-0">
            {/* SaveToVideo Extension Icon with Live Detection Badge */}
            <button
              onClick={handleSaveToVideoDownloadClick}
              title={`SaveToVideo: Bu sekmede ${activeTab.streams.length} adet video akışı yakalandı`}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-sky-50 dark:bg-sky-950/60 border border-sky-300 dark:border-sky-800 text-sky-700 dark:text-sky-300 font-semibold hover:bg-sky-100 transition-colors shadow-2xs"
            >
              <Puzzle className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
              <span>STV</span>
              <span className="w-4 h-4 rounded-full bg-emerald-500 text-white font-mono text-[9px] flex items-center justify-center font-bold">
                {activeTab.streams.length}
              </span>
            </button>
          </div>
        </div>

        {/* Chrome Webpage Content Area with HTML5 Video */}
        <div className="bg-neutral-900 relative min-h-[380px] flex flex-col justify-center items-center">
          {/* THE FAMOUS FLOATING VIDEO DOWNLOAD PANEL (Gömülü SaveToVideo Butonu) */}
          <div 
            onClick={handleSaveToVideoDownloadClick}
            className="absolute top-4 right-4 z-30 cursor-pointer bg-neutral-900/90 hover:bg-sky-600 border border-white/20 hover:border-sky-400 backdrop-blur-md text-white px-3.5 py-1.5 rounded-lg shadow-xl flex items-center gap-2 transition-all transform hover:-translate-y-0.5 group select-none"
          >
            <div className="w-6 h-4 rounded bg-sky-500 group-hover:bg-white text-white group-hover:text-sky-600 flex items-center justify-center font-bold text-[8px]">
              STV
            </div>
            <span className="font-semibold text-xs tracking-wide">
              Bu Videoyu İndir
            </span>
            <span className="bg-emerald-500 text-white font-mono text-[10px] font-bold px-1.5 py-0.2 rounded-full">
              {activeTab.streams.length} Kalite
            </span>
          </div>

          {/* Real HTML5 Video Player */}
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
        </div>

        {/* Video Metadata & Description Bar */}
        <div className="p-4 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h4 className="font-bold text-neutral-900 dark:text-neutral-100 text-sm">
              {activeTab.title}
            </h4>
            <p className="text-neutral-500 dark:text-neutral-400 text-xs mt-0.5">
              {activeTab.desc}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowNetworkSniffer(!showNetworkSniffer)}
              className="px-3 py-1.5 rounded-md border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 font-medium flex items-center gap-1.5 transition-colors"
            >
              <Terminal className="w-3.5 h-3.5 text-neutral-500" />
              <span>Ağ Medya Yakalayıcısı ({showNetworkSniffer ? 'Gizle' : 'Göster'})</span>
            </button>

            <button
              onClick={handleSaveToVideoDownloadClick}
              className="px-3.5 py-1.5 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-md shadow-2xs flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Kalite Seç &amp; İndir</span>
            </button>
          </div>
        </div>

        {/* Live Network Media Sniffer DevTools Panel */}
        {showNetworkSniffer && (
          <div className="bg-neutral-950 text-neutral-300 p-4 font-mono text-[11px] border-t border-neutral-800 space-y-2">
            <div className="flex items-center justify-between text-neutral-400 border-b border-neutral-800 pb-2">
              <div className="flex items-center gap-2">
                <Activity className="w-3.5 h-3.5 text-emerald-400" />
                <span className="font-semibold text-neutral-200">
                  Chrome Ağ Akışı Dinleyicisi (SaveToVideo Deep Network Sniffer)
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
                      onClick={handleSaveToVideoDownloadClick}
                      className="px-2 py-0.5 bg-sky-700 hover:bg-sky-600 text-white rounded text-[10px] font-sans font-semibold"
                    >
                      Yakala
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
