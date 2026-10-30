import React, { useState } from 'react';
import { MoreHorizontal, Edit2, Trash2, Eye } from 'lucide-react';
import { ArchivalArtwork } from './ArchivalArtwork';

export function RecentWorks({ works, selectedWorkId, onSelectWork, onViewAll, onEditWork, onDeleteWork }) {
  const [activeMenuId, setActiveMenuId] = useState(null);

  const toggleMenu = (e, id) => {
    e.stopPropagation();
    setActiveMenuId(activeMenuId === id ? null : id);
  };

  // Strictly maintain the 4 works order from reference Screenshot 2
  const preferredOrder = ['WRK-2025-0003', 'WRK-2025-0002', 'WRK-2025-0001', 'WRK-2025-0004'];
  const displayWorks = [...works].sort((a, b) => {
    const idxA = preferredOrder.indexOf(a.id);
    const idxB = preferredOrder.indexOf(b.id);
    if (idxA !== -1 && idxB !== -1) return idxA - idxB;
    if (idxA !== -1) return -1;
    if (idxB !== -1) return 1;
    return 0;
  }).slice(0, 4);

  return (
    <div className="space-y-1.5 select-none font-mono">
      {/* Header */}
      <div className="flex items-center justify-between text-[9.5px] font-mono">
        <span className="uppercase tracking-widest font-medium text-[#77766B]">
          RECENT WORKS
        </span>
        <button
          onClick={onViewAll}
          className="text-[#77766B] hover:text-[#25251F] uppercase tracking-wider text-[8px] underline decoration-dotted transition-colors"
        >
          VIEW ALL
        </button>
      </div>

      {/* 4 Cards Row matching Screenshot 2 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {displayWorks.map((work) => {
          const isSelected = selectedWorkId === work.id;
          const isMenuOpen = activeMenuId === work.id;

          return (
            <div
              key={work.id}
              onClick={() => {
                setActiveMenuId(null);
                onSelectWork(work);
              }}
              className={`border transition-all cursor-pointer p-2 flex flex-col justify-between group relative shadow-sm ${
                isSelected
                  ? 'border-[#25251F] bg-[#DFDBD0] shadow-[inset_0_0_0_1px_#25251F]'
                  : 'border-[#AAA99B] bg-[#E9E5D8] hover:bg-[#E3DFD3] hover:border-[#77766B]'
              }`}
            >
              {/* Thumbnail Container */}
              <div className="w-full h-[96px] border border-[#AAA99B] overflow-hidden mb-2 bg-[#D5D0C2] relative">
                <ArchivalArtwork 
                  type={work.artwork} 
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.01]" 
                />

                {/* ACTIVE Badge on top-left of Card 1 */}
                {isSelected && (
                  <div className="absolute top-1.5 left-1.5 bg-[#25251F] text-[#E9E5D8] text-[7px] font-mono px-1.5 py-0.5 tracking-wider font-semibold z-10">
                    ACTIVE
                  </div>
                )}
                
                {/* Context dots on top-right */}
                <button
                  onClick={(e) => toggleMenu(e, work.id)}
                  title="Record options"
                  className="absolute top-1.5 right-1.5 bg-[#E9E5D8]/90 hover:bg-[#E9E5D8] p-0.5 border border-[#AAA99B]/70 text-[#333] transition-colors z-10"
                >
                  <MoreHorizontal className="w-2.5 h-2.5 text-[#444]" />
                </button>

                {/* Popover Menu */}
                {isMenuOpen && (
                  <div 
                    onClick={(e) => e.stopPropagation()}
                    className="absolute top-7 right-1.5 z-30 bg-[#E9E5D8] border border-[#25251F] shadow-xl py-1 text-[8px] font-mono min-w-[90px] animate-fadeIn"
                  >
                    <button
                      onClick={() => {
                        setActiveMenuId(null);
                        onSelectWork(work);
                      }}
                      className="w-full text-left px-2 py-1 hover:bg-[#DFDBD0] flex items-center space-x-1.5 text-[#25251F]"
                    >
                      <Eye className="w-2.5 h-2.5" />
                      <span>INSPECT</span>
                    </button>
                    {onEditWork && (
                      <button
                        onClick={() => {
                          setActiveMenuId(null);
                          onEditWork(work);
                        }}
                        className="w-full text-left px-2 py-1 hover:bg-[#DFDBD0] flex items-center space-x-1.5 text-[#25251F]"
                      >
                        <Edit2 className="w-2.5 h-2.5" />
                        <span>EDIT</span>
                      </button>
                    )}
                    {onDeleteWork && (
                      <button
                        onClick={() => {
                          setActiveMenuId(null);
                          onDeleteWork(work.id);
                        }}
                        className="w-full text-left px-2 py-1 hover:bg-[#D9A39D] text-[#9A3838] flex items-center space-x-1.5"
                      >
                        <Trash2 className="w-2.5 h-2.5" />
                        <span>DELETE</span>
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Title & Metadata */}
              <div className="space-y-1">
                <h4 className="text-[9.5px] font-mono font-semibold text-[#25251F] tracking-tight leading-snug line-clamp-1 group-hover:text-black">
                  {work.title}
                </h4>

                <div className="space-y-0.5 text-[7.5px] font-mono text-[#57564C] pt-1.5 border-t border-[#D5D1C4]">
                  <div className="grid grid-cols-12">
                    <span className="col-span-5 text-[#77766B]">Type:</span>
                    <span className="col-span-7 text-[#25251F] font-normal truncate">{work.type}</span>
                  </div>
                  <div className="grid grid-cols-12">
                    <span className="col-span-5 text-[#77766B]">Status:</span>
                    <span className="col-span-7 text-[#25251F] flex items-center space-x-1">
                      <span className={`w-1.5 h-1.5 rounded-full inline-block ${
                        work.status === 'In progress' ? 'bg-[#738A62]' :
                        work.status === 'Planned' ? 'bg-[#777A5A]' : 'bg-[#738A62]'
                      }`}></span>
                      <span className="truncate">{work.status}</span>
                    </span>
                  </div>
                  <div className="grid grid-cols-12">
                    <span className="col-span-5 text-[#77766B]">Updated:</span>
                    <span className="col-span-7 text-[#44433A] truncate">{work.updated}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
