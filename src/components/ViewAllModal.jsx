import React, { useState } from 'react';
import { X, Search, Filter, ArrowUpDown } from 'lucide-react';
import { ArchivalArtwork } from './ArchivalArtwork';

export function ViewAllModal({ 
  isOpen, 
  onClose, 
  title, 
  type, 
  items, 
  onSelectItem 
}) {
  const [filterText, setFilterText] = useState('');

  if (!isOpen) return null;

  const filteredItems = items.filter(item => {
    const q = filterText.toLowerCase();
    if (!q) return true;
    if (type === 'works') {
      return item.title.toLowerCase().includes(q) || item.type.toLowerCase().includes(q);
    }
    if (type === 'actions') {
      return item.action.toLowerCase().includes(q) || item.work.toLowerCase().includes(q);
    }
    if (type === 'entries') {
      return item.title.toLowerCase().includes(q) || item.category.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-[1px] z-50 flex items-center justify-center p-4 font-mono select-none">
      <div className="w-full max-w-3xl bg-[#E9E5D8] border border-[#25251F] shadow-2xl flex flex-col max-h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="p-3 bg-[#DFDBD0] border-b border-[#AAA99B] flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 bg-[#738A62] inline-block"></span>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#25251F]">
              ARCHIVE REPOSITORY — {title}
            </span>
          </div>
          <button onClick={onClose} className="p-1 text-[#666] hover:text-black">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="p-2 border-b border-[#AAA99B] bg-[#ECE7DC] flex items-center justify-between text-[9px]">
          <div className="flex items-center space-x-2 flex-1 max-w-xs">
            <Search className="w-3 h-3 text-[#777]" />
            <input
              type="text"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              placeholder="Filter list..."
              className="w-full bg-[#FAF8F3] border border-[#AAA99B] px-1.5 py-0.5 text-[9px] text-[#25251F] focus:outline-none"
            />
          </div>
          <div className="text-[8px] text-[#666]">
            SHOWING {filteredItems.length} OF {items.length} RECORDS
          </div>
        </div>

        {/* Content body */}
        <div className="p-3 overflow-y-auto max-h-[60vh]">
          {type === 'works' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {filteredItems.map((work) => (
                <div
                  key={work.id}
                  onClick={() => {
                    onSelectItem(work);
                    onClose();
                  }}
                  className="p-2 border border-[#AAA99B] bg-[#F1EDE2] hover:bg-[#E5E0D2] cursor-pointer flex space-x-3 items-center group transition-colors"
                >
                  <div className="w-20 h-16 border border-[#AAA99B] flex-shrink-0 overflow-hidden bg-[#DDD]">
                    <ArchivalArtwork type={work.artwork} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] font-bold text-[#25251F] truncate group-hover:underline">
                      {work.title}
                    </div>
                    <div className="text-[8px] text-[#666] mt-0.5">
                      {work.id} • {work.type} • {work.status}
                    </div>
                    <div className="text-[7.5px] text-[#888] mt-1 line-clamp-1">
                      {work.description}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {type === 'actions' && (
            <table className="w-full text-left border-collapse text-[9px]">
              <thead>
                <tr className="border-b border-[#AAA99B] text-[#777] uppercase text-[8px]">
                  <th className="py-1 px-2 font-normal">TIME</th>
                  <th className="py-1 px-2 font-normal">ACTION</th>
                  <th className="py-1 px-2 font-normal">WORK</th>
                  <th className="py-1 px-2 font-normal">STATUS</th>
                  <th className="py-1 px-2 font-normal text-right">PRIORITY</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DDD9CD]">
                {filteredItems.map((act) => (
                  <tr key={act.id} className="hover:bg-[#E3DDCF]">
                    <td className="py-1.5 px-2 font-mono text-[#666]">{act.time}</td>
                    <td className="py-1.5 px-2 font-medium text-[#25251F]">{act.action}</td>
                    <td className="py-1.5 px-2 text-[#555]">{act.work}</td>
                    <td className="py-1.5 px-2">
                      <span className="text-[#738A62] font-semibold">{act.status}</span>
                    </td>
                    <td className="py-1.5 px-2 text-right">{'●'.repeat(act.priority)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {type === 'entries' && (
            <table className="w-full text-left border-collapse text-[9px]">
              <thead>
                <tr className="border-b border-[#AAA99B] text-[#777] uppercase text-[8px]">
                  <th className="py-1 px-2 font-normal">TIMESTAMP</th>
                  <th className="py-1 px-2 font-normal">ENTRY TITLE</th>
                  <th className="py-1 px-2 font-normal text-right">CATEGORY</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DDD9CD]">
                {filteredItems.map((ent) => (
                  <tr key={ent.id} className="hover:bg-[#E3DDCF]">
                    <td className="py-1.5 px-2 text-[#777]">{ent.date} {ent.time}</td>
                    <td className="py-1.5 px-2 font-medium text-[#25251F]">{ent.title}</td>
                    <td className="py-1.5 px-2 text-right">
                      <span className="px-1.5 py-0.5 border border-[#AAA99B] bg-[#DDD8CB] text-[7.5px]">
                        {ent.category}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Footer */}
        <div className="p-2.5 bg-[#DFDBD0] border-t border-[#AAA99B] flex justify-end">
          <button
            onClick={onClose}
            className="px-3 py-1 bg-[#25251F] text-[#E9E5D8] hover:bg-black text-[9px] uppercase tracking-wider font-semibold"
          >
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
}

