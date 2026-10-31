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

  // Donut Gauge dashoffset calculation
  const totalWorks = works.length > 0 ? works.length : 7;
  const donutProgress = totalWorks > 0 ? Math.min(1, Math.max(0.1, activeWorksCount / totalWorks)) : 0.65;
  // Circumference = 126 for r=20. Gauge sweeps ~65% when healthy
  const donutDashoffset = Math.round(126 * (1 - (donutProgress * 0.72)));

  // 3. Entries this week: dynamically computed
  const entriesCount = dynamicMetrics?.totalEntries ?? (isReady ? entries.length : 18);

  // Dynamic 7-day activity bar chart
  const bars = useMemo(() => {
    // Default reference distribution where Thursday (T2) is peak
    const defaultCounts = [2, 3, 4, 6, 5, 3, 2];
    let counts = [...defaultCounts];

    if (entries.length > 0) {
      const dynamicCounts = [0, 0, 0, 0, 0, 0, 0];
      entries.forEach((entry, idx) => {
        if (!entry.date) {
          dynamicCounts[idx % 7]++;
          return;
        }
        const dStr = entry.date.toLowerCase();
        if (dStr.includes('mon') || dStr.includes('05 may') || dStr.includes('5 may')) dynamicCounts[0]++;
        else if (dStr.includes('tue') || dStr.includes('06 may') || dStr.includes('6 may')) dynamicCounts[1]++;
        else if (dStr.includes('wed') || dStr.includes('07 may') || dStr.includes('7 may')) dynamicCounts[2]++;
        else if (dStr.includes('thu') || dStr.includes('08 may') || dStr.includes('8 may')) dynamicCounts[3]++;
        else if (dStr.includes('fri') || dStr.includes('09 may') || dStr.includes('9 may')) dynamicCounts[4]++;
        else if (dStr.includes('sat') || dStr.includes('10 may') || dStr.includes('10 may')) dynamicCounts[5]++;
        else if (dStr.includes('sun') || dStr.includes('11 may') || dStr.includes('11 may')) dynamicCounts[6]++;
        else {
          const charCode = typeof entry.id === 'number' ? entry.id : (entry.title?.charCodeAt(0) || idx);
          dynamicCounts[Math.abs(charCode) % 7]++;
        }
      });
      if (dynamicCounts.some(c => c > 0)) {
        counts = dynamicCounts.map((val, i) => Math.max(val, 1));
      }
    }

    const maxVal = Math.max(...counts, 1);
    const dayLabels = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
    return counts.map((count, i) => {
      // Scale bar height cleanly between 12px and 42px to avoid vertical overflow
      const h = Math.round(12 + (count / maxVal) * 30);
      return {
        day: dayLabels[i],
        h,
        count,
        isPeak: count === maxVal
      };
    });
  }, [entries]);

  // 4. Focus weekly progress: dynamically computed
  const focusPct = useMemo(() => {
    if (dynamicMetrics?.weeklyProgress !== undefined) {
      return dynamicMetrics.weeklyProgress;
    }
    if (works.length > 0) {
      const avgProg = Math.round(works.reduce((acc, w) => acc + (Number(w.progress) || 0), 0) / works.length);
      return avgProg > 0 ? avgProg : 65;
    }
    return 65;
  }, [works, dynamicMetrics]);

  // Dynamic Focus line graph points scaled to compact 32px height to prevent any text overlap
  const focusPoints = useMemo(() => {
    const xCoords = [3, 18.67, 34.33, 50, 65.67, 81.33, 97];
    // Baseline y=28, upper peak y=4 (total height 24)
    const targetY = 28 - ((focusPct / 100) * 24);
    const yPoints = [
      Math.min(26, Math.round(targetY + 11)),
      Math.min(24, Math.round(targetY + 8)),
      Math.min(22, Math.round(targetY + 5)),
      Math.min(22, Math.round(targetY + 6)),
      Math.min(18, Math.round(targetY - 1)),
      Math.min(16, Math.round(targetY - 2)),
      Math.max(4, Math.round(targetY - 6))
    ];
    return xCoords.map((x, idx) => [x, yPoints[idx]]);
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
          className="flex flex-col justify-between p-3 pt-2.5 pb-2.5 cursor-pointer hover:bg-[#E4DFC2]/30 transition-colors h-[152px]"
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
          <div className="pt-0.5">
            {/* Weekday headers: M T W T F S S */}
            <div className="grid grid-cols-7 text-[7px] font-mono font-bold text-[#55544B] text-center mb-0.5">
              <span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span>
            </div>

            {/* Calendar Days Rows */}
            <div className="space-y-[1px]">
              {/* Row 1 */}
              <div className="grid grid-cols-7 text-[7px] font-mono text-center">
                {calRow1.map((c, i) => (
                  <span key={i} className={`h-2.5 w-2.5 flex items-center justify-center mx-auto ${c.isCurrent ? 'text-[#3E3D35]' : 'text-[#9E9D90]'}`}>
                    {c.day}
                  </span>
                ))}
              </div>
              {/* Row 2 (contains Today: 9) */}
              <div className="grid grid-cols-7 text-[7px] font-mono text-center">
                {calRow2.map((c, i) => (
                  <span 
                    key={i} 
                    className={`h-2.5 w-2.5 flex items-center justify-center mx-auto ${
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
              <div className="grid grid-cols-7 text-[7px] font-mono text-center">
                {calRow3.map((c, i) => (
                  <span 
                    key={i} 
                    className={`h-2.5 w-2.5 flex items-center justify-center mx-auto ${
                      c.hasIndicator ? 'text-[#171714] font-bold underline decoration-1 underline-offset-1' : 'text-[#3E3D35]'
                    }`}
                  >
                    {c.day}
                  </span>
                ))}
              </div>
              {/* Row 4 */}
              <div className="grid grid-cols-7 text-[7px] font-mono text-center">
                {calRow4.map((c, i) => (
                  <span 
                    key={i} 
                    className={`h-2.5 w-2.5 flex items-center justify-center mx-auto ${
                      c.hasIndicator ? 'text-[#171714] font-bold underline decoration-1 underline-offset-1' : 'text-[#3E3D35]'
                    }`}
                  >
                    {c.day}
                  </span>
                ))}
              </div>
              {/* Row 5 */}
              <div className="grid grid-cols-7 text-[7px] font-mono text-center">
                {calRow5.map((c, i) => (
                  <span key={i} className={`h-2.5 w-2.5 flex items-center justify-center mx-auto ${c.isCurrent ? 'text-[#3E3D35]' : 'text-[#9E9D90]'}`}>
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
          className="flex flex-col justify-between p-3 pt-2.5 pb-2.5 cursor-pointer hover:bg-[#E4DFC2]/30 transition-colors h-[152px]"
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

          {/* Bottom: Breakdown List matching Image 2 */}
          <div className="pt-1 space-y-1 text-[8px] font-mono text-[#33322B]">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-[#171714] w-2.5">{todoCount}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#74866A] inline-block" />
              <span className="text-[#33322B] font-medium">To do</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-[#171714] w-2.5">{inProgressCount}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#74866A] inline-block" />
              <span className="text-[#33322B] font-medium">In progress</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-[#171714] w-2.5">{waitingCount}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#74866A] inline-block" />
              <span className="text-[#33322B] font-medium">Waiting</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-[#171714] w-2.5">{completedCount}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#74866A] inline-block" />
              <span className="text-[#33322B] font-medium">Completed</span>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* COLUMN 3: WORKS & CIRCULAR DONUT CHART                       */}
        {/* ============================================================ */}
        <div 
          onClick={() => onNavigate && onNavigate('works')}
          className="flex flex-col justify-between p-3 pt-2.5 pb-2.5 cursor-pointer hover:bg-[#E4DFC2]/30 transition-colors h-[152px]"
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

          {/* Bottom: Works Categories & Circular Donut Gauge with Center Label */}
          <div className="pt-1 flex items-center justify-between">
            <div className="space-y-0.5 text-[8px] font-mono text-[#33322B] pr-1">
              <div><span className="font-bold text-[#171714]">{projectWorksCount}</span> Projects</div>
              <div><span className="font-bold text-[#171714]">{researchWorksCount}</span> Research</div>
              <div><span className="font-bold text-[#171714]">{creativeWorksCount}</span> Creative</div>
              <div><span className="font-bold text-[#171714]">{maintenanceWorksCount}</span> Maintenance</div>
            </div>

            {/* Circular Donut Gauge with "7 WORKS" inside — cleanly proportioned */}
            <div className="relative w-[52px] h-[52px] flex items-center justify-center flex-shrink-0">
              <svg viewBox="0 0 52 52" className="w-[52px] h-[52px] -rotate-90">
                <circle cx="26" cy="26" r="20" fill="none" stroke="#D2CEBF" strokeWidth="4.5" />
                <circle
                  cx="26"
                  cy="26"
                  r="20"
                  fill="none"
                  stroke="#5A6D52"
                  strokeWidth="4.5"
                  strokeDasharray="126"
                  strokeDashoffset={donutDashoffset}
                  strokeLinecap="butt"
                />
              </svg>
              {/* Text inside the Donut: 7 WORKS */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center leading-none">
                <span className="font-bold text-[13px] text-[#171714] leading-tight select-none">{activeWorksCount}</span>
                <span className="text-[6px] font-mono font-bold uppercase tracking-wider text-[#555] mt-0.5 select-none">WORKS</span>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* COLUMN 4: ENTRIES & 7-BAR HISTOGRAM                          */}
        {/* ============================================================ */}
        <div 
          onClick={() => onNavigate && onNavigate('entries')}
          className="flex flex-col justify-between p-3 pt-2.5 pb-2.5 cursor-pointer hover:bg-[#E4DFC2]/30 transition-colors h-[152px]"
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

          {/* Bottom: 7-bar Activity Histogram with thicker bars reducing empty space */}
          <div className="pt-0.5">
            <div className="flex items-end justify-between px-2 h-12 pb-0.5">
              {bars.map((b, i) => (
                <div 
                  key={i} 
                  className="flex flex-col items-center space-y-1 group/bar cursor-pointer"
                  title={`${b.day}: ${b.count || '0'} entries`}
                >
                  <div
                    className={`w-[8px] rounded-[0.5px] transition-all duration-200 group-hover/bar:brightness-90 ${
                      b.isPeak ? 'bg-[#4B5E44]' : 'bg-[#5B6D55]'
                    }`}
                    style={{ height: `${b.h}px` }}
                  />
                  <span className="text-[7.5px] font-mono font-bold text-[#171714]">
                    {b.day}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* COLUMN 5: FOCUS & TECHNICAL ARCHIVAL PROGRESS GRAPH          */}
        {/* ============================================================ */}
        <div className="flex flex-col justify-between p-3 pt-2.5 pb-2.5 h-[152px]">
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

          {/* Bottom: Technical Archival Line Graph filling the space from Mon to Sun without vertical overlap */}
          <div className="flex flex-col justify-end pt-0.5">
            {/* Graph Canvas: compact 34px height to prevent text collision */}
            <div className="w-full relative h-[34px]">
              <svg 
                viewBox="0 0 100 32" 
                preserveAspectRatio="none" 
                className="w-full h-full overflow-visible"
              >
                <defs>
                  <linearGradient id="focusAreaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#74866A" stopOpacity="0.45" />
                    <stop offset="65%" stopColor="#74866A" stopOpacity="0.12" />
                    <stop offset="100%" stopColor="#EAE7D9" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Horizontal Technical Grid Guidelines */}
                <line x1="0" y1="8" x2="100" y2="8" stroke="#D5D0C2" strokeWidth="0.5" strokeDasharray="2 2" />
                <line x1="0" y1="18" x2="100" y2="18" stroke="#D5D0C2" strokeWidth="0.5" strokeDasharray="2 2" />
                <line x1="0" y1="28" x2="100" y2="28" stroke="#B8B4A5" strokeWidth="0.75" />

                {/* Vertical Day Alignment Ticks */}
                {[3, 18.67, 34.33, 50, 65.67, 81.33, 97].map((xVal, idx) => (
                  <line 
                    key={idx} 
                    x1={xVal} 
                    y1="28" 
                    x2={xVal} 
                    y2="31" 
                    stroke="#88877B" 
                    strokeWidth="0.75" 
                  />
                ))}

                {/* Shaded Area Under Curve */}
                <polygon
                  points={`3,${focusPoints[0][1]} ${focusPoints.map(p => `${p[0]},${p[1]}`).join(' ')} 97,${focusPoints[6][1]} 97,28 3,28`}
                  fill="url(#focusAreaGrad)"
                />

                {/* Connected Polyline: Bold Dark Archival Line */}
                <polyline
                  fill="none"
                  stroke="#171714"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={focusPoints.map(p => `${p[0]},${p[1]}`).join(' ')}
                />

                {/* 7 Circular Data Points matching Mon - Sun */}
                {focusPoints.map(([cx, cy], idx) => (
                  <g key={idx}>
                    <circle cx={cx} cy={cy} r="2.2" fill="#171714" />
                    <circle cx={cx} cy={cy} r="0.8" fill="#FAF8F3" />
                  </g>
                ))}
              </svg>
            </div>

            {/* Weekday labels spanning Mon to Sun, cleanly positioned below the data ticks */}
            <div className="flex justify-between text-[7px] font-mono font-bold text-[#55544B] mt-0.5 select-none px-0.5">
              <span className="w-2.5 text-center">M</span>
              <span className="w-2.5 text-center">T</span>
              <span className="w-2.5 text-center">W</span>
              <span className="w-2.5 text-center">T</span>
              <span className="w-2.5 text-center">F</span>
              <span className="w-2.5 text-center">S</span>
              <span className="w-2.5 text-center">S</span>
            </div>

            {/* Subtext with trend indicator with dedicated vertical spacing */}
            <div className="text-[7.5px] font-mono font-medium text-[#171714] mt-0.5 select-none">
              <span className="text-[#4B5E44] font-bold">▲ +12%</span> vs last week
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
