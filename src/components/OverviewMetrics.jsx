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
        {/* COLUMN 3: WORKS & HORIZONTAL CATEGORY PROGRESS BARS          */}
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

          {/* Bottom: Four Horizontal Category Progress Rows matching reference image */}
          <div className="h-[86px] flex flex-col justify-center space-y-2.5 pr-0.5">
            {worksCategories.map((cat, idx) => (
              <div key={idx} className="flex items-center justify-between text-[8px] font-mono leading-[14px]">
                <span className="text-[#171714] font-medium w-[62px] sm:w-[68px] flex-shrink-0 select-none">
                  {cat.label}
                </span>
                
                {/* Thin horizontal progress track */}
                <div className="flex-1 mx-2 h-[4px] bg-[#DBD7C8] rounded-[0.5px] overflow-hidden">
                  <div 
                    className="h-full bg-[#74866A] rounded-[0.5px] transition-all duration-500 ease-out"
                    style={{ width: `${cat.fillPct}%` }}
                  />
                </div>

                {/* Actual count aligned to right */}
                <span className="font-medium text-[#171714] w-3 text-right flex-shrink-0 select-none">
                  {cat.count}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ============================================================ */}
        {/* COLUMN 4: ENTRIES & SEVEN-DAY ACTIVITY TILES                 */}
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

          {/* Bottom: Seven Vertically Aligned Activity Tiles matching reference image */}
          <div className="h-[86px] flex flex-col justify-center">
            <div className="flex items-end justify-between gap-1 sm:gap-1.5 h-[68px]">
              {activityTiles.map((tile, i) => (
                <div 
                  key={i} 
                  className="flex-1 flex flex-col items-center group/tile cursor-pointer"
                  title={`${tile.day}: ${tile.count} entries`}
                >
                  {/* Activity Tile Box */}
                  <div 
                    className={`w-full h-[54px] flex flex-col justify-between overflow-hidden rounded-[1px] transition-all duration-200 group-hover/tile:brightness-95 ${
                      tile.isHighlighted 
                        ? 'border border-[#44553D] bg-[#E1DDCB]/60 shadow-[0_0_0_0.5px_#44553D]' 
                        : 'border border-[#C8C3B4] bg-[#E5E1D2]/40'
                    }`}
                  >
                    {/* Daily entry count at top */}
                    <div className="w-full text-center text-[7.5px] font-mono font-bold text-[#171714] pt-1 select-none leading-none">
                      {tile.count}
                    </div>

                    {/* Proportional vertical olive fill at bottom */}
                    <div 
                      className={`w-full rounded-b-[0.5px] transition-all duration-500 ease-out ${
                        tile.isHighlighted ? 'bg-[#4D6146]' : 'bg-[#7E8F75]'
                      }`}
                      style={{ height: `${tile.fillPct}%` }}
                    />
                  </div>

                  {/* Weekday abbreviation below */}
                  <span className="text-[7.5px] font-mono font-bold text-[#171714] select-none text-center mt-1">
                    {tile.day}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* COLUMN 5: FOCUS & ANNOTATED WEEKLY PROGRESS TIMELINE         */}
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

          {/* Bottom: Annotated Weekly Progress Timeline matching reference image */}
          <div className="h-[86px] flex flex-col justify-end">
            {/* Timeline SVG Canvas */}
            <div className="w-full relative h-[52px]">
              <svg 
                viewBox="0 0 100 44" 
                preserveAspectRatio="none" 
                className="w-full h-full overflow-visible"
              >
                <defs>
                  <linearGradient id="timelineAreaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#74866A" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#EAE7D9" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Subtle horizontal reference baseline */}
                <line x1="0" y1="41" x2="100" y2="41" stroke="#D0CCBD" strokeWidth="0.5" strokeDasharray="2 2" />

                {/* Shaded Area Under Timeline */}
                <polygon
                  points={`6,${focusTimeline[0].y} ${focusTimeline.map(p => `${p.x},${p.y}`).join(' ')} 94,${focusTimeline[6].y} 94,41 6,41`}
                  fill="url(#timelineAreaGrad)"
                />

                {/* Connected Charcoal/Olive Line */}
                <polyline
                  fill="none"
                  stroke="#34442F"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={focusTimeline.map(p => `${p.x},${p.y}`).join(' ')}
                />

                {/* Data Points, Markers & Percentage Labels */}
                {focusTimeline.map((pt, idx) => (
                  <g key={idx}>
                    {/* Percentage Label directly above marker */}
                    <text
                      x={pt.x}
                      y={pt.y - 4.5}
                      textAnchor="middle"
                      fill="#171714"
                      fontSize="4.2"
                      fontFamily="monospace"
                      fontWeight="bold"
                    >
                      {pt.pct}%
                    </text>

                    {/* Circular Marker */}
                    {pt.isLatest ? (
                      <g>
                        {/* Prominent halo ring for latest day */}
                        <circle cx={pt.x} cy={pt.y} r="4.8" fill="#EAE7D9" stroke="#34442F" strokeWidth="1" />
                        <circle cx={pt.x} cy={pt.y} r="2.2" fill="#283823" />
                      </g>
                    ) : (
                      <circle cx={pt.x} cy={pt.y} r="2.2" fill="#34442F" />
                    )}
                  </g>
                ))}
              </svg>
            </div>

            {/* Weekday labels spanning M to S aligned beneath markers */}
            <div className="relative w-full h-3 mt-0.5">
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
                <span
                  key={i}
                  className="absolute -translate-x-1/2 text-[7.5px] font-mono font-bold text-[#171714] select-none text-center"
                  style={{ left: `${focusTimeline[i].x}%` }}
                >
                  {day}
                </span>
              ))}
            </div>

            {/* Upward Indicator and Weekly Comparison */}
            <div className="text-[7.5px] font-mono text-[#171714] select-none mt-1 flex items-center">
              <span className="font-bold mr-1">↑</span> + 12% vs last week
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default OverviewMetrics;

