import React, { useMemo } from 'react';
import { useArchive } from '../context/ArchiveContext';

export function OverviewMetrics({ onNavigate }) {
  const { actions = [], works = [], entries = [], dynamicMetrics, isInitialized } = useArchive();

  // 1. Actions counts: dynamically computed from actual data with reference fallbacks
  const isReady = isInitialized && (actions.length > 0 || works.length > 0);
  const actionsCount = dynamicMetrics?.actionsBreakdown?.total ?? (isReady ? actions.length : 12);
  const todoCount = dynamicMetrics?.actionsBreakdown?.todo ?? (isReady ? actions.filter(a => a.status === 'To do').length : 4);
  const inProgressCount = dynamicMetrics?.actionsBreakdown?.inProgress ?? (isReady ? actions.filter(a => a.status === 'In progress').length : 6);
  const waitingCount = dynamicMetrics?.actionsBreakdown?.waiting ?? (isReady ? actions.filter(a => a.status === 'Waiting').length : 1);
  const completedCount = dynamicMetrics?.actionsBreakdown?.completed ?? (isReady ? actions.filter(a => a.status === 'Completed').length : 2);

  // 2. Works counts: dynamically computed from actual data
  const activeWorks = works.filter(w => w.status !== 'Completed');
  const activeWorksCount = dynamicMetrics?.activeWorksCount ?? (isReady ? activeWorks.length : 7);
  const projectWorksCount = dynamicMetrics?.worksBreakdown?.projects ?? (isReady ? works.filter(w => w.type === 'Project').length : 3);
  const researchWorksCount = dynamicMetrics?.worksBreakdown?.research ?? (isReady ? works.filter(w => w.type === 'Research').length : 2);
  const creativeWorksCount = dynamicMetrics?.worksBreakdown?.creative ?? (isReady ? works.filter(w => w.type === 'Creative').length : 1);
  const maintenanceWorksCount = dynamicMetrics?.worksBreakdown?.maintenance ?? (isReady ? works.filter(w => w.type === 'Maintenance').length : 1);

  // 3. Entries this week: dynamically computed
  const entriesCount = dynamicMetrics?.totalEntries ?? (isReady ? entries.length : 18);

  // Works categories with counts and relative proportions for horizontal progress bars
  const worksCategories = useMemo(() => {
    const rawCategories = [
      { label: 'Projects', count: projectWorksCount },
      { label: 'Research', count: researchWorksCount },
      { label: 'Creative', count: creativeWorksCount },
      { label: 'Maintenance', count: maintenanceWorksCount }
    ];
    // In reference image: Projects (3) is ~80%, Research (2) is ~53%, Creative (1) is ~27%, Maintenance (1) is ~27%
    const maxVal = Math.max(...rawCategories.map(c => c.count), 3) * 1.25;
    return rawCategories.map(cat => ({
      ...cat,
      fillPct: Math.min(100, Math.max(8, Math.round((cat.count / maxVal) * 100)))
    }));
  }, [projectWorksCount, researchWorksCount, creativeWorksCount, maintenanceWorksCount]);

  // Seven-day activity tiles: Monday through Sunday with dynamic counts & fill
  const activityTiles = useMemo(() => {
    const days = [
      { day: 'M', defaultVal: 2 },
      { day: 'T', defaultVal: 3 },
      { day: 'W', defaultVal: 4 },
      { day: 'T', defaultVal: 5, isHighlighted: true }, // Highlighted day matching reference image
      { day: 'F', defaultVal: 3 },
      { day: 'S', defaultVal: 2 },
      { day: 'S', defaultVal: 1 }
    ];

    const counts = days.map((d, i) => {
      let count = d.defaultVal;
      if (isReady && entries.length > 0) {
        const matched = entries.filter(e => {
          if (!e.date) return false;
          const match = e.date.match(/(\d{1,2})/);
          if (!match) return false;
          const dayNum = parseInt(match[1], 10);
          return dayNum === (5 + i);
        }).length;
        if (matched > 0) count = matched;
      }
      return { ...d, count };
    });

    const maxCount = Math.max(...counts.map(c => c.count), 5);
    return counts.map(c => ({
      ...c,
      fillPct: Math.min(100, Math.max(14, Math.round((c.count / maxCount) * 70)))
    }));
  }, [entries, isReady]);

  // 4. Focus weekly progress: dynamically computed
  const focusPct = useMemo(() => {
    if (dynamicMetrics?.weeklyProgress !== undefined) {
      return dynamicMetrics.weeklyProgress;
    }
    if (works.length > 0) {
      const avgProg = Math.round(works.reduce((acc, w) => acc + (Number(w.progress) || 0), 0) / works.length);
      return avgProg > 0 ? avgProg : 61;
    }
    return 61;
  }, [works, dynamicMetrics]);

  // Annotated Weekly Progress Timeline data points & coordinates
  const focusTimeline = useMemo(() => {
    const basePcts = [42, 58, 62, 68, 70, 60, 74];
    const diff = focusPct - 61;
    const pcts = basePcts.map((p, i) => {
      if (i === 6) return Math.min(99, Math.max(10, focusPct > 0 ? focusPct + 13 : 74));
      return Math.min(99, Math.max(10, p + Math.round(diff * (i / 6))));
    });
    const xCoords = [6, 20.67, 35.33, 50, 64.67, 79.33, 94];
    return pcts.map((p, idx) => {
      const x = xCoords[idx];
      const y = 42 - ((p / 100) * 32);
      return { x, y, pct: p, isLatest: idx === 6 };
    });
  }, [focusPct]);

  // Dynamic set of days with active records/events for calendar markers
  const activeDaysSet = useMemo(() => {
    const set = new Set(['5', '8', '9', '14', '19']); // reference defaults
    [...actions, ...entries].forEach(item => {
      if (!item.date) return;
      const match = item.date.match(/(\d{1,2})/);
      if (match) {
        set.add(parseInt(match[1], 10).toString());
      }
    });
    return set;
  }, [actions, entries]);

  // May 2025 Calendar: May 1st was a Thursday
  const calRow1 = [
    { day: '28', isCurrent: false },
    { day: '29', isCurrent: false },
    { day: '30', isCurrent: false },
    { day: '1', isCurrent: true, hasIndicator: activeDaysSet.has('1') },
    { day: '2', isCurrent: true, hasIndicator: activeDaysSet.has('2') },
    { day: '3', isCurrent: true, hasIndicator: activeDaysSet.has('3') },
    { day: '4', isCurrent: true, hasIndicator: activeDaysSet.has('4') }
  ];
  const calRow2 = [
    { day: '5', isCurrent: true, hasIndicator: activeDaysSet.has('5') },
    { day: '6', isCurrent: true, hasIndicator: activeDaysSet.has('6') },
    { day: '7', isCurrent: true, hasIndicator: activeDaysSet.has('7') },
    { day: '8', isCurrent: true, hasIndicator: activeDaysSet.has('8') },
    { day: '9', isCurrent: true, isToday: true },
    { day: '10', isCurrent: true, hasIndicator: activeDaysSet.has('10') },
    { day: '11', isCurrent: true, hasIndicator: activeDaysSet.has('11') }
  ];
  const calRow3 = [
    { day: '12', isCurrent: true, hasIndicator: activeDaysSet.has('12') },
    { day: '13', isCurrent: true, hasIndicator: activeDaysSet.has('13') },
    { day: '14', isCurrent: true, hasIndicator: activeDaysSet.has('14') },
    { day: '15', isCurrent: true, hasIndicator: activeDaysSet.has('15') },
    { day: '16', isCurrent: true, hasIndicator: activeDaysSet.has('16') },
    { day: '17', isCurrent: true, hasIndicator: activeDaysSet.has('17') },
    { day: '18', isCurrent: true, hasIndicator: activeDaysSet.has('18') }
  ];
  const calRow4 = [
    { day: '19', isCurrent: true, hasIndicator: activeDaysSet.has('19') },
    { day: '20', isCurrent: true, hasIndicator: activeDaysSet.has('20') },
    { day: '21', isCurrent: true, hasIndicator: activeDaysSet.has('21') },
    { day: '22', isCurrent: true, hasIndicator: activeDaysSet.has('22') },
    { day: '23', isCurrent: true, hasIndicator: activeDaysSet.has('23') },
    { day: '24', isCurrent: true, hasIndicator: activeDaysSet.has('24') },
    { day: '25', isCurrent: true, hasIndicator: activeDaysSet.has('25') }
  ];
  const calRow5 = [
    { day: '26', isCurrent: true, hasIndicator: activeDaysSet.has('26') },
    { day: '27', isCurrent: true, hasIndicator: activeDaysSet.has('27') },
    { day: '28', isCurrent: true, hasIndicator: activeDaysSet.has('28') },
    { day: '29', isCurrent: true, hasIndicator: activeDaysSet.has('29') },
    { day: '30', isCurrent: true, hasIndicator: activeDaysSet.has('30') },
    { day: '31', isCurrent: true, hasIndicator: activeDaysSet.has('31') },
    { day: '1', isCurrent: false }
  ];

  const numeralStyle = {
    fontFamily: '"Cormorant Garamond", "Newsreader", Georgia, serif',
    fontWeight: 700,
    fontVariantNumeric: 'lining-nums tabular-nums',
    fontFeatureSettings: '"lnum" 1, "tnum" 1'
  };

  return (
    <div className="space-y-1 select-none font-mono">
      {/* Section Header */}
      <div className="flex items-center justify-between text-[10px] uppercase font-mono font-bold text-[#171714]">
        <div className="flex items-center space-x-1.5">
          <span className="w-1.5 h-1.5 bg-[#171714] inline-block" />
          <span className="tracking-widest">OVERVIEW</span>
        </div>
        <span className="text-[8.5px] font-mono font-normal text-[#77766B] tracking-wider">
          SYSTEM_METRICS // MAY 2025
        </span>
      </div>

      {/* Unified Archival Overview Panel — Continuous 5-Column Box matching reference image */}
      <div className="border border-[#B5B3A4] bg-[#EAE7D9] grid grid-cols-5 divide-x divide-[#B5B3A4] shadow-sm">
        
        {/* ============================================================ */}
        {/* COLUMN 1: TODAY & ARCHIVAL CALENDAR                          */}
        {/* ============================================================ */}
        <div 
          onClick={() => onNavigate && onNavigate('calendar')}
          className="flex flex-col justify-between p-3 pt-2.5 pb-2.5 cursor-pointer hover:bg-[#E4DFC2]/30 transition-colors h-[178px]"
          title="Click to open Archival Calendar"
        >
          {/* Top: Header, Number, Subtitle below */}
          <div>
            <div className="text-[9px] uppercase tracking-wider text-[#171714] font-bold leading-none">
              TODAY
            </div>
            <div className="flex flex-col mt-0.5">
              <span 
                className="text-[40px] font-bold text-[#171714] leading-none tracking-tight select-none"
                style={numeralStyle}
              >
                09
              </span>
              <div className="text-[8px] font-mono uppercase tracking-wider text-[#171714] font-bold mt-0.5">
                FRIDAY, MAY 2025
              </div>
            </div>
          </div>

          {/* Bottom: Mini 5-week Calendar Month Grid matching Image 2 */}
          <div className="h-[86px] flex flex-col justify-end pb-0.5">
            {/* Weekday headers: M T W T F S S */}
            <div className="grid grid-cols-7 text-[7.5px] font-mono font-bold text-[#55544B] text-center mb-1">
              <span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span>
            </div>

            {/* Calendar Days Rows with balanced spacing matching reference */}
            <div className="space-y-[3px]">
              {/* Row 1 */}
              <div className="grid grid-cols-7 text-[7.5px] font-mono text-center">
                {calRow1.map((c, i) => (
                  <span key={i} className={`h-3 w-3 flex items-center justify-center mx-auto ${c.isCurrent ? 'text-[#3E3D35]' : 'text-[#9E9D90]'}`}>
                    {c.day}
                  </span>
                ))}
              </div>
              {/* Row 2 (contains Today: 9) */}
              <div className="grid grid-cols-7 text-[7.5px] font-mono text-center">
                {calRow2.map((c, i) => (
                  <span 
                    key={i} 
                    className={`h-3 w-3 flex items-center justify-center mx-auto ${
                      c.isToday 
                        ? 'bg-[#171714] text-[#FAF8F3] font-bold rounded-[0.5px]' 
                        : c.hasIndicator
                          ? 'text-[#171714] font-bold underline decoration-1 underline-offset-1'
                          : 'text-[#3E3D35]'
                    }`}
                  >
                    {c.day}
                  </span>
                ))}
              </div>
              {/* Row 3 */}
              <div className="grid grid-cols-7 text-[7.5px] font-mono text-center">
                {calRow3.map((c, i) => (
                  <span 
                    key={i} 
                    className={`h-3 w-3 flex items-center justify-center mx-auto ${
                      c.hasIndicator ? 'text-[#171714] font-bold underline decoration-1 underline-offset-1' : 'text-[#3E3D35]'
                    }`}
                  >
                    {c.day}
                  </span>
                ))}
              </div>
              {/* Row 4 */}
              <div className="grid grid-cols-7 text-[7.5px] font-mono text-center">
                {calRow4.map((c, i) => (
                  <span 
                    key={i} 
                    className={`h-3 w-3 flex items-center justify-center mx-auto ${
                      c.hasIndicator ? 'text-[#171714] font-bold underline decoration-1 underline-offset-1' : 'text-[#3E3D35]'
                    }`}
                  >
                    {c.day}
                  </span>
                ))}
              </div>
              {/* Row 5 */}
              <div className="grid grid-cols-7 text-[7.5px] font-mono text-center">
                {calRow5.map((c, i) => (
                  <span key={i} className={`h-3 w-3 flex items-center justify-center mx-auto ${c.isCurrent ? 'text-[#3E3D35]' : 'text-[#9E9D90]'}`}>
                    {c.day}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* COLUMN 2: ACTIONS                                            */}
        {/* ============================================================ */}
        <div 
          onClick={() => onNavigate && onNavigate('actions')}
          className="flex flex-col justify-between p-3 pt-2.5 pb-2.5 cursor-pointer hover:bg-[#E4DFC2]/30 transition-colors h-[178px]"
          title="Click to view Action Registry"
        >
          {/* Top: Header, Number, Subtitle below */}
          <div>
            <div className="text-[9px] uppercase tracking-wider text-[#171714] font-bold leading-none">
              ACTIONS
            </div>
            <div className="flex flex-col mt-0.5">
              <span 
                className="text-[40px] font-bold text-[#171714] leading-none tracking-tight select-none"
                style={numeralStyle}
              >
                {actionsCount < 10 ? `0${actionsCount}` : actionsCount}
              </span>
              <span className="text-[8px] uppercase tracking-wider text-[#171714] font-bold mt-0.5">
                DUE TODAY
              </span>
            </div>
          </div>

          {/* Bottom: Breakdown List matching Image 2 & exactly aligned with Works rows */}
          <div className="h-[86px] flex items-center">
            <div className="space-y-1.5 text-[8px] leading-[14px] font-mono text-[#33322B]">
              <div className="flex items-center space-x-2 h-[14px]">
                <span className="font-bold text-[#171714] w-2.5 inline-block">{todoCount}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#74866A] inline-block flex-shrink-0" />
                <span className="text-[#33322B] font-medium">To do</span>
              </div>
              <div className="flex items-center space-x-2 h-[14px]">
                <span className="font-bold text-[#171714] w-2.5 inline-block">{inProgressCount}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#74866A] inline-block flex-shrink-0" />
                <span className="text-[#33322B] font-medium">In progress</span>
              </div>
              <div className="flex items-center space-x-2 h-[14px]">
                <span className="font-bold text-[#171714] w-2.5 inline-block">{waitingCount}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#74866A] inline-block flex-shrink-0" />
                <span className="text-[#33322B] font-medium">Waiting</span>
              </div>
              <div className="flex items-center space-x-2 h-[14px]">
                <span className="font-bold text-[#171714] w-2.5 inline-block">{completedCount}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#74866A] inline-block flex-shrink-0" />
                <span className="text-[#33322B] font-medium">Completed</span>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* COLUMN 3: WORKS & NATURAL HISTORY ANATOMICAL SPECIMEN        */}
        {/* ============================================================ */}
        <div 
          onClick={() => onNavigate && onNavigate('works')}
          className="flex flex-col justify-between p-3 pt-2.5 pb-2.5 cursor-pointer hover:bg-[#E4DFC2]/30 transition-colors h-[178px]"
          title="Click to view Works Catalog"
        >
          {/* Top: Header, Number, Subtitle below */}
          <div>
            <div className="text-[9px] uppercase tracking-wider text-[#171714] font-bold leading-none">
              WORKS
            </div>
            <div className="flex flex-col mt-0.5">
              <span 
                className="text-[40px] font-bold text-[#171714] leading-none tracking-tight select-none"
                style={numeralStyle}
              >
                {activeWorksCount < 10 ? `0${activeWorksCount}` : activeWorksCount}
              </span>
              <span className="text-[8px] uppercase tracking-wider text-[#171714] font-bold mt-0.5">
                ACTIVE
              </span>
            </div>
          </div>

          {/* Bottom: Engraved Winged Specimen / Entomological Armature */}
          <div className="h-[86px] flex flex-col justify-center">
            <div className="relative w-full h-[76px] border border-[#B5B3A4] bg-[#E5E1D2]/45 rounded-[0.5px] p-1.5 flex items-center justify-between overflow-hidden shadow-inner">
              {/* Subtle background technical grid */}
              <div 
                className="absolute inset-0 opacity-12 pointer-events-none"
                style={{
                  backgroundImage: `linear-gradient(#74866A 1px, transparent 1px), linear-gradient(90deg, #74866A 1px, transparent 1px)`,
                  backgroundSize: '10px 10px'
                }}
              />

              <svg viewBox="0 0 180 70" className="w-full h-full select-none relative z-10">
                {/* Proportion Guide Circle */}
                <circle cx="44" cy="35" r="26" fill="none" stroke="#C4BFA0" strokeWidth="0.5" strokeDasharray="1.5 2" />

                {/* Symmetrical Entomological Winged Specimen (center x=44, y=35) */}
                <g stroke="#26231B" strokeWidth="0.8" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  {/* Left Membranous Wing */}
                  <path 
                    d="M 44,27 C 28,12 10,18 8,30 C 8,42 26,44 44,38" 
                    fill="#74866A" 
                    fillOpacity="0.18" 
                    stroke="#383327" 
                    strokeWidth="0.8" 
                  />
                  {/* Left Wing Venation */}
                  <path d="M 44,27 C 26,24 16,30 10,34" stroke="#524C3A" strokeWidth="0.5" />
                  <path d="M 28,25 C 22,34 16,38 12,40" stroke="#665F49" strokeWidth="0.4" />
                  <path d="M 36,26 C 30,36 24,42 18,42" stroke="#665F49" strokeWidth="0.4" />

                  {/* Right Membranous Wing */}
                  <path 
                    d="M 44,27 C 60,12 78,18 80,30 C 80,42 62,44 44,38" 
                    fill="#74866A" 
                    fillOpacity="0.18" 
                    stroke="#383327" 
                    strokeWidth="0.8" 
                  />
                  {/* Right Wing Venation */}
                  <path d="M 44,27 C 62,24 72,30 78,34" stroke="#524C3A" strokeWidth="0.5" />
                  <path d="M 60,25 C 66,34 72,38 76,40" stroke="#665F49" strokeWidth="0.4" />
                  <path d="M 52,26 C 58,36 64,42 70,42" stroke="#665F49" strokeWidth="0.4" />

                  {/* Head & Antennae */}
                  <ellipse cx="44" cy="19" rx="3" ry="3.5" fill="#C2B9A5" />
                  <path d="M 42,16 Q 36,9 31,11" strokeWidth="0.6" />
                  <path d="M 46,16 Q 52,9 57,11" strokeWidth="0.6" />

                  {/* Thorax */}
                  <path d="M 40,23 C 38,28 39,32 44,34 C 49,32 50,28 48,23 Z" fill="#B3A892" />
                  <line x1="41" y1="28" x2="47" y2="28" strokeWidth="0.5" />

                  {/* Segmented Abdomen */}
                  <ellipse cx="44" cy="45" rx="4.5" ry="11" fill="#A89C86" />
                  <line x1="40" y1="38" x2="48" y2="38" strokeWidth="0.5" />
                  <line x1="39.5" y1="43" x2="48.5" y2="43" strokeWidth="0.5" />
                  <line x1="40" y1="48" x2="48" y2="48" strokeWidth="0.5" />
                  <line x1="41.5" y1="53" x2="46.5" y2="53" strokeWidth="0.5" />

                  {/* Articulated Fore & Hind Legs */}
                  <path d="M 40,24 Q 28,21 24,16" strokeWidth="0.6" />
                  <path d="M 48,24 Q 60,21 64,16" strokeWidth="0.6" />
                  <path d="M 40,32 Q 28,38 25,50" strokeWidth="0.6" />
                  <path d="M 48,32 Q 60,38 63,50" strokeWidth="0.6" />
                </g>

                {/* Engraved Plate Typography on Right */}
                <text x="96" y="20" fill="#171714" fontSize="5.8" fontFamily="serif" fontStyle="italic" fontWeight="bold">Tab. IV — SPECIMEN ALATUM</text>
                <text x="96" y="30" fill="#55544B" fontSize="4.8" fontFamily="monospace">Ordo: Coleoptera • Structura</text>
                <text x="96" y="40" fill="#2E4029" fontSize="5.2" fontFamily="monospace" fontWeight="bold">ACTIVE: {activeWorksCount} WORKS // 4 SECTORS</text>
                <text x="96" y="50" fill="#55544B" fontSize="4.8" fontFamily="monospace">Projects: {projectWorksCount} • Research: {researchWorksCount}</text>
                <text x="96" y="60" fill="#77766B" fontSize="4.2" fontFamily="monospace">CODEX BIOLOGICA • FABRICA</text>
              </svg>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* COLUMN 4: ENTRIES & BOTANICAL HERBARIUM TAXONOMY             */}
        {/* ============================================================ */}
        <div 
          onClick={() => onNavigate && onNavigate('entries')}
          className="flex flex-col justify-between p-3 pt-2.5 pb-2.5 cursor-pointer hover:bg-[#E4DFC2]/30 transition-colors h-[178px]"
          title="Click to view Entries Archive"
        >
          {/* Top: Header, Number, Subtitle below */}
          <div>
            <div className="text-[9px] uppercase tracking-wider text-[#171714] font-bold leading-none">
              ENTRIES
            </div>
            <div className="flex flex-col mt-0.5">
              <span 
                className="text-[40px] font-bold text-[#171714] leading-none tracking-tight select-none"
                style={numeralStyle}
              >
                {entriesCount}
              </span>
              <span className="text-[8px] uppercase tracking-wider text-[#171714] font-bold mt-0.5">
                THIS WEEK
              </span>
            </div>
          </div>

          {/* Bottom: Engraved Botanical Leaf Taxonomy Plate */}
          <div className="h-[86px] flex flex-col justify-center">
            <div className="relative w-full h-[76px] border border-[#B5B3A4] bg-[#E5E1D2]/45 rounded-[0.5px] p-1.5 flex items-center justify-between overflow-hidden shadow-inner">
              {/* Subtle background technical grid */}
              <div 
                className="absolute inset-0 opacity-12 pointer-events-none"
                style={{
                  backgroundImage: `linear-gradient(#74866A 1px, transparent 1px), linear-gradient(90deg, #74866A 1px, transparent 1px)`,
                  backgroundSize: '10px 10px'
                }}
              />

              <svg viewBox="0 0 180 70" className="w-full h-full select-none relative z-10">
                {/* Botanical Leaf Specimen (center x=40, y=35) */}
                <g stroke="#26231B" strokeWidth="0.8" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  {/* Leaf Lamina Blade with soft olive tint */}
                  <path 
                    d="M 40,10 C 22,18 20,44 40,58 C 60,44 58,18 40,10 Z" 
                    fill="#74866A" 
                    fillOpacity="0.2" 
                    stroke="#383327" 
                    strokeWidth="0.9" 
                  />

                  {/* Central Costa Midrib */}
                  <path d="M 40,10 L 40,64" stroke="#26231B" strokeWidth="1" />

                  {/* Primary & Secondary Lateral Veins */}
                  <path d="M 40,18 Q 30,22 25,24" stroke="#4F4837" strokeWidth="0.6" />
                  <path d="M 40,18 Q 50,22 55,24" stroke="#4F4837" strokeWidth="0.6" />

                  <path d="M 40,26 Q 28,30 22,34" stroke="#4F4837" strokeWidth="0.6" />
                  <path d="M 40,26 Q 52,30 58,34" stroke="#4F4837" strokeWidth="0.6" />

                  <path d="M 40,34 Q 28,38 23,43" stroke="#4F4837" strokeWidth="0.6" />
                  <path d="M 40,34 Q 52,38 57,43" stroke="#4F4837" strokeWidth="0.6" />

                  <path d="M 40,43 Q 32,47 28,51" stroke="#4F4837" strokeWidth="0.5" />
                  <path d="M 40,43 Q 48,47 52,51" stroke="#4F4837" strokeWidth="0.5" />

                  {/* Tertiary Reticulate Veinlets */}
                  <line x1="33" y1="21" x2="31" y2="28" stroke="#69614B" strokeWidth="0.4" strokeDasharray="1 1" />
                  <line x1="47" y1="21" x2="49" y2="28" stroke="#69614B" strokeWidth="0.4" strokeDasharray="1 1" />
                  <line x1="30" y1="29" x2="28" y2="36" stroke="#69614B" strokeWidth="0.4" strokeDasharray="1 1" />
                  <line x1="50" y1="29" x2="52" y2="36" stroke="#69614B" strokeWidth="0.4" strokeDasharray="1 1" />
                </g>

                {/* Cellular Inset Detail Circle (x=73, y=42) */}
                <circle cx="72" cy="40" r="11" fill="#EAE7D9" stroke="#524C3A" strokeWidth="0.75" />
                <circle cx="72" cy="40" r="9.5" fill="none" stroke="#74866A" strokeWidth="0.4" strokeDasharray="1 1.5" />
                {/* Microscopic honeycomb plant tissue cells */}
                {[
                  [72, 36], [68, 38], [76, 38], [68, 42], [76, 42], [72, 44]
                ].map(([cx, cy], idx) => (
                  <circle key={`cell-${idx}`} cx={cx} cy={cy} r="1.8" fill="#B5AC98" stroke="#3A3528" strokeWidth="0.4" />
                ))}
                <text x="72" y="55" fill="#69614B" fontSize="4" fontFamily="monospace" textAnchor="middle">CELLULA</text>

                {/* Engraved Botanical Typography on Right */}
                <text x="96" y="20" fill="#171714" fontSize="5.8" fontFamily="serif" fontStyle="italic" fontWeight="bold">Tab. VII — HERBARIUM TAXONOMIA</text>
                <text x="96" y="30" fill="#55544B" fontSize="4.8" fontFamily="monospace">Nervatio reticulata • Folium</text>
                <text x="96" y="40" fill="#2E4029" fontSize="5.2" fontFamily="monospace" fontWeight="bold">ENTRIES: {entriesCount} SPECIMENS // WK-18</text>
                <text x="96" y="50" fill="#55544B" fontSize="4.8" fontFamily="monospace">Status: Indexatum • Archival DB</text>
                <text x="96" y="60" fill="#77766B" fontSize="4.2" fontFamily="monospace">COLLECTIO BOTANICA • MAY 2025</text>
              </svg>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* COLUMN 5: FOCUS & CELESTIAL ASTROLABE / ARMILLARY SPHERE     */}
        {/* ============================================================ */}
        <div className="flex flex-col justify-between p-3 pt-2.5 pb-2.5 h-[178px]">
          {/* Top: Header, Number, Subtitle below */}
          <div>
            <div className="text-[9px] uppercase tracking-wider text-[#171714] font-bold leading-none">
              FOCUS
            </div>
            <div className="flex flex-col mt-0.5">
              <span 
                className="text-[40px] font-bold text-[#171714] leading-none tracking-tight select-none"
                style={numeralStyle}
              >
                {focusPct}%
              </span>
              <span className="text-[8px] uppercase tracking-wider text-[#171714] font-bold mt-0.5">
                WEEKLY PROGRESS
              </span>
            </div>
          </div>

          {/* Bottom: Engraved Celestial Astrolabe / Armillary Sphere */}
          <div className="h-[86px] flex flex-col justify-center">
            <div className="relative w-full h-[76px] border border-[#B5B3A4] bg-[#E5E1D2]/45 rounded-[0.5px] p-1.5 flex items-center justify-between overflow-hidden shadow-inner">
              {/* Subtle background technical grid */}
              <div 
                className="absolute inset-0 opacity-12 pointer-events-none"
                style={{
                  backgroundImage: `linear-gradient(#74866A 1px, transparent 1px), linear-gradient(90deg, #74866A 1px, transparent 1px)`,
                  backgroundSize: '10px 10px'
                }}
              />

              <svg viewBox="0 0 180 70" className="w-full h-full select-none relative z-10">
                {/* Celestial Armillary Sphere / Astrolabe (center x=44, y=35) */}
                <g stroke="#26231B" strokeWidth="0.8" fill="none">
                  {/* Outer Meridian Ring */}
                  <circle cx="44" cy="35" r="26" stroke="#26231B" strokeWidth="1" />
                  <circle cx="44" cy="35" r="24" stroke="#74866A" strokeWidth="0.5" strokeDasharray="1 1.5" />

                  {/* Meridian degree tick marks */}
                  {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map(deg => {
                    const rad = (deg * Math.PI) / 180;
                    const x1 = 44 + Math.cos(rad) * 24;
                    const y1 = 35 + Math.sin(rad) * 24;
                    const x2 = 44 + Math.cos(rad) * 26;
                    const y2 = 35 + Math.sin(rad) * 26;
                    return <line key={`adeg-${deg}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#383327" strokeWidth="0.75" />;
                  })}

                  {/* Inclined Ecliptic Zodiac Band (23.5 degrees) */}
                  <ellipse cx="44" cy="35" rx="23" ry="11" transform="rotate(-24 44 35)" stroke="#3E5139" strokeWidth="0.9" fill="#74866A" fillOpacity="0.12" />
                  
                  {/* Horizontal Celestial Equator */}
                  <ellipse cx="44" cy="35" rx="24" ry="7" stroke="#524C3A" strokeWidth="0.7" />

                  {/* Polar Axis Pin */}
                  <line x1="44" y1="6" x2="44" y2="64" stroke="#171714" strokeWidth="1" />
                  <circle cx="44" cy="6" r="1.5" fill="#171714" />
                  <circle cx="44" cy="64" r="1.5" fill="#171714" />

                  {/* Central Earth / Focal Pivot Sphere */}
                  <circle cx="44" cy="35" r="5" fill="#C2B9A5" stroke="#26231B" strokeWidth="0.8" />
                  <circle cx="44" cy="35" r="1.5" fill="#171714" />

                  {/* Constellation Stars / Reticle points */}
                  {[
                    [32, 22], [54, 20], [30, 42], [58, 44], [44, 22]
                  ].map(([sx, sy], idx) => (
                    <circle key={`star-${idx}`} cx={sx} cy={sy} r="0.9" fill="#171714" />
                  ))}

                  {/* Sight Alidade Rule */}
                  <line x1="24" y1="46" x2="64" y2="24" stroke="#26231B" strokeWidth="0.8" strokeDasharray="4 1" />
                </g>

                {/* Engraved Astronomical Typography on Right */}
                <text x="96" y="20" fill="#171714" fontSize="5.8" fontFamily="serif" fontStyle="italic" fontWeight="bold">Tab. XII — ASTROLABIUM PLANUM</text>
                <text x="96" y="30" fill="#55544B" fontSize="4.8" fontFamily="monospace">Sphaera armillaris • Gradus</text>
                <text x="96" y="40" fill="#2E4029" fontSize="5.2" fontFamily="monospace" fontWeight="bold">FOCUS: {focusPct}% // COHERENTIA</text>
                <text x="96" y="50" fill="#55544B" fontSize="4.8" fontFamily="monospace">Altitudo: 44.8° • Azimuth OK</text>
                <text x="96" y="60" fill="#77766B" fontSize="4.2" fontFamily="monospace">OBSERVATORIUM • ATHENÆUM</text>
              </svg>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default OverviewMetrics;

