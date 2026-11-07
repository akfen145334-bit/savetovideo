import React, { useState } from 'react';
import { 
  X, 
  Video, 
  Music, 
  Download, 
  CheckCircle2, 
  Layers,
  Play,
  Eye,
  EyeOff
} from 'lucide-react';
import { DetectedStream, SniffResult } from '../types/idm';

interface StreamPickerModalProps {
  sniffResult: SniffResult | null;
  onClose: () => void;
  onSelectStream: (stream: DetectedStream) => void;
}

export const StreamPickerModal: React.FC<StreamPickerModalProps> = ({
  sniffResult,
  onClose,
  onSelectStream,
}) => {
  if (!sniffResult) return null;

  const [showLivePreview, setShowLivePreview] = useState(true);

  const getYoutubeId = (url?: string): string | null => {
    if (!url) return null;
    const m = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/i);
    return m ? m[1] : null;
  };

  const ytId = getYoutubeId(sniffResult.pageUrl) || (sniffResult.streams[0] ? getYoutubeId(sniffResult.streams[0].url) : null);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="w-full max-w-2xl bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-xl shadow-2xl overflow-hidden text-xs font-sans max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-neutral-100 dark:bg-neutral-800 px-5 py-3.5 border-b border-neutral-200 dark:border-neutral-700 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-6 rounded bg-sky-600 text-white flex items-center justify-center font-bold text-[10px]">
              STV
            </div>
            <div>
              <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 text-sm">
                Bağlantı ve Kalite Seçim Ekranı
              </h3>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                Bu videoda {sniffResult.streamsCount} adet indirilebilir akış ve çözünürlük tespit edildi
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Media Preview Card & Streams Scroll Area */}
        <div className="p-5 space-y-4 overflow-y-auto flex-1">
          {/* Active Live Video Player Preview (İndirme Sayfasında Canlı Video İzleme) */}
          {showLivePreview && (
            <div className="rounded-xl overflow-hidden bg-black border border-neutral-300 dark:border-neutral-700 aspect-video max-h-64 flex items-center justify-center relative shadow-md">
              {ytId ? (
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${ytId}?autoplay=1`}
                  title={sniffResult.pageTitle}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <video
                  src={sniffResult.streams[0]?.url || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4'}
                  controls
                  autoPlay
                  playsInline
                  className="w-full h-full object-contain"
                />
              )}
            </div>
          )}

          <div className="flex items-start justify-between gap-3.5 p-3 bg-neutral-50 dark:bg-neutral-800/60 rounded-lg border border-neutral-200/80 dark:border-neutral-800">
            <div className="flex items-start gap-3 min-w-0">
              <div className="w-20 h-14 rounded overflow-hidden bg-neutral-900 shrink-0 relative">
                <img
                  src={sniffResult.thumbnail}
                  alt={sniffResult.pageTitle}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center text-white/70 bg-black/30">
                  <Video className="w-4 h-4" />
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-neutral-900 dark:text-neutral-100 text-sm truncate" title={sniffResult.pageTitle}>
                  {sniffResult.pageTitle}
                </h4>
                <p className="text-[11px] text-neutral-400 font-mono truncate mt-0.5" title={sniffResult.pageUrl}>
                  {sniffResult.pageUrl}
                </p>
                <div className="flex items-center gap-2 mt-1.5 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Derin Medya Taraması Başarıyla Tamamlandı</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowLivePreview(!showLivePreview)}
              className="px-2.5 py-1 rounded bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 text-neutral-700 dark:text-neutral-200 font-medium text-[11px] shrink-0 flex items-center gap-1 transition-colors"
            >
              {showLivePreview ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
              <span>{showLivePreview ? 'Videoyu Gizle' : 'Videoyu Oynat'}</span>
            </button>
          </div>

          {/* Streams List */}
          <div className="space-y-2">
            <div className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">
              İndirilebilir Video &amp; Ses Bağlantıları (İstediğinizi Seçin)
            </div>

            <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
              {sniffResult.streams.map((stream) => {
                const isAudio = stream.quality.includes('Audio');
                return (
                  <div
                    key={stream.id}
                    className="flex items-center justify-between p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-800/40 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-8 h-8 rounded flex items-center justify-center shrink-0 ${
                        isAudio
                          ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400'
                          : 'bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400'
                      }`}>
                        {isAudio ? <Music className="w-4 h-4" /> : <Video className="w-4 h-4" />}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-neutral-900 dark:text-neutral-100 text-xs">
                            {stream.quality}
                          </span>
                          <span className="px-1.5 py-0.2 rounded text-[10px] font-mono font-bold bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300">
                            {stream.format}
                          </span>
                          {stream.fps && (
                            <span className="text-[10px] text-neutral-400 font-mono">
                              {stream.fps}fps
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-neutral-400 truncate mt-0.5">
                          {stream.codec} {stream.bitrate ? `· ${stream.bitrate}` : ''} · {stream.sourceType}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 shrink-0 pl-3">
                      <span className="font-mono font-semibold tabular-nums text-neutral-800 dark:text-neutral-200 text-xs">
                        {stream.sizeFormatted}
                      </span>

                      <button
                        onClick={() => onSelectStream(stream)}
                        className="px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white font-medium rounded-md text-xs transition-colors shadow-2xs flex items-center gap-1"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Seç ve İndir</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-neutral-50 dark:bg-neutral-800/80 px-5 py-3 border-t border-neutral-200 dark:border-neutral-700 flex items-center justify-between text-neutral-500 text-[11px]">
          <div className="flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-sky-500" />
            <span>SaveToVideo Çok Kanallı İndirme Motoru aktiftir</span>
          </div>
          <button
            onClick={onClose}
            className="px-3 py-1 bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 rounded font-medium hover:bg-neutral-300 dark:hover:bg-neutral-600 transition-colors"
          >
            Vazgeç
          </button>
        </div>
      </div>
    </div>
  );
};
