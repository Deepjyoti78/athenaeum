// ATHENAEUM — Master Archival Database & State Records

export const INITIAL_WORKS = [
  {
    id: 'WRK-2025-0003',
    title: 'ATHENÆUM APP PROJECT',
    shortTitle: 'Athenaeum App Project',
    type: 'Project',
    status: 'In progress',
    category: 'Product',
    updated: 'Today 09:15',
    created: '01 May 2025 14:22',
    area: 'Creative / Personal',
    owner: 'You',
    description: 'Cross-platform desktop application for personal archive and creative workspace.',
    longDescription: 'Build Athenaeum with a retro-futurist archival interface. Local-first, private, and built to last.',
    tags: ['app', 'flutter', 'productivity', 'archive', 'design'],
    progress: 65,
    milestones: [
      { name: 'Foundation', status: 'done' },
      { name: 'Core Features', status: 'current' },
      { name: 'Polish', status: 'pending' },
      { name: 'Release', status: 'pending' },
    ],
    startDate: '01 May 2025',
    targetDate: '30 Aug 2025',
    due: '-',
    linkedRecords: {
      actions: 12,
      entries: 8,
      collections: 3,
      people: 2,
    },
    notes: [
      { id: 'n1', date: '09 May 2025', text: 'Tested typographic grid density with IBM Plex Mono.' },
      { id: 'n2', date: '06 May 2025', text: 'Implemented local database schema in athenaeum.db.' }
    ],
    links: [
      { id: 'l1', title: 'Interface Specification v1.0', url: 'vault://specs/ui_spec.pdf' },
      { id: 'l2', title: 'Local Vault Directory', url: 'file:///usr/local/var/athenaeum' }
    ],
    files: [
      { id: 'f1', name: 'app_blueprint_wireframe.svg', size: '148 KB', date: '09 May' },
      { id: 'f2', name: 'records_manifest.json', size: '24 KB', date: '05 May' }
    ],
    activity: [
      { id: 'a1', time: '09:15 AM', text: 'Updated UI components and layout grid' },
      { id: 'a2', time: '08:30 AM', text: 'Database integrity verified: OK' }
    ],
    artwork: 'blueprint',
  },
  {
    id: 'WRK-2025-0002',
    title: 'EAST LONDON HERITAGE ARCHIVE',
    shortTitle: 'East London Heritage Archive',
    type: 'Research',
    status: 'In progress',
    category: 'Research',
    updated: 'Yesterday 16:42',
    created: '22 Apr 2025 11:30',
    area: 'Cultural / Historical',
    owner: 'You',
    description: 'Archival cartography and worker testimony documentation for the Limehouse Basin and West India Docks.',
    longDescription: 'Synthesizing 19th century ordnance survey maps with contemporary photographic documentation.',
    tags: ['history', 'cartography', 'london', 'urban-study', 'audio-docs'],
    progress: 42,
    milestones: [
      { name: 'Map Collection', status: 'done' },
      { name: 'GIS Alignment', status: 'current' },
      { name: 'Oral Interviews', status: 'pending' },
      { name: 'Catalog Publication', status: 'pending' },
    ],
    startDate: '20 Apr 2025',
    targetDate: '15 Oct 2025',
    due: '15 Oct 2025',
    linkedRecords: {
      actions: 8,
      entries: 14,
      collections: 5,
      people: 6,
    },
    notes: [
      { id: 'n1', date: '08 May 2025', text: 'Acquired 1884 dockland hydrographic surveys.' }
    ],
    links: [
      { id: 'l1', title: 'National Maritime Museum Records', url: 'https://rmg.co.uk/archive' }
    ],
    files: [
      { id: 'f1', name: 'thames_basin_1884.tiff', size: '42.8 MB', date: '08 May' }
    ],
    activity: [
      { id: 'a1', time: '16:42 PM', text: 'Indexed 12 historical maps' }
    ],
    artwork: 'dockmap',
  },
  {
    id: 'WRK-2025-0001',
    title: 'CREATURE CONCEPT EXPLORATIONS',
    shortTitle: 'Creature Concept Explorations',
    type: 'Creative',
    status: 'In progress',
    category: 'Creative',
    updated: '07 May 2025',
    created: '15 Apr 2025 09:00',
    area: 'Anatomy / Illustration',
    owner: 'You',
    description: 'Morphological anatomical studies combining beetle exoskeletons, avian flight muscles, and robotic armatures.',
    longDescription: 'A sketchbook compilation exploring biological articulation principles applied to biomechanical concept art.',
    tags: ['illustration', 'concept-art', 'anatomy', 'blender', 'sketches'],
    progress: 78,
    milestones: [
      { name: 'Silhouette Studies', status: 'done' },
      { name: 'Skeletal Orthographics', status: 'done' },
      { name: '3D Blockout', status: 'current' },
      { name: 'Final Rendering', status: 'pending' },
    ],
    startDate: '15 Apr 2025',
    targetDate: '30 May 2025',
    due: '30 May 2025',
    linkedRecords: {
      actions: 5,
      entries: 12,
      collections: 4,
      people: 1,
    },
    notes: [
      { id: 'n1', date: '07 May 2025', text: 'Completed 6 ink cross-hatching plates of thorax joinery.' }
    ],
    links: [
      { id: 'l1', title: 'Comparative Anatomy Reference', url: 'vault://refs/dorsal_plate.pdf' }
    ],
    files: [
      { id: 'f1', name: 'creature_ortho_sheet.png', size: '12.4 MB', date: '07 May' }
    ],
    activity: [
      { id: 'a1', time: '14:20 PM', text: 'Rendered turntable lighting pass' }
    ],
    artwork: 'creature',
  },
  {
    id: 'WRK-2025-0004',
    title: 'PHOTOGRAPHY PORTFOLIO',
    shortTitle: 'Photography Portfolio',
    type: 'Project',
    status: 'Planned',
    category: 'Curation',
    updated: '05 May 2025',
    created: '01 May 2025 18:00',
    area: 'Visual / Photography',
    owner: 'You',
    description: 'Medium-format black-and-white architectural monograph of post-war brutalist estates in London.',
    longDescription: 'Curating 48 gelatin silver prints on 300gsm archival cotton rag with letterpress commentary.',
    tags: ['photography', 'leica', 'brutalism', 'darkroom', 'monograph'],
    progress: 25,
    milestones: [
      { name: 'Negative Selection', status: 'done' },
      { name: 'Darkroom Proofing', status: 'current' },
      { name: 'Sequence Layout', status: 'pending' },
      { name: 'Exhibition Print Run', status: 'pending' },
    ],
    startDate: '01 May 2025',
    targetDate: '01 Nov 2025',
    due: '01 Nov 2025',
    linkedRecords: {
      actions: 6,
      entries: 9,
      collections: 2,
      people: 3,
    },
    notes: [
      { id: 'n1', date: '05 May 2025', text: 'Developed 3 rolls of Ilford HP5+ pushed to 800.' }
    ],
    links: [
      { id: 'l1', title: 'Barbican Estate Contact Sheets', url: 'vault://photos/barbican_rolls' }
    ],
    files: [
      { id: 'f1', name: 'contact_sheet_01.jpg', size: '8.2 MB', date: '05 May' }
    ],
    activity: [
      { id: 'a1', time: '11:00 AM', text: 'Selected 18 keeper frames' }
    ],
    artwork: 'camera',
  },
  {
    id: 'WRK-2025-0005',
    title: 'TYPOGRAPHIC ARCHIVE CATALOG',
    shortTitle: 'Typographic Archive Catalog',
    type: 'Research',
    status: 'In progress',
    category: 'Research',
    updated: '03 May 2025',
    created: '10 Apr 2025 10:00',
    area: 'Design History / Typography',
    owner: 'You',
    description: 'Documentation of mid-century Swiss and brutalist type specimens, grotesques, and technical grid systems.',
    longDescription: 'Comprehensive indexing of Josef Müller-Brockmann grid manuals, Berthold specimen sheets, and DIN specifications.',
    tags: ['typography', 'specimens', 'swiss-design', 'grids'],
    progress: 55,
    milestones: [
      { name: 'Specimen Digitization', status: 'done' },
      { name: 'Classification Index', status: 'current' },
      { name: 'Physical Binder Catalog', status: 'pending' },
    ],
    startDate: '10 Apr 2025',
    targetDate: '15 Jul 2025',
    due: '15 Jul 2025',
    linkedRecords: { actions: 3, entries: 6, collections: 2, people: 2 },
    notes: [{ id: 'n1', date: '03 May 2025', text: 'Scanned 1968 Monotype Univers specimen.' }],
    links: [],
    files: [{ id: 'f1', name: 'univers_specimen_1968.pdf', size: '15.4 MB', date: '03 May' }],
    activity: [{ id: 'a1', time: '10:15 AM', text: 'Cataloged 28 specimen folios' }],
    artwork: 'blueprint',
  },
  {
    id: 'WRK-2025-0006',
    title: 'LOCAL REPOSITORY VAULT ENGINE',
    shortTitle: 'Local Vault Engine',
    type: 'Maintenance',
    status: 'In progress',
    category: 'Maintenance',
    updated: '02 May 2025',
    created: '01 Mar 2025 08:00',
    area: 'Systems / Architecture',
    owner: 'You',
    description: 'SQLite database backup routines, checksum integrity verifications, and flat-file JSON export pipeline.',
    longDescription: 'Ensuring zero data loss with automated WAL mode synchronization, SHA-256 asset verification, and cold storage snapshots.',
    tags: ['database', 'sqlite', 'backup', 'integrity', 'systems'],
    progress: 90,
    milestones: [
      { name: 'SQLite Schema v1', status: 'done' },
      { name: 'WAL Checksum Verifier', status: 'done' },
      { name: 'JSON Export Routine', status: 'done' },
      { name: 'Automated Nightly Snapshot', status: 'current' },
    ],
    startDate: '01 Mar 2025',
    targetDate: '01 Jun 2025',
    due: '01 Jun 2025',
    linkedRecords: { actions: 2, entries: 4, collections: 1, people: 1 },
    notes: [{ id: 'n1', date: '02 May 2025', text: 'Benchmark: 10,000 records indexed in 24ms.' }],
    links: [],
    files: [{ id: 'f1', name: 'athenaeum_schema_v2.sql', size: '32 KB', date: '02 May' }],
    activity: [{ id: 'a1', time: '08:24 AM', text: 'Backup verification: 100% PASS' }],
    artwork: 'blueprint',
  },
  {
    id: 'WRK-2025-0007',
    title: 'OPTICAL ASTROLABE RECONSTRUCTION',
    shortTitle: 'Optical Astrolabe Project',
    type: 'Project',
    status: 'In progress',
    category: 'Instrument',
    updated: '01 May 2025',
    created: '12 Feb 2025 15:30',
    area: 'Historical Instruments',
    owner: 'You',
    description: 'Precision mechanical reconstruction of a 16th century brass planispheric astrolabe with stereographic rete projections.',
    longDescription: 'CAD drafting and micro-machining tolerances for celestial coordinate determination.',
    tags: ['astronomy', 'brass', 'instruments', 'optics'],
    progress: 70,
    milestones: [
      { name: 'Plate Stereography', status: 'done' },
      { name: 'Rete Calibration', status: 'current' },
      { name: 'Alidade Assembly', status: 'pending' },
    ],
    startDate: '12 Feb 2025',
    targetDate: '20 Jul 2025',
    due: '20 Jul 2025',
    linkedRecords: { actions: 4, entries: 5, collections: 2, people: 2 },
    notes: [{ id: 'n1', date: '01 May 2025', text: 'Tested zenith pin alignment.' }],
    links: [],
    files: [{ id: 'f1', name: 'astrolabe_calibrations.dxf', size: '4.2 MB', date: '01 May' }],
    activity: [{ id: 'a1', time: '15:30 PM', text: 'Etched horizon coordinates' }],
    artwork: 'blueprint',
  }
];

export const INITIAL_ACTIONS = [
  // 1. In progress (4 items)
  {
    id: 1,
    time: '09:30',
    action: 'Design database schema',
    work: 'Athenaeum App Project',
    status: 'In progress',
    priority: 3,
    date: '2025-05-09',
    notes: 'Focus on foreign key constraints for linked records.'
  },
  {
    id: 2,
    time: '10:30',
    action: 'Calibrate optical rangefinder',
    work: 'Optical Astrolabe Reconstruction',
    status: 'In progress',
    priority: 4,
    date: '2025-05-09',
    notes: 'Measure angular displacement against baseline star chart.'
  },
  {
    id: 3,
    time: '12:00',
    action: 'Implement local IndexedDB sync',
    work: 'Athenaeum App Project',
    status: 'In progress',
    priority: 3,
    date: '2025-05-09',
    notes: 'Verify atomic transaction rollbacks on cold start.'
  },
  {
    id: 4,
    time: '13:30',
    action: 'Index hydrographic survey folios',
    work: 'East London Heritage Archive',
    status: 'In progress',
    priority: 2,
    date: '2025-05-09',
    notes: 'Digitize 1884 high-tide bathymetric contours.'
  },

  // 2. To do (5 items)
  {
    id: 5,
    time: '11:00',
    action: 'Research Victorian dock maps',
    work: 'East London Heritage Archive',
    status: 'To do',
    priority: 4,
    date: '2025-05-09',
    notes: 'Cross-reference with 1884 hydrographic soundings.'
  },
  {
    id: 6,
    time: '14:00',
    action: 'Model turntable in Blender',
    work: 'Creature Concept Explorations',
    status: 'To do',
    priority: 2,
    date: '2025-05-09',
    notes: 'Set up 3-point neutral studio rim lighting.'
  },
  {
    id: 7,
    time: '15:30',
    action: 'Write journal entry',
    work: 'Daily Journal',
    status: 'To do',
    priority: 2,
    date: '2025-05-09',
    notes: 'Document typographic decisions and monospace contrast.'
  },
  {
    id: 8,
    time: '18:30',
    action: 'Backup local athenaeum.db',
    work: 'Local Vault Engine',
    status: 'To do',
    priority: 5,
    date: '2025-05-09',
    notes: 'Run SHA-256 verification and export tarball.'
  },
  {
    id: 9,
    time: '19:15',
    action: 'Inspect specimen cross-sections',
    work: 'Creature Concept Explorations',
    status: 'To do',
    priority: 3,
    date: '2025-05-09',
    notes: 'Examine chitin layer thickness under 40x magnification.'
  },

  // 3. Waiting (1 item)
  {
    id: 10,
    time: '17:00',
    action: 'Review photography shots',
    work: 'Photography Portfolio',
    status: 'Waiting',
    priority: 2,
    date: '2025-05-09',
    notes: 'Waiting for 800 ISO negative scans from darkroom.'
  },

  // 4. Completed (2 items)
  {
    id: 11,
    time: '10:00',
    action: 'Interview dockland oral historian',
    work: 'East London Heritage Archive',
    status: 'Completed',
    priority: 3,
    date: '2025-05-08',
    notes: 'Recorded 45-minute audio session with Arthur Pendelton.'
  },
  {
    id: 12,
    time: '16:00',
    action: 'Catalog Swiss typography specimens',
    work: 'Typographic Archive Catalog',
    status: 'Completed',
    priority: 2,
    date: '2025-05-08',
    notes: 'Filed 14 Berthold specimen sheets into folder B4.'
  }
];

export const INITIAL_ENTRIES = [
  {
    id: 1,
    date: '09 MAY 2025',
    time: '08:15',
    title: 'Project planning thoughts',
    category: 'Project Note',
    work: 'Athenaeum App Project',
    author: 'You',
    content: `Started working on the database structure and record model for Athenaeum. Feeling focused and productive.

Key principles to preserve:
1. Strict 1px borders with warm parchment surfaces against charcoal framing.
2. Uncompromising local-first operation with zero telemetry.
3. Tight monospace typography that rewards methodical indexing.

The interface should feel like an archival workstation found in a scientific institution in 1984, but running modern reactive primitives.`,
  },
  {
    id: 2,
    date: '08 MAY 2025',
    time: '21:42',
    title: 'Inspiration: Brutalist Interfaces',
    category: 'Idea',
    work: 'Athenaeum App Project',
    author: 'You',
    content: `Observations on brutalist information density:
Modern software often hides data behind excessive whitespace, rounded cards, and colorful gradients. 

In contrast, classical institutional systems (ordnance surveys, astronomical ledgers, library card catalogs) relied on strict tabular boundaries, small uppercase nomenclature, and high contrast data-to-ink ratios.`,
  },
  {
    id: 3,
    date: '08 MAY 2025',
    time: '17:30',
    title: 'Meeting notes with client',
    category: 'Meeting',
    work: 'East London Heritage Archive',
    author: 'Dr. Arthur Pendelton',
    content: `Discussed scope of the Limehouse Basin audio documentation.
Client requested high-priority archiving of dock gate worker logs from 1968-1974 before warehouse redevelopment.
Next milestone: Transcribe reel-to-reel tape #04.`,
  },
  {
    id: 4,
    date: '07 MAY 2025',
    time: '22:10',
    title: 'Research: Limehouse Basin',
    category: 'Research',
    work: 'East London Heritage Archive',
    author: 'You',
    content: `Archival findings at the Guildhall Library:
Located 1884 hydrographic soundings of the Regent's Canal entrance lock.
Elevation variances indicate deep silt accumulation during the winter freeze of 1881.`,
  },
  {
    id: 5,
    date: '07 MAY 2025',
    time: '14:00',
    title: 'Chitin joint mechanical tolerances',
    category: 'Research',
    work: 'Creature Concept Explorations',
    author: 'You',
    content: `Measured ball-and-socket joint clearances in Dynastinae femur articulations.
Observed self-lubricating micro-groove patterns suitable for hydraulic cylinder seals.`,
  },
  {
    id: 6,
    date: '06 MAY 2025',
    time: '11:20',
    title: 'Darkroom chemistry notes: HC-110 Dilution B',
    category: 'Project Note',
    work: 'Photography Portfolio',
    author: 'You',
    content: `Evaluated contrast curves for Ilford HP5+ shot in overcast architectural lighting.
Dilution B (1:31) at 20°C for 5 minutes yielded optimal shadow separation in concrete textures.`,
  },
  {
    id: 7,
    date: '06 MAY 2025',
    time: '09:00',
    title: 'Astrolabe rete star pointer coordinates',
    category: 'Research',
    work: 'Optical Astrolabe Reconstruction',
    author: 'You',
    content: `Right ascension and declination calculations for 22 principal navigation stars adjusted for 1580 epoch precession.`,
  },
  {
    id: 8,
    date: '05 MAY 2025',
    time: '16:45',
    title: 'Grid systems in DIN 1451 standard sheets',
    category: 'Idea',
    work: 'Typographic Archive Catalog',
    author: 'You',
    content: `Analysis of stroke-width uniformity in German industrial signage. Modular ratios ensure legibility at glancing angles.`,
  },
  {
    id: 9,
    date: '05 MAY 2025',
    time: '12:30',
    title: 'IndexedDB B-tree indexing strategies',
    category: 'Project Note',
    work: 'Local Vault Engine',
    author: 'You',
    content: `Composite key index schema: [recordType, updatedAt] enables sub-5ms range scans across 50,000 vault artifacts.`,
  },
  {
    id: 10,
    date: '04 MAY 2025',
    time: '20:15',
    title: 'Observations on dock crane counterweights',
    category: 'Research',
    work: 'East London Heritage Archive',
    author: 'You',
    content: `Stothert & Pitt hydraulic cranes installed at West India Quay in 1912 utilized gravity water accumulators.`,
  },
  {
    id: 11,
    date: '04 MAY 2025',
    time: '15:00',
    title: 'Orthographic projection errors in 18th century folios',
    category: 'Idea',
    work: 'East London Heritage Archive',
    author: 'You',
    content: `Identified 3.2 degree magnetic declination offset in John Rocque's 1746 survey of London.`,
  },
  {
    id: 12,
    date: '03 MAY 2025',
    time: '18:20',
    title: 'Monotype Univers 68 metal type specimen scan',
    category: 'Project Note',
    work: 'Typographic Archive Catalog',
    author: 'You',
    content: `Completed 2400 DPI flatbed scan of Adrian Frutiger's 1957 matrix matrix classification grid.`,
  },
  {
    id: 13,
    date: '03 MAY 2025',
    time: '10:45',
    title: 'Micro-lathe tolerance check on brass pivot pins',
    category: 'Project Note',
    work: 'Optical Astrolabe Reconstruction',
    author: 'You',
    content: `Achieved ±0.005mm concentricity on center arbor pin using carbide gravers and mineral cutting oil.`,
  },
  {
    id: 14,
    date: '02 MAY 2025',
    time: '21:00',
    title: 'Architectural shadows on Barbican estate facades',
    category: 'Idea',
    work: 'Photography Portfolio',
    author: 'You',
    content: `Equinox sunlight angles cast dramatic deep 45-degree shadow ribbons across the bush-hammered concrete columns.`,
  },
  {
    id: 15,
    date: '02 MAY 2025',
    time: '14:30',
    title: 'SQLite WAL mode checkpointing frequencies',
    category: 'Project Note',
    work: 'Local Vault Engine',
    author: 'You',
    content: `Configured pragma wal_autocheckpoint=1000 with PRAGMA synchronous=NORMAL for guaranteed crash resistance.`,
  },
  {
    id: 16,
    date: '01 MAY 2025',
    time: '19:15',
    title: 'Anatomical comparison of elytra wing covers',
    category: 'Research',
    work: 'Creature Concept Explorations',
    author: 'You',
    content: `Scanning electron microscopy reveals multilayer photonic crystals responsible for metallic green iridescence.`,
  },
  {
    id: 17,
    date: '01 MAY 2025',
    time: '14:22',
    title: 'Athenaeum vault charter and manifesto',
    category: 'Project Note',
    work: 'Athenaeum App Project',
    author: 'You',
    content: `Formalized the core institutional charter: durable, sovereign, offline-first personal knowledge repository.`,
  },
  {
    id: 18,
    date: '01 MAY 2025',
    time: '09:00',
    title: 'Initial cataloging setup and inventory ledger',
    category: 'Project Note',
    work: 'Athenaeum App Project',
    author: 'You',
    content: `Allocated initial physical shelf ranges and initialized digital UUID namespace generator.`,
  }
];

export const INITIAL_COLLECTION = {
  title: 'DESIGN INSPIRATIONS',
  itemCount: 24,
  items: ['specimen', 'blueprint', 'sketch', 'beetle'],
};

export const INITIAL_COLLECTIONS = [
  {
    id: 'col-1',
    title: 'DESIGN INSPIRATIONS',
    itemCount: 24,
    items: ['highlight_specimen', 'highlight_blueprint', 'highlight_sketch', 'beetle'],
    created: '09 May 2025',
    description: 'Curated board of institutional type specimens, drafting schematics, and botanical engravings.'
  },
  {
    id: 'col-2',
    title: 'LONDON MARITIME HISTORY',
    itemCount: 18,
    items: ['dockmap', 'blueprint', 'camera', 'highlight_specimen'],
    created: '04 May 2025',
    description: 'Historical hydrography, dock layouts, and harbor master ledgers from the Isle of Dogs.'
  },
  {
    id: 'col-3',
    title: 'BIOLOGICAL ARMATURES',
    itemCount: 32,
    items: ['beetle', 'creature', 'highlight_sketch', 'specimen'],
    created: '28 Apr 2025',
    description: 'Comparative anatomy plates, exoskeleton articulation diagrams, and functional insect morphology.'
  },
  {
    id: 'col-4',
    title: 'BRUTALIST ARCHITECTURE SURVEYS',
    itemCount: 42,
    items: ['camera', 'dockmap', 'blueprint', 'highlight_blueprint'],
    created: '15 Apr 2025',
    description: 'Medium format photographic documentation of post-war civic and residential concrete structures.'
  }
];

export const INITIAL_PEOPLE = [
  {
    id: 'p-1',
    name: 'Dr. Arthur Pendelton',
    role: 'Senior Archival Fellow',
    org: 'East London Historical Society',
    email: 'a.pendelton@docklands-archive.org.uk',
    worksCount: 3,
    status: 'Active',
    notes: 'Primary authority on 19th-century Thames merchant shipping manifests.'
  },
  {
    id: 'p-2',
    name: 'Elena Rostova',
    role: 'Master Lithographer & Conservator',
    org: 'St. Bride Foundation Typographic Vault',
    email: 'elena.rostova@stbride-typography.org',
    worksCount: 2,
    status: 'Active',
    notes: 'Specialist in cold metal Monotype preservation and wood type restoration.'
  },
  {
    id: 'p-3',
    name: 'Marcus Vance',
    role: 'Principal Instrument Restorer',
    org: 'Royal Observatory Horological Wing',
    email: 'm.vance@greenwich-astronomy.ac.uk',
    worksCount: 2,
    status: 'Consultant',
    notes: 'Fabricated replacement brass alidade for 1580 astrolabe study.'
  },
  {
    id: 'p-4',
    name: 'Sarah Chen',
    role: 'Curatorial Archivist',
    org: 'Barbican Architectural Heritage Trust',
    email: 's.chen@barbican-trust.org',
    worksCount: 1,
    status: 'Active',
    notes: 'Facilitating access to Chamberlin, Powell and Bon unbuilt blueprints.'
  },
  {
    id: 'p-5',
    name: 'Klaus Lindemann',
    role: 'Computational Ontologist',
    org: 'Zurich Archives of Cybernetic Systems',
    email: 'klaus@lindemann-cybernetics.ch',
    worksCount: 2,
    status: 'Collaborator',
    notes: 'Author of the decentralized archival replication protocol specification.'
  }
];

export const INITIAL_PLACES = [
  {
    id: 'plc-1',
    name: 'Limehouse Basin',
    coordinates: '51.5123° N, 0.0381° W',
    region: 'Tower Hamlets, London',
    recordsCount: 14,
    established: '1820',
    description: 'Major transshipment dock connecting the Regent Canal with the River Thames. Extensive 19th-century hydraulic infrastructure.'
  },
  {
    id: 'plc-2',
    name: 'Greenwich Observatory Crypt',
    coordinates: '51.4769° N, 0.0005° W',
    region: 'Greenwich Park, London',
    recordsCount: 8,
    established: '1675',
    description: 'Vault housing historical meridian transit circles and precision regulator clocks calibrated to mean solar time.'
  },
  {
    id: 'plc-3',
    name: 'St. Bride Printing Library Vault',
    coordinates: '51.5139° N, 0.1065° W',
    region: 'Fleet Street, London',
    recordsCount: 22,
    established: '1895',
    description: 'World-renowned repository of printing technology, punch-cutting matrices, and type specimen books.'
  },
  {
    id: 'plc-4',
    name: 'Barbican Estate Sub-Level B',
    coordinates: '51.5200° N, 0.0935° W',
    region: 'City of London',
    recordsCount: 9,
    established: '1968',
    description: 'Underground service tunnels and mechanical plant rooms featuring bush-hammered concrete formwork.'
  }
];

export const INITIAL_RESOURCES = [
  {
    id: 'res-1',
    title: 'Thames Basin Hydrographic Soundings (1884)',
    format: 'TIFF',
    size: '42.8 MB',
    locus: 'Vault Shelf B-12 / Cabinet 04',
    checksum: '0x9E77F12A',
    status: 'Mounted & Verified',
    updated: '08 May 2025'
  },
  {
    id: 'res-2',
    title: 'Adrian Frutiger Univers Grid System Folios',
    format: 'PDF',
    size: '15.4 MB',
    locus: 'Drawer T-08 / Specimen Binder 2',
    checksum: '0xA412D90C',
    status: 'Mounted & Verified',
    updated: '03 May 2025'
  },
  {
    id: 'res-3',
    title: 'Planispheric Astrolabe CAD Vector Schematics',
    format: 'DXF',
    size: '4.2 MB',
    locus: 'Digital Storage Array #01',
    checksum: '0x3C89B44E',
    status: 'Mounted & Verified',
    updated: '01 May 2025'
  },
  {
    id: 'res-4',
    title: 'Athenaeum Master WAL Storage Engine Schema',
    format: 'SQL',
    size: '32 KB',
    locus: 'Local Repository / System Store',
    checksum: '0x00F5BA11',
    status: 'Mounted & Verified',
    updated: '02 May 2025'
  },
  {
    id: 'res-5',
    title: 'Barbican Concrete Texture Negative Contact Sheet',
    format: 'JPEG',
    size: '8.2 MB',
    locus: 'Negative Binder P-2025-A',
    checksum: '0x7B992C1D',
    status: 'Mounted & Verified',
    updated: '05 May 2025'
  }
];

export const RECENT_VIEWS = [
  'East London Heritage Archive',
  'Athenaeum App Project',
  "Today's Actions",
  'Design Inspirations',
  'Reading List'
];
