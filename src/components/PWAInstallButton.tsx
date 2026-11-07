import React, { useState } from 'react';
import { Download, Monitor, CheckCircle, HelpCircle, X, Smartphone } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showGuide, setShowGuide] = useState(false);

  // If already running in standalone PWA window, display a subtle installed indicator
  if (isInstalled) {
    return (
      <span className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 rounded-md border border-emerald-200 dark:border-emerald-800">
        <CheckCircle className="w-3.5 h-3.5" />
        <span>Masaüstü Modu</span>
      </span>
    );
  }

  // Chromium / Edge / Windows / Android install flow
  if (isInstallable) {
    return (
      <button
        onClick={install}
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-2xs whitespace-nowrap shrink-0"
        title="SaveToVideo'yu Windows, macOS veya Android cihazınıza tek tıkla kurun"
      >
        <Monitor className="w-3.5 h-3.5" />
        <span>SaveToVideo'yu Masaüstüne Kur</span>
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowGuide(true)}
          className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-lg border border-neutral-300 dark:border-neutral-700 transition-colors whitespace-nowrap shrink-0"
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>iOS'a Kur</span>
        </button>

        {showGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
            <div className="w-full max-w-sm rounded-xl bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 p-5 shadow-2xl text-xs space-y-3">
              <div className="flex justify-between items-center pb-2 border-b border-neutral-200 dark:border-neutral-800">
                <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                  iPhone / iPad Cihazına Kurulum
                </h3>
                <button
                  onClick={() => setShowGuide(false)}
                  className="p-1 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2 text-neutral-600 dark:text-neutral-300 leading-relaxed">
                <div className="flex gap-2">
                  <span className="font-bold font-mono text-sky-600">1.</span>
                  <span>Safari alt çubuğundaki <strong>Paylaş (Share)</strong> simgesine dokunun.</span>
                </div>
                <div className="flex gap-2">
                  <span className="font-bold font-mono text-sky-600">2.</span>
                  <span>Menüyü aşağı kaydırıp <strong>"Ana Ekrana Ekle" (Add to Home Screen)</strong> seçeneğine tıklayın.</span>
                </div>
                <div className="flex gap-2">
                  <span className="font-bold font-mono text-sky-600">3.</span>
                  <span>SaveToVideo artık telefonunuzda bağımsız bir masaüstü uygulaması gibi çalışacaktır.</span>
                </div>
              </div>

              <button
                onClick={() => setShowGuide(false)}
                className="w-full mt-2 py-2 bg-sky-600 text-white font-semibold rounded-lg hover:bg-sky-700 transition-colors"
              >
                Anladım
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  // Standard fallback button opening installation hub
  return (
    <button
      onClick={() => setShowGuide(true)}
      className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-lg border border-neutral-300 dark:border-neutral-700 transition-colors whitespace-nowrap shrink-0 shadow-2xs"
      title="SaveToVideo'yu tarayıcıdan bilgisayarınıza uygulama olarak kurun"
    >
      <Monitor className="w-3.5 h-3.5 text-indigo-500" />
      <span>Masaüstüne Kur</span>
    </button>
  );
};

export const OfflineIndicator: React.FC<{ isOnline: boolean }> = ({ isOnline }) => {
  if (isOnline) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 flex items-center gap-2 rounded-lg bg-amber-600 text-white px-3.5 py-2 text-xs font-semibold shadow-xl border border-amber-500 animate-pulse">
      <span className="h-2 w-2 rounded-full bg-white animate-ping" />
      <span>Çevrimdışı (Offline) Mod — Yerleşik SaveToVideo motoru ve yerel depolama devrede.</span>
    </div>
  );
};
