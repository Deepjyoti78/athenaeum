import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronDown, 
  MoreVertical, 
  Plus, 
  CheckSquare, 
  Square 
} from 'lucide-react';

export function CalendarView({ actions = [], entries = [], onAddEntry }) {
  const [selectedDay, setSelectedDay] = useState(9);
  const [activeTab, setActiveTab] = useState('MONTH'); // 'MONTH' | 'WEEK' | 'LIST'
  const [checkedItems, setCheckedItems] = useState({});

  const toggleCheck = (idx) => {
    setCheckedItems((prev) => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  // May 2025 calendar days matching media_1793432962383_8d7b3679.jpg
  // May 1 was a Thursday
  // Row 1 starts with 28, 29, 30 from April (muted), then 1, 2, 3, 4
  const calendarCells = [
    // Row 1
    { day: 28, isCurrentMonth: false },
    { day: 29, isCurrentMonth: false },
    { day: 30, isCurrentMonth: false },
    { 
      day: 1, 
      isCurrentMonth: true, 
      dotColor: '#738A62', 
      pill: 'Athenaeum Pro...', 
      more: '+2 more' 
    },
    { day: 2, isCurrentMonth: true },
    { day: 3, isCurrentMonth: true },
    { day: 4, isCurrentMonth: true },

    // Row 2
    { day: 5, isCurrentMonth: true, dotColor: '#77766B' },
    { day: 6, isCurrentMonth: true },
    { 
      day: 7, 
      isCurrentMonth: true, 
      dotColor: '#25251F', 
      pill: 'Anatomical no...', 
      more: '+1 more' 
    },
    { 
      day: 8, 
      isCurrentMonth: true, 
      dotColor: '#25251F', 
      pill: 'Interview doc...', 
      more: '+3 more' 
    },
    { 
      day: 9, 
      isCurrentMonth: true, 
      dotColor: '#738A62', 
      pill: 'Project plann...', 
      more: '+5 more' 
    },
    { day: 10, isCurrentMonth: true },
    { day: 11, isCurrentMonth: true },

    // Row 3
    { day: 12, isCurrentMonth: true },
    { day: 13, isCurrentMonth: true },
    { day: 14, isCurrentMonth: true },
    { 
      day: 15, 
      isCurrentMonth: true, 
      dotColor: '#738A62', 
      pill: 'Target: Print...' 
    },
    { day: 16, isCurrentMonth: true },
    { day: 17, isCurrentMonth: true },
    { day: 18, isCurrentMonth: true },

    // Row 4
    { day: 19, isCurrentMonth: true },
    { day: 20, isCurrentMonth: true },
    { day: 21, isCurrentMonth: true },
    { day: 22, isCurrentMonth: true },
    { day: 23, isCurrentMonth: true, dotColor: '#738A62' },
    { day: 24, isCurrentMonth: true },
    { day: 25, isCurrentMonth: true },

    // Row 5
    { day: 26, isCurrentMonth: true },
    { day: 27, isCurrentMonth: true },
    { day: 28, isCurrentMonth: true },
    { day: 29, isCurrentMonth: true },
    { 
      day: 30, 
      isCurrentMonth: true, 
      dotColor: '#738A62', 
      pill: 'Target: Athen...' 
    },
    { day: 31, isCurrentMonth: true },
    { day: 1, isCurrentMonth: false } // June 1
  ];

  // Scheduled agenda items for 09 MAY 2025 matching reference image
  const dayItems = [
    {
      time: '08:15',
      title: 'Project planning thoughts',
      type: 'ENTRY',
      isSolidNode: true,
      desc: 'Initial ideas for the new archival system and feature list.'
    },
    {
      time: '09:30',
      title: 'Design database schema',
      type: 'ACTION',
      isSolidNode: false,
      project: 'Athenaeum App Project',
      todo: 'Finalize schema structure'
    },
    {
      time: '11:00',
      title: 'Research Victorian dock maps',
      type: 'ACTION',
      isSolidNode: false,
      project: 'East London Heritage Archive',
      todo: 'Collect more reference images'
    },
    {
      time: '14:00',
      title: 'Model turntable in Blender',
      type: 'ACTION',
      isSolidNode: false,
      project: 'Creature Concept Explorations',
      todo: 'Complete initial render'
    },
    {
      time: '15:30',
      title: 'Write journal entry',
      type: 'ACTION',
      isSolidNode: false,
      project: 'Daily Journal',
      todo: "Write about today's progress"
    },
    {
      time: '17:00',
      title: 'Review photography shots',
      type: 'ACTION',
      isSolidNode: false,
      project: 'Photography Portfolio',
      todo: 'Select final 10 photos'
    }
  ];

  const numeralStyle = {
    fontFamily: '"Cormorant Garamond", "Newsreader", Georgia, serif',
    fontWeight: 700,
    fontVariantNumeric: 'lining-nums tabular-nums',
    fontFeatureSettings: '"lnum" 1, "tnum" 1'
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#E9E5D8] overflow-hidden select-none font-mono text-[#25251F]">
      {/* 1. Top Bar */}
      <div className="h-10 px-3.5 border-b border-[#AAA99B] bg-[#E9E5D8] flex items-center justify-between flex-shrink-0">
        {/* Left: Section Header */}
        <div className="flex items-center space-x-1.5">
          <span className="w-1.5 h-1.5 bg-[#25251F] inline-block" />
          <h1 className="text-[10px] font-bold uppercase tracking-widest text-[#25251F]">
            ARCHIVAL CALENDAR &amp; TIMELINE
          </h1>
        </div>

        {/* Right: Controls matching reference image */}
        <div className="flex items-center space-x-1.5 text-[8.5px] font-mono">
          <button 
            onClick={() => setSelectedDay(9)}
            className="px-2.5 py-1 border border-[#AAA99B] bg-[#EAE6D9] hover:bg-[#DDD8CB] font-bold uppercase tracking-wider text-[#25251F] transition-colors rounded-[0.5px]"
          >
            TODAY
          </button>
          
          <button 
            className="px-2 py-1 border border-[#AAA99B] bg-[#EAE6D9] hover:bg-[#DDD8CB] text-[#25251F] transition-colors rounded-[0.5px]"
            title="Previous month"
          >
            &lt;
          </button>

          <button 
            className="px-2.5 py-1 border border-[#AAA99B] bg-[#EAE6D9] hover:bg-[#DDD8CB] font-bold text-[#25251F] flex items-center space-x-1 transition-colors rounded-[0.5px]"
          >
            <span>MAY 2025</span>
            <ChevronDown className="w-2.5 h-2.5 text-[#55544B]" />
          </button>
        </div>
      </div>

      {/* 2. Main Two-Column Split Grid */}
      <div className="flex-1 flex min-h-0 overflow-hidden divide-x divide-[#AAA99B]">
        
        {/* ============================================================ */}
        {/* LEFT COLUMN: MONTH VIEW & CALENDAR GRID                      */}
        {/* ============================================================ */}
        <div className="flex-1 flex flex-col justify-between p-4 bg-[#E9E5D8] overflow-y-auto">
          <div>
            {/* Month Header & Segmented Tab Switcher */}
            <div className="flex items-start justify-between pb-3 border-b border-[#AAA99B]">
              <div>
                <h2 className="text-[22px] font-bold font-mono tracking-tight text-[#141512] leading-none">
                  MAY 2025
                </h2>
                <p className="text-[8.5px] font-mono text-[#55544B] mt-1.5 tracking-wide">
                  Plan • Track • Create • Archive
                </p>
              </div>

              {/* View Switcher: MONTH | WEEK | LIST */}
              <div className="flex border border-[#141512] divide-x divide-[#141512] text-[8.5px] font-mono">
                <button
                  onClick={() => setActiveTab('MONTH')}
                  className={`px-3 py-1 font-bold uppercase tracking-wider transition-colors ${
                    activeTab === 'MONTH'
                      ? 'bg-[#141512] text-[#FAF8F3]'
                      : 'bg-[#EAE6D9] text-[#55544B] hover:bg-[#DDD8CB]'
                  }`}
                >
                  MONTH
                </button>
                <button
                  onClick={() => setActiveTab('WEEK')}
                  className={`px-3 py-1 font-bold uppercase tracking-wider transition-colors ${
                    activeTab === 'WEEK'
                      ? 'bg-[#141512] text-[#FAF8F3]'
                      : 'bg-[#EAE6D9] text-[#55544B] hover:bg-[#DDD8CB]'
                  }`}
                >
                  WEEK
                </button>
                <button
                  onClick={() => setActiveTab('LIST')}
                  className={`px-3 py-1 font-bold uppercase tracking-wider transition-colors ${
                    activeTab === 'LIST'
                      ? 'bg-[#141512] text-[#FAF8F3]'
                      : 'bg-[#EAE6D9] text-[#55544B] hover:bg-[#DDD8CB]'
                  }`}
                >
                  LIST
                </button>
              </div>
            </div>

            {/* Weekday column headers: MON TUE WED THU FRI SAT SUN */}
            <div className="grid grid-cols-7 pt-2.5 pb-1.5 text-center text-[9px] font-bold font-mono text-[#25251F] uppercase tracking-wider">
              <span>MON</span>
              <span>TUE</span>
              <span>WED</span>
              <span>THU</span>
              <span>FRI</span>
              <span>SAT</span>
              <span>SUN</span>
            </div>

            {/* 7x5 Days Grid matching reference image */}
            <div className="grid grid-cols-7 gap-1.5 pt-1">
              {calendarCells.map((cell, idx) => {
                const isSelected = cell.isCurrentMonth && selectedDay === cell.day;
                return (
                  <div
                    key={idx}
                    onClick={() => cell.isCurrentMonth && setSelectedDay(cell.day)}
                    className={`h-[72px] border p-1.5 flex flex-col justify-between transition-colors select-none ${
                      !cell.isCurrentMonth
                        ? 'border-[#C8C4B6] bg-[#ECE8DC]/50 cursor-default'
                        : isSelected
                          ? 'border-2 border-[#141512] bg-[#DDD8CB] cursor-pointer shadow-sm'
                          : 'border-[#AAA99B] bg-[#FAF8F3] hover:bg-[#ECE7DB] cursor-pointer'
                    }`}
                  >
                    {/* Top row of cell: Date & Indicator Dot */}
                    <div className="flex items-start justify-between">
                      {isSelected ? (
                        <span className="bg-[#141512] text-[#FAF8F3] font-bold text-[9px] px-1 py-0.5 rounded-[0.5px] leading-none">
                          {cell.day}
                        </span>
                      ) : (
                        <span className={`text-[9.5px] font-mono leading-none ${
                          !cell.isCurrentMonth 
                            ? 'text-[#AAA99B]' 
                            : 'font-bold text-[#25251F]'
                        }`}>
                          {cell.day}
                        </span>
                      )}

                      {/* Event Dot */}
                      {cell.dotColor && (
                        <span 
                          className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                          style={{ backgroundColor: cell.dotColor }}
                        />
                      )}
                    </div>

                    {/* Bottom of cell: Event Pill */}
                    {cell.pill && (
                      <div className="mt-auto">
                        <div className="text-[7.5px] font-mono font-medium text-[#141512] bg-[#E9E5D8] px-1 py-0.5 border border-[#AAA99B] truncate">
                          {cell.pill}
                        </div>
                        {cell.more && (
                          <div className="text-[6.5px] font-mono text-[#66655A] mt-0.5 font-medium">
                            {cell.more}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom Legend Strip matching media_1793432962383_8d7b3679.jpg */}
          <div className="pt-3 mt-3 border-t border-[#AAA99B] flex items-center space-x-4 text-[8px] font-mono text-[#44433A]">
            <div className="flex items-center space-x-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#738A62]" />
              <span>Project</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#777A5A]" />
              <span>Research</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#5C738A]" />
              <span>Creative</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#B0654B]" />
              <span>Personal</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C05030]" />
              <span>Deadline</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#77766B]" />
              <span>Completed</span>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* RIGHT COLUMN: DAY AGENDA TIMELINE & MONTH OVERVIEW           */}
        {/* ============================================================ */}
        <div className="w-[360px] min-w-[340px] max-w-[380px] bg-[#E9E5D8] p-4 flex flex-col justify-between overflow-y-auto">
          <div>
            {/* Day Header with + ADD ENTRY button */}
            <div className="flex items-start justify-between pb-3 border-b border-[#AAA99B]">
              <div>
                <div className="text-[9px] font-mono uppercase font-bold text-[#55544B] tracking-wider">
                  FRIDAY
                </div>
                <h3 className="text-[20px] font-bold text-[#141512] leading-tight tracking-tight mt-0.5">
                  09 MAY 2025
                </h3>
                <div className="text-[8px] font-mono font-medium text-[#66655A] mt-1 tracking-wider uppercase">
                  6 ITEMS • 5 ACTIONS • 1 NOTE
                </div>
              </div>

              <button 
                onClick={onAddEntry}
                className="px-2.5 py-1 border border-[#AAA99B] bg-[#DFDBD0] hover:bg-[#D4D0C3] active:bg-[#C9C4B7] text-[#141512] font-bold text-[8.5px] uppercase tracking-wider flex items-center space-x-1 transition-colors rounded-[0.5px]"
              >
                <Plus className="w-2.5 h-2.5" />
                <span>ADD ENTRY</span>
              </button>
            </div>

            {/* Vertical Timeline Schedule for May 9 */}
            <div className="mt-3 relative pl-6 space-y-3">
              {/* Continuous Vertical Timeline Line */}
              <div className="absolute left-[7px] top-2 bottom-2 w-[1px] bg-[#AAA99B]" />

              {dayItems.map((item, idx) => {
                const isChecked = !!checkedItems[idx];
                return (
                  <div key={idx} className="relative group">
                    {/* Timeline Node Dot */}
                    <div className="absolute -left-[20px] top-1">
                      {item.isSolidNode ? (
                        <span className="w-2.5 h-2.5 rounded-full bg-[#141512] inline-block border-2 border-[#E9E5D8]" />
                      ) : (
                        <span className="w-2.5 h-2.5 rounded-full bg-[#FAF8F3] border-[1.5px] border-[#141512] inline-block" />
                      )}
                    </div>

                    {/* Timeline Item Card */}
                    <div className="p-2 border border-[#AAA99B] bg-[#FAF8F3] hover:bg-[#F5F1E6] transition-colors space-y-1">
                      {/* Top Row: Time, Title, Tag Badge & Menu */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-baseline space-x-2">
                          <span className="text-[8.5px] font-mono font-bold text-[#25251F]">
                            {item.time}
                          </span>
                          <span className={`text-[9.5px] font-bold text-[#141512] leading-tight ${
                            isChecked ? 'line-through text-[#77766B]' : ''
                          }`}>
                            {item.title}
                          </span>
                        </div>

                        <div className="flex items-center space-x-1 flex-shrink-0">
                          <span className="text-[7px] font-mono font-bold uppercase tracking-wider px-1 py-0.5 border border-[#AAA99B] bg-[#DFDBD0] text-[#33322B]">
                            {item.type}
                          </span>
                          <button className="text-[#77766B] hover:text-[#141512]">
                            <MoreVertical className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      {/* Description (for Entry note) */}
                      {item.desc && (
                        <p className="text-[7.5px] font-mono text-[#55544B] leading-relaxed pl-1 pt-0.5">
                          {item.desc}
                        </p>
                      )}

                      {/* Project Name (for Action) */}
                      {item.project && (
                        <div className="text-[7px] font-mono uppercase tracking-wider text-[#66655A] pl-1">
                          PROJECT: <span className="text-[#25251F] font-semibold">{item.project}</span>
                        </div>
                      )}

                      {/* Action Checkbox Task */}
                      {item.todo && (
                        <div 
                          onClick={() => toggleCheck(idx)}
                          className="flex items-center space-x-1.5 text-[7.5px] font-mono text-[#33322B] pt-0.5 pl-1 cursor-pointer hover:text-[#141512]"
                        >
                          {isChecked ? (
                            <CheckSquare className="w-3 h-3 text-[#738A62]" />
                          ) : (
                            <Square className="w-3 h-3 text-[#77766B]" />
                          )}
                          <span className={isChecked ? 'line-through text-[#88877A]' : 'font-medium'}>
                            {item.todo}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Month Overview Metrics Footer matching media_1793432962383_8d7b3679.jpg */}
          <div className="pt-3 mt-4 border-t border-[#AAA99B]">
            <div className="text-[8.5px] font-mono font-bold uppercase tracking-wider text-[#44433A] mb-2">
              MONTH OVERVIEW
            </div>

            <div className="grid grid-cols-4 divide-x divide-[#AAA99B] border border-[#AAA99B] bg-[#FAF8F3] p-2 text-center shadow-sm">
              <div className="px-1">
                <div className="text-[20px] font-bold text-[#141512] leading-none" style={numeralStyle}>
                  18
                </div>
                <div className="text-[7px] font-mono text-[#66655A] mt-1 font-medium">
                  Total Entries
                </div>
              </div>

              <div className="px-1">
                <div className="text-[20px] font-bold text-[#141512] leading-none" style={numeralStyle}>
                  12
                </div>
                <div className="text-[7px] font-mono text-[#66655A] mt-1 font-medium">
                  Actions
                </div>
              </div>

              <div className="px-1">
                <div className="text-[20px] font-bold text-[#141512] leading-none" style={numeralStyle}>
                  7
                </div>
                <div className="text-[7px] font-mono text-[#66655A] mt-1 font-medium">
                  Works
                </div>
              </div>

              <div className="px-1">
                <div className="text-[20px] font-bold text-[#141512] leading-none" style={numeralStyle}>
                  65%
                </div>
                <div className="text-[7px] font-mono text-[#66655A] mt-1 font-medium">
                  Focus
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
