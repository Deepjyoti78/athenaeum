import React, { useState } from 'react';
import { Layers, Maximize2, X } from 'lucide-react';
import { ArchivalArtwork } from './ArchivalArtwork';
import { INITIAL_COLLECTIONS } from '../data/mockData';

export function CollectionsView({ collections = INITIAL_COLLECTIONS }) {
  const [activeCollectionId, setActiveCollectionId] = useState(collections?.[0]?.id || null);
  const [lightboxItem, setLightboxItem] = useState(null);

  const safeCollections = Array.isArray(collections) ? collections : [];
  const activeCollection = safeCollections.find(c => c.id === activeCollectionId) || safeCollections[0] || null;

  if (safeCollections.length === 0 || !activeCollection) {
    return (
      <div className="flex-1 flex flex-col h-full bg-[#E9E5D8] overflow-hidden select-none font-mono">
        {/* Header */}
        <div className="p-3 border-b border-[#AAA99B] bg-[#DFDBD0] flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 bg-[#738A62] inline-block"></span>
            <h1 className="text-xs font-bold uppercase tracking-wider text-[#25251F]">
              CURATED VISUAL COLLECTIONS
            </h1>
            <span className="text-[9px] text-[#77766B]">
              (0 ARCHIVAL BOARDS)
            </span>
          </div>
        </div>

        {/* Empty State */}
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-[#66655A]">
          <div className="w-12 h-12 border border-[#AAA99B] bg-[#DFDBD0] flex items-center justify-center mb-3">
            <Layers className="w-6 h-6 text-[#555]" />
          </div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#25251F] mb-1">
            NO COLLECTIONS RECORDED IN VAULT
          </h3>
          <p className="text-[9px] max-w-sm mb-4 leading-relaxed text-[#77766B]">
            No curated visual boards or image collections have been cataloged yet for this user. Create a new collection using the &ldquo;+ NEW RECORD&rdquo; button above.
          </p>
        </div>
      </div>
    );
  }

  const items = Array.isArray(activeCollection.items) 
    ? activeCollection.items 
    : (activeCollection.photo ? [activeCollection.photo] : []);

  return (
    <div className="flex-1 flex flex-col h-full bg-[#E9E5D8] overflow-hidden select-none font-mono">
      {/* Header */}
      <div className="p-3 border-b border-[#AAA99B] bg-[#DFDBD0] flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 bg-[#738A62] inline-block"></span>
          <h1 className="text-xs font-bold uppercase tracking-wider text-[#25251F]">
            CURATED VISUAL COLLECTIONS
          </h1>
          <span className="text-[9px] text-[#77766B]">
            ({safeCollections.length} ARCHIVAL BOARDS)
          </span>
        </div>
      </div>

      {/* Collection Tabs */}
      <div className="px-3 py-1.5 border-b border-[#AAA99B] bg-[#ECE7DC] flex items-center space-x-1 text-[8px] overflow-x-auto">
        <span className="text-[#77766B] mr-1 uppercase">COLLECTION:</span>
        {safeCollections.map(col => {
          const count = col.itemCount ?? (Array.isArray(col.items) ? col.items.length : (col.photo ? 1 : 0));
          return (
            <button
              key={col.id}
              onClick={() => setActiveCollectionId(col.id)}
              className={`px-2.5 py-0.5 border whitespace-nowrap transition-colors ${
                (activeCollection?.id === col.id)
                  ? 'border-[#25251F] bg-[#25251F] text-[#E9E5D8] font-bold'
                  : 'border-[#AAA99B] bg-[#DFDBD0] text-[#55544B] hover:bg-[#D5D1C4]'
              }`}
            >
              {col.title} ({count})
            </button>
          );
        })}
      </div>

      {/* Active Collection Summary Bar */}
      <div className="p-3 border-b border-[#D5D1C4] bg-[#E5E0D3] flex items-center justify-between text-[8.5px]">
        <div>
          <span className="font-bold text-[#25251F] uppercase">{activeCollection.title || 'UNTITLED COLLECTION'}</span>
          <span className="text-[#666] ml-2">— {activeCollection.description || 'Archival collection board.'}</span>
        </div>
        <div className="text-[7.5px] text-[#77766B]">
          LINKED TO: <span className="font-semibold text-[#25251F]">{activeCollection.linkedWork || 'General Archive'}</span>
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="flex-1 overflow-y-auto p-4">
        {items.length === 0 ? (
          <div className="py-12 text-center text-[#77766B] text-[9px] border border-dashed border-[#B5B3A4] bg-[#FAF8F3]/60">
            NO SPECIMEN PLATES RECORDED IN THIS COLLECTION.
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {items.map((artType, idx) => (
              <div
                key={idx}
                onClick={() => setLightboxItem({ type: artType, title: `${activeCollection.title || 'Collection'} — Specimen #${idx + 1}` })}
                className="border border-[#AAA99B] bg-[#FAF8F3] hover:border-[#25251F] p-2 flex flex-col justify-between group cursor-pointer transition-all hover:shadow-md"
              >
                {/* Media Container */}
                <div className="w-full h-36 border border-[#AAA99B] bg-[#DDD8CB] overflow-hidden relative">
                  <ArchivalArtwork type={artType} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                    <Maximize2 className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-md" />
                  </div>
                </div>

                {/* Caption */}
                <div className="mt-2 pt-1 border-t border-[#D5D1C4] flex items-center justify-between text-[7.5px] text-[#666]">
                  <span className="font-bold text-[#25251F]">SPECIMEN-0{idx + 1}</span>
                  <span>VAULT://MEDIA</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {lightboxItem && (
        <div 
          onClick={() => setLightboxItem(null)}
          className="fixed inset-0 bg-black/75 backdrop-blur-[2px] z-50 flex items-center justify-center p-4"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-[#E9E5D8] border border-[#25251F] max-w-2xl w-full p-3 shadow-2xl flex flex-col space-y-3"
          >
            <div className="flex items-center justify-between pb-2 border-b border-[#AAA99B]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#25251F]">
                {lightboxItem.title}
              </span>
              <button onClick={() => setLightboxItem(null)} className="p-0.5 hover:text-black">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="h-72 border border-[#AAA99B] bg-[#141614] overflow-hidden flex items-center justify-center">
              <ArchivalArtwork type={lightboxItem.type} className="w-full h-full object-contain" />
            </div>

            <div className="pt-2 border-t border-[#D5D1C4] flex justify-between text-[8px] text-[#666]">
              <span>FORMAT: HIGH-RESOLUTION SVG / VECTOR</span>
              <span>SHA-256: 0x8C49F1B2</span>
              <span>CURATED VAULT ARTIFACT</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
