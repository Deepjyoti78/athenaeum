import React, { useState } from 'react';
import { MapPin, Search, Plus, Compass, ExternalLink, X } from 'lucide-react';
import { INITIAL_PLACES } from '../data/mockData';

export function PlacesView({ places = INITIAL_PLACES, onAddPlace }) {
  const [placeList, setPlaceList] = useState(places);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  // New place state
  const [name, setName] = useState('');
  const [region, setRegion] = useState('');
  const [coords, setCoords] = useState('');
  const [description, setDescription] = useState('');
  const [linkedWork, setLinkedWork] = useState('East London Heritage Archive');

  const filteredPlaces = placeList.filter(p => {
    const q = searchQuery.toLowerCase().trim();
    return !q || p.name.toLowerCase().includes(q) || p.region.toLowerCase().includes(q) || p.description.toLowerCase().includes(q);
  });

  const handleCreate = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    const newP = {
      id: `plc-${Date.now()}`,
      name: name.trim(),
      region: region.trim() || 'London, UK',
      coordinates: coords.trim() || '51.5074° N, 0.1278° W',
      type: 'Archival Location',
      description: description.trim() || 'Geographic field survey station.',
      linkedWork: linkedWork,
      recordsCount: 1,
      established: '1900'
    };
    setPlaceList([newP, ...placeList]);
    if (onAddPlace) onAddPlace(newP);
    setIsAdding(false);
    setName('');
    setRegion('');
    setCoords('');
    setDescription('');
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#E9E5D8] overflow-hidden select-none font-mono">
      {/* Header */}
      <div className="p-3 border-b border-[#AAA99B] bg-[#DFDBD0] flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 bg-[#738A62] inline-block"></span>
          <h1 className="text-xs font-bold uppercase tracking-wider text-[#25251F]">
            GEOGRAPHIC &amp; PLACES REGISTRY
          </h1>
          <span className="text-[9px] text-[#77766B]">
            ({filteredPlaces.length} LOCI RECORDED)
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1.5 bg-[#FAF8F3] border border-[#AAA99B] px-2 py-0.5 text-[9px]">
            <Search className="w-3 h-3 text-[#77766B]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search places..."
              className="bg-transparent text-[9px] text-[#25251F] focus:outline-none w-36"
            />
          </div>

          <button
            onClick={() => setIsAdding(true)}
            className="bg-[#25251F] text-[#E9E5D8] hover:bg-black px-2.5 py-1 text-[8.5px] font-semibold uppercase tracking-wider flex items-center space-x-1"
          >
            <Plus className="w-2.5 h-2.5" />
            <span>ADD PLACE</span>
          </button>
        </div>
      </div>

      {/* Grid of Places */}
      <div className="flex-1 overflow-y-auto p-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filteredPlaces.map((plc) => (
            <div
              key={plc.id}
              className="border border-[#AAA99B] bg-[#E9E5D8] hover:bg-[#E3DFD3] p-3 flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start pb-2 border-b border-[#D5D1C4]">
                  <div>
                    <h3 className="text-xs font-bold text-[#25251F]">
                      {plc.name}
                    </h3>
                    <div className="text-[8px] text-[#666] font-mono mt-0.5 flex items-center space-x-1">
                      <Compass className="w-2.5 h-2.5 text-[#738A62]" />
                      <span>{plc.coordinates}</span>
                    </div>
                  </div>
                  <span className="text-[7.5px] px-1.5 py-0.5 border border-[#AAA99B] bg-[#DDD8CB] text-[#333]">
                    {plc.type}
                  </span>
                </div>

                <div className="mt-2.5 space-y-1.5 text-[8.5px]">
                  <p className="text-[#33322A] leading-relaxed">
                    {plc.description}
                  </p>
                  <div className="pt-2 border-t border-[#D5D1C4] flex justify-between text-[8px] text-[#666]">
                    <span>REGION: <strong className="text-[#25251F]">{plc.region}</strong></span>
                    <span>ESTABLISHED: {plc.established}</span>
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-1.5 border-t border-[#D5D1C4] flex items-center justify-between text-[7.5px] text-[#77766B]">
                <span>LINKED WORK: <strong className="text-[#25251F]">{plc.linkedWork}</strong></span>
                <span className="bg-[#DFDBD0] px-1.5 py-0.2 border border-[#AAA99B]">
                  {plc.recordsCount} RECORDS
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Place Dialog */}
      {isAdding && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-[1px] z-50 flex items-center justify-center p-4">
          <div className="bg-[#E9E5D8] border border-[#25251F] max-w-md w-full p-3 shadow-2xl">
            <div className="flex justify-between items-center pb-2 border-b border-[#AAA99B]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#25251F]">
                RECORD GEOGRAPHIC LOCUS
              </span>
              <button onClick={() => setIsAdding(false)} className="hover:text-black">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <form onSubmit={handleCreate} className="space-y-2 mt-3 text-[9px]">
              <div>
                <label className="block text-[8px] uppercase tracking-wider text-[#666] mb-0.5">LOCATION NAME *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Limehouse Lock Chamber"
                  className="w-full bg-[#FAF8F3] border border-[#AAA99B] p-1.5 text-[9px] focus:outline-none"
                  autoFocus
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[8px] uppercase tracking-wider text-[#666] mb-0.5">COORDINATES</label>
                  <input
                    type="text"
                    value={coords}
                    onChange={(e) => setCoords(e.target.value)}
                    placeholder="51.5128° N, 0.0384° W"
                    className="w-full bg-[#FAF8F3] border border-[#AAA99B] p-1.5 text-[9px] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[8px] uppercase tracking-wider text-[#666] mb-0.5">REGION</label>
                  <input
                    type="text"
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    placeholder="East London, UK"
                    className="w-full bg-[#FAF8F3] border border-[#AAA99B] p-1.5 text-[9px] focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[8px] uppercase tracking-wider text-[#666] mb-0.5">HISTORIC SUMMARY</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  placeholder="Historical context, relevance to project..."
                  className="w-full bg-[#FAF8F3] border border-[#AAA99B] p-1.5 text-[9px] focus:outline-none resize-none"
                />
              </div>
              <div className="pt-2 border-t border-[#AAA99B] flex justify-end space-x-1.5">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-2.5 py-1 border border-[#AAA99B] bg-[#DFDBD0] text-[8px] uppercase"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="px-3 py-1 bg-[#25251F] text-[#E9E5D8] text-[8px] font-bold uppercase hover:bg-black"
                >
                  RECORD PLACE
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

