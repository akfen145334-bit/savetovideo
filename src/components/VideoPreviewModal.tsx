import React from 'react';
import { X, Play, Download, ExternalLink, HardDrive } from 'lucide-react';
import { DownloadItem } from '../types/idm';
import { formatBytes } from '../services/sniffService';

interface VideoPreviewModalProps {
  item: DownloadItem | null;
  onClose: () => void;
  onSaveToDisk: (item: DownloadItem) => void;
}

export const VideoPreviewModal: React.FC<VideoPreviewModalProps> = ({
  item,
  onClose,
  onSaveToDisk,
}) => {
  if (!item) return null;

  const isAudio = item.category === 'music' || item.fileName.endsWith('.mp3') || item.fileName.endsWith('.m4a');

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="w-full max-w-2xl bg-neutral-900 border border-neutral-700 rounded-xl shadow-2xl overflow-hidden text-neutral-100 text-xs font-sans"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-neutral-800 px-5 py-3 border-b border-neutral-700 flex items-center justify-between">
          <div className="flex items-center gap-2 truncate max-w-md">
            <Play className="w-4 h-4 text-sky-400 shrink-0" />
            <span className="font-semibold text-sm truncate">
              {item.fileName}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-neutral-400 hover:text-white rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Media Player Area */}
        <div className="bg-black relative min-h-[320px] flex items-center justify-center p-2">
          {isAudio ? (
            <div className="w-full max-w-md p-6 bg-neutral-800 rounded-xl flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xl font-bold">
                MP3
              </div>
              <div className="text-center">
                <div className="font-bold text-sm text-neutral-100">{item.fileName}</div>
                <div className="text-neutral-400 text-xs mt-1">{item.quality || '320kbps Yüksek Kalite Ses'}</div>
              </div>
              <audio src={item.url} controls className="w-full mt-2" autoPlay />
            </div>
          ) : (
            <video
              src={item.url}
              controls
              autoPlay
              playsInline
              className="w-full max-h-[420px] object-contain rounded"
            />
          )}
        </div>

        {/* Footer info & Save to Disk */}
        <div className="bg-neutral-800/90 px-5 py-3 border-t border-neutral-700 flex items-center justify-between">
          <div className="space-y-0.5 text-neutral-400 text-[11px]">
            <div>Boyut: <span className="font-mono text-neutral-200">{formatBytes(item.fileSize)}</span> · Bağlantı: <span className="text-sky-400">{item.connections}x Kanal</span></div>
            <div className="truncate max-w-xs">Kayıt Yolu: {item.savePath}</div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onSaveToDisk(item)}
              className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-md transition-colors flex items-center gap-1.5 shadow-2xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Bilgisayara İndir / Kaydet</span>
            </button>

            <button
              onClick={onClose}
              className="px-3 py-2 bg-neutral-700 hover:bg-neutral-600 text-neutral-200 rounded-md font-medium transition-colors"
            >
              Kapat
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
