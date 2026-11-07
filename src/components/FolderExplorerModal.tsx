import React, { useState } from 'react';
import { 
  X, 
  FolderOpen, 
  Copy, 
  Check, 
  Play, 
  HardDrive, 
  FileVideo, 
  FileAudio, 
  FileCode, 
  File, 
  ExternalLink,
  ChevronRight,
  Info,
  Clock,
  CheckCircle2,
  Download
} from 'lucide-react';
import { DownloadItem } from '../types/idm';
import { formatBytes } from '../services/sniffService';

interface FolderExplorerModalProps {
  item: DownloadItem | null;
  isOpen: boolean;
  onClose: () => void;
  onWatchNow?: (item: DownloadItem) => void;
  onSaveToDisk?: (item: DownloadItem) => void;
}

export const FolderExplorerModal: React.FC<FolderExplorerModalProps> = ({
  item,
  isOpen,
  onClose,
  onWatchNow,
  onSaveToDisk,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !item) return null;

  const handleCopyPath = () => {
    navigator.clipboard.writeText(item.savePath);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Derive folder path and file name
  const lastSlashIndex = item.savePath.lastIndexOf('\\');
  const folderPath = lastSlashIndex !== -1 ? item.savePath.substring(0, lastSlashIndex + 1) : 'C:\\Users\\Downloads\\SaveToVideo_Videos\\';
  const fileName = lastSlashIndex !== -1 ? item.savePath.substring(lastSlashIndex + 1) : item.fileName;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 font-sans animate-in fade-in duration-150">
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl flex flex-col text-xs">
        {/* Window Top Bar (Windows Explorer Style) */}
        <div className="px-5 py-3.5 bg-neutral-100 dark:bg-neutral-800/80 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-neutral-800 dark:text-neutral-200 font-semibold text-xs">
            <FolderOpen className="w-4 h-4 text-amber-500" />
            <span>Dosya Konumu &amp; Klasör Görünümü</span>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-md text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Explorer Address Bar / Path Bar */}
        <div className="px-5 py-2.5 bg-neutral-50 dark:bg-neutral-900/60 border-b border-neutral-200 dark:border-neutral-800 flex items-center gap-2">
          <HardDrive className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
          <div className="flex-1 flex items-center gap-1 font-mono text-[11px] text-neutral-600 dark:text-neutral-300 truncate bg-white dark:bg-neutral-800 px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700">
            <span className="text-neutral-400">Bu Bilgisayar</span>
            <ChevronRight className="w-3 h-3 text-neutral-400 shrink-0" />
            <span className="text-neutral-400">İndirilenler</span>
            <ChevronRight className="w-3 h-3 text-neutral-400 shrink-0" />
            <span className="text-sky-600 dark:text-sky-400 font-semibold truncate">SaveToVideo_Videos</span>
          </div>

          <button
            onClick={handleCopyPath}
            title="Dosya Yolunu Kopyala"
            className="px-2.5 py-1.5 rounded-lg bg-white dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-200 border border-neutral-300 dark:border-neutral-700 font-medium flex items-center gap-1.5 transition-colors shrink-0 shadow-2xs cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold text-[11px]">Kopyalandı!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-neutral-500" />
                <span className="text-[11px]">Yolu Kopyala</span>
              </>
            )}
          </button>
        </div>

        {/* Selected File Card in Folder */}
        <div className="p-6 space-y-4">
          <div className="p-4 rounded-xl bg-sky-50/70 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-900/60 flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0 border border-purple-500/30">
              <FileVideo className="w-6 h-6" />
            </div>

            <div className="flex-1 min-w-0 space-y-1">
              <div className="font-bold text-neutral-900 dark:text-neutral-100 text-sm truncate" title={fileName}>
                {fileName}
              </div>
              <div className="font-mono text-[11px] text-neutral-500 dark:text-neutral-400 break-all">
                {item.savePath}
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px]">
                <span className="px-2 py-0.5 rounded-md bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-medium font-mono">
                  {formatBytes(item.fileSize)}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 font-medium font-mono">
                  {item.quality || '1080p FHD'}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-mono">
                  {item.format || 'MP4'}
                </span>
                {item.status === 'completed' ? (
                  <span className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-medium flex items-center gap-1 font-mono">
                    <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                    <span>İndirme Tamamlandı (%100)</span>
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-md bg-sky-100 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 font-medium flex items-center gap-1 font-mono">
                    <Clock className="w-3 h-3 text-sky-500 animate-spin" />
                    <span>İndiriliyor: %{item.progress} ({item.speedFormatted})</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Location Details Grid */}
          <div className="grid grid-cols-2 gap-3 text-[11px]">
            <div className="p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200/60 dark:border-neutral-800 space-y-1">
              <span className="text-neutral-400 block font-medium">Hedef Klasör Yolu:</span>
              <span className="font-mono text-neutral-800 dark:text-neutral-200 font-semibold break-all text-[10px]">
                {folderPath}
              </span>
            </div>

            <div className="p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200/60 dark:border-neutral-800 space-y-1">
              <span className="text-neutral-400 block font-medium">Kaynak Adres (URL):</span>
              <span className="font-mono text-sky-600 dark:text-sky-400 font-semibold truncate block text-[10px]" title={item.sourceAddress || item.pageUrl || item.url}>
                {item.sourceAddress || item.pageUrl || item.url}
              </span>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="px-6 py-3.5 bg-neutral-50 dark:bg-neutral-800/60 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
          <div className="text-[11px] text-neutral-500">
            SaveToVideo yerel indirme dizininde kayıtlıdır.
          </div>

          <div className="flex items-center gap-2">
            {onWatchNow && (
              <button
                onClick={() => {
                  onClose();
                  onWatchNow(item);
                }}
                className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Şimdi İzle</span>
              </button>
            )}

            {onSaveToDisk && (
              <button
                onClick={() => {
                  onSaveToDisk(item);
                }}
                className="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-semibold flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Dosyayı İndir</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 text-neutral-800 dark:text-neutral-200 font-medium transition-colors cursor-pointer"
            >
              Kapat
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
