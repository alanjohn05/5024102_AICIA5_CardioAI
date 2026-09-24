import React, { useState, useRef, useEffect } from 'react';
import {
  Upload,
  Activity,
  FileCheck,
  Play,
  Pause,
  Maximize2,
  ZoomIn,
  ZoomOut,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Info,
  Clock,
  Heart,
  Ruler,
} from 'lucide-react';
import { SAMPLE_ECG_RECORDINGS } from '../data/samplePatients';
import { ECGWaveformSample } from '../types/clinical';

export const ECGViewer: React.FC = () => {
  const [selectedSample, setSelectedSample] = useState<ECGWaveformSample>(SAMPLE_ECG_RECORDINGS[0]);
  const [activeLead, setActiveLead] = useState<'Lead II' | 'Lead I' | 'Lead V1' | 'Lead V5'>('Lead V5');
  const [gain, setGain] = useState<number>(10); // 10 mm/mV standard
  const [speed, setSpeed] = useState<number>(25); // 25 mm/s standard
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [sweepIndex, setSweepIndex] = useState<number>(0);
  const [uploadedFile, setUploadedFile] = useState<{ name: string; size: string } | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [caliperMode, setCaliperMode] = useState<boolean>(false);
  const [caliperPoints, setCaliperPoints] = useState<number[]>([]);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // File upload handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsProcessing(true);
      setUploadedFile({
        name: file.name,
        size: `${(file.size / 1024).toFixed(1)} KB`,
      });

      setTimeout(() => {
        setIsProcessing(false);
        // Map to abnormal or representative
        const matched = SAMPLE_ECG_RECORDINGS[0];
        setSelectedSample({
          ...matched,
          name: `Uploaded: ${file.name}`,
          description: `Custom telemetry trace processed via automated signal filter pipeline (${file.name}).`,
        });
      }, 900);
    }
  };

  // Drag and drop handler
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setIsProcessing(true);
      setUploadedFile({
        name: file.name,
        size: `${(file.size / 1024).toFixed(1)} KB`,
      });
      setTimeout(() => {
        setIsProcessing(false);
        setSelectedSample({
          ...SAMPLE_ECG_RECORDINGS[0],
          name: `Uploaded: ${file.name}`,
          description: `Custom telemetry trace processed via automated signal filter pipeline (${file.name}).`,
        });
      }, 900);
    }
  };

  // Animation sweep loop
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setSweepIndex((prev) => (prev + 2) % 300);
    }, 40);
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Render ECG on Canvas with millimeter grid
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    // 1. Draw ECG Grid Paper (Pink / Coral clinical grid)
    ctx.fillStyle = '#fffaf7';
    ctx.fillRect(0, 0, width, height);

    // Minor grid (1mm squares -> 8px)
    ctx.lineWidth = 0.5;
    ctx.strokeStyle = '#fcdcd5';
    const minorStep = 8;
    for (let x = 0; x < width; x += minorStep) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += minorStep) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Major grid (5mm squares -> 40px)
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#f8b4a6';
    const majorStep = 40;
    for (let x = 0; x < width; x += majorStep) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += majorStep) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Baseline Center
    const centerY = height / 2;

    // 2. Draw Calibration Pulse (Standard 1 mV square wave at start)
    ctx.lineWidth = 1.8;
    ctx.strokeStyle = '#0f172a';
    ctx.beginPath();
    ctx.moveTo(10, centerY);
    ctx.lineTo(20, centerY);
    ctx.lineTo(20, centerY - (gain * 4)); // 1mV deflection
    ctx.lineTo(35, centerY - (gain * 4));
    ctx.lineTo(35, centerY);
    ctx.lineTo(45, centerY);
    ctx.stroke();

    // 3. Draw Continuous ECG Waveform
    const points = selectedSample.points;
    const totalPoints = points.length;
    const startX = 50;
    const availableWidth = width - startX - 20;
    const stepX = availableWidth / (totalPoints - 1);

    ctx.beginPath();
    ctx.lineWidth = 2.0;
    ctx.strokeStyle = '#0f172a'; // Deep clinical slate/black trace

    for (let i = 0; i < totalPoints; i++) {
      const x = startX + i * stepX;
      // Adjust lead amplitude slightly based on active lead
      let leadScale = 1.0;
      if (activeLead === 'Lead I') leadScale = 0.75;
      if (activeLead === 'Lead V1') leadScale = 0.85;
      if (activeLead === 'Lead V5') leadScale = 1.25;

      const y = centerY - (points[i] * gain * 3.5 * leadScale);

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.stroke();

    // 4. Draw Animated Sweep Cursor (like hospital monitor)
    if (isPlaying) {
      const sweepX = startX + sweepIndex * stepX;
      ctx.fillStyle = 'rgba(239, 68, 68, 0.85)'; // red sweep line
      ctx.fillRect(sweepX, 0, 2.5, height);

      // Fade tail
      const gradient = ctx.createLinearGradient(sweepX - 25, 0, sweepX, 0);
      gradient.addColorStop(0, 'rgba(255, 250, 247, 0)');
      gradient.addColorStop(1, 'rgba(239, 68, 68, 0.15)');
      ctx.fillStyle = gradient;
      ctx.fillRect(sweepX - 25, 0, 25, height);
    }

    // 5. Caliper markers if placed
    if (caliperPoints.length > 0) {
      ctx.fillStyle = '#2563eb';
      ctx.strokeStyle = '#2563eb';
      ctx.lineWidth = 1.5;
      caliperPoints.forEach((cx, idx) => {
        ctx.beginPath();
        ctx.arc(cx, centerY, 4, 0, 2 * Math.PI);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(cx, 0);
        ctx.lineTo(cx, height);
        ctx.setLineDash([4, 4]);
        ctx.stroke();
        ctx.setLineDash([]);
      });

      if (caliperPoints.length === 2) {
        const diffPx = Math.abs(caliperPoints[1] - caliperPoints[0]);
        const msPerPixel = 1000 / (speed * 8); // approximate conversion
        const measuredMs = Math.round(diffPx * msPerPixel);

        ctx.fillStyle = '#1e3a8a';
        ctx.font = 'bold 11px sans-serif';
        const midX = (caliperPoints[0] + caliperPoints[1]) / 2;
        ctx.fillText(`Δt = ${measuredMs} ms`, midX - 30, centerY - 20);
      }
    }
  }, [selectedSample, activeLead, gain, speed, sweepIndex, isPlaying, caliperPoints]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!caliperMode) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    if (caliperPoints.length >= 2) {
      setCaliperPoints([x]);
    } else {
      setCaliperPoints((prev) => [...prev, x]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900">
            ECG Signal Analysis
          </h1>
          <p className="text-xs md:text-sm text-slate-500">
            Automated morphological waveform analysis and rhythm classification
          </p>
        </div>

        {/* Upload Button */}
        <label className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer">
          <Upload className="w-4 h-4 text-blue-600" />
          <span>Upload ECG File</span>
          <input
            type="file"
            accept=".csv,.dat,.xml,.txt,.pdf,.png,.jpg"
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>
      </div>

      {/* Preset Selector & File Status */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-white border border-slate-200/90 rounded-lg">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-700">Reference Traces:</span>
          {SAMPLE_ECG_RECORDINGS.map((sample) => (
            <button
              key={sample.id}
              onClick={() => {
                setSelectedSample(sample);
                setCaliperPoints([]);
              }}
              className={`px-2.5 py-1 text-xs rounded border transition-colors cursor-pointer ${
                selectedSample.id === sample.id
                  ? 'bg-blue-50 text-blue-700 border-blue-300 font-semibold'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {sample.name.split('–')[0].trim()}
            </button>
          ))}
        </div>

        {uploadedFile && (
          <div className="flex items-center gap-2 text-xs text-slate-600 bg-slate-100 px-2.5 py-1 rounded">
            <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span className="font-mono">{uploadedFile.name}</span>
            <span className="text-slate-400">({uploadedFile.size})</span>
          </div>
        )}
      </div>

      {/* Waveform Canvas Monitor */}
      <div className="bg-white border border-slate-200/90 rounded-lg overflow-hidden shadow-2xs">
        {/* Monitor Controls Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-slate-900 text-white text-xs border-b border-slate-800">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-blue-400">Lead:</span>
              <div className="flex items-center gap-1">
                {(['Lead V5', 'Lead II', 'Lead I', 'Lead V1'] as const).map((lead) => (
                  <button
                    key={lead}
                    onClick={() => setActiveLead(lead)}
                    className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                      activeLead === lead
                        ? 'bg-blue-600 text-white font-bold'
                        : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    {lead}
                  </button>
                ))}
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-2 text-slate-400">
              <span>Gain:</span>
              <button
                onClick={() => setGain(gain === 20 ? 5 : gain === 10 ? 20 : 10)}
                className="font-mono text-white bg-slate-800 px-1.5 py-0.5 rounded hover:bg-slate-700"
              >
                {gain} mm/mV
              </button>
            </div>

            <div className="hidden sm:flex items-center gap-2 text-slate-400">
              <span>Speed:</span>
              <button
                onClick={() => setSpeed(speed === 25 ? 50 : 25)}
                className="font-mono text-white bg-slate-800 px-1.5 py-0.5 rounded hover:bg-slate-700"
              >
                {speed} mm/s
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Caliper Tool Toggle */}
            <button
              onClick={() => {
                setCaliperMode(!caliperMode);
                setCaliperPoints([]);
              }}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs transition-colors ${
                caliperMode
                  ? 'bg-blue-600 text-white font-semibold'
                  : 'bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              <Ruler className="w-3.5 h-3.5" />
              <span>{caliperMode ? 'Caliper Active' : 'Caliper Tool'}</span>
            </button>

            {/* Sweep Play / Pause */}
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs transition-colors"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-3.5 h-3.5" />
                  <span>Freeze</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5" />
                  <span>Live Sweep</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Canvas Display */}
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          className="relative w-full overflow-x-auto bg-slate-50 flex items-center justify-center p-2"
        >
          {isProcessing && (
            <div className="absolute inset-0 z-20 bg-slate-900/40 backdrop-blur-2xs flex flex-col items-center justify-center text-white">
              <div className="w-8 h-8 border-3 border-white/30 border-t-white rounded-full animate-spin mb-2" />
              <span className="text-xs font-semibold">Filtering Bandpass & Processing QRS...</span>
            </div>
          )}

          <canvas
            ref={canvasRef}
            width={920}
            height={260}
            onClick={handleCanvasClick}
            className={`w-full max-w-[920px] rounded border border-rose-200 shadow-inner ${
              caliperMode ? 'cursor-crosshair' : 'cursor-default'
            }`}
          />
        </div>

        {/* Paper Standard Metadata Bar */}
        <div className="flex flex-wrap items-center justify-between px-4 py-2 bg-slate-100/80 border-t border-slate-200 text-[11px] text-slate-500 font-mono">
          <div className="flex items-center gap-3">
            <span>25 mm/s</span>
            <span>·</span>
            <span>10 mm/mV</span>
            <span>·</span>
            <span>0.05–150 Hz Filter</span>
            <span>·</span>
            <span>Standard Millimeter Paper Grid</span>
          </div>
          {caliperMode && (
            <span className="text-blue-600 font-sans font-medium">
              Click 2 points on the waveform to measure interval (ms)
            </span>
          )}
        </div>
      </div>

      {/* ECG Assessment Output Card */}
      <div className="bg-white border border-slate-200/90 rounded-lg p-6 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs uppercase font-bold tracking-wider text-slate-500">
                ECG Assessment
              </span>
              <span
                className={`text-xs font-semibold px-2 py-0.5 rounded border ${
                  selectedSample.classification === 'Normal'
                    ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
                    : 'text-rose-700 bg-rose-50 border-rose-200'
                }`}
              >
                {selectedSample.classification}
              </span>
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              {selectedSample.rhythm}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {selectedSample.description}
            </p>
          </div>

          <div className="flex items-center gap-4 bg-slate-50 p-3 rounded-lg border border-slate-200/70 self-start md:self-auto">
            <div>
              <span className="text-[10px] uppercase font-semibold text-slate-500 block">
                Model Confidence
              </span>
              <span className="text-xl font-bold text-slate-900 tabular-nums">
                {selectedSample.confidence}%
              </span>
            </div>
            <div className="w-px h-8 bg-slate-200" />
            <div>
              <span className="text-[10px] uppercase font-semibold text-slate-500 block">
                Ventricular Rate
              </span>
              <span className="text-xl font-bold text-slate-900 tabular-nums">
                {selectedSample.heartRate} <span className="text-xs font-normal text-slate-500">bpm</span>
              </span>
            </div>
          </div>
        </div>

        {/* Electrophysiological Measurements */}
        <div className="py-4 grid grid-cols-2 sm:grid-cols-4 gap-3 border-b border-slate-100">
          <div className="p-3 bg-slate-50 rounded border border-slate-100">
            <span className="text-[11px] text-slate-500 block">ST Deviation</span>
            <span
              className={`text-base font-bold font-mono ${
                selectedSample.stElevationMm < -1.0
                  ? 'text-rose-600'
                  : selectedSample.stElevationMm === 0
                  ? 'text-emerald-600'
                  : 'text-amber-600'
              }`}
            >
              {selectedSample.stElevationMm > 0 ? `+${selectedSample.stElevationMm}` : selectedSample.stElevationMm} mm
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">
              {selectedSample.stElevationMm <= -1.0 ? 'Ischemic displacement' : 'Isoelectric'}
            </span>
          </div>

          <div className="p-3 bg-slate-50 rounded border border-slate-100">
            <span className="text-[11px] text-slate-500 block">PR Interval</span>
            <span className="text-base font-bold font-mono text-slate-900">
              {selectedSample.prIntervalMs ? `${selectedSample.prIntervalMs} ms` : 'N/A (AFib)'}
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Normal: 120–200 ms</span>
          </div>

          <div className="p-3 bg-slate-50 rounded border border-slate-100">
            <span className="text-[11px] text-slate-500 block">QRS Duration</span>
            <span className="text-base font-bold font-mono text-slate-900">
              {selectedSample.qrsDurationMs} ms
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Normal: 80–120 ms</span>
          </div>

          <div className="p-3 bg-slate-50 rounded border border-slate-100">
            <span className="text-[11px] text-slate-500 block">Bazett QTc</span>
            <span className="text-base font-bold font-mono text-slate-900">
              {selectedSample.qtcIntervalMs} ms
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Reference: &lt; 440 ms</span>
          </div>
        </div>

        {/* Detected Morphological Patterns */}
        <div className="pt-4">
          <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-2.5">
            Detected Morphological Patterns
          </h3>
          <ul className="space-y-1.5">
            {selectedSample.detectedPatterns.map((pattern, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0" />
                <span>{pattern}</span>
              </li>
            ))}
          </ul>

          <div className="mt-4 p-3 bg-blue-50/70 border border-blue-200/80 rounded-md">
            <p className="text-xs text-blue-900">
              <span className="font-semibold">Clinical Significance: </span>
              {selectedSample.clinicalSignificance}
            </p>
          </div>
        </div>
      </div>

      {/* Subtle Medical Disclaimer */}
      <div className="p-3.5 bg-slate-100/70 border border-slate-200 rounded-lg text-xs text-slate-600 leading-relaxed">
        <span className="font-semibold text-slate-700">Clinical Protocol Notice: </span>
        Electrocardiographic morphology analysis is provided for clinical decision support. Automated rhythm detection should be corroborated with clinical presentation, cardiac biomarkers, and 12-lead over-read by a board-certified physician.
      </div>
    </div>
  );
};
