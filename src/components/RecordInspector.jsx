import React, { useState } from 'react';
import { 
  Minus, 
  ChevronRight, 
  Check, 
  Circle, 
  Plus, 
  ExternalLink, 
  FileText, 
  Calendar as CalendarIcon, 
  Info, 
  BookMarked, 
  Trash2, 
  Share2,
  Paperclip,
  Clock,
  User,
  MapPin,
  FolderArchive,
  Layers,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Camera,
  Upload
} from 'lucide-react';
import { ArchivalArtwork } from './ArchivalArtwork';
import { useArchive } from '../context/ArchiveContext';

export function RecordInspector({ 
  onClose,
  onOpenLinkedRecords 
}) {
  const { 
    selectedRecord, 
    selectedRecordType, 
    inspectRecord,
    updateWork, 
    updateAction, 
    updateEntry, 
    updateCollection, 
    updatePerson, 
    updatePlace, 
    updateResource,
    deleteWork,
    deleteAction,
    deleteEntry,
    deleteCollection,
    deletePerson,
    deletePlace,
    deleteResource,
    addNoteToRecord,
    deleteNoteFromRecord,
    activity
  } = useArchive();

  const [activeTab, setActiveTab] = useState('DETAILS');
  const [newTagInput, setNewTagInput] = useState('');
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [newNoteInput, setNewNoteInput] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  if (!selectedRecord) {
    return (
      <div className="flex h-full bg-[#E9E5D8] border-l border-[#AAA99B] text-[#25251F] font-mono select-none">
        <div className="w-[305px] min-w-[290px] p-4 flex flex-col items-center justify-center text-center space-y-2 text-[#77766B]">
          <Info className="w-6 h-6 opacity-40" />
          <div className="text-[10px] uppercase tracking-wider font-semibold">NO RECORD SELECTED</div>
          <div className="text-[8px] leading-relaxed max-w-[200px]">
            Select an archival work, action, entry, or locus to inspect its vault metadata.
          </div>
        </div>
      </div>
    );
  }

  const record = selectedRecord;
  const recordType = selectedRecordType || 'work';

  // Handle Tag Management
  const handleRemoveTag = async (tagToRemove) => {
    const updatedTags = (record.tags || []).filter(t => t !== tagToRemove);
    const updated = { ...record, tags: updatedTags };
    saveRecordUpdate(updated);
  };

  const handleAddTag = async (e) => {
    e.preventDefault();
    if (!newTagInput.trim()) return;
    const tag = newTagInput.trim().toLowerCase();
    const currentTags = record.tags || [];
    if (!currentTags.includes(tag)) {
      saveRecordUpdate({ ...record, tags: [...currentTags, tag] });
    }
    setNewTagInput('');
    setIsAddingTag(false);
  };

  const saveRecordUpdate = async (updated) => {
    if (recordType === 'work') await updateWork(updated);
    else if (recordType === 'action') await updateAction(updated);
    else if (recordType === 'entry') await updateEntry(updated);
    else if (recordType === 'collection') await updateCollection(updated);
    else if (recordType === 'person') await updatePerson(updated);
    else if (recordType === 'place') await updatePlace(updated);
    else if (recordType === 'resource') await updateResource(updated);
  };

  const handleDeleteRecord = async () => {
    if (recordType === 'work') await deleteWork(record.id);
    else if (recordType === 'action') await deleteAction(record.id);
    else if (recordType === 'entry') await deleteEntry(record.id);
    else if (recordType === 'collection') await deleteCollection(record.id);
    else if (recordType === 'person') await deletePerson(record.id);
    else if (recordType === 'place') await deletePlace(record.id);
    else if (recordType === 'resource') await deleteResource(record.id);
    setDeleteConfirm(false);
  };

  // Add Note to current record
  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newNoteInput.trim()) return;
    await addNoteToRecord(recordType, record.id, newNoteInput.trim());
    setNewNoteInput('');
  };

  const handleDeleteNote = async (noteId) => {
    await deleteNoteFromRecord(recordType, record.id, noteId);
  };

  // Filter relevant activity logs
  const relevantActivity = activity.filter(
    act => act.targetId === record.id || act.targetType === recordType
  ).slice(0, 8);

  const tabs = ['DETAILS', 'NOTES', 'LINKS', 'FILES', 'ACTIVITY'];

  return (
    <div className="flex h-full bg-[#E9E5D8] border-l border-[#AAA99B] text-[#25251F] font-mono select-none w-full">
      {/* Main Inspector Body */}
      <div className="w-full lg:w-[305px] lg:min-w-[290px] flex flex-col justify-between h-full overflow-y-auto">
        <div>
          {/* Header */}
          <div className="p-2 pb-1.5 border-b border-[#AAA99B] flex items-center justify-between">
            <span className="text-[9.5px] uppercase tracking-wider font-mono font-medium text-[#77766B]">
              RECORD INSPECTOR
            </span>
            <button
              onClick={onClose}
              className="text-[#68675C] hover:text-[#25251F] p-0.5"
              title="Collapse Inspector"
            >
              <Minus className="w-3 h-3" />
            </button>
          </div>

          {/* Record ID & Barcode banner */}
          <div className="p-2 pb-1.5 border-b border-[#D5D1C4] bg-[#E4DFC2]/40">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[7px] uppercase tracking-wider text-[#77766B]">
                  RECORD ID
                </div>
                <div className="text-[11px] font-mono font-semibold tracking-tight text-[#25251F]">
                  {record.id}
                </div>
              </div>
              {/* Simulated Archival Barcode */}
              <div className="w-24 h-5 barcode-strip border border-[#AAA99B] opacity-85" title={`BARCODE-${record.id}`} />
            </div>

            <div className="grid grid-cols-2 gap-1 mt-1 text-[7.5px] pt-1 border-t border-[#D5D1C4]">
              <div>
                <span className="text-[#77766B]">TYPE: </span>
                <span className="text-[#25251F] font-medium capitalize">{record.type || recordType}</span>
              </div>
              <div>
                <span className="text-[#77766B]">STATUS: </span>
                <span className="text-[#25251F] font-medium flex items-center space-x-1 inline-flex">
                  <span className={`w-1.5 h-1.5 rounded-full inline-block ${
                    record.status === 'Completed' || record.status === 'Active' || record.status === 'Mounted & Verified' ? 'bg-[#4F6D48]' :
                    record.status === 'In progress' ? 'bg-[#738A62]' :
                    record.status === 'Waiting' ? 'bg-[#6A7B8E]' : 'bg-[#9E9D8E]'
                  }`}></span>
                  <span>{record.status || 'Archived'}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Title & Short Description */}
          <div className="p-2 border-b border-[#D5D1C4]">
            <h2 className="text-[12.5px] font-serif font-bold tracking-[0.03em] text-[#25251F] uppercase leading-tight">
              {record.title || record.action || record.name}
            </h2>

            {/* Photo / Artwork Specimen Plate */}
            {(record.photo || record.artwork) && (
              <div className="w-full h-28 border border-[#B5B3A4] bg-[#D5D0C2] overflow-hidden my-2 shadow-inner relative group">
                <ArchivalArtwork 
                  type={record.photo || record.artwork} 
                  className="w-full h-full object-cover" 
                />
                <label className="absolute bottom-1 right-1 bg-[#171714]/85 hover:bg-[#171714] text-[#FAF8F3] px-1.5 py-0.5 text-[6.5px] uppercase font-bold tracking-wider cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity flex items-center space-x-1 shadow">
                  <Camera className="w-2.5 h-2.5" />
                  <span>CHANGE PHOTO</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (ev) => {
                          saveRecordUpdate({ ...record, photo: ev.target.result, artwork: ev.target.result });
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="hidden"
                  />
                </label>
              </div>
            )}

            <p className="text-[8px] font-mono text-[#55544B] mt-1 leading-relaxed">
              {record.description || record.notes || record.content || 'Archival record stored in local repository.'}
            </p>

            {/* Metadata Fields specific to entity type */}
            <div className="mt-2 pt-1 border-t border-[#D5D1C4] space-y-0.5 text-[7.5px] font-mono">
              {recordType === 'work' && (
                <>
                  <div className="flex justify-between">
                    <span className="text-[#77766B]">AREA:</span>
                    <span className="text-[#25251F] font-medium">{record.area || 'Creative / Personal'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#77766B]">OWNER:</span>
                    <span className="text-[#25251F] font-medium">{record.owner || 'You'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#77766B]">CREATED:</span>
                    <span className="text-[#44433A]">{record.created || '01 May 2025  14:22'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#77766B]">UPDATED:</span>
                    <span className="text-[#44433A]">{record.updated || '09 May 2025  09:15'}</span>
                  </div>
                </>
              )}

              {recordType === 'action' && (
                <>
                  <div className="flex justify-between">
                    <span className="text-[#77766B]">WORK:</span>
                    <span className="text-[#25251F] font-medium truncate max-w-[170px]">{record.work}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#77766B]">SCHEDULED TIME:</span>
                    <span className="text-[#25251F] font-medium">{record.time}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#77766B]">PRIORITY:</span>
                    <span className="text-[#25251F] font-medium">Level {record.priority} of 5</span>
                  </div>
                </>
              )}

              {recordType === 'entry' && (
                <>
                  <div className="flex justify-between">
                    <span className="text-[#77766B]">CATEGORY:</span>
                    <span className="text-[#25251F] font-medium">{record.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#77766B]">AUTHOR:</span>
                    <span className="text-[#25251F] font-medium">{record.author || 'Archivist'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#77766B]">TIMESTAMP:</span>
                    <span className="text-[#44433A]">{record.date} {record.time}</span>
                  </div>
                </>
              )}

              {recordType === 'collection' && (
                <>
                  <div className="flex justify-between">
                    <span className="text-[#77766B]">ITEM COUNT:</span>
                    <span className="text-[#25251F] font-medium">{record.itemCount || (record.items || []).length} Artifacts</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#77766B]">CURATED:</span>
                    <span className="text-[#44433A]">{record.created || '09 May 2025'}</span>
                  </div>
                </>
              )}

              {recordType === 'person' && (
                <>
                  <div className="flex justify-between">
                    <span className="text-[#77766B]">ROLE:</span>
                    <span className="text-[#25251F] font-medium">{record.role}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#77766B]">ORGANIZATION:</span>
                    <span className="text-[#25251F] font-medium">{record.org}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#77766B]">EMAIL:</span>
                    <span className="text-[#44433A] truncate max-w-[170px]">{record.email}</span>
                  </div>
                </>
              )}

              {recordType === 'place' && (
                <>
                  <div className="flex justify-between">
                    <span className="text-[#77766B]">COORDINATES:</span>
                    <span className="text-[#25251F] font-medium">{record.coordinates}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#77766B]">REGION:</span>
                    <span className="text-[#25251F] font-medium">{record.region}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#77766B]">ESTABLISHED:</span>
                    <span className="text-[#44433A]">{record.established}</span>
                  </div>
                </>
              )}

              {recordType === 'resource' && (
                <>
                  <div className="flex justify-between">
                    <span className="text-[#77766B]">FORMAT:</span>
                    <span className="text-[#25251F] font-medium uppercase">{record.format}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#77766B]">FILE SIZE:</span>
                    <span className="text-[#25251F] font-medium">{record.size}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#77766B]">LOCUS:</span>
                    <span className="text-[#44433A] truncate max-w-[170px]">{record.locus}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#77766B]">CHECKSUM:</span>
                    <span className="text-[#738A62] font-semibold">{record.checksum}</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b border-[#AAA99B] bg-[#DFDBD0] text-[7.5px] font-mono">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-1 text-center transition-colors uppercase tracking-wider ${
                  activeTab === tab
                    ? 'bg-[#E9E5D8] text-[#25251F] font-semibold border-b-2 border-[#25251F]'
                    : 'text-[#68675C] hover:text-[#25251F] hover:bg-[#D5D1C4]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab Content Panels */}
          <div className="p-2 space-y-2 text-[8px] font-mono">
            {activeTab === 'DETAILS' && (
              <>
                {/* Description */}
                <div>
                  <div className="text-[7px] uppercase tracking-wider text-[#77766B] mb-0.5 font-medium">
                    DESCRIPTION
                  </div>
                  <p className="text-[8px] text-[#33322B] leading-relaxed bg-[#F0EBE0] p-1.5 border border-[#D5D1C4]">
                    {record.longDescription || record.description || record.content || record.notes || 'No description provided.'}
                  </p>
                </div>

                {/* Tags */}
                <div>
                  <div className="flex justify-between items-center text-[7px] uppercase tracking-wider text-[#77766B] mb-1 font-medium">
                    <span>TAGS</span>
                    <button
                      onClick={() => setIsAddingTag(!isAddingTag)}
                      className="text-[#55544B] hover:text-[#25251F] flex items-center space-x-0.5"
                    >
                      <Plus className="w-2.5 h-2.5" />
                      <span>ADD</span>
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {(record.tags || ['archive', 'design']).map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center space-x-1 px-1.5 py-0.5 border border-[#AAA99B] bg-[#DDD8CB] text-[#33322B] text-[7px]"
                      >
                        <span>{tag}</span>
                        <button
                          onClick={() => handleRemoveTag(tag)}
                          className="text-[#77766B] hover:text-black font-semibold"
                          title="Remove tag"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                  {isAddingTag && (
                    <form onSubmit={handleAddTag} className="mt-1 flex space-x-1">
                      <input
                        type="text"
                        value={newTagInput}
                        onChange={(e) => setNewTagInput(e.target.value)}
                        placeholder="new-tag"
                        className="flex-1 text-[7.5px] bg-[#F0EBE0] border border-[#AAA99B] px-1 py-0.5 focus:outline-none"
                        autoFocus
                      />
                      <button
                        type="submit"
                        className="bg-[#25251F] text-[#E9E5D8] px-1.5 text-[7px]"
                      >
                        +
                      </button>
                    </form>
                  )}
                </div>

                {/* Specific details for Work: Progress & Milestones */}
                {recordType === 'work' && (
                  <>
                    <div className="pt-1.5 border-t border-[#D5D1C4]">
                      <div className="grid grid-cols-2 gap-2">
                        {/* Donut progress */}
                        <div>
                          <div className="text-[7px] uppercase tracking-wider text-[#77766B] mb-1 font-medium">
                            PROGRESS
                          </div>
                          <div className="relative w-14 h-14 mx-auto flex items-center justify-center">
                            <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                              <circle cx="18" cy="18" r="14" fill="none" stroke="#D3CFC2" strokeWidth="3" />
                              <circle
                                cx="18"
                                cy="18"
                                r="14"
                                fill="none"
                                stroke="#25251F"
                                strokeWidth="3"
                                strokeDasharray="88"
                                strokeDashoffset={88 - (88 * (record.progress || 65)) / 100}
                                strokeLinecap="butt"
                              />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center font-mono font-medium text-[9.5px] text-[#25251F]">
                              {record.progress || 65}%
                            </div>
                          </div>
                        </div>

                        {/* Milestones */}
                        <div>
                          <div className="text-[7px] uppercase tracking-wider text-[#77766B] mb-1 font-medium">
                            MILESTONES
                          </div>
                          <div className="space-y-0.5 text-[7.5px] text-[#44433A]">
                            {(record.milestones || [
                              { name: 'Foundation', status: 'done' },
                              { name: 'Core Features', status: 'current' },
                              { name: 'Polish', status: 'pending' },
                              { name: 'Release', status: 'pending' }
                            ]).map((m, idx) => (
                              <div key={idx} className="flex items-center justify-between">
                                <span className={m.status === 'done' ? 'text-[#25251F] font-medium' : ''}>
                                  {m.name}
                                </span>
                                {m.status === 'done' ? (
                                  <Check className="w-2.5 h-2.5 text-[#25251F]" strokeWidth={2.5} />
                                ) : m.status === 'current' ? (
                                  <span className="w-2 h-2 rounded-full border-2 border-[#25251F] inline-block" />
                                ) : (
                                  <Circle className="w-2 h-2 text-[#AAA99B]" />
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Dates */}
                    <div className="pt-1 border-t border-[#D5D1C4] space-y-0.5 text-[7.5px]">
                      <div className="text-[7px] uppercase tracking-wider text-[#77766B] mb-0.5 font-medium">
                        DATES
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#77766B]">Start:</span>
                        <span className="text-[#25251F]">{record.startDate || '01 May 2025'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#77766B]">Target:</span>
                        <span className="text-[#25251F]">{record.targetDate || '30 Aug 2025'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#77766B]">Due:</span>
                        <span className="text-[#77766B]">{record.due || '-'}</span>
                      </div>
                    </div>

                    {/* Linked Records */}
                    <div className="pt-1 border-t border-[#D5D1C4] space-y-0.5">
                      <div className="text-[7px] uppercase tracking-wider text-[#77766B] mb-0.5 font-medium">
                        LINKED RECORDS
                      </div>
                      <div className="space-y-0.5">
                        {Object.entries(record.linkedRecords || { actions: 12, entries: 8, collections: 3, people: 2 }).map(([key, count]) => (
                          <button
                            key={key}
                            onClick={() => onOpenLinkedRecords && onOpenLinkedRecords(key, count)}
                            className="w-full flex items-center justify-between px-1.5 py-0.5 border border-[#AAA99B] bg-[#DFDBD0] hover:bg-[#D5D1C4] transition-colors text-[7.5px]"
                          >
                            <div className="flex items-center space-x-1.5">
                              <span className="font-semibold text-[#25251F]">{count}</span>
                              <span className="capitalize text-[#44433A]">{key}</span>
                            </div>
                            <ChevronRight className="w-2.5 h-2.5 text-[#68675C]" />
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {/* Specific details for Action */}
                {recordType === 'action' && (
                  <div className="pt-1 border-t border-[#D5D1C4] space-y-1 text-[7.5px]">
                    <div className="text-[7px] uppercase tracking-wider text-[#77766B] mb-0.5 font-medium">
                      PRIORITY LEVEL
                    </div>
                    <div className="flex items-center space-x-1">
                      {[1, 2, 3, 4, 5].map((lvl) => (
                        <span
                          key={lvl}
                          className={`w-2.5 h-2.5 rounded-full inline-block ${
                            lvl <= record.priority ? 'bg-[#25251F]' : 'bg-[#C7C3B7]'
                          }`}
                        />
                      ))}
                      <span className="text-[#555] ml-2">({record.priority} / 5)</span>
                    </div>
                  </div>
                )}

                {/* Archival Repository Stamp - Fills vertical space cleanly */}
                <div className="pt-2 border-t border-[#D5D1C4] space-y-1 text-[7px] font-mono text-[#77766B]">
                  <div className="flex justify-between items-center bg-[#DFDBD0]/70 p-1 border border-[#AAA99B]">
                    <span>LOCAL ARCHIVE:</span>
                    <span className="text-[#25251F] font-semibold">{record.id}</span>
                  </div>
                  <div className="flex justify-between items-center px-0.5">
                    <span>CHECKSUM: {record.checksum || '0x9AF4'}</span>
                    <span className="text-[#738A62] font-semibold flex items-center space-x-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#738A62]"></span>
                      <span>INTEGRITY OK</span>
                    </span>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'NOTES' && (
              <div className="space-y-1.5">
                <form onSubmit={handleAddNote} className="space-y-1">
                  <textarea
                    value={newNoteInput}
                    onChange={(e) => setNewNoteInput(e.target.value)}
                    placeholder="Enter archival note..."
                    className="w-full text-[8px] bg-[#F0EBE0] border border-[#AAA99B] p-1.5 text-[#25251F] focus:outline-none resize-none h-14"
                  />
                  <button
                    type="submit"
                    className="w-full bg-[#25251F] text-[#E9E5D8] py-0.5 text-[7.5px] font-semibold tracking-wider uppercase hover:bg-black transition-colors"
                  >
                    + ADD ARCHIVAL NOTE
                  </button>
                </form>

                <div className="space-y-1 pt-1">
                  {(record.notes && Array.isArray(record.notes) ? record.notes : [
                    { id: 'n1', date: '09 May 2025', text: 'Verified baseline metadata and parameters in local vault.' }
                  ]).map((note) => (
                    <div key={note.id} className="p-1.5 border border-[#AAA99B] bg-[#F1ECE0] space-y-0.5 group">
                      <div className="flex items-center justify-between text-[6.5px] text-[#77766B]">
                        <span>{note.date}</span>
                        <button
                          onClick={() => handleDeleteNote(note.id)}
                          className="text-[#A84B4B] hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Delete note"
                        >
                          × Delete
                        </button>
                      </div>
                      <div className="text-[7.5px] text-[#25251F]">{note.text}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'LINKS' && (
              <div className="space-y-1">
                <div className="text-[7px] uppercase tracking-wider text-[#77766B]">
                  EXTERNAL &amp; LOCAL REFERENCES
                </div>
                {(record.links || [
                  { id: 'l1', title: 'Local Vault Manifest', url: 'athenaeum://vault/manifest.json' },
                  { id: 'l2', title: 'Archival Specifications', url: 'https://archive.org/details/specs' }
                ]).map((lnk) => (
                  <div key={lnk.id} className="p-1.5 border border-[#AAA99B] bg-[#F1ECE0] flex items-center justify-between">
                    <div>
                      <div className="text-[7.5px] font-semibold text-[#25251F]">{lnk.title}</div>
                      <div className="text-[6.5px] text-[#77766B] font-mono truncate max-w-[190px]">{lnk.url}</div>
                    </div>
                    <ExternalLink className="w-2.5 h-2.5 text-[#666]" />
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'FILES' && (
              <div className="space-y-1">
                <div className="text-[7px] uppercase tracking-wider text-[#77766B]">
                  ATTACHED VAULT ARTIFACTS
                </div>
                {(record.files || [
                  { id: 'f1', name: 'manifest.db', size: '1.2 MB', date: '09 May 2025' },
                  { id: 'f2', name: 'schematics.pdf', size: '4.8 MB', date: '08 May 2025' }
                ]).map((file) => (
                  <div key={file.id} className="p-1.5 border border-[#AAA99B] bg-[#F1ECE0] flex items-center justify-between">
                    <div className="flex items-center space-x-1.5">
                      <FileText className="w-3 h-3 text-[#666]" />
                      <div>
                        <div className="text-[7.5px] font-medium text-[#25251F] truncate max-w-[170px]">{file.name}</div>
                        <div className="text-[6.5px] text-[#77766B]">{file.size} • {file.date}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'ACTIVITY' && (
              <div className="space-y-1">
                <div className="text-[7px] uppercase tracking-wider text-[#77766B]">
                  AUDIT TRAIL &amp; LOGS
                </div>
                {relevantActivity.length > 0 ? (
                  relevantActivity.map((act) => (
                    <div key={act.id} className="p-1.5 border border-[#AAA99B] bg-[#F1ECE0] space-y-0.5">
                      <div className="text-[6.5px] text-[#77766B] flex items-center space-x-1">
                        <Clock className="w-2 h-2" />
                        <span>{new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {act.type}</span>
                      </div>
                      <div className="text-[7.5px] text-[#25251F]">{act.details}</div>
                    </div>
                  ))
                ) : (
                  <div className="p-2 text-center text-[#77766B] text-[7.5px]">
                    No activity recorded for this entity yet.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer info strip */}
        <div className="p-1.5 border-t border-[#AAA99B] bg-[#DFDBD0] text-[7px] text-[#77766B] flex justify-between items-center">
          <span>INSPECTOR: ACTIVE</span>
          <span>CHECKSUM: {record.checksum || '0x9AF4'}</span>
        </div>
      </div>

      {/* Far Right Vertical Utility Strip */}
      <div className="w-6 border-l border-[#AAA99B] bg-[#D7D2C4] flex flex-col items-center py-2 justify-between text-[#616056]">
        <div className="flex flex-col space-y-3">
          <button 
            title="Record Info" 
            onClick={() => setActiveTab('DETAILS')}
            className={`hover:text-black transition-colors ${activeTab === 'DETAILS' ? 'text-black' : ''}`}
          >
            <Info className="w-3 h-3" strokeWidth={1.5} />
          </button>
          <button 
            title="Activity Log" 
            onClick={() => setActiveTab('ACTIVITY')}
            className={`hover:text-black transition-colors ${activeTab === 'ACTIVITY' ? 'text-black' : ''}`}
          >
            <Clock className="w-3 h-3" strokeWidth={1.5} />
          </button>
          <button 
            title="Notes" 
            onClick={() => setActiveTab('NOTES')}
            className={`hover:text-black transition-colors ${activeTab === 'NOTES' ? 'text-black' : ''}`}
          >
            <BookMarked className="w-3 h-3" strokeWidth={1.5} />
          </button>
          <button 
            title="Attached Files" 
            onClick={() => setActiveTab('FILES')}
            className={`hover:text-black transition-colors ${activeTab === 'FILES' ? 'text-black' : ''}`}
          >
            <Paperclip className="w-3 h-3" strokeWidth={1.5} />
          </button>
        </div>

        {deleteConfirm ? (
          <div className="flex flex-col items-center space-y-1">
            <button 
              onClick={handleDeleteRecord}
              title="Confirm Delete" 
              className="text-red-700 font-bold text-[8px] hover:scale-110"
            >
              OK
            </button>
            <button 
              onClick={() => setDeleteConfirm(false)}
              title="Cancel" 
              className="text-[#666] text-[8px]"
            >
              X
            </button>
          </div>
        ) : (
          <button 
            title="Archive / Delete Record" 
            onClick={() => setDeleteConfirm(true)}
            className="hover:text-[#A84B4B] transition-colors"
          >
            <Trash2 className="w-3 h-3" strokeWidth={1.5} />
          </button>
        )}
      </div>
    </div>
  );
}
