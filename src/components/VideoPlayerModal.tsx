import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Minimize2, 
  ExternalLink, 
  FolderOpen, 
  Download, 
  Zap, 
  Sparkles,
  Info,
  Clock,
  CheckCircle2,
  Tv,
  Globe
} from 'lucide-react';
import { DownloadItem } from '../types/idm';
import { formatBytes } from '../services/sniffService';

interface VideoPlayerModalProps {
  item: DownloadItem | null;
  isOpen: boolean;
  onClose: () => void;
  onShowInFolder?: (item: DownloadItem) => void;
  onSaveToDisk?: (item: DownloadItem) => void;
}

export const VideoPlayerModal: React.FC<VideoPlayerModalProps> = ({
  item,
  isOpen,
  onClose,
  onShowInFolder,
  onSaveToDisk,
}) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isPip, setIsPip] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (isOpen && videoRef.current) {
      videoRef.current.play().catch(() => {
        setIsPlaying(false);
      });
    }
  }, [isOpen, item]);

  if (!isOpen || !item) return null;

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const toggleFullScreen = () => {
    if (!videoRef.current) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      videoRef.current.requestFullscreen();
    }
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const sourceDomain = item.sourceAddress || item.pageUrl 
    ? new URL(item.sourceAddress || item.pageUrl!).hostname 
    : 'Doğrudan Akış';

  // If PiP mini-player mode is active
  if (isPip) {
    return (
      <div className="fixed bottom-4 right-4 z-50 w-84 bg-neutral-900 border border-neutral-700 rounded-xl shadow-2xl overflow-hidden font-sans">
        <div className="relative group bg-black aspect-video flex items-center justify-center">
          <video
            ref={videoRef}
            src={item.url}
            autoPlay
            playsInline
            onTimeUpdate={(e) => setCurrentTime((e.target as HTMLVideoElement).currentTime)}
            onLoadedMetadata={(e) => setDuration((e.target as HTMLVideoElement).duration)}
            className="w-full h-full object-contain"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <button onClick={togglePlay} className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white">
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-current" />}
            </button>
          </div>
          <button
            onClick={() => setIsPip(false)}
            title="Genişlet"
            className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/60 hover:bg-black/80 text-white text-xs transition-colors"
          >
            <Maximize className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="p-2.5 bg-neutral-900 flex items-center justify-between text-xs text-neutral-300">
          <div className="truncate mr-2">
            <div className="font-semibold text-white truncate text-[11px]">{item.fileName}</div>
            <div className="text-[10px] text-sky-400 font-mono">
              {item.status === 'downloading' ? `İndiriliyor: %${item.progress}` : 'İndirildi'} · {formatTime(currentTime)}
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-neutral-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 font-sans animate-in fade-in duration-150">
      <div className="bg-neutral-900 border border-neutral-700/80 rounded-2xl w-full max-w-4xl max-h-[95vh] overflow-hidden shadow-2xl flex flex-col">
        {/* Modal Top Header */}
        <div className="px-5 py-3.5 bg-neutral-900 border-b border-neutral-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 truncate">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/30 border border-indigo-500/40 text-indigo-400 flex items-center justify-center shrink-0">
              <Tv className="w-4 h-4" />
            </div>
            <div className="truncate">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-white text-sm truncate" title={item.fileName}>
                  {item.fileName}
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 shrink-0">
                  {item.quality || '1080p FHD'}
                </span>
                {item.status === 'downloading' && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30 flex items-center gap-1 shrink-0 animate-pulse">
                    <Clock className="w-2.5 h-2.5" />
                    <span>Eşzamanlı İndiriliyor (%{item.progress})</span>
                  </span>
                )}
              </div>
              <div className="text-[11px] text-neutral-400 flex items-center gap-2 mt-0.5">
                <Globe className="w-3 h-3 text-neutral-500 shrink-0" />
                <span className="text-neutral-400 truncate">Kaynak: {sourceDomain}</span>
                <span>·</span>
                <span>Boyut: {formatBytes(item.fileSize)}</span>
                <span>·</span>
                <span>Format: {item.format || 'MP4'}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setIsPip(true)}
              title="Aşağıya Küçült (PiP Mini Oynatıcı)"
              className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors text-xs flex items-center gap-1 px-2.5 cursor-pointer"
            >
              <Minimize2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline text-[11px]">Küçült</span>
            </button>
            <button
              onClick={onClose}
              title="Kapat"
              className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Video Player Display Area */}
        <div className="relative bg-black flex-1 min-h-[380px] max-h-[520px] flex items-center justify-center overflow-hidden group">
          <video
            ref={videoRef}
            src={item.url}
            autoPlay
            playsInline
            controls
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onTimeUpdate={(e) => setCurrentTime((e.target as HTMLVideoElement).currentTime)}
            onLoadedMetadata={(e) => setDuration((e.target as HTMLVideoElement).duration)}
            className="w-full h-full max-h-[520px] object-contain shadow-2xl"
          />

          {/* Floating live download synchronization pill */}
          {item.status === 'downloading' && (
            <div className="absolute top-3 left-3 z-20 pointer-events-none bg-neutral-900/90 backdrop-blur-md border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white shadow-xl flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="font-semibold text-[11px]">Eşzamanlı İndirme &amp; Canlı İzleme</span>
              <span className="font-mono text-sky-400 font-bold">%{item.progress} ({item.speedFormatted})</span>
            </div>
          )}
        </div>

        {/* Footer Info & Quick Actions Bar */}
        <div className="px-5 py-3.5 bg-neutral-900 border-t border-neutral-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-neutral-300">
            <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
            <span className="text-[11px] text-neutral-300">
              SaveToVideo video motoru: Video akışı tamponlandı ve oynatılıyor.
            </span>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            {onShowInFolder && (
              <button
                onClick={() => {
                  onShowInFolder(item);
                }}
                className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <FolderOpen className="w-3.5 h-3.5 text-amber-500" />
                <span>Klasörde Göster</span>
              </button>
            )}

            {onSaveToDisk && (
              <button
                onClick={() => onSaveToDisk(item)}
                className="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-semibold flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Diske Kaydet</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white font-medium transition-colors cursor-pointer"
            >
              Kapat
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
