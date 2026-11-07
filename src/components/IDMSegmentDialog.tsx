import React, { useState } from 'react';
import { 
  X, 
  Pause, 
  Play, 
  CheckCircle2, 
  Layers, 
  FolderOpen,
  Eye,
  Download,
  Terminal
} from 'lucide-react';
import { DownloadItem } from '../types/idm';
import { formatBytes, formatSpeed } from '../services/sniffService';

interface IDMSegmentDialogProps {
  item: DownloadItem | null;
  onClose: () => void;
  onTogglePause: (id: string) => void;
  onSaveToDisk: (item: DownloadItem) => void;
  onOpenPreview: (item: DownloadItem) => void;
  onChangeConnections: (itemId: string, newCount: number) => void;
}

export const IDMSegmentDialog: React.FC<IDMSegmentDialogProps> = ({
  item,
  onClose,
  onTogglePause,
  onSaveToDisk,
  onOpenPreview,
  onChangeConnections,
}) => {
  if (!item) return null;

  const [showLogs, setShowLogs] = useState(false);
  const connectionCounts = [1, 2, 4, 8, 16, 24, 32];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="w-full max-w-2xl bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-xl shadow-2xl overflow-hidden text-xs font-sans"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Classic IDM Header Bar */}
        <div className="bg-neutral-100 dark:bg-neutral-800 px-4 py-3 border-b border-neutral-200 dark:border-neutral-700 flex items-center justify-between">
          <div className="flex items-center gap-2 truncate max-w-md">
            <div className="w-5 h-5 rounded bg-sky-600 text-white flex items-center justify-center font-bold text-[10px]">
              IDM
            </div>
            <span className="font-semibold text-neutral-900 dark:text-neutral-100 text-sm truncate">
              İndirme Durumu: {item.fileName}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Metadata Grid */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-xs bg-neutral-50 dark:bg-neutral-800/50 p-3 rounded-lg border border-neutral-200/70 dark:border-neutral-800">
            <div>
              <span className="text-neutral-400 block text-[11px]">Hedef URL:</span>
              <span className="text-neutral-700 dark:text-neutral-300 font-mono text-[11px] truncate block" title={item.url}>
                {item.url}
              </span>
            </div>

            <div>
              <span className="text-neutral-400 block text-[11px]">Kayıt Konumu:</span>
              <span className="text-neutral-700 dark:text-neutral-300 font-mono text-[11px] truncate block" title={item.savePath}>
                {item.savePath}
              </span>
            </div>

            <div>
              <span className="text-neutral-400 block text-[11px]">Dosya Boyutu:</span>
              <span className="font-semibold font-mono tabular-nums text-neutral-900 dark:text-neutral-100">
                {formatBytes(item.fileSize)} ({item.downloadedBytes.toLocaleString()} bayt)
              </span>
            </div>

            <div>
              <span className="text-neutral-400 block text-[11px]">Devam Edebilirlik (HTTP Range):</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Destekleniyor (Parçalı Hızlandırılmış İndirme)</span>
              </span>
            </div>

            <div>
              <span className="text-neutral-400 block text-[11px]">Transfer Oranı:</span>
              <span className="font-semibold font-mono tabular-nums text-sky-600 dark:text-sky-400 text-sm">
                {item.status === 'downloading' ? item.speedFormatted : '0 B/s'}
              </span>
            </div>

            <div>
              <span className="text-neutral-400 block text-[11px]">Kalan Tahmini Süre:</span>
              <span className="font-semibold font-mono tabular-nums text-neutral-900 dark:text-neutral-100">
                {item.timeLeft}
              </span>
            </div>
          </div>

          {/* Master Progress Bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="font-medium text-neutral-700 dark:text-neutral-300">
                Toplam İlerleme: %{item.progress} ({formatBytes(item.downloadedBytes)} / {formatBytes(item.fileSize)})
              </span>
              <span className="text-neutral-500 font-mono">
                {item.connections} Paralel Bağlantı Kanalı
              </span>
            </div>
            <div className="w-full h-4 bg-neutral-200 dark:bg-neutral-800 rounded-md overflow-hidden flex border border-neutral-300 dark:border-neutral-700">
              <div
                className={`h-full transition-all duration-300 ${
                  item.status === 'completed'
                    ? 'bg-emerald-500'
                    : 'bg-gradient-to-r from-sky-500 to-indigo-500'
                }`}
                style={{ width: `${item.progress}%` }}
              />
            </div>
          </div>

          {/* Iconic IDM Segment Visualizer */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-semibold text-neutral-800 dark:text-neutral-200">
                <Layers className="w-3.5 h-3.5 text-sky-500" />
                <span>Eşzamanlı Bağlantı Segmentleri (IDM Chunk Threads)</span>
              </div>

              {/* Dynamic Connection Switcher */}
              {item.status !== 'completed' && (
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] text-neutral-400">Kanal Değiştir:</span>
                  <div className="flex gap-1">
                    {[4, 8, 16, 32].map((cnt) => (
                      <button
                        key={cnt}
                        onClick={() => onChangeConnections(item.id, cnt)}
                        className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold border transition-colors ${
                          item.connections === cnt
                            ? 'bg-sky-600 text-white border-sky-600'
                            : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                        }`}
                      >
                        {cnt}x
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Chunk Blocks Bar */}
            <div className="grid grid-cols-8 gap-1 p-2 bg-neutral-100 dark:bg-neutral-800/80 rounded-lg border border-neutral-200 dark:border-neutral-700">
              {item.segments.map((seg) => (
                <div key={seg.id} className="space-y-1">
                  <div className="h-5 bg-neutral-200 dark:bg-neutral-700 rounded overflow-hidden relative border border-neutral-300/50 dark:border-neutral-600">
                    <div
                      className={`h-full transition-all duration-300 ${
                        item.status === 'completed'
                          ? 'bg-emerald-500'
                          : seg.status === 'active'
                          ? 'bg-sky-500'
                          : 'bg-neutral-400'
                      }`}
                      style={{ width: `${item.status === 'completed' ? 100 : seg.progressPercent}%` }}
                    />
                    <span className="absolute inset-0 flex items-center justify-center font-mono text-[9px] font-bold text-neutral-800 dark:text-neutral-200 drop-shadow-2xs">
                      #{seg.id}
                    </span>
                  </div>
                  <div className="text-[10px] text-center font-mono text-neutral-500">
                    %{item.status === 'completed' ? 100 : seg.progressPercent}
                  </div>
                </div>
              ))}
            </div>

            {/* Segment Details Table */}
            <div className="max-h-36 overflow-y-auto border border-neutral-200 dark:border-neutral-800 rounded-lg">
              <table className="w-full text-left text-[11px]">
                <thead className="bg-neutral-50 dark:bg-neutral-800/70 text-neutral-500 sticky top-0 border-b border-neutral-200 dark:border-neutral-800">
                  <tr>
                    <th className="py-1 px-2.5">Kanal</th>
                    <th className="py-1 px-2">Başlangıç Baytı</th>
                    <th className="py-1 px-2">Bitiş Baytı</th>
                    <th className="py-1 px-2 text-right">İndirilen</th>
                    <th className="py-1 px-2 text-right">Anlık Hız</th>
                    <th className="py-1 px-2.5 text-center">Durum</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800 font-mono tabular-nums">
                  {item.segments.map((seg) => (
                    <tr key={seg.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/40">
                      <td className="py-1 px-2.5 font-semibold text-sky-600 dark:text-sky-400">
                        Thread #{seg.id}
                      </td>
                      <td className="py-1 px-2 text-neutral-500">
                        {seg.startByte.toLocaleString()}
                      </td>
                      <td className="py-1 px-2 text-neutral-500">
                        {seg.endByte.toLocaleString()}
                      </td>
                      <td className="py-1 px-2 text-right text-neutral-800 dark:text-neutral-200">
                        {formatBytes(item.status === 'completed' ? (seg.endByte - seg.startByte) : seg.downloadedBytes)}
                      </td>
                      <td className="py-1 px-2 text-right font-medium text-emerald-600 dark:text-emerald-400">
                        {item.status === 'downloading' ? formatSpeed(seg.speed) : '0 B/s'}
                      </td>
                      <td className="py-1 px-2.5 text-center">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-sans font-medium ${
                          item.status === 'completed'
                            ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600'
                            : seg.status === 'active'
                            ? 'bg-sky-50 dark:bg-sky-950 text-sky-600'
                            : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-400'
                        }`}>
                          {item.status === 'completed' ? 'Tamam' : seg.status === 'active' ? 'Aktif' : 'Bekliyor'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* HTTP 206 Connection Log toggle */}
            <div>
              <button
                type="button"
                onClick={() => setShowLogs(!showLogs)}
                className="text-[11px] text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1 font-medium"
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>HTTP 206 Parçalı Bağlantı Günlüğü ({showLogs ? 'Gizle' : 'Göster'})</span>
              </button>

              {showLogs && (
                <div className="mt-2 p-2.5 bg-neutral-950 text-neutral-300 rounded font-mono text-[10px] max-h-24 overflow-y-auto space-y-1">
                  <div>[IDM Motoru] HTTP/1.1 Range: bytes isteği başlatıldı. Sunucu: HTTP 206 Partial Content</div>
                  {item.segments.map((s) => (
                    <div key={s.id} className="text-emerald-400">
                      [Kanal #{s.id}] GET Range: bytes={s.startByte}-{s.endByte} &rarr; 206 OK ({formatSpeed(s.speed)})
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-neutral-50 dark:bg-neutral-800/80 px-5 py-3 border-t border-neutral-200 dark:border-neutral-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onTogglePause(item.id)}
              className="px-3.5 py-1.5 bg-white dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 rounded-md font-semibold text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-600 transition-colors flex items-center gap-1.5 shadow-2xs"
            >
              {item.status === 'downloading' ? (
                <>
                  <Pause className="w-3.5 h-3.5 text-amber-500" />
                  <span>Duraklat</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Devam Et</span>
                </>
              )}
            </button>

            {item.status === 'completed' && (
              <>
                <button
                  onClick={() => onOpenPreview(item)}
                  className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-md font-semibold transition-colors flex items-center gap-1.5 shadow-2xs"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Önizle / Oynat</span>
                </button>

                <button
                  onClick={() => onSaveToDisk(item)}
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md font-semibold transition-colors flex items-center gap-1.5 shadow-2xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Bilgisayara Kaydet</span>
                </button>
              </>
            )}
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 text-neutral-800 dark:text-neutral-200 rounded-md font-medium transition-colors"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
};
