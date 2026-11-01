import React, { useState, useMemo } from 'react';
import { Search, Plus, MapPin, ChevronRight, LayoutList, LayoutGrid, X, ExternalLink } from 'lucide-react';
import { INITIAL_PLACES } from '../data/mockData';
import { useArchive } from '../context/ArchiveContext';

export function PlacesView({ places: propPlaces = INITIAL_PLACES, onAddPlace }) {
  const context = useArchive();
  const places = propPlaces || context?.places || INITIAL_PLACES;
  const inspectRecord = context?.inspectRecord;

  const [placeList, setPlaceList] = useState(places || []);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('ALL');
  const [sortBy, setSortBy] = useState('updated');
  const [viewMode, setViewMode] = useState('grid'); // Default to full-width archival grid
  const [activePlaceId, setActivePlaceId] = useState(null);
  const [isAdding, setIsAdding] = useState(false);

  React.useEffect(() => {
    setPlaceList(places || []);
  }, [places]);

  // New place modal state
  const [name, setName] = useState('');
  const [region, setRegion] = useState('');
  const [coords, setCoords] = useState('');
  const [established, setEstablished] = useState('');
  const [recordsCount, setRecordsCount] = useState(1);
  const [description, setDescription] = useState('');
  const [linkedWork, setLinkedWork] = useState('East London Heritage Archive');

  // Regions list for filter
  const regions = useMemo(() => {
    const set = new Set();
    (placeList || []).forEach(p => {
      if (p?.region) set.add(p.region);
    });
    return Array.from(set);
  }, [placeList]);

  // Filter & Sort
  const filteredPlaces = useMemo(() => {
    return (placeList || []).filter(p => {
      if (!p) return false;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || 
        (p.name && p.name.toLowerCase().includes(q)) || 
        (p.region && p.region.toLowerCase().includes(q)) || 
        (p.description && p.description.toLowerCase().includes(q)) ||
        (p.coordinates && p.coordinates.toLowerCase().includes(q));
      
      const matchesRegion = selectedRegion === 'ALL' || p.region === selectedRegion;
      return matchesSearch && matchesRegion;
    }).sort((a, b) => {
      if (sortBy === 'established-old') {
        return (parseInt(a.established, 10) || 0) - (parseInt(b.established, 10) || 0);
      }
      if (sortBy === 'established-new') {
        return (parseInt(b.established, 10) || 0) - (parseInt(a.established, 10) || 0);
      }
      if (sortBy === 'records') {
        return (b.recordsCount || 0) - (a.recordsCount || 0);
      }
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      }
      return 0; // 'updated' preserves primary archival order
    });
  }, [placeList, searchQuery, selectedRegion, sortBy]);

  // Aggregate stats
  const totalLinkedRecords = useMemo(() => {
    return placeList.reduce((acc, p) => acc + (Number(p.recordsCount) || 0), 0);
  }, [placeList]);

  const handleSelectPlace = (plc) => {
    setActivePlaceId(plc.id);
    if (inspectRecord) {
      inspectRecord('place', plc);
    }
  };

  const handleCreate = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    const newP = {
      id: `plc-${Date.now()}`,
      name: name.trim(),
      region: region.trim() || 'London, UK',
      coordinates: coords.trim() || '51.5074° N, 0.1278° W',
      type: 'Archival Location',
      established: established.trim() || '1900',
      recordsCount: parseInt(recordsCount, 10) || 1,
      description: description.trim() || 'Geographic field survey station in Greater London.',
      linkedWork: linkedWork.trim() || 'General Vault Index'
    };
    const updated = [newP, ...placeList];
    setPlaceList(updated);
    if (onAddPlace) onAddPlace(newP);
    setIsAdding(false);
    setName('');
    setRegion('');
    setCoords('');
    setEstablished('');
    setDescription('');
  };

  // Render authentic thumbnail for each locus
  const renderPlaceThumbnail = (plc) => {
    if (plc.id === 'plc-1') {
      // Limehouse Basin: Hydrographic Water Basin map
      return (
        <div className="w-full h-full bg-[#D5D0C2] relative overflow-hidden flex items-center justify-center">
          <svg viewBox="0 0 100 60" className="w-full h-full opacity-90 select-none">
            <rect width="100" height="60" fill="#DDD8CA" />
            <path d="M 0,45 Q 40,35 70,50 L 100,55 L 100,60 L 0,60 Z" fill="#93A295" stroke="#718074" strokeWidth="0.8" />
            <text x="35" y="55" fill="#4A564C" fontSize="5" fontStyle="italic" fontFamily="serif">Thames</text>
            <path d="M 25,10 L 65,12 L 72,35 L 50,42 L 20,38 Z" fill="#9DAFA0" stroke="#5E6D60" strokeWidth="1" />
            <path d="M 40,0 L 40,11" stroke="#5E6D60" strokeWidth="1.5" />
            <line x1="30" y1="20" x2="45" y2="20" stroke="#48534A" strokeWidth="0.8" />
            <line x1="50" y1="28" x2="65" y2="28" stroke="#48534A" strokeWidth="0.8" />
          </svg>
        </div>
      );
    }
    if (plc.id === 'plc-2') {
      // Greenwich Observatory Crypt: Transit Circle / Quadrant Dial
      return (
        <div className="w-full h-full bg-[#D5D0C2] relative overflow-hidden flex items-center justify-center">
          <svg viewBox="0 0 100 60" className="w-full h-full opacity-90 select-none">
            <rect width="100" height="60" fill="#DDD8CA" />
            <g transform="translate(50, 30)">
              <circle cx="0" cy="0" r="24" fill="none" stroke="#5A6652" strokeWidth="1" />
              <circle cx="0" cy="0" r="20" fill="none" stroke="#75826D" strokeWidth="0.5" strokeDasharray="1.5 1.5" />
              <circle cx="0" cy="0" r="16" fill="#CFD5C7" fillOpacity="0.4" stroke="#5A6652" strokeWidth="0.8" />
              <line x1="-24" y1="0" x2="24" y2="0" stroke="#333" strokeWidth="0.8" />
              <line x1="0" y1="-24" x2="0" y2="24" stroke="#333" strokeWidth="0.8" />
              {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map(deg => {
                const rad = (deg * Math.PI) / 180;
                return (
                  <line 
                    key={deg} 
                    x1={Math.cos(rad) * 20} 
                    y1={Math.sin(rad) * 20} 
                    x2={Math.cos(rad) * 24} 
                    y2={Math.sin(rad) * 24} 
                    stroke="#444" 
                    strokeWidth="0.6" 
                  />
                );
              })}
              <circle cx="0" cy="0" r="3" fill="#171714" />
            </g>
          </svg>
        </div>
      );
    }
    if (plc.id === 'plc-3') {
      // St. Bride Printing Library Vault: Architectural Facade
      return (
        <div className="w-full h-full bg-[#D5D0C2] relative overflow-hidden flex items-center justify-center">
          <svg viewBox="0 0 100 60" className="w-full h-full opacity-90 select-none">
            <rect width="100" height="60" fill="#DDD8CA" />
            <path d="M 15,18 L 50,8 L 85,18 Z" fill="none" stroke="#555" strokeWidth="1" />
            <rect x="18" y="18" width="64" height="3" fill="#BDB9AA" stroke="#444" strokeWidth="0.75" />
            {[24, 37, 50, 63, 76].map(cx => (
              <line key={cx} x1={cx} y1="21" x2={cx} y2="52" stroke="#444" strokeWidth="1.2" />
            ))}
            <rect x="14" y="52" width="72" height="4" fill="#BDB9AA" stroke="#444" strokeWidth="0.75" />
            <path d="M 44,52 L 44,34 Q 50,28 56,34 L 56,52 Z" fill="#939E8F" stroke="#333" strokeWidth="0.8" />
          </svg>
        </div>
      );
    }
    // Default / Barbican Sub-Level B: Structural Blueprint
    return (
      <div className="w-full h-full bg-[#D5D0C2] relative overflow-hidden flex items-center justify-center">
        <svg viewBox="0 0 100 60" className="w-full h-full opacity-90 select-none">
          <rect width="100" height="60" fill="#DDD8CA" />
          <line x1="10" y1="10" x2="90" y2="10" stroke="#B8B2A0" strokeWidth="0.5" strokeDasharray="2 2" />
          <line x1="10" y1="30" x2="90" y2="30" stroke="#B8B2A0" strokeWidth="0.5" strokeDasharray="2 2" />
          <line x1="10" y1="50" x2="90" y2="50" stroke="#B8B2A0" strokeWidth="0.5" strokeDasharray="2 2" />
          <rect x="18" y="15" width="22" height="30" fill="none" stroke="#3E4F3B" strokeWidth="1.2" />
          <rect x="52" y="15" width="30" height="30" fill="none" stroke="#3E4F3B" strokeWidth="1.2" />
          <path d="M 40,25 L 52,25 M 40,35 L 52,35" stroke="#3E4F3B" strokeWidth="1.2" />
          <line x1="22" y1="20" x2="36" y2="40" stroke="#74866A" strokeWidth="0.8" />
          <line x1="22" y1="40" x2="36" y2="20" stroke="#74866A" strokeWidth="0.8" />
          <line x1="56" y1="20" x2="78" y2="40" stroke="#74866A" strokeWidth="0.8" />
          <line x1="56" y1="40" x2="78" y2="20" stroke="#74866A" strokeWidth="0.8" />
        </svg>
      </div>
    );
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#E9E5D8] overflow-hidden select-none font-mono">
      {/* ============================================================ */}
      {/* TOP HEADER & TOOLBAR                                         */}
      {/* ============================================================ */}
      <div className="p-3 border-b border-[#B5B3A4] bg-[#DFDBD0] flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 bg-[#4B5E45] inline-block flex-shrink-0" />
          <h1 className="text-xs font-bold uppercase tracking-wider text-[#171714]">
            GEOGRAPHIC &amp; PLACES REGISTRY
          </h1>
          <span className="text-[9px] text-[#66655B] tracking-wider">
            (0{filteredPlaces.length} LOCI RECORDED)
          </span>
        </div>

        <div className="flex items-center space-x-2">
          {/* Search Box */}
          <div className="flex items-center space-x-1.5 bg-[#FAF8F3] border border-[#B5B3A4] px-2.5 py-1 text-[8.5px]">
            <Search className="w-3 h-3 text-[#66655B]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search places, coordinates..."
              className="bg-transparent text-[8.5px] text-[#171714] focus:outline-none w-44 placeholder-[#888]"
            />
          </div>

          {/* Region Dropdown Filter */}
          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="bg-[#FAF8F3] border border-[#B5B3A4] px-2 py-1 text-[8.5px] text-[#171714] focus:outline-none uppercase font-mono cursor-pointer"
          >
            <option value="ALL">ALL REGIONS</option>
            {regions.map(r => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>

          {/* Sort Selector */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-[#FAF8F3] border border-[#B5B3A4] px-2 py-1 text-[8.5px] text-[#171714] focus:outline-none uppercase font-mono cursor-pointer"
          >
            <option value="updated">RECENTLY UPDATED</option>
            <option value="records">RECORDS (MOST)</option>
            <option value="established-old">ESTABLISHED (OLDEST)</option>
            <option value="established-new">ESTABLISHED (NEWEST)</option>
            <option value="name">NAME (A-Z)</option>
          </select>

          {/* View Mode Toggle (Grid vs List) */}
          <div className="flex items-center space-x-1 border border-[#B5B3A4] bg-[#DFDBD0] p-0.5">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1 ${viewMode === 'grid' ? 'bg-[#171714] text-[#FAF8F3]' : 'text-[#66655B] hover:text-[#171714]'}`}
              title="Grid View"
            >
              <LayoutGrid className="w-3 h-3" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1 ${viewMode === 'list' ? 'bg-[#171714] text-[#FAF8F3]' : 'text-[#66655B] hover:text-[#171714]'}`}
              title="List View"
            >
              <LayoutList className="w-3 h-3" />
            </button>
          </div>

          {/* Add Place Action Button */}
          <button
            onClick={() => setIsAdding(true)}
            className="bg-[#171714] text-[#FAF8F3] hover:bg-black px-3 py-1 text-[8.5px] font-bold uppercase tracking-wider flex items-center space-x-1 transition-colors"
          >
            <Plus className="w-3 h-3" />
            <span>ADD PLACE</span>
          </button>
        </div>
      </div>

      {/* ============================================================ */}
      {/* MAIN CONTENT AREA: CLEAN ARCHIVAL FULL-WIDTH REGISTRY        */}
      {/* ============================================================ */}
      <div className="flex-1 p-3 overflow-y-auto space-y-3">
        {filteredPlaces.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center border border-dashed border-[#B5B3A4] text-center p-6 bg-[#E5E1D2]/50">
            <MapPin className="w-8 h-8 text-[#888] mb-2" />
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#171714]">NO LOCI FOUND</p>
            <p className="text-[8.5px] text-[#66655B] mt-1">Try adjusting your search criteria or add a new place record.</p>
          </div>
        ) : viewMode === 'grid' ? (
          /* ========================================================== */
          /* GRID VIEW: 2-COLUMN BALANCED ARCHIVAL RECORD CARDS         */
          /* ========================================================== */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {filteredPlaces.map((plc, idx) => {
              const isSelected = activePlaceId === plc.id;
              return (
                <div 
                  key={plc.id} 
                  onClick={() => handleSelectPlace(plc)}
                  className={`border border-[#B5B3A4] bg-[#EAE7D9] p-3 flex flex-col justify-between transition-all duration-150 cursor-pointer group shadow-sm ${
                    isSelected ? 'ring-1 ring-[#171714] bg-[#E4DFC2]/60' : 'hover:border-[#171714] hover:bg-[#E5E1D2]'
                  }`}
                >
                  {/* Card Header: Badge, Title, Coordinates & Type */}
                  <div>
                    <div className="flex items-start justify-between pb-2 border-b border-[#D5D1C4]">
                      <div className="flex items-start space-x-2.5 flex-1 pr-2">
                        {/* Number Badge */}
                        <div className="w-5 h-5 rounded-full bg-[#2E3D2A] text-[#FAF8F3] text-[9.5px] font-bold font-mono flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                          {idx + 1}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h3 className="text-[12px] font-bold text-[#171714] group-hover:underline flex items-center space-x-1.5 truncate">
                            <span>{plc.name}</span>
                          </h3>
                          <div className="text-[8px] text-[#66655B] font-mono mt-0.5 flex items-center space-x-1">
                            <span className="text-[#3E4F3B]">⊙</span>
                            <span>{plc.coordinates}</span>
                          </div>
                        </div>
                      </div>

                      {/* Archival Locus Status Pill */}
                      <span className="text-[7.5px] px-2 py-0.5 border border-[#B5B3A4] bg-[#DDD8CB] text-[#333] font-mono uppercase tracking-wider flex-shrink-0">
                        {plc.type || 'ARCHIVAL LOCUS'}
                      </span>
                    </div>

                    {/* Card Body: Description on Left, Drawing Thumbnail on Right */}
                    <div className="mt-2.5 flex items-start space-x-3">
                      <div className="flex-1 min-w-0 space-y-2">
                        <p className="text-[8.5px] text-[#33322A] leading-relaxed line-clamp-3">
                          {plc.description}
                        </p>
                        
                        <div className="pt-1.5 text-[7.5px] text-[#66655B] font-mono space-y-0.5">
                          <div>
                            REGION: <strong className="text-[#171714] font-medium">{plc.region}</strong>
                          </div>
                          <div>
                            ESTABLISHED: <strong className="text-[#171714] font-medium">{plc.established}</strong>
                          </div>
                        </div>
                      </div>

                      {/* Locus Illustration Thumbnail */}
                      <div className="flex flex-col items-center flex-shrink-0">
                        <div className="w-28 h-18 border border-[#B5B3A4] bg-[#D5D0C2] overflow-hidden rounded-[0.5px] shadow-inner">
                          {renderPlaceThumbnail(plc)}
                        </div>
                        <span className="text-[7px] font-mono font-bold text-[#444] border border-[#B5B3A4] bg-[#DDD8CB] px-1.5 py-0.5 text-center mt-1 w-28">
                          {plc.recordsCount || 1} RECORDS
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer: Linked Work & Inspect Link */}
                  <div className="mt-3 pt-2 border-t border-[#D5D1C4] flex items-center justify-between text-[8px] text-[#66655B]">
                    <div className="truncate mr-2">
                      LINKED WORK: <strong className="text-[#171714] font-medium">{plc.linkedWork || 'General Vault Index'}</strong>
                    </div>
                    <div className="flex items-center space-x-1 text-[#171714] font-bold group-hover:translate-x-0.5 transition-transform flex-shrink-0">
                      <span>INSPECT RECORD</span>
                      <ChevronRight className="w-3 h-3" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* ========================================================== */
          /* LIST VIEW: DENSE ARCHIVAL DIRECTORY TABLE                  */
          /* ========================================================== */
          <div className="border border-[#B5B3A4] bg-[#EAE7D9] overflow-hidden shadow-sm">
            <div className="grid grid-cols-12 gap-2 p-2.5 bg-[#DFDBD0] border-b border-[#B5B3A4] text-[7.5px] font-bold uppercase tracking-wider text-[#66655B]">
              <div className="col-span-1">#</div>
              <div className="col-span-4">LOCUS / NAME</div>
              <div className="col-span-2">COORDINATES</div>
              <div className="col-span-2">REGION</div>
              <div className="col-span-1">ESTABLISHED</div>
              <div className="col-span-1 text-center">RECORDS</div>
              <div className="col-span-1 text-right">ACTION</div>
            </div>
            
            <div className="divide-y divide-[#D5D1C4]">
              {filteredPlaces.map((plc, idx) => {
                const isSelected = activePlaceId === plc.id;
                return (
                  <div
                    key={plc.id}
                    onClick={() => handleSelectPlace(plc)}
                    className={`grid grid-cols-12 gap-2 p-2.5 items-center text-[8.5px] cursor-pointer transition-colors group ${
                      isSelected ? 'bg-[#E4DFC2]/80 border-l-2 border-l-[#171714]' : 'hover:bg-[#E5E1D2]'
                    }`}
                  >
                    <div className="col-span-1 flex items-center space-x-1">
                      <div className="w-4 h-4 rounded-full bg-[#2E3D2A] text-[#FAF8F3] text-[8px] font-bold flex items-center justify-center font-mono">
                        {idx + 1}
                      </div>
                    </div>
                    <div className="col-span-4 min-w-0 pr-2">
                      <div className="font-bold text-[#171714] truncate group-hover:underline">
                        {plc.name}
                      </div>
                      <div className="text-[7.5px] text-[#66655B] truncate mt-0.5">
                        {plc.description}
                      </div>
                    </div>
                    <div className="col-span-2 font-mono text-[7.5px] text-[#555] truncate">
                      {plc.coordinates}
                    </div>
                    <div className="col-span-2 text-[8px] text-[#333] truncate">
                      {plc.region}
                    </div>
                    <div className="col-span-1 font-mono text-[8px] text-[#444]">
                      {plc.established}
                    </div>
                    <div className="col-span-1 text-center font-mono font-bold text-[#171714]">
                      <span className="bg-[#DFDBD0] border border-[#B5B3A4] px-1.5 py-0.5 text-[7.5px]">
                        {plc.recordsCount || 1}
                      </span>
                    </div>
                    <div className="col-span-1 text-right">
                      <span className="text-[7.5px] text-[#171714] font-bold group-hover:underline inline-flex items-center">
                        OPEN <ChevronRight className="w-3 h-3 ml-0.5" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* FULL-WIDTH REGISTRY SUMMARY METRICS DOCK                     */}
        {/* ============================================================ */}
        <div className="border border-[#B5B3A4] bg-[#EAE7D9] p-3 shadow-sm flex flex-col justify-between mt-3">
          <div className="flex items-center justify-between pb-1.5 text-[8px] font-mono font-bold text-[#171714]">
            <span className="uppercase tracking-wider">REGISTRY SUMMARY &amp; ARCHIVAL DISTRIBUTION</span>
            <span className="text-[7.5px] text-[#66655B] font-normal">GREATER LONDON / UNITED KINGDOM HISTORIC SURVEY</span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-[#B5B3A4] pt-2 border-t border-[#D5D1C4] gap-2 md:gap-0">
            {/* Col 1: Places */}
            <div className="pr-3">
              <div 
                className="text-[26px] font-bold text-[#171714] leading-none select-none tracking-tight"
                style={{ fontFamily: '"Cormorant Garamond", "Newsreader", Georgia, serif' }}
              >
                {filteredPlaces.length < 10 ? `0${filteredPlaces.length}` : filteredPlaces.length}
              </div>
              <div className="text-[7px] font-mono font-bold uppercase tracking-wider text-[#66655B] mt-1">
                RECORDED PLACES
              </div>
            </div>

            {/* Col 2: Linked Records */}
            <div className="md:px-3 pt-2 md:pt-0">
              <div 
                className="text-[26px] font-bold text-[#171714] leading-none select-none tracking-tight"
                style={{ fontFamily: '"Cormorant Garamond", "Newsreader", Georgia, serif' }}
              >
                {totalLinkedRecords}
              </div>
              <div className="text-[7px] font-mono font-bold uppercase tracking-wider text-[#66655B] mt-1">
                LINKED RECORDS IN VAULT
              </div>
            </div>

            {/* Col 3: Regions */}
            <div className="md:px-3 pt-2 md:pt-0">
              <div 
                className="text-[26px] font-bold text-[#171714] leading-none select-none tracking-tight"
                style={{ fontFamily: '"Cormorant Garamond", "Newsreader", Georgia, serif' }}
              >
                {regions.length < 10 ? `0${regions.length}` : regions.length}
              </div>
              <div className="text-[7px] font-mono font-bold uppercase tracking-wider text-[#66655B] mt-1">
                GEOGRAPHIC REGIONS
              </div>
            </div>

            {/* Col 4: Archival Density Histogram */}
            <div className="md:pl-3 pt-2 md:pt-0 flex items-end justify-between h-9 pb-0.5">
              {[
                { h: 14, color: '#74866A', label: 'W' },
                { h: 22, color: '#74866A', label: 'T' },
                { h: 32, color: '#4B5E45', label: 'F' },
                { h: 36, color: '#2E3D2A', label: 'S' },
                { h: 26, color: '#4B5E45', label: 'S' },
                { h: 18, color: '#74866A', label: 'M' }
              ].map((b, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div
                    className="w-[6px] rounded-[0.5px]"
                    style={{ height: `${b.h}px`, backgroundColor: b.color }}
                  />
                  <span className="text-[6px] text-[#66655B] mt-1">{b.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* ADD PLACE MODAL DIALOG                                       */}
      {/* ============================================================ */}
      {isAdding && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-[1px] z-50 flex items-center justify-center p-4">
          <div className="bg-[#EAE7D9] border border-[#171714] max-w-md w-full p-3.5 shadow-2xl">
            <div className="flex justify-between items-center pb-2 border-b border-[#B5B3A4]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#171714]">
                RECORD GEOGRAPHIC LOCUS
              </span>
              <button onClick={() => setIsAdding(false)} className="hover:text-black">
                <X className="w-4 h-4 text-[#555]" />
              </button>
            </div>
            <form onSubmit={handleCreate} className="space-y-2 mt-3 text-[9px]">
              <div>
                <label className="block text-[7.5px] uppercase tracking-wider text-[#666] mb-0.5">LOCATION NAME *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Limehouse Lock Chamber"
                  className="w-full bg-[#FAF8F3] border border-[#B5B3A4] p-1.5 text-[9px] focus:outline-none"
                  autoFocus
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[7.5px] uppercase tracking-wider text-[#666] mb-0.5">COORDINATES</label>
                  <input
                    type="text"
                    value={coords}
                    onChange={(e) => setCoords(e.target.value)}
                    placeholder="51.5123° N, 0.0381° W"
                    className="w-full bg-[#FAF8F3] border border-[#B5B3A4] p-1.5 text-[9px] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[7.5px] uppercase tracking-wider text-[#666] mb-0.5">REGION</label>
                  <input
                    type="text"
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    placeholder="East London, UK"
                    className="w-full bg-[#FAF8F3] border border-[#B5B3A4] p-1.5 text-[9px] focus:outline-none"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[7.5px] uppercase tracking-wider text-[#666] mb-0.5">ESTABLISHED YEAR</label>
                  <input
                    type="text"
                    value={established}
                    onChange={(e) => setEstablished(e.target.value)}
                    placeholder="e.g. 1820"
                    className="w-full bg-[#FAF8F3] border border-[#B5B3A4] p-1.5 text-[9px] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[7.5px] uppercase tracking-wider text-[#666] mb-0.5">RECORDS COUNT</label>
                  <input
                    type="number"
                    min="1"
                    value={recordsCount}
                    onChange={(e) => setRecordsCount(e.target.value)}
                    className="w-full bg-[#FAF8F3] border border-[#B5B3A4] p-1.5 text-[9px] focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[7.5px] uppercase tracking-wider text-[#666] mb-0.5">HISTORIC SUMMARY</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  placeholder="Historical context, relevance to archival project..."
                  className="w-full bg-[#FAF8F3] border border-[#B5B3A4] p-1.5 text-[9px] focus:outline-none resize-none"
                />
              </div>
              <div className="pt-2 border-t border-[#B5B3A4] flex justify-end space-x-1.5">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-2.5 py-1 border border-[#B5B3A4] bg-[#DFDBD0] text-[8px] uppercase font-bold"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="px-3 py-1 bg-[#171714] text-[#FAF8F3] text-[8px] font-bold uppercase hover:bg-black"
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

export default PlacesView;