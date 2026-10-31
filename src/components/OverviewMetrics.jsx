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

  // Donut Gauge dashoffset calculation for large ~76px prominent circle (r=26, circumference=163.4)
  const totalWorks = works.length > 0 ? works.length : 7;
  const donutProgress = totalWorks > 0 ? Math.min(1, Math.max(0.1, activeWorksCount / totalWorks)) : 0.65;
  const donutDashoffset = Math.round(163.4 * (1 - (donutProgress * 0.72)));

  // 3. Entries this week: dynamically computed
  const entriesCount = dynamicMetrics?.totalEntries ?? (isReady ? entries.length : 18);

  // 8-bar Activity Histogram matching reference image
  const bars = useMemo(() => {
    const refHeights = [27, 27, 36, 52, 70, 35, 25, 9];
    const dayLabels = ['M', 'T', 'W', 'T', 'F', 'S', 'S', 'S'];
    const barColors = [
      '#74866A', // M
      '#74866A', // T
      '#4B5E45', // W
      '#3E5139', // T
      '#2E3D2A', // F (Peak)
      '#3E5139', // S
      '#4B5E45', // S
      '#74866A'  // S
    ];

    return refHeights.map((h, i) => ({
      day: dayLabels[i],
      h,
      color: barColors[i],
      isPeak: i === 4
    }));
  }, []);

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

  // 7 Focus line graph points mapped within framed technical chart box (y: 0=100%, 22=50%, 44=0%)
  const focusPoints = useMemo(() => {
    const xCoords = [8, 22, 36, 50, 64, 78, 92];
    // Progress curve matching reference image: M: 25%, T: 42%, W: 56%, T: 56%, F: 72%, S: 72%, S: 88%
    const basePts = [33, 25.5, 19.4, 19.4, 12.3, 12.3, 5.3];
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
          <div className="pt-0.5">
            {/* Weekday headers: M T W T F S S */}
            <div className="grid grid-cols-7 text-[7px] font-mono font-bold text-[#55544B] text-center mb-1">
              <span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span>
            </div>

            {/* Calendar Days Rows */}
            <div className="space-y-[2px]">
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

          {/* Bottom: Breakdown List matching Image 2 */}
          <div className="pt-1 space-y-1.5 text-[8px] font-mono text-[#33322B]">
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
        {/* COLUMN 3: WORKS & PROMINENT CIRCULAR GAUGE (~76px)           */}
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

          {/* Bottom: Works Categories & Bigger Donut Gauge (~76px) vertically centered */}
          <div className="flex items-center justify-between h-[86px]">
            <div className="space-y-1.5 text-[8px] font-mono text-[#33322B] pr-1">
              <div><span className="font-bold text-[#171714]">3</span> Projects</div>
              <div><span className="font-bold text-[#171714]">2</span> Research</div>
              <div><span className="font-bold text-[#171714]">1</span> Creative</div>
              <div><span className="font-bold text-[#171714]">1</span> Maintenance</div>
            </div>

            {/* Circular Gauge: Big 76px diameter prominent ring, shifted upward */}
            <div className="relative w-[76px] sm:w-[78px] h-[76px] sm:h-[78px] flex items-center justify-center flex-shrink-0 -translate-y-1.5">
              <svg viewBox="0 0 64 64" className="w-full h-full -rotate-90">
                {/* Subtle warm inner disc fill */}
                <circle cx="32" cy="32" r="26" fill="#ECE9DD" />
                {/* Inactive Track (warm light gray) */}
                <circle cx="32" cy="32" r="26" fill="none" stroke="#D5D1C3" strokeWidth="6" />
                {/* Active Arc (deep forest olive/charcoal #3E523A) */}
                <circle
                  cx="32"
                  cy="32"
                  r="26"
                  fill="none"
                  stroke="#3E523A"
                  strokeWidth="6"
                  strokeDasharray="163.4"
                  strokeDashoffset={donutDashoffset}
                  strokeLinecap="butt"
                />
              </svg>
              {/* Text inside the Donut: 7 WORKS */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center leading-none">
                <span className="font-bold text-[17px] text-[#171714] leading-none select-none">{activeWorksCount}</span>
                <span className="text-[7px] font-mono font-bold uppercase tracking-wider text-[#555] mt-1 select-none">WORKS</span>
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

          {/* Bottom: 8 slim vertical bars exactly matching reference image */}
          <div className="pt-0.5">
            <div className="flex items-end justify-between px-1 h-[74px] pb-0.5">
              {bars.map((b, i) => (
                <div 
                  key={i} 
                  className="flex flex-col items-center space-y-1 group/bar cursor-pointer"
                  title={`${b.h} activity on ${b.day}`}
                >
                  <div
                    className="w-[8px] rounded-[0.5px] transition-all duration-200 group-hover/bar:brightness-75"
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
        {/* COLUMN 5: FOCUS & EXPANSIVE ARCHIVAL PROGRESS GRAPH          */}
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

          {/* Bottom: Technical Archival Chart with Y-Axis and Framed Grid Box matching reference image */}
          <div className="flex flex-col justify-end">
            <div className="flex items-start">
              {/* Y-Axis: 100, 50, 0 aligned with top border, middle dashed line, and baseline */}
              <div className="flex flex-col justify-between h-[56px] text-[7px] font-mono text-[#66655B] select-none text-right pr-1.5 w-[18px] flex-shrink-0 leading-none py-[1px]">
                <span>100</span>
                <span>50</span>
                <span>0</span>
              </div>

              {/* Framed Chart Plotting Area */}
              <div className="flex-1 flex flex-col pr-1">
                <div className="w-full relative h-[56px]">
                  <svg 
                    viewBox="0 0 100 48" 
                    preserveAspectRatio="none" 
                    className="w-full h-full overflow-visible"
                  >
                    <defs>
                      <linearGradient id="focusAreaGradExp" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#74866A" stopOpacity="0.4" />
                        <stop offset="70%" stopColor="#74866A" stopOpacity="0.1" />
                        <stop offset="100%" stopColor="#EAE7D9" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>

                    {/* Chart Box Background Tint */}
                    <rect x="0" y="0" width="100" height="44" fill="#E4DFC2" fillOpacity="0.3" />

                    {/* Chart Box Borders (Solid Framed Box) */}
                    <rect x="0" y="0" width="100" height="44" fill="none" stroke="#BDB9AA" strokeWidth="0.75" />

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
          </div>
        </div>

      </div>
    </div>
  );
}

export default OverviewMetrics;

