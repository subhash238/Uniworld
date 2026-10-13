export const deviceTypes = ["DVR", "NVR", "IPC"] as const;

export const resolutions = [
  { label: "1MP", kbps: 1024 },
  { label: "2MP", kbps: 2048 },
  { label: "3MP", kbps: 3072 },
  { label: "4MP", kbps: 4096 },
  { label: "5MP", kbps: 5120 },
  { label: "6MP", kbps: 6144 },
  { label: "8MP", kbps: 8192 },
];

// Bitrate multiplier relative to H.265 (the base rates above are H.265 @ 25 fps).
export const encodings = [
  { label: "H.264", factor: 2 },
  { label: "H.265", factor: 1 },
  { label: "H.265+", factor: 0.5 },
];

export const qualities = [
  { label: "Best", factor: 1 },
  { label: "Normal", factor: 0.75 },
  { label: "Basic", factor: 0.5 },
];

export const frameRates = [1, 5, 8, 10, 12, 15, 20, 25, 30];
export const motionLevels = [100, 90, 80, 70, 60, 50, 40, 30, 20, 10];
export const diskCounts = Array.from({ length: 16 }, (_, index) => index + 1);
export const diskSizesTb = [1, 2, 3, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24];

export const AUDIO_KBPS = 64;
const BASE_FPS = 25;

export interface StreamRow {
  id: number;
  type: (typeof deviceTypes)[number];
  channels: number;
  encoding: string;
  quality: string;
  resolution: string;
  fps: number;
  audio: boolean;
  bitrate: number;
  motion: number;
}

export function suggestedBitrate(row: Pick<StreamRow, "resolution" | "encoding" | "quality" | "fps">) {
  const base = resolutions.find((item) => item.label === row.resolution)?.kbps ?? 2048;
  const encoding = encodings.find((item) => item.label === row.encoding)?.factor ?? 1;
  const quality = qualities.find((item) => item.label === row.quality)?.factor ?? 1;
  return Math.max(64, Math.round((base * encoding * quality * row.fps) / BASE_FPS));
}

/** Effective kbps a row contributes, after channels, audio and motion share. */
export function rowKbps(row: StreamRow) {
  const perChannel = Math.max(0, row.bitrate) + (row.audio ? AUDIO_KBPS : 0);
  return perChannel * Math.max(0, row.channels) * (row.motion / 100);
}

export function totalKbps(rows: StreamRow[]) {
  return rows.reduce((sum, row) => sum + rowKbps(row), 0);
}

export const kbpsToMbps = (kbps: number) => kbps / 1024;

/** kbps → KB/s (÷8) → GB per day (÷1024²), matching the CP PLUS calculator. */
export const gbPerDay = (kbps: number) => (kbps * 86400) / 8 / 1024 / 1024;

export function recordingDays(kbps: number, disks: number, diskSizeTb: number) {
  const daily = gbPerDay(kbps);
  if (daily <= 0) return 0;
  return Math.floor((disks * diskSizeTb * 1024) / daily);
}

export const storageTbForDays = (kbps: number, days: number) => (gbPerDay(kbps) * Math.max(0, days)) / 1024;
