import React from 'react';

export function OverviewMetrics({ onNavigate }) {
  // Canonical reference values matching media_1793432314250_1b30c94c.jpg:
  // Column 1: TODAY -> 09 -> FRIDAY MAY 2025 + Mini Calendar Month Grid
  // Column 2: ACTIONS -> 12 -> DUE TODAY + (4 To do, 6 In progress, 1 Waiting, 2 Completed)
  // Column 3: WORKS -> 07 -> ACTIVE + (3 Projects, 2 Research, 1 Creative, 1 Maintenance) + Donut Ring
  // Column 4: ENTRIES -> 18 -> THIS WEEK + 7-bar activity histogram with M T W T F S S
  // Column 5: FOCUS -> 65% -> WEEKLY PROGRESS + Area Sparkline with M T W T F S S + "+ 12% vs last week"

  // May 2025 Calendar: May 1st was a Thursday
  // Mon Tue Wed Thu Fri Sat Sun
  const calRow1 = ['', '', '', '1', '2', '3', '4'];
  const calRow2 = ['5', '6', '7', '8', '9', '10', '11'];
  const calRow3 = ['12', '13', '14', '15', '16', '17', '18'];
  const calRow4 = ['19', '20', '21', '22', '23', '24', '25'];
  const calRow5 = ['26', '27', '28', '29', '30', '31', ''];

  // 7-day activity bar chart distribution matching reference image
  const bars = [
    { day: 'M', count: 2, h: 14 },
    { day: 'T', count: 3, h: 20 },
    { day: 'W', count: 4, h: 28 },
    { day: 'T', count: 5, h: 38 },
    { day: 'F', count: 6, h: 52 },
    { day: 'S', count: 2, h: 24 },
    { day: 'S', count: 1, h: 16 }
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
      <div className="flex items-center justify-between text-[10px] uppercase font-mono font-bold text-[#25251F]">
        <div className="flex items-center space-x-1.5">
          <span className="w-1.5 h-1.5 bg-[#25251F] inline-block" />
          <span className="tracking-widest">OVERVIEW</span>
        </div>
        <span className="text-[8.5px] font-mono font-normal text-[#77766B] tracking-wider">
          SYSTEM_METRICS // MAY 2025
        </span>
      </div>

      {/* Unified Archival Overview Panel — Continuous 5-Column Box matching reference image */}
      <div className="border border-[#AAA99B] bg-[#E9E5D8] grid grid-cols-5 divide-x divide-[#AAA99B] shadow-sm">
        
        {/* ============================================================ */}
        {/* COLUMN 1: TODAY & ARCHIVAL CALENDAR                          */}
        {/* ============================================================ */}
        <div 
          onClick={() => onNavigate && onNavigate('calendar')}
          className="flex flex-col justify-between p-3.5 pb-4 cursor-pointer hover:bg-[#E4DFC2]/30 transition-colors h-[196px]"
          title="Click to open Archival Calendar"
        >
          {/* Top: Header, Number, Subtitle below */}
          <div>
            <div className="text-[9px] uppercase tracking-wider text-[#25251F] font-bold leading-none">
              TODAY
            </div>
            <div className="flex flex-col mt-0.5">
              <span 
                className="text-[46px] font-bold text-[#141512] leading-none tracking-tight select-none"
                style={numeralStyle}
              >
                09
              </span>
              <div className="flex items-center space-x-1.5 text-[8px] font-mono uppercase leading-tight mt-1">
                <span className="font-bold text-[#141512]">FRIDAY</span>
                <span className="text-[#88877A] font-medium">MAY 2025</span>
              </div>
            </div>
          </div>

          {/* Bottom: Mini 5-week Calendar Month Grid */}
          <div className="pt-2">
            {/* Weekday headers: M T W T F S S */}
            <div className="grid grid-cols-7 text-[7px] font-mono font-bold text-[#55544B] text-center mb-1">
              <span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span>
            </div>

            {/* Calendar Days Rows */}
            <div className="space-y-[1.5px]">
              {/* Row 1 */}
              <div className="grid grid-cols-7 text-[7.5px] font-mono text-center">
                {calRow1.map((d, i) => (
                  <span key={i} className="h-3.5 w-3.5 flex items-center justify-center mx-auto text-[#3E3D35] font-medium">
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
                        ? 'bg-[#141512] text-[#FAF8F3] font-bold rounded-[0.5px] shadow-sm' 
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
                  <span key={i} className="h-3.5 w-3.5 flex items-center justify-center mx-auto text-[#3E3D35] font-medium hover:bg-[#D5D1C4] rounded-[0.5px]">
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
          className="flex flex-col justify-between p-3.5 pb-4 cursor-pointer hover:bg-[#E4DFC2]/30 transition-colors h-[196px]"
          title="Click to view Action Registry"
        >
          {/* Top: Header, Number, Subtitle below */}
          <div>
            <div className="text-[9px] uppercase tracking-wider text-[#25251F] font-bold leading-none">
              ACTIONS
            </div>
            <div className="flex flex-col mt-0.5">
              <span 
                className="text-[46px] font-bold text-[#141512] leading-none tracking-tight select-none"
                style={numeralStyle}
              >
                12
              </span>
              <span className="text-[8px] uppercase tracking-wider text-[#44433A] font-bold mt-1">
                DUE TODAY
              </span>
            </div>
          </div>

          {/* Bottom: Breakdown List matching media_1793432314250_1b30c94c.jpg */}
          <div className="pt-2 space-y-1.5 text-[8.5px] font-mono text-[#33322B]">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-[#141512] w-2.5">4</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#77796C] inline-block" />
              <span className="text-[#33322B] font-medium">To do</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-[#141512] w-2.5">6</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#738A62] inline-block" />
              <span className="text-[#33322B] font-medium">In progress</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-[#141512] w-2.5">1</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#8E8B7B] inline-block" />
              <span className="text-[#33322B] font-medium">Waiting</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-[#141512] w-2.5">2</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#4F6D48] inline-block" />
              <span className="text-[#33322B] font-medium">Completed</span>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* COLUMN 3: WORKS                                              */}
        {/* ============================================================ */}
        <div 
          onClick={() => onNavigate && onNavigate('works')}
          className="flex flex-col justify-between p-3.5 pb-4 cursor-pointer hover:bg-[#E4DFC2]/30 transition-colors h-[196px]"
          title="Click to view Works Catalog"
        >
          {/* Top: Header, Number, Subtitle below */}
          <div>
            <div className="text-[9px] uppercase tracking-wider text-[#25251F] font-bold leading-none">
              WORKS
            </div>
            <div className="flex flex-col mt-0.5">
              <span 
                className="text-[46px] font-bold text-[#141512] leading-none tracking-tight select-none"
                style={numeralStyle}
              >
                07
              </span>
              <span className="text-[8px] uppercase tracking-wider text-[#44433A] font-bold mt-1">
                ACTIVE
              </span>
            </div>
          </div>

          {/* Bottom: Works Categories & Minimalist Donut Ring */}
          <div className="pt-2 flex items-center justify-between">
            <div className="space-y-1 text-[8.5px] font-mono text-[#33322B]">
              <div><span className="font-bold text-[#141512]">3</span> Projects</div>
              <div><span className="font-bold text-[#141512]">2</span> Research</div>
              <div><span className="font-bold text-[#141512]">1</span> Creative</div>
              <div><span className="font-bold text-[#141512]">1</span> Maintenance</div>
            </div>

            {/* Clean Circular Donut Gauge matching reference image */}
            <div className="relative w-12 h-12 flex items-center justify-center flex-shrink-0 pr-1">
              <svg viewBox="0 0 36 36" className="w-11 h-11 -rotate-90">
                <circle cx="18" cy="18" r="14" fill="none" stroke="#DCD8CB" strokeWidth="2.8" />
                <circle
                  cx="18"
                  cy="18"
                  r="14"
                  fill="none"
                  stroke="#141512"
                  strokeWidth="2.8"
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
          className="flex flex-col justify-between p-3.5 pb-4 cursor-pointer hover:bg-[#E4DFC2]/30 transition-colors h-[196px]"
          title="Click to view Entries Archive"
        >
          {/* Top: Header, Number, Subtitle below */}
          <div>
            <div className="text-[9px] uppercase tracking-wider text-[#25251F] font-bold leading-none">
              ENTRIES
            </div>
            <div className="flex flex-col mt-0.5">
              <span 
                className="text-[46px] font-bold text-[#141512] leading-none tracking-tight select-none"
                style={numeralStyle}
              >
                18
              </span>
              <span className="text-[8px] uppercase tracking-wider text-[#44433A] font-bold mt-1">
                THIS WEEK
              </span>
            </div>
          </div>

          {/* Bottom: 7-bar Activity Histogram matching media_1793432314250_1b30c94c.jpg */}
          <div className="pt-2">
            <div className="flex items-end justify-center space-x-2.5 h-14 pb-0.5">
              {bars.map((b, i) => (
                <div 
                  key={i} 
                  className="flex flex-col items-center space-y-1.5 w-3 group/bar cursor-pointer"
                  title={`${b.day}: ${b.count} entries`}
                >
                  <div
                    className="w-[5px] bg-[#2E3027] group-hover/bar:bg-[#141512] transition-colors rounded-[0.5px]"
                    style={{ height: `${b.h}px` }}
                  />
                  <span className="text-[7.5px] font-mono font-bold text-[#25251F] group-hover/bar:text-[#141512]">
                    {b.day}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* COLUMN 5: FOCUS & PROGRESS AREA SPARKLINE                    */}
        {/* ============================================================ */}
        <div className="flex flex-col justify-between p-3.5 pb-4 h-[196px]">
          {/* Top: Header, Number, Subtitle below */}
          <div>
            <div className="text-[9px] uppercase tracking-wider text-[#25251F] font-bold leading-none">
              FOCUS
            </div>
            <div className="flex flex-col mt-0.5">
              <span 
                className="text-[46px] font-bold text-[#141512] leading-none tracking-tight select-none"
                style={numeralStyle}
              >
                65%
              </span>
              <span className="text-[8px] uppercase tracking-wider text-[#44433A] font-bold mt-1">
                WEEKLY PROGRESS
              </span>
            </div>
          </div>

          {/* Bottom: Area Sparkline with M T W T F S S + "+ 12% vs last week" */}
          <div className="pt-1 flex flex-col justify-between h-16">
            <div className="px-0.5">
              <svg viewBox="0 0 120 36" className="w-full h-8 overflow-visible">
                <defs>
                  <linearGradient id="focusAreaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#77796C" stopOpacity="0.38" />
                    <stop offset="100%" stopColor="#E9E5D8" stopOpacity="0.05" />
                  </linearGradient>
                </defs>
                {/* Gradient filled area */}
                <polygon
                  points="8,28 24,24 42,18 60,19 78,14 96,12 114,5 114,34 8,34"
                  fill="url(#focusAreaGrad)"
                />
                {/* Connecting Trend Polyline */}
                <polyline
                  fill="none"
                  stroke="#141512"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points="8,28 24,24 42,18 60,19 78,14 96,12 114,5"
                />
                {/* 7 Node Dots */}
                <circle cx="8" cy="28" r="2" fill="#141512" />
                <circle cx="24" cy="24" r="2" fill="#141512" />
                <circle cx="42" cy="18" r="2" fill="#141512" />
                <circle cx="60" cy="19" r="2" fill="#141512" />
                <circle cx="78" cy="14" r="2" fill="#141512" />
                <circle cx="96" cy="12" r="2" fill="#141512" />
                <circle cx="114" cy="5" r="2.2" fill="#141512" />
              </svg>

              {/* 7 Day labels underneath the sparkline */}
              <div className="flex justify-between px-1 text-[7px] font-mono font-bold text-[#55544B] mt-1">
                <span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span>
              </div>
            </div>

            <div className="text-[7.5px] font-mono font-medium text-[#25251F] mt-1">
              {"+ 12% vs last week"}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
