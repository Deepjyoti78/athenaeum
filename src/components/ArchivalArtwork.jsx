import React from 'react';

export function ArchivalArtwork({ type, className = "w-full h-full object-cover" }) {
  // 1. Blueprint / Technical UI Schematic (Athenaeum App Project)
  if (type === 'blueprint' || type === 'highlight_blueprint') {
    return (
      <div className={`relative bg-[#0E1310] text-[#7A9E7E] overflow-hidden flex items-center justify-center font-mono ${className}`}>
        {/* Subtle grid background */}
        <div 
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(#5C7A60 1px, transparent 1px), linear-gradient(90deg, #5C7A60 1px, transparent 1px)`,
            backgroundSize: '8px 8px'
          }}
        />
        <svg viewBox="0 0 300 150" className="w-full h-full opacity-95 p-1 select-none">
          {/* Outer dashed engineering frame */}
          <rect x="6" y="6" width="288" height="138" fill="none" stroke="#2D4632" strokeWidth="0.8" strokeDasharray="3 2" />
          
          {/* Main wireframe windows */}
          <rect x="14" y="14" width="70" height="122" fill="#121814" stroke="#486C4E" strokeWidth="0.8" />
          <rect x="92" y="14" width="136" height="74" fill="#141D17" stroke="#5A8862" strokeWidth="0.8" />
          <rect x="92" y="94" width="136" height="42" fill="#111613" stroke="#3D5A43" strokeWidth="0.8" />
          <rect x="236" y="14" width="50" height="122" fill="#121814" stroke="#486C4E" strokeWidth="0.8" />

          {/* Oscilloscope trend curve in center panel */}
          <path d="M 102 62 L 120 38 L 138 52 L 158 28 L 180 56 L 202 36 L 218 48" fill="none" stroke="#87D393" strokeWidth="1.4" />
          <circle cx="120" cy="38" r="2.2" fill="#B2F0BC" />
          <circle cx="158" cy="28" r="2.2" fill="#B2F0BC" />
          <circle cx="180" cy="56" r="2.2" fill="#B2F0BC" />
          <circle cx="218" cy="48" r="2.2" fill="#B2F0BC" />

          {/* Left panel schematics rows */}
          {[...Array(9)].map((_, i) => (
            <line key={`l-${i}`} x1="20" y1={25 + i * 12} x2={20 + (i % 3 === 0 ? 56 : i % 2 === 0 ? 46 : 38)} y2={25 + i * 12} stroke="#324B36" strokeWidth="1" />
          ))}

          {/* Bottom data bars */}
          <rect x="100" y="106" width="16" height="22" fill="#2D4D34" />
          <rect x="122" y="102" width="16" height="26" fill="#3D6846" />
          <rect x="144" y="98" width="16" height="30" fill="#5A8F64" />
          <rect x="166" y="108" width="16" height="20" fill="#2D4D34" />
          <rect x="188" y="100" width="16" height="28" fill="#487552" />

          {/* Labels & Coordinates */}
          <text x="98" y="24" fill="#7EBB86" fontSize="6.5" fontWeight="bold">ATHENAEUM_KERNEL_V1</text>
          <text x="242" y="24" fill="#4D7453" fontSize="6">INSPECTOR</text>
          <text x="20" y="130" fill="#4D7453" fontSize="6">SYS_BUS: 0x9A</text>
          <text x="175" y="130" fill="#7EBB86" fontSize="6">DATA_INTEGRITY: OK</text>
        </svg>
      </div>
    );
  }

  // 2. Vintage 1884 Thames Dock Map (East London Heritage Archive)
  if (type === 'dockmap') {
    return (
      <div className={`relative bg-[#D2CCBC] text-[#343126] overflow-hidden flex items-center justify-center font-mono ${className}`}>
        <svg viewBox="0 0 300 150" className="w-full h-full opacity-90 p-1 select-none">
          {/* Survey grid lines */}
          <g stroke="#BCB5A4" strokeWidth="0.5" strokeDasharray="2 3">
            {[...Array(15)].map((_, i) => <line key={`h-${i}`} x1="0" y1={i * 10} x2="300" y2={i * 10} />)}
            {[...Array(30)].map((_, i) => <line key={`v-${i}`} x1={i * 10} y1="0" x2={i * 10} y2="150" />)}
          </g>

          {/* Winding River Thames channel */}
          <path
            d="M -5,115 C 65,110 85,40 150,50 C 220,60 230,130 305,120 L 305,155 L -5,155 Z"
            fill="#B1ABA0"
            stroke="#4A4537"
            strokeWidth="1.2"
          />

          {/* Sounding depth contours */}
          <path d="M 25,125 Q 55,120 85,124" stroke="#6C6758" strokeWidth="0.6" strokeDasharray="3 2" fill="none" />
          <path d="M 125,70 Q 155,64 185,72" stroke="#6C6758" strokeWidth="0.6" strokeDasharray="3 2" fill="none" />
          <path d="M 235,118 Q 265,112 295,118" stroke="#6C6758" strokeWidth="0.6" strokeDasharray="3 2" fill="none" />

          {/* Dock Basins & Quays */}
          <rect x="72" y="24" width="28" height="40" fill="#DDD7C8" stroke="#3F3C31" strokeWidth="1" />
          <rect x="108" y="16" width="36" height="26" fill="#DDD7C8" stroke="#3F3C31" strokeWidth="1" />
          <rect x="166" y="20" width="46" height="30" fill="#DDD7C8" stroke="#3F3C31" strokeWidth="1" />
          <rect x="186" y="78" width="36" height="20" fill="#DDD7C8" stroke="#3F3C31" strokeWidth="1" />

          {/* Street / Railway lines */}
          <line x1="15" y1="20" x2="70" y2="38" stroke="#6E695B" strokeWidth="0.8" />
          <line x1="20" y1="52" x2="70" y2="58" stroke="#6E695B" strokeWidth="0.8" />
          <line x1="145" y1="12" x2="166" y2="32" stroke="#6E695B" strokeWidth="0.8" />
          <line x1="215" y1="20" x2="275" y2="48" stroke="#6E695B" strokeWidth="0.8" />
          <line x1="225" y1="70" x2="285" y2="90" stroke="#6E695B" strokeWidth="0.8" />

          {/* Archival Typography Labels */}
          <text x="150" y="95" fill="#3B372D" fontSize="7.5" fontWeight="bold" fontFamily="serif" fontStyle="italic" textAnchor="middle">
            RIVER THAMES
          </text>
          <text x="86" y="42" fill="#4B473A" fontSize="5.5" fontFamily="monospace" textAnchor="middle">
            LIMEHOUSE
          </text>
          <text x="189" y="36" fill="#4B473A" fontSize="5.5" fontFamily="monospace" textAnchor="middle">
            WEST INDIA DOCKS
          </text>

          {/* Compass Rose */}
          <g transform="translate(265, 24)">
            <circle cx="0" cy="0" r="10" fill="none" stroke="#5C5749" strokeWidth="0.5" strokeDasharray="1 2" />
            <line x1="0" y1="-12" x2="0" y2="12" stroke="#333026" strokeWidth="0.8" />
            <line x1="-12" y1="0" x2="12" y2="0" stroke="#333026" strokeWidth="0.8" />
            <polygon points="0,-12 2,-4 0,-7 -2,-4" fill="#333026" />
            <text x="0" y="-14" fill="#333026" fontSize="5" fontWeight="bold" textAnchor="middle">N</text>
          </g>
        </svg>
      </div>
    );
  }

  // 3. Da Vinci Sketchbook Studies (Creature Concept Explorations)
  if (type === 'creature' || type === 'highlight_sketch') {
    return (
      <div className={`relative bg-[#D6CFBE] text-[#343026] overflow-hidden flex items-center justify-center font-mono ${className}`}>
        <svg viewBox="0 0 300 150" className="w-full h-full opacity-90 p-1 select-none">
          {/* Central notebook crease */}
          <line x1="150" y1="0" x2="150" y2="150" stroke="#9A9280" strokeWidth="0.8" />
          <line x1="151" y1="0" x2="151" y2="150" stroke="#E6DFD2" strokeWidth="0.5" opacity="0.6" />

          {/* Proportion grid circles */}
          <circle cx="75" cy="72" r="46" fill="none" stroke="#A8A190" strokeWidth="0.4" strokeDasharray="2 2" />
          <circle cx="225" cy="72" r="46" fill="none" stroke="#A8A190" strokeWidth="0.4" strokeDasharray="2 2" />

          {/* Left: Arthropod Biomechanical Anatomy */}
          <g transform="translate(75, 75)" stroke="#383226" strokeWidth="1" fill="none" strokeLinecap="round">
            <ellipse cx="0" cy="-45" rx="5" ry="6.5" fill="#BFB7A3" />
            <path d="M -2,-52 Q -12,-60 -18,-58" strokeWidth="0.8" />
            <path d="M 2,-52 Q 12,-60 18,-58" strokeWidth="0.8" />
            {/* Thorax */}
            <path d="M -8,-38 C -12,-24 -10,-14 0,-9 C 10,-14 12,-24 8,-38 Z" fill="#BAAF9A" />
            <line x1="-7" y1="-30" x2="7" y2="-30" strokeWidth="0.6" />
            <line x1="-8" y1="-21" x2="8" y2="-21" strokeWidth="0.6" />
            {/* Abdomen */}
            <ellipse cx="0" cy="14" rx="9" ry="18" fill="#B1A58F" />
            <line x1="-8" y1="4" x2="8" y2="4" strokeWidth="0.6" />
            <line x1="-9" y1="11" x2="9" y2="11" strokeWidth="0.6" />
            <line x1="-8" y1="18" x2="8" y2="18" strokeWidth="0.6" />
            {/* Limbs */}
            <path d="M -8,-30 Q -36,-44 -44,-20 Q -38,6 -20,2" strokeWidth="0.9" />
            <path d="M 8,-30 Q 36,-44 44,-20 Q 38,6 20,2" strokeWidth="0.9" />
            <path d="M -6,22 L -16,44 L -22,64" strokeWidth="1" />
            <path d="M 6,22 L 16,44 L 22,64" strokeWidth="1" />
          </g>

          {/* Right: Winged Vertebra / Avian Armature */}
          <g transform="translate(225, 75)" stroke="#383226" strokeWidth="1" fill="none" strokeLinecap="round">
            <circle cx="0" cy="-44" r="6" fill="#BFB7A3" />
            <path d="M -8,-34 Q 0,-26 8,-34 L 6,-12 Q 0,-7 -6,-12 Z" fill="#BAAF9A" />
            <line x1="0" y1="-34" x2="0" y2="28" strokeWidth="1.2" />
            <path d="M -7,-30 C -26,-60 -54,-40 -60,-10 C -48,-5 -26,-15 -8,-18" strokeWidth="1" fill="#C2BAA7" fillOpacity="0.4" />
            <path d="M 7,-30 C 26,-60 54,-40 60,-10 C 48,-5 26,-15 8,-18" strokeWidth="1" fill="#C2BAA7" fillOpacity="0.4" />
            <path d="M -5,-10 L -12,28 L -10,64" strokeWidth="1" />
            <path d="M 5,-10 L 12,28 L 10,64" strokeWidth="1" />
          </g>

          {/* Italian Renaissance Manuscript Annotations */}
          <g fill="#534D3E" fontSize="5.5" fontFamily="serif" fontStyle="italic">
            <text x="14" y="20">Tab. IV — Articulorum ratio</text>
            <text x="14" y="28">nervorum et segmentorum</text>
            <text x="162" y="20">Tab. V — Sceleton alatum</text>
            <text x="162" y="28">analogia vespertilionis</text>
            <text x="150" y="142" textAnchor="middle" fontStyle="normal" fontSize="5" fontFamily="monospace">
              LEONARDO • CODEX BIOLOGICA 1884
            </text>
          </g>
        </svg>
      </div>
    );
  }

  // 4. Vintage Leica Rangefinder Camera (Photography Portfolio)
  if (type === 'camera') {
    return (
      <div className={`relative bg-[#C5BFB0] text-[#1E1D19] overflow-hidden flex items-center justify-center font-mono ${className}`}>
        <svg viewBox="0 0 300 150" className="w-full h-full opacity-95 p-1 select-none">
          {/* Soft shadow */}
          <ellipse cx="150" cy="132" rx="90" ry="10" fill="#989282" opacity="0.5" />

          {/* Camera Main Body */}
          <rect x="65" y="46" width="170" height="76" rx="5" fill="#1C1B17" stroke="#3D3B33" strokeWidth="1.5" />
          {/* Vulcanite leatherette textured band */}
          <rect x="68" y="58" width="164" height="60" rx="2" fill="#161512" stroke="#2B2923" strokeWidth="0.8" />
          
          {/* Chrome top deck plate */}
          <path d="M 65 48 Q 65 44 70 44 L 230 44 Q 235 44 235 48 L 235 58 L 65 58 Z" fill="#9E9889" stroke="#3D3B33" strokeWidth="1" />

          {/* Dials on top deck */}
          <rect x="80" y="38" width="22" height="7" rx="1" fill="#757062" stroke="#3D3B33" strokeWidth="0.8" />
          <rect x="110" y="39" width="16" height="6" rx="1" fill="#757062" stroke="#3D3B33" strokeWidth="0.8" />
          <rect x="200" y="36" width="20" height="9" rx="1" fill="#888273" stroke="#3D3B33" strokeWidth="0.8" />

          {/* Viewfinder & Rangefinder windows */}
          <rect x="82" y="47" width="14" height="8" rx="1" fill="#243038" stroke="#161E22" strokeWidth="0.8" />
          <rect x="112" y="48" width="8" height="6" rx="1" fill="#243038" stroke="#161E22" strokeWidth="0.8" />
          <rect x="214" y="47" width="12" height="8" rx="1" fill="#243038" stroke="#161E22" strokeWidth="0.8" />

          {/* Centered 50mm Summicron Lens Assembly */}
          <circle cx="150" cy="85" r="32" fill="#2B2923" stroke="#484439" strokeWidth="2" />
          <circle cx="150" cy="85" r="27" fill="#1C1B17" stroke="#635E50" strokeWidth="1.5" />
          <circle cx="150" cy="85" r="22" fill="#15191C" stroke="#3D3B33" strokeWidth="1.5" />
          
          {/* Optical Glass Lens Elements with Violet/Cyan Anti-Reflective Coating */}
          <circle cx="150" cy="85" r="16" fill="#1A242B" />
          <ellipse cx="145" cy="80" rx="8" ry="4" fill="#3D5A6C" opacity="0.6" transform="rotate(-30 145 80)" />
          <ellipse cx="154" cy="90" rx="5" ry="2.5" fill="#587A8C" opacity="0.4" transform="rotate(-30 154 90)" />
          <circle cx="143" cy="78" r="1.8" fill="#FFFFFF" opacity="0.7" />

          {/* Lens text engraving */}
          <text x="150" y="60" fill="#9A9484" fontSize="4.5" fontFamily="monospace" textAnchor="middle">
            LEICA 50mm f/2.0
          </text>
        </svg>
      </div>
    );
  }

  // 5. Engraved Beetle / Entomological Specimen
  if (type === 'beetle' || type === 'highlight_specimen') {
    return (
      <div className={`relative bg-[#D6D0C0] text-[#2F2C24] overflow-hidden flex items-center justify-center font-mono ${className}`}>
        <svg viewBox="0 0 100 100" className="w-full h-full opacity-90 p-1 select-none">
          <ellipse cx="50" cy="88" rx="22" ry="4" fill="#A8A292" opacity="0.5" />
          <g transform="translate(50, 48)" stroke="#302C23" strokeWidth="1" fill="none" strokeLinecap="round">
            {/* Head & Antennae */}
            <ellipse cx="0" cy="-28" rx="4" ry="5" fill="#BDB5A2" />
            <path d="M -2,-32 Q -10,-42 -14,-40" strokeWidth="0.8" />
            <path d="M 2,-32 Q 10,-42 14,-40" strokeWidth="0.8" />
            {/* Pronotum */}
            <path d="M -8,-23 C -11,-14 -9,-8 0,-5 C 9,-8 11,-14 8,-23 Z" fill="#B3A994" />
            {/* Elytra (Wing Cases) */}
            <path d="M 0,-5 C -14,-2 -15,18 -8,30 C -2,34 0,34 0,34 Z" fill="#A49982" />
            <path d="M 0,-5 C 14,-2 15,18 8,30 C 2,34 0,34 0,34 Z" fill="#A49982" />
            <line x1="0" y1="-5" x2="0" y2="34" strokeWidth="0.8" />
            {/* Legs */}
            <path d="M -6,-16 L -18,-24 L -24,-18" strokeWidth="0.8" />
            <path d="M 6,-16 L 18,-24 L 24,-18" strokeWidth="0.8" />
            <path d="M -8,-8 L -22,-6 L -26,10" strokeWidth="0.8" />
            <path d="M 8,-8 L 22,-6 L 26,10" strokeWidth="0.8" />
            <path d="M -6,14 L -18,26 L -20,38" strokeWidth="0.8" />
            <path d="M 6,14 L 18,26 L 20,38" strokeWidth="0.8" />
          </g>
          <text x="50" y="96" fill="#585244" fontSize="4.5" fontFamily="serif" fontStyle="italic" textAnchor="middle">
            Dynastes hercules
          </text>
        </svg>
      </div>
    );
  }

  // Fallback: Minimalist geometric archival plate
  return (
    <div className={`relative bg-[#D0CABE] text-[#3A372E] overflow-hidden flex items-center justify-center font-mono ${className}`}>
      <svg viewBox="0 0 100 100" className="w-full h-full opacity-80 p-2">
        <rect x="8" y="8" width="84" height="84" fill="none" stroke="#666152" strokeWidth="0.8" strokeDasharray="2 2" />
        <circle cx="50" cy="50" r="28" fill="none" stroke="#484438" strokeWidth="1" />
        <line x1="20" y1="50" x2="80" y2="50" stroke="#484438" strokeWidth="0.8" />
        <line x1="50" y1="20" x2="50" y2="80" stroke="#484438" strokeWidth="0.8" />
        <text x="50" y="92" fill="#5E594B" fontSize="5" textAnchor="middle">ARCHIVAL SPECIMEN</text>
      </svg>
    </div>
  );
}
