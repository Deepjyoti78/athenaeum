import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  X, 
  FileText, 
  FolderGit2, 
  CheckSquare, 
  ArrowRight,
  Layers,
  Users,
  MapPin,
  HardDrive
} from 'lucide-react';
import { useArchive } from '../context/ArchiveContext';

export function SearchModal({ 
  isOpen, 
  onClose,
  onNavigate
}) {
  const { 
    works, 
    actions, 
    entries, 
    collections, 
    people, 
    places, 
    resources, 
    inspectRecord 
  } = useArchive();

  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('ALL');
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const q = query.toLowerCase().trim();

  const matchingWorks = works.filter(w => 
    !q || (w.title && w.title.toLowerCase().includes(q)) || 
    (w.description && w.description.toLowerCase().includes(q)) || 
    (w.tags && w.tags.some(t => t.toLowerCase().includes(q)))
  );

  const matchingActions = actions.filter(a => 
    !q || (a.action && a.action.toLowerCase().includes(q)) || 
    (a.work && a.work.toLowerCase().includes(q))
  );

  const matchingEntries = entries.filter(e => 
    !q || (e.title && e.title.toLowerCase().includes(q)) || 
    (e.category && e.category.toLowerCase().includes(q)) ||
    (e.content && e.content.toLowerCase().includes(q))
  );

  const matchingCollections = collections.filter(c => 
    !q || (c.title && c.title.toLowerCase().includes(q)) || 
    (c.description && c.description.toLowerCase().includes(q))
  );

  const matchingPeople = people.filter(p => 
    !q || (p.name && p.name.toLowerCase().includes(q)) || 
    (p.role && p.role.toLowerCase().includes(q)) ||
    (p.org && p.org.toLowerCase().includes(q))
  );

  const matchingPlaces = places.filter(pl => 
    !q || (pl.name && pl.name.toLowerCase().includes(q)) || 
    (pl.region && pl.region.toLowerCase().includes(q)) ||
    (pl.coordinates && pl.coordinates.toLowerCase().includes(q))
  );

  const matchingResources = resources.filter(r => 
    !q || (r.title && r.title.toLowerCase().includes(q)) || 
    (r.format && r.format.toLowerCase().includes(q)) ||
    (r.locus && r.locus.toLowerCase().includes(q))
  );

  const totalResults = 
    matchingWorks.length + 
    matchingActions.length + 
    matchingEntries.length + 
    matchingCollections.length + 
    matchingPeople.length + 
    matchingPlaces.length + 
    matchingResources.length;

  const handleSelect = (type, item, targetNav) => {
    inspectRecord(type, item);
    if (onNavigate && targetNav) {
      onNavigate(targetNav);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-[1px] z-50 flex items-start justify-center pt-16 p-4 font-mono select-none">
      <div className="w-full max-w-xl bg-[#E9E5D8] border border-[#25251F] shadow-2xl flex flex-col max-h-[82vh] overflow-hidden">
        {/* Search Input Bar */}
        <div className="p-3 bg-[#DFDBD0] border-b border-[#AAA99B] flex items-center space-x-2">
          <Search className="w-4 h-4 text-[#666]" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search across all 7 archival registries (Works, Actions, Entries, People, Places...)"
            className="flex-1 bg-transparent text-[11px] font-mono text-[#25251F] focus:outline-none placeholder:text-[#888]"
          />
          <button onClick={onClose} className="p-1 text-[#666] hover:text-black">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Filter Badges */}
        <div className="px-3 py-1.5 bg-[#D7D2C4] border-b border-[#AAA99B] flex items-center space-x-1.5 overflow-x-auto text-[8px]">
          {['ALL', 'WORKS', 'ACTIONS', 'ENTRIES', 'COLLECTIONS', 'PEOPLE', 'PLACES', 'RESOURCES'].map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-2 py-0.5 uppercase tracking-wider font-semibold transition-colors ${
                activeFilter === f
                  ? 'bg-[#25251F] text-[#E9E5D8]'
                  : 'bg-[#E5E1D4] text-[#666] hover:text-[#25251F]'
              }`}
            >
              {f}
            </button>
          ))}
          <span className="text-[7.5px] text-[#77766B] ml-auto font-mono whitespace-nowrap">
            {totalResults} MATCHES
          </span>
        </div>

        {/* Results List */}
        <div className="p-3 overflow-y-auto space-y-3 divide-y divide-[#D5D1C4] text-[9.5px]">
          {/* Works */}
          {(activeFilter === 'ALL' || activeFilter === 'WORKS') && matchingWorks.length > 0 && (
            <div className="space-y-1">
              <div className="text-[7.5px] uppercase tracking-wider text-[#77766B] font-semibold flex items-center space-x-1">
                <FolderGit2 className="w-2.5 h-2.5" />
                <span>WORKS ({matchingWorks.length})</span>
              </div>
              <div className="space-y-0.5">
                {matchingWorks.map((work) => (
                  <button
                    key={work.id}
                    onClick={() => handleSelect('work', work, 'dashboard')}
                    className="w-full text-left p-1.5 border border-transparent hover:border-[#AAA99B] hover:bg-[#F2EEE4] flex items-center justify-between group transition-colors"
                  >
                    <div>
                      <div className="font-bold text-[#25251F] text-[10px]">{work.title}</div>
                      <div className="text-[8px] text-[#666]">{work.id} • {work.type} • {work.status} • {work.progress}%</div>
                    </div>
                    <ArrowRight className="w-3 h-3 text-[#AAA99B] group-hover:text-black opacity-0 group-hover:opacity-100" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          {(activeFilter === 'ALL' || activeFilter === 'ACTIONS') && matchingActions.length > 0 && (
            <div className="space-y-1 pt-2">
              <div className="text-[7.5px] uppercase tracking-wider text-[#77766B] font-semibold flex items-center space-x-1">
                <CheckSquare className="w-2.5 h-2.5" />
                <span>ACTIONS ({matchingActions.length})</span>
              </div>
              <div className="space-y-0.5">
                {matchingActions.map((act) => (
                  <button
                    key={act.id}
                    onClick={() => handleSelect('action', act, 'actions')}
                    className="w-full text-left p-1.5 border border-transparent hover:border-[#AAA99B] hover:bg-[#F2EEE4] flex items-center justify-between group transition-colors"
                  >
                    <div>
                      <div className="font-bold text-[#25251F] text-[10px]">{act.action}</div>
                      <div className="text-[8px] text-[#666]">{act.time} • {act.work} • Status: {act.status} • P{act.priority}</div>
                    </div>
                    <ArrowRight className="w-3 h-3 text-[#AAA99B] group-hover:text-black opacity-0 group-hover:opacity-100" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Entries */}
          {(activeFilter === 'ALL' || activeFilter === 'ENTRIES') && matchingEntries.length > 0 && (
            <div className="space-y-1 pt-2">
              <div className="text-[7.5px] uppercase tracking-wider text-[#77766B] font-semibold flex items-center space-x-1">
                <FileText className="w-2.5 h-2.5" />
                <span>ENTRIES ({matchingEntries.length})</span>
              </div>
              <div className="space-y-0.5">
                {matchingEntries.map((ent) => (
                  <button
                    key={ent.id}
                    onClick={() => handleSelect('entry', ent, 'entries')}
                    className="w-full text-left p-1.5 border border-transparent hover:border-[#AAA99B] hover:bg-[#F2EEE4] flex items-center justify-between group transition-colors"
                  >
                    <div>
                      <div className="font-bold text-[#25251F] text-[10px]">{ent.title}</div>
                      <div className="text-[8px] text-[#666]">{ent.date} • {ent.category} • Author: {ent.author || 'Archivist'}</div>
                    </div>
                    <ArrowRight className="w-3 h-3 text-[#AAA99B] group-hover:text-black opacity-0 group-hover:opacity-100" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Collections */}
          {(activeFilter === 'ALL' || activeFilter === 'COLLECTIONS') && matchingCollections.length > 0 && (
            <div className="space-y-1 pt-2">
              <div className="text-[7.5px] uppercase tracking-wider text-[#77766B] font-semibold flex items-center space-x-1">
                <Layers className="w-2.5 h-2.5" />
                <span>COLLECTIONS ({matchingCollections.length})</span>
              </div>
              <div className="space-y-0.5">
                {matchingCollections.map((col) => (
                  <button
                    key={col.id}
                    onClick={() => handleSelect('collection', col, 'collections')}
                    className="w-full text-left p-1.5 border border-transparent hover:border-[#AAA99B] hover:bg-[#F2EEE4] flex items-center justify-between group transition-colors"
                  >
                    <div>
                      <div className="font-bold text-[#25251F] text-[10px]">{col.title}</div>
                      <div className="text-[8px] text-[#666]">{col.itemCount || (col.items || []).length} artifacts • {col.description}</div>
                    </div>
                    <ArrowRight className="w-3 h-3 text-[#AAA99B] group-hover:text-black opacity-0 group-hover:opacity-100" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* People */}
          {(activeFilter === 'ALL' || activeFilter === 'PEOPLE') && matchingPeople.length > 0 && (
            <div className="space-y-1 pt-2">
              <div className="text-[7.5px] uppercase tracking-wider text-[#77766B] font-semibold flex items-center space-x-1">
                <Users className="w-2.5 h-2.5" />
                <span>PEOPLE ({matchingPeople.length})</span>
              </div>
              <div className="space-y-0.5">
                {matchingPeople.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => handleSelect('person', p, 'people')}
                    className="w-full text-left p-1.5 border border-transparent hover:border-[#AAA99B] hover:bg-[#F2EEE4] flex items-center justify-between group transition-colors"
                  >
                    <div>
                      <div className="font-bold text-[#25251F] text-[10px]">{p.name}</div>
                      <div className="text-[8px] text-[#666]">{p.role} • {p.org} • {p.email}</div>
                    </div>
                    <ArrowRight className="w-3 h-3 text-[#AAA99B] group-hover:text-black opacity-0 group-hover:opacity-100" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Places */}
          {(activeFilter === 'ALL' || activeFilter === 'PLACES') && matchingPlaces.length > 0 && (
            <div className="space-y-1 pt-2">
              <div className="text-[7.5px] uppercase tracking-wider text-[#77766B] font-semibold flex items-center space-x-1">
                <MapPin className="w-2.5 h-2.5" />
                <span>PLACES ({matchingPlaces.length})</span>
              </div>
              <div className="space-y-0.5">
                {matchingPlaces.map((pl) => (
                  <button
                    key={pl.id}
                    onClick={() => handleSelect('place', pl, 'places')}
                    className="w-full text-left p-1.5 border border-transparent hover:border-[#AAA99B] hover:bg-[#F2EEE4] flex items-center justify-between group transition-colors"
                  >
                    <div>
                      <div className="font-bold text-[#25251F] text-[10px]">{pl.name}</div>
                      <div className="text-[8px] text-[#666]">{pl.coordinates} • {pl.region}</div>
                    </div>
                    <ArrowRight className="w-3 h-3 text-[#AAA99B] group-hover:text-black opacity-0 group-hover:opacity-100" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Resources */}
          {(activeFilter === 'ALL' || activeFilter === 'RESOURCES') && matchingResources.length > 0 && (
            <div className="space-y-1 pt-2">
              <div className="text-[7.5px] uppercase tracking-wider text-[#77766B] font-semibold flex items-center space-x-1">
                <HardDrive className="w-2.5 h-2.5" />
                <span>RESOURCES ({matchingResources.length})</span>
              </div>
              <div className="space-y-0.5">
                {matchingResources.map((res) => (
                  <button
                    key={res.id}
                    onClick={() => handleSelect('resource', res, 'resources')}
                    className="w-full text-left p-1.5 border border-transparent hover:border-[#AAA99B] hover:bg-[#F2EEE4] flex items-center justify-between group transition-colors"
                  >
                    <div>
                      <div className="font-bold text-[#25251F] text-[10px]">{res.title}</div>
                      <div className="text-[8px] text-[#666]">{res.format} • {res.size} • Locus: {res.locus}</div>
                    </div>
                    <ArrowRight className="w-3 h-3 text-[#AAA99B] group-hover:text-black opacity-0 group-hover:opacity-100" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {totalResults === 0 && (
            <div className="py-8 text-center text-[#77766B] text-[10px]">
              No matching archival records found for "{query}".
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-3 py-1.5 bg-[#DFDBD0] border-t border-[#AAA99B] flex items-center justify-between text-[7.5px] text-[#77766B]">
          <span>INDEXED WITH FULL PERSISTENCE (INDEXEDDB)</span>
          <span>PRESS ESC TO CLOSE</span>
        </div>
      </div>
    </div>
  );
}
