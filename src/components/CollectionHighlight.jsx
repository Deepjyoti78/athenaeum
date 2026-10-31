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
    <div className="border border-[#B5B3A4] bg-[#EAE7D9] flex flex-col justify-between p-2.5 select-none shadow-sm h-full font-mono">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between pb-1.5 border-b border-[#B5B3A4]">
          <div className="flex items-center space-x-1.5">
            <span className="w-1.5 h-1.5 bg-[#171714] inline-block" />
            <span className="text-[10px] uppercase tracking-wider font-mono font-bold text-[#171714]">
              COLLECTION HIGHLIGHT
            </span>
          </div>
          <button
            onClick={handleOpen}
            className="text-[#66655B] hover:text-[#171714] uppercase tracking-wider text-[8px] underline decoration-dotted transition-colors font-bold"
          >
            VIEW ALL
          </button>
        </div>

        {/* Title and metadata */}
        <div className="pt-2 flex items-center justify-between">
          <div onClick={handleOpen} className="cursor-pointer">
            <div className="text-[10px] font-mono font-bold text-[#171714] tracking-tight hover:underline">
              {collection.title}
            </div>
            <div className="text-[7.5px] font-mono text-[#66655B] mt-0.5">
              {collection.itemCount || 24} Cataloged Items
            </div>
          </div>
          <button 
            onClick={handleOpen}
            title="Inspect collection"
            className="text-[#66655B] hover:text-[#171714] p-0.5"
          >
            <MoreHorizontal className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Thumbnails Row */}
        <div className="grid grid-cols-4 gap-2 pt-2">
          {(collection.items || ['highlight_specimen', 'highlight_blueprint', 'highlight_sketch', 'beetle']).slice(0, 4).map((artType, idx) => (
            <div
              key={idx}
              onClick={() => {
                if (onThumbnailClick) onThumbnailClick(artType);
                else handleOpen();
              }}
              className="h-[64px] border border-[#B5B3A4] overflow-hidden bg-[#D5D0C2] cursor-pointer hover:border-[#171714] transition-all transform hover:-translate-y-0.5"
              title={`Archival item ${idx + 1}`}
            >
              <ArchivalArtwork type={artType} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      </div>

      {/* Footer bar */}
      <div className="pt-2 border-t border-[#B5B3A4] flex items-center justify-between text-[7.5px] font-mono text-[#66655B] mt-2">
        <span>CURATED ARCHIVE</span>
        <span className="font-bold text-[#171714]">VAULT://INSPIRATIONS</span>
      </div>
    </div>
  );
}

export default CollectionHighlight;
