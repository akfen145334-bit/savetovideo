import React, { useState } from 'react';
import { 
  Search, 
  Globe, 
  Layers, 
  CheckCircle2, 
  Video, 
  Music, 
  Download, 
  RefreshCw, 
  Sparkles, 
  AlertCircle,
  FileCode,
  Sliders,
  ExternalLink
} from 'lucide-react';
import { DetectedStream, SniffResult } from '../types/idm';
import { sniffVideoMedia } from '../services/sniffService';

interface DeepSnifferViewProps {
  onSelectStream: (stream: DetectedStream) => void;
  onQuickSniffUrl?: (url: string) => void;
}

export const DeepSnifferView: React.FC<DeepSnifferViewProps> = ({
  onSelectStream,
}) => {
  const [inputUrl, setInputUrl] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState<string>('');
  const [result, setResult] = useState<SniffResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const sampleSites = [
    {
      title: 'The Dog Stars 2 (HDFilmCehennemi)',
      url: 'https://www.hdfilmcehennemi.nl/the-dog-stars-2/',
      badge: '1080p FHD / HLS / Dublaj',
    },
    {
      title: 'YouTube (wCyyVuDIsrg)',
      url: 'https://www.youtube.com/watch?v=wCyyVuDIsrg',
      badge: '1080p 60fps / M4A',
    },
    {
      title: 'Tears of Steel (4K Sci-Fi)',
      url: 'https://example-media.com/videos/tears-of-steel',
      badge: '4K / HLS / MP4',
    },
    {
      title: 'Big Buck Bunny (1080p Animasyon)',
      url: 'https://example-media.com/videos/big-buck-bunny',
      badge: '1080p 60fps',
    },
    {
      title: 'Mux HLS Canlı Akış (.m3u8)',
      url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
      badge: 'HLS Master Playlist',
    },
    {
      title: 'Elephants Dream (WebM / VP9)',
      url: 'https://example-media.com/videos/elephants-dream',
      badge: 'VP9 / Açık Kaynak',
    },
  ];

  const handleStartScan = async (targetUrl?: string) => {
    const url = (targetUrl || inputUrl).trim();
    if (!url) {
      setError('Lütfen analiz edilecek bir web adresi veya video bağlantısı girin.');
      return;
    }

    setError(null);
    setIsScanning(true);
    setResult(null);

    // Realistic scanning stages
    setScanStep('1/4 Web sayfası taranıyor ve DOM video etiketleri çözümleniyor...');
    await new Promise(r => setTimeout(r, 450));

    setScanStep('2/4 Sayfa içi gizli JavaScript akış değişkenleri & JSON-LD taranıyor...');
    await new Promise(r => setTimeout(r, 550));

    setScanStep('3/4 HLS (.m3u8) ve DASH (.mpd) çalma listeleri derleniyor...');
    await new Promise(r => setTimeout(r, 450));

    setScanStep('4/4 HTTP Range (kısmi indirme) ve boyut doğrulaması yapılıyor...');

    try {
      const data = await sniffVideoMedia(url);
      setResult(data);
    } catch (err: any) {
      setError('Video bağlantıları taranırken hata: ' + (err.message || 'Bilinmeyen hata'));
    } finally {
      setIsScanning(false);
      setScanStep('');
    }
  };

  return (
    <div className="flex-1 overflow-auto bg-neutral-50 dark:bg-neutral-950 p-6 space-y-6 text-xs font-sans">
      {/* Top Banner / Explanation */}
      <div className="bg-white dark:bg-neutral-900 p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-4">
        <div>
          <h2 className="text-base font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            <Search className="w-5 h-5 text-sky-600 dark:text-sky-400" />
            <span>SaveToVideo Derin Medya &amp; Video Tarayıcı Motoru</span>
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 max-w-2xl leading-relaxed">
            İnternette herhangi bir web sitesinde (YouTube, Vimeo, sosyal medya, haber portalları, dizi-film siteleri vb.) oynatılan videoyu en derin katmanlarına kadar araştırır; doğrudan MP4, HLS (.m3u8), DASH ve ayrık ses parçalarını tek tıkla bulur.
          </p>
        </div>

        {/* Input Bar */}
        <div className="flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1">
            <Globe className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleStartScan()}
              placeholder="Herhangi bir web sayfası adresi veya video linki yapıştırın (Örn: https://example.com/video)..."
              className="w-full pl-9 pr-4 py-2.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
            />
          </div>

          <button
            onClick={() => handleStartScan()}
            disabled={isScanning}
            className={`px-5 py-2.5 rounded-lg font-semibold text-white transition-all shadow-sm flex items-center justify-center gap-2 shrink-0 ${
              isScanning
                ? 'bg-sky-400 cursor-not-allowed'
                : 'bg-sky-600 hover:bg-sky-700'
            }`}
          >
            {isScanning ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Derin Araştırılıyor...</span>
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                <span>Tüm Bağlantıları Araştır &amp; Bul</span>
              </>
            )}
          </button>
        </div>

        {/* Quick Demo Target Buttons */}
        <div className="pt-2 flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-medium text-neutral-400">
            Hızlı Test Siteleri:
          </span>
          {sampleSites.map((site) => (
            <button
              key={site.url}
              onClick={() => {
                setInputUrl(site.url);
                handleStartScan(site.url);
              }}
              className="px-2.5 py-1 rounded bg-neutral-100 dark:bg-neutral-800 hover:bg-sky-50 dark:hover:bg-sky-950/40 text-neutral-700 dark:text-neutral-300 hover:text-sky-600 dark:hover:text-sky-400 border border-neutral-200 dark:border-neutral-700 transition-colors flex items-center gap-1.5"
            >
              <span>{site.title}</span>
              <span className="text-[10px] text-neutral-400 font-mono">
                {site.badge}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Progress / Scanning Status Animation */}
      {isScanning && (
        <div className="bg-white dark:bg-neutral-900 p-6 rounded-xl border border-sky-200 dark:border-sky-900/60 shadow-xs space-y-3">
          <div className="flex items-center gap-3">
            <RefreshCw className="w-5 h-5 text-sky-600 dark:text-sky-400 animate-spin" />
            <div>
              <h4 className="font-semibold text-neutral-900 dark:text-neutral-100 text-xs">
                Derin Tarama Algoritması Çalışıyor
              </h4>
              <p className="text-[11px] text-sky-600 dark:text-sky-400 font-mono mt-0.5">
                {scanStep}
              </p>
            </div>
          </div>
          <div className="w-full h-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
            <div className="h-full bg-sky-500 rounded-full animate-pulse w-3/4" />
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-rose-50 dark:bg-rose-950/40 p-4 rounded-xl border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 flex items-center gap-3">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Scan Results */}
      {result && (
        <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-xs overflow-hidden space-y-4 p-5">
          {/* Header of results */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-100 dark:border-neutral-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-neutral-900 dark:text-neutral-100 text-sm">
                  {result.pageTitle}
                </span>
                <span className="font-mono text-[11px] bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded font-semibold">
                  {result.streamsCount} Bağlantı Bulundu
                </span>
              </div>
              <div className="text-[11px] text-neutral-400 font-mono truncate max-w-xl mt-0.5">
                Kaynak: {result.pageUrl}
              </div>
            </div>
          </div>

          {/* Live Video Preview Box (İndirme ve Arama Sayfasında Video Önizleme) */}
          <div className="rounded-xl overflow-hidden bg-black border border-neutral-200 dark:border-neutral-800 aspect-video max-h-72 flex items-center justify-center relative shadow-sm">
            {(() => {
              const ytMatch = result.pageUrl.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/i);
              const ytId = ytMatch ? ytMatch[1] : null;

              if (ytId) {
                return (
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${ytId}?autoplay=0`}
                    title={result.pageTitle}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                );
              }

              return (
                <video
                  src={result.streams[0]?.url || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4'}
                  poster={result.thumbnail}
                  controls
                  playsInline
                  className="w-full h-full object-contain"
                />
              );
            })()}
          </div>

          {/* Results Table */}
          <div className="divide-y divide-neutral-100 dark:divide-neutral-800 border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
            {result.streams.map((stream) => {
              const isAudio = stream.quality.includes('Audio');
              return (
                <div
                  key={stream.id}
                  className="p-3.5 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-3"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                      isAudio
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400'
                        : 'bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400'
                    }`}>
                      {isAudio ? <Music className="w-4 h-4" /> : <Video className="w-4 h-4" />}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-neutral-900 dark:text-neutral-100 text-xs">
                          {stream.quality}
                        </span>
                        <span className="px-1.5 py-0.2 rounded font-mono font-bold text-[10px] bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                          {stream.format}
                        </span>
                        <span className="text-[11px] text-neutral-400">
                          {stream.resolution}
                        </span>
                        {stream.fps && (
                          <span className="text-[10px] text-neutral-400 font-mono">
                            {stream.fps} FPS
                          </span>
                        )}
                      </div>

                      <div className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1 flex flex-wrap items-center gap-2">
                        <span>Kodek: <code className="font-mono text-[10px]">{stream.codec}</code></span>
                        <span>·</span>
                        <span>Akış: {stream.sourceType}</span>
                        {stream.bitrate && (
                          <>
                            <span>·</span>
                            <span>Bit Hızı: {stream.bitrate}</span>
                          </>
                        )}
                      </div>

                      <div className="text-[10px] font-mono text-neutral-400 truncate max-w-lg mt-0.5">
                        {stream.url}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-4 shrink-0 pl-12 md:pl-0">
                    <div className="text-right">
                      <div className="font-bold font-mono tabular-nums text-neutral-900 dark:text-neutral-100 text-xs">
                        {stream.sizeFormatted}
                      </div>
                      <div className="text-[10px] text-emerald-600 dark:text-emerald-400">
                        {stream.acceptRanges ? 'HTTP Range Destekli' : 'Tek Parça Akış'}
                      </div>
                    </div>

                    <button
                      onClick={() => onSelectStream(stream)}
                      className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-lg text-xs transition-colors shadow-2xs flex items-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Bu Kaliteyi İndir</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
