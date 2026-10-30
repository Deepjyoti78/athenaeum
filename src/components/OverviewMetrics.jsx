import React from 'react';

export function OverviewMetrics({ onNavigate }) {
  // Canonical reference values from Screenshot 2:
  // Column 1: TODAY 09 (FRIDAY MAY 2025)
  // Column 2: ACTIONS 12 DUE TODAY (5 To do, 4 In progress, 1 Waiting, 2 Completed)
  // Column 3: WORKS 07 ACTIVE (3 Projects, 2 Research, 1 Creative, 1 Maintenance)
  // Column 4: ENTRIES 18 THIS WEEK (7-bar activity histogram)
  // Column 5: FOCUS 65% WEEKLY PROGRESS (Sparkline chart with ≈ 12% vs last week)

  // May 2025 Calendar: May 1st was a Thursday
  // Mon Tue Wed Thu Fri Sat Sun
  const calRow1 = ['·', '·', '·', '1', '2', '3', '4'];
  const calRow2 = ['5', '6', '7', '8', '9', '10', '11'];
  const calRow3 = ['12', '13', '14', '15', '16', '17', '18'];
  const calRow4 = ['19', '20', '21', '22', '23', '24', '25'];
  const calRow5 = ['26', '27', '28', '29', '30', '31', '·'];

  // 7-day activity bar chart distribution matching Screenshot 2
  const bars = [
    { day: 'M', h: 11 },
    { day: 'T', h: 15 },
    { day: 'W', h: 22 },
    { day: 'T', h: 26 },
    { day: 'F', h: 34 },
    { day: 'S', h: 14 },
    { day: 'S', h: 5 }
  ];

  const numeralStyle = {
    fontFamily: '"Cormorant Garamond", "Newsreader", Georgia, serif',
    fontVariantNumeric: 'lining-nums tabular-nums',
    fontFeatureSettings: '"lnum" 1, "tnum" 1'
  };

  return (
    <div className="space-y-1.5 select-none font-mono">
      {/* Section Header */}
      <div className="text-[9.5px] uppercase tracking-widest font-mono font-medium text-[#77766B]">
        OVERVIEW
      </div>

      {/* Unified Archival Overview Panel — Single Continuous Box with 5 Equal Columns */}
      <div className="border border-[#AAA99B] bg-[#E9E5D8] grid grid-cols-5 divide-x divide-[#AAA99B] shadow-sm">
        
        {/* ============================================================ */}
        {/* COLUMN 1: TODAY                                              */}
        {/* ============================================================ */}
        <div 
          onClick={() => onNavigate && onNavigate('calendar')}
          className="flex flex-col justify-between p-2.5 cursor-pointer hover:bg-[#E4DFC2]/30 transition-colors h-[134px]"
          title="Click to open Archival Calendar"
        >
          {/* Top: Header & Number */}
          <div>
            <div className="text-[7.5px] uppercase tracking-wider text-[#77766B] font-medium leading-none">
              TODAY
            </div>
            <div className="flex items-baseline space-x-2 mt-1">
              <span 
                className="text-[38px] font-normal text-[#25251F] leading-none tracking-tight"
                style={numeralStyle}
              >
                09
              </span>
              <div className="flex flex-col text-[7.5px] font-mono uppercase leading-tight">
                <span className="font-semibold text-[#25251F]">FRIDAY</span>
                <span className="text-[#77766B]">MAY 2025</span>
              </div>
            </div>
          </div>

          {/* Bottom: Mini 5-week Calendar */}
          <div className="pt-2 border-t border-[#D5D1C4]">
            {/* Weekday headers: M T W T F S S */}
            <div className="grid grid-cols-7 text-[6.5px] text-[#8C8B7E] text-center mb-0.5">
              <span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span>
            </div>

            {/* Calendar Days Rows */}
            <div className="grid grid-cols-7 text-[7px] text-[#55544B] text-center gap-y-[1px] leading-tight">
              {calRow1.map((d, i) => (
                <span key={i} className={d !== '·' ? 'text-[#3E3D35]' : 'text-[#8C8B7E]/50'}>{d}</span>
              ))}
              {calRow2.map((d, i) => (
                <span 
                  key={i} 
                  className={`flex items-center justify-center h-2.5 w-2.5 mx-auto ${
                    d === '9' 
                      ? 'bg-[#25251F] text-[#E9E5D8] font-bold rounded-[0.5px]' 
                      : 'text-[#3E3D35]'
                  }`}
                >
                  {d}
                </span>
              ))}
              {calRow3.map((d, i) => (
                <span key={i} className="text-[#3E3D35]">{d}</span>
              ))}
              {calRow4.map((d, i) => (
                <span key={i} className="text-[#3E3D35]">{d}</span>
              ))}
              {calRow5.map((d, i) => (
                <span key={i} className={d !== '·' ? 'text-[#3E3D35]' : 'text-[#8C8B7E]/50'}>{d}</span>
              ))}
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* COLUMN 2: ACTIONS                                            */}
        {/* ============================================================ */}
        <div 
          onClick={() => onNavigate && onNavigate('actions')}
          className="flex flex-col justify-between p-2.5 cursor-pointer hover:bg-[#E4DFC2]/30 transition-colors h-[134px]"
          title="Click to view Action Registry"
        >
          {/* Top: Header & Number */}
          <div>
            <div className="text-[7.5px] uppercase tracking-wider text-[#77766B] font-medium leading-none">
              ACTIONS
            </div>
            <div className="flex items-baseline space-x-1.5 mt-1">
              <span 
                className="text-[38px] font-normal text-[#25251F] leading-none tracking-tight"
                style={numeralStyle}
              >
                12
              </span>
              <span className="text-[7.5px] uppercase tracking-wider text-[#77766B]">
                DUE TODAY
              </span>
            </div>
          </div>

          {/* Bottom: Breakdown List matching Screenshot 2 */}
          <div className="pt-2 border-t border-[#D5D1C4] space-y-0.5 text-[7.5px] text-[#44433A]">
            <div className="flex items-center space-x-1.5">
              <span className="text-[#77766B]">•</span>
              <span className="font-semibold text-[#25251F]">5</span>
              <span>To do</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="text-[#77766B]">•</span>
              <span className="font-semibold text-[#25251F]">4</span>
              <span>In progress</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="text-[#77766B]">•</span>
              <span className="font-semibold text-[#25251F]">1</span>
              <span>Waiting</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="text-[#77766B]">•</span>
              <span className="font-semibold text-[#25251F]">2</span>
              <span>Completed</span>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* COLUMN 3: WORKS                                              */}
        {/* ============================================================ */}
        <div 
          onClick={() => onNavigate && onNavigate('works')}
          className="flex flex-col justify-between p-2.5 cursor-pointer hover:bg-[#E4DFC2]/30 transition-colors h-[134px]"
          title="Click to view Works Catalog"
        >
          {/* Top: Header & Number */}
          <div>
            <div className="text-[7.5px] uppercase tracking-wider text-[#77766B] font-medium leading-none">
              WORKS
            </div>
            <div className="flex items-baseline space-x-1.5 mt-1">
              <span 
                className="text-[38px] font-normal text-[#25251F] leading-none tracking-tight"
                style={numeralStyle}
              >
                07
              </span>
              <span className="text-[7.5px] uppercase tracking-wider text-[#77766B]">
                ACTIVE
              </span>
            </div>
          </div>

          {/* Bottom: Works Categories & Minimalist Donut Ring */}
          <div className="pt-2 border-t border-[#D5D1C4] flex items-center justify-between">
            <div className="space-y-0.5 text-[7.5px] text-[#44433A]">
              <div><span className="font-semibold text-[#25251F]">3</span> Projects</div>
              <div><span className="font-semibold text-[#25251F]">2</span> Research</div>
              <div><span className="font-semibold text-[#25251F]">1</span> Creative</div>
              <div><span className="font-semibold text-[#25251F]">1</span> Maintenance</div>
            </div>

            {/* Clean Circular Donut Gauge matching Screenshot 2 */}
            <div className="relative w-10 h-10 flex items-center justify-center flex-shrink-0 pr-0.5">
              <svg viewBox="0 0 36 36" className="w-9 h-9 -rotate-90">
                <circle cx="18" cy="18" r="14" fill="none" stroke="#D3CFC2" strokeWidth="2.8" />
                <circle
                  cx="18"
                  cy="18"
                  r="14"
                  fill="none"
                  stroke="#25251F"
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
        {/* COLUMN 4: ENTRIES                                            */}
        {/* ============================================================ */}
        <div 
          onClick={() => onNavigate && onNavigate('entries')}
          className="flex flex-col justify-between p-2.5 cursor-pointer hover:bg-[#E4DFC2]/30 transition-colors h-[134px]"
          title="Click to view Entries Archive"
        >
          {/* Top: Header & Number */}
          <div>
            <div className="text-[7.5px] uppercase tracking-wider text-[#77766B] font-medium leading-none">
              ENTRIES
            </div>
            <div className="flex items-baseline space-x-1.5 mt-1">
              <span 
                className="text-[38px] font-normal text-[#25251F] leading-none tracking-tight"
                style={numeralStyle}
              >
                18
              </span>
              <span className="text-[7.5px] uppercase tracking-wider text-[#77766B]">
                THIS WEEK
              </span>
            </div>
          </div>

          {/* Bottom: 7-bar Activity Histogram */}
          <div className="pt-2 border-t border-[#D5D1C4]">
            <div className="flex items-end justify-between h-9 px-1">
              {bars.map((b, i) => (
                <div key={i} className="flex flex-col items-center space-y-1 w-2.5">
                  <div
                    className="w-[3.5px] bg-[#77796C] hover:bg-[#25251F] transition-colors"
                    style={{ height: `${b.h}px` }}
                  />
                  <span className="text-[6.5px] text-[#77766B]">{b.day}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* COLUMN 5: FOCUS                                              */}
        {/* ============================================================ */}
        <div className="flex flex-col justify-between p-2.5 h-[134px]">
          {/* Top: Header & Number */}
          <div>
            <div className="text-[7.5px] uppercase tracking-wider text-[#77766B] font-medium leading-none">
              FOCUS
            </div>
            <div className="flex items-baseline space-x-1.5 mt-1">
              <span 
                className="text-[38px] font-normal text-[#25251F] leading-none tracking-tight"
                style={numeralStyle}
              >
                65%
              </span>
              <span className="text-[7.5px] uppercase tracking-wider text-[#77766B]">
                WEEKLY PROGRESS
              </span>
            </div>
          </div>

          {/* Bottom: Sparkline & Comparison Text */}
          <div className="pt-2 border-t border-[#D5D1C4] flex flex-col justify-between h-10">
            <svg viewBox="0 0 100 26" className="w-full h-5 overflow-visible">
              <polyline
                fill="none"
                stroke="#616356"
                strokeWidth="1.2"
                points="5,20 22,16 40,22 60,11 78,15 95,5"
              />
              <circle cx="5" cy="20" r="1.6" fill="#25251F" />
              <circle cx="22" cy="16" r="1.6" fill="#25251F" />
              <circle cx="40" cy="22" r="1.6" fill="#25251F" />
              <circle cx="60" cy="11" r="1.6" fill="#25251F" />
              <circle cx="78" cy="15" r="1.6" fill="#25251F" />
              <circle cx="95" cy="5" r="1.8" fill="#25251F" />
            </svg>
            <div className="text-[7px] text-[#66655A] flex items-center justify-between">
              <span>≈ 12% vs last week</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
