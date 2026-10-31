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
        {/* COLUMN 3: WORKS & MECHANICAL GEAR / TRANSMISSION SCHEMATIC   */}
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

          {/* Bottom: Mechanical Transmission / Gear Assembly Illustration */}
          <div className="h-[86px] flex flex-col justify-center">
            <div className="relative w-full h-[76px] border border-[#B5B3A4] bg-[#E5E1D2]/45 rounded-[0.5px] p-1.5 flex items-center justify-between overflow-hidden shadow-inner">
              {/* Subtle background technical grid */}
              <div 
                className="absolute inset-0 opacity-15 pointer-events-none"
                style={{
                  backgroundImage: `linear-gradient(#74866A 1px, transparent 1px), linear-gradient(90deg, #74866A 1px, transparent 1px)`,
                  backgroundSize: '10px 10px'
                }}
              />

              <svg viewBox="0 0 180 70" className="w-full h-full select-none relative z-10">
                {/* Primary Drive Gear (radius 24 at x=38, y=35) */}
                <circle cx="38" cy="35" r="26" fill="none" stroke="#A8A495" strokeWidth="0.6" strokeDasharray="2 2" />
                <circle cx="38" cy="35" r="22" fill="#EAE7D9" stroke="#171714" strokeWidth="1" />
                <circle cx="38" cy="35" r="16" fill="none" stroke="#74866A" strokeWidth="0.75" />
                
                {/* Gear cogs for primary gear */}
                {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map(deg => {
                  const rad = (deg * Math.PI) / 180;
                  const x1 = 38 + Math.cos(rad) * 22;
                  const y1 = 35 + Math.sin(rad) * 22;
                  const x2 = 38 + Math.cos(rad) * 25.5;
                  const y2 = 35 + Math.sin(rad) * 25.5;
                  return <line key={`cog-${deg}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#3A4B35" strokeWidth="1.8" strokeLinecap="square" />;
                })}

                {/* Primary gear axle and cross spokes */}
                <line x1="22" y1="35" x2="54" y2="35" stroke="#55544B" strokeWidth="0.75" />
                <line x1="38" y1="19" x2="38" y2="51" stroke="#55544B" strokeWidth="0.75" />
                <circle cx="38" cy="35" r="5" fill="#171714" />
                <circle cx="38" cy="35" r="1.5" fill="#FAF8F3" />

                {/* Secondary Interlocking Pinion Gear (radius 15 at x=78, y=35) */}
                <circle cx="78" cy="35" r="17" fill="none" stroke="#A8A495" strokeWidth="0.5" strokeDasharray="1 2" />
                <circle cx="78" cy="35" r="14" fill="#EAE7D9" stroke="#171714" strokeWidth="0.8" />
                {[0, 45, 90, 135, 180, 225, 270, 315].map(deg => {
                  const rad = (deg * Math.PI) / 180;
                  const x1 = 78 + Math.cos(rad) * 14;
                  const y1 = 35 + Math.sin(rad) * 14;
                  const x2 = 78 + Math.cos(rad) * 16.5;
                  const y2 = 35 + Math.sin(rad) * 16.5;
                  return <line key={`pcog-${deg}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#74866A" strokeWidth="1.4" strokeLinecap="square" />;
                })}
                <circle cx="78" cy="35" r="3.5" fill="#3A4B35" />
                <circle cx="78" cy="35" r="1" fill="#FAF8F3" />

                {/* Drive Transmission Coupling Arm */}
                <line x1="38" y1="14" x2="78" y2="21" stroke="#74866A" strokeWidth="0.9" strokeDasharray="3 2" />
                <line x1="38" y1="56" x2="78" y2="49" stroke="#74866A" strokeWidth="0.9" strokeDasharray="3 2" />

                {/* Technical Annotation Metadata on Right */}
                <text x="102" y="19" fill="#171714" fontSize="5.5" fontFamily="monospace" fontWeight="bold">MECHANICAL_TRANSMISSION</text>
                <text x="102" y="29" fill="#55544B" fontSize="5" fontFamily="monospace">RATIO: 3.75:1 • DUAL AXIS</text>
                <text x="102" y="39" fill="#55544B" fontSize="5" fontFamily="monospace">PROJECTS: {projectWorksCount} • RESEARCH: {researchWorksCount}</text>
                <text x="102" y="49" fill="#2E4029" fontSize="5.2" fontFamily="monospace" fontWeight="bold">ACTIVE WORKS: {activeWorksCount} UNITS</text>
                <text x="102" y="59" fill="#77766B" fontSize="4.5" fontFamily="monospace">POWER_BUS: 0x88 // ENGAGED</text>
              </svg>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* COLUMN 4: ENTRIES & ARCHIVAL LEDGER MATRIX GRID              */}
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

          {/* Bottom: Archival Ledger Matrix / Filing Index Grid Illustration */}
          <div className="h-[86px] flex flex-col justify-center">
            <div className="relative w-full h-[76px] border border-[#B5B3A4] bg-[#E5E1D2]/45 rounded-[0.5px] p-1.5 flex items-center justify-between overflow-hidden shadow-inner">
              {/* Subtle background technical grid */}
              <div 
                className="absolute inset-0 opacity-15 pointer-events-none"
                style={{
                  backgroundImage: `linear-gradient(#74866A 1px, transparent 1px), linear-gradient(90deg, #74866A 1px, transparent 1px)`,
                  backgroundSize: '10px 10px'
                }}
              />

              <svg viewBox="0 0 180 70" className="w-full h-full select-none relative z-10">
                {/* Ledger Index Matrix Frame (Left: x=6 to x=86, y=6 to y=64) */}
                <rect x="6" y="8" width="80" height="54" fill="#EAE7D9" stroke="#B8B4A5" strokeWidth="0.75" />
                
                {/* Horizontal registry rows */}
                {[20, 32, 44, 56].map(y => (
                  <line key={`r-${y}`} x1="6" y1={y} x2="86" y2={y} stroke="#D0CCBD" strokeWidth="0.5" />
                ))}

                {/* Vertical day columns: M T W T F S S */}
                {[17.4, 28.8, 40.2, 51.6, 63.0, 74.4].map(x => (
                  <line key={`c-${x}`} x1={x} y1="8" x2={x} y2="62" stroke="#D0CCBD" strokeWidth="0.5" strokeDasharray="1 2" />
                ))}

                {/* Weekday column headers */}
                {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
                  <text key={`hd-${i}`} x={11.7 + i * 11.4} y="16" textAnchor="middle" fill="#55544B" fontSize="4.5" fontFamily="monospace" fontWeight="bold">
                    {d}
                  </text>
                ))}

                {/* Filled ledger punch markers representing active daily entries */}
                {[
                  [0, 2], [0, 3],
                  [1, 1], [1, 2], [1, 3],
                  [2, 0], [2, 1], [2, 2], [2, 3],
                  [3, 0], [3, 1], [3, 2], [3, 3], // Thursday peak
                  [4, 1], [4, 2], [4, 3],
                  [5, 2], [5, 3],
                  [6, 3]
                ].map(([col, row], idx) => {
                  const cx = 11.7 + col * 11.4;
                  const cy = 26 + row * 12;
                  const isPeak = col === 3;
                  return (
                    <rect 
                      key={`entry-${idx}`} 
                      x={cx - 3.2} 
                      y={cy - 3.2} 
                      width="6.4" 
                      height="6.4" 
                      rx="0.5"
                      fill={isPeak ? '#30432B' : '#74866A'} 
                      stroke="#171714" 
                      strokeWidth="0.4"
                    />
                  );
                })}

                {/* Technical Ledger Metadata on Right */}
                <text x="96" y="19" fill="#171714" fontSize="5.5" fontFamily="monospace" fontWeight="bold">ARCHIVAL_LEDGER_INDEX</text>
                <text x="96" y="29" fill="#55544B" fontSize="5" fontFamily="monospace">REGISTRY: SEC-09 // WK-18</text>
                <text x="96" y="39" fill="#55544B" fontSize="5" fontFamily="monospace">TOTAL_ENTRIES: {entriesCount} LOGS</text>
                <text x="96" y="49" fill="#2E4029" fontSize="5.2" fontFamily="monospace" fontWeight="bold">DATABASE_INTEGRITY: 100%</text>
                <text x="96" y="59" fill="#77766B" fontSize="4.5" fontFamily="monospace">INDEXED_DB • LOCAL_SYNC</text>
              </svg>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* COLUMN 5: FOCUS & OPTICAL COLLIMATOR RETICLE SCHEMATIC       */}
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

          {/* Bottom: Archival Optical Focus Illustration */}
          <div className="h-[86px] flex flex-col justify-center">
            <div className="relative w-full h-[76px] border border-[#B5B3A4] bg-[#E5E1D2]/45 rounded-[0.5px] p-1.5 flex items-center justify-between overflow-hidden shadow-inner">
              {/* Subtle background technical grid */}
              <div 
                className="absolute inset-0 opacity-15 pointer-events-none"
                style={{
                  backgroundImage: `linear-gradient(#74866A 1px, transparent 1px), linear-gradient(90deg, #74866A 1px, transparent 1px)`,
                  backgroundSize: '10px 10px'
                }}
              />

              <svg viewBox="0 0 180 70" className="w-full h-full select-none relative z-10">
                {/* Outer concentric optical calibration rings */}
                <circle cx="38" cy="35" r="28" fill="none" stroke="#A8A495" strokeWidth="0.6" strokeDasharray="2 2" />
                <circle cx="38" cy="35" r="21" fill="none" stroke="#74866A" strokeWidth="0.8" />
                <circle cx="38" cy="35" r="14" fill="#EAE7D9" stroke="#171714" strokeWidth="1" />
                <circle cx="38" cy="35" r="4" fill="#171714" />
                <circle cx="38" cy="35" r="1.2" fill="#FAF8F3" />

                {/* Reticle Crosshairs with micro millimeter ticks */}
                <line x1="6" y1="35" x2="70" y2="35" stroke="#171714" strokeWidth="0.6" />
                <line x1="38" y1="3" x2="38" y2="67" stroke="#171714" strokeWidth="0.6" />
                {[18, 26, 50, 58].map(x => (
                  <line key={`xt-${x}`} x1={x} y1="33" x2={x} y2="37" stroke="#55544B" strokeWidth="0.5" />
                ))}
                {[15, 23, 47, 55].map(y => (
                  <line key={`yt-${y}`} x1="36" y1={y} x2="40" y2={y} stroke="#55544B" strokeWidth="0.5" />
                ))}

                {/* 45-degree diagonal ray ticks */}
                <line x1="20" y1="17" x2="26" y2="23" stroke="#74866A" strokeWidth="0.75" />
                <line x1="56" y1="53" x2="50" y2="47" stroke="#74866A" strokeWidth="0.75" />
                <line x1="56" y1="17" x2="50" y2="23" stroke="#74866A" strokeWidth="0.75" />
                <line x1="20" y1="53" x2="26" y2="47" stroke="#74866A" strokeWidth="0.75" />

                {/* Optical Beam / Wave Interference Curve on right */}
                <path 
                  d="M 80,35 C 93,18 106,52 120,35 C 134,18 148,52 166,35" 
                  fill="none" 
                  stroke="#3E5139" 
                  strokeWidth="1.2" 
                  strokeLinecap="round"
                />
                <circle cx="120" cy="35" r="2" fill="#3E5139" />
                <circle cx="166" cy="35" r="2" fill="#3E5139" />

                {/* Vertical Optical Aperture Scale */}
                <line x1="84" y1="14" x2="84" y2="56" stroke="#9A9687" strokeWidth="0.6" />
                {[14, 21, 28, 35, 42, 49, 56].map(y => (
                  <line key={`s-${y}`} x1="82" y1={y} x2="86" y2={y} stroke="#74866A" strokeWidth="0.6" />
                ))}

                {/* Technical Annotation Metadata */}
                <text x="94" y="20" fill="#171714" fontSize="5.5" fontFamily="monospace" fontWeight="bold">OPTICAL_COLLIMATOR // MK.IV</text>
                <text x="94" y="30" fill="#55544B" fontSize="5" fontFamily="monospace">AXIS: α-84.2° NNE</text>
                <text x="94" y="40" fill="#55544B" fontSize="5" fontFamily="monospace">APERTURE: f/2.8</text>
                <text x="94" y="50" fill="#30432B" fontSize="5.2" fontFamily="monospace" fontWeight="bold">FOCUS: {focusPct}% // COHERENT</text>
                <text x="94" y="60" fill="#77766B" fontSize="4.5" fontFamily="monospace">SYS_CALIB • CALIBRATED</text>
              </svg>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default OverviewMetrics;

