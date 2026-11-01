import React from 'react';
import { useArchive } from '../context/ArchiveContext';

export function RecentEntries({ entries: propEntries, onViewAll, onSelectEntry }) {
  const context = useArchive();
  const entries = propEntries || context.entries || [];
  const inspectRecord = context?.inspectRecord;

  const getCategoryTagStyle = (cat) => {
    switch (cat) {
      case 'Project Note':
        return 'border-[#74866A] text-[#171714] bg-[#DDD8CB] font-bold';
      case 'Idea':
        return 'border-[#74866A] text-[#171714] bg-[#E2E4D5] font-bold';
      case 'Meeting':
        return 'border-[#8F8B7D] text-[#171714] bg-[#DFDBD0] font-bold';
      case 'Research':
        return 'border-[#4B5E45] text-[#171714] bg-[#D7DFD7] font-bold';
      default:
        return 'border-[#B5B3A4] text-[#33322B] bg-[#DFDBD0] font-bold';
    }
  };

  const handleClick = (entry) => {
    if (inspectRecord) inspectRecord('entry', entry);
    if (onSelectEntry) onSelectEntry(entry);
  };

  return (
    <div className="border border-[#B5B3A4] bg-[#EAE7D9] flex flex-col justify-between select-none shadow-sm h-full font-mono">
      {/* Header */}
      <div>
        <div className="p-2.5 pb-2 border-b border-[#B5B3A4] flex items-center justify-between">
          <div className="flex items-center space-x-1.5">
            <span className="w-1.5 h-1.5 bg-[#171714] inline-block" />
            <span className="text-[10px] uppercase tracking-wider font-mono font-bold text-[#171714]">
              RECENT ENTRIES
            </span>
          </div>
          <button
            onClick={onViewAll}
            className="text-[#66655B] hover:text-[#171714] font-bold uppercase tracking-wider text-[8px] underline decoration-dotted transition-colors"
          >
            VIEW ALL
          </button>
        </div>

        {/* Table / List */}
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full min-w-[360px] text-left border-collapse text-[8.5px] font-mono table-fixed">
            <thead>
              <tr className="border-b border-[#D5D1C4] text-[#66655A] uppercase text-[7.5px] font-mono tracking-wider">
                <th className="py-1.5 px-2.5 font-normal w-[24%]">DATE / TIME</th>
                <th className="py-1.5 px-2 font-normal w-[52%]">ENTRY TITLE</th>
                <th className="py-1.5 px-2.5 font-normal text-right w-[24%]">CATEGORY</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E0DCD0]">
              {entries.length === 0 ? (
                <tr>
                  <td colSpan={3} className="py-6 text-center text-[#77766B] uppercase text-[8px] font-mono">
                    No research entries logged in this vault yet
                  </td>
                </tr>
              ) : (
                entries.slice(0, 4).map((entry) => (
                  <tr 
                    key={entry.id}
                    onClick={() => handleClick(entry)}
                    className="hover:bg-[#E2DDD0] transition-colors cursor-pointer group"
                  >
                    <td className="py-2 px-2.5 text-[#55544B] whitespace-nowrap text-[8px]">
                      {entry.date} <span className="text-[#171714] font-bold ml-1">{entry.time}</span>
                    </td>
                    <td className="py-2 px-2 text-[#171714] font-bold text-[9px] group-hover:underline truncate">
                      {entry.title}
                    </td>
                    <td className="py-2 px-2.5 text-right whitespace-nowrap">
                      <span className={`inline-block px-1.5 py-0.5 text-[7px] border font-mono tracking-wider ${getCategoryTagStyle(entry.category)}`}>
                        {entry.category}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sub-bar */}
      <div className="px-2.5 py-1.5 bg-[#E4DFC2]/40 border-t border-[#B5B3A4] flex justify-between text-[7.5px] font-mono text-[#55544B]">
        <span>INDEX ARCHIVE: ENTRIES_DB</span>
        <span className="font-bold text-[#171714]">{Math.min(4, entries.length)} OF {entries.length} RECENT</span>
      </div>
    </div>
  );
}

export default RecentEntries;
