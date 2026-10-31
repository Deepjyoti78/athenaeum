import React, { useState, useMemo } from 'react';
import { Search, Plus, Compass, ChevronRight, LayoutList, LayoutGrid, X, MapPin } from 'lucide-react';
import { INITIAL_PLACES } from '../data/mockData';
import { useArchive } from '../context/ArchiveContext';

export function PlacesView({ places: propPlaces = INITIAL_PLACES, onAddPlace }) {
  const context = useArchive();
  const places = propPlaces || context?.places || INITIAL_PLACES;
  const inspectRecord = context?.inspectRecord;

  const [placeList, setPlaceList] = useState(places);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('ALL');
  const [sortBy, setSortBy] = useState('updated');
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'grid'
  const [activePlaceId, setActivePlaceId] = useState('plc-1');
  const [hoveredPlaceId, setHoveredPlaceId] = useState(null);
  const [isAdding, setIsAdding] = useState(false);

  // New place modal state
  const [name, setName] = useState('');
  const [region, setRegion] = useState('');
  const [coords, setCoords] = useState('');
  const [established, setEstablished] = useState('');
  const [recordsCount, setRecordsCount] = useState(1);
  const [description, setDescription] = useState('');

  // Pin locus coordinates mapped on SVG canvas (800 x 680)
  const pinCoordinates = {
    'plc-1': { x: 508, y: 350, number: 1, label: 'Limehouse' },
    'plc-2': { x: 560, y: 500, number: 2, label: 'Greenwich' },
    'plc-3': { x: 236, y: 308, number: 3, label: 'Fleet St' },
    'plc-4': { x: 305, y: 280, number: 4, label: 'Barbican' }
  };

  // Regions list for filter
  const regions = useMemo(() => {
    const set = new Set();
    placeList.forEach(p => {
      if (p.region) set.add(p.region);
    });
    return Array.from(set);
  }, [placeList]);

  // Filter & Sort
  const filteredPlaces = useMemo(() => {
    return placeList.filter(p => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || 
        p.name.toLowerCase().includes(q) || 
        p.region.toLowerCase().includes(q) || 
        p.description.toLowerCase().includes(q) ||
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
      description: description.trim() || 'Geographic field survey station in Greater London.'
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

  // Render thumbnail for a place
  const renderPlaceThumbnail = (plc, idx) => {
    if (plc.id === 'plc-1') {
      // Limehouse Basin: Hydrographic Water Basin map
      return (
        <div className="w-full h-full bg-[#D5D0C2] relative overflow-hidden flex items-center justify-center">
          <svg viewBox="0 0 100 60" className="w-full h-full opacity-90 select-none">
            <rect width="100" height="60" fill="#DDD8CA" />
            {/* River Thames edge */}
            <path d="M 0,45 Q 40,35 70,50 L 100,55 L 100,60 L 0,60 Z" fill="#93A295" stroke="#718074" strokeWidth="0.8" />
            <text x="35" y="55" fill="#4A564C" fontSize="5" fontStyle="italic" fontFamily="serif">Thames</text>
            {/* Dock basin shape */}
            <path d="M 25,10 L 65,12 L 72,35 L 50,42 L 20,38 Z" fill="#9DAFA0" stroke="#5E6D60" strokeWidth="1" />
            {/* Canal lock cut */}
            <path d="M 40,0 L 40,11" stroke="#5E6D60" strokeWidth="1.5" />
            {/* Basin jetties */}
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
            {/* Building Pediment & Columns */}
            <path d="M 15,18 L 50,8 L 85,18 Z" fill="none" stroke="#555" strokeWidth="1" />
            <rect x="18" y="18" width="64" height="3" fill="#BDB9AA" stroke="#444" strokeWidth="0.75" />
            {/* Columns */}
            {[24, 37, 50, 63, 76].map(cx => (
              <line key={cx} x1={cx} y1="21" x2={cx} y2="52" stroke="#444" strokeWidth="1.2" />
            ))}
            {/* Base */}
            <rect x="14" y="52" width="72" height="4" fill="#BDB9AA" stroke="#444" strokeWidth="0.75" />
            {/* Arched portal */}
            <path d="M 44,52 L 44,34 Q 50,28 56,34 L 56,52 Z" fill="#939E8F" stroke="#333" strokeWidth="0.8" />
          </svg>
        </div>
      );
    }
    // Default / Barbican Sub-Level B: Underground Structural Blueprint
    return (
      <div className="w-full h-full bg-[#D5D0C2] relative overflow-hidden flex items-center justify-center">
        <svg viewBox="0 0 100 60" className="w-full h-full opacity-90 select-none">
          <rect width="100" height="60" fill="#DDD8CA" />
          {/* Engineering grid lines */}
          <line x1="10" y1="10" x2="90" y2="10" stroke="#B8B2A0" strokeWidth="0.5" strokeDasharray="2 2" />
          <line x1="10" y1="30" x2="90" y2="30" stroke="#B8B2A0" strokeWidth="0.5" strokeDasharray="2 2" />
          <line x1="10" y1="50" x2="90" y2="50" stroke="#B8B2A0" strokeWidth="0.5" strokeDasharray="2 2" />
          {/* Concrete pillar nodes */}
          <rect x="18" y="15" width="22" height="30" fill="none" stroke="#3E4F3B" strokeWidth="1.2" />
          <rect x="52" y="15" width="30" height="30" fill="none" stroke="#3E4F3B" strokeWidth="1.2" />
          <path d="M 40,25 L 52,25 M 40,35 L 52,35" stroke="#3E4F3B" strokeWidth="1.2" />
          {/* Structural hatch */}
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
      {/* TOP HEADER BAR (matching Image 2)                             */}
      {/* ============================================================ */}
      <div className="p-3 border-b border-[#B5B3A4] bg-[#DFDBD0] flex items-center justify-between">
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
          {/* Search Input */}
          <div className="flex items-center space-x-1.5 bg-[#FAF8F3] border border-[#B5B3A4] px-2.5 py-1 text-[8.5px]">
            <Search className="w-3 h-3 text-[#66655B]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search places..."
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

          {/* Sort Dropdown */}
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
      {/* MAIN TWO-COLUMN SPLIT VIEW (matching Image 2)                */}
      {/* ============================================================ */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-3 p-3 overflow-hidden">
        
        {/* ------------------------------------------------------------ */}
        {/* LEFT COLUMN: INTERACTIVE ARCHIVAL CARTOGRAPHIC MAP (~58%)    */}
        {/* ------------------------------------------------------------ */}
        <div className="lg:col-span-7 border border-[#B5B3A4] bg-[#E5E1D2] relative overflow-hidden flex flex-col h-full shadow-sm">
          
          {/* Top-Left Geographic Location Overlay Badge */}
          <div className="absolute top-3 left-3 z-20 bg-[#EAE7D9]/92 border border-[#B5B3A4] px-2.5 py-1.5 shadow-sm backdrop-blur-[1px]">
            <div className="text-[9px] font-bold uppercase tracking-wider text-[#171714]">
              LONDON / UNITED KINGDOM
            </div>
            <div className="text-[7.5px] font-mono text-[#66655B] mt-0.5">
              51.5074° N, 0.1278° W
            </div>
          </div>

          {/* Top-Right Nautical Compass Rose */}
          <div className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full border border-[#8F8D80] bg-[#EAE7D9]/85 flex items-center justify-center shadow-sm">
            <svg viewBox="0 0 32 32" className="w-7 h-7">
              <circle cx="16" cy="16" r="13" fill="none" stroke="#999587" strokeWidth="0.5" strokeDasharray="1.5 1.5" />
              <line x1="16" y1="4" x2="16" y2="28" stroke="#555" strokeWidth="0.5" />
              <line x1="4" y1="16" x2="28" y2="16" stroke="#555" strokeWidth="0.5" />
              {/* North Arrow */}
              <polygon points="16,5 18,16 16,14 14,16" fill="#171714" />
              <polygon points="16,27 18,16 16,18 14,16" fill="#888" />
              <text x="16" y="3.5" fill="#171714" fontSize="4.5" fontWeight="bold" fontFamily="monospace" textAnchor="middle">N</text>
            </svg>
          </div>

          {/* Bottom-Left Metric Scale Bar */}
          <div className="absolute bottom-3 left-3 z-20 bg-[#EAE7D9]/90 border border-[#B5B3A4] px-2 py-1 shadow-sm flex flex-col">
            <div className="flex justify-between text-[6.5px] font-mono text-[#555] mb-0.5 px-0.5">
              <span>0</span>
              <span>2</span>
              <span>4 KM</span>
            </div>
            <div className="flex h-1 w-24 border border-[#171714]">
              <div className="w-1/2 bg-[#171714]" />
              <div className="w-1/2 bg-[#FAF8F3]" />
            </div>
          </div>

          {/* Bottom-Right Region Watermark */}
          <div className="absolute bottom-3 right-3 z-20 text-[7px] font-mono uppercase text-[#66655B] bg-[#EAE7D9]/90 border border-[#B5B3A4] px-2 py-0.5">
            GREATER LONDON —
          </div>

          {/* Archival Map SVG Canvas */}
          <div className="w-full h-full relative cursor-crosshair">
            <svg 
              viewBox="0 0 800 680" 
              className="w-full h-full object-cover select-none"
              preserveAspectRatio="xMidYMid slice"
            >
              {/* Map Parchment Base */}
              <rect width="800" height="680" fill="#E6E2D4" />

              {/* Topographic fine grid lines */}
              <defs>
                <pattern id="topoGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#DDD7C7" strokeWidth="0.5" />
                </pattern>
                {/* Water texture pattern */}
                <pattern id="waterHatch" width="8" height="8" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
                  <line x1="0" y1="0" x2="0" y2="8" stroke="#899A8E" strokeWidth="0.6" strokeOpacity="0.4" />
                </pattern>
              </defs>
              <rect width="800" height="680" fill="url(#topoGrid)" />

              {/* Park & Green Space Outlines */}
              {/* Regent's Park */}
              <ellipse cx="200" cy="180" rx="45" ry="35" fill="#D5DBCF" stroke="#B8C4B0" strokeWidth="0.8" />
              {/* Hyde Park */}
              <polygon points="90,320 160,300 170,350 100,370" fill="#D5DBCF" stroke="#B8C4B0" strokeWidth="0.8" />
              {/* Victoria Park */}
              <polygon points="530,130 630,120 620,160 520,170" fill="#D5DBCF" stroke="#B8C4B0" strokeWidth="0.8" />
              {/* Greenwich Park */}
              <ellipse cx="580" cy="540" rx="36" ry="42" fill="#D5DBCF" stroke="#B8C4B0" strokeWidth="0.8" />
              {/* Southwark Park */}
              <polygon points="460,430 500,430 490,480 450,470" fill="#D5DBCF" stroke="#B8C4B0" strokeWidth="0.8" />

              {/* Secondary Street Grid Network */}
              <g stroke="#D4CEC0" strokeWidth="0.6" fill="none">
                {[...Array(18)].map((_, i) => (
                  <path key={`s1-${i}`} d={`M 0,${i * 40 + 10} Q 400,${i * 40 + 25} 800,${i * 40 - 10}`} />
                ))}
                {[...Array(20)].map((_, i) => (
                  <path key={`s2-${i}`} d={`M ${i * 42 + 10},0 Q ${i * 42 + 20},340 ${i * 42 - 10},680`} />
                ))}
              </g>

              {/* Primary Arterial Roads */}
              <g stroke="#B8B2A2" strokeWidth="1.2" fill="none">
                {/* Oxford St / Bayswater / Mile End */}
                <path d="M 0,270 C 200,280 400,260 800,290" />
                {/* Fleet St / Strand / Commercial Rd */}
                <path d="M 20,330 C 220,325 360,310 800,340" />
                {/* Great North Rd / City Rd */}
                <path d="M 240,0 C 270,180 320,290 330,370" />
                {/* Kingsland Rd */}
                <path d="M 440,0 C 430,160 410,270 410,340" />
                {/* Southwark / Old Kent Rd */}
                <path d="M 330,420 C 370,490 500,560 620,680" />
                {/* Greenwich link */}
                <path d="M 480,480 C 530,510 590,510 650,540" />
              </g>

              {/* Railway Lines (Hatched) */}
              <g stroke="#8F8877" strokeWidth="1" strokeDasharray="4 3" fill="none">
                <path d="M 0,220 C 200,230 450,220 800,230" />
                <path d="M 280,330 C 340,430 450,520 620,680" />
              </g>

              {/* ============================================================ */}
              {/* RIVER THAMES (Smooth authentic serpentine path matching Map) */}
              {/* ============================================================ */}
              {/* Water Area with Shoreline */}
              <path
                d="M 0,440 
                   C 100,435 170,420 220,380 
                   C 260,345 310,355 350,385 
                   C 380,410 420,415 450,405 
                   C 480,395 500,370 520,340 
                   C 540,310 560,325 570,360 
                   C 585,410 575,470 540,500 
                   C 515,520 525,560 565,565 
                   C 605,570 650,540 680,490 
                   C 710,440 760,450 800,470
                   L 800,520
                   C 760,500 700,495 670,540
                   C 630,600 580,620 535,605
                   C 485,590 470,530 505,485
                   C 530,450 540,400 525,370
                   C 515,350 495,360 480,375
                   C 445,415 400,435 365,415
                   C 335,395 295,390 265,415
                   C 215,460 140,475 0,480 Z"
                fill="#9AA89D"
                stroke="#6B7A6E"
                strokeWidth="1.2"
              />

              {/* Water Texture Overlay */}
              <path
                d="M 0,440 
                   C 100,435 170,420 220,380 
                   C 260,345 310,355 350,385 
                   C 380,410 420,415 450,405 
                   C 480,395 500,370 520,340 
                   C 540,310 560,325 570,360 
                   C 585,410 575,470 540,500 
                   C 515,520 525,560 565,565 
                   C 605,570 650,540 680,490 
                   C 710,440 760,450 800,470
                   L 800,520
                   C 760,500 700,495 670,540
                   C 630,600 580,620 535,605
                   C 485,590 470,530 505,485
                   C 530,450 540,400 525,370
                   C 515,350 495,360 480,375
                   C 445,415 400,435 365,415
                   C 335,395 295,390 265,415
                   C 215,460 140,475 0,480 Z"
                fill="url(#waterHatch)"
              />

              {/* River Thames Tilted Label */}
              <g transform="translate(255, 395) rotate(16)">
                <text 
                  x="0" 
                  y="0" 
                  fill="#475449" 
                  fontSize="9.5" 
                  fontFamily="serif" 
                  fontStyle="italic" 
                  fontWeight="bold"
                  letterSpacing="1.5"
                >
                  River Thames
                </text>
              </g>

              {/* Borough Geographic Labels (matching Image 2) */}
              <text x="90" y="180" fill="#6B6758" fontSize="8.5" fontFamily="monospace" fontWeight="bold" letterSpacing="2">CAMDEN</text>
              <text x="210" y="195" fill="#6B6758" fontSize="8.5" fontFamily="monospace" fontWeight="bold" letterSpacing="2">ISLINGTON</text>
              <text x="440" y="170" fill="#6B6758" fontSize="8.5" fontFamily="monospace" fontWeight="bold" letterSpacing="2">HACKNEY</text>
              <text x="75" y="430" fill="#6B6758" fontSize="8.5" fontFamily="monospace" fontWeight="bold" letterSpacing="2">WESTMINSTER</text>
              <text x="270" y="325" fill="#6B6758" fontSize="8.5" fontFamily="monospace" fontWeight="bold" letterSpacing="2">CITY OF</text>
              <text x="268" y="337" fill="#6B6758" fontSize="8.5" fontFamily="monospace" fontWeight="bold" letterSpacing="2">LONDON</text>
              <text x="445" y="315" fill="#6B6758" fontSize="8.5" fontFamily="monospace" fontWeight="bold" letterSpacing="2">TOWER</text>
              <text x="435" y="327" fill="#6B6758" fontSize="8.5" fontFamily="monospace" fontWeight="bold" letterSpacing="2">HAMLETS</text>
              <text x="245" y="475" fill="#6B6758" fontSize="8.5" fontFamily="monospace" fontWeight="bold" letterSpacing="2">SOUTHWARK</text>
              <text x="540" y="535" fill="#6B6758" fontSize="8.5" fontFamily="monospace" fontWeight="bold" letterSpacing="2">GREENWICH</text>

              {/* ============================================================ */}
              {/* 4 INTERACTIVE PIN MARKERS (matching Image 2)                 */}
              {/* ============================================================ */}
              {filteredPlaces.map((plc, idx) => {
                const coords = pinCoordinates[plc.id] || { x: 300 + idx * 80, y: 300 + idx * 60, number: idx + 1 };
                const isSelected = activePlaceId === plc.id;
                const isHovered = hoveredPlaceId === plc.id;

                return (
                  <g 
                    key={plc.id}
                    onClick={() => handleSelectPlace(plc)}
                    onMouseEnter={() => setHoveredPlaceId(plc.id)}
                    onMouseLeave={() => setHoveredPlaceId(null)}
                    className="cursor-pointer transition-transform duration-200"
                    transform={`translate(${coords.x}, ${coords.y})`}
                  >
                    {/* Pulsing ring if selected */}
                    {isSelected && (
                      <circle cx="0" cy="-14" r="16" fill="none" stroke="#4B5E45" strokeWidth="1.5" className="animate-ping opacity-60" />
                    )}

                    {/* Pin Needle stem pointing down to locus */}
                    <line x1="0" y1="-14" x2="0" y2="0" stroke="#171714" strokeWidth="1.5" />
                    <circle cx="0" cy="0" r="1.8" fill="#171714" />

                    {/* Circular Olive Badge */}
                    <circle 
                      cx="0" 
                      cy="-14" 
                      r={isSelected || isHovered ? "11.5" : "10"} 
                      fill="#2E3D2A" 
                      stroke="#FAF8F3" 
                      strokeWidth="1.2" 
                      className="filter drop-shadow"
                    />

                    {/* Number Inside Badge */}
                    <text 
                      x="0" 
                      y="-10.5" 
                      fill="#FAF8F3" 
                      fontSize="9.5" 
                      fontWeight="bold" 
                      fontFamily="monospace" 
                      textAnchor="middle"
                    >
                      {coords.number}
                    </text>

                    {/* Hover Tooltip Card */}
                    {(isHovered || isSelected) && (
                      <g transform="translate(14, -26)" className="pointer-events-none">
                        <rect x="0" y="0" width="130" height="32" fill="#FAF8F3" stroke="#2E3D2A" strokeWidth="1" rx="1" />
                        <text x="6" y="12" fill="#171714" fontSize="7.5" fontWeight="bold" fontFamily="monospace">{plc.name}</text>
                        <text x="6" y="24" fill="#66655B" fontSize="6.5" fontFamily="monospace">{plc.coordinates}</text>
                      </g>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* ------------------------------------------------------------ */}
        {/* RIGHT COLUMN: PLACES LIST & REGISTRY SUMMARY (~42%)          */}
        {/* ------------------------------------------------------------ */}
        <div className="lg:col-span-5 flex flex-col h-full space-y-2.5 overflow-hidden">
          
          {/* TOP CARD: PLACES LISTING */}
          <div className="border border-[#B5B3A4] bg-[#EAE7D9] flex-1 flex flex-col overflow-hidden shadow-sm">
            
            {/* Header: PLACES (4) & VIEW Switcher (List vs Grid) */}
            <div className="p-2.5 pb-2 border-b border-[#B5B3A4] bg-[#DFDBD0] flex items-center justify-between">
              <div className="text-[10px] uppercase tracking-wider font-bold text-[#171714]">
                PLACES ({filteredPlaces.length})
              </div>

              <div className="flex items-center space-x-1.5 text-[8px] font-mono text-[#55544B]">
                <span className="uppercase text-[7.5px] font-bold text-[#66655B]">VIEW</span>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1 border ${viewMode === 'list' ? 'bg-[#171714] text-[#FAF8F3] border-[#171714]' : 'bg-[#EAE7D9] text-[#171714] border-[#B5B3A4] hover:bg-[#DDD8CB]'}`}
                  title="List View"
                >
                  <LayoutList className="w-3 h-3" />
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1 border ${viewMode === 'grid' ? 'bg-[#171714] text-[#FAF8F3] border-[#171714]' : 'bg-[#EAE7D9] text-[#171714] border-[#B5B3A4] hover:bg-[#DDD8CB]'}`}
                  title="Grid View"
                >
                  <LayoutGrid className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Places Content: List vs Grid */}
            <div className="flex-1 overflow-y-auto divide-y divide-[#B5B3A4]">
              {filteredPlaces.map((plc, idx) => {
                const isSelected = activePlaceId === plc.id;
                const isHovered = hoveredPlaceId === plc.id;
                const pinNum = pinCoordinates[plc.id]?.number || (idx + 1);

                return (
                  <div
                    key={plc.id}
                    onClick={() => handleSelectPlace(plc)}
                    onMouseEnter={() => setHoveredPlaceId(plc.id)}
                    onMouseLeave={() => setHoveredPlaceId(null)}
                    className={`p-2.5 cursor-pointer transition-colors group ${
                      isSelected 
                        ? 'bg-[#E2DDD0] border-l-2 border-l-[#2E3D2A]' 
                        : isHovered 
                          ? 'bg-[#E7E3D6]' 
                          : 'hover:bg-[#E4DFC2]/40'
                    }`}
                  >
                    {/* Top Section: Number Badge, Title, Coordinates & Thumbnail */}
                    <div className="flex items-start justify-between">
                      
                      {/* Left: Badge, Title & Coords */}
                      <div className="flex items-start space-x-2 flex-1 pr-2">
                        {/* Number Badge */}
                        <div className="w-5 h-5 rounded-full bg-[#2E3D2A] text-[#FAF8F3] text-[9px] font-bold font-mono flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                          {pinNum}
                        </div>

                        {/* Title & Coordinates */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-[11px] font-bold text-[#171714] leading-tight group-hover:underline truncate">
                            {plc.name}
                          </h3>
                          <div className="text-[7.5px] text-[#55544B] font-mono mt-0.5 flex items-center space-x-1">
                            <span>⊙</span>
                            <span>{plc.coordinates}</span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Archival Thumbnail with Records Badge */}
                      <div className="flex items-center space-x-2 flex-shrink-0">
                        <div className="flex flex-col items-center">
                          <div className="w-16 h-10 border border-[#B5B3A4] bg-[#D5D0C2] overflow-hidden rounded-[0.5px] shadow-inner">
                            {renderPlaceThumbnail(plc, idx)}
                          </div>
                          <span className="text-[6.5px] font-mono font-bold text-[#444] border border-[#B5B3A4] bg-[#DDD8CB] px-1 py-0.2 text-center mt-1 w-16">
                            {plc.recordsCount || 1} RECORDS
                          </span>
                        </div>

                        <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isSelected ? 'text-[#171714] translate-x-0.5' : 'text-[#88877B]'}`} />
                      </div>
                    </div>

                    {/* Middle Section: Historic Summary Description */}
                    <p className="text-[8px] text-[#33322A] leading-relaxed mt-2 line-clamp-2">
                      {plc.description}
                    </p>

                    {/* Bottom Section: Region and Established Year */}
                    <div className="pt-1.5 mt-2 border-t border-[#D5D1C4] flex items-center justify-between text-[7px] font-mono text-[#66655B]">
                      <span>
                        REGION: <strong className="text-[#171714] font-medium">{plc.region}</strong>
                      </span>
                      <span>
                        ESTABLISHED: <strong className="text-[#171714] font-medium">{plc.established}</strong>
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ============================================================ */}
          {/* BOTTOM CARD: REGISTRY SUMMARY (matching Image 2)             */}
          {/* ============================================================ */}
          <div className="border border-[#B5B3A4] bg-[#EAE7D9] p-2.5 shadow-sm flex flex-col justify-between">
            {/* Header */}
            <div className="flex items-center justify-between pb-1 text-[8px] font-mono font-bold text-[#171714]">
              <span className="uppercase tracking-wider">REGISTRY SUMMARY</span>
              <span className="text-[7px] text-[#66655B] font-normal">LONDON / UNITED KINGDOM</span>
            </div>

            {/* 4 Metric Columns */}
            <div className="grid grid-cols-4 divide-x divide-[#B5B3A4] pt-2 border-t border-[#D5D1C4]">
              
              {/* Col 1: Places */}
              <div className="pr-2">
                <div 
                  className="text-[22px] font-bold text-[#171714] leading-none select-none tracking-tight"
                  style={{ fontFamily: '"Cormorant Garamond", "Newsreader", Georgia, serif' }}
                >
                  {filteredPlaces.length < 10 ? `0${filteredPlaces.length}` : filteredPlaces.length}
                </div>
                <div className="text-[6.5px] font-mono font-bold uppercase tracking-wider text-[#66655B] mt-1">
                  PLACES
                </div>
              </div>

              {/* Col 2: Linked Records */}
              <div className="px-2">
                <div 
                  className="text-[22px] font-bold text-[#171714] leading-none select-none tracking-tight"
                  style={{ fontFamily: '"Cormorant Garamond", "Newsreader", Georgia, serif' }}
                >
                  {totalLinkedRecords}
                </div>
                <div className="text-[6.5px] font-mono font-bold uppercase tracking-wider text-[#66655B] mt-1">
                  LINKED RECORDS
                </div>
              </div>

              {/* Col 3: Regions */}
              <div className="px-2">
                <div 
                  className="text-[22px] font-bold text-[#171714] leading-none select-none tracking-tight"
                  style={{ fontFamily: '"Cormorant Garamond", "Newsreader", Georgia, serif' }}
                >
                  {regions.length < 10 ? `0${regions.length}` : regions.length}
                </div>
                <div className="text-[6.5px] font-mono font-bold uppercase tracking-wider text-[#66655B] mt-1">
                  REGIONS
                </div>
              </div>

              {/* Col 4: Mini Activity Histogram Graph */}
              <div className="pl-2 flex items-end justify-between h-8 self-end pb-0.5">
                {[
                  { h: 14, color: '#74866A' },
                  { h: 20, color: '#74866A' },
                  { h: 28, color: '#4B5E45' },
                  { h: 36, color: '#2E3D2A' },
                  { h: 24, color: '#4B5E45' },
                  { h: 18, color: '#74866A' }
                ].map((b, i) => (
                  <div
                    key={i}
                    className="w-[4px] rounded-[0.5px]"
                    style={{ height: `${b.h}px`, backgroundColor: b.color }}
                  />
                ))}
              </div>
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
