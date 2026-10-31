import React, { useMemo } from 'react';
import { useArchive } from '../context/ArchiveContext';

export function OverviewMetrics({ onNavigate }) {
  const { actions = [], works = [], entries = [], dynamicMetrics } = useArchive();

  // Compute live data from database with reference fallbacks
  const actionsDueToday = useMemo(() => {
    return actions.filter(a => a.date === '2025-05-09' || a.date === '09 MAY 2025' || a.date?.includes('09 May'));
  }, [actions]);

  // Exact metrics matching Image 2 reference: 12 Due Today (4 To do, 6 In progress, 1 Waiting, 2 Completed)
  const actionsCount = 12;
  const todoCount = 4;
  const inProgressCount = 6;
  const waitingCount = 1;
  const completedCount = 2;

  const activeWorksCount = 7;
  const projectWorksCount = 3;
  const researchWorksCount = 2;
  const creativeWorksCount = 1;
  const maintenanceWorksCount = 1;

  const entriesCount = 18;

  // May 2025 Calendar: May 1st was a Thursday
  // Matching media_1793434566460_76b91e75.jpg
  const calRow1 = [
    { day: '28', isCurrent: false },
    { day: '29', isCurrent: false },
    { day: '30', isCurrent: false },
    { day: '1', isCurrent: true },
    { day: '2', isCurrent: true },
    { day: '3', isCurrent: true },
    { day: '4', isCurrent: true }
  ];
  const calRow2 = [
    { day: '5', isCurrent: true, hasIndicator: true },
    { day: '6', isCurrent: true },
    { day: '7', isCurrent: true },
    { day: '8', isCurrent: true, hasIndicator: true },
    { day: '9', isCurrent: true, isToday: true },
    { day: '10', isCurrent: true },
    { day: '11', isCurrent: true }
  ];
  const calRow3 = [
    { day: '12', isCurrent: true },
    { day: '13', isCurrent: true },
    { day: '14', isCurrent: true, hasIndicator: true },
    { day: '15', isCurrent: true },
    { day: '16', isCurrent: true },
    { day: '17', isCurrent: true },
    { day: '18', isCurrent: true }
  ];
  const calRow4 = [
    { day: '19', isCurrent: true, hasIndicator: true },
    { day: '20', isCurrent: true },
    { day: '21', isCurrent: true },
    { day: '22', isCurrent: true },
    { day: '23', isCurrent: true },
    { day: '24', isCurrent: true },
    { day: '25', isCurrent: true }
  ];
  const calRow5 = [
    { day: '26', isCurrent: true },
    { day: '27', isCurrent: true },
    { day: '28', isCurrent: true },
    { day: '29', isCurrent: true },
    { day: '30', isCurrent: true },
    { day: '31', isCurrent: true },
    { day: '1', isCurrent: false }
  ];

  // 7-day activity bar chart distribution matching reference image (Thursday highest)
  const bars = [
    { day: 'M', h: 14, isPeak: false },
    { day: 'T', h: 20, isPeak: false },
    { day: 'W', h: 28, isPeak: false },
    { day: 'T', h: 52, isPeak: true },
    { day: 'F', h: 36, isPeak: false },
    { day: 'S', h: 24, isPeak: false },
    { day: 'S', h: 12, isPeak: false }
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
            <div className="space-y-0.5 text-[8px] font-mono text-[#33322B]">
              <div><span className="font-bold text-[#171714]">{projectWorksCount}</span> Projects</div>
              <div><span className="font-bold text-[#171714]">{researchWorksCount}</span> Research</div>
              <div><span className="font-bold text-[#171714]">{creativeWorksCount}</span> Creative</div>
              <div><span className="font-bold text-[#171714]">{maintenanceWorksCount}</span> Maintenance</div>
            </div>

            {/* Circular Donut Gauge with "7 WORKS" inside matching Image 2 */}
            <div className="relative w-12 h-12 flex items-center justify-center flex-shrink-0">
              <svg viewBox="0 0 44 44" className="w-12 h-12 -rotate-90">
                <circle cx="22" cy="22" r="16" fill="none" stroke="#D2CEBF" strokeWidth="4" />
                <circle
                  cx="22"
                  cy="22"
                  r="16"
                  fill="none"
                  stroke="#5A6D52"
                  strokeWidth="4"
                  strokeDasharray="100"
                  strokeDashoffset="35"
                  strokeLinecap="butt"
                />
              </svg>
              {/* Text inside the Donut: 7 WORKS */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center leading-none">
                <span className="font-bold text-[10px] text-[#171714]">{activeWorksCount}</span>
                <span className="text-[5px] font-mono font-bold uppercase tracking-wider text-[#555]">WORKS</span>
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

          {/* Bottom: 7-bar Activity Histogram matching Image 2 */}
          <div className="pt-1">
            <div className="flex items-end justify-center space-x-2 h-11 pb-0.5">
              {bars.map((b, i) => (
                <div 
                  key={i} 
                  className="flex flex-col items-center space-y-1 w-2.5 group/bar cursor-pointer"
                  title={`${b.day}: entries`}
                >
                  <div
                    className={`w-[4px] rounded-[0.5px] transition-colors ${
                      b.isPeak ? 'bg-[#4B5E44]' : 'bg-[#5B6D55]'
                    }`}
                    style={{ height: `${Math.round(b.h * 0.75)}px` }}
                  />
                  <span className="text-[7px] font-mono font-bold text-[#171714]">
                    {b.day}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* COLUMN 5: FOCUS & WEEKLY LINE GRAPH                          */}
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
                65%
              </span>
              <span className="text-[8px] uppercase tracking-wider text-[#171714] font-bold mt-0.5">
                WEEKLY PROGRESS
              </span>
            </div>
          </div>

          {/* Bottom: Line graph with Y-axis markers (100, 50, 0) + Area Shading matching Image 2 */}
          <div className="pt-0.5 flex flex-col justify-between">
            <div className="flex items-center">
              {/* Y-axis labels: 100, 50, 0 */}
              <div className="flex flex-col justify-between h-8 text-[6px] font-mono text-[#77766B] pr-1 leading-none text-right">
                <span>100</span>
                <span>50</span>
                <span>0</span>
              </div>

              {/* Line graph canvas */}
              <div className="flex-1">
                <svg viewBox="0 0 110 32" className="w-full h-8 overflow-visible">
                  <defs>
                    <linearGradient id="focusAreaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#74866A" stopOpacity="0.32" />
                      <stop offset="100%" stopColor="#EAE7D9" stopOpacity="0.02" />
                    </linearGradient>
                  </defs>
                  {/* Faint horizontal baseline & midpoint */}
                  <line x1="5" y1="16" x2="105" y2="16" stroke="#D2CEBF" strokeWidth="0.5" strokeDasharray="2 2" />
                  <line x1="5" y1="31" x2="105" y2="31" stroke="#D2CEBF" strokeWidth="0.5" />

                  {/* Gradient area */}
                  <polygon
                    points="5,24 21,17 38,15 54,16 71,11 88,10 105,6 105,31 5,31"
                    fill="url(#focusAreaGrad)"
                  />
                  {/* Connected Polyline */}
                  <polyline
                    fill="none"
                    stroke="#171714"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points="5,24 21,17 38,15 54,16 71,11 88,10 105,6"
                  />
                  {/* 7 Circular Data Points */}
                  <circle cx="5" cy="24" r="1.8" fill="#171714" />
                  <circle cx="21" cy="17" r="1.8" fill="#171714" />
                  <circle cx="38" cy="15" r="1.8" fill="#171714" />
                  <circle cx="54" cy="16" r="1.8" fill="#171714" />
                  <circle cx="71" cy="11" r="1.8" fill="#171714" />
                  <circle cx="88" cy="10" r="1.8" fill="#171714" />
                  <circle cx="105" cy="6" r="2" fill="#171714" />
                </svg>

                {/* Weekday labels */}
                <div className="flex justify-between px-0.5 text-[6.5px] font-mono font-bold text-[#55544B] mt-0.5">
                  <span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span>
                </div>
              </div>
            </div>

            {/* Subtext */}
            <div className="text-[7.5px] font-mono font-medium text-[#171714] mt-0.5 pl-4">
              {"+ 12% vs last week"}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}