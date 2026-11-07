import { DownloadItem, IDMPresetSettings } from '../types/idm';
import { createSegments } from './sniffService';

const STORAGE_KEY_DOWNLOADS = 'savetovideo_downloads_v3';
const STORAGE_KEY_SETTINGS = 'savetovideo_preset_settings_v3';

export const DEFAULT_PRESET_SETTINGS: IDMPresetSettings = {
  autoDownload: false, // "istenilirse otomatik ayarlanıp hep aynı ayarda indir denilebilsin"
  defaultConnections: 8, // 8 parallel chunk connections
  preferredQuality: '1080p',
  defaultSavePath: 'C:\\Users\\Downloads\\SaveToVideo_Videos\\',
  speedLimitEnabled: false,
  speedLimitKBps: 10000,
  playSoundOnComplete: true,
  autoOpenFolder: false,
  sniffMimeTypes: ['video/mp4', 'application/x-mpegurl', 'video/webm', 'audio/mp4', 'audio/mpeg'],
};

export function loadStoredSettings(): IDMPresetSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SETTINGS);
    if (raw) return { ...DEFAULT_PRESET_SETTINGS, ...JSON.parse(raw) };
  } catch (e) {
    console.error('Failed to load SaveToVideo settings:', e);
  }
  return DEFAULT_PRESET_SETTINGS;
}

export function saveStoredSettings(settings: IDMPresetSettings): void {
  try {
    localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save SaveToVideo settings:', e);
  }
}

export function getInitialDownloads(): DownloadItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_DOWNLOADS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const hasDogStars = parsed.some(p => p.id === 'dl-dogstars');
        const hasYouTube = parsed.some(p => p.id === 'dl-youtube');
        if (hasDogStars && hasYouTube) return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to load initial downloads:', e);
  }

  // Active multi-thread segments for YouTube item
  const ytSize = 485000000;
  const ytSegments = createSegments(ytSize, 8);
  ytSegments.forEach((seg, idx) => {
    const ratio = Math.min(1, 0.55 + idx * 0.05);
    seg.downloadedBytes = Math.floor((seg.endByte - seg.startByte) * ratio);
    seg.progressPercent = Math.floor(ratio * 100);
    seg.speed = 2100000 + idx * 220000;
    seg.status = 'active';
  });
  const ytDownloaded = ytSegments.reduce((acc, s) => acc + s.downloadedBytes, 0);

  return [
    {
      id: 'dl-dogstars',
      sourceAddress: 'https://www.hdfilmcehennemi.nl/the-dog-stars-2/',
      pageUrl: 'https://www.hdfilmcehennemi.nl/the-dog-stars-2/',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
      fileName: 'The_Dog_Stars_2_Turkce_Dublaj_1080p_FHD.mp4',
      category: 'video',
      fileSize: 1980000000,
      downloadedBytes: 1980000000,
      progress: 100,
      speed: 0,
      speedFormatted: '0 B/s',
      timeLeft: 'Tamamlandı',
      status: 'completed',
      connections: 16,
      segments: createSegments(1980000000, 16).map(s => ({ ...s, progressPercent: 100, downloadedBytes: s.endByte - s.startByte, status: 'completed' as const })),
      savePath: 'C:\\Users\\Downloads\\SaveToVideo_Videos\\The_Dog_Stars_2_Turkce_Dublaj_1080p_FHD.mp4',
      addedAt: Date.now() - 1800000,
      completedAt: Date.now() - 1720000,
      quality: '1080p (FHD Dual Dublaj)',
      format: 'MP4',
      codec: 'H.264 / AAC 5.1 Dublaj',
      acceptRanges: true,
    },
    {
      id: 'dl-youtube',
      sourceAddress: 'https://www.youtube.com/watch?v=wCyyVuDIsrg',
      pageUrl: 'https://www.youtube.com/watch?v=wCyyVuDIsrg',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      fileName: 'YouTube_wCyyVuDIsrg_Master_1080p_60fps.mp4',
      category: 'video',
      fileSize: ytSize,
      downloadedBytes: ytDownloaded,
      progress: Math.floor((ytDownloaded / ytSize) * 100),
      speed: 18400000, // 18.4 MB/s
      speedFormatted: '18.4 MB/s',
      timeLeft: '00:00:09',
      status: 'downloading',
      connections: 8,
      segments: ytSegments,
      savePath: 'C:\\Users\\Downloads\\SaveToVideo_Videos\\YouTube_wCyyVuDIsrg_Master_1080p_60fps.mp4',
      addedAt: Date.now() - 45000,
      quality: '1080p (60fps)',
      format: 'MP4',
      codec: 'AVC1 / H.264 High@4.2 + Opus',
      acceptRanges: true,
    },
    {
      id: 'dl-1',
      sourceAddress: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
      fileName: 'Tears_of_Steel_1080p_60fps.mp4',
      category: 'video',
      fileSize: 345000000,
      downloadedBytes: 345000000,
      progress: 100,
      speed: 0,
      speedFormatted: '0 B/s',
      timeLeft: 'Tamamlandı',
      status: 'completed',
      connections: 8,
      segments: createSegments(345000000, 8).map(s => ({ ...s, progressPercent: 100, downloadedBytes: s.endByte - s.startByte, status: 'completed' as const })),
      savePath: 'C:\\Users\\Downloads\\SaveToVideo_Videos\\Tears_of_Steel_1080p_60fps.mp4',
      addedAt: Date.now() - 3600000,
      completedAt: Date.now() - 3550000,
      quality: '1080p (FHD)',
      format: 'MP4',
      codec: 'AVC1 / H.264 High@4.2',
      acceptRanges: true,
    },
    {
      id: 'dl-3',
      sourceAddress: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
      url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
      fileName: 'Mux_HLS_Adaptive_Stream_Master.m3u8',
      category: 'video',
      fileSize: 280000000,
      downloadedBytes: 135000000,
      progress: 48,
      speed: 0,
      speedFormatted: '0 B/s',
      timeLeft: 'Duraklatıldı',
      status: 'paused',
      connections: 16,
      segments: createSegments(280000000, 16),
      savePath: 'C:\\Users\\Downloads\\SaveToVideo_Videos\\Mux_HLS_Adaptive_Stream_Master.mp4',
      addedAt: Date.now() - 7200000,
      quality: '1080p (FHD)',
      format: 'M3U8',
      codec: 'Apple HLS V4',
      acceptRanges: true,
    }
  ];
}

export function saveStoredDownloads(downloads: DownloadItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_DOWNLOADS, JSON.stringify(downloads));
  } catch (e) {
    console.error('Failed to save downloads:', e);
  }
}
