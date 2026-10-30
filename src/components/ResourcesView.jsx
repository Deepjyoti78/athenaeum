import React, { useState } from 'react';
import { Archive, Search, Plus, HardDrive, ShieldCheck, FileCheck, X } from 'lucide-react';
import { INITIAL_RESOURCES } from '../data/mockData';

export function ResourcesView({ resources = INITIAL_RESOURCES, onAddResource }) {
  const [resList, setResList] = useState(resources);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCat, setFilterCat] = useState('ALL');
  const [isAdding, setIsAdding] = useState(false);

  // New resource state
  const [title, setTitle] = useState('');
  const [format, setFormat] = useState('TIFF (600 DPI)');
  const [size, setSize] = useState('15 MB');
  const [location, setLocation] = useState('Local Disk');
  const [category, setCategory] = useState('Digital Database');

  const categories = ['ALL', 'DIGITAL DATABASE', 'DIGITAL CARTOGRAPHY', 'PHYSICAL NEGATIVE', 'PHYSICAL REFERENCE', 'DIGITAL 3D ASSET'];

  const filteredResources = resList.filter(r => {
    const matchesCat = filterCat === 'ALL' || r.category.toUpperCase() === filterCat;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || r.title.toLowerCase().includes(q) || r.location.toLowerCase().includes(q) || r.format.toLowerCase().includes(q);
    return matchesCat && matchesSearch;
  });

  const handleCreate = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    const newRes = {
      id: `res-${Date.now()}`,
      title: title.trim(),
      format: format,
      size: size,
      location: location,
      category: category,
      checksum: `0x${Math.floor(Math.random() * 0xFFFFFF).toString(16).toUpperCase()}`,
      status: 'Mounted & Verified',
      updated: 'Today'
    };
    setResList([newRes, ...resList]);
    if (onAddResource) onAddResource(newRes);
    setIsAdding(false);
    setTitle('');
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#E9E5D8] overflow-hidden select-none font-mono">
      {/* Header */}
      <div className="p-3 border-b border-[#AAA99B] bg-[#DFDBD0] flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 bg-[#738A62] inline-block"></span>
          <h1 className="text-xs font-bold uppercase tracking-wider text-[#25251F]">
            VAULT RESOURCES &amp; ARTIFACTS REGISTRY
          </h1>
          <span className="text-[9px] text-[#77766B]">
            ({filteredResources.length} ASSETS)
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1.5 bg-[#FAF8F3] border border-[#AAA99B] px-2 py-0.5 text-[9px]">
            <Search className="w-3 h-3 text-[#77766B]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search resources..."
              className="bg-transparent text-[9px] text-[#25251F] focus:outline-none w-36"
            />
          </div>

          <button
            onClick={() => setIsAdding(true)}
            className="bg-[#25251F] text-[#E9E5D8] hover:bg-black px-2.5 py-1 text-[8.5px] font-semibold uppercase tracking-wider flex items-center space-x-1"
          >
            <Plus className="w-2.5 h-2.5" />
            <span>ADD RESOURCE</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="px-3 py-1.5 border-b border-[#AAA99B] bg-[#ECE7DC] flex items-center space-x-1 text-[8px] overflow-x-auto">
        <span className="text-[#77766B] mr-1 uppercase">CATEGORY:</span>
        {categories.map(c => (
          <button
            key={c}
            onClick={() => setFilterCat(c)}
            className={`px-2 py-0.5 border whitespace-nowrap ${
              filterCat === c
                ? 'border-[#25251F] bg-[#25251F] text-[#E9E5D8] font-bold'
                : 'border-[#AAA99B] bg-[#DFDBD0] text-[#55544B] hover:bg-[#D5D1C4]'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Resources Table */}
      <div className="flex-1 overflow-y-auto p-3">
        <div className="border border-[#AAA99B] bg-[#E9E5D8]">
          <table className="w-full text-left border-collapse text-[9px] font-mono">
            <thead>
              <tr className="border-b border-[#AAA99B] bg-[#DFDBD0] text-[#666] uppercase text-[8px]">
                <th className="py-2 px-3 font-normal">ASSET TITLE</th>
                <th className="py-2 px-3 font-normal w-32">FORMAT</th>
                <th className="py-2 px-3 font-normal w-24">SIZE</th>
                <th className="py-2 px-3 font-normal">STORAGE / PHYSICAL LOCATION</th>
                <th className="py-2 px-3 font-normal w-28">CHECKSUM</th>
                <th className="py-2 px-3 font-normal w-36 text-right">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DDD9CD]">
              {filteredResources.map((res) => (
                <tr key={res.id} className="hover:bg-[#E2DDD0] transition-colors">
                  <td className="py-2 px-3 text-[#25251F] font-bold">
                    {res.title}
                    <div className="text-[7.5px] text-[#77766B] font-normal">{res.category}</div>
                  </td>
                  <td className="py-2 px-3 text-[#555]">
                    <span className="px-1.5 py-0.5 border border-[#AAA99B] bg-[#DDD8CB] text-[7.5px]">
                      {res.format}
                    </span>
                  </td>
                  <td className="py-2 px-3 text-[#25251F] font-semibold">{res.size}</td>
                  <td className="py-2 px-3 text-[#444] font-mono truncate max-w-xs">{res.location}</td>
                  <td className="py-2 px-3 text-[#77766B] font-mono text-[8px]">{res.checksum}</td>
                  <td className="py-2 px-3 text-right">
                    <span className="inline-flex items-center space-x-1 text-[#738A62] font-semibold text-[8px]">
                      <ShieldCheck className="w-2.5 h-2.5" />
                      <span>{res.status}</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Dialog */}
      {isAdding && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-[1px] z-50 flex items-center justify-center p-4">
          <div className="bg-[#E9E5D8] border border-[#25251F] max-w-md w-full p-3 shadow-2xl">
            <div className="flex justify-between items-center pb-2 border-b border-[#AAA99B]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#25251F]">
                CATALOG VAULT RESOURCE
              </span>
              <button onClick={() => setIsAdding(false)} className="hover:text-black">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <form onSubmit={handleCreate} className="space-y-2 mt-3 text-[9px]">
              <div>
                <label className="block text-[8px] uppercase tracking-wider text-[#666] mb-0.5">RESOURCE TITLE *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. 1928 Monotype Universal Specimen"
                  className="w-full bg-[#FAF8F3] border border-[#AAA99B] p-1.5 text-[9px] focus:outline-none"
                  autoFocus
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[8px] uppercase tracking-wider text-[#666] mb-0.5">FORMAT</label>
                  <input
                    type="text"
                    value={format}
                    onChange={(e) => setFormat(e.target.value)}
                    placeholder="TIFF / SQLITE / PDF"
                    className="w-full bg-[#FAF8F3] border border-[#AAA99B] p-1.5 text-[9px] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[8px] uppercase tracking-wider text-[#666] mb-0.5">SIZE</label>
                  <input
                    type="text"
                    value={size}
                    onChange={(e) => setSize(e.target.value)}
                    placeholder="24 MB"
                    className="w-full bg-[#FAF8F3] border border-[#AAA99B] p-1.5 text-[9px] focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[8px] uppercase tracking-wider text-[#666] mb-0.5">LOCATION PATH / VAULT BIN</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="/var/archive/foliage_plate.sketch"
                  className="w-full bg-[#FAF8F3] border border-[#AAA99B] p-1.5 text-[9px] focus:outline-none"
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
                  CATALOG ASSET
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

