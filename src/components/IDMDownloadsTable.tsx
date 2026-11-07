import React from 'react';
import { 
  Play, 
  Pause, 
  Trash2, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  FileVideo, 
  FileAudio, 
  FileArchive, 
  FileText, 
  Cpu,
  Download,
  Eye
} from 'lucide-react';
import { DownloadItem } from '../types/idm';
import { formatBytes } from '../services/sniffService';

interface IDMDownloadsTableProps {
  downloads: DownloadItem[];
  selectedIds: string[];
  onToggleSelectId: (id: string, multi?: boolean) => void;
  onSelectAll: () => void;
  onClearSelection: () => void;
  onOpenSegmentDialog: (item: DownloadItem) => void;
  onOpenPreview: (item: DownloadItem) => void;
  onSaveToDisk: (item: DownloadItem) => void;
  onTogglePause: (id: string) => void;
  onDelete: (id: string) => void;
  selectedCategoryName: string;
}

export const IDMDownloadsTable: React.FC<IDMDownloadsTableProps> = ({
  downloads,
  selectedIds,
  onToggleSelectId,
  onSelectAll,
  onClearSelection,
  onOpenSegmentDialog,
  onOpenPreview,
  onSaveToDisk,
  onTogglePause,
  onDelete,
  selectedCategoryName,
}) => {
  const getFileIcon = (category: string) => {
    switch (category) {
      case 'video': return <FileVideo className="w-4 h-4 text-purple-500 shrink-0" />;
      case 'music': return <FileAudio className="w-4 h-4 text-emerald-500 shrink-0" />;
      case 'compressed': return <FileArchive className="w-4 h-4 text-amber-500 shrink-0" />;
      case 'programs': return <Cpu className="w-4 h-4 text-rose-500 shrink-0" />;
      default: return <FileText className="w-4 h-4 text-blue-500 shrink-0" />;
    }
  };

  const getStatusBadge = (status: DownloadItem['status']) => {
    switch (status) {
      case 'downloading':
        return (
          <span className="text-sky-600 dark:text-sky-400 font-medium flex items-center gap-1">
            <Clock className="w-3 h-3 animate-spin text-sky-500" />
            <span>İndiriliyor</span>
          </span>
        );
      case 'completed':
        return (
          <span className="text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
            <span>Tamamlandı</span>
          </span>
        );
      case 'paused':
        return (
          <span className="text-amber-600 dark:text-amber-400 font-medium flex items-center gap-1">
            <Pause className="w-3 h-3 text-amber-500" />
            <span>Duraklatıldı</span>
          </span>
        );
      case 'queued':
        return (
          <span className="text-neutral-500 dark:text-neutral-400 font-medium">
            Kuyrukta
          </span>
        );
      default:
        return (
          <span className="text-rose-600 dark:text-rose-400 font-medium flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            <span>Hata</span>
          </span>
        );
    }
  };

  const isAllSelected = downloads.length > 0 && selectedIds.length === downloads.length;

  if (downloads.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-12 text-center bg-white dark:bg-neutral-900">
        <div className="w-12 h-12 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-400 mb-3">
          <FileVideo className="w-6 h-6" />
        </div>
        <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-1">
          {selectedCategoryName} kategorisinde indirme bulunamadı
        </h3>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-sm mb-4">
          Yukarıdaki "URL Ekle" veya "Derin Medya Tarayıcı" sekmesini kullanarak herhangi bir web videosunun bağlantısını tarayabilir ve çok kanallı hızla indirebilirsiniz.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto bg-white dark:bg-neutral-900">
      <table className="w-full text-left border-collapse text-xs">
        <thead className="bg-neutral-50 dark:bg-neutral-800/60 text-neutral-500 dark:text-neutral-400 font-medium border-b border-neutral-200 dark:border-neutral-800 sticky top-0 z-10 select-none">
          <tr>
            <th className="py-2.5 px-3 w-8 text-center">
              <input
                type="checkbox"
                checked={isAllSelected}
                onChange={() => (isAllSelected ? onClearSelection() : onSelectAll())}
                className="rounded text-sky-600 focus:ring-sky-500"
              />
            </th>
            <th className="py-2.5 px-2 w-10 text-center">#</th>
            <th className="py-2.5 px-3">Dosya Adı</th>
            <th className="py-2.5 px-3 text-right">Boyut</th>
            <th className="py-2.5 px-3">Durum</th>
            <th className="py-2.5 px-3 min-w-[140px]">İlerleme</th>
            <th className="py-2.5 px-3 text-right">Hız</th>
            <th className="py-2.5 px-3 text-right">Kalan Süre</th>
            <th className="py-2.5 px-3 text-center">Bağlantı</th>
            <th className="py-2.5 px-4 text-center">Eylemler</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60 font-sans">
          {downloads.map((item, idx) => {
            const isSelected = selectedIds.includes(item.id);
            return (
              <tr
                key={item.id}
                onClick={(e) => {
                  if ((e.target as HTMLElement).tagName !== 'BUTTON' && (e.target as HTMLElement).tagName !== 'INPUT') {
                    onToggleSelectId(item.id, e.ctrlKey || e.metaKey);
                  }
                }}
                onDoubleClick={() => onOpenSegmentDialog(item)}
                className={`transition-colors cursor-pointer group ${
                  isSelected
                    ? 'bg-sky-50/80 dark:bg-sky-950/30'
                    : 'hover:bg-neutral-50/70 dark:hover:bg-neutral-800/40'
                }`}
              >
                <td className="py-2.5 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onToggleSelectId(item.id, true)}
                    className="rounded text-sky-600 focus:ring-sky-500"
                  />
                </td>

                <td className="py-2.5 px-2 text-center font-mono text-neutral-400">
                  {idx + 1}
                </td>

                <td className="py-2.5 px-3">
                  <div className="flex items-center gap-2 max-w-[280px] lg:max-w-md">
                    {getFileIcon(item.category)}
                    <div className="truncate">
                      <div className="font-medium text-neutral-900 dark:text-neutral-100 truncate" title={item.fileName}>
                        {item.fileName}
                      </div>
                      <div className="text-[11px] text-neutral-400 truncate">
                        {item.quality ? `${item.quality} · ` : ''}{item.codec || item.format}
                      </div>
                    </div>
                  </div>
                </td>

                <td className="py-2.5 px-3 text-right font-mono tabular-nums text-neutral-600 dark:text-neutral-300">
                  {formatBytes(item.fileSize)}
                </td>

                <td className="py-2.5 px-3 whitespace-nowrap">
                  {getStatusBadge(item.status)}
                </td>

                <td className="py-2.5 px-3">
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-[10px] text-neutral-500 font-mono tabular-nums">
                      <span>%{item.progress}</span>
                      <span>{formatBytes(item.downloadedBytes)}</span>
                    </div>
                    {/* Visual Segment Progress Bar */}
                    <div className="w-full h-2 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden flex border border-neutral-200 dark:border-neutral-700">
                      {item.segments && item.segments.length > 0 ? (
                        item.segments.map((seg) => (
                          <div
                            key={seg.id}
                            className={`h-full border-r border-white/20 transition-all duration-300 ${
                              item.status === 'completed'
                                ? 'bg-emerald-500'
                                : seg.status === 'active'
                                ? 'bg-sky-500 animate-pulse'
                                : 'bg-neutral-300 dark:bg-neutral-700'
                            }`}
                            style={{ width: `${100 / item.segments.length}%` }}
                            title={`Parça #${seg.id}: %${seg.progressPercent}`}
                          />
                        ))
                      ) : (
                        <div
                          className={`h-full transition-all duration-300 ${
                            item.status === 'completed' ? 'bg-emerald-500' : 'bg-sky-500'
                          }`}
                          style={{ width: `${item.progress}%` }}
                        />
                      )}
                    </div>
                  </div>
                </td>

                <td className="py-2.5 px-3 text-right font-mono tabular-nums font-medium text-neutral-800 dark:text-neutral-200">
                  {item.status === 'downloading' ? item.speedFormatted : '-'}
                </td>

                <td className="py-2.5 px-3 text-right font-mono tabular-nums text-neutral-600 dark:text-neutral-400">
                  {item.timeLeft}
                </td>

                <td className="py-2.5 px-3 text-center">
                  <span className="font-mono text-[11px] font-semibold text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/50 px-1.5 py-0.5 rounded">
                    {item.connections}x Kanal
                  </span>
                </td>

                <td className="py-2.5 px-4 text-center">
                  <div className="flex items-center justify-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                    {item.status === 'completed' ? (
                      <>
                        <button
                          onClick={() => onOpenPreview(item)}
                          title="Videoyu / Sesi Önizle & Oynat"
                          className="p-1 rounded text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/40 transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => onSaveToDisk(item)}
                          title="Bilgisayara Kaydet / Gerçek Dosyayı İndir"
                          className="p-1 rounded text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => onTogglePause(item.id)}
                        title={item.status === 'downloading' ? 'Duraklat' : 'Devam Et'}
                        className="p-1 rounded text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                      >
                        {item.status === 'downloading' ? (
                          <Pause className="w-3.5 h-3.5 text-amber-500" />
                        ) : (
                          <Play className="w-3.5 h-3.5 text-emerald-500" />
                        )}
                      </button>
                    )}

                    <button
                      onClick={() => onOpenSegmentDialog(item)}
                      title="Parçalı İndirme Durumu ve Bağlantı Ayrıntıları (SaveToVideo Ekranı)"
                      className="p-1 rounded text-neutral-500 hover:text-sky-600 dark:hover:text-sky-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => onDelete(item.id)}
                      title="Listeden Sil"
                      className="p-1 rounded text-neutral-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
