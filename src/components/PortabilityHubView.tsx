import React, { useState } from 'react';
import { 
  Download, 
  Monitor, 
  HardDrive, 
  Layers, 
  CheckCircle2, 
  FileCode, 
  FolderArchive, 
  ShieldCheck, 
  Zap, 
  Sparkles,
  WifiOff,
  Laptop,
  Check
} from 'lucide-react';
import { 
  downloadSingleFilePortableHtml, 
  downloadPortableWindowsZip, 
  downloadDesktopInstallerZip 
} from '../services/portableGenerator';
import { usePWAInstall, useOnlineStatus } from '../hooks/usePWAInstall';

export const PortabilityHubView: React.FC = () => {
  const { isInstallable, isInstalled, install } = usePWAInstall();
  const isOnline = useOnlineStatus();
  const [downloadingType, setDownloadingType] = useState<string | null>(null);

  const handleDownload = async (type: string, fn: () => void) => {
    setDownloadingType(type);
    try {
      fn();
    } finally {
      setTimeout(() => setDownloadingType(null), 1000);
    }
  };

  return (
    <div className="flex-1 overflow-auto bg-neutral-50 dark:bg-neutral-950 p-6 space-y-6 text-xs font-sans">
      {/* Top Banner */}
      <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
              <Laptop className="w-4 h-4" />
            </div>
            <h2 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
              SaveToVideo Çevrimdışı (Offline), Portatif &amp; Kurulabilir Sürümler Merkezi
            </h2>
          </div>
          <p className="text-neutral-500 dark:text-neutral-400 text-xs leading-relaxed">
            SaveToVideo'yu bilgisayarınıza yerel bir masaüstü uygulaması olarak kurabilir, USB belleğinizde kurulumsuz taşıyabilir veya tek dosya halinde internet bağlantısı olmadan çevrimdışı çalıştırabilirsiniz.
          </p>
        </div>

        {/* Offline Badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 font-semibold shrink-0">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          <span>{isOnline ? 'Çevrimdışı Önbellek Hazır' : 'Çevrimdışı Mod Devrede'}</span>
        </div>
      </div>

      {/* Grid: 3 Main Portability & Installation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: PWA Native Desktop App Installation */}
        <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-5 shadow-2xs flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-lg bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center">
              <Monitor className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                1. SaveToVideo Masaüstüne Kur (PWA)
              </h3>
              <span className="text-[11px] text-sky-600 dark:text-sky-400 font-medium">
                Windows, macOS &amp; Android Uyumlu
              </span>
            </div>
            <p className="text-neutral-500 dark:text-neutral-400 text-[11px] leading-relaxed">
              Google Chrome veya Microsoft Edge üzerinden tek tıkla Windows Başlat menüsüne ve masaüstüne bağımsız bir uygulama olarak kurulur. Tarayıcı çerçevesi olmadan çalışır.
            </p>

            <ul className="space-y-1.5 text-[11px] text-neutral-600 dark:text-neutral-300 pt-1">
              <li className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span>Masaüstü ve Başlat Menüsü Kısayolu</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span>%100 Çevrimdışı (Offline) Service Worker</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span>Otomatik Arka Plan Güncelleme</span>
              </li>
            </ul>
          </div>

          <div>
            {isInstalled ? (
              <div className="w-full py-2.5 px-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 font-semibold text-center border border-emerald-300 dark:border-emerald-800 flex items-center justify-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>Uygulama Zaten Kurulu</span>
              </div>
            ) : isInstallable ? (
              <button
                onClick={install}
                className="w-full py-2.5 px-4 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-lg transition-colors shadow-2xs flex items-center justify-center gap-2"
              >
                <Monitor className="w-4 h-4" />
                <span>Masaüstüne Kur (Tek Tık)</span>
              </button>
            ) : (
              <button
                onClick={() => alert("Chrome veya Edge tarayıcınızın adres çubuğunun sağındaki 'Uygulamayı Yükle' (Install) simgesine tıklayarak doğrudan kurabilirsiniz.")}
                className="w-full py-2.5 px-4 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 font-semibold rounded-lg transition-colors border border-neutral-300 dark:border-neutral-700 flex items-center justify-center gap-2"
              >
                <Monitor className="w-4 h-4 text-sky-500" />
                <span>Tarayıcıdan Kurulumu Başlat</span>
              </button>
            )}
          </div>
        </div>

        {/* Card 2: Portable Windows USB Package */}
        <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-5 shadow-2xs flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <HardDrive className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                2. Taşınabilir Portatif Paket (USB)
              </h3>
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                Sıfır Kurulum · USB Bellekten Çalışır
              </span>
            </div>
            <p className="text-neutral-500 dark:text-neutral-400 text-[11px] leading-relaxed">
              Herhangi bir kurulum, yönetici izni veya Windows kayıt defteri kaydı gerektirmez. USB belleğinize kopyalayıp dilediğiniz bilgisayarda çift tıklamayla çalıştırabilirsiniz.
            </p>

            <ul className="space-y-1.5 text-[11px] text-neutral-600 dark:text-neutral-300 pt-1">
              <li className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span>Başlatıcı Batch Dosyası Dahil (.bat)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span>Ayarlar ve İndirmeler Yerel Saklanır</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span>İnternetsiz Ortamlarda Tam Çalışır</span>
              </li>
            </ul>
          </div>

          <button
            onClick={() => handleDownload('portable-zip', downloadPortableWindowsZip)}
            disabled={downloadingType === 'portable-zip'}
            className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-colors shadow-2xs flex items-center justify-center gap-2"
          >
            <FolderArchive className="w-4 h-4" />
            <span>{downloadingType === 'portable-zip' ? 'Paketleniyor...' : 'Portatif Paketi İndir (.ZIP)'}</span>
          </button>
        </div>

        {/* Card 3: Windows Desktop Shortcut Installer */}
        <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-5 shadow-2xs flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Laptop className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                3. Windows Kurulum Sihirbazı
              </h3>
              <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium">
                Otomatik Kısayol &amp; Kaldırma Desteği
              </span>
            </div>
            <p className="text-neutral-500 dark:text-neutral-400 text-[11px] leading-relaxed">
              Geleneksel Windows programları gibi çift tıklamayla masaüstünüze SaveToVideo kısayolunu oluşturur ve bağımsız pencere modunda çalıştırır. İstenildiğinde tek tıkla kaldırılabilir.
            </p>

            <ul className="space-y-1.5 text-[11px] text-neutral-600 dark:text-neutral-300 pt-1">
              <li className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span>Masaüstü .lnk Kısayolu Oluşturucu</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span>Tek Tıkla Temiz Kaldırma (.bat)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span>Edge / Chrome App Moduyla Açılış</span>
              </li>
            </ul>
          </div>

          <button
            onClick={() => handleDownload('desktop-installer', downloadDesktopInstallerZip)}
            disabled={downloadingType === 'desktop-installer'}
            className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors shadow-2xs flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>{downloadingType === 'desktop-installer' ? 'Paketleniyor...' : 'Windows Kurulumunu İndir (.ZIP)'}</span>
          </button>
        </div>
      </div>

      {/* Bonus Strip: Single-File Standalone HTML */}
      <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-5 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <FileCode className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-neutral-900 dark:text-neutral-100 text-xs">
              Tek Dosya Bağımsız Portatif HTML Sürümü (Single-File App)
            </h4>
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5">
              İçinde tüm SaveToVideo arayüzü, çok kanallı segment motoru, stil ve betikleri barındıran 150 KB'lık tek bir <code>.html</code> dosyasıdır. İndirip çift tıklayarak internetsiz her yerde anında açabilirsiniz.
            </p>
          </div>
        </div>

        <button
          onClick={() => downloadSingleFilePortableHtml()}
          className="px-4 py-2 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 font-semibold rounded-lg border border-neutral-300 dark:border-neutral-700 transition-colors flex items-center gap-1.5 shrink-0 shadow-2xs"
        >
          <Download className="w-3.5 h-3.5 text-amber-500" />
          <span>Tek Dosya HTML İndir (.html)</span>
        </button>
      </div>

      {/* Technical Offline Capabilities Breakdown */}
      <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-5 shadow-xs space-y-3">
        <h3 className="font-bold text-neutral-900 dark:text-neutral-100 text-xs flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>Çevrimdışı (Offline) Çalışma Mimarisi &amp; Güvenilirlik</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-[11px] text-neutral-600 dark:text-neutral-400">
          <div className="p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200/60 dark:border-neutral-800">
            <strong className="block text-neutral-900 dark:text-neutral-100 mb-1">Service Worker Cache:</strong>
            Uygulamanın tüm çekirdek HTML, JS, CSS ve font dosyaları tarayıcınızın CacheStorage alanında saklanır. İnternet kesilse bile sayfa anında açılır.
          </div>

          <div className="p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200/60 dark:border-neutral-800">
            <strong className="block text-neutral-900 dark:text-neutral-100 mb-1">Yerel Veri Saklama:</strong>
            İndirme listeniz, kuyruklarınız, ön ayarlarınız ve bağlantı tercihleriniz tarayıcınızın yerel depolama alanında güvenle tutulur.
          </div>

          <div className="p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200/60 dark:border-neutral-800">
            <strong className="block text-neutral-900 dark:text-neutral-100 mb-1">Yerleşik Medya Tarayıcı:</strong>
            Sunucuya erişilemeyen çevrimdışı senaryolarda istemci tabanlı derin medya analiz motoru otomatik devreye girer.
          </div>
        </div>
      </div>
    </div>
  );
};
