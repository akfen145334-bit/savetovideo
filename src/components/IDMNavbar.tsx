import React from 'react';
import { Download, Globe, Search, Layers, Sun, Moon } from 'lucide-react';

export type ActiveTab = 'downloads' | 'sniffer' | 'chrome_browser' | 'extension';

interface IDMNavbarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  onAddUrlClick: () => void;
  isDark: boolean;
  onToggleTheme: () => void;
  activeDownloadsCount: number;
}

export const IDMNavbar: React.FC<IDMNavbarProps> = ({
  activeTab,
  onTabChange,
  onAddUrlClick,
  isDark,
  onToggleTheme,
  activeDownloadsCount,
}) => {
  return (
    <header className="flex items-center justify-between gap-8 px-6 py-3.5 border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 transition-colors">
      {/* Zone 1: Single text element wordmark */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-sky-600 to-indigo-600 flex items-center justify-center text-white shadow-sm font-bold text-sm tracking-wider">
          IDM
        </div>
        <span className="text-base font-bold tracking-tight text-neutral-900 dark:text-neutral-100 whitespace-nowrap shrink-0">
          Internet Download Manager
        </span>
      </div>

      {/* Zone 2: 4 concise single-line text navigation links */}
      <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
        <button
          onClick={() => onTabChange('downloads')}
          className={`flex items-center gap-2 transition-colors whitespace-nowrap shrink-0 ${
            activeTab === 'downloads'
              ? 'text-sky-600 dark:text-sky-400 font-semibold'
              : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>İndirme Yöneticisi</span>
          {activeDownloadsCount > 0 && (
            <span className="text-xs text-sky-600 dark:text-sky-400 font-mono">
              ({activeDownloadsCount})
            </span>
          )}
        </button>

        <button
          onClick={() => onTabChange('sniffer')}
          className={`flex items-center gap-2 transition-colors whitespace-nowrap shrink-0 ${
            activeTab === 'sniffer'
              ? 'text-sky-600 dark:text-sky-400 font-semibold'
              : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
          }`}
        >
          <Search className="w-4 h-4" />
          <span>Derin Medya Tarayıcı</span>
        </button>

        <button
          onClick={() => onTabChange('chrome_browser')}
          className={`flex items-center gap-2 transition-colors whitespace-nowrap shrink-0 ${
            activeTab === 'chrome_browser'
              ? 'text-sky-600 dark:text-sky-400 font-semibold'
              : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
          }`}
        >
          <Globe className="w-4 h-4" />
          <span>Gömülü Chrome Önizleme</span>
        </button>

        <button
          onClick={() => onTabChange('extension')}
          className={`flex items-center gap-2 transition-colors whitespace-nowrap shrink-0 ${
            activeTab === 'extension'
              ? 'text-sky-600 dark:text-sky-400 font-semibold'
              : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
          }`}
        >
          <Download className="w-4 h-4" />
          <span>Chrome Eklentisi</span>
        </button>
      </nav>

      {/* Zone 3: 1 primary action button + theme toggle */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onToggleTheme}
          aria-label="Temayı Değiştir"
          className="p-2 rounded-lg text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
        >
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        <button
          onClick={onAddUrlClick}
          className="px-4 py-2 text-xs font-semibold text-white bg-sky-600 rounded-lg hover:bg-sky-700 transition-colors whitespace-nowrap shrink-0 shadow-sm flex items-center gap-1.5"
        >
          <span>+ URL / Medya Yakala</span>
        </button>
      </div>
    </header>
  );
};
