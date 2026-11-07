import React, { useState, useRef } from 'react';
import { 
  X, 
  Settings, 
  Layers, 
  Gauge, 
  Folder, 
  Check, 
  Volume2, 
  RotateCcw,
  Sparkles,
  Download,
  Upload,
  Play
} from 'lucide-react';
import { IDMPresetSettings } from '../types/idm';
import { DEFAULT_PRESET_SETTINGS } from '../services/storageService';
import { playDownloadCompleteChime } from '../services/soundService';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: IDMPresetSettings;
  onSave: (settings: IDMPresetSettings) => void;
  onExportDownloads?: () => void;
  onImportDownloads?: (json: string) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSave,
  onExportDownloads,
  onImportDownloads,
}) => {
  if (!isOpen) return null;

  const [form, setForm] = useState<IDMPresetSettings>({ ...settings });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const connectionOptions = [1, 2, 4, 8, 16, 24, 32];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
    onClose();
  };

  const handleReset = () => {
    setForm({ ...DEFAULT_PRESET_SETTINGS });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onImportDownloads) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        if (text) {
          onImportDownloads(text);
          onClose();
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="w-full max-w-lg bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-xl shadow-2xl overflow-hidden text-xs font-sans"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-neutral-100 dark:bg-neutral-800 px-5 py-3.5 border-b border-neutral-200 dark:border-neutral-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Settings className="w-4 h-4 text-sky-600 dark:text-sky-400" />
            <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 text-sm">
              SaveToVideo İndirme Seçenekleri &amp; Otomatik Ön Ayarlar
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Automatic Download Preset Section */}
          <div className="p-3.5 bg-neutral-50 dark:bg-neutral-800/60 rounded-lg border border-neutral-200 dark:border-neutral-700/80 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-semibold text-neutral-900 dark:text-neutral-100 block text-xs">
                  Otomatik İndirme Modu (Sormadan İndir)
                </span>
                <span className="text-[11px] text-neutral-500 dark:text-neutral-400 block mt-0.5">
                  Videolar tespit edildiğinde her seferinde bağlantı veya kalite seçimi sormadan varsayılan ayarlarla doğrudan indirir.
                </span>
              </div>
              <input
                type="checkbox"
                checked={form.autoDownload}
                onChange={(e) => setForm({ ...form, autoDownload: e.target.checked })}
                className="w-4 h-4 text-sky-600 rounded focus:ring-sky-500"
              />
            </div>

            {/* Preferred Quality Selection */}
            <div className="pt-2 border-t border-neutral-200/70 dark:border-neutral-700/60">
              <label className="block text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                Otomatik Modda Tercih Edilen Kalite:
              </label>
              <select
                value={form.preferredQuality}
                onChange={(e) => setForm({ ...form, preferredQuality: e.target.value as any })}
                className="w-full px-3 py-1.5 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-md text-neutral-900 dark:text-neutral-100 text-xs focus:ring-1 focus:ring-sky-500 focus:outline-none"
              >
                <option value="highest">En Yüksek Çözünürlük (4K / 2K / 1080p)</option>
                <option value="1080p">Full HD (1080p 60fps)</option>
                <option value="720p">HD (720p)</option>
                <option value="audio_only">Yalnızca Ses (320k MP3/M4A)</option>
              </select>
            </div>
          </div>

          {/* Default Connection Count */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-sky-500" />
                <label className="text-[11px] font-semibold text-neutral-700 dark:text-neutral-300">
                  Varsayılan Paralel Bağlantı Sayısı:
                </label>
              </div>
              <span className="font-mono font-bold text-sky-600 dark:text-sky-400">
                {form.defaultConnections}x Parçalı Kanal
              </span>
            </div>
            <div className="grid grid-cols-7 gap-1.5">
              {connectionOptions.map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setForm({ ...form, defaultConnections: num })}
                  className={`py-1.5 px-1 rounded font-mono font-semibold text-center text-xs transition-colors border ${
                    form.defaultConnections === num
                      ? 'bg-sky-600 text-white border-sky-600'
                      : 'bg-neutral-50 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-700'
                  }`}
                >
                  {num}x
                </button>
              ))}
            </div>
          </div>

          {/* Save Directory */}
          <div className="space-y-1">
            <label className="block text-[11px] font-semibold text-neutral-700 dark:text-neutral-300">
              Varsayılan Kayıt Klasörü:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={form.defaultSavePath}
                onChange={(e) => setForm({ ...form, defaultSavePath: e.target.value })}
                className="flex-1 px-3 py-1.5 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-md text-neutral-900 dark:text-neutral-100 text-xs font-mono focus:ring-1 focus:ring-sky-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Speed Limiter */}
          <div className="p-3 bg-neutral-50 dark:bg-neutral-800/60 rounded-lg border border-neutral-200 dark:border-neutral-700/80 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Gauge className="w-3.5 h-3.5 text-amber-500" />
                <span className="font-semibold text-neutral-900 dark:text-neutral-100 text-xs">
                  Hız Sınırlayıcı (Speed Limiter)
                </span>
              </div>
              <input
                type="checkbox"
                checked={form.speedLimitEnabled}
                onChange={(e) => setForm({ ...form, speedLimitEnabled: e.target.checked })}
                className="w-4 h-4 text-sky-600 rounded focus:ring-sky-500"
              />
            </div>

            {form.speedLimitEnabled && (
              <div className="flex items-center gap-3 pt-1">
                <span className="text-[11px] text-neutral-500">Maksimum Toplam İndirme Hızı:</span>
                <input
                  type="number"
                  value={form.speedLimitKBps}
                  onChange={(e) => setForm({ ...form, speedLimitKBps: Number(e.target.value) })}
                  className="w-24 px-2 py-1 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded text-xs font-mono"
                />
                <span className="text-neutral-500 font-mono text-[11px]">KB/s ({(form.speedLimitKBps / 1024).toFixed(1)} MB/s)</span>
              </div>
            )}
          </div>

          {/* Sound & Notifications with Test Sound Button */}
          <div className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-neutral-800/60 rounded-lg border border-neutral-200 dark:border-neutral-700/80">
            <div className="flex items-center gap-2 text-neutral-700 dark:text-neutral-300">
              <Volume2 className="w-4 h-4 text-neutral-400" />
              <div>
                <span className="font-semibold block text-xs">İndirme tamamlandığında ses çal</span>
                <span className="text-[11px] text-neutral-500">SaveToVideo klasik tamamlanma zil sesi</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => playDownloadCompleteChime()}
                className="px-2 py-1 bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 rounded text-[11px] font-medium flex items-center gap-1 text-neutral-700 dark:text-neutral-200 transition-colors"
              >
                <Play className="w-3 h-3 text-sky-500" />
                <span>Test Et</span>
              </button>
              <input
                type="checkbox"
                checked={form.playSoundOnComplete}
                onChange={(e) => setForm({ ...form, playSoundOnComplete: e.target.checked })}
                className="w-4 h-4 text-sky-600 rounded focus:ring-sky-500"
              />
            </div>
          </div>

          {/* Backup / Export / Import SaveToVideo list */}
          <div className="p-3 bg-neutral-50 dark:bg-neutral-800/60 rounded-lg border border-neutral-200 dark:border-neutral-700/80 space-y-2">
            <span className="font-semibold text-neutral-800 dark:text-neutral-200 block text-xs">
              İndirme Listesi Yedekleme &amp; Dışa/İçe Aktar:
            </span>
            <div className="flex gap-2">
              {onExportDownloads && (
                <button
                  type="button"
                  onClick={onExportDownloads}
                  className="px-3 py-1.5 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 rounded font-medium text-[11px] flex items-center gap-1.5 transition-colors shadow-2xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Listeyi Dışa Aktar (.json)</span>
                </button>
              )}

              {onImportDownloads && (
                <>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept=".json"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1.5 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 rounded font-medium text-[11px] flex items-center gap-1.5 transition-colors shadow-2xs"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Listeyi İçe Aktar</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="flex items-center justify-between pt-3 border-t border-neutral-200 dark:border-neutral-800">
            <button
              type="button"
              onClick={handleReset}
              className="px-3 py-1.5 text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 flex items-center gap-1 font-medium transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Varsayılanlara Sıfırla</span>
            </button>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 bg-neutral-200 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200 rounded font-medium hover:bg-neutral-300 dark:hover:bg-neutral-600 transition-colors"
              >
                İptal
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded transition-colors shadow-2xs"
              >
                Ayarları Kaydet
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
