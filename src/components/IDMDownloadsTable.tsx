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
  FolderOpen,
  Globe,
  Filter,
  Check
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
  onWatchNow: (item: DownloadItem) => void;
  onShowInFolder: (item: DownloadItem) => void;
  onSaveToDisk: (item: DownloadItem) => void;
  onTogglePause: (id: string) => void;
  onDelete: (id: string) => void;
  selectedCategoryName: string;
  selectedAddressFilter: string;
  onSelectAddressFilter: (address: string) => void;
}

export const IDMDownloadsTable: React.FC<IDMDownloadsTableProps> = ({
  downloads,
  selectedIds,
  onToggleSelectId,
  onSelectAll,
  onClearSelection,
  onOpenSegmentDialog,
  onWatchNow,
  onShowInFolder,
  onSaveToDisk,
  onTogglePause,
  onDelete,
  selectedCategoryName,
  selectedAddressFilter,
  onSelectAddressFilter,
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

  // Extract unique domain/addresses from downloads
  const uniqueAddresses = Array.from(
    new Set(
      downloads
        .map(d => d.sourceAddress || d.pageUrl || d.url)
        .filter(Boolean)
    )
  );

  const getCleanDomain = (addr: string) => {
    try {
      const u = new URL(addr);
      return u.hostname.replace('www.', '');
    } catch {
      return addr.substring(0, 30);
    }
  };

  // Filter downloads by selected address
  const filteredDownloads = selectedAddressFilter === 'all'
    ? downloads
    : downloads.filter(d => (d.sourceAddress || d.pageUrl || d.url) === selectedAddressFilter);

  const isAllSelected = filteredDownloads.length > 0 && selectedIds.length === filteredDownloads.length;

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-white dark:bg-neutral-900">
      {/* Address Selector & Filter Bar ("indirilenlerde adresi seçebileyim") */}
      <div className="px-4 py-2 bg-neutral-50/90 dark:bg-neutral-800/40 border-b border-neutral-200 dark:border-neutral-800 flex items-center gap-2 overflow-x-auto text-[11px] shrink-0">
        <div className="flex items-center gap-1.5 text-neutral-500 font-medium shrink-0 pr-1">
          <Filter className="w-3.5 h-3.5 text-neutral-400" />
          <span>Kaynak Adres:</span>
        </div>

        <button
          onClick={() => onSelectAddressFilter('all')}
          className={`px-2.5 py-1 rounded-md transition-colors shrink-0 font-medium cursor-pointer flex items-center gap-1 ${
            selectedAddressFilter === 'all'
              ? 'bg-sky-600 text-white font-semibold shadow-2xs'
              : 'bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100'
          }`}
        >
          <span>Tüm Adresler ({downloads.length})</span>
        </button>

        {uniqueAddresses.map((addr) => {
          const isSelected = selectedAddressFilter === addr;
          const count = downloads.filter(d => (d.sourceAddress || d.pageUrl || d.url) === addr).length;
          const domain = getCleanDomain(addr);

          return (
            <button
              key={addr}
              onClick={() => onSelectAddressFilter(isSelected ? 'all' : addr)}
              className={`px-2.5 py-1 rounded-md transition-colors shrink-0 font-medium cursor-pointer flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-indigo-600 text-white font-semibold shadow-2xs'
                  : 'bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100'
              }`}
              title={addr}
            >
              <Globe className={`w-3 h-3 ${isSelected ? 'text-white' : 'text-neutral-400'}`} />
              <span className="truncate max-w-[150px]">{domain}</span>
              <span className={`text-[10px] px-1 rounded-full ${isSelected ? 'bg-white/20' : 'bg-neutral-100 dark:bg-neutral-700'}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {filteredDownloads.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-12 text-center bg-white dark:bg-neutral-900">
          <div className="w-12 h-12 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-400 mb-3">
            <FileVideo className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-1">
            Seçilen adreste indirme bulunamadı
          </h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-sm mb-4">
            "Tüm Adresler" butonuna tıklayarak diğer indirmeleri görüntüleyebilirsiniz.
          </p>
          <button
            onClick={() => onSelectAddressFilter('all')}
            className="px-3.5 py-1.5 rounded-lg bg-sky-600 text-white font-medium text-xs hover:bg-sky-700 transition-colors"
          >
            Tüm İndirmeleri Göster
          </button>
        </div>
      ) : (
        <div className="flex-1 overflow-auto">
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
                <th className="py-2.5 px-3">Dosya &amp; Kaynak Adres</th>
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
              {filteredDownloads.map((item, idx) => {
                const isSelected = selectedIds.includes(item.id);
                const source = item.sourceAddress || item.pageUrl || item.url;
                const domain = getCleanDomain(source);

                return (
                  <tr
                    key={item.id}
                    onClick={(e) => {
                      if ((e.target as HTMLElement).tagName !== 'BUTTON' && (e.target as HTMLElement).tagName !== 'INPUT') {
                        onToggleSelectId(item.id, e.ctrlKey || e.metaKey);
                      }
                    }}
                    onDoubleClick={() => onWatchNow(item)}
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
                      <div className="flex items-center gap-2.5 max-w-[280px] lg:max-w-md">
                        {item.thumbnail ? (
                          <div 
                            onClick={(e) => {
                              e.stopPropagation();
                              onWatchNow(item);
                            }}
                            className="w-11 h-8 rounded overflow-hidden bg-black shrink-0 relative group/thumb cursor-pointer border border-neutral-300 dark:border-neutral-700 shadow-2xs"
                            title="Şimdi İzle"
                          >
                            <img src={item.thumbnail} alt="" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/thumb:opacity-100 flex items-center justify-center transition-opacity">
                              <Play className="w-3 h-3 text-white fill-current" />
                            </div>
                          </div>
                        ) : (
                          getFileIcon(item.category)
                        )}
                        <div className="truncate min-w-0">
                          <div className="font-semibold text-neutral-900 dark:text-neutral-100 truncate" title={item.fileName}>
                            {item.fileName}
                          </div>
                          
                          {/* Source Address indicator ("indirilenlerde adresi seçebileyim") */}
                          <div className="flex items-center gap-1.5 text-[11px] text-neutral-400 mt-0.5 truncate">
                            <span className="text-neutral-500 font-mono shrink-0">
                              {item.quality ? `${item.quality} · ` : ''}{item.codec || item.format}
                            </span>
                            <span>·</span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onSelectAddressFilter(source);
                              }}
                              className="text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1 truncate font-mono text-[10px]"
                              title={`Bu adresi seç: ${source}`}
                            >
                              <Globe className="w-2.5 h-2.5 shrink-0" />
                              <span className="truncate">{domain}</span>
                            </button>
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

                    {/* Action buttons with "Şimdi İzle" & "Klasörde Göster" */}
                    <td className="py-2.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1" onClick={(e) => e.stopPropagation()}>
                        {/* "Şimdi İzle" (Watch Now) Button */}
                        <button
                          onClick={() => onWatchNow(item)}
                          title="Videoyu Şimdi İzle (Eşzamanlı Canlı Oynatıcı)"
                          className="px-2 py-1 rounded-md bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 font-semibold flex items-center gap-1 text-[11px] transition-colors border border-indigo-200 dark:border-indigo-800/80 cursor-pointer shadow-2xs shrink-0"
                        >
                          <Play className="w-3 h-3 fill-current text-indigo-600 dark:text-indigo-400" />
                          <span className="font-sans">Şimdi İzle</span>
                        </button>

                        {/* "Klasörde Göster" (Show in Folder) Button */}
                        <button
                          onClick={() => onShowInFolder(item)}
                          title="Klasörde Göster (Dosya Konumu)"
                          className="p-1.5 rounded-md text-neutral-500 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                        >
                          <FolderOpen className="w-3.5 h-3.5 text-amber-500" />
                        </button>

                        {/* Direct Save to Disk button for completed items */}
                        {item.status === 'completed' && (
                          <button
                            onClick={() => onSaveToDisk(item)}
                            title="Bilgisayara Kaydet / Dosyayı İndir"
                            className="p-1.5 rounded-md text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors cursor-pointer"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {/* Pause / Resume for active items */}
                        {item.status !== 'completed' && (
                          <button
                            onClick={() => onTogglePause(item.id)}
                            title={item.status === 'downloading' ? 'Duraklat' : 'Devam Et'}
                            className="p-1.5 rounded-md text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                          >
                            {item.status === 'downloading' ? (
                              <Pause className="w-3.5 h-3.5 text-amber-500" />
                            ) : (
                              <Play className="w-3.5 h-3.5 text-emerald-500" />
                            )}
                          </button>
                        )}

                        {/* Segment Threads Detail Dialog */}
                        <button
                          onClick={() => onOpenSegmentDialog(item)}
                          title="Parçalı İndirme ve Bağlantı Ayrıntıları (SaveToVideo Ekranı)"
                          className="p-1.5 rounded-md text-neutral-500 hover:text-sky-600 dark:hover:text-sky-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>

                        {/* Delete from list */}
                        <button
                          onClick={() => onDelete(item.id)}
                          title="Listeden Sil"
                          className="p-1.5 rounded-md text-neutral-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
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
      )}
    </div>
  );
};
