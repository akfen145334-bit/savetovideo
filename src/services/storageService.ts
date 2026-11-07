import { DownloadItem, IDMPresetSettings } from '../types/idm';
import { createSegments } from './sniffService';

const STORAGE_KEY_DOWNLOADS = 'idm_downloads_v1';
const STORAGE_KEY_SETTINGS = 'idm_preset_settings_v1';

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
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error('Failed to load initial downloads:', e);
  }

  // Realistic seed downloads showcasing SaveToVideo capabilities
  const sample1Size = 345000000;
  const sample1Segments = createSegments(sample1Size, 8);
  sample1Segments.forEach((seg, idx) => {
    const ratio = Math.min(1, 0.45 + idx * 0.05);
    seg.downloadedBytes = Math.floor((seg.endByte - seg.startByte) * ratio);
    seg.progressPercent = Math.floor(ratio * 100);
    seg.speed = 1850000 + idx * 250000;
    seg.status = 'active';
  });

  const downloadedSample1 = sample1Segments.reduce((acc, s) => acc + s.downloadedBytes, 0);

  return [
    {
      id: 'dl-1',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
      fileName: 'Tears_of_Steel_1080p_60fps.mp4',
      category: 'video',
      fileSize: sample1Size,
      downloadedBytes: downloadedSample1,
      progress: Math.floor((downloadedSample1 / sample1Size) * 100),
      speed: 16500000, // 16.5 MB/s
      speedFormatted: '16.5 MB/s',
      timeLeft: '00:00:11',
      status: 'downloading',
      connections: 8,
      segments: sample1Segments,
      savePath: 'C:\\Users\\Downloads\\SaveToVideo_Videos\\Tears_of_Steel_1080p_60fps.mp4',
      addedAt: Date.now() - 35000,
      quality: '1080p (FHD)',
      format: 'MP4',
      codec: 'AVC1 / H.264 High@4.2',
      acceptRanges: true,
    },
    {
      id: 'dl-2',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      fileName: 'Big_Buck_Bunny_Blender_Animation_720p.mp4',
      category: 'video',
      fileSize: 94000000,
      downloadedBytes: 94000000,
      progress: 100,
      speed: 0,
      speedFormatted: '0 B/s',
      timeLeft: 'Tamamlandı',
      status: 'completed',
      connections: 8,
      segments: createSegments(94000000, 8).map(s => ({ ...s, progressPercent: 100, downloadedBytes: s.endByte - s.startByte, status: 'completed' as const })),
      savePath: 'C:\\Users\\Downloads\\SaveToVideo_Videos\\Big_Buck_Bunny_Blender_Animation_720p.mp4',
      addedAt: Date.now() - 3600000,
      completedAt: Date.now() - 3550000,
      quality: '720p (HD)',
      format: 'MP4',
      codec: 'H.264 / AAC',
      acceptRanges: true,
    },
    {
      id: 'dl-3',
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
    },
    {
      id: 'dl-4',
      url: 'https://example-media.com/audio/podcast-ep-42.mp3',
      fileName: 'Teknoloji_Gundemi_Bolum_42.mp3',
      category: 'music',
      fileSize: 45000000,
      downloadedBytes: 45000000,
      progress: 100,
      speed: 0,
      speedFormatted: '0 B/s',
      timeLeft: 'Tamamlandı',
      status: 'completed',
      connections: 4,
      segments: createSegments(45000000, 4).map(s => ({ ...s, progressPercent: 100, status: 'completed' as const })),
      savePath: 'C:\\Users\\Downloads\\SaveToVideo_Music\\Teknoloji_Gundemi_Bolum_42.mp3',
      addedAt: Date.now() - 86400000,
      completedAt: Date.now() - 86350000,
      quality: 'Audio (320k)',
      format: 'MP3',
      codec: 'MPEG Layer 3',
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
