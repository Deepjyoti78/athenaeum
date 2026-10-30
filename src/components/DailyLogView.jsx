import React, { useState } from 'react';
import { BookOpen, Smile, Meh, Frown, Save, Copy, Check, Download, Calendar } from 'lucide-react';

export function DailyLogView() {
  const [selectedDate, setSelectedDate] = useState('09 MAY 2025');
  const [mood, setMood] = useState(2); // 0..4
  const [energy, setEnergy] = useState(72);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  const [notesByDate, setNotesByDate] = useState({
    '09 MAY 2025': `Started working on the database structure and record model for Athenaeum. Feeling focused and productive.

Today's Primary Accomplishments:
- Completed the 11-view architecture with dedicated archival modules.
- Refined the IBM Plex Mono typographic scale and classic Cormorant Garamond numerals.
- Established strict 1px border grid system across all primary and secondary panels.

Next focus session will review the 1884 hydrographic soundings for the Limehouse Basin.`,
    '08 MAY 2025': `Spent 4 hours reviewing Victorian dock worker oral transcripts. The detail regarding the coal colliers arriving from Newcastle was remarkable.

Mood remained stable despite long sessions. Switched to rangefinder photography in the evening to reset focus.`,
    '07 MAY 2025': `Finalized the biological plates for the speculative arthropod morphology folio. The wing articulation mechanism in Figure IV resolved the balance issue.`
  });

  const currentText = notesByDate[selectedDate] || '';

  const handleTextChange = (e) => {
    setNotesByDate({
      ...notesByDate,
      [selectedDate]: e.target.value
    });
    setSaved(false);
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(currentText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const wordCount = currentText.trim().split(/\s+/).filter(Boolean).length;

  return (
    <div className="flex-1 flex flex-col h-full bg-[#E9E5D8] overflow-hidden select-none font-mono">
      {/* Header */}
      <div className="p-3 border-b border-[#AAA99B] bg-[#DFDBD0] flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 bg-[#738A62] inline-block"></span>
          <h1 className="text-xs font-bold uppercase tracking-wider text-[#25251F]">
            DAILY LOG &amp; FOCUS WORKSTATION
          </h1>
        </div>

        {/* Action buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handleCopy}
            className="px-2.5 py-1 border border-[#AAA99B] bg-[#FAF8F3] hover:bg-[#E5E0D2] text-[8.5px] font-semibold uppercase flex items-center space-x-1"
          >
            {copied ? <Check className="w-3 h-3 text-[#738A62]" /> : <Copy className="w-3 h-3 text-[#666]" />}
            <span>{copied ? 'COPIED' : 'COPY LOG'}</span>
          </button>
          <button
            onClick={handleSave}
            className="px-3 py-1 bg-[#25251F] text-[#E9E5D8] hover:bg-black text-[8.5px] font-semibold uppercase flex items-center space-x-1"
          >
            {saved ? <Check className="w-3 h-3 text-[#738A62]" /> : <Save className="w-3 h-3" />}
            <span>{saved ? 'SAVED' : 'COMMIT LOG'}</span>
          </button>
        </div>
      </div>

      {/* Date Selector Strip */}
      <div className="px-3 py-1.5 border-b border-[#AAA99B] bg-[#ECE7DC] flex items-center space-x-2 text-[8px]">
        <span className="text-[#77766B] uppercase font-semibold">LOG DATE:</span>
        {['09 MAY 2025', '08 MAY 2025', '07 MAY 2025'].map(d => (
          <button
            key={d}
            onClick={() => setSelectedDate(d)}
            className={`px-2 py-0.5 border ${
              selectedDate === d
                ? 'border-[#25251F] bg-[#25251F] text-[#E9E5D8] font-bold'
                : 'border-[#AAA99B] bg-[#DFDBD0] text-[#55544B] hover:bg-[#D5D1C4]'
            }`}
          >
            {d} {d === '09 MAY 2025' && '(TODAY)'}
          </button>
        ))}
      </div>

      {/* Main Workspace Split */}
      <div className="flex-1 flex min-h-0 overflow-hidden">
        {/* Editor Area */}
        <div className="flex-1 p-4 flex flex-col overflow-y-auto bg-[#FAF8F3]">
          <div className="flex items-center justify-between pb-2 border-b border-[#AAA99B] text-[8px] text-[#77766B]">
            <span>RECORDING TO: ATN_DAILY_JOURNAL_DB</span>
            <span>{wordCount} WORDS • {currentText.length} CHARS</span>
          </div>

          <textarea
            value={currentText}
            onChange={handleTextChange}
            rows={16}
            placeholder="Type daily observations, technical logs, progress notes..."
            className="w-full flex-1 mt-3 bg-transparent text-[10px] font-mono leading-relaxed text-[#25251F] focus:outline-none resize-none"
          />

          <div className="pt-2 border-t border-[#D5D1C4] flex justify-between text-[7.5px] text-[#77766B]">
            <span>AUTOSAVE: ACTIVE</span>
            <span>CHECKSUM: 0x48FA12</span>
          </div>
        </div>

        {/* Right Metrics & State Panel */}
        <div className="w-72 border-l border-[#AAA99B] bg-[#E9E5D8] p-3 flex flex-col justify-between overflow-y-auto">
          <div className="space-y-4">
            {/* Mood / Focus Rating */}
            <div className="border border-[#AAA99B] bg-[#FAF8F3] p-2.5 space-y-2">
              <span className="text-[8px] font-bold uppercase tracking-wider text-[#666]">
                FOCUS &amp; DISPOSITION
              </span>
              <div className="flex items-center justify-between pt-1">
                {[
                  { id: 0, label: 'Low', icon: Frown },
                  { id: 1, label: 'Neutral', icon: Meh },
                  { id: 2, label: 'Focused', icon: Smile },
                ].map(m => {
                  const Icon = m.icon;
                  const isSel = mood === m.id;
                  return (
                    <button
                      key={m.id}
                      onClick={() => setMood(m.id)}
                      className={`flex flex-col items-center p-1.5 border transition-all ${
                        isSel
                          ? 'border-[#25251F] bg-[#25251F] text-[#E9E5D8] font-bold'
                          : 'border-[#AAA99B] bg-[#DFDBD0] text-[#666] hover:bg-[#D5D1C4]'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-[6.5px] mt-1 uppercase">{m.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Energy Meter */}
            <div className="border border-[#AAA99B] bg-[#FAF8F3] p-2.5 space-y-2">
              <div className="flex justify-between items-center text-[8px] font-bold uppercase text-[#666]">
                <span>ENERGY LEVEL</span>
                <span className="text-[#25251F] font-mono">{energy}%</span>
              </div>
              <div className="flex space-x-1 cursor-pointer">
                {[...Array(10)].map((_, i) => (
                  <div
                    key={i}
                    onClick={() => setEnergy((i + 1) * 10)}
                    className={`flex-1 h-3 transition-colors ${
                      (i + 1) * 10 <= energy
                        ? 'bg-[#25251F]'
                        : 'bg-[#DDD8CB] border border-[#AAA99B]'
                    }`}
                    title={`${(i + 1) * 10}%`}
                  />
                ))}
              </div>
            </div>

            {/* Daily Stats */}
            <div className="border border-[#AAA99B] bg-[#FAF8F3] p-2.5 space-y-1.5 text-[8px]">
              <span className="font-bold uppercase tracking-wider text-[#666] block pb-1 border-b border-[#D5D1C4]">
                DAY METRICS
              </span>
              <div className="flex justify-between text-[#555]">
                <span>Focus Hours:</span>
                <strong className="text-[#25251F]">5.4 hrs</strong>
              </div>
              <div className="flex justify-between text-[#555]">
                <span>Completed Tasks:</span>
                <strong className="text-[#25251F]">3 of 6</strong>
              </div>
              <div className="flex justify-between text-[#555]">
                <span>Cataloged Records:</span>
                <strong className="text-[#25251F]">18 entries</strong>
              </div>
              <div className="flex justify-between text-[#555]">
                <span>Database Sync:</span>
                <strong className="text-[#738A62]">OK (24ms)</strong>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-[#D5D1C4] text-[7.5px] text-[#77766B]">
            <span>STATION: WORKSPACE_DESK_01</span>
          </div>
        </div>
      </div>
    </div>
  );
}

