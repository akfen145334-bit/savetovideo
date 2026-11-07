export type FileCategory = 'all' | 'compressed' | 'documents' | 'music' | 'programs' | 'video' | 'in_progress' | 'completed' | 'queued' | 'paused';

export type DownloadStatus = 'downloading' | 'paused' | 'completed' | 'queued' | 'error';

export interface DownloadSegment {
  id: number;
  startByte: number;
  endByte: number;
  downloadedBytes: number;
  progressPercent: number;
  speed: number; // bytes/sec
  status: 'active' | 'completed' | 'idle' | 'waiting';
}

export interface DownloadItem {
  id: string;
  url: string;
  fileName: string;
  category: 'video' | 'music' | 'compressed' | 'documents' | 'programs';
  fileSize: number; // in bytes
  downloadedBytes: number;
  progress: number; // 0 - 100
  speed: number; // bytes/s
  speedFormatted: string;
  timeLeft: string; // e.g. "00:00:15"
  status: DownloadStatus;
  connections: number; // e.g. 1, 4, 8, 16, 32
  segments: DownloadSegment[];
  savePath: string;
  addedAt: number;
  completedAt?: number;
  quality?: string;
  format?: string;
  codec?: string;
  acceptRanges: boolean;
}

export interface DetectedStream {
  id: string;
  url: string;
  title: string;
  format: 'MP4' | 'MKV' | 'WEBM' | 'M3U8' | 'MPD' | 'MP3' | 'M4A';
  quality: '2160p (4K)' | '1440p (2K)' | '1080p (FHD)' | '720p (HD)' | '480p (SD)' | '360p (SD)' | 'Audio (320k)' | 'Audio (128k)';
  resolution: string;
  sizeBytes: number;
  sizeFormatted: string;
  bitrate?: string;
  fps?: number;
  codec: string;
  acceptRanges: boolean;
  mimeType: string;
  sourceType: 'Direct MP4' | 'HLS Stream' | 'DASH Stream' | 'Embedded Video' | 'Audio Track';
}

export interface SniffResult {
  success: boolean;
  pageUrl: string;
  pageTitle: string;
  thumbnail: string;
  streamsCount: number;
  streams: DetectedStream[];
}

export interface IDMPresetSettings {
  autoDownload: boolean; // "istenilirse otomatik ayarlanıp hep aynı ayarda indir denilebilsin"
  defaultConnections: number; // 1, 2, 4, 8, 16, 24, 32
  preferredQuality: 'highest' | '1080p' | '720p' | 'audio_only';
  defaultSavePath: string;
  speedLimitEnabled: boolean;
  speedLimitKBps: number; // e.g. 5000 = 5 MB/s
  playSoundOnComplete: boolean;
  autoOpenFolder: boolean;
  sniffMimeTypes: string[];
}
