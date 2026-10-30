import React from 'react';
import { MoreHorizontal } from 'lucide-react';
import { ArchivalArtwork } from './ArchivalArtwork';
import { useArchive } from '../context/ArchiveContext';

export function CollectionHighlight({ 
  collection: propCollection, 
  onViewCollection, 
  onThumbnailClick 
}) {
  const context = useArchive();
  const collection = propCollection || context.collections[0] || {
    id: 'col-1',
    title: 'DESIGN INSPIRATIONS',
    itemCount: 24,
    items: ['highlight_specimen', 'highlight_blueprint', 'highlight_sketch', 'beetle']
  };
  const { inspectRecord } = context;

  const handleOpen = () => {
    if (inspectRecord) inspectRecord('collection', collection);
    if (onViewCollection) onViewCollection();
  };

  return (
    <div className="border border-[#AAA99B] bg-[#E9E5D8] flex flex-col justify-between p-2.5 select-none shadow-sm h-full">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between pb-1.5 border-b border-[#D5D1C4]">
          <span className="text-[10px] uppercase tracking-wider font-mono font-semibold text-[#66655A]">
            COLLECTION HIGHLIGHT
          </span>
          <button
            onClick={handleOpen}
            className="text-[#68675C] hover:text-[#25251F] uppercase tracking-wider text-[8px] underline decoration-dotted transition-colors"
          >
            VIEW
          </button>
        </div>

        {/* Title and metadata */}
        <div className="pt-2 flex items-center justify-between">
          <div onClick={handleOpen} className="cursor-pointer">
            <div className="text-[10.5px] font-mono font-bold text-[#25251F] tracking-tight hover:underline">
              {collection.title}
            </div>
            <div className="text-[8px] font-mono text-[#77766B]">
              {collection.itemCount || 24} Items
            </div>
          </div>
          <button 
            onClick={handleOpen}
            title="Inspect collection"
            className="text-[#68675C] hover:text-[#25251F] p-0.5"
          >
            <MoreHorizontal className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Thumbnails Row */}
        <div className="grid grid-cols-4 gap-2 pt-2.5">
          {(collection.items || ['highlight_specimen', 'highlight_blueprint', 'highlight_sketch', 'beetle']).slice(0, 4).map((artType, idx) => (
            <div
              key={idx}
              onClick={() => {
                if (onThumbnailClick) onThumbnailClick(artType);
                else handleOpen();
              }}
              className="h-16 border border-[#AAA99B] overflow-hidden bg-[#D5D0C2] cursor-pointer hover:border-[#25251F] transition-all transform hover:-translate-y-0.5"
              title={`Archival item ${idx + 1}`}
            >
              <ArchivalArtwork type={artType} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      </div>

      {/* Footer bar */}
      <div className="pt-2 border-t border-[#D5D1C4] flex items-center justify-between text-[7.5px] font-mono text-[#77766B] mt-2">
        <span>CURATED ARCHIVE</span>
        <span>VAULT://INSPIRATIONS</span>
      </div>
    </div>
  );
}
