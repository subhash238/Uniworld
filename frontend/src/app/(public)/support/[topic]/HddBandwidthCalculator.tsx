"use client";

import { useState } from "react";
import { FiCheck, FiPlus, FiTrash2 } from "react-icons/fi";
import {
  deviceTypes,
  diskCounts,
  diskSizesTb,
  encodings,
  frameRates,
  gbPerDay,
  kbpsToMbps,
  motionLevels,
  qualities,
  recordingDays,
  resolutions,
  storageTbForDays,
  suggestedBitrate,
  totalKbps,
  type StreamRow,
} from "@/lib/hddCalculator";

const tips = [
  "\"Hours of Motion\" will alter storage in this calculator.",
  "Motion based recording will reduce the storage and bandwidth.",
  "Gigabit Ethernet provides a maximum useable bandwidth of about 500 Mbit/s.",
  "100 Mbit Fast Ethernet provides a maximum useable bandwidth of 55-60 Mbit/s.",
  "10 Mbit Ethernet provides a maximum useable bandwidth of 6-7 Mbit/s.",
  "Wi-Fi 802.11g 54 Mbit provides a maximum useable bandwidth of 12-25 Mbit/s.",
];

const newRow = (id: number): StreamRow => {
  const row = { id, type: "DVR" as const, channels: 1, encoding: "H.265", quality: "Best", resolution: "2MP", fps: 25, audio: false, motion: 100 };
  return { ...row, bitrate: suggestedBitrate(row) };
};

const cell = "h-9 w-full rounded border border-slate-300 bg-white px-2 text-sm text-slate-700 outline-none focus:border-[#e31e24]";
const headers = ["Type", "Channels", "Encode", "Quality", "Resolution", "FPS", "Audio", "Bitrate (kbps)", "Motion", ""];

export default function HddBandwidthCalculator() {
  const [rows, setRows] = useState<StreamRow[]>([newRow(1)]);
  const [mode, setMode] = useState<"disk" | "days">("disk");
  const [disks, setDisks] = useState(1);
  const [diskSize, setDiskSize] = useState(1);
  const [days, setDays] = useState(30);

  const updateRow = (id: number, patch: Partial<StreamRow>) => {
    setRows((current) =>
      current.map((row) => {
        if (row.id !== id) return row;
        const next = { ...row, ...patch };
        const affectsBitrate = ["resolution", "encoding", "quality", "fps"].some((key) => key in patch);
        return affectsBitrate ? { ...next, bitrate: suggestedBitrate(next) } : next;
      })
    );
  };

  const kbps = totalKbps(rows);
  const daily = gbPerDay(kbps);

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6" aria-labelledby="calculator-heading">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 id="calculator-heading" className="text-lg font-bold text-[#1b2a4a]">Calculator</h2>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setRows((current) => [...current, newRow(Math.max(0, ...current.map((row) => row.id)) + 1)])}
              className="inline-flex h-9 items-center gap-1.5 rounded bg-[#e31e24] px-3 text-sm font-semibold text-white transition hover:bg-[#c9181d]"
            >
              <FiPlus size={15} aria-hidden="true" /> Add Streaming
            </button>
            <button
              type="button"
              onClick={() => {
                setRows([newRow(1)]);
                setMode("disk");
                setDisks(1);
                setDiskSize(1);
                setDays(30);
              }}
              className="h-9 rounded border border-slate-300 px-3 text-sm font-semibold text-slate-700 transition hover:border-slate-500"
            >
              Clear
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[920px] border-collapse text-left">
            <thead>
              <tr className="border-y border-slate-200">
                {headers.map((header) => (
                  <th key={header} scope="col" className="px-1.5 py-2 text-center text-xs font-semibold text-[#e31e24]">{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr key={row.id} className="border-b border-slate-100">
                  <td className="px-1.5 py-2">
                    <select aria-label={`Stream ${index + 1} type`} value={row.type} onChange={(e) => updateRow(row.id, { type: e.target.value as StreamRow["type"] })} className={cell}>
                      {deviceTypes.map((type) => <option key={type}>{type}</option>)}
                    </select>
                  </td>
                  <td className="px-1.5 py-2">
                    <input aria-label={`Stream ${index + 1} channels`} type="number" min={1} max={256} value={row.channels} onChange={(e) => updateRow(row.id, { channels: Math.max(0, Number(e.target.value) || 0) })} className={cell} />
                  </td>
                  <td className="px-1.5 py-2">
                    <select aria-label={`Stream ${index + 1} encoding`} value={row.encoding} onChange={(e) => updateRow(row.id, { encoding: e.target.value })} className={cell}>
                      {encodings.map((item) => <option key={item.label}>{item.label}</option>)}
                    </select>
                  </td>
                  <td className="px-1.5 py-2">
                    <select aria-label={`Stream ${index + 1} quality`} value={row.quality} onChange={(e) => updateRow(row.id, { quality: e.target.value })} className={cell}>
                      {qualities.map((item) => <option key={item.label}>{item.label}</option>)}
                    </select>
                  </td>
                  <td className="px-1.5 py-2">
                    <select aria-label={`Stream ${index + 1} resolution`} value={row.resolution} onChange={(e) => updateRow(row.id, { resolution: e.target.value })} className={cell}>
                      {resolutions.map((item) => <option key={item.label}>{item.label}</option>)}
                    </select>
                  </td>
                  <td className="px-1.5 py-2">
                    <select aria-label={`Stream ${index + 1} frame rate`} value={row.fps} onChange={(e) => updateRow(row.id, { fps: Number(e.target.value) })} className={cell}>
                      {frameRates.map((fps) => <option key={fps} value={fps}>{fps}</option>)}
                    </select>
                  </td>
                  <td className="px-1.5 py-2 text-center">
                    <button
                      type="button"
                      role="switch"
                      aria-checked={row.audio}
                      aria-label={`Stream ${index + 1} audio`}
                      onClick={() => updateRow(row.id, { audio: !row.audio })}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${row.audio ? "bg-[#e31e24]" : "bg-slate-300"}`}
                    >
                      <span className={`inline-block h-5 w-5 rounded-full bg-white shadow transition ${row.audio ? "translate-x-5" : "translate-x-0.5"}`} />
                    </button>
                  </td>
                  <td className="px-1.5 py-2">
                    <input aria-label={`Stream ${index + 1} bitrate in kbps`} type="number" min={0} value={row.bitrate} onChange={(e) => updateRow(row.id, { bitrate: Math.max(0, Number(e.target.value) || 0) })} className={cell} />
                  </td>
                  <td className="px-1.5 py-2">
                    <select aria-label={`Stream ${index + 1} motion`} value={row.motion} onChange={(e) => updateRow(row.id, { motion: Number(e.target.value) })} className={cell}>
                      {motionLevels.map((level) => <option key={level} value={level}>{level}%</option>)}
                    </select>
                  </td>
                  <td className="px-1.5 py-2 text-center">
                    {rows.length > 1 && (
                      <button type="button" onClick={() => setRows((current) => current.filter((item) => item.id !== row.id))} className="text-slate-400 transition hover:text-[#e31e24]" aria-label={`Remove stream ${index + 1}`}>
                        <FiTrash2 size={16} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          <fieldset>
            <legend className="mb-2 text-sm font-medium text-slate-700">Calculate By</legend>
            <div className="flex h-9 items-center gap-5 text-sm text-slate-700">
              <label className="flex items-center gap-1.5"><input type="radio" name="calculate-by" checked={mode === "disk"} onChange={() => setMode("disk")} className="accent-[#e31e24]" /> Disk</label>
              <label className="flex items-center gap-1.5"><input type="radio" name="calculate-by" checked={mode === "days"} onChange={() => setMode("days")} className="accent-[#e31e24]" /> Days</label>
            </div>
          </fieldset>
          {mode === "disk" ? (
            <>
              <label className="text-sm font-medium text-slate-700">
                Disk (numbers)
                <select value={disks} onChange={(e) => setDisks(Number(e.target.value))} className={`${cell} mt-2`}>
                  {diskCounts.map((count) => <option key={count} value={count}>{count}</option>)}
                </select>
              </label>
              <label className="text-sm font-medium text-slate-700">
                Disk Size (TB)
                <select value={diskSize} onChange={(e) => setDiskSize(Number(e.target.value))} className={`${cell} mt-2`}>
                  {diskSizesTb.map((size) => <option key={size} value={size}>{size}</option>)}
                </select>
              </label>
            </>
          ) : (
            <label className="text-sm font-medium text-slate-700">
              Recording days
              <input type="number" min={1} max={3650} value={days} onChange={(e) => setDays(Math.max(0, Number(e.target.value) || 0))} className={`${cell} mt-2`} />
            </label>
          )}
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-3" aria-live="polite">
          <div className="rounded-lg bg-[#1b2a4a] p-4 text-white">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-300">Storage per day</p>
            <p className="mt-1 text-2xl font-bold">{daily.toFixed(2)} <span className="text-sm font-medium">GB</span></p>
          </div>
          <div className="rounded-lg border border-slate-200 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{mode === "disk" ? "Recording days" : "Storage required"}</p>
            <p className="mt-1 text-2xl font-bold text-[#e31e24]">
              {mode === "disk" ? recordingDays(kbps, disks, diskSize) : <>{storageTbForDays(kbps, days).toFixed(2)} <span className="text-sm font-medium">TB</span></>}
            </p>
          </div>
          <div className="rounded-lg border border-slate-200 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Total bandwidth</p>
            <p className="mt-1 text-2xl font-bold text-[#e31e24]">{kbpsToMbps(kbps).toFixed(2)} <span className="text-sm font-medium">Mbps</span></p>
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6" aria-labelledby="calculator-tips-heading">
        <h2 id="calculator-tips-heading" className="text-base font-bold text-[#1b2a4a]">Some important points to keep in mind while making bandwidth &amp; storage provisions</h2>
        <ul className="mt-3 space-y-2">
          {tips.map((tip) => (
            <li key={tip} className="flex gap-2 text-sm text-slate-600"><FiCheck className="mt-0.5 shrink-0 text-[#e31e24]" aria-hidden="true" />{tip}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}
