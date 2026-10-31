import React, { useState, useEffect, useMemo } from 'react';
import { 
  BookOpen, 
  Smile, 
  Meh, 
  Frown, 
  Save, 
  Copy, 
  Check, 
  Download, 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Clock, 
  Tag, 
  CheckSquare, 
  Square,
  Sparkles,
  Volume2,
  VolumeX,
  FileText
} from 'lucide-react';
import { useArchive } from '../context/ArchiveContext';

export function DailyLogView() {
  const { dailyLogs = [], saveDailyLog, actions = [], entries = [] } = useArchive();

  const [selectedDate, setSelectedDate] = useState('09 MAY 2025');
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'week'
  const [ambientAudio, setAmbientAudio] = useState('off'); // 'off' | 'clockwork' | 'rain'

  // Default seeded archival notes
  const initialLogsMap = {
    '09 MAY 2025': {
      title: 'Database Architecture & Record Inspector Synthesis',
      note: `Started working on the database structure and record model for Athenaeum. Feeling focused and productive.

Today's Primary Accomplishments:
- Completed the 11-view architecture with dedicated archival modules.
- Refined the IBM Plex Mono typographic scale and classic Cormorant Garamond numerals.
- Established strict 1px border grid system across all primary and secondary panels.

Next focus session will review the 1884 hydrographic soundings for the Limehouse Basin and finalize the cartographic registry.`,
      mood: 3, // 3 = solid filled flow face ☻
      energy: 72,
      tags: ['architecture', 'database', 'cormorant', 'hydrography'],
      accomplishments: [
        { text: 'Finalize 11-view workspace routing', done: true },
        { text: 'Harmonize Overview metrics grid proportions', done: true },
        { text: 'Implement Local IndexedDB bidirectional sync', done: true },
        { text: 'Review 1884 Thames soundings folio', done: false }
      ],
      nextFocus: 'Calibrate optical rangefinder and register East London dock maps.'
    },
    '08 MAY 2025': {
      title: 'Victorian Dock Worker Oral History Transcripts',
      note: `Spent 4 hours reviewing Victorian dock worker oral transcripts. The detail regarding the coal colliers arriving from Newcastle was remarkable.

Mood remained stable despite long sessions. Switched to rangefinder photography in the evening to reset visual focus.`,
      mood: 2, // 2 = content smile ☺
      energy: 65,
      tags: ['history', 'transcripts', 'east-london', 'photography'],
      accomplishments: [
        { text: 'Transcribe 3 audio cylinders from 1892', done: true },
        { text: 'Catalog Newcastle coal route logs', done: true },
        { text: 'Archive photographic negative plates', done: false }
      ],
      nextFocus: 'Structure record schema for oral history narratives.'
    },
    '07 MAY 2025': {
      title: 'Morphological Plates: Speculative Arthropod Folio',
      note: `Finalized the biological plates for the speculative arthropod morphology folio. The wing articulation mechanism in Figure IV resolved the balance issue.

Line weights calibrated to 0.75px stroke in accordance with botanical engraving standards.`,
      mood: 3,
      energy: 80,
      tags: ['morphology', 'specimens', 'engraving', 'folio'],
      accomplishments: [
        { text: 'Render anatomical plate IV venation', done: true },
        { text: 'Calibrate proportion guide circle', done: true },
        { text: 'Print test proof on 160gsm archival laid paper', done: true }
      ],
      nextFocus: 'Commence Herbarium botanical taxonomy illustrations.'
    },
    '06 MAY 2025': {
      title: 'Optical Astrolabe Reconstruction Schematics',
      note: `Calibrated the inclination of the ecliptic zodiac band to 23.5 degrees. All degree tick marks align with the outer meridian circle.`,
      mood: 2,
      energy: 58,
      tags: ['astronomy', 'astrolabe', 'mathematics'],
      accomplishments: [
        { text: 'Calculate armillary declination arcs', done: true },
        { text: 'Align sight alidade rule with polar axis pin', done: true }
      ],
      nextFocus: 'Finalize celestial sphere reticle.'
    },
    '05 MAY 2025': {
      title: 'Monotype Matrices and Punch-Cutting Survey',
      note: `Visited the St. Bride vaults. Reviewed the steel punches cut by Austin in 1796. The contrast in the modern serifs remains razor-sharp.`,
      mood: 2,
      energy: 70,
      tags: ['typography', 'st-bride', 'letterpress'],
      accomplishments: [
        { text: 'Examine 14pt Caslon punch matrices', done: true },
        { text: 'Cross-reference spec books with database catalog', done: true }
      ],
      nextFocus: 'Synthesize typography manifesto for personal archive.'
    }
  };

  const [logsMap, setLogsMap] = useState(initialLogsMap);

  // Sync with context dailyLogs on mount
  useEffect(() => {
    if (dailyLogs && dailyLogs.length > 0) {
      const merged = { ...initialLogsMap };
      dailyLogs.forEach(dl => {
        if (dl.date) {
          merged[dl.date] = {
            ...merged[dl.date],
            ...dl
          };
        }
      });
      setLogsMap(merged);
    }
  }, [dailyLogs]);

  // Current active log object
  const currentLog = useMemo(() => {
    return logsMap[selectedDate] || {
      title: `Observations for ${selectedDate}`,
      note: '',
      mood: 2,
      energy: 70,
      tags: ['journal'],
      accomplishments: [
        { text: 'Review daily actions and logs', done: false }
      ],
      nextFocus: 'Continue ongoing research tasks.'
    };
  }, [logsMap, selectedDate]);

  const [title, setTitle] = useState(currentLog.title || '');
  const [noteText, setNoteText] = useState(currentLog.note || '');
  const [mood, setMood] = useState(currentLog.mood !== undefined ? currentLog.mood : 3);
  const [energy, setEnergy] = useState(currentLog.energy !== undefined ? currentLog.energy : 72);
  const [accomplishments, setAccomplishments] = useState(currentLog.accomplishments || []);
  const [nextFocus, setNextFocus] = useState(currentLog.nextFocus || '');
  const [newTagInput, setNewTagInput] = useState('');
  const [tags, setTags] = useState(currentLog.tags || []);

  // Update local form state when selectedDate changes
  useEffect(() => {
    const log = logsMap[selectedDate] || {
      title: `Observations for ${selectedDate}`,
      note: '',
      mood: 2,
      energy: 70,
      tags: ['journal'],
      accomplishments: [],
      nextFocus: ''
    };
    setTitle(log.title || '');
    setNoteText(log.note || '');
    setMood(log.mood !== undefined ? log.mood : 3);
    setEnergy(log.energy !== undefined ? log.energy : 72);
    setAccomplishments(log.accomplishments || []);
    setNextFocus(log.nextFocus || '');
    setTags(log.tags || ['journal']);
  }, [selectedDate, logsMap]);

  // Save current log to state and context
  const handleCommit = async () => {
    const updatedRecord = {
      date: selectedDate,
      title,
      note: noteText,
      mood,
      energy,
      tags,
      accomplishments,
      nextFocus,
      updatedAt: Date.now()
    };

    setLogsMap(prev => ({
      ...prev,
      [selectedDate]: updatedRecord
    }));

    if (saveDailyLog) {
      await saveDailyLog(selectedDate, updatedRecord);
    }

    setSaved(true);
    setTimeout(() => setSaved(false), 2200);
  };

  const handleCopyMarkdown = () => {
    const md = `# ATHENÆUM DAILY LOG — ${selectedDate}
**Subject:** ${title}
**Mood:** ${['Low (1)', 'Neutral (2)', 'Content (3)', 'Flow (4)'][mood]} | **Energy:** ${energy}%
**Tags:** ${tags.map(t => `#${t}`).join(' ')}

---

${noteText}

---

### Accomplishments:
${accomplishments.map(a => `- [${a.done ? 'x' : ' '}] ${a.text}`).join('\n')}

### Next Focus:
${nextFocus}
`;
    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportJSON = () => {
    const exportData = {
      date: selectedDate,
      title,
      note: noteText,
      mood,
      energy,
      tags,
      accomplishments,
      nextFocus,
      exportedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `athenaeum_log_${selectedDate.replace(/\s+/g, '_').toLowerCase()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const toggleAccomplishment = (index) => {
    const updated = accomplishments.map((item, idx) => 
      idx === index ? { ...item, done: !item.done } : item
    );
    setAccomplishments(updated);
  };

  const handleAddTag = (e) => {
    if (e.key === 'Enter' && newTagInput.trim()) {
      e.preventDefault();
      const clean = newTagInput.trim().replace(/^#/, '');
      if (!tags.includes(clean)) {
        setTags([...tags, clean]);
      }
      setNewTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const wordCount = noteText.trim().split(/\s+/).filter(Boolean).length;
  const readingTime = Math.max(1, Math.ceil(wordCount / 180));

  const datesList = ['09 MAY 2025', '08 MAY 2025', '07 MAY 2025', '06 MAY 2025', '05 MAY 2025'];

  return (
    <div className="flex-1 flex flex-col h-full bg-[#E9E5D8] overflow-hidden select-none font-mono">
      
      {/* ============================================================ */}
      {/* TOP HEADER: WORKSTATION CONTROLS                             */}
      {/* ============================================================ */}
      <div className="p-3 border-b border-[#B5B3A4] bg-[#DFDBD0] flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 bg-[#4B5E45] inline-block flex-shrink-0" />
          <h1 className="text-xs font-bold uppercase tracking-wider text-[#171714]">
            DAILY LOG &amp; ARCHIVAL CHRONICLE
          </h1>
          <span className="text-[9px] text-[#66655B] tracking-wider">
            (SYS_ID: CHR-{selectedDate.replace(/\s+/g, '-')})
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2">
          {/* Ambient Soundscape Simulator */}
          <button
            onClick={() => {
              const modes = ['off', 'clockwork', 'rain'];
              const next = modes[(modes.indexOf(ambientAudio) + 1) % modes.length];
              setAmbientAudio(next);
            }}
            title="Toggle Focus Soundscape"
            className="px-2 py-1 border border-[#B5B3A4] bg-[#FAF8F3] hover:bg-[#EAE7D9] text-[8px] font-mono text-[#555] flex items-center space-x-1"
          >
            {ambientAudio === 'off' ? <VolumeX className="w-3 h-3 text-[#777]" /> : <Volume2 className="w-3 h-3 text-[#4B5E45]" />}
            <span className="uppercase">{ambientAudio === 'off' ? 'AUDIO: OFF' : `AUDIO: ${ambientAudio}`}</span>
          </button>

          {/* Copy Markdown */}
          <button
            onClick={handleCopyMarkdown}
            className="px-2.5 py-1 border border-[#B5B3A4] bg-[#FAF8F3] hover:bg-[#EAE7D9] text-[8.5px] font-bold text-[#171714] uppercase flex items-center space-x-1 transition-colors"
          >
            {copied ? <Check className="w-3 h-3 text-[#4B5E45]" /> : <Copy className="w-3 h-3 text-[#666]" />}
            <span>{copied ? 'COPIED MD' : 'COPY LOG'}</span>
          </button>

          {/* Export JSON */}
          <button
            onClick={handleExportJSON}
            title="Export archival record as JSON"
            className="px-2.5 py-1 border border-[#B5B3A4] bg-[#FAF8F3] hover:bg-[#EAE7D9] text-[8.5px] font-bold text-[#171714] uppercase flex items-center space-x-1 transition-colors"
          >
            <Download className="w-3 h-3 text-[#666]" />
            <span>EXPORT</span>
          </button>

          {/* Commit Button */}
          <button
            onClick={handleCommit}
            className={`px-3 py-1 text-[8.5px] font-bold uppercase tracking-wider flex items-center space-x-1.5 transition-all shadow-sm ${
              saved 
                ? 'bg-[#3E523A] text-[#FAF8F3]' 
                : 'bg-[#171714] text-[#FAF8F3] hover:bg-black'
            }`}
          >
            {saved ? <Check className="w-3 h-3 text-[#A8D5A3]" /> : <Save className="w-3 h-3" />}
            <span>{saved ? 'COMMITTED TO DB' : 'COMMIT LOG'}</span>
          </button>
        </div>
      </div>

      {/* ============================================================ */}
      {/* DATE SELECTOR NAVIGATOR STRIP                                */}
      {/* ============================================================ */}
      <div className="px-3 py-1.5 border-b border-[#B5B3A4] bg-[#EAE7D9] flex items-center justify-between text-[8px]">
        
        {/* Left: Quick Date Pills */}
        <div className="flex items-center space-x-2">
          <span className="text-[#66655B] uppercase font-bold tracking-wider">CHRONICLE DATE:</span>
          
          <button 
            onClick={() => {
              const idx = datesList.indexOf(selectedDate);
              if (idx < datesList.length - 1) setSelectedDate(datesList[idx + 1]);
            }}
            className="p-1 hover:bg-[#DDD8CB] border border-[#B5B3A4] text-[#444]"
            title="Previous Day"
          >
            <ChevronLeft className="w-2.5 h-2.5" />
          </button>

          {datesList.map(d => {
            const isSel = selectedDate === d;
            const logEntry = logsMap[d];
            return (
              <button
                key={d}
                onClick={() => setSelectedDate(d)}
                className={`px-2 py-0.5 border flex items-center space-x-1.5 transition-all ${
                  isSel
                    ? 'border-[#171714] bg-[#171714] text-[#FAF8F3] font-bold shadow-sm'
                    : 'border-[#B5B3A4] bg-[#FAF8F3] text-[#44433A] hover:bg-[#E5E1D2]'
                }`}
              >
                <span>{d}</span>
                {d === '09 MAY 2025' && <span className="text-[7px] text-[#A8D5A3] font-bold">(TODAY)</span>}
                {logEntry && logEntry.mood !== undefined && (
                  <span className="text-[8px]">
                    {['☹', '😐', '☺', '☻'][logEntry.mood]}
                  </span>
                )}
              </button>
            );
          })}

          <button 
            onClick={() => {
              const idx = datesList.indexOf(selectedDate);
              if (idx > 0) setSelectedDate(datesList[idx - 1]);
            }}
            className="p-1 hover:bg-[#DDD8CB] border border-[#B5B3A4] text-[#444]"
            title="Next Day"
          >
            <ChevronRight className="w-2.5 h-2.5" />
          </button>
        </div>

        {/* Right: Word & Reading Time Telemetry */}
        <div className="flex items-center space-x-3 text-[7.5px] text-[#66655B] font-mono">
          <span>STATUS: <strong className="text-[#3E523A]">INDEXED &amp; VERIFIED</strong></span>
          <span>•</span>
          <span>{wordCount} WORDS</span>
          <span>•</span>
          <span>{readingTime} MIN READ</span>
        </div>
      </div>

      {/* ============================================================ */}
      {/* MAIN THREE-COLUMN WORKSPACE                                  */}
      {/* ============================================================ */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-3 p-3 overflow-hidden">
        
        {/* ------------------------------------------------------------ */}
        {/* COLUMN 1: CHRONICLE ARCHIVE LOGS INDEX (~22% width, col-span-3) */}
        {/* ------------------------------------------------------------ */}
        <div className="lg:col-span-3 border border-[#B5B3A4] bg-[#EAE7D9] flex flex-col justify-between overflow-hidden shadow-sm">
          
          <div>
            {/* Index Header */}
            <div className="p-2.5 pb-2 border-b border-[#B5B3A4] bg-[#DFDBD0] flex items-center justify-between">
              <span className="text-[9px] font-bold uppercase tracking-wider text-[#171714]">
                HISTORICAL INDEX
              </span>
              <span className="text-[7.5px] font-mono text-[#66655B]">
                {datesList.length} ARCHIVES
              </span>
            </div>

            {/* Logs List */}
            <div className="overflow-y-auto divide-y divide-[#D5D1C4] max-h-[calc(100vh-250px)]">
              {datesList.map(d => {
                const log = logsMap[d] || {};
                const isSel = selectedDate === d;
                const moodGlyphs = ['☹', '😐', '☺', '☻'];
                const moodChar = moodGlyphs[log.mood !== undefined ? log.mood : 2];

                return (
                  <div
                    key={d}
                    onClick={() => setSelectedDate(d)}
                    className={`p-2.5 cursor-pointer transition-colors ${
                      isSel 
                        ? 'bg-[#E0DACB] border-l-2 border-l-[#171714]' 
                        : 'hover:bg-[#E4DFC2]/40 bg-[#FAF8F3]/60'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[7.5px] font-mono text-[#66655B] mb-0.5">
                      <span className="font-bold text-[#171714]">{d}</span>
                      <span className="text-[10px] text-[#2E3D2A]">{moodChar}</span>
                    </div>

                    <div className="text-[9px] font-bold text-[#171714] truncate leading-tight">
                      {log.title || 'Untitled Journal Note'}
                    </div>

                    <p className="text-[7.5px] text-[#55544B] line-clamp-2 mt-1 leading-relaxed">
                      {log.note || 'No observations recorded.'}
                    </p>

                    <div className="flex items-center justify-between mt-1.5 pt-1 border-t border-[#E5E1D2] text-[6.5px] font-mono text-[#77766B]">
                      <span>{log.energy || 70}% ENERGY</span>
                      <span>{(log.note || '').trim().split(/\s+/).filter(Boolean).length} WORDS</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Index Footer / Streak */}
          <div className="p-2 border-t border-[#B5B3A4] bg-[#DFDBD0] flex items-center justify-between text-[7.5px] font-mono text-[#55544B]">
            <span className="flex items-center space-x-1">
              <Sparkles className="w-2.5 h-2.5 text-[#738A62]" />
              <strong>5-DAY STREAK</strong>
            </span>
            <span className="text-[#3E523A] font-bold">ACTIVE</span>
          </div>
        </div>

        {/* ------------------------------------------------------------ */}
        {/* COLUMN 2: MANUSCRIPT EDITOR STAGE (~53% width, col-span-6)  */}
        {/* ------------------------------------------------------------ */}
        <div className="lg:col-span-6 border border-[#B5B3A4] bg-[#FAF8F3] flex flex-col justify-between overflow-hidden shadow-sm">
          
          <div className="flex-1 flex flex-col p-3.5 overflow-y-auto">
            
            {/* Editor Meta strip */}
            <div className="flex items-center justify-between pb-2 border-b border-[#B5B3A4] text-[8px] text-[#66655B]">
              <div className="flex items-center space-x-2">
                <span>SUBJECT / HEADING:</span>
              </div>
              <span>REGISTRY TABLE: ATN_DAILY_JOURNAL_DB</span>
            </div>

            {/* Note Subject / Title Input */}
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Journal Entry Title or Main Research Focus..."
              className="w-full text-xs font-bold text-[#171714] bg-transparent border-b border-[#D5D1C4] py-1.5 mt-1 focus:outline-none focus:border-[#171714] placeholder-[#888]"
            />

            {/* Tags Strip */}
            <div className="flex flex-wrap items-center gap-1.5 py-2 border-b border-[#E5E1D2] text-[7.5px]">
              <Tag className="w-2.5 h-2.5 text-[#66655B]" />
              {tags.map(t => (
                <span 
                  key={t}
                  className="bg-[#EAE7D9] border border-[#B5B3A4] px-1.5 py-0.5 text-[#33322B] flex items-center space-x-1 group"
                >
                  <span>#{t}</span>
                  <button 
                    onClick={() => handleRemoveTag(t)}
                    className="text-[#888] hover:text-black ml-0.5"
                  >
                    ×
                  </button>
                </span>
              ))}
              <input
                type="text"
                value={newTagInput}
                onChange={(e) => setNewTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                placeholder="+ tag [Enter]"
                className="bg-transparent text-[7.5px] text-[#555] focus:outline-none w-20 placeholder-[#AAA]"
              />
            </div>

            {/* Narrative Observation Textarea */}
            <div className="flex-1 mt-2 flex flex-col">
              <label className="text-[7.5px] font-bold uppercase tracking-wider text-[#66655B] mb-1">
                PRIMARY LOG NARRATIVE:
              </label>
              <textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                rows={10}
                placeholder="Type daily observations, laboratory notes, synthesis of works, and reflections..."
                className="w-full flex-1 bg-transparent text-[9.5px] font-mono leading-relaxed text-[#171714] focus:outline-none resize-none placeholder-[#999] border-b border-[#D5D1C4] pb-2"
                style={{ lineHeight: '1.7' }}
              />
            </div>

            {/* Accomplishments Checklist Section */}
            <div className="mt-3 pt-2">
              <div className="flex items-center justify-between text-[7.5px] font-bold uppercase tracking-wider text-[#66655B] mb-1.5">
                <span>DAILY ACCOMPLISHMENTS:</span>
                <span>{accomplishments.filter(a => a.done).length} OF {accomplishments.length} VERIFIED</span>
              </div>
              <div className="space-y-1">
                {accomplishments.map((acc, idx) => (
                  <div 
                    key={idx}
                    onClick={() => toggleAccomplishment(idx)}
                    className="flex items-center space-x-2 text-[8px] font-mono text-[#25251F] cursor-pointer hover:bg-[#EAE7D9]/60 p-1 border border-transparent hover:border-[#D5D1C4] rounded-[0.5px] transition-colors"
                  >
                    {acc.done ? (
                      <CheckSquare className="w-3 h-3 text-[#3E523A] flex-shrink-0" />
                    ) : (
                      <Square className="w-3 h-3 text-[#88877B] flex-shrink-0" />
                    )}
                    <span className={acc.done ? 'line-through text-[#66655B]' : 'font-medium'}>
                      {acc.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Next Focus Section */}
            <div className="mt-3 pt-2 border-t border-[#D5D1C4]">
              <label className="block text-[7.5px] font-bold uppercase tracking-wider text-[#66655B] mb-1">
                HORIZON &amp; NEXT ACTIONS:
              </label>
              <input
                type="text"
                value={nextFocus}
                onChange={(e) => setNextFocus(e.target.value)}
                placeholder="What is the single most critical priority for the next session?"
                className="w-full bg-[#EAE7D9]/40 border border-[#B5B3A4] p-1.5 text-[8.5px] text-[#171714] focus:outline-none focus:border-[#171714] placeholder-[#888]"
              />
            </div>
          </div>

          {/* Editor Status Sub-bar */}
          <div className="px-3 py-1.5 bg-[#EAE7D9] border-t border-[#B5B3A4] flex justify-between text-[7.5px] font-mono text-[#55544B]">
            <span>AUTOSAVE: SYNCED TO LOCAL INDEXEDDB</span>
            <span>CHECKSUM: 0x48FA12 • {wordCount} WORDS</span>
          </div>
        </div>

        {/* ------------------------------------------------------------ */}
        {/* COLUMN 3: BIOMETRIC & TELEMETRY TELEMETRY (~25%, col-span-3) */}
        {/* ------------------------------------------------------------ */}
        <div className="lg:col-span-3 border border-[#B5B3A4] bg-[#EAE7D9] p-3 flex flex-col justify-between overflow-y-auto space-y-3 shadow-sm">
          
          <div className="space-y-3">
            {/* Panel Title */}
            <div className="pb-1.5 border-b border-[#B5B3A4] flex items-center justify-between">
              <span className="text-[9px] font-bold uppercase tracking-wider text-[#171714]">
                BIOMETRICS &amp; STATE
              </span>
              <span className="text-[7.5px] text-[#66655B]">SESSION METRICS</span>
            </div>

            {/* 1. Disposition / Mood Matrix */}
            <div className="border border-[#B5B3A4] bg-[#FAF8F3] p-2.5">
              <div className="flex justify-between items-center text-[7.5px] font-bold uppercase tracking-wider text-[#66655B] mb-2">
                <span>FOCUS &amp; DISPOSITION</span>
                <span className="text-[#171714] font-mono font-bold">
                  {['LOW (1)', 'NEUTRAL (2)', 'CONTENT (3)', 'FLOW (4)'][mood]}
                </span>
              </div>
              <div className="grid grid-cols-4 gap-1.5">
                {[
                  { id: 0, label: 'Low', glyph: '☹' },
                  { id: 1, label: 'Neutral', glyph: '😐' },
                  { id: 2, label: 'Content', glyph: '☺' },
                  { id: 3, label: 'Flow', glyph: '☻' }
                ].map(m => {
                  const isSel = mood === m.id;
                  return (
                    <button
                      key={m.id}
                      onClick={() => setMood(m.id)}
                      className={`flex flex-col items-center py-2 px-1 border transition-all ${
                        isSel 
                          ? 'border-[#171714] bg-[#2E3D2A] text-[#FAF8F3] font-bold shadow-sm' 
                          : 'border-[#B5B3A4] bg-[#EAE7D9] text-[#444] hover:bg-[#DDD8CB]'
                      }`}
                    >
                      <span className="text-[13px] leading-none mb-1">{m.glyph}</span>
                      <span className="text-[6.5px] uppercase font-mono tracking-wider">{m.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Cognitive Energy Level (Interactive 10-block battery) */}
            <div className="border border-[#B5B3A4] bg-[#FAF8F3] p-2.5">
              <div className="flex justify-between items-center text-[7.5px] font-bold uppercase tracking-wider text-[#66655B] mb-1.5">
                <span>COGNITIVE ENERGY</span>
                <span 
                  className="text-[14px] font-bold text-[#171714]"
                  style={{ fontFamily: '"Cormorant Garamond", "Newsreader", Georgia, serif' }}
                >
                  {energy}%
                </span>
              </div>
              
              {/* 10-block battery */}
              <div className="flex space-x-1 cursor-pointer">
                {[...Array(10)].map((_, i) => {
                  const isFilled = (i + 1) * 10 <= energy;
                  return (
                    <div
                      key={i}
                      onClick={() => setEnergy((i + 1) * 10)}
                      className={`flex-1 h-3.5 transition-colors rounded-[0.5px] ${
                        isFilled 
                          ? 'bg-[#171714]' 
                          : 'bg-[#DDD8CB] border border-[#B5B3A4]'
                      }`}
                      title={`Set energy to ${(i + 1) * 10}%`}
                    />
                  );
                })}
              </div>
            </div>

            {/* 3. Productivity Telemetry for the Day */}
            <div className="border border-[#B5B3A4] bg-[#FAF8F3] p-2.5 space-y-2 text-[8px] font-mono">
              <span className="font-bold uppercase tracking-wider text-[#66655B] block pb-1 border-b border-[#D5D1C4]">
                DAY PRODUCTIVITY STATS
              </span>
              <div className="flex justify-between items-center">
                <span className="text-[#66655B]">Deep Focus Time:</span>
                <strong className="text-[#171714]">5.4 hrs</strong>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#66655B]">Actions Completed:</span>
                <strong className="text-[#171714]">
                  {actions.filter(a => a.status === 'Completed').length} of {actions.length || 6}
                </strong>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#66655B]">Cataloged Records:</span>
                <strong className="text-[#171714]">{entries.length || 18} entries</strong>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#66655B]">Local Storage Sync:</span>
                <strong className="text-[#3E523A]">OK (12ms)</strong>
              </div>
            </div>

            {/* 4. Archival Dictum / Quote */}
            <div className="border border-[#B5B3A4] bg-[#FAF8F3] p-2.5 text-[7.5px] text-[#55544B] italic font-serif">
              <p className="leading-relaxed">
                "Nulla dies sine linea" — Not a day without a line.
              </p>
              <div className="text-[6.5px] font-mono text-[#888] not-italic mt-1 text-right">
                — Pliny the Elder, Nat. Hist.
              </div>
            </div>
          </div>

          {/* Station metadata footer */}
          <div className="pt-2 border-t border-[#B5B3A4] text-[7px] font-mono text-[#66655B] flex justify-between">
            <span>STATION: DESK_ALPHA_01</span>
            <span>PORT: 5173 UTF-8</span>
          </div>
        </div>

      </div>
    </div>
  );
}

export default DailyLogView;
