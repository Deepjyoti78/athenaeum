import React, { useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, Clock, Check } from 'lucide-react';

export function CalendarView({ actions = [], entries = [] }) {
  const [selectedDay, setSelectedDay] = useState(9);
  const [currentMonth, setCurrentMonth] = useState('MAY 2025');

  // Days for May 2025 (May 1 was a Thursday)
  // 31 days
  const calendarDays = [
    null, null, null, 1, 2, 3, 4,
    5, 6, 7, 8, 9, 10, 11,
    12, 13, 14, 15, 16, 17, 18,
    19, 20, 21, 22, 23, 24, 25,
    26, 27, 28, 29, 30, 31, null, null, null, null, null
  ];

  // Scheduled events mock mapped to dates
  const daySchedule = {
    9: [
      { time: '08:15', title: 'Project planning thoughts', type: 'entry', cat: 'Project Note' },
      { time: '09:30', title: 'Design database schema', type: 'action', status: 'In progress', work: 'Athenaeum App Project' },
      { time: '11:00', title: 'Research Victorian dock maps', type: 'action', status: 'To do', work: 'East London Heritage Archive' },
      { time: '14:00', title: 'Model turntable in Blender', type: 'action', status: 'To do', work: 'Creature Concept Explorations' },
      { time: '15:30', title: 'Write journal entry', type: 'action', status: 'To do', work: 'Daily Journal' },
      { time: '17:00', title: 'Review photography shots', type: 'action', status: 'Waiting', work: 'Photography Portfolio' },
    ],
    8: [
      { time: '10:00', title: 'Interview dockland oral historian', type: 'action', status: 'Completed', work: 'East London Heritage Archive' },
      { time: '16:00', title: 'Catalog Swiss typography specimens', type: 'action', status: 'Completed', work: 'Typographic Archive Catalog' },
      { time: '17:30', title: 'Meeting notes with client', type: 'entry', cat: 'Meeting' },
      { time: '21:42', title: 'Inspiration: Brutalist Interfaces', type: 'entry', cat: 'Idea' },
    ],
    7: [
      { time: '14:20', title: 'Anatomical nomenclature updates', type: 'action', status: 'Completed', work: 'Creature Concept Explorations' },
      { time: '22:10', title: 'Research: Limehouse Basin', type: 'entry', cat: 'Research' },
    ],
    1: [
      { time: '09:00', title: 'Athenaeum Project Inception & Vault Init', type: 'milestone', work: 'Athenaeum App Project' }
    ],
    15: [
      { time: '18:00', title: 'Target: Print Folio Release', type: 'milestone', work: 'Creature Concept Explorations' }
    ],
    30: [
      { time: '17:00', title: 'Target: Athenaeum Core Release Candidate', type: 'milestone', work: 'Athenaeum App Project' }
    ]
  };

  const currentEvents = daySchedule[selectedDay] || [];

  return (
    <div className="flex-1 flex flex-col h-full bg-[#E9E5D8] overflow-hidden select-none font-mono">
      {/* Header */}
      <div className="p-3 border-b border-[#AAA99B] bg-[#DFDBD0] flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 bg-[#738A62] inline-block"></span>
          <h1 className="text-xs font-bold uppercase tracking-wider text-[#25251F]">
            ARCHIVAL CALENDAR &amp; TIMELINE
          </h1>
        </div>

        {/* Month Navigator */}
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => setSelectedDay(9)}
            className="px-2 py-0.5 border border-[#AAA99B] bg-[#FAF8F3] text-[8px] font-bold uppercase hover:bg-[#E5E0D2]"
          >
            TODAY (09 MAY)
          </button>
          <div className="flex items-center border border-[#AAA99B] bg-[#FAF8F3] text-[9px]">
            <button className="p-1 hover:bg-[#E5E0D2] border-r border-[#AAA99B]">
              <ChevronLeft className="w-3 h-3" />
            </button>
            <span className="px-3 font-bold text-[#25251F]">{currentMonth}</span>
            <button className="p-1 hover:bg-[#E5E0D2] border-l border-[#AAA99B]">
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Split Grid */}
      <div className="flex-1 flex min-h-0 overflow-hidden">
        {/* Month Grid */}
        <div className="flex-1 p-4 border-r border-[#AAA99B] overflow-y-auto">
          {/* Weekday headers */}
          <div className="grid grid-cols-7 border-b border-[#AAA99B] pb-1 text-center text-[9px] font-bold text-[#666]">
            <span>MON</span>
            <span>TUE</span>
            <span>WED</span>
            <span>THU</span>
            <span>FRI</span>
            <span>SAT</span>
            <span>SUN</span>
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1 pt-2">
            {calendarDays.slice(0, 35).map((d, idx) => {
              if (!d) {
                return <div key={idx} className="h-16 border border-transparent bg-transparent opacity-20" />;
              }
              const isSelected = selectedDay === d;
              const isToday = d === 9;
              const hasEvents = !!daySchedule[d];
              return (
                <div
                  key={idx}
                  onClick={() => setSelectedDay(d)}
                  className={`h-16 border p-1.5 flex flex-col justify-between transition-colors cursor-pointer ${
                    isSelected
                      ? 'border-[#25251F] bg-[#DFDBD0] shadow-[inset_0_0_0_1px_#25251F]'
                      : 'border-[#AAA99B] bg-[#FAF8F3] hover:bg-[#ECE7DB]'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className={`text-[10px] font-mono ${
                      isToday 
                        ? 'bg-[#25251F] text-[#E9E5D8] px-1 font-bold' 
                        : 'font-semibold text-[#25251F]'
                    }`}>
                      {d}
                    </span>
                    {hasEvents && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#738A62]"></span>
                    )}
                  </div>

                  {hasEvents && (
                    <div className="space-y-0.5">
                      <div className="text-[6.5px] truncate font-mono text-[#555] bg-[#E9E5D8] px-0.5 border border-[#AAA99B]/50">
                        {daySchedule[d][0].title}
                      </div>
                      {daySchedule[d].length > 1 && (
                        <div className="text-[6px] text-[#77766B]">
                          +{daySchedule[d].length - 1} more
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Day Agenda Panel */}
        <div className="w-80 min-w-[280px] bg-[#E9E5D8] p-3 overflow-y-auto flex flex-col justify-between">
          <div>
            <div className="pb-2 border-b border-[#AAA99B] flex justify-between items-baseline">
              <div>
                <span className="text-[8px] uppercase tracking-wider text-[#77766B]">AGENDA FOR</span>
                <h3 className="text-sm font-bold text-[#25251F]">
                  {selectedDay} MAY 2025
                </h3>
              </div>
              <span className="text-[8px] bg-[#DFDBD0] px-1.5 py-0.5 border border-[#AAA99B]">
                {currentEvents.length} ITEMS
              </span>
            </div>

            {/* Events List */}
            <div className="mt-3 space-y-2">
              {currentEvents.length > 0 ? (
                currentEvents.map((evt, idx) => (
                  <div key={idx} className="p-2 border border-[#AAA99B] bg-[#FAF8F3] space-y-1">
                    <div className="flex justify-between items-center text-[7.5px] text-[#666]">
                      <span className="font-bold text-[#25251F] flex items-center space-x-1">
                        <Clock className="w-2.5 h-2.5" />
                        <span>{evt.time}</span>
                      </span>
                      <span className="uppercase px-1 py-0.2 border border-[#AAA99B] bg-[#DDD8CB] text-[#333]">
                        {evt.type}
                      </span>
                    </div>
                    <div className="text-[9px] font-bold text-[#25251F] leading-snug">
                      {evt.title}
                    </div>
                    {evt.work && (
                      <div className="text-[7.5px] text-[#77766B]">
                        PROJECT: {evt.work}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-[9px] text-[#77766B]">
                  No items scheduled for this date.
                </div>
              )}
            </div>
          </div>

          <div className="pt-2 border-t border-[#D5D1C4] text-[7.5px] text-[#77766B] flex justify-between">
            <span>LOCAL TIMELINE: SYNCHRONIZED</span>
            <span>MAY 2025</span>
          </div>
        </div>
      </div>
    </div>
  );
}

