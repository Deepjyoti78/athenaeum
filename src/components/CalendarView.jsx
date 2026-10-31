import React, { useState, useMemo } from 'react';
import { 
  ChevronLeft, 
  ChevronRight,
  ChevronDown, 
  MoreVertical, 
  Plus, 
  CheckSquare, 
  Square,
  X,
  Clock,
  Calendar as CalendarIcon,
  Tag,
  Folder,
  FileText,
  AlertCircle
} from 'lucide-react';
import { useArchive } from '../context/ArchiveContext';

const MONTH_NAMES = [
  'JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE',
  'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'
];

const WEEKDAY_NAMES = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

// Normalizes various date string representations into standard YYYY-MM-DD
function normalizeToDateKey(dateInput) {
  if (!dateInput) return null;
  if (dateInput instanceof Date) {
    const y = dateInput.getFullYear();
    const m = String(dateInput.getMonth() + 1).padStart(2, '0');
    const d = String(dateInput.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }
  const str = String(dateInput).trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(str)) {
    return str;
  }
  const monthMap = {
    jan: '01', feb: '02', mar: '03', apr: '04', may: '05', jun: '06',
    jul: '07', aug: '08', sep: '09', oct: '10', nov: '11', dec: '12'
  };
  const parts = str.split(/[\s-]+/);
  if (parts.length === 3) {
    const mStr = parts[1].toLowerCase().slice(0, 3);
    if (monthMap[mStr]) {
      const d = String(parseInt(parts[0], 10)).padStart(2, '0');
      const m = monthMap[mStr];
      const y = parts[2].length === 2 ? `20${parts[2]}` : parts[2];
      return `${y}-${m}-${d}`;
    }
    if (parts[0].length === 4) {
      return `${parts[0]}-${parts[1].padStart(2, '0')}-${parts[2].padStart(2, '0')}`;
    }
  }
  const parsed = new Date(str);
  if (!isNaN(parsed.getTime())) {
    const y = parsed.getFullYear();
    const m = String(parsed.getMonth() + 1).padStart(2, '0');
    const d = String(parsed.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }
  return null;
}

function formatDateDisplay(dateObj) {
  const d = String(dateObj.getDate()).padStart(2, '0');
  const m = MONTH_NAMES[dateObj.getMonth()].slice(0, 3);
  const y = dateObj.getFullYear();
  return `${d} ${m} ${y}`;
}

export function CalendarView() {
  const { 
    actions = [], 
    entries = [], 
    works = [], 
    updateAction, 
    toggleActionStatus,
    createAction,
    createEntry,
    inspectRecord 
  } = useArchive();

  // Navigation & Selected Date State (Defaults to May 9, 2025)
  const [viewYear, setViewYear] = useState(2025);
  const [viewMonth, setViewMonth] = useState(4); // May (0-indexed)
  const [selectedDate, setSelectedDate] = useState(() => new Date(2025, 4, 9));
  const [activeTab, setActiveTab] = useState('MONTH'); // 'MONTH' | 'WEEK' | 'LIST'
  const [isMonthPickerOpen, setIsMonthPickerOpen] = useState(false);
  const [activePopoverDate, setActivePopoverDate] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Record Form State
  const [addRecordType, setAddRecordType] = useState('ACTION'); // 'ACTION' | 'ENTRY'
  const [newTitle, setNewTitle] = useState('');
  const [newTime, setNewTime] = useState('12:00');
  const [newWork, setNewWork] = useState(works[0]?.title || 'Athenaeum App Project');
  const [newCategory, setNewCategory] = useState('Project Note');
  const [newPriority, setNewPriority] = useState(3);
  const [newNotes, setNewNotes] = useState('');

  const selectedDateKey = normalizeToDateKey(selectedDate);

  // Work category lookup map for assigning badge colors
  const workCategoryMap = useMemo(() => {
    const map = {};
    works.forEach(w => {
      map[w.title] = w.category || w.type || 'Project';
      if (w.shortTitle) map[w.shortTitle] = w.category || w.type || 'Project';
    });
    return map;
  }, [works]);

  // Aggregate and index all actions and entries by YYYY-MM-DD
  const eventsByDate = useMemo(() => {
    const map = {};

    actions.forEach((act) => {
      const key = normalizeToDateKey(act.date) || '2025-05-09';
      if (!map[key]) map[key] = [];
      const cat = act.work ? (workCategoryMap[act.work] || 'Project') : 'Project';
      map[key].push({
        id: act.id,
        raw: act,
        itemType: 'ACTION',
        time: act.time || '12:00',
        title: act.action || 'Untitled Action',
        project: act.work,
        status: act.status || 'To do',
        priority: act.priority || 3,
        category: cat,
        notes: act.notes || '',
        isCompleted: act.status === 'Completed'
      });
    });

    entries.forEach((ent) => {
      const key = normalizeToDateKey(ent.date) || '2025-05-09';
      if (!map[key]) map[key] = [];
      map[key].push({
        id: ent.id,
        raw: ent,
        itemType: 'ENTRY',
        time: ent.time || '08:00',
        title: ent.title || 'Untitled Entry',
        project: ent.work,
        category: ent.category || 'Project Note',
        desc: ent.content || '',
        isCompleted: false
      });
    });

    // Sort items chronologically for every date
    Object.keys(map).forEach((k) => {
      map[k].sort((a, b) => (a.time || '').localeCompare(b.time || ''));
    });

    return map;
  }, [actions, entries, workCategoryMap]);

  // Calendar cells generation for the current viewMonth & viewYear
  const { calendarCells, totalWeeks } = useMemo(() => {
    const cells = [];
    const firstDay = new Date(viewYear, viewMonth, 1);
    let startDayOfWeek = firstDay.getDay() - 1; // 0 = Mon, 6 = Sun
    if (startDayOfWeek === -1) startDayOfWeek = 6;

    const daysInCurrMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate();

    // Previous month overflow days
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      const dayNum = daysInPrevMonth - i;
      const prevMonth = viewMonth === 0 ? 11 : viewMonth - 1;
      const prevYear = viewMonth === 0 ? viewYear - 1 : viewYear;
      const dateKey = `${prevYear}-${String(prevMonth + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
      cells.push({
        day: dayNum,
        year: prevYear,
        month: prevMonth,
        dateKey,
        isCurrentMonth: false,
        dateObj: new Date(prevYear, prevMonth, dayNum)
      });
    }

    // Current month days
    for (let d = 1; d <= daysInCurrMonth; d++) {
      const dateKey = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      cells.push({
        day: d,
        year: viewYear,
        month: viewMonth,
        dateKey,
        isCurrentMonth: true,
        dateObj: new Date(viewYear, viewMonth, d)
      });
    }

    // Next month overflow to complete 5 or 6 weeks (multiple of 7)
    const remainder = (7 - (cells.length % 7)) % 7;
    for (let d = 1; d <= remainder; d++) {
      const nextMonth = viewMonth === 11 ? 0 : viewMonth + 1;
      const nextYear = viewMonth === 11 ? viewYear + 1 : viewYear;
      const dateKey = `${nextYear}-${String(nextMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      cells.push({
        day: d,
        year: nextYear,
        month: nextMonth,
        dateKey,
        isCurrentMonth: false,
        dateObj: new Date(nextYear, nextMonth, d)
      });
    }

    return { calendarCells: cells, totalWeeks: Math.ceil(cells.length / 7) };
  }, [viewYear, viewMonth]);

  // Selected Day Items
  const selectedDayItems = useMemo(() => {
    return eventsByDate[selectedDateKey] || [];
  }, [eventsByDate, selectedDateKey]);

  // Metric counts for selected day
  const actionCount = selectedDayItems.filter(i => i.itemType === 'ACTION').length;
  const entryCount = selectedDayItems.filter(i => i.itemType === 'ENTRY').length;

  // Month navigation handlers
  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(y => y - 1);
    } else {
      setViewMonth(m => m - 1);
    }
    setActivePopoverDate(null);
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(y => y + 1);
    } else {
      setViewMonth(m => m + 1);
    }
    setActivePopoverDate(null);
  };

  const handleGoToday = () => {
    setViewYear(2025);
    setViewMonth(4);
    setSelectedDate(new Date(2025, 4, 9));
    setActivePopoverDate(null);
  };

  const handleSelectDate = (dateObj) => {
    setSelectedDate(dateObj);
    if (dateObj.getMonth() !== viewMonth) {
      setViewMonth(dateObj.getMonth());
      setViewYear(dateObj.getFullYear());
    }
  };

  // Checkbox toggle handler with persistence
  const handleToggleTask = async (item, e) => {
    e.stopPropagation();
    if (item.itemType === 'ACTION') {
      const nextStatus = item.isCompleted ? 'To do' : 'Completed';
      await updateAction({
        ...item.raw,
        status: nextStatus
      });
    }
  };

  // Inspect record handler
  const handleInspect = (item) => {
    if (item.itemType === 'ACTION') {
      inspectRecord('action', item.raw);
    } else {
      inspectRecord('entry', item.raw);
    }
  };

  // Submit quick add modal
  const handleSaveNewRecord = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    if (addRecordType === 'ACTION') {
      await createAction({
        action: newTitle,
        work: newWork,
        time: newTime,
        date: selectedDateKey,
        priority: Number(newPriority),
        status: 'To do',
        notes: newNotes
      });
    } else {
      await createEntry({
        title: newTitle,
        work: newWork,
        category: newCategory,
        time: newTime,
        date: formatDateDisplay(selectedDate),
        content: newNotes || 'Archival entry recorded from calendar timeline.'
      });
    }

    setNewTitle('');
    setNewNotes('');
    setIsAddModalOpen(false);
  };

  // Determine category color dot for a cell
  const getCategoryDotColor = (items) => {
    if (!items || items.length === 0) return null;
    if (items.some(i => i.isCompleted)) return '#77766B';
    const categories = items.map(i => i.category);
    if (categories.includes('Deadline') || categories.includes('Maintenance')) return '#C05030';
    if (categories.includes('Research')) return '#777A5A';
    if (categories.includes('Creative')) return '#5C738A';
    if (categories.includes('Personal')) return '#B0654B';
    return '#738A62'; // Project default
  };

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
        <div className="flex items-center space-x-1 text-[8.5px] font-mono relative">
          <button 
            onClick={handleGoToday}
            className="px-2.5 py-1 border border-[#AAA99B] bg-[#EAE6D9] hover:bg-[#DDD8CB] active:bg-[#CCC7B8] font-bold uppercase tracking-wider text-[#25251F] transition-colors rounded-[0.5px]"
            title="Jump to Today (09 MAY 2025)"
          >
            TODAY
          </button>
          
          <button 
            onClick={handlePrevMonth}
            className="px-2 py-1 border border-[#AAA99B] bg-[#EAE6D9] hover:bg-[#DDD8CB] active:bg-[#CCC7B8] text-[#25251F] transition-colors rounded-[0.5px]"
            title="Previous month"
          >
            &lt;
          </button>

          <button 
            onClick={handleNextMonth}
            className="px-2 py-1 border border-[#AAA99B] bg-[#EAE6D9] hover:bg-[#DDD8CB] active:bg-[#CCC7B8] text-[#25251F] transition-colors rounded-[0.5px]"
            title="Next month"
          >
            &gt;
          </button>

          <button 
            onClick={() => setIsMonthPickerOpen(!isMonthPickerOpen)}
            className="px-2.5 py-1 border border-[#AAA99B] bg-[#EAE6D9] hover:bg-[#DDD8CB] font-bold text-[#25251F] flex items-center space-x-1.5 transition-colors rounded-[0.5px]"
          >
            <span>{MONTH_NAMES[viewMonth]} {viewYear}</span>
            <ChevronDown className="w-2.5 h-2.5 text-[#55544B]" />
          </button>

          {/* Month Picker Dropdown */}
          {isMonthPickerOpen && (
            <div className="absolute right-0 top-full mt-1 w-48 bg-[#FAF8F3] border border-[#141512] shadow-xl z-50 p-2 text-[#25251F]">
              <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-[#AAA99B] font-bold text-[8.5px]">
                <button onClick={() => setViewYear(y => y - 1)} className="hover:text-black">&lt;</button>
                <span>{viewYear}</span>
                <button onClick={() => setViewYear(y => y + 1)} className="hover:text-black">&gt;</button>
              </div>
              <div className="grid grid-cols-3 gap-1">
                {MONTH_NAMES.map((name, idx) => (
                  <button
                    key={name}
                    onClick={() => {
                      setViewMonth(idx);
                      setIsMonthPickerOpen(false);
                    }}
                    className={`py-1 text-[7.5px] font-bold uppercase tracking-wider rounded-[0.5px] ${
                      viewMonth === idx 
                        ? 'bg-[#141512] text-[#FAF8F3]' 
                        : 'hover:bg-[#EAE6D9] text-[#444]'
                    }`}
                  >
                    {name.slice(0, 3)}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 2. Main Two-Column Split Grid */}
      <div className="flex-1 flex min-h-0 overflow-hidden divide-x divide-[#AAA99B]">
        
        {/* ============================================================ */}
        {/* LEFT COLUMN: MONTH VIEW & CALENDAR GRID                      */}
        {/* ============================================================ */}
        <div className="flex-1 flex flex-col h-full min-h-0 p-3.5 md:p-4 bg-[#E9E5D8]">
          {/* Month Header & Segmented Tab Switcher */}
          <div className="flex items-start justify-between pb-2.5 border-b border-[#AAA99B] flex-shrink-0">
            <div>
              <h2 className="text-[20px] md:text-[22px] font-bold font-mono tracking-tight text-[#141512] leading-none">
                {MONTH_NAMES[viewMonth]} {viewYear}
              </h2>
              <p className="text-[8.5px] font-mono text-[#55544B] mt-1 tracking-wide">
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

          {/* TAB 1: MONTH VIEW (Balanced Full-Height Adaptive Grid) */}
          {activeTab === 'MONTH' && (
            <div className="flex-1 flex flex-col min-h-0 pt-1.5">
              {/* Weekday column headers: MON TUE WED THU FRI SAT SUN */}
              <div className="grid grid-cols-7 pb-1 text-center text-[8.5px] font-bold font-mono text-[#25251F] uppercase tracking-wider flex-shrink-0">
                {WEEKDAY_NAMES.map(day => (
                  <span key={day}>{day}</span>
                ))}
              </div>

              {/* Adaptive Calendar Grid: Rows distribute 100% of available height with zero gap below */}
              <div className={`flex-1 min-h-0 grid grid-cols-7 gap-1 pt-0.5 ${
                totalWeeks === 6 ? 'grid-rows-6' : 'grid-rows-5'
              }`}>
                {calendarCells.map((cell) => {
                  const isSelected = selectedDateKey === cell.dateKey;
                  const isToday = cell.dateKey === '2025-05-09';
                  const dayEvents = eventsByDate[cell.dateKey] || [];
                  const dotColor = getCategoryDotColor(dayEvents);
                  const firstEvent = dayEvents[0];
                  const hasMore = dayEvents.length > 1;

                  return (
                    <div
                      key={cell.dateKey}
                      onClick={() => handleSelectDate(cell.dateObj)}
                      className={`h-full min-h-0 border p-1.5 flex flex-col justify-between transition-colors select-none relative group overflow-hidden ${
                        !cell.isCurrentMonth
                          ? 'border-[#C8C4B6] bg-[#ECE8DC]/50 hover:bg-[#E4DFD0] cursor-pointer'
                          : isSelected
                            ? 'border-2 border-[#141512] bg-[#DDD8CB] cursor-pointer shadow-sm'
                            : isToday
                              ? 'border border-[#55544B] bg-[#FAF8F3] hover:bg-[#ECE7DB] cursor-pointer'
                              : 'border-[#AAA99B] bg-[#FAF8F3] hover:bg-[#ECE7DB] cursor-pointer'
                      }`}
                    >
                      {/* Top row of cell: Date & Category Indicator Dot */}
                      <div className="flex items-start justify-between leading-none">
                        <div className="flex items-center space-x-1">
                          {isSelected ? (
                            <span className="bg-[#141512] text-[#FAF8F3] font-bold text-[9px] px-1 py-0.5 rounded-[0.5px] leading-none">
                              {cell.day}
                            </span>
                          ) : (
                            <span className={`text-[9.5px] font-mono leading-none ${
                              !cell.isCurrentMonth 
                                ? 'text-[#AAA99B]' 
                                : isToday
                                  ? 'font-bold text-[#141512] underline decoration-1 underline-offset-2'
                                  : 'font-bold text-[#25251F]'
                            }`}>
                              {cell.day}
                            </span>
                          )}

                          {isToday && !isSelected && (
                            <span className="w-1 h-1 rounded-full bg-[#141512]" title="Today" />
                          )}
                        </div>

                        {/* Category Indicator Dot */}
                        {dotColor && (
                          <span 
                            className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                            style={{ backgroundColor: dotColor }}
                            title={`${dayEvents.length} scheduled item(s)`}
                          />
                        )}
                      </div>

                      {/* Bottom of cell: Event Pill & +N more indicator */}
                      {firstEvent && (
                        <div className="mt-auto pt-1 overflow-hidden">
                          <div 
                            title={`${firstEvent.time} — ${firstEvent.title}`}
                            className="text-[7.5px] font-mono font-medium text-[#141512] bg-[#E9E5D8] px-1 py-0.5 border border-[#AAA99B] truncate hover:bg-[#DDD8CB] transition-colors"
                          >
                            {firstEvent.title}
                          </div>
                          {hasMore && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSelectDate(cell.dateObj);
                                setActivePopoverDate(activePopoverDate === cell.dateKey ? null : cell.dateKey);
                              }}
                              className="text-[6.5px] font-mono text-[#55544B] hover:text-[#141512] hover:underline font-bold mt-0.5 block text-left"
                            >
                              +{dayEvents.length - 1} more
                            </button>
                          )}
                        </div>
                      )}

                      {/* Day Popover for +N More Events */}
                      {activePopoverDate === cell.dateKey && (
                        <div 
                          onClick={(e) => e.stopPropagation()}
                          className="absolute inset-x-1 bottom-1 bg-[#FAF8F3] border border-[#141512] shadow-xl p-2 z-40 text-[#141512] max-h-36 overflow-y-auto"
                        >
                          <div className="flex items-center justify-between pb-1 mb-1 border-b border-[#AAA99B] text-[7.5px] font-bold">
                            <span>{formatDateDisplay(cell.dateObj)}</span>
                            <button onClick={() => setActivePopoverDate(null)} className="hover:text-black">✕</button>
                          </div>
                          <div className="space-y-1">
                            {dayEvents.map((evt, idx) => (
                              <div 
                                key={idx}
                                onClick={() => {
                                  handleInspect(evt);
                                  setActivePopoverDate(null);
                                }}
                                className="text-[7px] font-mono p-1 border border-[#AAA99B] bg-[#EAE6D9] hover:bg-[#DDD8CB] cursor-pointer flex justify-between items-center"
                              >
                                <span className="font-bold truncate mr-1">{evt.time} {evt.title}</span>
                                <span className="text-[6px] uppercase px-0.5 bg-[#DDD8CB] text-[#444] border border-[#AAA99B]">
                                  {evt.itemType}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: WEEK VIEW */}
          {activeTab === 'WEEK' && (
            <div className="flex-1 flex flex-col min-h-0 pt-2">
              <div className="grid grid-cols-7 gap-1.5 flex-1 min-h-0">
                {(() => {
                  // Derive 7 days of the selected date's week (Monday to Sunday)
                  const currDayIndex = selectedDate.getDay() === 0 ? 6 : selectedDate.getDay() - 1;
                  const monday = new Date(selectedDate);
                  monday.setDate(selectedDate.getDate() - currDayIndex);

                  return WEEKDAY_NAMES.map((name, i) => {
                    const dayDate = new Date(monday);
                    dayDate.setDate(monday.getDate() + i);
                    const dayKey = normalizeToDateKey(dayDate);
                    const isSelected = selectedDateKey === dayKey;
                    const items = eventsByDate[dayKey] || [];

                    return (
                      <div 
                        key={dayKey}
                        onClick={() => handleSelectDate(dayDate)}
                        className={`h-full border p-2 flex flex-col transition-colors cursor-pointer overflow-y-auto ${
                          isSelected 
                            ? 'border-2 border-[#141512] bg-[#DDD8CB]' 
                            : 'border-[#AAA99B] bg-[#FAF8F3] hover:bg-[#F3EFE4]'
                        }`}
                      >
                        <div className="border-b border-[#AAA99B] pb-1 mb-2 text-center">
                          <div className="text-[8px] font-bold uppercase text-[#555]">{name}</div>
                          <div className="text-[14px] font-bold text-[#141512]">{dayDate.getDate()}</div>
                        </div>

                        <div className="space-y-1.5 flex-1">
                          {items.length === 0 ? (
                            <div className="text-[7px] text-[#888] italic text-center pt-4">No events</div>
                          ) : (
                            items.map((it, idx) => (
                              <div
                                key={idx}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleInspect(it);
                                }}
                                className="p-1 border border-[#AAA99B] bg-[#EAE6D9] hover:bg-[#DFDBD0] text-[7.5px] font-mono space-y-0.5"
                              >
                                <div className="flex justify-between items-center text-[6.5px] font-bold text-[#555]">
                                  <span>{it.time}</span>
                                  <span className="uppercase px-1 bg-[#DDD8CB] border border-[#AAA99B]">{it.itemType}</span>
                                </div>
                                <div className={`font-semibold truncate ${it.isCompleted ? 'line-through text-[#888]' : 'text-[#141512]'}`}>
                                  {it.title}
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>
            </div>
          )}

          {/* TAB 3: LIST VIEW */}
          {activeTab === 'LIST' && (
            <div className="flex-1 flex flex-col min-h-0 pt-2 overflow-y-auto">
              <div className="space-y-3">
                {Object.keys(eventsByDate)
                  .filter(k => k.startsWith(`${viewYear}-${String(viewMonth + 1).padStart(2, '0')}`))
                  .sort()
                  .map((dateKey) => {
                    const items = eventsByDate[dateKey];
                    const dateObj = new Date(dateKey + 'T00:00:00');
                    const isSelected = selectedDateKey === dateKey;

                    return (
                      <div 
                        key={dateKey} 
                        onClick={() => handleSelectDate(dateObj)}
                        className={`border p-2.5 transition-colors cursor-pointer ${
                          isSelected ? 'border-2 border-[#141512] bg-[#DDD8CB]' : 'border-[#AAA99B] bg-[#FAF8F3] hover:bg-[#F3EFE4]'
                        }`}
                      >
                        <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-[#AAA99B] font-bold text-[9px]">
                          <span>{formatDateDisplay(dateObj)} ({items.length} records)</span>
                          <span className="text-[7.5px] text-[#555] uppercase">{dateObj.toLocaleDateString('en-US', { weekday: 'long' })}</span>
                        </div>
                        <div className="space-y-1">
                          {items.map((it, idx) => (
                            <div 
                              key={idx}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleInspect(it);
                              }}
                              className="flex items-center justify-between p-1 bg-[#EAE6D9] hover:bg-[#DFDBD0] border border-[#AAA99B] text-[8px]"
                            >
                              <div className="flex items-center space-x-2">
                                <span className="font-bold text-[#333]">{it.time}</span>
                                <span className={it.isCompleted ? 'line-through text-[#888]' : 'font-bold text-[#141512]'}>
                                  {it.title}
                                </span>
                              </div>
                              <span className="text-[7px] uppercase font-bold text-[#666] border border-[#AAA99B] px-1 bg-[#DFDBD0]">
                                {it.itemType}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {/* Bottom Legend Strip directly below the grid with balanced spacing */}
          <div className="pt-2.5 mt-2.5 border-t border-[#AAA99B] flex items-center space-x-4 text-[8px] font-mono text-[#44433A] flex-shrink-0">
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
                  {selectedDate.toLocaleDateString('en-US', { weekday: 'long' })}
                </div>
                <h3 className="text-[20px] font-bold text-[#141512] leading-tight tracking-tight mt-0.5">
                  {formatDateDisplay(selectedDate)}
                </h3>
                <div className="text-[8px] font-mono font-medium text-[#66655A] mt-1 tracking-wider uppercase">
                  {selectedDayItems.length} ITEMS • {actionCount} ACTIONS • {entryCount} NOTES
                </div>
              </div>

              <button 
                onClick={() => setIsAddModalOpen(true)}
                className="px-2.5 py-1 border border-[#AAA99B] bg-[#DFDBD0] hover:bg-[#D4D0C3] active:bg-[#C9C4B7] text-[#141512] font-bold text-[8.5px] uppercase tracking-wider flex items-center space-x-1 transition-colors rounded-[0.5px]"
              >
                <Plus className="w-2.5 h-2.5" />
                <span>ADD ENTRY</span>
              </button>
            </div>

            {/* Vertical Timeline Schedule for Selected Date */}
            <div className="mt-3 relative pl-6 space-y-3">
              {/* Continuous Vertical Timeline Line */}
              <div className="absolute left-[7px] top-2 bottom-2 w-[1px] bg-[#AAA99B]" />

              {selectedDayItems.length === 0 ? (
                <div className="py-8 text-center text-[#77766B] space-y-2">
                  <CalendarIcon className="w-6 h-6 mx-auto opacity-40 text-[#555]" />
                  <p className="text-[8.5px] font-mono">No actions or entries scheduled for this date.</p>
                  <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="px-2.5 py-1 border border-[#AAA99B] bg-[#FAF8F3] hover:bg-[#ECE7DB] text-[8px] font-bold uppercase tracking-wider text-[#141512]"
                  >
                    + SCHEDULE RECORD
                  </button>
                </div>
              ) : (
                selectedDayItems.map((item, idx) => {
                  const isChecked = item.isCompleted;
                  return (
                    <div key={idx} className="relative group">
                      {/* Timeline Node Dot */}
                      <div className="absolute -left-[20px] top-1">
                        {item.itemType === 'ENTRY' ? (
                          <span className="w-2.5 h-2.5 rounded-full bg-[#141512] inline-block border-2 border-[#E9E5D8]" />
                        ) : (
                          <span className="w-2.5 h-2.5 rounded-full bg-[#FAF8F3] border-[1.5px] border-[#141512] inline-block" />
                        )}
                      </div>

                      {/* Timeline Item Card */}
                      <div 
                        onClick={() => handleInspect(item)}
                        className={`p-2 border transition-colors space-y-1 cursor-pointer ${
                          isChecked 
                            ? 'border-[#C8C4B6] bg-[#EFECE1] opacity-75' 
                            : 'border-[#AAA99B] bg-[#FAF8F3] hover:bg-[#F5F1E6]'
                        }`}
                      >
                        {/* Top Row: Time, Title, Tag Badge & Menu */}
                        <div className="flex items-start justify-between">
                          <div className="flex items-baseline space-x-2">
                            <span className="text-[8.5px] font-mono font-bold text-[#25251F]">
                              {item.time}
                            </span>
                            <span className={`text-[9.5px] font-bold leading-tight ${
                              isChecked ? 'line-through text-[#77766B]' : 'text-[#141512]'
                            }`}>
                              {item.title}
                            </span>
                          </div>

                          <div className="flex items-center space-x-1 flex-shrink-0">
                            <span className="text-[7px] font-mono font-bold uppercase tracking-wider px-1 py-0.5 border border-[#AAA99B] bg-[#DFDBD0] text-[#33322B]">
                              {item.itemType}
                            </span>
                          </div>
                        </div>

                        {/* Description (for Entry note) */}
                        {item.desc && (
                          <p className="text-[7.5px] font-mono text-[#55544B] leading-relaxed pl-1 pt-0.5 line-clamp-3">
                            {item.desc}
                          </p>
                        )}

                        {/* Project Name (for Action) */}
                        {item.project && (
                          <div className="text-[7px] font-mono uppercase tracking-wider text-[#66655A] pl-1">
                            PROJECT: <span className="text-[#25251F] font-semibold">{item.project}</span>
                          </div>
                        )}

                        {/* Action Status Checkbox & Priority (for Action) */}
                        {item.itemType === 'ACTION' && (
                          <div className="flex items-center justify-between pt-1 pl-1 border-t border-[#EAE6D9]">
                            <div 
                              onClick={(e) => handleToggleTask(item, e)}
                              className="flex items-center space-x-1.5 text-[7.5px] font-mono text-[#33322B] cursor-pointer hover:text-[#141512]"
                            >
                              {isChecked ? (
                                <CheckSquare className="w-3.5 h-3.5 text-[#738A62]" />
                              ) : (
                                <Square className="w-3.5 h-3.5 text-[#77766B]" />
                              )}
                              <span className={isChecked ? 'line-through text-[#88877A]' : 'font-medium'}>
                                {item.status || 'To do'}
                              </span>
                            </div>

                            {/* Priority indicator dots */}
                            <div className="flex items-center space-x-0.5" title={`Priority: ${item.priority}/5`}>
                              {[...Array(5)].map((_, pi) => (
                                <span 
                                  key={pi} 
                                  className={`w-1 h-1 rounded-full ${
                                    pi < (item.priority || 1) ? 'bg-[#141512]' : 'bg-[#CCC7B8]'
                                  }`} 
                                />
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
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
                  {entries.length || 18}
                </div>
                <div className="text-[7px] font-mono text-[#66655A] mt-1 font-medium">
                  Total Entries
                </div>
              </div>

              <div className="px-1">
                <div className="text-[20px] font-bold text-[#141512] leading-none" style={numeralStyle}>
                  {actions.length || 12}
                </div>
                <div className="text-[7px] font-mono text-[#66655A] mt-1 font-medium">
                  Actions
                </div>
              </div>

              <div className="px-1">
                <div className="text-[20px] font-bold text-[#141512] leading-none" style={numeralStyle}>
                  {works.length || 7}
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

      {/* 3. Archival Add Entry / Action Modal */}
      {isAddModalOpen && (
        <div 
          onClick={() => setIsAddModalOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-[2px] z-50 flex items-center justify-center p-4"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-[#FAF8F3] border-2 border-[#141512] shadow-2xl max-w-md w-full p-5 text-[#141512] font-mono space-y-3.5"
          >
            {/* Header */}
            <div className="flex justify-between items-center border-b border-[#AAA99B] pb-2 text-[8.5px]">
              <span className="uppercase tracking-widest font-bold text-[#141512]">
                SCHEDULE RECORD // {formatDateDisplay(selectedDate)}
              </span>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="hover:text-black font-bold uppercase text-[9px]"
              >
                ✕ CLOSE
              </button>
            </div>

            {/* Type Switcher */}
            <div className="flex border border-[#141512] divide-x divide-[#141512] text-[8px] font-bold">
              <button
                type="button"
                onClick={() => setAddRecordType('ACTION')}
                className={`flex-1 py-1 text-center uppercase tracking-wider transition-colors ${
                  addRecordType === 'ACTION' ? 'bg-[#141512] text-[#FAF8F3]' : 'bg-[#EAE6D9] text-[#555]'
                }`}
              >
                ACTION / TASK
              </button>
              <button
                type="button"
                onClick={() => setAddRecordType('ENTRY')}
                className={`flex-1 py-1 text-center uppercase tracking-wider transition-colors ${
                  addRecordType === 'ENTRY' ? 'bg-[#141512] text-[#FAF8F3]' : 'bg-[#EAE6D9] text-[#555]'
                }`}
              >
                ENTRY / NOTE
              </button>
            </div>

            <form onSubmit={handleSaveNewRecord} className="space-y-3 text-[8px]">
              <div>
                <label className="block text-[7.5px] uppercase font-bold text-[#555] mb-1">
                  {addRecordType === 'ACTION' ? 'ACTION DESCRIPTION' : 'ENTRY TITLE'}
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder={addRecordType === 'ACTION' ? 'e.g. Calibrate optical rangefinder' : 'e.g. Research notes on dock maps'}
                  className="w-full bg-[#EAE6D9] border border-[#AAA99B] px-2 py-1 text-[8.5px] font-mono text-[#141512] focus:outline-none focus:border-[#141512]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[7.5px] uppercase font-bold text-[#555] mb-1">
                    SCHEDULED TIME
                  </label>
                  <input
                    type="text"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    placeholder="HH:MM (e.g. 14:00)"
                    className="w-full bg-[#EAE6D9] border border-[#AAA99B] px-2 py-1 text-[8.5px] font-mono text-[#141512] focus:outline-none focus:border-[#141512]"
                  />
                </div>

                <div>
                  <label className="block text-[7.5px] uppercase font-bold text-[#555] mb-1">
                    LINKED WORK / PROJECT
                  </label>
                  <select
                    value={newWork}
                    onChange={(e) => setNewWork(e.target.value)}
                    className="w-full bg-[#EAE6D9] border border-[#AAA99B] px-2 py-1 text-[8.5px] font-mono text-[#141512] focus:outline-none focus:border-[#141512]"
                  >
                    {works.map((w) => (
                      <option key={w.id} value={w.title}>{w.title}</option>
                    ))}
                  </select>
                </div>
              </div>

              {addRecordType === 'ACTION' ? (
                <div>
                  <label className="block text-[7.5px] uppercase font-bold text-[#555] mb-1">
                    PRIORITY LEVEL (1-5)
                  </label>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((lvl) => (
                      <button
                        type="button"
                        key={lvl}
                        onClick={() => setNewPriority(lvl)}
                        className={`flex-1 py-1 border text-center font-bold ${
                          newPriority === lvl ? 'bg-[#141512] text-[#FAF8F3] border-[#141512]' : 'bg-[#EAE6D9] border-[#AAA99B]'
                        }`}
                      >
                        {lvl}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-[7.5px] uppercase font-bold text-[#555] mb-1">
                    CATEGORY
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full bg-[#EAE6D9] border border-[#AAA99B] px-2 py-1 text-[8.5px] font-mono text-[#141512] focus:outline-none focus:border-[#141512]"
                  >
                    <option value="Project Note">Project Note</option>
                    <option value="Research">Research</option>
                    <option value="Idea">Idea</option>
                    <option value="Meeting">Meeting</option>
                  </select>
                </div>
              )}

              <div>
                <label className="block text-[7.5px] uppercase font-bold text-[#555] mb-1">
                  {addRecordType === 'ACTION' ? 'ACTION NOTES / TODO ITEM' : 'ENTRY CONTENT'}
                </label>
                <textarea
                  rows={3}
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="Record specific observations, parameters, or subtasks..."
                  className="w-full bg-[#EAE6D9] border border-[#AAA99B] p-2 text-[8px] font-mono text-[#141512] focus:outline-none focus:border-[#141512]"
                />
              </div>

              <div className="pt-2 border-t border-[#AAA99B] flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3 py-1 border border-[#AAA99B] bg-[#EAE6D9] hover:bg-[#DDD8CB] font-bold uppercase text-[8px]"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="px-4 py-1 bg-[#141512] text-[#FAF8F3] font-bold uppercase tracking-wider text-[8px] hover:bg-[#25251F]"
                >
                  + SAVE RECORD TO VAULT
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}