export interface SensorSize {
  label: string;
  /** Approx. sensor width in mm */
  widthMm: number;
}

export const sensorSizes: SensorSize[] = [
  { label: "4/3\"", widthMm: 17.3 },
  { label: "1\"", widthMm: 13.2 },
  { label: "1/1.8\"", widthMm: 7.18 },
  { label: "1/2\"", widthMm: 6.4 },
  { label: "1/2.7\"", widthMm: 5.37 },
  { label: "1/2.8\"", widthMm: 5.02 },
  { label: "1/3\"", widthMm: 4.8 },
  { label: "1/3.2\"", widthMm: 4.54 },
  { label: "1/4\"", widthMm: 3.6 },
];

export interface Resolution {
  label: string;
  /** Horizontal resolution in pixels */
  pixelsH: number;
}

export const resolutions: Resolution[] = [
  { label: "1MP (720p)", pixelsH: 1280 },
  { label: "1.3MP (960p)", pixelsH: 1280 },
  { label: "2MP (1080p)", pixelsH: 1920 },
  { label: "3MP", pixelsH: 2048 },
  { label: "4MP", pixelsH: 2688 },
  { label: "5MP", pixelsH: 2592 },
  { label: "8MP (4K)", pixelsH: 3840 },
  { label: "12MP", pixelsH: 4000 },
];

/**
 * Focal length of the lens (mm) for a given sensor width, subject distance and
 * horizontal field of view:  f = sensorWidthMm * (distance / fovWidth).
 * Distance and FOV must share the same unit (we use feet like CP PLUS).
 */
export function focalLengthMm(sensorWidthMm: number, distanceFt: number, fovWidthFt: number) {
  if (!sensorWidthMm || !distanceFt || !fovWidthFt) return 0;
  return sensorWidthMm * (distanceFt / fovWidthFt);
}

/** Pixels per foot across the field of view (PPF / PPM≈3.28×PPF). */
export function pixelsPerFoot(pixelsH: number, fovWidthFt: number) {
  if (!pixelsH || !fovWidthFt) return 0;
  return pixelsH / fovWidthFt;
}
