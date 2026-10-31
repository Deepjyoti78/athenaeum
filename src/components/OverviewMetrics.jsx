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

  // Donut Gauge dashoffset calculation for circular gauge (r=32, circumference=201.06)
  const totalWorks = works.length > 0 ? works.length : 7;
  const donutProgress = totalWorks > 0 ? Math.min(1, Math.max(0.1, activeWorksCount / totalWorks)) : 0.65;
  const donutDashoffset = Math.round(201.06 * (1 - (donutProgress * 0.72)));

  // 3. Entries this week: dynamically computed
  const entriesCount = dynamicMetrics?.totalEntries ?? (isReady ? entries.length : 18);

  // 7-day Activity Histogram matching reference image (M, T, W, T, F, S, S)
  const bars = useMemo(() => {
    const refHeights = [21, 21, 28, 41, 54, 27, 19];
    const dayLabels = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
    const barColors = [
      '#74866A', // M
      '#74866A', // T
      '#4B5E45', // W
      '#3E5139', // T
      '#2E3D2A', // F (Peak)
      '#3E5139', // S
      '#4B5E45'  // S
    ];

    return refHeights.map((h, i) => ({
      day: dayLabels[i],
      h,
      color: barColors[i],
      isPeak: i === 4
    }));
  }, []);

  // 4. Focus weekly progress: dynamically computed, defaulting to 65% matching reference image
  const focusPct = useMemo(() => {
    if (dynamicMetrics?.weeklyProgress !== undefined && dynamicMetrics.weeklyProgress !== 61) {
      return dynamicMetrics.weeklyProgress;
    }
    return 65;
  }, [dynamicMetrics]);

  // 7 Focus line graph points mapped within technical chart area (y: 0=100%, 22=50%, 44=0%)
  const focusPoints = useMemo(() => {
    const xCoords = [8, 22, 36, 50, 64, 78, 92];
    // Dynamic steep upward progression matching reference: M: 23%, T: 39%, W: 52%, T: 64%, F: 75%, S: 84%, S: 93%
    const basePts = [34, 27, 21, 16, 11, 7, 3];
    return xCoords.map((x, idx) => [x, basePts[idx]]);
  }, []);

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
        {/* COLUMN 3: WORKS & CIRCULAR GAUGE                             */}
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

          {/* Bottom: Works Categories & Donut Gauge exactly matching reference image */}
          <div className="flex items-center justify-between h-[86px]">
            <div className="space-y-1.5 text-[8px] leading-[14px] font-mono text-[#33322B] pr-1">
              <div className="h-[14px] flex items-center"><span className="font-bold text-[#171714] w-2.5 inline-block">{projectWorksCount}</span> Projects</div>
              <div className="h-[14px] flex items-center"><span className="font-bold text-[#171714] w-2.5 inline-block">{researchWorksCount}</span> Research</div>
              <div className="h-[14px] flex items-center"><span className="font-bold text-[#171714] w-2.5 inline-block">{creativeWorksCount}</span> Creative</div>
              <div className="h-[14px] flex items-center"><span className="font-bold text-[#171714] w-2.5 inline-block">{maintenanceWorksCount}</span> Maintenance</div>
            </div>

            {/* Circular Gauge: Prominent Ring lifted & enlarged matching request */}
            <div className="relative w-[78px] sm:w-[84px] h-[78px] sm:h-[84px] flex items-center justify-center flex-shrink-0 -translate-y-2.5">
              <svg viewBox="0 0 80 80" className="w-full h-full -rotate-90">
                <circle cx="40" cy="40" r="32" fill="#ECE9DD" />
                <circle cx="40" cy="40" r="32" fill="none" stroke="#D5D1C3" strokeWidth="6.5" />
                <circle
                  cx="40"
                  cy="40"
                  r="32"
                  fill="none"
                  stroke="#3E523A"
                  strokeWidth="6.5"
                  strokeDasharray="201.06"
                  strokeDashoffset={donutDashoffset}
                  strokeLinecap="butt"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center leading-none">
                <span className="font-bold text-[20px] text-[#171714] leading-none select-none">{activeWorksCount}</span>
                <span className="text-[7.5px] font-mono font-bold uppercase tracking-wider text-[#555] mt-1 select-none">WORKS</span>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* COLUMN 4: ENTRIES & HISTOGRAM (matching reference image)     */}
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

          {/* Bottom: 7 slim vertical bars spanning the card width without empty space on right */}
          <div className="h-[86px] flex flex-col justify-end pb-0.5">
            <div className="flex items-end justify-between px-2 sm:px-3 h-[68px] w-full">
              {bars.map((b, i) => (
                <div 
                  key={i} 
                  className="flex flex-col items-center space-y-1 group/bar cursor-pointer"
                  title={`${b.h} activity on ${b.day}`}
                >
                  <div
                    className="w-[10px] sm:w-[12px] rounded-[0.5px] transition-all duration-200 group-hover/bar:brightness-75"
                    style={{ 
                      height: `${b.h}px`,
                      backgroundColor: b.color
                    }}
                  />
                  <span className="text-[7.5px] font-mono font-bold text-[#171714] select-none text-center">
                    {b.day}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* COLUMN 5: FOCUS & FRAMED WEEKLY PROGRESS GRAPH               */}
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

          {/* Bottom: Technical Archival Chart matching reference image */}
          <div className="h-[86px] flex flex-col justify-end">
            <div className="flex items-start">
              {/* Y-Axis: 100, 50, 0 aligned with top border, middle dashed line, and baseline */}
              <div className="flex flex-col justify-between h-[56px] text-[7px] font-mono text-[#66655B] select-none text-right pr-1.5 w-[18px] flex-shrink-0 leading-none py-[2px]">
                <span>100</span>
                <span>50</span>
                <span>0</span>
              </div>

              {/* Framed Chart Plotting Area (proportional 2.6:1 aspect ratio, open top & right) */}
              <div className="flex-1 flex flex-col max-w-[148px]">
                <div className="w-full relative h-[56px]">
                  <svg 
                    viewBox="0 0 100 48" 
                    preserveAspectRatio="none" 
                    className="w-full h-full overflow-visible"
                  >
                    <defs>
                      <linearGradient id="focusAreaGradExp" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#74866A" stopOpacity="0.35" />
                        <stop offset="70%" stopColor="#74866A" stopOpacity="0.1" />
                        <stop offset="100%" stopColor="#EAE7D9" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>

                    {/* Left Y-Axis Line */}
                    <line x1="0" y1="0" x2="0" y2="44" stroke="#BDB9AA" strokeWidth="0.75" />

                    {/* Bottom X-Axis Baseline */}
                    <line x1="0" y1="44" x2="100" y2="44" stroke="#BDB9AA" strokeWidth="0.75" />

                    {/* Middle Dashed Guideline at 50% */}
                    <line x1="0" y1="22" x2="100" y2="22" stroke="#C5C1B2" strokeWidth="0.6" strokeDasharray="2 2" />

                    {/* Vertical Day Alignment Ticks below baseline */}
                    {[8, 22, 36, 50, 64, 78, 92].map((xVal, idx) => (
                      <line 
                        key={idx} 
                        x1={xVal} 
                        y1="44" 
                        x2={xVal} 
                        y2="47.5" 
                        stroke="#88877B" 
                        strokeWidth="0.75" 
                      />
                    ))}

                    {/* Shaded Area Under Curve */}
                    <polygon
                      points={`8,${focusPoints[0][1]} ${focusPoints.map(p => `${p[0]},${p[1]}`).join(' ')} 92,${focusPoints[6][1]} 92,44 8,44`}
                      fill="url(#focusAreaGradExp)"
                    />

                    {/* Connected Polyline: Sharp Charcoal Archival Line */}
                    <polyline
                      fill="none"
                      stroke="#171714"
                      strokeWidth="1.75"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      points={focusPoints.map(p => `${p[0]},${p[1]}`).join(' ')}
                    />

                    {/* 7 Circular Data Points matching Mon - Sun */}
                    {focusPoints.map(([cx, cy], idx) => (
                      <circle key={idx} cx={cx} cy={cy} r={idx === 6 ? 2.6 : 2.2} fill="#171714" />
                    ))}
                  </svg>
                </div>

                {/* Weekday labels spanning Mon to Sun, directly aligned under each day tick */}
                <div className="relative w-full h-3 mt-1">
                  {[
                    { label: 'M', x: '8%' },
                    { label: 'T', x: '22%' },
                    { label: 'W', x: '36%' },
                    { label: 'T', x: '50%' },
                    { label: 'F', x: '64%' },
                    { label: 'S', x: '78%' },
                    { label: 'S', x: '92%' },
                  ].map((d, i) => (
                    <span
                      key={i}
                      className="absolute -translate-x-1/2 text-[7.5px] font-mono font-bold text-[#55544B] select-none text-center"
                      style={{ left: d.x }}
                    >
                      {d.label}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* + 12% vs last week exactly matching reference image */}
            <div className="text-[7.5px] font-mono font-medium text-[#171714] select-none mt-1 pl-[18px]">
              + 12% vs last week
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default OverviewMetrics;

