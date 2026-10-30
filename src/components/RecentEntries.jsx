import React from 'react';
import { useArchive } from '../context/ArchiveContext';

export function RecentEntries({ entries: propEntries, onViewAll, onSelectEntry }) {
  const context = useArchive();
  const entries = propEntries || context.entries || [];
  const inspectRecord = context?.inspectRecord;

  const getCategoryTagStyle = (cat) => {
    switch (cat) {
      case 'Project Note':
        return 'border-[#949182] text-[#333229] bg-[#DDD8CB]';
      case 'Idea':
        return 'border-[#777A5A] text-[#4A4E35] bg-[#E2E4D5]';
      case 'Meeting':
        return 'border-[#8F8B7D] text-[#3D3A2F] bg-[#DFDBD0]';
      case 'Research':
        return 'border-[#687F68] text-[#344434] bg-[#D7DFD7]';
      default:
        return 'border-[#AAA99B] text-[#55544B] bg-[#DFDBD0]';
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
          <span className="text-[10px] uppercase tracking-wider font-mono font-semibold text-[#66655A]">
            RECENT ENTRIES
          </span>
          <button
            onClick={onViewAll}
            className="text-[#68675C] hover:text-[#25251F] uppercase tracking-wider text-[8px] underline decoration-dotted transition-colors"
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
                  <td className="py-2 px-2.5 text-[#77766B] font-mono whitespace-nowrap text-[8px]">
                    {entry.date} <span className="text-[#55544B] font-medium">{entry.time}</span>
                  </td>
                  <td className="py-2 px-2.5 text-[#25251F] font-medium group-hover:underline">
                    {entry.title}
                  </td>
                  <td className="py-2 px-2.5 text-right whitespace-nowrap">
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
      <div className="px-2.5 py-1.5 bg-[#E2DDCF] border-t border-[#AAA99B] flex justify-between text-[7.5px] font-mono text-[#77766B]">
        <span>INDEX ARCHIVE: ENTRIES_DB</span>
        <span>4 OF 18 RECENT</span>
      </div>
    </div>
  );
}
