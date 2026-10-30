import React, { useState } from 'react';
import { 
  Volume2, 
  Play, 
  Pause, 
  ExternalLink, 
  BookOpen, 
  Calendar, 
  Clock, 
  Share2, 
  Maximize2, 
  Columns, 
  FileText,
  Bookmark,
  ArrowRight,
  Sparkles,
  Newspaper
} from 'lucide-react';
import { useArchive } from '../context/ArchiveContext';

export function NewsView({ onInspectArticle }) {
  const { inspectRecord } = useArchive();
  // View mode: 'news' (page 1) | 'science' (page 2) | 'spread' (both side by side!)
  const [activeEdition, setActiveEdition] = useState('news');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [activeArticleModal, setActiveArticleModal] = useState(null);

  const handleArticleClick = (article) => {
    setActiveArticleModal(article);
    if (inspectRecord) {
      inspectRecord('entry', {
        id: `gazette-${Date.now()}`,
        title: article.title,
        category: article.category || 'Gazette Dispatch',
        author: article.author,
        content: article.content || article.deck,
        date: '09 MAY 2025',
        time: 'Morning Edition'
      });
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#E3DFD2] font-serif select-none overflow-hidden">
      {/* Editorial Sub-header Controls */}
      <div className="bg-[#DDD8CB] border-b border-[#AAA99B] px-4 py-1.5 flex items-center justify-between font-mono text-[9px] text-[#444238] flex-shrink-0">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1.5 font-semibold text-[#1C1E18]">
            <Newspaper className="w-3.5 h-3.5 text-[#555]" />
            <span className="uppercase tracking-widest text-[9.5px]">THE ATHENÆUM GAZETTE</span>
          </div>
          <span className="text-[#888]">•</span>
          <span className="text-[#666]">VOL. XLII • No. 104 • FRIDAY, MAY 9, 2025</span>
        </div>

        {/* Page / Spread Mode Selector */}
        <div className="flex items-center space-x-1 bg-[#D2CCBD] p-0.5 border border-[#AAA99B]">
          <button
            onClick={() => setActiveEdition('news')}
            className={`px-2 py-0.5 uppercase tracking-wider text-[8px] font-semibold transition-colors ${
              activeEdition === 'news'
                ? 'bg-[#1C1E18] text-[#E9E5D8]'
                : 'text-[#555] hover:text-black'
            }`}
          >
            P. 1 — NEWS
          </button>
          <button
            onClick={() => setActiveEdition('science')}
            className={`px-2 py-0.5 uppercase tracking-wider text-[8px] font-semibold transition-colors ${
              activeEdition === 'science'
                ? 'bg-[#1C1E18] text-[#E9E5D8]'
                : 'text-[#555] hover:text-black'
            }`}
          >
            P. 2 — SCIENCE
          </button>
          <button
            onClick={() => setActiveEdition('spread')}
            className={`px-2.5 py-0.5 uppercase tracking-wider text-[8px] font-semibold transition-colors flex items-center space-x-1 ${
              activeEdition === 'spread'
                ? 'bg-[#1C1E18] text-[#E9E5D8]'
                : 'text-[#555] hover:text-black'
            }`}
          >
            <Columns className="w-2.5 h-2.5" />
            <span>FULL SPREAD</span>
          </button>
        </div>
      </div>

      {/* Main Newspaper Broadsheet Scrolling Body */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-[#D8D2C2] flex justify-center">
        <div className={`w-full transition-all duration-200 ${activeEdition === 'spread' ? 'max-w-[1380px] grid grid-cols-1 lg:grid-cols-2 gap-6' : 'max-w-[680px]'}`}>
          
          {/* ========================================================================= */}
          {/* PAGE 1: "NEWS" BROADSHEET                                                 */}
          {/* ========================================================================= */}
          {(activeEdition === 'news' || activeEdition === 'spread') && (
            <article className="bg-[#EAE6DC] border border-[#222] shadow-xl p-5 md:p-7 relative text-[#1C1E18] flex flex-col justify-between">
              {/* Margin Rotated Section Tabs */}
              <div className="absolute -left-3.5 top-28 -rotate-90 origin-top-left text-[6.5px] font-mono uppercase tracking-widest text-[#777] bg-[#EAE6DC] px-1.5 py-0.5 border border-[#AAA99B]">
                SCIENCE
              </div>
              <div className="absolute -right-3 top-28 rotate-90 origin-top-right text-[6.5px] font-mono uppercase tracking-widest text-[#777] bg-[#EAE6DC] px-1.5 py-0.5 border border-[#AAA99B]">
                BELIEF
              </div>

              <div>
                {/* Top Tiny Masthead */}
                <div className="text-center pb-1">
                  <span className="font-serif italic text-[11px] text-[#444] tracking-wide">
                    Tablet
                  </span>
                </div>

                {/* Main Heavy All-Caps Section Header */}
                <div className="border-y-2 border-[#1C1E18] py-1 mb-4 text-center">
                  <h1 className="font-sans font-black text-[38px] md:text-[44px] uppercase tracking-[-0.03em] leading-none text-[#141512]">
                    NEWS
                  </h1>
                </div>

                {/* HERO LEAD STORY */}
                <div 
                  onClick={() => handleArticleClick({
                    title: "Can Bernie Sanders Fix America's Broken Anti-Semitism Conversation?",
                    deck: "The presidential trailblazer just took a historic first step toward national dialogue with Zionists. But its success will depend on whether he's willing to confront some hard truths.",
                    author: "YAIR ROSENBERG",
                    category: "Lead Analysis"
                  })}
                  className="cursor-pointer group pb-4 border-b border-[#222]"
                >
                  {/* High Contrast Monochrome Portrait */}
                  <div className="w-full h-64 md:h-72 bg-[#1C1E18] overflow-hidden mb-3 relative border border-[#333]">
                    <svg viewBox="0 0 500 320" className="w-full h-full object-cover">
                      {/* Grain / Noise Filter */}
                      <defs>
                        <radialGradient id="vignette" cx="50%" cy="40%" r="65%">
                          <stop offset="0%" stopColor="#D2CEBF" stopOpacity="0.9" />
                          <stop offset="60%" stopColor="#4A473D" stopOpacity="0.95" />
                          <stop offset="100%" stopColor="#0E0F0D" stopOpacity="1" />
                        </radialGradient>
                      </defs>
                      <rect width="500" height="320" fill="url(#vignette)" />
                      {/* High-contrast stylized lithograph face */}
                      <g fill="#1A1B17" opacity="0.9">
                        <circle cx="250" cy="120" r="75" fill="#E4DFC8" />
                        <path d="M 175 140 Q 250 170 325 140 Q 320 280 180 280 Z" fill="#20221E" />
                        {/* Eyeglasses */}
                        <rect x="200" y="105" width="40" height="26" rx="4" fill="none" stroke="#111" strokeWidth="4" />
                        <rect x="260" y="105" width="40" height="26" rx="4" fill="none" stroke="#111" strokeWidth="4" />
                        <line x1="240" y1="116" x2="260" y2="116" stroke="#111" strokeWidth="3" />
                        {/* Hair and details */}
                        <path d="M 160 110 C 170 60 330 60 340 110 C 320 70 180 70 160 110 Z" fill="#EAE5D4" />
                        <path d="M 180 260 L 250 320 L 320 260 L 340 320 L 160 320 Z" fill="#0C0D0B" />
                        {/* Newspaper halftone raster dots */}
                        {[...Array(20)].map((_, r) => (
                          <line key={r} x1="0" y1={r * 16} x2="500" y2={r * 16} stroke="#000" strokeWidth="0.8" opacity="0.15" />
                        ))}
                      </g>
                    </svg>
                    <div className="absolute bottom-1 right-1.5 bg-[#1C1E18]/80 text-[#EAE6DC] font-mono text-[6.5px] px-1 py-0.5 uppercase tracking-wider">
                      ARCHIVAL WIRE PHOTO / AP
                    </div>
                  </div>

                  {/* Headline */}
                  <h2 className="font-serif text-[21px] md:text-[23px] font-bold text-[#141512] leading-[1.15] tracking-tight group-hover:underline text-center px-1">
                    Can Bernie Sanders Fix America's Broken Anti-Semitism Conversation?
                  </h2>

                  {/* Subdeck */}
                  <p className="font-serif italic text-[10px] md:text-[10.5px] text-[#444] text-center leading-relaxed mt-2 max-w-[540px] mx-auto">
                    The presidential trailblazer just took a historic first step toward national dialogue with Zionists. But its success will depend on whether he's willing to confront some hard truths.
                  </p>

                  {/* Byline */}
                  <div className="text-center font-mono text-[7.5px] uppercase tracking-widest text-[#666] font-semibold mt-2">
                    BY YAIR ROSENBERG
                  </div>
                </div>

                {/* MIDDLE TWO-COLUMN GRID */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 pt-3 pb-3 border-b border-[#222]">
                  {/* Left Column (Approx 60%) */}
                  <div className="md:col-span-7 space-y-3.5 pr-0 md:pr-2 md:border-r border-[#AAA99B]">
                    {/* Story A: Cancel Culture Graphic Box */}
                    <div 
                      onClick={() => handleArticleClick({
                        title: "The Real Problem With Cancel Culture",
                        deck: "It's not about celebrities. It's about losing trust in each other.",
                        author: "KAT ROSENFIELD",
                        category: "Cultural Essay"
                      })}
                      className="cursor-pointer group flex space-x-3 items-center border-b border-[#D5D0C2] pb-2.5"
                    >
                      {/* Circle-Slash Symbol Box */}
                      <div className="w-16 h-16 bg-[#D8D2C2] border border-[#222] flex items-center justify-center flex-shrink-0">
                        <svg viewBox="0 0 60 60" className="w-11 h-11">
                          <circle cx="30" cy="30" r="22" fill="none" stroke="#222" strokeWidth="5" />
                          <line x1="14" y1="14" x2="46" y2="46" stroke="#222" strokeWidth="5" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-serif font-bold text-[13px] leading-snug group-hover:underline">
                          The Real Problem With Cancel Culture
                        </h3>
                        <p className="font-serif text-[8.5px] text-[#555] italic leading-tight mt-0.5">
                          It's not about celebrities. It's about losing trust in each other.
                        </p>
                        <span className="font-mono text-[6.5px] uppercase tracking-wider text-[#777] block mt-1">
                          BY KAT ROSENFIELD
                        </span>
                      </div>
                    </div>

                    {/* Story B & C: Mini Column Pairs */}
                    <div className="grid grid-cols-2 gap-2.5 text-[8.5px] border-b border-[#D5D0C2] pb-2.5">
                      <div 
                        onClick={() => handleArticleClick({
                          title: "If Michael Doran Were on Wall Street, He'd Be a Billionaire",
                          deck: "Not being right in Washington has a price",
                          author: "LEE SMITH",
                          category: "Policy"
                        })}
                        className="cursor-pointer group"
                      >
                        <h4 className="font-serif font-bold text-[10px] leading-snug group-hover:underline">
                          If Michael Doran Were on Wall Street, He'd Be a Billionaire
                        </h4>
                        <p className="font-serif italic text-[7.5px] text-[#666] mt-0.5">
                          Not being right in Washington has a price
                        </p>
                        <span className="font-mono text-[6px] uppercase tracking-wider text-[#888] block mt-1">
                          BY LEE SMITH
                        </span>
                      </div>

                      <div 
                        onClick={() => handleArticleClick({
                          title: "Jews Could Swing the 2020 Election",
                          deck: "And why that's not a good thing",
                          author: "JOEL KOTKIN",
                          category: "Demographics"
                        })}
                        className="cursor-pointer group pl-2 border-l border-[#D5D0C2]"
                      >
                        <h4 className="font-serif font-bold text-[10px] leading-snug group-hover:underline">
                          Jews Could Swing the 2020 Election
                        </h4>
                        <p className="font-serif italic text-[7.5px] text-[#666] mt-0.5">
                          And why that's not a good thing
                        </p>
                        <span className="font-mono text-[6px] uppercase tracking-wider text-[#888] block mt-1">
                          BY JOEL KOTKIN
                        </span>
                      </div>
                    </div>

                    {/* Story D: Revolt Photo Story */}
                    <div 
                      onClick={() => handleArticleClick({
                        title: "The Revolt Against Iran",
                        deck: "Iran's plans for regional hegemony depend on being seen as the protector of loyal Shia Muslims—but those are exactly the people leading mass protests against Iranian domination in Iraq and Lebanon.",
                        author: "GLORIA KATI",
                        category: "Foreign Dispatch"
                      })}
                      className="cursor-pointer group"
                    >
                      <div className="w-full h-24 bg-[#1C1E18] overflow-hidden mb-1.5 relative border border-[#444]">
                        <svg viewBox="0 0 300 120" className="w-full h-full">
                          <rect width="300" height="120" fill="#151713" />
                          {/* Fiery torches and crowd silhouettes */}
                          <circle cx="90" cy="50" r="28" fill="#D38A4A" opacity="0.6" filter="blur(8px)" />
                          <circle cx="210" cy="40" r="34" fill="#D38A4A" opacity="0.5" filter="blur(8px)" />
                          <path d="M 20,120 L 60,85 L 90,95 L 130,80 L 170,92 L 210,75 L 260,90 L 300,120 Z" fill="#0A0B09" />
                          {[...Array(12)].map((_, i) => (
                            <circle key={i} cx={40 + i * 20} cy={80 + (i % 3) * 6} r="4" fill="#0A0B09" />
                          ))}
                        </svg>
                      </div>
                      <h4 className="font-serif font-bold text-[11px] leading-snug group-hover:underline">
                        The Revolt Against Iran
                      </h4>
                      <p className="font-serif text-[7.5px] text-[#555] leading-relaxed mt-0.5 line-clamp-2">
                        Iran's plans for regional hegemony depend on being seen as the protector of loyal Shia Muslims—but those are exactly the people leading mass protests against Iranian domination in Iraq and Lebanon.
                      </p>
                      <span className="font-mono text-[6.5px] uppercase tracking-wider text-[#777] block mt-1">
                        BY GLORIA KATI
                      </span>
                    </div>
                  </div>

                  {/* Right Column (Approx 40%) */}
                  <div className="md:col-span-5 space-y-3">
                    {/* Module 1: Featured Columnist in Terracotta Tinted Box */}
                    <div className="bg-[#EFE5DC] border border-[#BC7B62] p-2.5 text-center relative">
                      <div className="font-mono uppercase tracking-widest text-[6.5px] text-[#A64B32] font-bold mb-1.5">
                        FEATURED COLUMNIST
                      </div>
                      {/* Circular Duotone Red/Sepia Avatar */}
                      <div className="w-14 h-14 mx-auto rounded-full bg-[#BC7B62] border border-[#A64B32] overflow-hidden mb-1.5 p-0.5">
                        <svg viewBox="0 0 60 60" className="w-full h-full rounded-full">
                          <circle cx="30" cy="30" r="30" fill="#E6C8BC" />
                          <circle cx="30" cy="24" r="12" fill="#8C3822" />
                          <path d="M 10,54 Q 30,36 50,54 Z" fill="#8C3822" />
                        </svg>
                      </div>
                      <div className="font-serif font-bold text-[11px] text-[#2C1812] uppercase tracking-wide">
                        LIEL LEIBOVITZ
                      </div>
                      <p className="font-serif italic text-[7px] text-[#633A2E] leading-relaxed mt-1">
                        Liel Leibovitz is a senior writer for Tablet Magazine and co-host of the Unorthodox podcast.
                      </p>
                    </div>

                    {/* Module 2: Upcoming Dates Schedule */}
                    <div className="border border-[#AAA99B] bg-[#E5DFD1] p-2 font-mono text-[7px] text-[#444]">
                      <div className="text-[6.5px] uppercase tracking-widest text-[#777] font-bold pb-1 border-b border-[#C2BCAE] mb-1">
                        UPCOMING ELECTION DATES
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span className="font-semibold text-[#222]">Israel:</span>
                          <span>September 17, 2019</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-semibold text-[#222]">United States:</span>
                          <span>November 3, 2020</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-semibold text-[#222]">Poland:</span>
                          <span>May 10, 2020</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-semibold text-[#222]">Canada:</span>
                          <span>October 21, 2019</span>
                        </div>
                      </div>
                    </div>

                    {/* Module 3: Dark Audio Dispatch Player ("LISTEN TO TABLET") */}
                    <div className="bg-[#141512] text-[#EAE6DC] p-2.5 border border-[#333] font-mono">
                      <div className="text-[6.5px] uppercase tracking-widest text-[#888] font-semibold flex items-center justify-between pb-1 border-b border-[#2C2E28] mb-1.5">
                        <span>LISTEN TO TABLET</span>
                        <Volume2 className="w-2.5 h-2.5 text-[#738A62]" />
                      </div>
                      <div className="flex items-start space-x-2">
                        <button
                          onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                          className="w-6 h-6 rounded-full bg-[#738A62] text-black flex items-center justify-center flex-shrink-0 mt-0.5 hover:scale-105 transition-transform"
                          title={isPlayingAudio ? "Pause Audio Dispatch" : "Play Audio Dispatch"}
                        >
                          {isPlayingAudio ? <Pause className="w-3 h-3 fill-current" /> : <Play className="w-3 h-3 fill-current ml-0.5" />}
                        </button>
                        <div>
                          <div className="font-serif font-bold text-[9px] text-[#EAE6DC] leading-tight">
                            The One With the Instagram Rabbi
                          </div>
                          <div className="text-[6.5px] text-[#888] mt-0.5 leading-snug">
                            Episode 195: Theater legend Joel Grey on directing 'Fiddler'
                          </div>
                          <div className="text-[6px] text-[#738A62] mt-1 font-semibold">
                            {isPlayingAudio ? "● TRANSMITTING ARCHIVAL AUDIO (42:18)" : "42 MIN • 09 MAY 2025"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* BOTTOM HORIZONTAL NEWSPAPER BRIEF STRIP */}
                <div className="grid grid-cols-4 divide-x divide-[#AAA99B] pt-2 text-[8px] font-mono text-[#333]">
                  <div className="pr-2">
                    <h5 className="font-serif font-bold text-[8.5px] leading-tight hover:underline cursor-pointer">
                      A Year After Pittsburgh, Time for Action
                    </h5>
                    <span className="text-[6px] text-[#777] uppercase block mt-0.5">BY CARLY PILDIS</span>
                  </div>
                  <div className="px-2">
                    <h5 className="font-serif font-bold text-[8.5px] leading-tight hover:underline cursor-pointer">
                      It's Time to Lock Your Synagogue's Doors
                    </h5>
                    <span className="text-[6px] text-[#777] uppercase block mt-0.5">BY JASON GREEN</span>
                  </div>
                  <div className="px-2">
                    <h5 className="font-serif font-bold text-[8.5px] leading-tight hover:underline cursor-pointer">
                      Malley in Wonderland
                    </h5>
                    <span className="text-[6px] text-[#777] uppercase block mt-0.5">BY TONY BADRAN</span>
                  </div>
                  {/* Big Number Statistic Callout Box */}
                  <div className="pl-2 flex flex-col justify-between">
                    <span className="font-serif text-[28px] font-bold text-[#141512] leading-none" style={{ fontVariantNumeric: 'lining-nums tabular-nums' }}>
                      21
                    </span>
                    <span className="text-[6px] font-mono text-[#666] leading-tight mt-0.5">
                      2019 Anti-Semitic hate crimes in New York City
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom Newspaper Page Number */}
              <div className="pt-3 border-t border-[#222] mt-4 flex items-center justify-between text-[7px] font-mono text-[#666]">
                <span>THE ATHENÆUM GAZETTE • VOLUME XLII</span>
                <span>SECTION A • PAGE 1</span>
              </div>
            </article>
          )}

          {/* ========================================================================= */}
          {/* PAGE 2: "SCIENCE" BROADSHEET                                              */}
          {/* ========================================================================= */}
          {(activeEdition === 'science' || activeEdition === 'spread') && (
            <article className="bg-[#EAE6DC] border border-[#222] shadow-xl p-5 md:p-7 relative text-[#1C1E18] flex flex-col justify-between">
              {/* Margin Rotated Section Tabs */}
              <div className="absolute -left-3 top-28 -rotate-90 origin-top-left text-[6.5px] font-mono uppercase tracking-widest text-[#777] bg-[#EAE6DC] px-1.5 py-0.5 border border-[#AAA99B]">
                BELIEF
              </div>
              <div className="absolute -right-3.5 top-28 rotate-90 origin-top-right text-[6.5px] font-mono uppercase tracking-widest text-[#777] bg-[#EAE6DC] px-1.5 py-0.5 border border-[#AAA99B]">
                NEWS
              </div>

              <div>
                {/* Top Tiny Masthead */}
                <div className="text-center pb-1">
                  <span className="font-serif italic text-[11px] text-[#444] tracking-wide">
                    Tablet
                  </span>
                </div>

                {/* Main Heavy All-Caps Section Header */}
                <div className="border-y-2 border-[#1C1E18] py-1 mb-4 text-center">
                  <h1 className="font-sans font-black text-[38px] md:text-[44px] uppercase tracking-[-0.03em] leading-none text-[#141512]">
                    SCIENCE
                  </h1>
                </div>

                {/* TOP 3-COLUMN DISPATCH ROW */}
                <div className="grid grid-cols-12 gap-3 pb-3 border-b border-[#222]">
                  {/* Left Column (25%): Terracotta Historical Box */}
                  <div className="col-span-3 bg-[#EFE5DC] border border-[#BC7B62] p-2 text-center text-[#5C2B1D] font-mono">
                    <div className="text-[6px] uppercase tracking-widest font-bold pb-0.5 border-b border-[#D8A89A] mb-1">
                      JEWISH DISCOVERIES &amp; INVENTIONS
                    </div>
                    {/* Halftone molecular / biological diagram */}
                    <div className="w-full h-12 bg-[#D8A89A]/30 border border-[#BC7B62] my-1 flex items-center justify-center p-1">
                      <svg viewBox="0 0 60 40" className="w-full h-full opacity-80">
                        <circle cx="20" cy="20" r="8" fill="#8C3822" />
                        <circle cx="40" cy="15" r="5" fill="#8C3822" />
                        <circle cx="35" cy="30" r="4" fill="#8C3822" />
                        <line x1="20" y1="20" x2="40" y2="15" stroke="#8C3822" strokeWidth="1.5" />
                        <line x1="20" y1="20" x2="35" y2="30" stroke="#8C3822" strokeWidth="1.5" />
                      </svg>
                    </div>
                    <p className="font-serif italic text-[6.5px] leading-tight text-[#4A2016]">
                      Social Darwinism: A pseudo-scientific theory utilized in 1898.
                    </p>
                    <div className="text-[5.5px] text-[#7A3A2A] mt-1 pt-1 border-t border-[#D8A89A]">
                      Nobel laureate Paul Berg created the first recombinant DNA molecules in 1972.
                    </div>
                  </div>

                  {/* Center Column (50%): Lead Science Portrait & Feature */}
                  <div 
                    onClick={() => handleArticleClick({
                      title: "Zahav Chef Michael Solomonov a Semifinalist for James Beard Award",
                      deck: "Tova du Plessis, the Jewish owner of South Philadelphia's Essen Bakery, has also been nominated for Outstanding Baker.",
                      author: "LIL LEIBOVITZ",
                      category: "Gastronomic Science"
                    })}
                    className="col-span-6 text-center cursor-pointer group px-1 border-x border-[#AAA99B]"
                  >
                    {/* Halftone Portrait */}
                    <div className="w-full h-36 bg-[#1C1E18] overflow-hidden mb-2 relative border border-[#333]">
                      <svg viewBox="0 0 300 180" className="w-full h-full object-cover">
                        <defs>
                          <radialGradient id="sci-grad" cx="50%" cy="40%" r="60%">
                            <stop offset="0%" stopColor="#DFD9C8" />
                            <stop offset="70%" stopColor="#38362D" />
                            <stop offset="100%" stopColor="#11110E" />
                          </radialGradient>
                        </defs>
                        <rect width="300" height="180" fill="url(#sci-grad)" />
                        {/* Chef Portrait silhouette */}
                        <circle cx="150" cy="70" r="42" fill="#EAE5D4" />
                        <path d="M 120 120 L 150 180 L 180 120 Z" fill="#20221E" />
                        <rect x="90" y="110" width="120" height="70" fill="#EAE5D4" stroke="#111" strokeWidth="1.5" />
                        <text x="150" y="75" fill="#1C1E18" fontSize="22" fontFamily="serif" textAnchor="middle" fontStyle="italic">Chef</text>
                      </svg>
                    </div>

                    <h3 className="font-serif font-bold text-[14px] leading-tight group-hover:underline">
                      Zahav Chef Michael Solomonov a Semifinalist for James Beard Award
                    </h3>
                    <p className="font-serif italic text-[8px] text-[#555] leading-relaxed mt-1 line-clamp-2">
                      Tova du Plessis, the Jewish owner of South Philadelphia's Essen Bakery, has also been nominated for Outstanding Baker.
                    </p>
                    <span className="font-mono text-[6.5px] uppercase tracking-wider text-[#777] block mt-1">
                      BY LIL LEIBOVITZ
                    </span>
                  </div>

                  {/* Right Column (25%): Dispatches */}
                  <div className="col-span-3 space-y-2 text-[7.5px] font-mono">
                    <div className="pb-1.5 border-b border-[#CCC6B6]">
                      <h4 className="font-serif font-bold text-[9px] leading-snug hover:underline cursor-pointer">
                        Yiddleaks: The Jeremy Corbyn Email Archive
                      </h4>
                      <p className="font-serif text-[6.5px] text-[#666] leading-tight mt-0.5">
                        A trove of internal party communications reveals institutional fissures.
                      </p>
                      <span className="text-[5.5px] text-[#888] uppercase block mt-0.5">BY TANYA GOLDMAN</span>
                    </div>

                    <div>
                      <h4 className="font-serif font-bold text-[9px] leading-snug hover:underline cursor-pointer">
                        The Rabbi Who Helped Me Sneak Into Venezuela
                      </h4>
                      <p className="font-serif text-[6.5px] text-[#666] leading-tight mt-0.5">
                        Weeks after security forces barred entry, an underground transit was arranged.
                      </p>
                      <span className="text-[5.5px] text-[#888] uppercase block mt-0.5">BY ARMINA ROSENTHAL</span>
                    </div>
                  </div>
                </div>

                {/* MIDDLE TWO-BOX ROW */}
                <div className="grid grid-cols-2 divide-x divide-[#AAA99B] py-2 border-b border-[#222] text-[8px]">
                  <div className="pr-2">
                    <h5 className="font-serif font-bold text-[9.5px]">Second Avenue Elevated</h5>
                    <p className="font-serif italic text-[7.5px] text-[#666] mt-0.5">
                      Looking for tracks to my father's unobtainable past in old Jewish New York.
                    </p>
                    <span className="font-mono text-[6px] text-[#888] uppercase block mt-0.5">BY JONATHAN LIEBSON</span>
                  </div>
                  <div className="pl-2">
                    <h5 className="font-serif font-bold text-[9.5px]">Judenrein Europe</h5>
                    <p className="font-serif italic text-[7.5px] text-[#666] mt-0.5">
                      For millennia Europe was the center of diaspora life but as migrations continue, what remains?
                    </p>
                    <span className="font-mono text-[6px] text-[#888] uppercase block mt-0.5">BY LEV GOLINKIN</span>
                  </div>
                </div>

                {/* GEOMETRIC ART FEATURE & STATISTIC BLOCK */}
                <div className="grid grid-cols-12 gap-3 py-3 border-b border-[#222]">
                  {/* Left (65%): Geometric Isometric Maze Cube */}
                  <div className="col-span-8 flex flex-col items-center border-r border-[#AAA99B] pr-3">
                    <div className="w-44 h-44 bg-[#E0DBCB] border border-[#222] p-2 flex items-center justify-center relative mb-2">
                      {/* Geometric cube maze inspired by the shared image */}
                      <svg viewBox="0 0 100 100" className="w-full h-full">
                        {/* Isometric Cube Contour */}
                        <polygon points="50,10 90,32 50,55 10,32" fill="#EAE5D4" stroke="#111" strokeWidth="2.5" />
                        <polygon points="10,32 50,55 50,95 10,72" fill="#D3CCA8" stroke="#111" strokeWidth="2.5" />
                        <polygon points="50,55 90,32 90,72 50,95" fill="#B3AB89" stroke="#111" strokeWidth="2.5" />
                        
                        {/* Intricate Geometric Maze Meander Traces */}
                        <path d="M 50,18 L 80,34 L 50,50 L 20,34 Z" fill="none" stroke="#111" strokeWidth="2" />
                        <path d="M 30,24 L 50,35 L 70,24" fill="none" stroke="#111" strokeWidth="2" />
                        <path d="M 20,40 L 40,51 L 40,82 L 20,71 Z" fill="none" stroke="#111" strokeWidth="2" />
                        <path d="M 60,51 L 80,40 L 80,71 L 60,82 Z" fill="none" stroke="#111" strokeWidth="2" />
                        <line x1="50" y1="55" x2="50" y2="95" stroke="#111" strokeWidth="2.5" />
                      </svg>
                    </div>

                    <h3 className="font-serif font-bold text-[13px] text-center leading-tight hover:underline cursor-pointer">
                      Can Islam Be More Jewish?
                    </h3>
                    <p className="font-serif italic text-[7.5px] text-[#555] text-center mt-0.5">
                      Shared theological foundations and scholastic traditions between medieval Andalusia and modern discourse.
                    </p>
                    <span className="font-mono text-[6.5px] text-[#777] uppercase mt-1">BY SHAI SECOUNDA</span>
                  </div>

                  {/* Right (35%): Lost Wisdom & Number Callout */}
                  <div className="col-span-4 flex flex-col justify-between space-y-2">
                    {/* Lost Wisdom Box */}
                    <div className="border border-[#C29E7D] bg-[#F7F2EC] p-2 text-[7px] text-[#5A3820] font-mono">
                      <div className="text-[6.5px] font-bold uppercase tracking-wider text-[#9E5D2A] pb-0.5 border-b border-[#E0BC9B] mb-1">
                        LOST WISDOM
                      </div>
                      <p className="font-serif italic leading-tight">
                        "For centuries the therapeutic effects of sunlight were lost to modern medicine until Dr. Finsen demonstrated light therapy in 1893."
                      </p>
                    </div>

                    {/* Big Statistic Box: 20,800 */}
                    <div className="border border-[#AAA99B] bg-[#E5DFD1] p-2 text-center">
                      <span className="font-serif text-[26px] font-bold text-[#141512] leading-none" style={{ fontVariantNumeric: 'lining-nums tabular-nums' }}>
                        20,800
                      </span>
                      <p className="text-[6.5px] font-mono text-[#666] leading-tight mt-1">
                        The number of dunams of arable land surveyed in 1911 cadastral maps.
                      </p>
                    </div>

                    {/* Audio dispatch widget */}
                    <div className="bg-[#141512] text-[#EAE6DC] p-2 border border-[#333] font-mono">
                      <div className="text-[6px] uppercase tracking-widest text-[#888] font-semibold pb-0.5 border-b border-[#2C2E28] mb-1">
                        LISTEN TO TABLET
                      </div>
                      <div className="flex items-center space-x-1.5 text-[7px]">
                        <div className="w-4 h-4 rounded-full bg-[#738A62] text-black flex items-center justify-center flex-shrink-0">
                          <Play className="w-2 h-2 fill-current ml-0.5" />
                        </div>
                        <span className="font-serif font-bold text-[#EAE6DC] truncate">The Hebrew Alphabet</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* BOTTOM PAPERS, PLEASE & GAMING ARCHIVE */}
                <div className="grid grid-cols-12 gap-3 pt-3 text-[8px]">
                  {/* Nobel Laureate Portrait */}
                  <div className="col-span-2 text-center border-r border-[#AAA99B] pr-2">
                    <div className="w-10 h-10 mx-auto rounded-full bg-[#E0D7C6] border border-[#AAA99B] flex items-center justify-center mb-1">
                      <span className="font-serif font-bold text-[10px] text-[#555]">1911</span>
                    </div>
                    <span className="font-mono text-[5.5px] uppercase text-[#777] block">TOBIAS ASSER</span>
                  </div>

                  {/* Censorship dispatch */}
                  <div className="col-span-4 border-r border-[#AAA99B] pr-2">
                    <h5 className="font-serif font-bold text-[9px] leading-snug hover:underline cursor-pointer">
                      Mocking German Censorship, Israelis Develop Video Game
                    </h5>
                    <p className="font-serif italic text-[7px] text-[#666] leading-tight mt-0.5">
                      Wolfenstein and the digital satire of historical propaganda.
                    </p>
                    <span className="font-mono text-[6px] text-[#888] uppercase block mt-0.5">BY ANNIKA HERNANDEZ</span>
                  </div>

                  {/* Papers, Please Feature with Pixel Grid Cards */}
                  <div className="col-span-6 pl-1">
                    <div className="grid grid-cols-4 gap-1 mb-1">
                      {[1, 2, 3, 4].map(k => (
                        <div key={k} className="h-9 bg-[#1C1E18] border border-[#444] p-0.5 flex flex-col justify-between">
                          <div className="flex space-x-0.5">
                            <div className="w-1.5 h-1.5 bg-[#4F6D48]"></div>
                            <div className="w-3 h-0.5 bg-[#777]"></div>
                          </div>
                          <div className="text-[4.5px] font-mono text-[#AAA]">ENTRY DENIED</div>
                        </div>
                      ))}
                    </div>
                    <h5 className="font-serif font-bold text-[9.5px] leading-snug hover:underline cursor-pointer">
                      Papers, Please: A Video Game With No Shootouts or Theft—Only the Banality of Evil
                    </h5>
                    <span className="font-mono text-[6px] text-[#888] uppercase block mt-0.5">BY LIL LEIBOVITZ</span>
                  </div>
                </div>
              </div>

              {/* Bottom Newspaper Page Number */}
              <div className="pt-3 border-t border-[#222] mt-4 flex items-center justify-between text-[7px] font-mono text-[#666]">
                <span>THE ATHENÆUM GAZETTE • VOLUME XLII</span>
                <span>SECTION B • PAGE 2</span>
              </div>
            </article>
          )}

        </div>
      </div>

      {/* Reader Modal when an article is clicked */}
      {activeArticleModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-[1px] z-50 flex items-center justify-center p-4 font-mono select-none">
          <div className="w-full max-w-lg bg-[#EAE6DC] border border-[#222] shadow-2xl p-5 flex flex-col max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-[#222] mb-3">
              <span className="text-[8px] font-mono uppercase tracking-widest text-[#777]">
                GAZETTE ARCHIVAL DISPATCH
              </span>
              <button 
                onClick={() => setActiveArticleModal(null)}
                className="text-[#555] hover:text-black font-mono text-[10px]"
              >
                ✕ CLOSE
              </button>
            </div>
            <h2 className="font-serif font-bold text-[18px] text-[#141512] leading-snug mb-2">
              {activeArticleModal.title}
            </h2>
            <div className="text-[7.5px] font-mono uppercase text-[#777] mb-3">
              BY {activeArticleModal.author} • {activeArticleModal.category} • 09 MAY 2025
            </div>
            <div className="font-serif text-[11px] leading-relaxed text-[#2C2E28] space-y-2 border-y border-[#CCC6B6] py-3 italic">
              <p>{activeArticleModal.deck}</p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#AAA99B] flex justify-between items-center text-[7.5px] font-mono text-[#666]">
              <span>INDEXED IN VAULT: LOCAL DISPATCH</span>
              <button
                onClick={() => setActiveArticleModal(null)}
                className="bg-[#222] text-[#EAE6DC] px-3 py-1 uppercase tracking-wider text-[8px]"
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

