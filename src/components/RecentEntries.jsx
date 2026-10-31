import React from 'react';
import { useArchive } from '../context/ArchiveContext';

export function RecentEntries({ entries: propEntries, onViewAll, onSelectEntry }) {
  const context = useArchive();
  const entries = propEntries || context.entries || [];
  const inspectRecord = context?.inspectRecord;

  const getCategoryTagStyle = (cat) => {
    switch (cat) {
      case 'Project Note':
        return 'border-[#949182] text-[#25251F] bg-[#DDD8CB] font-bold';
      case 'Idea':
        return 'border-[#777A5A] text-[#333820] bg-[#E2E4D5] font-bold';
      case 'Meeting':
        return 'border-[#8F8B7D] text-[#2A271E] bg-[#DFDBD0] font-bold';
      case 'Research':
        return 'border-[#687F68] text-[#243324] bg-[#D7DFD7] font-bold';
      default:
        return 'border-[#AAA99B] text-[#3E3D35] bg-[#DFDBD0] font-bold';
    }
  };

  const handleClick = (entry) => {
    if (inspectRecord) inspectRecord('entry', entry);
    if (onSelectEntry) onSelectEntry(entry);
  };

  return (
    <div className="border border-[#AAA99B] bg-[#E9E5D8] flex flex-col justify-between select-none shadow-sm h-full">
      {/* Header */}
      <div>
        <div className="p-2.5 pb-2 border-b border-[#AAA99B] flex items-center justify-between">
          <div className="flex items-center space-x-1.5">
            <span className="w-1.5 h-1.5 bg-[#25251F] inline-block"></span>
            <span className="text-[10px] uppercase tracking-wider font-mono font-bold text-[#25251F]">
              RECENT ENTRIES
            </span>
          </div>
          <button
            onClick={onViewAll}
            className="text-[#55544B] hover:text-[#141512] font-bold uppercase tracking-wider text-[8px] underline decoration-dotted transition-colors"
          >
            VIEW ALL
          </button>
        </div>

        {/* Table / List */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-[9px] font-mono">
            <tbody className="divide-y divide-[#DDD9CD]">
              {entries.slice(0, 4).map((entry) => (
                <tr 
                  key={entry.id}
                  onClick={() => handleClick(entry)}
                  className="hover:bg-[#E2DDD0] transition-colors cursor-pointer group"
                >
                  <td className="py-2.5 px-2.5 text-[#55544B] font-mono whitespace-nowrap text-[8px]">
                    {entry.date} <span className="text-[#141512] font-bold">{entry.time}</span>
                  </td>
                  <td className="py-2.5 px-2.5 text-[#141512] font-bold text-[9.5px] group-hover:underline">
                    {entry.title}
                  </td>
                  <td className="py-2.5 px-2.5 text-right whitespace-nowrap">
                    <span className={`inline-block px-1.5 py-0.5 text-[7.5px] border font-mono tracking-wider ${getCategoryTagStyle(entry.category)}`}>
                      {entry.category}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sub-bar */}
      <div className="px-2.5 py-1.5 bg-[#E2DDCF] border-t border-[#AAA99B] flex justify-between text-[7.5px] font-mono font-bold text-[#55544B]">
        <span>INDEX ARCHIVE: ENTRIES_DB</span>
        <span>4 OF {entries.length || 18} RECENT</span>
      </div>
    </div>
  );
}
