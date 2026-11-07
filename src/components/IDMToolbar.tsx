import React from 'react';
import { 
  Plus, 
  Play, 
  Pause, 
  Square, 
  Trash2, 
  Settings, 
  Gauge, 
  Search,
  CheckCircle2,
  ListStart,
  CheckCheck
} from 'lucide-react';
import { IDMPresetSettings } from '../types/idm';

interface IDMToolbarProps {
  onAddUrl: () => void;
  onResumeSelected: () => void;
  onPauseSelected: () => void;
  onStopAll: () => void;
  onStartQueue: () => void;
  onClearCompleted: () => void;
  onDeleteSelected: () => void;
  onOpenSettings: () => void;
  settings: IDMPresetSettings;
  onUpdateSettings: (newSettings: IDMPresetSettings) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedCount: number;
}

export const IDMToolbar: React.FC<IDMToolbarProps> = ({
  onAddUrl,
  onResumeSelected,
  onPauseSelected,
  onStopAll,
  onStartQueue,
  onClearCompleted,
  onDeleteSelected,
  onOpenSettings,
  settings,
  onUpdateSettings,
  searchQuery,
  onSearchChange,
  selectedCount,
}) => {
  const toggleSpeedLimit = () => {
    onUpdateSettings({
      ...settings,
      speedLimitEnabled: !settings.speedLimitEnabled,
    });
  };

  const toggleAutoDownload = () => {
    onUpdateSettings({
      ...settings,
      autoDownload: !settings.autoDownload,
    });
  };

  const hasSelected = selectedCount > 0;

  return (
    <div className="bg-neutral-50 dark:bg-neutral-900/60 border-b border-neutral-200 dark:border-neutral-800 px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
      {/* Primary Actions */}
      <div className="flex items-center gap-1.5 flex-wrap">
        <button
          onClick={onAddUrl}
          className="flex items-center gap-1.5 px-3 py-1.5 font-medium rounded-md bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-700/80 transition-colors shadow-2xs"
        >
          <Plus className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
          <span>URL Ekle</span>
        </button>

        <button
          onClick={onResumeSelected}
          disabled={!hasSelected}
          title={hasSelected ? `${selectedCount} seçili indirmeyi devam ettir` : 'Devam ettirmek için indirme seçin'}
          className={`flex items-center gap-1.5 px-3 py-1.5 font-medium rounded-md border transition-colors shadow-2xs ${
            hasSelected
              ? 'bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-700/80'
              : 'bg-neutral-100/60 dark:bg-neutral-800/40 text-neutral-400 dark:text-neutral-600 border-neutral-200 dark:border-neutral-800 cursor-not-allowed'
          }`}
        >
          <Play className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>Devam Et {hasSelected ? `(${selectedCount})` : ''}</span>
        </button>

        <button
          onClick={onPauseSelected}
          disabled={!hasSelected}
          title={hasSelected ? `${selectedCount} seçili indirmeyi duraklat` : 'Duraklatmak için indirme seçin'}
          className={`flex items-center gap-1.5 px-3 py-1.5 font-medium rounded-md border transition-colors shadow-2xs ${
            hasSelected
              ? 'bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-700/80'
              : 'bg-neutral-100/60 dark:bg-neutral-800/40 text-neutral-400 dark:text-neutral-600 border-neutral-200 dark:border-neutral-800 cursor-not-allowed'
          }`}
        >
          <Pause className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
          <span>Duraklat {hasSelected ? `(${selectedCount})` : ''}</span>
        </button>

        <button
          onClick={onStopAll}
          title="Tüm etkin indirmeleri durdur"
          className="flex items-center gap-1.5 px-3 py-1.5 font-medium rounded-md bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-700/80 transition-colors shadow-2xs"
        >
          <Square className="w-3.5 h-3.5 text-rose-500" />
          <span>Tümünü Durdur</span>
        </button>

        <button
          onClick={onStartQueue}
          title="Kuyrukta bekleyen tüm indirmeleri sırayla başlat"
          className="flex items-center gap-1.5 px-3 py-1.5 font-medium rounded-md bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-700/80 transition-colors shadow-2xs"
        >
          <ListStart className="w-3.5 h-3.5 text-indigo-500" />
          <span>Kuyruğu Başlat</span>
        </button>

        <button
          onClick={onClearCompleted}
          title="Tamamlanan indirmeleri listeden temizle"
          className="flex items-center gap-1.5 px-3 py-1.5 font-medium rounded-md bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-700/80 transition-colors shadow-2xs"
        >
          <CheckCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>Tamamlananları Temizle</span>
        </button>

        <button
          onClick={onDeleteSelected}
          disabled={!hasSelected}
          title={hasSelected ? `${selectedCount} seçili indirmeyi sil` : 'Silmek için indirme seçin'}
          className={`flex items-center gap-1.5 px-3 py-1.5 font-medium rounded-md border transition-colors shadow-2xs ${
            hasSelected
              ? 'bg-white dark:bg-neutral-800 text-rose-600 dark:text-rose-400 border-neutral-200 dark:border-neutral-700 hover:bg-rose-50 dark:hover:bg-rose-950/40'
              : 'bg-neutral-100/60 dark:bg-neutral-800/40 text-neutral-400 dark:text-neutral-600 border-neutral-200 dark:border-neutral-800 cursor-not-allowed'
          }`}
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Sil {hasSelected ? `(${selectedCount})` : ''}</span>
        </button>

        <div className="h-4 w-px bg-neutral-300 dark:bg-neutral-700 mx-1 hidden sm:block" />

        {/* Auto Download Quick Toggle */}
        <button
          onClick={toggleAutoDownload}
          title="Otomatik modda bağlantı sayısı veya kalite ekranı sormadan doğrudan varsayılan ayarlarla indirir"
          className={`flex items-center gap-1.5 px-3 py-1.5 font-medium rounded-md border transition-colors shadow-2xs ${
            settings.autoDownload
              ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
              : 'bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-700/80'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>Otomatik Mod: {settings.autoDownload ? 'Açık' : 'Kapalı'}</span>
        </button>

        {/* Speed Limiter Quick Toggle */}
        <button
          onClick={toggleSpeedLimit}
          className={`flex items-center gap-1.5 px-3 py-1.5 font-medium rounded-md border transition-colors shadow-2xs ${
            settings.speedLimitEnabled
              ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-800'
              : 'bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-700/80'
          }`}
        >
          <Gauge className="w-3.5 h-3.5" />
          <span>Hız Sınırı: {settings.speedLimitEnabled ? `${(settings.speedLimitKBps / 1024).toFixed(0)} MB/s` : 'Sınırsız'}</span>
        </button>

        <button
          onClick={onOpenSettings}
          className="flex items-center gap-1.5 px-3 py-1.5 font-medium rounded-md bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-700/80 transition-colors shadow-2xs"
        >
          <Settings className="w-3.5 h-3.5" />
          <span>Ayarlar &amp; Ön Ayar</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="relative min-w-[200px] max-w-xs w-full sm:w-auto">
        <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="İndirmelerde ara (ad, format, URL)..."
          className="w-full pl-8 pr-3 py-1.5 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-md text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 text-xs focus:outline-none focus:ring-1 focus:ring-sky-500"
        />
      </div>
    </div>
  );
};
