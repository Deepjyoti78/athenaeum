import React, { useState } from 'react';
import { Search, Filter, Plus, ArrowUpDown, Check, Circle, ExternalLink } from 'lucide-react';
import { ArchivalArtwork } from './ArchivalArtwork';

export function WorksView({ works = [], onSelectWork, onAddNewWork }) {
  const [filterType, setFilterType] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('updated');

  const types = ['ALL', 'PROJECT', 'RESEARCH', 'CREATIVE', 'MAINTENANCE'];
  const statuses = ['ALL', 'IN PROGRESS', 'PLANNED', 'ACTIVE'];

  const safeWorks = Array.isArray(works) ? works : [];
  const filteredWorks = safeWorks.filter(work => {
    const matchesType = filterType === 'ALL' || work?.type?.toUpperCase() === filterType;
    const matchesStatus = filterStatus === 'ALL' || work?.status?.toUpperCase() === filterStatus;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || 
      (work?.title && work.title.toLowerCase().includes(q)) || 
      (work?.description && work.description.toLowerCase().includes(q)) ||
      (Array.isArray(work?.tags) && work.tags.some(t => t && t.toLowerCase().includes(q)));
    return matchesType && matchesStatus && matchesSearch;
  }).sort((a, b) => {
    if (sortBy === 'title') return (a?.title || '').localeCompare(b?.title || '');
    if (sortBy === 'progress') return (b?.progress || 0) - (a?.progress || 0);
    return (b?.updated || '').localeCompare(a?.updated || '');
  });

  return (
    <div className="flex-1 flex flex-col h-full bg-[#E9E5D8] overflow-hidden select-none font-mono">
      {/* View Header & Toolbar */}
      <div className="p-3 border-b border-[#AAA99B] bg-[#DFDBD0] flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 bg-[#738A62] inline-block"></span>
          <h1 className="text-xs font-bold uppercase tracking-wider text-[#25251F]">
            ARCHIVAL WORKS REGISTRY
          </h1>
          <span className="text-[9px] text-[#77766B]">
            ({filteredWorks.length} OF {works.length} CATALOGED)
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2">
          {/* Search Box */}
          <div className="flex items-center space-x-1.5 bg-[#FAF8F3] border border-[#AAA99B] px-2 py-0.5 text-[9px]">
            <Search className="w-3 h-3 text-[#77766B]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search works, tags..."
              className="bg-transparent text-[9px] text-[#25251F] focus:outline-none w-36"
            />
          </div>

          {/* Sort Selector */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-[#FAF8F3] border border-[#AAA99B] px-2 py-0.5 text-[8.5px] text-[#25251F] focus:outline-none"
          >
            <option value="updated">SORT: RECENT</option>
            <option value="title">SORT: TITLE</option>
            <option value="progress">SORT: PROGRESS</option>
          </select>

          {/* + New Work */}
          <button
            onClick={onAddNewWork}
            className="bg-[#25251F] text-[#E9E5D8] hover:bg-black px-2.5 py-1 text-[8.5px] font-semibold uppercase tracking-wider flex items-center space-x-1"
          >
            <Plus className="w-2.5 h-2.5" />
            <span>NEW WORK</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="px-3 py-1.5 border-b border-[#AAA99B] bg-[#ECE7DC] flex items-center justify-between text-[8px]">
        {/* Type Filter */}
        <div className="flex items-center space-x-1">
          <span className="text-[#77766B] mr-1 uppercase">TYPE:</span>
          {types.map(t => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-2 py-0.5 border ${
                filterType === t
                  ? 'border-[#25251F] bg-[#25251F] text-[#E9E5D8] font-bold'
                  : 'border-[#AAA99B] bg-[#DFDBD0] text-[#55544B] hover:bg-[#D5D1C4]'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Status Filter */}
        <div className="flex items-center space-x-1">
          <span className="text-[#77766B] mr-1 uppercase">STATUS:</span>
          {statuses.map(s => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-2 py-0.5 border ${
                filterStatus === s
                  ? 'border-[#25251F] bg-[#25251F] text-[#E9E5D8] font-bold'
                  : 'border-[#AAA99B] bg-[#DFDBD0] text-[#55544B] hover:bg-[#D5D1C4]'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Works Grid */}
      <div className="flex-1 overflow-y-auto p-3">
        {filteredWorks.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center p-8 text-center text-[#66655A]">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#25251F] mb-1">
              NO WORKS FOUND
            </p>
            <p className="text-[8.5px] text-[#77766B] max-w-xs">
              No archival projects match the active filters or catalog query.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {filteredWorks.map((work) => (
            <div
              key={work.id}
              onClick={() => onSelectWork(work)}
              className="border border-[#AAA99B] bg-[#E9E5D8] hover:bg-[#E3DFD3] hover:border-[#25251F] transition-all p-2 flex flex-col justify-between group cursor-pointer"
            >
              <div>
                {/* Artwork Header */}
                <div className="w-full h-28 border border-[#AAA99B] overflow-hidden mb-2 bg-[#D5D0C2] relative">
                  <ArchivalArtwork type={work.photo || work.artwork || 'blueprint'} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.01]" />
                  <div className="absolute top-1 left-1 bg-[#25251F] text-[#E9E5D8] text-[7px] font-mono px-1 py-0.2">
                    {work.id}
                  </div>
                  <div className="absolute top-1 right-1 bg-[#E9E5D8] text-[#25251F] border border-[#AAA99B] text-[7px] font-mono px-1 py-0.2">
                    {work.type}
                  </div>
                </div>

                {/* Title & Description */}
                <h3 className="text-[11px] font-mono font-bold text-[#25251F] tracking-tight leading-snug group-hover:underline">
                  {work.title}
                </h3>
                <p className="text-[8px] text-[#55544B] mt-1 line-clamp-2 leading-relaxed">
                  {work.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mt-2">
                  {work.tags.map(t => (
                    <span key={t} className="text-[7px] px-1 py-0.2 border border-[#AAA99B] bg-[#DDD8CB] text-[#333]">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Progress & Metadata Footer */}
              <div className="mt-3 pt-2 border-t border-[#D5D1C4] space-y-1.5 text-[7.5px]">
                {/* Progress bar */}
                <div>
                  <div className="flex justify-between text-[#666] mb-0.5">
                    <span>PROGRESS</span>
                    <span className="font-bold text-[#25251F]">{work.progress}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#D3CFC2] border border-[#AAA99B] overflow-hidden">
                    <div
                      className="bg-[#25251F] h-full"
                      style={{ width: `${work.progress}%` }}
                    />
                  </div>
                </div>

                {/* Status & Milestones */}
                <div className="flex items-center justify-between pt-0.5">
                  <div className="flex items-center space-x-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#738A62]"></span>
                    <span className="text-[#25251F] font-semibold">{work.status}</span>
                  </div>
                  <span className="text-[#77766B]">Updated: {work.updated}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        )}
      </div>
    </div>
  );
}

