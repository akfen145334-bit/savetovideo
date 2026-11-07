import React from 'react';
import { 
  Folder, 
  FileArchive, 
  FileText, 
  Music, 
  Cpu, 
  Video, 
  Clock, 
  CheckCircle, 
  ListOrdered, 
  PauseCircle,
  Activity,
  HardDrive
} from 'lucide-react';
import { DownloadItem, FileCategory } from '../types/idm';
import { formatBytes, formatSpeed } from '../services/sniffService';

interface IDMSidebarProps {
  selectedCategory: FileCategory;
  onSelectCategory: (cat: FileCategory) => void;
  downloads: DownloadItem[];
}

export const IDMSidebar: React.FC<IDMSidebarProps> = ({
  selectedCategory,
  onSelectCategory,
  downloads,
}) => {
  const getCategoryCount = (cat: FileCategory): number => {
    switch (cat) {
      case 'all': return downloads.length;
      case 'compressed': return downloads.filter(d => d.category === 'compressed').length;
      case 'documents': return downloads.filter(d => d.category === 'documents').length;
      case 'music': return downloads.filter(d => d.category === 'music').length;
      case 'programs': return downloads.filter(d => d.category === 'programs').length;
      case 'video': return downloads.filter(d => d.category === 'video').length;
      case 'in_progress': return downloads.filter(d => d.status === 'downloading').length;
      case 'completed': return downloads.filter(d => d.status === 'completed').length;
      case 'queued': return downloads.filter(d => d.status === 'queued').length;
      case 'paused': return downloads.filter(d => d.status === 'paused').length;
      default: return 0;
    }
  };

  const totalActiveSpeed = downloads
    .filter(d => d.status === 'downloading')
    .reduce((sum, d) => sum + d.speed, 0);

  const totalDownloadedBytes = downloads.reduce((sum, d) => sum + d.downloadedBytes, 0);

  const categoryItems: { id: FileCategory; label: string; icon: React.ReactNode }[] = [
    { id: 'all', label: 'Tüm İndirmeler', icon: <Folder className="w-4 h-4 text-sky-500" /> },
    { id: 'video', label: 'Videolar', icon: <Video className="w-4 h-4 text-purple-500" /> },
    { id: 'music', label: 'Müzik & Ses', icon: <Music className="w-4 h-4 text-emerald-500" /> },
    { id: 'compressed', label: 'Sıkıştırılmış', icon: <FileArchive className="w-4 h-4 text-amber-500" /> },
    { id: 'programs', label: 'Programlar', icon: <Cpu className="w-4 h-4 text-rose-500" /> },
    { id: 'documents', label: 'Belgeler', icon: <FileText className="w-4 h-4 text-blue-500" /> },
  ];

  const statusItems: { id: FileCategory; label: string; icon: React.ReactNode }[] = [
    { id: 'in_progress', label: 'İndiriliyor', icon: <Clock className="w-4 h-4 text-sky-500" /> },
    { id: 'completed', label: 'Tamamlandı', icon: <CheckCircle className="w-4 h-4 text-emerald-500" /> },
    { id: 'paused', label: 'Duraklatıldı', icon: <PauseCircle className="w-4 h-4 text-amber-500" /> },
    { id: 'queued', label: 'Kuyrukta', icon: <ListOrdered className="w-4 h-4 text-neutral-400" /> },
  ];

  return (
    <aside className="w-64 border-r border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex flex-col justify-between shrink-0 select-none text-xs">
      <div className="p-3.5 space-y-4">
        {/* Categories Section */}
        <div>
          <div className="px-2 pb-2 text-[11px] font-semibold tracking-wider text-neutral-400 uppercase">
            Kategoriler
          </div>
          <div className="space-y-0.5">
            {categoryItems.map((item) => {
              const count = getCategoryCount(item.id);
              const isActive = selectedCategory === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectCategory(item.id)}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md transition-colors text-left ${
                    isActive
                      ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 font-semibold shadow-2xs'
                      : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 hover:text-neutral-900 dark:hover:text-neutral-200'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                  <span className="font-mono text-[11px] text-neutral-400 dark:text-neutral-500">
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Status Filters */}
        <div>
          <div className="px-2 pb-2 text-[11px] font-semibold tracking-wider text-neutral-400 uppercase">
            Durum
          </div>
          <div className="space-y-0.5">
            {statusItems.map((item) => {
              const count = getCategoryCount(item.id);
              const isActive = selectedCategory === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectCategory(item.id)}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md transition-colors text-left ${
                    isActive
                      ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 font-semibold shadow-2xs'
                      : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 hover:text-neutral-900 dark:hover:text-neutral-200'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                  <span className="font-mono text-[11px] text-neutral-400 dark:text-neutral-500">
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Real-time Hardware & Network Status Pane */}
      <div className="p-3.5 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50/70 dark:bg-neutral-900/40 space-y-2">
        <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400">
          <div className="flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-sky-500" />
            <span>Toplam Hız</span>
          </div>
          <span className="font-mono font-semibold text-neutral-900 dark:text-neutral-100 tabular-nums">
            {formatSpeed(totalActiveSpeed)}
          </span>
        </div>

        <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400">
          <div className="flex items-center gap-1.5">
            <HardDrive className="w-3.5 h-3.5 text-neutral-400" />
            <span>İndirilen Veri</span>
          </div>
          <span className="font-mono font-semibold text-neutral-900 dark:text-neutral-100 tabular-nums">
            {formatBytes(totalDownloadedBytes)}
          </span>
        </div>
      </div>
    </aside>
  );
};
