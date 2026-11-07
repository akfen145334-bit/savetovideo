import React, { useState } from 'react';
import { 
  X, 
  Link, 
  Search, 
  Download, 
  Layers, 
  Sparkles,
  Zap
} from 'lucide-react';

interface AddUrlModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitUrl: (url: string, mode: 'sniff' | 'direct') => void;
}

export const AddUrlModal: React.FC<AddUrlModalProps> = ({
  isOpen,
  onClose,
  onSubmitUrl,
}) => {
  if (!isOpen) return null;

  const [url, setUrl] = useState('');
  const [error, setError] = useState('');

  const sampleUrls = [
    { label: 'Tears of Steel 4K', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4' },
    { label: 'Big Buck Bunny 1080p', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' },
    { label: 'Mux HLS Akışı (.m3u8)', url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8' },
  ];

  const handleSubmit = (mode: 'sniff' | 'direct') => {
    if (!url.trim()) {
      setError('Lütfen geçerli bir internet adresi veya video URL’si girin.');
      return;
    }
    setError('');
    onSubmitUrl(url.trim(), mode);
    onClose();
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
            <Link className="w-4 h-4 text-sky-600 dark:text-sky-400" />
            <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 text-sm">
              Yeni İndirme veya Derin Medya Taraması
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
        <div className="p-5 space-y-4">
          <div className="space-y-1">
            <label className="block text-[11px] font-semibold text-neutral-700 dark:text-neutral-300">
              Web Sayfası veya Video Bağlantısı (URL):
            </label>
            <input
              type="text"
              autoFocus
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                if (error) setError('');
              }}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit('sniff')}
              placeholder="https://... (herhangi bir web sitesi veya doğrudan .mp4/.m3u8 linki)"
              className="w-full px-3 py-2 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-md text-neutral-900 dark:text-neutral-100 text-xs font-mono focus:ring-1 focus:ring-sky-500 focus:outline-none"
            />
            {error && (
              <p className="text-rose-500 text-[11px] mt-1">{error}</p>
            )}
          </div>

          {/* Quick sample chips */}
          <div className="space-y-1.5">
            <span className="text-[11px] text-neutral-400 block">Örnek Bağlantılar:</span>
            <div className="flex flex-wrap gap-1.5">
              {sampleUrls.map((s) => (
                <button
                  key={s.label}
                  type="button"
                  onClick={() => setUrl(s.url)}
                  className="px-2 py-1 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded text-[11px] text-neutral-700 dark:text-neutral-300 transition-colors"
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <div className="p-3 bg-neutral-50 dark:bg-neutral-800/60 rounded-lg border border-neutral-200 dark:border-neutral-800 text-[11px] text-neutral-500 space-y-1">
            <p>
              💡 <strong>Derin Araştır &amp; Bul</strong> seçildiğinde: Web sayfasındaki tüm video çözünürlükleri (4K, 1080p, 720p, ses) taranıp seçim ekranında sunulur.
            </p>
            <p>
              ⚡ <strong>Doğrudan İndir</strong> seçildiğinde: Bağlantı doğrudan SaveToVideo çok kanallı indirme motoruna aktarılır.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-neutral-50 dark:bg-neutral-800/80 px-5 py-3 border-t border-neutral-200 dark:border-neutral-700 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 bg-neutral-200 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200 rounded font-medium hover:bg-neutral-300 dark:hover:bg-neutral-600 transition-colors"
          >
            İptal
          </button>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => handleSubmit('direct')}
              className="px-3 py-1.5 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 font-medium rounded transition-colors flex items-center gap-1.5 shadow-2xs"
            >
              <Zap className="w-3.5 h-3.5 text-neutral-500" />
              <span>Doğrudan İndir</span>
            </button>

            <button
              type="button"
              onClick={() => handleSubmit('sniff')}
              className="px-4 py-1.5 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded transition-colors shadow-2xs flex items-center gap-1.5"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Derin Araştır &amp; Bul</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
