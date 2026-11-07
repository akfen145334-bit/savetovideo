import React, { useState } from 'react';
import { 
  Download, 
  FileCode, 
  Check, 
  Copy, 
  Puzzle, 
  Chrome, 
  ShieldCheck, 
  Sparkles, 
  Layers, 
  ArrowRight
} from 'lucide-react';
import { getChromeExtensionFiles, downloadChromeExtensionZip, ExtensionFile } from '../services/chromeExtensionGenerator';

export const ChromeExtensionView: React.FC = () => {
  const files = getChromeExtensionFiles();
  const [selectedFile, setSelectedFile] = useState<ExtensionFile>(files[0]);
  const [copied, setCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadZip = async () => {
    setIsDownloading(true);
    try {
      downloadChromeExtensionZip();
    } finally {
      setTimeout(() => setIsDownloading(false), 800);
    }
  };

  return (
    <div className="flex-1 overflow-auto bg-neutral-50 dark:bg-neutral-950 p-6 space-y-6 text-xs font-sans">
      {/* Top Hero Banner */}
      <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-sky-600 text-white flex items-center justify-center font-bold text-xs">
              <Chrome className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
              SaveToVideo Chrome Entegrasyon Eklentisi (Manifest V3)
            </h2>
          </div>
          <p className="text-neutral-500 dark:text-neutral-400 text-xs leading-relaxed">
            Google Chrome tarayıcınıza yükleyerek ziyaret ettiğiniz her web sitesinde (YouTube, Vimeo, sosyal medya, haber ve video portalları) oynatılan videoları otomatik yakalayın. Videoların sağ üstünde <strong>"Bu Videoyu İndir (SaveToVideo)"</strong> paneli belirir.
          </p>
        </div>

        <button
          onClick={handleDownloadZip}
          disabled={isDownloading}
          className="px-5 py-3 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-lg text-xs transition-colors shadow-sm flex items-center gap-2 shrink-0"
        >
          <Download className="w-4 h-4" />
          <span>{isDownloading ? 'Paketleniyor...' : 'SaveToVideo Eklentisini İndir (.ZIP)'}</span>
        </button>
      </div>

      {/* 3 Step Installation Guide Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-2xs space-y-2">
          <div className="w-6 h-6 rounded-full bg-sky-100 dark:bg-sky-950 text-sky-600 dark:text-sky-400 font-bold flex items-center justify-center font-mono text-xs">
            1
          </div>
          <h4 className="font-semibold text-neutral-900 dark:text-neutral-100 text-xs">
            Arşivi Klasöre Çıkarın
          </h4>
          <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-relaxed">
            Yukarıdaki butona tıklayarak <code>idm-chrome-extension.zip</code> dosyasını indirin ve masaüstünüzde bir klasöre çıkarın.
          </p>
        </div>

        <div className="p-4 bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-2xs space-y-2">
          <div className="w-6 h-6 rounded-full bg-sky-100 dark:bg-sky-950 text-sky-600 dark:text-sky-400 font-bold flex items-center justify-center font-mono text-xs">
            2
          </div>
          <h4 className="font-semibold text-neutral-900 dark:text-neutral-100 text-xs">
            Geliştirici Modunu Açın
          </h4>
          <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-relaxed">
            Chrome adres çubuğuna <code className="bg-neutral-100 dark:bg-neutral-800 px-1 py-0.5 rounded">chrome://extensions</code> yazın ve sağ üstteki <strong>"Geliştirici modu"</strong>nu aktif edin.
          </p>
        </div>

        <div className="p-4 bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-2xs space-y-2">
          <div className="w-6 h-6 rounded-full bg-sky-100 dark:bg-sky-950 text-sky-600 dark:text-sky-400 font-bold flex items-center justify-center font-mono text-xs">
            3
          </div>
          <h4 className="font-semibold text-neutral-900 dark:text-neutral-100 text-xs">
            Paketlenmemiş Öğe Yükle
          </h4>
          <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-relaxed">
            Sol üstteki <strong>"Paketlenmemiş öğe yükle"</strong> butonuna basıp çıkardığınız klasörü seçin. Eklenti anında aktif olacaktır!
          </p>
        </div>
      </div>

      {/* Interactive Code Viewer for Extension Source Files */}
      <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-xs overflow-hidden flex flex-col">
        <div className="bg-neutral-100 dark:bg-neutral-800 px-5 py-3 border-b border-neutral-200 dark:border-neutral-700 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <FileCode className="w-4 h-4 text-sky-600 dark:text-sky-400" />
            <span className="font-semibold text-neutral-900 dark:text-neutral-100 text-xs">
              Eklenti Kaynak Dosyaları ({files.length} Dosya)
            </span>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            {files.map((file) => (
              <button
                key={file.name}
                onClick={() => setSelectedFile(file)}
                className={`px-3 py-1 rounded-md font-mono text-[11px] transition-colors border ${
                  selectedFile.name === file.name
                    ? 'bg-sky-600 text-white border-sky-600 font-semibold'
                    : 'bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700'
                }`}
              >
                {file.name}
              </button>
            ))}
          </div>
        </div>

        {/* Selected File Details Bar */}
        <div className="px-5 py-2.5 bg-neutral-50 dark:bg-neutral-800/40 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between text-[11px] text-neutral-500">
          <div>
            <span className="font-semibold text-neutral-800 dark:text-neutral-200">
              {selectedFile.name}
            </span>
            <span className="ml-2 text-neutral-400">
              · {selectedFile.description}
            </span>
          </div>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1 text-sky-600 dark:text-sky-400 font-medium hover:underline cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span>Kopyalandı!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Kodu Kopyala</span>
              </>
            )}
          </button>
        </div>

        {/* Code Content */}
        <pre className="p-5 font-mono text-[11px] leading-relaxed bg-neutral-950 text-neutral-200 overflow-x-auto max-h-[420px]">
          <code>{selectedFile.content}</code>
        </pre>
      </div>
    </div>
  );
};
