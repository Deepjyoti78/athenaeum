import React, { useState } from 'react';
import { MoreHorizontal, Edit2, Trash2, Eye } from 'lucide-react';
import { ArchivalArtwork } from './ArchivalArtwork';

export function RecentWorks({ works = [], selectedWorkId, onSelectWork, onViewAll, onEditWork, onDeleteWork }) {
  const [activeMenuId, setActiveMenuId] = useState(null);

  const toggleMenu = (e, id) => {
    e.stopPropagation();
    setActiveMenuId(activeMenuId === id ? null : id);
  };

  // Strictly maintain the 4 works order from reference Screenshot:
  // 1. Athenaeum App Project
  // 2. East London Heritage Archive
  // 3. Creature Concept Explorations
  // 4. Photography Portfolio
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
    <div className="space-y-1 select-none font-mono">
      {/* Header */}
      <div className="flex items-center justify-between text-[10px] font-mono">
        <span className="uppercase tracking-widest font-bold text-[#171714]">
          RECENT WORKS
        </span>
        <button
          onClick={onViewAll}
          className="text-[#171714] hover:text-black uppercase tracking-wider text-[8.5px] underline transition-colors"
        >
          VIEW ALL
        </button>
      </div>

      {/* 4 Cards Grid matching media_1793434566460_76b91e75.jpg */}
      {displayWorks.length === 0 ? (
        <div className="border border-dashed border-[#B5B3A4] bg-[#EAE7D9]/60 p-6 flex flex-col items-center justify-center text-center">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#171714]">NO WORKS CATALOGED IN THIS VAULT</p>
          <p className="text-[8px] text-[#66655B] mt-1">Initialize your first project, research inquiry, or creative exploration.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {displayWorks.map((work) => {
          const isSelected = selectedWorkId === work.id;
          const isMenuOpen = activeMenuId === work.id;

          return (
            <div
              key={work.id}
              onClick={() => {
                setActiveMenuId(null);
                onSelectWork && onSelectWork(work);
              }}
              className="border border-[#B5B3A4] bg-[#EAE7D9] hover:bg-[#E2DFD0] transition-colors cursor-pointer p-2 flex flex-col justify-between group relative shadow-sm"
            >
              {/* Artwork Container matching Image 2 aspect ratio */}
              <div className="w-full h-[88px] sm:h-[92px] border border-[#B5B3A4] overflow-hidden mb-2 bg-[#D5D0C2] relative">
                <ArchivalArtwork 
                  type={work.artwork} 
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.01]" 
                />

                {/* Contextual three-dot menu button in top right matching reference image */}
                <button
                  onClick={(e) => toggleMenu(e, work.id)}
                  title="Options"
                  className="absolute top-1 right-1 bg-[#EAE7D9]/90 hover:bg-[#FAF8F3] px-1 py-0.5 border border-[#B5B3A4] text-[#171714] transition-colors z-10"
                >
                  <MoreHorizontal className="w-2.5 h-2.5 text-[#171714]" />
                </button>

                {/* Popover Menu */}
                {isMenuOpen && (
                  <div 
                    onClick={(e) => e.stopPropagation()}
                    className="absolute top-7 right-1.5 z-30 bg-[#FAF8F3] border border-[#171714] shadow-xl py-1 text-[8px] font-mono min-w-[90px] animate-fadeIn"
                  >
                    <button
                      onClick={() => {
                        setActiveMenuId(null);
                        onSelectWork && onSelectWork(work);
                      }}
                      className="w-full text-left px-2 py-1 hover:bg-[#EAE7D9] flex items-center space-x-1.5 text-[#171714]"
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
                        className="w-full text-left px-2 py-1 hover:bg-[#EAE7D9] flex items-center space-x-1.5 text-[#171714]"
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

              {/* Title & Metadata matching reference image */}
              <div className="space-y-1">
                <h3 className="font-mono font-bold text-[9.5px] uppercase text-[#171714] tracking-tight truncate">
                  {work.title || work.shortTitle}
                </h3>

                <div className="space-y-0.5 text-[8px] font-mono text-[#55544B] pt-0.5 border-t border-[#D5D1C4]">
                  <div className="flex justify-between items-center">
                    <span className="text-[#66655A] flex-shrink-0">Type:</span>
                    <span className="font-semibold text-[#171714] truncate text-right pl-2">{work.type || 'Project'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#66655A] flex-shrink-0">Status:</span>
                    <div className="flex items-center space-x-1.5 flex-shrink-0 pl-2">
                      <span className={`w-1.5 h-1.5 rounded-full inline-block flex-shrink-0 ${
                        work.status === 'In progress' ? 'bg-[#74866A]' : 'bg-[#88877A]'
                      }`} />
                      <span className="font-semibold text-[#171714] truncate">{work.status || 'In progress'}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#66655A] flex-shrink-0">Updated:</span>
                    <span className="text-[#55544B] truncate text-right pl-2">{work.updated || 'Today 09:18'}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        </div>
      )}
    </div>
  );
}