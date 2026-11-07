import React, { useState } from 'react';
import { 
  X, 
  Folder, 
  Layers, 
  Check, 
  Sliders, 
  Zap, 
  Clock, 
  ShieldCheck 
} from 'lucide-react';
import { DetectedStream, IDMPresetSettings } from '../types/idm';
import { formatBytes } from '../services/sniffService';

interface DownloadSetupModalProps {
  stream: DetectedStream | null;
  settings: IDMPresetSettings;
  onClose: () => void;
  onStartDownload: (config: {
    fileName: string;
    savePath: string;
    connections: number;
    saveAsDefault: boolean;
    startImmediately: boolean;
  }) => void;
}

export const DownloadSetupModal: React.FC<DownloadSetupModalProps> = ({
  stream,
  settings,
  onClose,
  onStartDownload,
}) => {
  if (!stream) return null;

  const defaultExt = stream.format.toLowerCase();
  const initialName = `${stream.title.replace(/[/\\?%*:|"<>]/g, '_')}.${defaultExt}`;

  const [fileName, setFileName] = useState(initialName);
  const [savePath, setSavePath] = useState(settings.defaultSavePath);
  const [connections, setConnections] = useState<number>(settings.defaultConnections || 8);
  const [saveAsDefault, setSaveAsDefault] = useState<boolean>(settings.autoDownload);

  const connectionOptions = [1, 2, 4, 8, 16, 24, 32];

  const handleStart = (startImmediately: boolean) => {
    onStartDownload({
      fileName,
      savePath,
      connections,
      saveAsDefault,
      startImmediately,
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="w-full max-w-xl bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-xl shadow-2xl overflow-hidden text-xs font-sans"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-neutral-100 dark:bg-neutral-800 px-5 py-3.5 border-b border-neutral-200 dark:border-neutral-700 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-6 rounded bg-sky-600 text-white flex items-center justify-center font-bold text-[10px]">
              STV
            </div>
            <div>
              <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 text-sm">
                İndirme ve Bağlantı Sayısı Ekranı
              </h3>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                Parçalı indirme motoru ve dosya kaydetme seçenekleri
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

        {/* Form Body */}
        <div className="p-5 space-y-4">
          {/* Target File Info Summary */}
          <div className="p-3 bg-neutral-50 dark:bg-neutral-800/60 rounded-lg border border-neutral-200 dark:border-neutral-800 flex justify-between items-center">
            <div>
              <div className="font-semibold text-neutral-900 dark:text-neutral-100 text-xs">
                {stream.quality} · {stream.format} ({stream.codec})
              </div>
              <div className="text-[11px] text-neutral-400 font-mono truncate max-w-md mt-0.5">
                {stream.url}
              </div>
            </div>
            <span className="font-mono font-bold text-sky-600 dark:text-sky-400 text-sm tabular-nums">
              {formatBytes(stream.sizeBytes)}
            </span>
          </div>

          {/* File Name Input */}
          <div className="space-y-1">
            <label className="block text-[11px] font-semibold text-neutral-600 dark:text-neutral-400">
              Dosya Adı:
            </label>
            <input
              type="text"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              className="w-full px-3 py-2 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-md text-neutral-900 dark:text-neutral-100 text-xs focus:ring-1 focus:ring-sky-500 focus:outline-none"
            />
          </div>

          {/* Save Directory Input */}
          <div className="space-y-1">
            <label className="block text-[11px] font-semibold text-neutral-600 dark:text-neutral-400">
              Kayıt Dizini:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={savePath}
                onChange={(e) => setSavePath(e.target.value)}
                className="flex-1 px-3 py-2 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-md text-neutral-900 dark:text-neutral-100 text-xs font-mono focus:ring-1 focus:ring-sky-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => alert('Varsayılan indirme klasörü seçildi')}
                className="px-3 py-2 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 border border-neutral-300 dark:border-neutral-700 rounded-md text-neutral-700 dark:text-neutral-300 font-medium flex items-center gap-1.5 transition-colors"
              >
                <Folder className="w-3.5 h-3.5" />
                <span>Gözat</span>
              </button>
            </div>
          </div>

          {/* Connection Count Selector ("Bağlantı Sayısı Ekranı") */}
          <div className="space-y-2 pt-1">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-sky-500" />
                <label className="text-[11px] font-semibold text-neutral-800 dark:text-neutral-200">
                  Eşzamanlı Bağlantı Sayısı (Kanal):
                </label>
              </div>
              <span className="font-mono font-bold text-sky-600 dark:text-sky-400 text-xs">
                {connections} Kanal ({connections >= 16 ? 'Maksimum İvme' : 'Dengeli Hız'})
              </span>
            </div>

            {/* Segmented Buttons for Connection Count */}
            <div className="grid grid-cols-7 gap-1.5">
              {connectionOptions.map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setConnections(num)}
                  className={`py-2 px-1 rounded-md font-mono font-semibold text-center text-xs transition-all border ${
                    connections === num
                      ? 'bg-sky-600 text-white border-sky-600 shadow-sm'
                      : 'bg-neutral-50 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-700'
                  }`}
                >
                  {num}x
                </button>
              ))}
            </div>

            <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-relaxed">
              SaveToVideo çok kanallı indirme motoru, dosyayı eşzamanlı bayt aralıklarına bölerek internet bant genişliğini tam verimle kullanır (HTTP Range Acceleration).
            </p>
          </div>

          {/* "Her zaman bu ayarda otomatik indir" Checkbox */}
          <div className="p-3 bg-sky-50/70 dark:bg-sky-950/30 rounded-lg border border-sky-200 dark:border-sky-900/50">
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={saveAsDefault}
                onChange={(e) => setSaveAsDefault(e.target.checked)}
                className="mt-0.5 rounded text-sky-600 focus:ring-sky-500 border-neutral-300"
              />
              <div>
                <span className="font-semibold text-neutral-900 dark:text-neutral-100 block text-xs">
                  Bu ayarları varsayılan yap ve bundan sonraki videolarda sormadan otomatik indir
                </span>
                <span className="text-[11px] text-neutral-500 dark:text-neutral-400 block mt-0.5">
                  Seçildiğinde, tespit edilen videolar {connections} bağlantı kanalıyla hemen indirilmeye başlar; her seferinde bu ekran açılmaz.
                </span>
              </div>
            </label>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-neutral-50 dark:bg-neutral-800/80 px-5 py-3.5 border-t border-neutral-200 dark:border-neutral-700 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 text-neutral-800 dark:text-neutral-200 font-medium rounded-md transition-colors"
          >
            İptal
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleStart(false)}
              className="px-3.5 py-2 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 font-medium rounded-md transition-colors flex items-center gap-1.5 shadow-2xs"
            >
              <Clock className="w-3.5 h-3.5 text-neutral-500" />
              <span>Kuyruğa Ekle</span>
            </button>

            <button
              type="button"
              onClick={() => handleStart(true)}
              className="px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-md transition-colors shadow-2xs flex items-center gap-1.5"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Şimdi İndir ({connections}x Kanal)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
