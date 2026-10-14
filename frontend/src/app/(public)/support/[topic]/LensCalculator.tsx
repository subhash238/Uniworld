"use client";

import { useState } from "react";
import { FiInfo } from "react-icons/fi";
import {
  focalLengthMm,
  pixelsPerFoot,
  resolutions,
  sensorSizes,
} from "@/lib/lensCalculator";

const field = "h-10 w-full rounded border border-slate-300 bg-white px-3 text-sm text-slate-700 outline-none focus:border-[#e31e24]";
const label = "mb-1.5 block text-[13px] font-semibold text-slate-700";

const tips = [
  "Focal length = sensor width × distance ÷ field of view width.",
  "PPF (pixels per foot) tells you how much detail you get — more is better for identification.",
  "As a rough guide: 25 PPF for detection, 60 PPF for recognition, 120+ PPF for identification.",
  "A shorter focal length gives a wider view; a longer focal length covers more distance.",
];

export default function LensCalculator() {
  const [sensor, setSensor] = useState(sensorSizes[5].label);
  const [resolution, setResolution] = useState(resolutions[2].label);
  const [distance, setDistance] = useState("20");
  const [fovWidth, setFovWidth] = useState("12");

  const sensorMm = sensorSizes.find((item) => item.label === sensor)?.widthMm ?? 0;
  const pixelsH = resolutions.find((item) => item.label === resolution)?.pixelsH ?? 0;
  const distanceFt = Number(distance) || 0;
  const fovFt = Number(fovWidth) || 0;

  const focal = focalLengthMm(sensorMm, distanceFt, fovFt);
  const ppf = pixelsPerFoot(pixelsH, fovFt);
  const ppm = ppf * 3.2808;

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 sm:p-7" aria-labelledby="lens-calc-heading">
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#e31e24]">Tools</p>
      <h2 id="lens-calc-heading" className="mt-1 text-xl font-bold text-[#1b2a4a] sm:text-2xl">Lens Calculator</h2>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
        Find the focal length your camera lens needs and how many pixels per foot the scene will carry.
      </p>

      <div className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,1fr)_280px] lg:gap-8">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="lens-sensor" className={label}>Image sensor</label>
            <select id="lens-sensor" value={sensor} onChange={(e) => setSensor(e.target.value)} className={field}>
              {sensorSizes.map((item) => <option key={item.label} value={item.label}>{item.label}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="lens-resolution" className={label}>Resolution</label>
            <select id="lens-resolution" value={resolution} onChange={(e) => setResolution(e.target.value)} className={field}>
              {resolutions.map((item) => <option key={item.label} value={item.label}>{item.label}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="lens-distance" className={label}>Distance between camera and object (in ft.)</label>
            <input id="lens-distance" type="number" min={0} step="any" inputMode="decimal" value={distance} onChange={(e) => setDistance(e.target.value)} className={field} />
          </div>
          <div>
            <label htmlFor="lens-fov" className={label}>Width of field of view (in ft.)</label>
            <input id="lens-fov" type="number" min={0} step="any" inputMode="decimal" value={fovWidth} onChange={(e) => setFovWidth(e.target.value)} className={field} />
          </div>
        </div>

        <div className="flex flex-col justify-center gap-3 rounded-lg border border-slate-200 bg-[#f7f9fc] p-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Focal length (in mm.)</p>
            <p className="mt-1 text-3xl font-extrabold text-[#e31e24]">{focal ? focal.toFixed(2) : "—"}</p>
          </div>
          <div className="border-t border-slate-200 pt-3">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">PPF / PPM</p>
            <p className="mt-1 text-2xl font-extrabold text-[#1b2a4a]">
              {ppf ? Math.round(ppf).toLocaleString("en-IN") : "—"}
              <span className="ml-2 text-sm font-semibold text-slate-500">({ppm ? Math.round(ppm).toLocaleString("en-IN") : "—"} ppm)</span>
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-lg border border-slate-200 bg-[#f7f9fc] p-4">
        <p className="flex items-center gap-2 text-sm font-bold text-[#1b2a4a]"><FiInfo className="text-[#e31e24]" aria-hidden="true" /> Good to know</p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-[13px] leading-6 text-slate-600">
          {tips.map((tip) => <li key={tip}>{tip}</li>)}
        </ul>
      </div>
    </section>
  );
}
