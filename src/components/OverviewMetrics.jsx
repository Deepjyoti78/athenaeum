import React from 'react';

export function OverviewMetrics({ onNavigate }) {
  // Canonical reference values from Reference Screenshot:
  // Column 1: TODAY 09 (FRIDAY MAY 2025) + Mini Calendar Month Grid
  // Column 2: ACTIONS 12 DUE TODAY (5 To do, 4 In progress, 1 Waiting, 2 Completed)
  // Column 3: WORKS 07 ACTIVE (3 Projects, 2 Research, 1 Creative, 1 Maintenance) + Donut Ring
  // Column 4: ENTRIES 18 THIS WEEK (7-bar activity histogram)
  // Column 5: FOCUS 65% WEEKLY PROGRESS (Sparkline chart with ▲ 12% vs last week)

  // May 2025 Calendar: May 1st was a Thursday
  // Mon Tue Wed Thu Fri Sat Sun
  const calRow1 = ['·', '·', '·', '1', '2', '3', '4'];
  const calRow2 = ['5', '6', '7', '8', '9', '10', '11'];
  const calRow3 = ['12', '13', '14', '15', '16', '17', '18'];
  const calRow4 = ['19', '20', '21', '22', '23', '24', '25'];
  const calRow5 = ['26', '27', '28', '29', '30', '31', '·'];

  // 7-day activity bar chart distribution matching Reference Image
  const bars = [
    { day: 'M', count: 2, h: 16 },
    { day: 'T', count: 3, h: 22 },
    { day: 'W', count: 4, h: 28 },
    { day: 'T', count: 5, h: 36 },
    { day: 'F', count: 6, h: 48 },
    { day: 'S', count: 2, h: 18 },
    { day: 'S', count: 1, h: 10 }
  ];

  const numeralStyle = {
    fontFamily: '"Cormorant Garamond", "Newsreader", Georgia, serif',
    fontWeight: 700,
    fontVariantNumeric: 'lining-nums tabular-nums',
    fontFeatureSettings: '"lnum" 1, "tnum" 1'
  };

  return (
    <div className="space-y-1.5 select-none font-mono">
      {/* Section Header */}
      <div className="flex items-center justify-between text-[10px] uppercase tracking-widest font-mono font-bold text-[#25251F]">
        <div className="flex items-center space-x-1.5">
          <span className="w-1.5 h-1.5 bg-[#25251F] inline-block"></span>
          <span>OVERVIEW</span>
        </div>
        <span className="text-[8px] font-medium text-[#77766B] tracking-wider">
          SYSTEM_METRICS // MAY 2025
        </span>
      </div>

      {/* Unified Archival Overview Panel — Elongated Continuous Box with 5 Equal Columns */}
      <div className="border border-[#AAA99B] bg-[#E9E5D8] grid grid-cols-5 divide-x divide-[#AAA99B] shadow-sm">
        
        {/* ============================================================ */}
        {/* COLUMN 1: TODAY & ARCHIVAL CALENDAR                          */}
        {/* ============================================================ */}
        <div 
          onClick={() => onNavigate && onNavigate('calendar')}
          className="flex flex-col justify-between p-3 cursor-pointer hover:bg-[#E4DFC2]/40 transition-colors h-[174px] group"
          title="Click to open Archival Calendar"
        >
          {/* Top: Header & Number */}
          <div>
            <div className="text-[8.5px] uppercase tracking-wider text-[#25251F] font-bold leading-none flex items-center justify-between">
              <span>TODAY</span>
              <span className="text-[7px] text-[#77766B] group-hover:text-[#25251F] font-mono transition-colors">↗</span>
            </div>
            <div className="flex items-baseline space-x-2.5 mt-1.5">
              <span 
                className="text-[44px] font-bold text-[#141512] leading-none tracking-tight select-none"
                style={numeralStyle}
              >
                09
              </span>
              <div className="flex flex-col text-[8.5px] font-mono uppercase leading-tight">
                <span className="font-bold text-[#141512] tracking-wide">FRIDAY</span>
                <span className="text-[7.5px] font-semibold text-[#55544B] tracking-wider mt-0.5">MAY 2025</span>
              </div>
            </div>
          </div>

          {/* Bottom: Mini 5-week Calendar Month Grid */}
          <div className="pt-2 border-t border-[#AAA99B]">
            {/* Weekday headers: M T W T F S S */}
            <div className="grid grid-cols-7 text-[7px] font-mono font-bold text-[#55544B] text-center mb-1">
              <span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span>
            </div>

            {/* Calendar Days Rows */}
            <div className="space-y-[2px]">
              {/* Row 1 */}
              <div className="grid grid-cols-7 text-[7.5px] font-mono text-center">
                {calRow1.map((d, i) => (
                  <span key={i} className={`h-3.5 w-3.5 flex items-center justify-center mx-auto ${d !== '·' ? 'text-[#3E3D35] font-medium' : 'text-[#AAA99B]/50'}`}>
                    {d}
                  </span>
                ))}
              </div>
              {/* Row 2 (contains Today: 9) */}
              <div className="grid grid-cols-7 text-[7.5px] font-mono text-center">
                {calRow2.map((d, i) => (
                  <span 
                    key={i} 
                    className={`h-3.5 w-3.5 flex items-center justify-center mx-auto ${
                      d === '9' 
                        ? 'bg-[#1E1F1A] text-[#FAF8F3] font-bold rounded-[0.5px] shadow-sm' 
                        : 'text-[#3E3D35] font-medium hover:bg-[#D5D1C4] rounded-[0.5px]'
                    }`}
                  >
                    {d}
                  </span>
                ))}
              </div>
              {/* Row 3 */}
              <div className="grid grid-cols-7 text-[7.5px] font-mono text-center">
                {calRow3.map((d, i) => (
                  <span key={i} className="h-3.5 w-3.5 flex items-center justify-center mx-auto text-[#3E3D35] font-medium hover:bg-[#D5D1C4] rounded-[0.5px]">
                    {d}
                  </span>
                ))}
              </div>
              {/* Row 4 */}
              <div className="grid grid-cols-7 text-[7.5px] font-mono text-center">
                {calRow4.map((d, i) => (
                  <span key={i} className="h-3.5 w-3.5 flex items-center justify-center mx-auto text-[#3E3D35] font-medium hover:bg-[#D5D1C4] rounded-[0.5px]">
                    {d}
                  </span>
                ))}
              </div>
              {/* Row 5 */}
              <div className="grid grid-cols-7 text-[7.5px] font-mono text-center">
                {calRow5.map((d, i) => (
                  <span key={i} className={`h-3.5 w-3.5 flex items-center justify-center mx-auto ${d !== '·' ? 'text-[#3E3D35] font-medium hover:bg-[#D5D1C4] rounded-[0.5px]' : 'text-[#AAA99B]/50'}`}>
                    {d}
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
          className="flex flex-col justify-between p-3 cursor-pointer hover:bg-[#E4DFC2]/40 transition-colors h-[174px] group"
          title="Click to view Action Registry"
        >
          {/* Top: Header & Number */}
          <div>
            <div className="text-[8.5px] uppercase tracking-wider text-[#25251F] font-bold leading-none flex items-center justify-between">
              <span>ACTIONS</span>
              <span className="text-[7px] text-[#77766B] group-hover:text-[#25251F] font-mono transition-colors">↗</span>
            </div>
            <div className="flex items-baseline space-x-2 mt-1.5">
              <span 
                className="text-[44px] font-bold text-[#141512] leading-none tracking-tight select-none"
                style={numeralStyle}
              >
                12
              </span>
              <span className="text-[8px] uppercase tracking-wider text-[#44433A] font-bold">
                DUE TODAY
              </span>
            </div>
          </div>

          {/* Bottom: Breakdown List matching Reference Image */}
          <div className="pt-2.5 border-t border-[#AAA99B] space-y-1 text-[8px] font-mono text-[#33322B]">
            <div className="flex items-center space-x-2">
              <span className="text-[#66655A] font-bold">•</span>
              <span className="font-bold text-[#141512] w-2.5">5</span>
              <span className="text-[#33322B] font-medium">To do</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-[#66655A] font-bold">•</span>
              <span className="font-bold text-[#141512] w-2.5">4</span>
              <span className="text-[#33322B] font-medium">In progress</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-[#66655A] font-bold">•</span>
              <span className="font-bold text-[#141512] w-2.5">1</span>
              <span className="text-[#33322B] font-medium">Waiting</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-[#66655A] font-bold">•</span>
              <span className="font-bold text-[#141512] w-2.5">2</span>
              <span className="text-[#33322B] font-medium">Completed</span>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* COLUMN 3: WORKS                                              */}
        {/* ============================================================ */}
        <div 
          onClick={() => onNavigate && onNavigate('works')}
          className="flex flex-col justify-between p-3 cursor-pointer hover:bg-[#E4DFC2]/40 transition-colors h-[174px] group"
          title="Click to view Works Catalog"
        >
          {/* Top: Header & Number */}
          <div>
            <div className="text-[8.5px] uppercase tracking-wider text-[#25251F] font-bold leading-none flex items-center justify-between">
              <span>WORKS</span>
              <span className="text-[7px] text-[#77766B] group-hover:text-[#25251F] font-mono transition-colors">↗</span>
            </div>
            <div className="flex items-baseline space-x-2 mt-1.5">
              <span 
                className="text-[44px] font-bold text-[#141512] leading-none tracking-tight select-none"
                style={numeralStyle}
              >
                07
              </span>
              <span className="text-[8px] uppercase tracking-wider text-[#44433A] font-bold">
                ACTIVE
              </span>
            </div>
          </div>

          {/* Bottom: Works Categories & Minimalist Donut Ring */}
          <div className="pt-2.5 border-t border-[#AAA99B] flex items-center justify-between">
            <div className="space-y-1 text-[8px] font-mono text-[#33322B]">
              <div><span className="font-bold text-[#141512]">3</span> Projects</div>
              <div><span className="font-bold text-[#141512]">2</span> Research</div>
              <div><span className="font-bold text-[#141512]">1</span> Creative</div>
              <div><span className="font-bold text-[#141512]">1</span> Maintenance</div>
            </div>

            {/* Clean Circular Donut Gauge matching Reference Image */}
            <div className="relative w-12 h-12 flex items-center justify-center flex-shrink-0 pr-1">
              <svg viewBox="0 0 36 36" className="w-11 h-11 -rotate-90">
                <circle cx="18" cy="18" r="14" fill="none" stroke="#D3CFC2" strokeWidth="3" />
                <circle
                  cx="18"
                  cy="18"
                  r="14"
                  fill="none"
                  stroke="#1E1F1A"
                  strokeWidth="3"
                  strokeDasharray="88"
                  strokeDashoffset="31"
                  strokeLinecap="butt"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* COLUMN 4: ENTRIES & WEEKLY HISTOGRAM                         */}
        {/* ============================================================ */}
        <div 
          onClick={() => onNavigate && onNavigate('entries')}
          className="flex flex-col justify-between p-3 cursor-pointer hover:bg-[#E4DFC2]/40 transition-colors h-[174px] group"
          title="Click to view Entries Archive"
        >
          {/* Top: Header & Number */}
          <div>
            <div className="text-[8.5px] uppercase tracking-wider text-[#25251F] font-bold leading-none flex items-center justify-between">
              <span>ENTRIES</span>
              <span className="text-[7px] text-[#77766B] group-hover:text-[#25251F] font-mono transition-colors">↗</span>
            </div>
            <div className="flex items-baseline space-x-2 mt-1.5">
              <span 
                className="text-[44px] font-bold text-[#141512] leading-none tracking-tight select-none"
                style={numeralStyle}
              >
                18
              </span>
              <span className="text-[8px] uppercase tracking-wider text-[#44433A] font-bold">
                THIS WEEK
              </span>
            </div>
          </div>

          {/* Bottom: 7-bar Activity Histogram */}
          <div className="pt-2.5 border-t border-[#AAA99B]">
            <div className="flex items-end justify-between h-14 px-1.5 pb-0.5 border-b border-[#AAA99B]/50">
              {bars.map((b, i) => (
                <div 
                  key={i} 
                  className="flex flex-col items-center space-y-1.5 w-3 group/bar cursor-pointer"
                  title={`${b.day}: ${b.count} entries`}
                >
                  <div
                    className="w-[4.5px] bg-[#3E4035] group-hover/bar:bg-[#141512] transition-colors rounded-[0.5px]"
                    style={{ height: `${b.h}px` }}
                  />
                  <span className="text-[7.5px] font-mono font-bold text-[#44433A] group-hover/bar:text-[#141512]">
                    {b.day}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* COLUMN 5: FOCUS & PROGRESS SPARKLINE                         */}
        {/* ============================================================ */}
        <div className="flex flex-col justify-between p-3 h-[174px]">
          {/* Top: Header & Number */}
          <div>
            <div className="text-[8.5px] uppercase tracking-wider text-[#25251F] font-bold leading-none">
              FOCUS
            </div>
            <div className="flex items-baseline space-x-2 mt-1.5">
              <span 
                className="text-[44px] font-bold text-[#141512] leading-none tracking-tight select-none"
                style={numeralStyle}
              >
                65%
              </span>
              <span className="text-[8px] uppercase tracking-wider text-[#44433A] font-bold">
                WEEKLY PROGRESS
              </span>
            </div>
          </div>

          {/* Bottom: Sparkline & Comparison Text */}
          <div className="pt-2.5 border-t border-[#AAA99B] flex flex-col justify-between h-14">
            <div className="pt-1">
              <svg viewBox="0 0 120 28" className="w-full h-7 overflow-visible">
                {/* Hairline baseline */}
                <line x1="0" y1="26" x2="120" y2="26" stroke="#D3CFC2" strokeWidth="0.8" strokeDasharray="2 2" />
                {/* Trend Polyline */}
                <polyline
                  fill="none"
                  stroke="#3E4035"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points="6,22 26,16 48,23 72,11 94,15 114,5"
                />
                {/* Vertex Dots */}
                <circle cx="6" cy="22" r="2.2" fill="#1E1F1A" />
                <circle cx="26" cy="16" r="2.2" fill="#1E1F1A" />
                <circle cx="48" cy="23" r="2.2" fill="#1E1F1A" />
                <circle cx="72" cy="11" r="2.2" fill="#1E1F1A" />
                <circle cx="94" cy="15" r="2.2" fill="#1E1F1A" />
                <circle cx="114" cy="5" r="2.4" fill="#1E1F1A" />
              </svg>
            </div>
            <div className="text-[8px] font-mono font-bold text-[#2E4A28] flex items-center space-x-1 mt-1">
              <span>▲</span>
              <span>12% vs last week</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
