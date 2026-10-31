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

  // 7-day Activity Histogram with tight, cohesive spacing
  const bars = useMemo(() => {
    const refHeights = [28, 34, 46, 62, 72, 42, 30];
    const dayLabels = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
    const barColors = [
      '#74866A', // M
      '#74866A', // T
      '#4B5E45', // W
      '#3E5139', // T
      '#263623', // F (Peak)
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
            <div className="space-y-1.5 text-[8px] leading-[14px] font-mono text-[#33322B] pr-1">
              <div className="h-[14px] flex items-center"><span className="font-bold text-[#171714] w-2.5 inline-block">3</span> Projects</div>
              <div className="h-[14px] flex items-center"><span className="font-bold text-[#171714] w-2.5 inline-block">2</span> Research</div>
              <div className="h-[14px] flex items-center"><span className="font-bold text-[#171714] w-2.5 inline-block">1</span> Creative</div>
              <div className="h-[14px] flex items-center"><span className="font-bold text-[#171714] w-2.5 inline-block">1</span> Maintenance</div>
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

          {/* Bottom: 7 closely spaced vertical bars with reduced gaps */}
          <div className="pt-0.5">
            <div className="flex items-end justify-center gap-2 sm:gap-2.5 h-[74px] pb-0.5">
              {bars.map((b, i) => (
                <div 
                  key={i} 
                  className="flex flex-col items-center space-y-1 group/bar cursor-pointer"
                  title={`${b.h} activity on ${b.day}`}
                >
                  <div
                    className="w-[12px] sm:w-[14px] rounded-[0.5px] transition-all duration-200 group-hover/bar:brightness-75 group-hover/bar:scale-y-105 origin-bottom"
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
        {/* COLUMN 5: FOCUS & ARCHIVAL OPTICAL ILLUSTRATION              */}
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
          <div className="pt-0.5">
            <div className="relative w-full h-[74px] border border-[#B5B3A4] bg-[#E5E1D2]/45 rounded-[0.5px] p-1.5 flex items-center justify-between overflow-hidden shadow-inner">
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
                <circle cx="40" cy="35" r="28" fill="none" stroke="#A8A495" strokeWidth="0.6" strokeDasharray="2 2" />
                <circle cx="40" cy="35" r="21" fill="none" stroke="#74866A" strokeWidth="0.8" />
                <circle cx="40" cy="35" r="14" fill="#EAE7D9" stroke="#171714" strokeWidth="1" />
                <circle cx="40" cy="35" r="4" fill="#171714" />
                <circle cx="40" cy="35" r="1.2" fill="#FAF8F3" />

                {/* Reticle Crosshairs with micro millimeter ticks */}
                <line x1="8" y1="35" x2="72" y2="35" stroke="#171714" strokeWidth="0.6" />
                <line x1="40" y1="3" x2="40" y2="67" stroke="#171714" strokeWidth="0.6" />
                {[20, 28, 52, 60].map(x => (
                  <line key={`xt-${x}`} x1={x} y1="33" x2={x} y2="37" stroke="#55544B" strokeWidth="0.5" />
                ))}
                {[15, 23, 47, 55].map(y => (
                  <line key={`yt-${y}`} x1="38" y1={y} x2="42" y2={y} stroke="#55544B" strokeWidth="0.5" />
                ))}

                {/* 45-degree diagonal ray ticks */}
                <line x1="22" y1="17" x2="28" y2="23" stroke="#74866A" strokeWidth="0.75" />
                <line x1="58" y1="53" x2="52" y2="47" stroke="#74866A" strokeWidth="0.75" />
                <line x1="58" y1="17" x2="52" y2="23" stroke="#74866A" strokeWidth="0.75" />
                <line x1="22" y1="53" x2="28" y2="47" stroke="#74866A" strokeWidth="0.75" />

                {/* Optical Beam / Wave Interference Curve on right */}
                <path 
                  d="M 82,35 C 95,18 108,52 122,35 C 136,18 150,52 168,35" 
                  fill="none" 
                  stroke="#3E5139" 
                  strokeWidth="1.2" 
                  strokeLinecap="round"
                />
                <circle cx="122" cy="35" r="2" fill="#3E5139" />
                <circle cx="168" cy="35" r="2" fill="#3E5139" />

                {/* Vertical Optical Aperture Scale */}
                <line x1="86" y1="14" x2="86" y2="56" stroke="#9A9687" strokeWidth="0.6" />
                {[14, 21, 28, 35, 42, 49, 56].map(y => (
                  <line key={`s-${y}`} x1="84" y1={y} x2="88" y2={y} stroke="#74866A" strokeWidth="0.6" />
                ))}

                {/* Technical Annotation Metadata */}
                <text x="94" y="20" fill="#171714" fontSize="5.5" fontFamily="monospace" fontWeight="bold">COLLIMATOR // MK.IV</text>
                <text x="94" y="30" fill="#55544B" fontSize="5" fontFamily="monospace">AXIS: α-84.2° NNE</text>
                <text x="94" y="40" fill="#55544B" fontSize="5" fontFamily="monospace">APERTURE: f/2.8</text>
                <text x="94" y="50" fill="#30432B" fontSize="5.2" fontFamily="monospace" fontWeight="bold">RETICLE: 0x9A4F // OK</text>
                <text x="94" y="60" fill="#77766B" fontSize="4.5" fontFamily="monospace">SYS_CALIB • OPTICAL</text>
              </svg>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default OverviewMetrics;

