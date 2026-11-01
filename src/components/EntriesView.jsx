import React, { useState } from 'react';
import { FileText, Search, Plus, Edit3, Check, Calendar, User, Tag, ArrowLeft } from 'lucide-react';

export function EntriesView({ entries, onAddEntry, onUpdateEntry }) {
  const [selectedEntryId, setSelectedEntryId] = useState(entries[0]?.id || 1);
  const [filterCategory, setFilterCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [showMobileDetail, setShowMobileDetail] = useState(false);

  // New entry form state
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Project Note');
  const [newContent, setNewContent] = useState('');
  const [newWork, setNewWork] = useState('Athenaeum App Project');

  // Currently selected entry
  const selectedEntry = entries.find(e => e.id === selectedEntryId) || entries[0];
  const [editContent, setEditContent] = useState(selectedEntry?.content || '');

  const categories = ['ALL', 'PROJECT NOTE', 'IDEA', 'MEETING', 'RESEARCH'];

  const filteredEntries = entries.filter(ent => {
    const matchesCat = filterCategory === 'ALL' || ent.category.toUpperCase() === filterCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || 
      ent.title.toLowerCase().includes(q) || 
      (ent.content && ent.content.toLowerCase().includes(q));
    return matchesCat && matchesSearch;
  });

  const handleSelect = (ent) => {
    setSelectedEntryId(ent.id);
    setEditContent(ent.content || '');
    setIsEditing(false);
    setShowMobileDetail(true);
  };

  const handleSaveEdit = () => {
    if (!onUpdateEntry) return;
    onUpdateEntry({
      ...selectedEntry,
      content: editContent
    });
    setIsEditing(false);
  };

  const handleCreate = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    const newEnt = {
      id: Date.now(),
      date: '09 MAY 2025',
      time: '12:30',
      title: newTitle.trim(),
      category: newCategory,
      work: newWork,
      author: 'You',
      content: newContent.trim() || 'New archival research observation recorded in local index.'
    };
    onAddEntry(newEnt);
    setSelectedEntryId(newEnt.id);
    setEditContent(newEnt.content);
    setIsCreating(false);
    setNewTitle('');
    setNewContent('');
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#E9E5D8] overflow-hidden select-none font-mono">
      {/* Header Bar */}
      <div className="p-3 border-b border-[#AAA99B] bg-[#DFDBD0] flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 bg-[#738A62] inline-block"></span>
          <h1 className="text-xs font-bold uppercase tracking-wider text-[#25251F]">
            RESEARCH ENTRIES &amp; JOURNAL ARCHIVE
          </h1>
          <span className="text-[9px] text-[#77766B]">
            ({filteredEntries.length} OF {entries.length} LOGS)
          </span>
        </div>

        <div className="flex items-center space-x-2">
          {/* Search */}
          <div className="flex items-center space-x-1.5 bg-[#FAF8F3] border border-[#AAA99B] px-2 py-0.5 text-[9px]">
            <Search className="w-3 h-3 text-[#77766B]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search journal entries..."
              className="bg-transparent text-[9px] text-[#25251F] focus:outline-none w-44"
            />
          </div>

          <button
            onClick={() => setIsCreating(!isCreating)}
            className="bg-[#25251F] text-[#E9E5D8] hover:bg-black px-2.5 py-1 text-[8.5px] font-semibold uppercase tracking-wider flex items-center space-x-1"
          >
            <Plus className="w-2.5 h-2.5" />
            <span>NEW ENTRY</span>
          </button>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="px-3 py-1.5 border-b border-[#AAA99B] bg-[#ECE7DC] flex items-center space-x-1 text-[8px]">
        <span className="text-[#77766B] mr-1 uppercase">CATEGORY:</span>
        {categories.map(c => (
          <button
            key={c}
            onClick={() => setFilterCategory(c)}
            className={`px-2 py-0.5 border ${
              filterCategory === c
                ? 'border-[#25251F] bg-[#25251F] text-[#E9E5D8] font-bold'
                : 'border-[#AAA99B] bg-[#DFDBD0] text-[#55544B] hover:bg-[#D5D1C4]'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Main Split Pane */}
      <div className="flex-1 flex min-h-0 overflow-hidden">
        {/* Left List Pane */}
        <div className={`${showMobileDetail ? 'hidden md:block' : 'w-full md:w-72 md:min-w-[260px]'} border-r border-[#AAA99B] bg-[#E9E5D8] overflow-y-auto divide-y divide-[#DDD9CD]`}>
          {filteredEntries.map((ent, idx) => {
            const isSelected = selectedEntry?.id === ent.id;
            return (
              <div
                key={ent.id}
                onClick={() => handleSelect(ent)}
                style={{ animationDelay: `${Math.min(idx * 30, 400)}ms` }}
                className={`p-2.5 cursor-pointer transition-colors animate-fade-in ${
                  isSelected 
                    ? 'bg-[#DFDBD0] border-l-4 border-l-[#25251F]' 
                    : 'hover:bg-[#E3DFD3]'
                }`}
              >
                <div className="flex items-center justify-between text-[7.5px] text-[#77766B] mb-0.5">
                  <span>{ent.date} • {ent.time}</span>
                  <span className="px-1 py-0.2 border border-[#AAA99B] bg-[#DDD8CB] text-[#333]">
                    {ent.category}
                  </span>
                </div>
                <h4 className="text-[9.5px] font-bold text-[#25251F] line-clamp-1 leading-snug">
                  {ent.title}
                </h4>
                <p className="text-[8px] text-[#66655A] mt-1 line-clamp-2 leading-relaxed">
                  {ent.content || 'Archival document record.'}
                </p>
              </div>
            );
          })}
        </div>

        {/* Right Reader / Editor Pane */}
        <div className={`${!showMobileDetail ? 'hidden md:flex' : 'flex-1 flex'} flex-col bg-[#F3EFE4] overflow-y-auto p-3 sm:p-4 select-text`}>
          {showMobileDetail && (
            <button
              onClick={() => setShowMobileDetail(false)}
              className="md:hidden self-start mb-2 text-[8px] font-bold text-[#171714] flex items-center space-x-1 border border-[#AAA99B] px-2 py-0.5 bg-[#DFDBD0] hover:bg-[#D5D1C4]"
            >
              <ArrowLeft className="w-3 h-3" />
              <span>← ALL ENTRIES</span>
            </button>
          )}

          {isCreating ? (
            <form onSubmit={handleCreate} className="space-y-3 max-w-2xl select-none">
              <div className="flex items-center justify-between pb-2 border-b border-[#AAA99B]">
                <h2 className="text-xs font-bold uppercase tracking-wider text-[#25251F]">
                  COMPOSE NEW JOURNAL ENTRY
                </h2>
                <div className="flex space-x-1.5">
                  <button
                    type="button"
                    onClick={() => setIsCreating(false)}
                    className="px-2.5 py-0.5 border border-[#AAA99B] bg-[#DFDBD0] text-[8.5px] uppercase"
                  >
                    CANCEL
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-0.5 bg-[#25251F] text-[#E9E5D8] text-[8.5px] font-bold uppercase"
                  >
                    SAVE ENTRY
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[8px] uppercase tracking-wider text-[#666] mb-1 font-semibold">
                  ENTRY TITLE *
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Field observations at Limehouse Lock..."
                  className="w-full bg-[#FAF8F3] border border-[#AAA99B] p-2 text-[10px] font-mono focus:outline-none"
                  autoFocus
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[8px] uppercase tracking-wider text-[#666] mb-1 font-semibold">
                    CATEGORY
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full bg-[#FAF8F3] border border-[#AAA99B] p-1.5 text-[9px] font-mono focus:outline-none"
                  >
                    <option value="Project Note">Project Note</option>
                    <option value="Idea">Idea</option>
                    <option value="Meeting">Meeting</option>
                    <option value="Research">Research</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[8px] uppercase tracking-wider text-[#666] mb-1 font-semibold">
                    LINKED WORK
                  </label>
                  <select
                    value={newWork}
                    onChange={(e) => setNewWork(e.target.value)}
                    className="w-full bg-[#FAF8F3] border border-[#AAA99B] p-1.5 text-[9px] font-mono focus:outline-none"
                  >
                    <option value="Athenaeum App Project">Athenaeum App Project</option>
                    <option value="East London Heritage Archive">East London Heritage Archive</option>
                    <option value="Creature Concept Explorations">Creature Concept Explorations</option>
                    <option value="Photography Portfolio">Photography Portfolio</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[8px] uppercase tracking-wider text-[#666] mb-1 font-semibold">
                  DOCUMENT TRANSCRIPT / CONTENT
                </label>
                <textarea
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  rows={10}
                  placeholder="Type notes, quotes, or transcripts..."
                  className="w-full bg-[#FAF8F3] border border-[#AAA99B] p-2 text-[9.5px] font-mono leading-relaxed focus:outline-none"
                />
              </div>
            </form>
          ) : selectedEntry ? (
            <div key={selectedEntry.id} className="space-y-3 max-w-3xl animate-fade-in">
              {/* Document Header */}
              <div className="pb-3 border-b border-[#AAA99B] flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2 text-[8px] text-[#77766B] mb-1">
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-2.5 h-2.5" />
                      <span>{selectedEntry.date} {selectedEntry.time}</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center space-x-1">
                      <User className="w-2.5 h-2.5" />
                      <span>{selectedEntry.author || 'You'}</span>
                    </span>
                    <span>•</span>
                    <span className="px-1.5 py-0.2 border border-[#AAA99B] bg-[#DFDBD0] text-[#333]">
                      {selectedEntry.category}
                    </span>
                  </div>
                  <h2 className="text-sm font-serif font-bold text-[#25251F] tracking-tight uppercase">
                    {selectedEntry.title}
                  </h2>
                  {selectedEntry.work && (
                    <div className="text-[8px] text-[#666] mt-0.5">
                      REF: <span className="underline">{selectedEntry.work}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-1 select-none">
                  {isEditing ? (
                    <button
                      onClick={handleSaveEdit}
                      className="px-2.5 py-1 bg-[#25251F] text-[#E9E5D8] hover:bg-black text-[8px] font-semibold uppercase flex items-center space-x-1"
                    >
                      <Check className="w-2.5 h-2.5" />
                      <span>SAVE</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="px-2.5 py-1 border border-[#AAA99B] bg-[#DFDBD0] hover:bg-[#D5D1C4] text-[8px] font-semibold uppercase flex items-center space-x-1"
                    >
                      <Edit3 className="w-2.5 h-2.5" />
                      <span>EDIT</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Document Body */}
              <div className="pt-2">
                {isEditing ? (
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    rows={12}
                    className="w-full bg-[#FAF8F3] border border-[#AAA99B] p-2.5 text-[9.5px] font-mono leading-relaxed focus:outline-none"
                    autoFocus
                  />
                ) : (
                  <div className="text-[9.5px] font-mono leading-relaxed text-[#25251F] whitespace-pre-line bg-[#FAF8F3] p-3.5 border border-[#AAA99B]">
                    {selectedEntry.content || "No document body recorded."}
                  </div>
                )}
              </div>

              {/* Document Metadata Stamp */}
              <div className="pt-2 border-t border-[#D5D1C4] flex justify-between text-[7.5px] text-[#77766B]">
                <span>ARCHIVAL RECORD: ENT-{selectedEntry.id}</span>
                <span>SHA-256 INTEGRITY: VERIFIED</span>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-[#77766B] text-[10px]">
              Select an entry to read or click + NEW ENTRY.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

