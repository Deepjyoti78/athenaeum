import React, { useState } from 'react';
import { 
  Play, 
  Pause, 
  ExternalLink, 
  Volume2, 
  Headphones, 
  Newspaper, 
  Columns, 
  X,
  Share2,
  Bookmark,
  Menu
} from 'lucide-react';
import { useArchive } from '../context/ArchiveContext';

export function NewsView({ onInspectArticle }) {
  const { inspectRecord } = useArchive();
  // Default to 'spread' matching media_1793433150498_d39dfbc0.jpg
  const [activeEdition, setActiveEdition] = useState('spread'); // 'news' | 'science' | 'spread'
  const [isPlayingAudio1, setIsPlayingAudio1] = useState(false);
  const [isPlayingAudio2, setIsPlayingAudio2] = useState(false);
  const [activeArticleModal, setActiveArticleModal] = useState(null);

  const handleArticleClick = (article) => {
    setActiveArticleModal(article);
    if (inspectRecord) {
      inspectRecord('entry', {
        id: `gazette-${Date.now()}`,
        title: article.title,
        category: article.category || 'Gazette Dispatch',
        author: article.author || 'Gazette Staff',
        content: article.deck || article.content || 'Archival dispatch reprinted from The Athenæum Gazette / Tablet Magazine.',
        date: '09 MAY 2025',
        time: 'Morning Edition'
      });
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#181917] font-serif select-none overflow-hidden text-[#141512]">
      {/* 1. Gazette Sub-Toolbar */}
      <div className="bg-[#242522] border-b border-[#353630] px-4 py-1.5 flex items-center justify-between font-mono text-[9px] text-[#A6A498] flex-shrink-0">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1.5 font-semibold text-[#EDE8DB]">
            <Newspaper className="w-3.5 h-3.5 text-[#C8C4B4]" />
            <span className="uppercase tracking-widest text-[9.5px] font-bold">THE ATHENÆUM GAZETTE</span>
          </div>
          <span className="text-[#555]">•</span>
          <span className="text-[#888] font-medium">TABLET ARCHIVE EDITION • VOL. XLII • No. 104 • MAY 2025</span>
        </div>

        {/* Segmented View Switcher: P. 1 - NEWS | P. 2 - SCIENCE | FULL SPREAD */}
        <div className="flex items-center space-x-1 bg-[#141512] p-0.5 border border-[#3A3B34]">
          <button
            onClick={() => setActiveEdition('news')}
            className={`px-2.5 py-0.5 uppercase tracking-wider text-[8px] font-bold transition-colors ${
              activeEdition === 'news'
                ? 'bg-[#EAE6DC] text-[#141512]'
                : 'text-[#888] hover:text-[#EDE8DB]'
            }`}
          >
            P. 1 — NEWS
          </button>
          <button
            onClick={() => setActiveEdition('science')}
            className={`px-2.5 py-0.5 uppercase tracking-wider text-[8px] font-bold transition-colors ${
              activeEdition === 'science'
                ? 'bg-[#EAE6DC] text-[#141512]'
                : 'text-[#888] hover:text-[#EDE8DB]'
            }`}
          >
            P. 2 — SCIENCE
          </button>
          <button
            onClick={() => setActiveEdition('spread')}
            className={`px-3 py-0.5 uppercase tracking-wider text-[8px] font-bold transition-colors flex items-center space-x-1.5 ${
              activeEdition === 'spread'
                ? 'bg-[#EAE6DC] text-[#141512]'
                : 'text-[#888] hover:text-[#EDE8DB]'
            }`}
          >
            <Columns className="w-2.5 h-2.5" />
            <span>FULL SPREAD</span>
          </button>
        </div>
      </div>

      {/* 2. Main Broadsheet Scrolling Body */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-[#161715] flex justify-center items-start">
        <div className={`w-full transition-all duration-200 ${
          activeEdition === 'spread' 
            ? 'max-w-[1460px] grid grid-cols-1 xl:grid-cols-2 gap-6' 
            : 'max-w-[720px]'
        }`}>
          
          {/* ========================================================================= */}
          {/* PAGE 1: "NEWS" BROADSHEET                                                 */}
          {/* ========================================================================= */}
          {(activeEdition === 'news' || activeEdition === 'spread') && (
            <div className="relative flex">
              {/* Left Outer Edge Section Tab */}
              <div className="w-5 flex-shrink-0 bg-[#2A2B27] border-y border-l border-[#3E4038] flex flex-col items-center justify-center py-4 select-none">
                <span className="font-mono text-[7px] font-bold tracking-[0.25em] text-[#8C8B7E] uppercase -rotate-90 whitespace-nowrap">
                  SCIENCE
                </span>
              </div>

              {/* Page Sheet */}
              <article className="flex-1 bg-[#F5F2EA] border border-[#222] shadow-[0_20px_50px_rgba(0,0,0,0.6)] p-5 md:p-6 text-[#141512] flex flex-col justify-between">
                <div>
                  {/* Top Bar: Hamburger Menu & Tablet Logo */}
                  <div className="flex justify-between items-center pb-1">
                    <div className="w-4 h-3 flex flex-col justify-between cursor-pointer opacity-70 hover:opacity-100">
                      <span className="w-3.5 h-[1.5px] bg-[#222]"></span>
                      <span className="w-3.5 h-[1.5px] bg-[#222]"></span>
                      <span className="w-3.5 h-[1.5px] bg-[#222]"></span>
                    </div>
                    <div className="font-serif italic text-[11px] tracking-wide text-[#333]">
                      Tablet
                    </div>
                    <div className="w-4"></div>
                  </div>

                  {/* Big Masthead: NEWS */}
                  <div className="border-b border-[#222] pb-1.5 mb-2.5 text-center">
                    <h1 className="font-sans font-black text-[46px] md:text-[54px] uppercase tracking-[-0.03em] leading-none text-[#111]">
                      NEWS
                    </h1>
                  </div>

                  {/* 1. TOP HERO SECTION: Full-Width Bernie Sanders Photo + Full-Width Headline */}
                  <div className="border-b border-[#222] pb-3 mb-3">
                    {/* Bernie Sanders High-Contrast Black & White Wire Photo */}
                    <div 
                      onClick={() => handleArticleClick({
                        title: "Can Bernie Sanders Fix America's Broken Anti-Semitism Conversation?",
                        deck: "The presidential trailblazer just took a historic first step toward national dialogue with gentiles. But its success will depend on whether he's willing to confront some hard truths.",
                        author: "YAIR ROSENBERG",
                        category: "Lead Analysis"
                      })}
                      className="cursor-pointer group relative overflow-hidden bg-[#0A0A0A] border border-[#222] aspect-[16/9] w-full"
                    >
                      <svg viewBox="0 0 600 338" className="w-full h-full object-cover">
                        <defs>
                          <radialGradient id="bernieSpot" cx="50%" cy="40%" r="65%">
                            <stop offset="0%" stopColor="#7A786E" stopOpacity="0.45" />
                            <stop offset="60%" stopColor="#1E1E1B" stopOpacity="0.9" />
                            <stop offset="100%" stopColor="#080808" stopOpacity="1" />
                          </radialGradient>
                          <linearGradient id="bernieSuit" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#1A1B16" />
                            <stop offset="100%" stopColor="#0B0B09" />
                          </linearGradient>
                        </defs>
                        <rect width="600" height="338" fill="#080808" />
                        
                        {/* Dramatic Rim Spotlight */}
                        <circle cx="310" cy="180" r="180" fill="url(#bernieSpot)" />

                        {/* Dark Suit & Shoulders */}
                        <path d="M 120 338 C 160 250 230 235 310 235 C 390 235 460 250 500 338 Z" fill="url(#bernieSuit)" />
                        
                        {/* White Shirt Collar & Dark Necktie */}
                        <polygon points="310,235 285,290 310,338 335,290" fill="#E8E4DA" />
                        <polygon points="302,245 310,338 318,245" fill="#141412" />

                        {/* Head & Neck */}
                        <path d="M 235 175 C 230 85 390 85 385 175 C 380 235 240 235 235 175 Z" fill="#D9D4C7" />
                        
                        {/* Iconic Disheveled White Hair wisps around crown */}
                        <path d="M 225 160 C 215 90 250 55 310 52 C 370 55 405 90 395 160 C 385 85 235 85 225 160 Z" fill="#F4F2EC" opacity="0.9" />
                        <path d="M 218 135 C 210 110 235 95 245 115 Z" fill="#FAF9F5" opacity="0.8" />
                        <path d="M 402 135 C 410 110 385 95 375 115 Z" fill="#FAF9F5" opacity="0.8" />

                        {/* Wire Eyeglasses */}
                        <rect x="255" y="140" width="46" height="30" rx="6" fill="none" stroke="#111" strokeWidth="4" />
                        <rect x="319" y="140" width="46" height="30" rx="6" fill="none" stroke="#111" strokeWidth="4" />
                        <line x1="301" y1="152" x2="319" y2="152" stroke="#111" strokeWidth="3.5" />
                        {/* Lens Reflections */}
                        <line x1="262" y1="146" x2="285" y2="164" stroke="#FFF" strokeWidth="1.5" opacity="0.5" />
                        <line x1="326" y1="146" x2="349" y2="164" stroke="#FFF" strokeWidth="1.5" opacity="0.5" />

                        {/* Eyes, Furrowed Brow & Nose */}
                        <ellipse cx="278" cy="154" rx="3.5" ry="3" fill="#111" />
                        <ellipse cx="342" cy="154" rx="3.5" ry="3" fill="#111" />
                        <path d="M 258 135 Q 278 130 296 137" fill="none" stroke="#333" strokeWidth="2.5" />
                        <path d="M 324 137 Q 342 130 362 135" fill="none" stroke="#333" strokeWidth="2.5" />
                        <path d="M 308 152 L 314 184 L 302 188" fill="none" stroke="#222" strokeWidth="2.5" />

                        {/* Expressive Mouth and Jaw */}
                        <path d="M 285 208 Q 310 212 335 208" fill="none" stroke="#222" strokeWidth="3" />
                        <path d="M 292 216 Q 310 220 328 216" fill="none" stroke="#555" strokeWidth="1.5" />

                        {/* Authentic Broadsheet Halftone Grid Texture */}
                        {[...Array(24)].map((_, i) => (
                          <line key={i} x1="0" y1={i * 15} x2="600" y2={i * 15} stroke="#000" strokeWidth="0.5" opacity="0.15" />
                        ))}
                      </svg>
                    </div>

                    {/* Full-Width Headline + Deck */}
                    <div 
                      onClick={() => handleArticleClick({
                        title: "Can Bernie Sanders Fix America's Broken Anti-Semitism Conversation?",
                        deck: "The presidential trailblazer just took a historic first step toward national dialogue with gentiles. But its success will depend on whether he's willing to confront some hard truths.",
                        author: "YAIR ROSENBERG",
                        category: "Lead Analysis"
                      })}
                      className="cursor-pointer group pt-2.5 text-center"
                    >
                      <h2 className="font-serif font-bold text-[21px] md:text-[23px] leading-[1.18] tracking-tight text-[#111] group-hover:underline max-w-[620px] mx-auto">
                        Can Bernie Sanders Fix America's Broken Anti-Semitism Conversation?
                      </h2>
                      <p className="font-serif italic text-[9.5px] md:text-[10px] text-[#444] mt-1 max-w-[550px] mx-auto leading-relaxed">
                        The presidential trailblazer just took a historic first step toward national dialogue with gentiles. But its success will depend on whether he's willing to confront some hard truths.
                      </p>
                      <div className="font-mono text-[7px] font-bold uppercase tracking-widest text-[#777] mt-1">
                        BY YAIR ROSENBERG
                      </div>
                    </div>
                  </div>

                  {/* 2. MIDDLE SECTION: Left Main Column (Cancel Culture + 2 Sub-Columns) & Right Column (Featured Columnist + Election Dates + Dark Audio Widget) */}
                  <div className="grid grid-cols-12 gap-3.5 pb-3 border-b border-[#222]">
                    {/* Left 7 Columns (~58%) */}
                    <div className="col-span-7 border-r border-[#AAA99B] pr-3 flex flex-col justify-between">
                      <div>
                        {/* Protest Photo with Circle-Slash Graphic */}
                        <div 
                          onClick={() => handleArticleClick({
                            title: "The Real Problem With Cancel Culture",
                            deck: "It's not about celebrities. It's about losing trust in each other.",
                            author: "KAT ROSENFIELD",
                            category: "Culture"
                          })}
                          className="w-full aspect-[16/9] bg-[#1A1A18] border border-[#222] relative overflow-hidden mb-2 cursor-pointer group flex items-center justify-center"
                        >
                          <svg viewBox="0 0 320 180" className="w-full h-full object-cover">
                            <rect width="320" height="180" fill="#121210" />
                            {/* Crowd of protesters silhouette */}
                            <path d="M 0 180 C 30 110 50 130 90 180 Z" fill="#2E2E28" />
                            <path d="M 60 180 C 100 95 130 115 170 180 Z" fill="#3D3E35" />
                            <path d="M 140 180 C 180 100 210 110 250 180 Z" fill="#282822" />
                            <path d="M 220 180 C 260 105 280 120 320 180 Z" fill="#35362E" />
                            {/* Prominent Protest Placard Sign: Circle with diagonal slash 🚫 */}
                            <g transform="translate(160, 85)">
                              <circle cx="0" cy="0" r="48" fill="#F4F1EA" stroke="#111" strokeWidth="6" />
                              <circle cx="0" cy="0" r="38" fill="none" stroke="#111" strokeWidth="8" />
                              <line x1="-27" y1="-27" x2="27" y2="27" stroke="#111" strokeWidth="8" />
                            </g>
                            {/* Hands holding placard */}
                            <line x1="145" y1="135" x2="145" y2="180" stroke="#DDD" strokeWidth="5" />
                            <line x1="175" y1="135" x2="175" y2="180" stroke="#DDD" strokeWidth="5" />
                          </svg>
                        </div>

                        {/* Article Headline & Deck */}
                        <div 
                          onClick={() => handleArticleClick({
                            title: "The Real Problem With Cancel Culture",
                            deck: "It's not about celebrities. It's about losing trust in each other.",
                            author: "KAT ROSENFIELD",
                            category: "Culture"
                          })}
                          className="cursor-pointer group pb-2 border-b border-[#222]"
                        >
                          <h3 className="font-serif font-bold text-[14.5px] leading-tight text-[#111] group-hover:underline">
                            The Real Problem With Cancel Culture
                          </h3>
                          <p className="font-serif text-[8.5px] text-[#444] leading-relaxed mt-1">
                            It's not about celebrities. It's about losing trust in each other.
                          </p>
                          <div className="font-mono text-[6.5px] font-bold text-[#777] uppercase tracking-wider mt-1">
                            BY KAT ROSENFIELD
                          </div>
                        </div>

                        {/* 2 Sub-Columns under Cancel Culture */}
                        <div className="grid grid-cols-2 gap-2.5 pt-2">
                          {/* Sub-col 1: Doran + Election */}
                          <div className="border-r border-[#CCC7B8] pr-2 flex flex-col justify-between">
                            <div 
                              onClick={() => handleArticleClick({
                                title: "If Michael Doran Were on Wall Street, He'd Be a Billionaire",
                                deck: "Not living right in Washington has a price.",
                                author: "LEE SMITH",
                                category: "Analysis"
                              })}
                              className="cursor-pointer group pb-2 border-b border-[#D5D0C2]"
                            >
                              <h4 className="font-serif font-bold text-[10px] leading-tight text-[#111] group-hover:underline">
                                If Michael Doran Were on Wall Street, He'd Be a Billionaire
                              </h4>
                              <p className="font-serif text-[7.5px] text-[#555] leading-snug mt-0.5">
                                Not living right in Washington has a price.
                              </p>
                              <div className="font-mono text-[6px] text-[#888] uppercase tracking-wider mt-1">
                                BY LEE SMITH
                              </div>
                            </div>

                            <div 
                              onClick={() => handleArticleClick({
                                title: "Jews Could Swing the 2020 Election",
                                deck: "And why that's not a good thing",
                                author: "JOEL KOTKIN",
                                category: "Politics"
                              })}
                              className="cursor-pointer group pt-1.5"
                            >
                              <h4 className="font-serif font-bold text-[10px] leading-tight text-[#111] group-hover:underline">
                                Jews Could Swing the 2020 Election
                              </h4>
                              <p className="font-serif text-[7.5px] text-[#555] leading-snug mt-0.5">
                                And why that's not a good thing
                              </p>
                              <div className="font-mono text-[6px] text-[#888] uppercase tracking-wider mt-1">
                                BY JOEL KOTKIN
                              </div>
                            </div>
                          </div>

                          {/* Sub-col 2: Photo + The Revolt Against Iran */}
                          <div>
                            {/* Photo: Press Conference / Rally */}
                            <div className="w-full h-14 bg-[#181816] border border-[#222] mb-1.5 overflow-hidden">
                              <svg viewBox="0 0 140 70" className="w-full h-full opacity-80">
                                <rect width="140" height="70" fill="#121210" />
                                <rect x="30" y="20" width="80" height="40" fill="#2E2E2A" />
                                <circle cx="50" cy="25" r="7" fill="#C8C4B8" />
                                <circle cx="70" cy="22" r="8" fill="#D5D0C4" />
                                <circle cx="90" cy="26" r="7" fill="#B8B4A8" />
                                <rect x="40" y="38" width="60" height="32" fill="#1C1D18" />
                                <line x1="20" y1="15" x2="35" y2="40" stroke="#777" strokeWidth="1" />
                              </svg>
                            </div>

                            <div 
                              onClick={() => handleArticleClick({
                                title: "The Revolt Against Iran",
                                deck: "Iran's plans for regional hegemony depend on being seen as the protector of loyal Shia Muslims—but those are exactly the people leading mass protests against Iranian domination in Iraq and Lebanon.",
                                author: "HANIN GHADDAR",
                                category: "Middle East"
                              })}
                              className="cursor-pointer group"
                            >
                              <h4 className="font-serif font-bold text-[10px] leading-tight text-[#111] group-hover:underline">
                                The Revolt Against Iran
                              </h4>
                              <p className="font-serif text-[7px] text-[#555] leading-tight mt-0.5 line-clamp-3">
                                Iran's plans for regional hegemony depend on being seen as the protector of loyal Shia Muslims—but those are exactly the people leading mass protests against Iranian domination in Iraq and Lebanon.
                              </p>
                              <div className="font-mono text-[6px] text-[#888] uppercase tracking-wider mt-1">
                                BY HANIN GHADDAR
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right 5 Columns (~42%): Featured Columnist, Election Dates, Audio Player */}
                    <div className="col-span-5 flex flex-col justify-between space-y-2.5">
                      {/* Box 1: FEATURED COLUMNIST */}
                      <div className="bg-[#F7EBE6] border border-[#E0C4B8] p-2.5 text-center flex flex-col items-center">
                        <div className="font-mono text-[6.5px] font-bold uppercase tracking-widest text-[#B0452E] mb-1.5">
                          FEATURED COLUMNIST
                        </div>
                        {/* Reddish/Duotone Circle Avatar */}
                        <div className="w-13 h-13 rounded-full overflow-hidden border-2 border-[#B0452E]/60 bg-[#D48F7B]/30 flex items-center justify-center mb-1.5">
                          <svg viewBox="0 0 100 100" className="w-full h-full">
                            <rect width="100" height="100" fill="#E6A896" />
                            {/* Head & Beard */}
                            <circle cx="50" cy="42" r="22" fill="#B0452E" />
                            <path d="M 20 90 C 25 65 75 65 80 90 Z" fill="#8C3320" />
                            <path d="M 38 46 Q 50 64 62 46 Z" fill="#581F14" />
                            <circle cx="43" cy="40" r="2.5" fill="#FFF" />
                            <circle cx="57" cy="40" r="2.5" fill="#FFF" />
                          </svg>
                        </div>
                        <h4 className="font-serif font-bold text-[11px] text-[#141512]">
                          LIEL LEIBOVITZ
                        </h4>
                        <p className="font-serif text-[7.5px] text-[#555] leading-snug mt-0.5">
                          Liel Leibovitz is a senior writer for Tablet Magazine and co-host of the Unorthodox podcast.
                        </p>
                      </div>

                      {/* Box 2: UPCOMING ELECTION DATES */}
                      <div className="bg-[#F7EBE6] border border-[#E0C4B8] p-2 text-[7.5px] font-mono">
                        <div className="font-bold text-[6.5px] text-[#B0452E] uppercase tracking-wider mb-1">
                          UPCOMING ELECTION DATES
                        </div>
                        <div className="space-y-1 text-[#444] text-[7px] leading-tight">
                          <div><span className="font-bold text-[#141512]">Israel:</span> September 17, 2019</div>
                          <div><span className="font-bold text-[#141512]">United States:</span> November 3, 2020</div>
                          <div><span className="font-bold text-[#141512]">Poland:</span> May 10, 2020</div>
                          <div><span className="font-bold text-[#141512]">Canada:</span> October 21, 2019</div>
                        </div>
                      </div>

                      {/* Box 3: Dark Audio Player Widget */}
                      <div className="bg-[#181917] text-[#EDEAE2] p-2 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center space-x-1.5 text-[6.5px] font-mono font-bold tracking-wider uppercase text-[#C4C0B0]">
                            <Headphones className="w-2.5 h-2.5" />
                            <span>LISTEN TO TABLET</span>
                          </div>
                          <div className="font-serif font-bold text-[8.5px] leading-tight text-[#FAF8F3] mt-1">
                            The One With the Instagram Rabbi
                          </div>
                          <div className="text-[6.5px] font-mono text-[#AAA99B] leading-tight mt-0.5">
                            Episode 198: Theater legend Joel Grey on directing "Fiddler"
                          </div>
                        </div>

                        <div className="pt-1.5 flex items-center space-x-1.5">
                          <button 
                            onClick={() => setIsPlayingAudio1(!isPlayingAudio1)}
                            className="w-4 h-4 rounded-full bg-[#EAE6DC] text-[#141512] flex items-center justify-center flex-shrink-0 hover:bg-white"
                          >
                            {isPlayingAudio1 ? <Pause className="w-2 h-2" /> : <Play className="w-2 h-2 ml-0.5" />}
                          </button>
                          <div className="flex-1 bg-[#333] h-1 rounded-full overflow-hidden">
                            <div className={`bg-[#EAE6DC] h-full ${isPlayingAudio1 ? 'w-2/3 animate-pulse' : 'w-1/3'}`} />
                          </div>
                          <span className="text-[6px] font-mono text-[#AAA99B]">18:42</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 3. BOTTOM TIER: 4 Columns (Action, Synagogue, Malley, Huge 21 Stat) */}
                  <div className="grid grid-cols-12 gap-2.5 pt-2.5">
                    {/* Col 1 */}
                    <div 
                      onClick={() => handleArticleClick({
                        title: "A Year After Pittsburgh, Time for Action",
                        deck: "One year later, remembering the victims and confronting rising anti-Semitism in American communities.",
                        author: "CARLY PILDIS",
                        category: "Opinion"
                      })}
                      className="col-span-3 border-r border-[#CCC7B8] pr-2 cursor-pointer group"
                    >
                      <h4 className="font-serif font-bold text-[9px] leading-tight text-[#111] group-hover:underline">
                        A Year After Pittsburgh, Time for Action
                      </h4>
                      <div className="font-mono text-[6px] text-[#777] uppercase tracking-wider mt-1">
                        BY CARLY PILDIS
                      </div>
                    </div>

                    {/* Col 2 */}
                    <div 
                      onClick={() => handleArticleClick({
                        title: "It's Time to Lock Your Synagogue's Doors",
                        deck: "A pragmatic assessment of community security, vigilance and self-defense.",
                        author: "JASON SEGAL",
                        category: "Community"
                      })}
                      className="col-span-3 border-r border-[#CCC7B8] pr-2 cursor-pointer group"
                    >
                      <h4 className="font-serif font-bold text-[9px] leading-tight text-[#111] group-hover:underline">
                        It's Time to Lock Your Synagogue's Doors
                      </h4>
                      <div className="font-mono text-[6px] text-[#777] uppercase tracking-wider mt-1">
                        BY JASON SEGAL
                      </div>
                    </div>

                    {/* Col 3 */}
                    <div 
                      onClick={() => handleArticleClick({
                        title: "Malley in Wonderland",
                        deck: "An inside look at negotiations and the diplomatic illusions of the Middle East.",
                        author: "TONY BADRAN",
                        category: "Foreign Affairs"
                      })}
                      className="col-span-3 border-r border-[#CCC7B8] pr-2 cursor-pointer group"
                    >
                      <h4 className="font-serif font-bold text-[9px] leading-tight text-[#111] group-hover:underline">
                        Malley in Wonderland
                      </h4>
                      <div className="font-mono text-[6px] text-[#777] uppercase tracking-wider mt-1">
                        BY TONY BADRAN
                      </div>
                    </div>

                    {/* Col 4: Huge Bold Serif "21" */}
                    <div className="col-span-3 pl-1 text-center flex flex-col justify-center">
                      <div className="font-serif font-black text-[28px] leading-none text-[#141512]">
                        21
                      </div>
                      <div className="font-mono text-[6px] text-[#666] leading-tight mt-0.5">
                        2019 Anti-Semitic hate crimes in New York City
                      </div>
                    </div>
                  </div>

                </div>
              </article>
            </div>
          )}

          {/* ========================================================================= */}
          {/* PAGE 2: "SCIENCE" BROADSHEET                                              */}
          {/* ========================================================================= */}
          {(activeEdition === 'science' || activeEdition === 'spread') && (
            <div className="relative flex">
              {/* Inner Margin Tabs: BELIEF & IMAGE */}
              <div className="w-5 flex-shrink-0 bg-[#2A2B27] border-y border-l border-[#3E4038] flex flex-col items-center justify-between py-6 select-none">
                <span className="font-mono text-[6.5px] font-bold tracking-[0.2em] text-[#8C8B7E] uppercase -rotate-90 whitespace-nowrap">
                  IMAGE
                </span>
                <span className="font-mono text-[6.5px] font-bold tracking-[0.2em] text-[#C4C0B0] uppercase -rotate-90 whitespace-nowrap">
                  BELIEF
                </span>
              </div>

              {/* Page Sheet */}
              <article className="flex-1 bg-[#F5F2EA] border border-[#222] shadow-[0_20px_50px_rgba(0,0,0,0.6)] p-5 md:p-6 text-[#141512] flex flex-col justify-between">
                <div>
                  {/* Top Bar: Hamburger Menu & Tablet Logo */}
                  <div className="flex justify-between items-center pb-1">
                    <div className="w-4 h-3 flex flex-col justify-between cursor-pointer opacity-70 hover:opacity-100">
                      <span className="w-3.5 h-[1.5px] bg-[#222]"></span>
                      <span className="w-3.5 h-[1.5px] bg-[#222]"></span>
                      <span className="w-3.5 h-[1.5px] bg-[#222]"></span>
                    </div>
                    <div className="font-serif italic text-[11px] tracking-wide text-[#333]">
                      Tablet
                    </div>
                    <div className="w-4"></div>
                  </div>

                  {/* Big Masthead: SCIENCE */}
                  <div className="border-b border-[#222] pb-1.5 mb-2.5 text-center">
                    <h1 className="font-sans font-black text-[46px] md:text-[54px] uppercase tracking-[-0.03em] leading-none text-[#111]">
                      SCIENCE
                    </h1>
                  </div>

                  {/* 1. TOP TIER: Jewish Inventions, Chef Solomonov Photo + Beard Story, Yiddleaks & Venezuela */}
                  <div className="grid grid-cols-12 gap-3 pb-2.5 border-b border-[#222]">
                    {/* Left: JEWISH DISCOVERIES & INVENTIONS (~24%) */}
                    <div className="col-span-3 bg-[#F7EBE6] border border-[#E0C4B8] p-2 flex flex-col justify-between text-[7px] font-mono">
                      <div>
                        <div className="font-bold text-[6.5px] text-[#B0452E] uppercase tracking-wider mb-1 leading-tight">
                          JEWISH DISCOVERIES &amp; INVENTIONS
                        </div>
                        <p className="text-[6.5px] text-[#444] leading-tight mb-1.5">
                          <span className="font-bold text-[#111]">Daniel Nathans</span> was awarded the Nobel Prize in Physiology or Medicine in 1978 for the discovery of restriction enzymes.
                        </p>
                        {/* Reddish/coral circular biological cell diagram */}
                        <div className="w-full h-8 bg-[#EAC9BE]/40 border border-[#E0C4B8] my-1 flex items-center justify-center">
                          <svg viewBox="0 0 100 40" className="w-full h-full">
                            <circle cx="50" cy="20" r="14" fill="#B0452E" opacity="0.4" />
                            <circle cx="50" cy="20" r="7" fill="#8C3320" />
                            <path d="M 30 20 L 70 20" stroke="#FAF8F3" strokeWidth="1" strokeDasharray="2 2" />
                            <circle cx="36" cy="20" r="3" fill="#B0452E" />
                            <circle cx="64" cy="20" r="3" fill="#B0452E" />
                          </svg>
                        </div>
                        <p className="text-[6.5px] text-[#444] leading-tight mb-1">
                          Theodore Maiman demonstrated the first working laser on May 16, 1960.
                        </p>
                        <p className="text-[6.5px] text-[#444] leading-tight">
                          Paul Berg won the Nobel Prize in Chemistry in 1980 for recombinant DNA technology.
                        </p>
                      </div>
                    </div>

                    {/* Center: Chef Michael Solomonov Photo & James Beard Story (~48%) */}
                    <div className="col-span-5 px-1 flex flex-col justify-between">
                      <div 
                        onClick={() => handleArticleClick({
                          title: "Zahav Chef Michael Solomonov a Semifinalist for James Beard Award",
                          deck: "Tova du Plessis, the Jewish owner of South Philadelphia's Essen Bakery, has also been nominated for Outstanding Baker.",
                          author: "LILA FERNANDEZ",
                          category: "Culinary History"
                        })}
                        className="cursor-pointer group"
                      >
                        {/* Chef Portrait */}
                        <div className="w-full aspect-[16/10] bg-[#12130F] border border-[#222] relative overflow-hidden mb-1.5">
                          <svg viewBox="0 0 300 190" className="w-full h-full object-cover">
                            <defs>
                              <linearGradient id="chefLight" x1="0" y1="0" x2="1" y2="1">
                                <stop offset="0%" stopColor="#2A2B24" />
                                <stop offset="100%" stopColor="#0B0C0A" />
                              </linearGradient>
                            </defs>
                            <rect width="300" height="190" fill="url(#chefLight)" />
                            {/* Chef dark jacket & silhouette */}
                            <path d="M 70 190 C 90 120 210 120 230 190 Z" fill="#141412" />
                            {/* Head & Face */}
                            <ellipse cx="150" cy="85" rx="36" ry="44" fill="#DDD8CB" />
                            {/* Close-cropped salt-and-pepper hair */}
                            <path d="M 116 80 C 114 42 186 42 184 80 Z" fill="#7A786E" />
                            <path d="M 120 65 C 130 50 170 50 180 65 Z" fill="#A8A69C" opacity="0.7" />
                            {/* Thoughtful expression, stubble */}
                            <ellipse cx="138" cy="82" rx="3" ry="2" fill="#111" />
                            <ellipse cx="162" cy="82" rx="3" ry="2" fill="#111" />
                            <path d="M 148 84 L 152 102 L 144 105" fill="none" stroke="#333" strokeWidth="2" />
                            <path d="M 136 118 Q 150 120 164 118" fill="none" stroke="#222" strokeWidth="2.5" />
                            <rect x="130" y="105" width="40" height="22" rx="4" fill="#444" opacity="0.15" />
                          </svg>
                        </div>

                        <h3 className="font-serif font-bold text-[13.5px] leading-tight text-[#111] group-hover:underline">
                          Zahav Chef Michael Solomonov a Semifinalist for James Beard Award
                        </h3>
                        <p className="font-serif italic text-[7.5px] text-[#444] leading-relaxed mt-0.5">
                          Tova du Plessis, the Jewish owner of South Philadelphia's Essen Bakery, has also been nominated for Outstanding Baker.
                        </p>
                        <div className="font-mono text-[6px] text-[#777] uppercase tracking-wider mt-1">
                          BY LILA FERNANDEZ
                        </div>
                      </div>
                    </div>

                    {/* Right: Yiddleaks & Venezuela (~28%) */}
                    <div className="col-span-4 pl-2 border-l border-[#CCC7B8] flex flex-col justify-between space-y-2">
                      <div 
                        onClick={() => handleArticleClick({
                          title: "Yiddleaks: The Jeremy Corbyn Email Archive",
                          deck: "A trove of communications from Britain's Labour Party leader to his minions reveals the difference between a hipster and Hezbollah.",
                          author: "TABITHA GOLDRICK",
                          category: "Archive"
                        })}
                        className="cursor-pointer group pb-1.5 border-b border-[#D5D0C2]"
                      >
                        <h4 className="font-serif font-bold text-[9.5px] leading-tight text-[#111] group-hover:underline">
                          Yiddleaks: The Jeremy Corbyn Email Archive
                        </h4>
                        <p className="font-serif text-[7px] text-[#555] leading-tight mt-0.5">
                          A trove of communications from Britain's Labour Party leader to his minions reveals the difference between a hipster and Hezbollah.
                        </p>
                        <div className="font-mono text-[6px] text-[#888] uppercase tracking-wider mt-0.5">
                          BY TABITHA GOLDRICK
                        </div>
                      </div>

                      <div 
                        onClick={() => handleArticleClick({
                          title: "The Rabbi Who Helped Me Sneak Into Venezuela",
                          deck: "Weeks after security forces kicked me out of Venezuela, I was at the Colombian border with a rabbi I'd never met before and preparing for the dangerous journey back into the country.",
                          author: "ARIELA BERNSTEIN-ROTHSTEIN",
                          category: "Dispatch"
                        })}
                        className="cursor-pointer group"
                      >
                        <h4 className="font-serif font-bold text-[9.5px] leading-tight text-[#111] group-hover:underline">
                          The Rabbi Who Helped Me Sneak Into Venezuela
                        </h4>
                        <p className="font-serif text-[7px] text-[#555] leading-tight mt-0.5">
                          Weeks after security forces kicked me out of Venezuela, I was at the Colombian border with a rabbi preparing for the journey.
                        </p>
                        <div className="font-mono text-[6px] text-[#888] uppercase tracking-wider mt-0.5">
                          BY ARIELA BERNSTEIN-ROTHSTEIN
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bridge Row: Second Avenue Elevated & Judenrein Europe */}
                  <div className="grid grid-cols-12 gap-3 py-2 border-b border-[#222]">
                    <div className="col-span-3"></div>
                    <div 
                      onClick={() => handleArticleClick({
                        title: "Second Avenue Elevated",
                        deck: "Looking for tracks to my father's unobtainable past in old Jewish New York.",
                        author: "JONATHAN LEIBSON",
                        category: "Essay"
                      })}
                      className="col-span-5 px-1 cursor-pointer group"
                    >
                      <h4 className="font-serif font-bold text-[9px] leading-tight text-[#111] group-hover:underline">
                        Second Avenue Elevated
                      </h4>
                      <p className="font-serif text-[7px] text-[#555] leading-tight mt-0.5">
                        Looking for tracks to my father's unobtainable past in old Jewish New York.
                      </p>
                      <div className="font-mono text-[6px] text-[#888] uppercase tracking-wider mt-0.5">
                        BY JONATHAN LEIBSON
                      </div>
                    </div>

                    <div 
                      onClick={() => handleArticleClick({
                        title: "Judenrein Europe",
                        deck: "For millennia Europe was the center of diaspora life but as Jews continue fleeing the continent, by the end of that century all that's left will be a Jewish graveyard.",
                        author: "JAMES KIRCHICK",
                        category: "Analysis"
                      })}
                      className="col-span-4 pl-2 border-l border-[#CCC7B8] cursor-pointer group"
                    >
                      <h4 className="font-serif font-bold text-[9px] leading-tight text-[#111] group-hover:underline">
                        Judenrein Europe
                      </h4>
                      <p className="font-serif text-[7px] text-[#555] leading-tight mt-0.5">
                        For millennia Europe was the center of diaspora life but as Jews continue fleeing the continent, by the end of that century all that's left will be a graveyard.
                      </p>
                      <div className="font-mono text-[6px] text-[#888] uppercase tracking-wider mt-0.5">
                        BY JAMES KIRCHICK
                      </div>
                    </div>
                  </div>

                  {/* 2. MIDDLE CENTERPIECE: Isometric Maze Cube ("Can Islam Be More Jewish?") + Lost Wisdom & Audio */}
                  <div className="grid grid-cols-12 gap-3.5 py-3 border-b border-[#222]">
                    {/* Left Centerpiece Artwork & Headline (~65%) */}
                    <div className="col-span-8 pr-2 border-r border-[#AAA99B] text-center flex flex-col items-center justify-between">
                      <div 
                        onClick={() => handleArticleClick({
                          title: "Can Islam Be More Jewish?",
                          deck: "Two faiths, the Jewish owner of South Philadelphia's Essen Bakery, has also been nominated for Outstanding Baker.",
                          author: "ELI COHEN",
                          category: "Theology & Ideas"
                        })}
                        className="cursor-pointer group w-full flex flex-col items-center"
                      >
                        {/* Prominent High-Contrast Isometric Labyrinth Cube */}
                        <div className="w-36 h-36 bg-[#EBE7DC] border-2 border-[#141512] flex items-center justify-center p-2.5 my-1 shadow-md">
                          <svg viewBox="0 0 200 200" className="w-full h-full">
                            {/* Cube Outer Shell */}
                            <polygon points="100,10 185,58 185,152 100,195 15,152 15,58" fill="#F5F2EA" stroke="#141512" strokeWidth="4.5" strokeLinejoin="round" />
                            {/* Center Edges */}
                            <line x1="100" y1="100" x2="100" y2="195" stroke="#141512" strokeWidth="4.5" />
                            <line x1="100" y1="100" x2="185" y2="58" stroke="#141512" strokeWidth="4.5" />
                            <line x1="100" y1="100" x2="15" y2="58" stroke="#141512" strokeWidth="4.5" />
                            
                            {/* Top Face Labyrinth Geometry */}
                            <path d="M 100 22 L 135 42 L 120 50 L 100 38 L 80 50 L 65 42 Z" fill="#141512" />
                            <path d="M 100 68 L 155 37 L 165 43 L 110 75 Z" fill="#141512" />
                            <path d="M 45 37 L 100 68 L 90 75 L 35 43 Z" fill="#141512" />
                            <path d="M 100 82 L 140 59 L 148 64 L 100 92 L 52 64 L 60 59 Z" fill="#141512" />

                            {/* Right Face Labyrinth Geometry */}
                            <path d="M 112 110 L 172 76 L 172 136 L 158 128 L 158 98 L 112 124 Z" fill="#141512" />
                            <path d="M 125 132 L 125 168 L 112 176 L 112 140 Z" fill="#141512" />
                            <path d="M 142 122 L 142 158 L 155 150 L 155 114 Z" fill="#141512" />

                            {/* Left Face Labyrinth Geometry */}
                            <path d="M 88 110 L 28 76 L 28 136 L 42 128 L 42 98 L 88 124 Z" fill="#141512" />
                            <path d="M 75 132 L 75 168 L 88 176 L 88 140 Z" fill="#141512" />
                            <path d="M 58 122 L 58 158 L 45 150 L 45 114 Z" fill="#141512" />
                          </svg>
                        </div>

                        <h3 className="font-serif font-bold text-[18px] md:text-[20px] leading-tight text-[#111] group-hover:underline mt-1.5">
                          Can Islam Be More Jewish?
                        </h3>
                        <p className="font-serif italic text-[8.5px] text-[#444] leading-relaxed max-w-[420px] mt-0.5">
                          Two faiths, the Jewish owner of South Philadelphia's Essen Bakery, has also been nominated for Outstanding Baker.
                        </p>
                        <div className="font-mono text-[6.5px] text-[#777] uppercase tracking-wider mt-1">
                          BY ELI COHEN
                        </div>
                      </div>
                    </div>

                    {/* Right: Lost Wisdom + Audio Widget (~35%) */}
                    <div className="col-span-4 flex flex-col justify-between space-y-2">
                      {/* Box 1: LOST WISDOM */}
                      <div className="bg-[#F7EBE6] border border-[#E0C4B8] p-2.5 text-center">
                        <div className="font-mono text-[6.5px] font-bold uppercase tracking-widest text-[#B0452E] mb-1">
                          LOST WISDOM
                        </div>
                        <p className="font-serif italic text-[8px] text-[#333] leading-snug">
                          "The purpose of education is not to fill the mind, but to teach one to think."
                        </p>
                        <div className="font-mono text-[6px] uppercase tracking-wider text-[#666] mt-0.5">
                          — HANNAH ARENDT
                        </div>
                        <div className="font-mono text-[5.5px] text-[#888] mt-0.5">
                          The Brain: A User's Catalog
                        </div>

                        <div className="border-t border-[#E0C4B8] pt-1.5 mt-1.5">
                          <div className="font-serif font-bold text-[22px] text-[#141512] leading-none">
                            20,800
                          </div>
                          <div className="font-mono text-[6px] text-[#666] mt-0.5 leading-tight">
                            Artifacts digitized this year across 12 collections.
                          </div>
                        </div>
                      </div>

                      {/* Box 2: Dark Audio Player */}
                      <div className="bg-[#181917] text-[#EDEAE2] p-2 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center space-x-1.5 text-[6.5px] font-mono font-bold tracking-wider uppercase text-[#C4C0B0]">
                            <Headphones className="w-2.5 h-2.5" />
                            <span>LISTEN TO TABLET</span>
                          </div>
                          <div className="font-serif font-bold text-[8.5px] leading-tight text-[#FAF8F3] mt-1">
                            The One With the Instagram Rabbi
                          </div>
                          <div className="text-[6.5px] font-mono text-[#AAA99B] leading-tight mt-0.5">
                            Episode 195: Theater legend Joel Grey on directing "Fiddler"
                          </div>
                        </div>

                        <div className="pt-1.5 flex items-center space-x-1.5">
                          <button 
                            onClick={() => setIsPlayingAudio2(!isPlayingAudio2)}
                            className="w-4 h-4 rounded-full bg-[#EAE6DC] text-[#141512] flex items-center justify-center flex-shrink-0 hover:bg-white"
                          >
                            {isPlayingAudio2 ? <Pause className="w-2 h-2" /> : <Play className="w-2 h-2 ml-0.5" />}
                          </button>
                          <div className="flex-1 bg-[#333] h-1 rounded-full overflow-hidden">
                            <div className={`bg-[#EAE6DC] h-full ${isPlayingAudio2 ? 'w-3/4 animate-pulse' : 'w-1/4'}`} />
                          </div>
                          <span className="text-[6px] font-mono text-[#AAA99B]">15:27</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 3. BOTTOM TIER: Jewish Nobel Laureate, Censorship Game/Paltrow, Papers Please (4 Screens) */}
                  <div className="grid grid-cols-12 gap-3 pt-2.5">
                    {/* Col 1: JEWISH NOBEL LAUREATE (~22%) */}
                    <div className="col-span-3 bg-[#F7EBE6] border border-[#E0C4B8] p-2 flex flex-col items-center text-center justify-between">
                      <div>
                        <div className="font-mono text-[6px] font-bold uppercase tracking-widest text-[#B0452E] mb-1">
                          JEWISH NOBEL LAUREATE
                        </div>
                        {/* Circular Engraving Avatar of Tobias Asser */}
                        <div className="w-10 h-10 rounded-full overflow-hidden border border-[#B0452E]/50 bg-[#E8C5BA] mx-auto mb-1 flex items-center justify-center">
                          <svg viewBox="0 0 80 80" className="w-full h-full">
                            <circle cx="40" cy="40" r="40" fill="#E2B1A2" />
                            <circle cx="40" cy="32" r="16" fill="#8C3320" />
                            <path d="M 15 75 C 20 50 60 50 65 75 Z" fill="#581F14" />
                            {/* White sideburns / mustache */}
                            <path d="M 32 38 Q 40 44 48 38 Z" fill="#F5F2EA" />
                          </svg>
                        </div>
                        <h5 className="font-serif font-bold text-[8.5px] text-[#141512]">
                          TOBIAS ASSER
                        </h5>
                        <p className="font-serif text-[6.5px] text-[#555] leading-snug mt-0.5">
                          For his work in the field of private international law and the Hague Conference.
                        </p>
                      </div>
                    </div>

                    {/* Col 2: Wolfenstache & Gwyneth Paltrow (~38%) */}
                    <div className="col-span-4 border-r border-[#CCC7B8] pr-2 flex flex-col justify-between">
                      <div className="flex space-x-2 pb-1.5 border-b border-[#D5D0C2]">
                        {/* Small Photo: Man with Mustache */}
                        <div className="w-12 h-12 flex-shrink-0 bg-[#161713] border border-[#222] overflow-hidden">
                          <svg viewBox="0 0 60 60" className="w-full h-full">
                            <rect width="60" height="60" fill="#1B1C17" />
                            <circle cx="30" cy="25" r="14" fill="#C8C4B8" />
                            <rect x="25" y="27" width="10" height="4" fill="#111" />
                            <path d="M 15 55 C 20 40 40 40 45 55 Z" fill="#2E3028" />
                          </svg>
                        </div>
                        <div 
                          onClick={() => handleArticleClick({
                            title: "Mocking German Censorship, Israelis Develop Video Game with A Menacing Villain: Hitler's Mustache",
                            deck: "'Wolfenstache' is the first-person shooter you need right now.",
                            author: "ARNONA HERSHKOVITZ",
                            category: "Culture"
                          })}
                          className="cursor-pointer group flex-1"
                        >
                          <h5 className="font-serif font-bold text-[8.5px] leading-tight text-[#111] group-hover:underline">
                            Mocking German Censorship: Hitler's Mustache
                          </h5>
                          <p className="font-serif text-[6.5px] text-[#555] leading-tight mt-0.5">
                            'Wolfenstache' is the shooter you need right now.
                          </p>
                          <div className="font-mono text-[5.5px] text-[#888] uppercase tracking-wider mt-0.5">
                            BY ARNONA HERSHKOVITZ
                          </div>
                        </div>
                      </div>

                      <div 
                        onClick={() => handleArticleClick({
                          title: "Hating Gwyneth Paltrow",
                          deck: "You may think you know where this culture is going. You'd be wrong.",
                          author: "TABITHA GOLDRICK",
                          category: "Culture"
                        })}
                        className="cursor-pointer group pt-1"
                      >
                        <h5 className="font-serif font-bold text-[8.5px] leading-tight text-[#111] group-hover:underline">
                          Hating Gwyneth Paltrow
                        </h5>
                        <p className="font-serif text-[6.5px] text-[#555] leading-tight mt-0.5">
                          You may think you know where this culture is going. You'd be wrong.
                        </p>
                        <div className="font-mono text-[5.5px] text-[#888] uppercase tracking-wider mt-0.5">
                          BY TABITHA GOLDRICK
                        </div>
                      </div>
                    </div>

                    {/* Col 3: PAPERS, PLEASE with 4-Monitor Vintage CRT Grid (~40%) */}
                    <div className="col-span-5 flex flex-col justify-between">
                      {/* 2x2 Grid of 4 CRT Game Screenshots */}
                      <div className="grid grid-cols-2 gap-1 mb-1.5">
                        {/* Monitor 1: Checkpoint Guard Post */}
                        <div className="aspect-[4/3] bg-[#0E100D] border border-[#222] p-0.5 relative overflow-hidden">
                          <svg viewBox="0 0 100 75" className="w-full h-full">
                            <rect width="100" height="75" fill="#141812" />
                            {/* Wire fence & guard tower */}
                            <line x1="0" y1="50" x2="100" y2="50" stroke="#3E4536" strokeWidth="1.5" />
                            <line x1="20" y1="20" x2="20" y2="60" stroke="#5E6556" strokeWidth="2" />
                            <rect x="15" y="15" width="10" height="10" fill="#2E3328" />
                            <circle cx="70" cy="45" r="4" fill="#A8B09C" />
                          </svg>
                        </div>

                        {/* Monitor 2: Inspector Booth & Document Desk */}
                        <div className="aspect-[4/3] bg-[#0E100D] border border-[#222] p-0.5 relative overflow-hidden">
                          <svg viewBox="0 0 100 75" className="w-full h-full">
                            <rect width="100" height="75" fill="#181B15" />
                            <rect x="15" y="25" width="45" height="35" fill="#D2CCC0" stroke="#111" strokeWidth="1" />
                            <circle cx="28" cy="38" r="6" fill="#444" />
                            <line x1="38" y1="35" x2="52" y2="35" stroke="#333" strokeWidth="1" />
                            <line x1="38" y1="42" x2="52" y2="42" stroke="#333" strokeWidth="1" />
                            {/* Entry Denied Stamp */}
                            <rect x="25" y="48" width="22" height="7" fill="#B0452E" />
                          </svg>
                        </div>

                        {/* Monitor 3: Ministry Rulebook & Clock */}
                        <div className="aspect-[4/3] bg-[#0E100D] border border-[#222] p-0.5 relative overflow-hidden">
                          <svg viewBox="0 0 100 75" className="w-full h-full">
                            <rect width="100" height="75" fill="#12140F" />
                            <polygon points="15,20 50,15 50,60 15,65" fill="#C5BFB0" />
                            <polygon points="50,15 85,20 85,65 50,60" fill="#DAD4C6" />
                            <circle cx="50" cy="35" r="8" fill="#3E4536" />
                          </svg>
                        </div>

                        {/* Monitor 4: Checkpoint Gate Barrier */}
                        <div className="aspect-[4/3] bg-[#0E100D] border border-[#222] p-0.5 relative overflow-hidden">
                          <svg viewBox="0 0 100 75" className="w-full h-full">
                            <rect width="100" height="75" fill="#161913" />
                            <line x1="10" y1="45" x2="90" y2="45" stroke="#C84832" strokeWidth="3" strokeDasharray="6 4" />
                            <rect x="75" y="30" width="12" height="30" fill="#3D4236" />
                            <circle cx="81" cy="25" r="3" fill="#D2CCC0" />
                          </svg>
                        </div>
                      </div>

                      {/* Story Headline & Deck */}
                      <div 
                        onClick={() => handleArticleClick({
                          title: "Papers, Please: A Video Game With No Shootouts or Theft—Only the Banality of Evil",
                          deck: "How a simple border checkpoint simulator became one of the most powerful political games of the decade.",
                          author: "LIEL LEIBOVITZ",
                          category: "Games & Culture"
                        })}
                        className="cursor-pointer group"
                      >
                        <h5 className="font-serif font-bold text-[8.5px] leading-tight text-[#111] group-hover:underline">
                          Papers, Please: A Video Game With No Shootouts or Theft—Only the Banality of Evil
                        </h5>
                        <p className="font-serif text-[6.5px] text-[#555] leading-tight mt-0.5">
                          How a simple border checkpoint simulator became one of the most powerful political games of the decade.
                        </p>
                        <div className="font-mono text-[5.5px] text-[#888] uppercase tracking-wider mt-0.5">
                          BY LIEL LEIBOVITZ
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </article>

              {/* Right Outer Edge Section Tab */}
              <div className="w-5 flex-shrink-0 bg-[#2A2B27] border-y border-r border-[#3E4038] flex flex-col items-center justify-center py-4 select-none">
                <span className="font-mono text-[7px] font-bold tracking-[0.25em] text-[#8C8B7E] uppercase rotate-90 whitespace-nowrap">
                  NEWS
                </span>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* 3. Archival Reader Inspection Modal */}
      {activeArticleModal && (
        <div 
          onClick={() => setActiveArticleModal(null)}
          className="fixed inset-0 bg-black/75 backdrop-blur-[2px] z-50 flex items-center justify-center p-4"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-[#F5F2EA] border-2 border-[#141512] shadow-2xl max-w-xl w-full p-6 text-[#141512] font-serif space-y-4 animate-scaleUp"
          >
            <div className="flex justify-between items-center border-b border-[#AAA99B] pb-2 font-mono text-[8px] text-[#666]">
              <span className="uppercase tracking-widest font-bold text-[#141512]">
                GAZETTE ARCHIVAL DISPATCH
              </span>
              <button 
                onClick={() => setActiveArticleModal(null)}
                className="hover:text-black font-bold uppercase tracking-wider text-[9px]"
              >
                ✕ CLOSE
              </button>
            </div>

            <div>
              <span className="text-[8px] font-mono font-bold uppercase tracking-wider text-[#B0452E]">
                {activeArticleModal.category || 'Gazette Dispatch'}
              </span>
              <h2 className="font-serif font-bold text-[22px] leading-tight text-[#141512] mt-1">
                {activeArticleModal.title}
              </h2>
              <div className="text-[8.5px] font-mono text-[#666] uppercase tracking-wider mt-1.5 pb-2 border-b border-[#D5D0C2]">
                BY {activeArticleModal.author || 'Gazette Staff'} • MAY 2025 EDITION
              </div>
            </div>

            <p className="font-serif italic text-[12px] text-[#333] leading-relaxed">
              {activeArticleModal.deck}
            </p>

            <div className="text-[9.5px] font-serif text-[#444] leading-relaxed space-y-2 pt-2 border-t border-[#D5D0C2]">
              <p>
                Reprinted from the morning edition of The Athenæum Gazette / Tablet Magazine archive. This archival record has been automatically cataloged and synchronized with your active personal knowledge repository.
              </p>
              <p>
                Full transcription, high-resolution wire photography, and critical historical annotations are preserved in the local IndexedDB vault under the corresponding record reference.
              </p>
            </div>

            <div className="pt-3 border-t border-[#AAA99B] flex justify-between items-center font-mono text-[8px] text-[#777]">
              <span>INDEXED IN VAULT: LOCAL DISPATCH</span>
              <button
                onClick={() => setActiveArticleModal(null)}
                className="px-3 py-1 bg-[#141512] text-[#EAE6DC] font-bold uppercase tracking-wider hover:bg-[#25251F]"
              >
                RETURN TO BROADSHEET
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}