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
  Menu,
  Plus
} from 'lucide-react';
import { useArchive } from '../context/ArchiveContext';

export function NewsView({ onInspectArticle, onOpenNewRecord }) {
  const { inspectRecord } = useArchive();
  // Default to 'spread' matching editorial two-page broadsheet layout
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
    <div className="flex-1 flex flex-col h-full bg-[#EAE6D9] font-serif select-none overflow-hidden text-[#141512]">
      {/* 1. Gazette Sub-Toolbar */}
      <div className="bg-[#EAE6D9] border-b border-[#AAA99B] px-4 py-1.5 flex items-center justify-between font-mono text-[9px] text-[#55544B] flex-shrink-0">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1.5 font-semibold text-[#141512]">
            <Newspaper className="w-3.5 h-3.5 text-[#141512]" />
            <span className="uppercase tracking-widest text-[9.5px] font-bold">THE ATHENÆUM GAZETTE</span>
          </div>
          <span className="text-[#AAA99B]">•</span>
          <span className="text-[#66655A] font-medium">TABLET ARCHIVE EDITION • VOL. XLII • No. 104 • MAY 2025</span>
        </div>

        {/* Segmented View Switcher: P. 1 - NEWS | P. 2 - SCIENCE | FULL SPREAD */}
        <div className="flex items-center border border-[#141512] divide-x divide-[#141512] bg-[#EAE6D9] text-[#141512]">
          <button
            onClick={() => setActiveEdition('news')}
            className={`px-2.5 py-0.5 uppercase tracking-wider text-[8px] font-bold transition-colors ${
              activeEdition === 'news'
                ? 'bg-[#141512] text-[#FAF8F3]'
                : 'bg-[#EAE6D9] text-[#55544B] hover:bg-[#DDD8CB]'
            }`}
          >
            P. 1 — NEWS
          </button>
          <button
            onClick={() => setActiveEdition('science')}
            className={`px-2.5 py-0.5 uppercase tracking-wider text-[8px] font-bold transition-colors ${
              activeEdition === 'science'
                ? 'bg-[#141512] text-[#FAF8F3]'
                : 'bg-[#EAE6D9] text-[#55544B] hover:bg-[#DDD8CB]'
            }`}
          >
            P. 2 — SCIENCE
          </button>
          <button
            onClick={() => setActiveEdition('spread')}
            className={`px-3 py-0.5 uppercase tracking-wider text-[8px] font-bold transition-colors flex items-center space-x-1.5 ${
              activeEdition === 'spread'
                ? 'bg-[#141512] text-[#FAF8F3]'
                : 'bg-[#EAE6D9] text-[#55544B] hover:bg-[#DDD8CB]'
            }`}
          >
            <Columns className="w-2.5 h-2.5" />
            <span>FULL SPREAD</span>
          </button>
        </div>

        {/* New Record button */}
        {onOpenNewRecord && (
          <button
            onClick={onOpenNewRecord}
            className="px-2.5 py-0.5 bg-[#EAE6D9] hover:bg-[#DDD8CB] active:bg-[#CCC7B8] text-[#141512] border border-[#AAA99B] text-[8px] font-bold uppercase tracking-wider transition-colors flex items-center space-x-1 rounded-[0.5px]"
          >
            <Plus className="w-2.5 h-2.5" />
            <span>NEW RECORD</span>
          </button>
        )}
      </div>

      {/* 2. Main Broadsheet Scrolling Body */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-[#D7D2BF] flex justify-center items-start">
        <div className={`w-full transition-all duration-200 ${
          activeEdition === 'spread' 
            ? 'max-w-[1460px] grid grid-cols-1 xl:grid-cols-2 gap-6' 
            : 'max-w-[720px]'
        }`}>
          
          {/* ========================================================================= */}
          {/* PAGE 1: "NEWS" BROADSHEET                                                 */}
          {/* ========================================================================= */}
          {(activeEdition === 'news' || activeEdition === 'spread') && (
            <article className="bg-[#FAF8F3] border border-[#141512] shadow-[0_4px_25px_rgba(0,0,0,0.12)] p-5 md:p-6 text-[#141512] flex flex-col justify-between">
              <div>
                {/* Top Bar: Hamburger Menu, Running Folio, & Tablet Logo */}
                <div className="flex justify-between items-center text-[7.5px] font-mono tracking-widest text-[#555] uppercase pb-1.5 border-b border-[#222]">
                    <div className="flex items-center space-x-2">
                      <div className="w-3.5 h-2.5 flex flex-col justify-between cursor-pointer opacity-70 hover:opacity-100">
                        <span className="w-3 h-[1.5px] bg-[#222]"></span>
                        <span className="w-3 h-[1.5px] bg-[#222]"></span>
                        <span className="w-3 h-[1.5px] bg-[#222]"></span>
                      </div>
                      <span>TRUTH • CONTEXT • LONGER THINKING</span>
                    </div>
                    <div className="font-serif italic font-normal text-[11px] tracking-wide text-[#333] normal-case">
                      Tablet
                    </div>
                    <span>VOL. XLII • No. 104 • 09 MAY 2025</span>
                  </div>

                  {/* Big Masthead: NEWS */}
                  <div className="border-b border-[#222] py-2 mb-2.5 text-center">
                    <h1 className="font-sans font-black text-[46px] md:text-[54px] uppercase tracking-[-0.03em] leading-none text-[#111]">
                      NEWS
                    </h1>
                  </div>

                  {/* 1. TOP HERO SECTION: Proportionally Balanced Lead Photograph + Main Headline */}
                  <div className="border-b border-[#222] pb-3 mb-3">
                    {/* Authentic Editorial Monochrome Photograph of Bernie Sanders */}
                    <div 
                      onClick={() => handleArticleClick({
                        title: "Can Bernie Sanders Fix America's Broken Anti-Semitism Conversation?",
                        deck: "The presidential trailblazer just took a historic first step toward national dialogue with gentiles. But its success will depend on whether he's willing to confront some hard truths.",
                        author: "YAIR ROSENBERG",
                        category: "Lead Analysis"
                      })}
                      className="cursor-pointer group relative overflow-hidden bg-[#0A0A0A] border border-[#222] aspect-[16/9] w-full max-h-[260px]"
                    >
                      <img 
                        src="/images/gazette/bernie_sanders.jpg" 
                        alt="Bernie Sanders at political podium" 
                        className="w-full h-full object-cover object-top grayscale contrast-125 brightness-95 group-hover:scale-[1.01] transition-transform duration-300"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                      {/* Subtle Newsprint Caption Bar */}
                      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-1.5 flex justify-between items-end text-[6.5px] font-mono text-[#DDD] opacity-90">
                        <span>CAPITOL HILL // NATIONAL POLICY FORUM</span>
                        <span>PHOTO: ARCHIVAL WIRE SERVICE</span>
                      </div>
                    </div>

                    {/* Full-Width Headline + Deck Beneath Image */}
                    <div 
                      onClick={() => handleArticleClick({
                        title: "Can Bernie Sanders Fix America's Broken Anti-Semitism Conversation?",
                        deck: "The presidential trailblazer just took a historic first step toward national dialogue with gentiles. But its success will depend on whether he's willing to confront some hard truths.",
                        author: "YAIR ROSENBERG",
                        category: "Lead Analysis"
                      })}
                      className="cursor-pointer group pt-2.5 text-center"
                    >
                      <h2 className="font-serif font-bold text-[20px] md:text-[22px] leading-[1.18] tracking-tight text-[#111] group-hover:underline max-w-[620px] mx-auto">
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

                  {/* 2. MIDDLE SECTION: Structured Multi-Column Editorial Grid */}
                  <div className="grid grid-cols-12 gap-3.5 pb-3 border-b border-[#222]">
                    {/* Left 7 Columns (~58%): Protest Photo + Cancel Culture + 2 Sub-Columns */}
                    <div className="col-span-7 border-r border-[#AAA99B] pr-3 flex flex-col justify-between">
                      <div>
                        {/* Real Editorial Protest Photo with Inset Circle-Slash Placard */}
                        <div 
                          onClick={() => handleArticleClick({
                            title: "The Real Problem With Cancel Culture",
                            deck: "It's not about celebrities. It's about losing trust in each other.",
                            author: "KAT ROSENFIELD",
                            category: "Culture"
                          })}
                          className="w-full aspect-[16/9] max-h-[140px] bg-[#1A1A18] border border-[#222] relative overflow-hidden mb-2 cursor-pointer group"
                        >
                          <img 
                            src="/images/gazette/protest.jpg" 
                            alt="Protest crowd demonstration" 
                            className="w-full h-full object-cover grayscale contrast-125 brightness-90 group-hover:scale-[1.01] transition-transform duration-300"
                          />
                          {/* Inset Circular Prohibition Symbol Placard */}
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="bg-[#FAF8F3]/95 border-2 border-[#141512] p-1.5 shadow-md flex items-center justify-center">
                              <svg viewBox="0 0 60 60" className="w-10 h-10">
                                <circle cx="30" cy="30" r="26" fill="none" stroke="#141512" strokeWidth="6" />
                                <line x1="12" y1="12" x2="48" y2="48" stroke="#141512" strokeWidth="6" />
                              </svg>
                            </div>
                          </div>
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
                          <div className="text-[6.5px] font-mono font-bold uppercase tracking-widest text-[#B0452E] mb-0.5">
                            CULTURE
                          </div>
                          <h3 className="font-serif font-bold text-[14px] leading-tight text-[#111] group-hover:underline">
                            The Real Problem With Cancel Culture
                          </h3>
                          <p className="font-serif text-[8.5px] text-[#444] leading-relaxed mt-1">
                            It's not about celebrities. It's about losing trust in each other. A deeper look at how outrage, moralism and online mobs are reshaping public discourse.
                          </p>
                          <div className="font-mono text-[6.5px] font-bold text-[#777] uppercase tracking-wider mt-1">
                            BY KAT ROSENFIELD
                          </div>
                        </div>

                        {/* 2 Sub-Columns under Cancel Culture */}
                        <div className="grid grid-cols-2 gap-2.5 pt-2">
                          {/* Sub-col 1: Doran on Wall Street + 2020 Election */}
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
                              <div className="text-[6px] font-mono font-bold uppercase tracking-wider text-[#666] mb-0.5">
                                FINANCE
                              </div>
                              <h4 className="font-serif font-bold text-[9.5px] leading-tight text-[#111] group-hover:underline">
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
                              <div className="text-[6px] font-mono font-bold uppercase tracking-wider text-[#666] mb-0.5">
                                POLITICS
                              </div>
                              <h4 className="font-serif font-bold text-[9.5px] leading-tight text-[#111] group-hover:underline">
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

                          {/* Sub-col 2: Press Briefing Photo + The Revolt Against Iran */}
                          <div>
                            {/* Real Photo: Press Briefing / Diplomatic Conference */}
                            <div className="w-full h-14 bg-[#181816] border border-[#222] mb-1.5 overflow-hidden">
                              <img 
                                src="/images/gazette/press_conference.jpg" 
                                alt="Diplomatic press briefing room" 
                                className="w-full h-full object-cover grayscale contrast-125 brightness-95"
                              />
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
                              <h4 className="font-serif font-bold text-[9.5px] leading-tight text-[#111] group-hover:underline">
                                The Revolt Against Iran
                              </h4>
                              <p className="font-serif text-[7px] text-[#555] leading-tight mt-0.5 line-clamp-3">
                                Iran's plans for regional hegemony depend on being seen as the protector of loyal Shia Muslims—but those are exactly the people leading mass protests.
                              </p>
                              <div className="font-mono text-[6px] text-[#888] uppercase tracking-wider mt-1">
                                BY HANIN GHADDAR
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right 5 Columns (~42%): Featured Columnist, Election Dates, Dark Audio Widget */}
                    <div className="col-span-5 flex flex-col justify-between space-y-2.5">
                      {/* Box 1: FEATURED COLUMNIST with Authentic Photographic Portrait */}
                      <div className="bg-[#F8ECE7] border border-[#DEB9AD] p-2.5 text-center flex flex-col items-center">
                        <div className="font-mono text-[6.5px] font-bold uppercase tracking-widest text-[#B0452E] mb-1.5">
                          FEATURED COLUMNIST
                        </div>
                        {/* Real Photographic Portrait with Sepia Duotone Newsprint Tint */}
                        <div className="w-13 h-13 rounded-full overflow-hidden border-2 border-[#B0452E] bg-[#D48F7B]/30 mb-1.5 shadow-sm">
                          <img 
                            src="/images/gazette/columnist.jpg" 
                            alt="Columnist Liel Leibovitz" 
                            className="w-full h-full object-cover grayscale contrast-125"
                          />
                        </div>
                        <h4 className="font-serif font-bold text-[11px] text-[#141512]">
                          LIEL LEIBOVITZ
                        </h4>
                        <p className="font-serif text-[7.5px] text-[#555] leading-snug mt-0.5 max-w-[190px]">
                          Liel Leibovitz is a senior writer for Tablet Magazine and co-host of the Unorthodox podcast.
                        </p>
                      </div>

                      {/* Box 2: UPCOMING ELECTION DATES */}
                      <div className="bg-[#F8ECE7] border border-[#DEB9AD] p-2 text-[7.5px] font-mono">
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
                      <div className="bg-[#181917] text-[#EDEAE2] p-2 flex flex-col justify-between shadow-inner">
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
                            className="w-4 h-4 rounded-full bg-[#EAE6DC] text-[#141512] flex items-center justify-center flex-shrink-0 hover:bg-white transition-colors"
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

                  {/* 3. BOTTOM TIER: 4 Compact Editorial Columns */}
                  <div className="grid grid-cols-12 gap-2.5 pt-2.5">
                    {/* Col 1: Action */}
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

                    {/* Col 2: Synagogue Security */}
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

                    {/* Col 3: Foreign Affairs */}
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

                    {/* Col 4: Archival Stat Numeral 21 */}
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
          )}

          {/* ========================================================================= */}
          {/* PAGE 2: "SCIENCE" BROADSHEET                                              */}
          {/* ========================================================================= */}
          {(activeEdition === 'science' || activeEdition === 'spread') && (
            <article className="bg-[#FAF8F3] border border-[#141512] shadow-[0_4px_25px_rgba(0,0,0,0.12)] p-5 md:p-6 text-[#141512] flex flex-col justify-between">
              <div>
                {/* Top Bar: Hamburger Menu, Running Folio, & Tablet Logo */}
                  <div className="flex justify-between items-center text-[7.5px] font-mono tracking-widest text-[#555] uppercase pb-1.5 border-b border-[#222]">
                    <div className="flex items-center space-x-2">
                      <div className="w-3.5 h-2.5 flex flex-col justify-between cursor-pointer opacity-70 hover:opacity-100">
                        <span className="w-3 h-[1.5px] bg-[#222]"></span>
                        <span className="w-3 h-[1.5px] bg-[#222]"></span>
                        <span className="w-3 h-[1.5px] bg-[#222]"></span>
                      </div>
                      <span>IDEAS • DISCOVERY • A MORE CURIOUS WORLD</span>
                    </div>
                    <div className="font-serif italic font-normal text-[11px] tracking-wide text-[#333] normal-case">
                      Tablet
                    </div>
                    <span>VOL. XLII • No. 104 • 09 MAY 2025</span>
                  </div>

                  {/* Big Masthead: SCIENCE */}
                  <div className="border-b border-[#222] py-2 mb-2.5 text-center">
                    <h1 className="font-sans font-black text-[46px] md:text-[54px] uppercase tracking-[-0.03em] leading-none text-[#111]">
                      SCIENCE
                    </h1>
                  </div>

                  {/* 1. TOP TIER: Jewish Inventions, Chef Solomonov Photo + Beard Story, Yiddleaks & Venezuela */}
                  <div className="grid grid-cols-12 gap-3 pb-2.5 border-b border-[#222]">
                    {/* Left: JEWISH DISCOVERIES & INVENTIONS (~24%) */}
                    <div className="col-span-3 bg-[#F8ECE7] border border-[#DEB9AD] p-2 flex flex-col justify-between text-[7px] font-mono">
                      <div>
                        <div className="font-bold text-[6.5px] text-[#B0452E] uppercase tracking-wider mb-1 leading-tight">
                          JEWISH DISCOVERIES &amp; INVENTIONS
                        </div>
                        <p className="text-[6.5px] text-[#444] leading-tight mb-1.5">
                          <span className="font-bold text-[#111]">Daniel Nathans</span> was awarded the Nobel Prize in Physiology or Medicine in 1978 for the discovery of restriction enzymes.
                        </p>
                        {/* Reddish/coral circular biological cell diagram */}
                        <div className="w-full h-8 bg-[#EAC9BE]/40 border border-[#DEB9AD] my-1 flex items-center justify-center">
                          <svg viewBox="0 0 100 40" className="w-full h-full">
                            <circle cx="50" cy="20" r="14" fill="#B0452E" opacity="0.3" />
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

                    {/* Center: Chef Michael Solomonov Real Photograph & James Beard Story (~48%) */}
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
                        {/* Real Editorial Photograph of Chef Michael Solomonov by Bill Cramer */}
                        <div className="w-full aspect-[16/10] max-h-[140px] bg-[#12130F] border border-[#222] relative overflow-hidden mb-1.5">
                          <img 
                            src="/images/gazette/michael_solomonov.jpg" 
                            alt="Chef Michael Solomonov" 
                            className="w-full h-full object-cover grayscale contrast-125 brightness-95 group-hover:scale-[1.01] transition-transform duration-300"
                          />
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
                          A trove of communications from Britain's Labour Party leader reveals the difference between a hipster and Hezbollah.
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
                          Weeks after security forces kicked me out of Venezuela, I was at the border with a rabbi preparing for the journey.
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

                  {/* 2. MIDDLE CENTERPIECE: Isometric Labyrinth Cube Artwork + Lost Wisdom & Audio */}
                  <div className="grid grid-cols-12 gap-3.5 py-3 border-b border-[#222]">
                    {/* Left Centerpiece Feature: Can Islam Be More Jewish? (~65%) */}
                    <div className="col-span-8 pr-2 border-r border-[#AAA99B] text-center flex flex-col items-center justify-between">
                      <div 
                        onClick={() => handleArticleClick({
                          title: "Can Islam Be More Jewish?",
                          deck: "Two faiths, two histories, and a shared search for meaning in a complicated world. A look at how closer intellectual and cultural ties might reshape the future.",
                          author: "ELI COHEN",
                          category: "Theology & Ideas"
                        })}
                        className="cursor-pointer group w-full flex flex-col items-center"
                      >
                        {/* Prominent Architectural Isometric Labyrinth Cube */}
                        <div className="w-36 h-36 bg-[#EBE7DC] border-2 border-[#141512] flex items-center justify-center p-2.5 my-1 shadow-sm">
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
                          Two faiths, two histories, and a shared search for meaning in a complicated world. A look at how closer intellectual and cultural ties might reshape the future.
                        </p>
                        <div className="font-mono text-[6.5px] text-[#777] uppercase tracking-wider mt-1">
                          BY ELI COHEN
                        </div>
                      </div>
                    </div>

                    {/* Right: Lost Wisdom + Audio Widget (~35%) */}
                    <div className="col-span-4 flex flex-col justify-between space-y-2">
                      {/* Box 1: LOST WISDOM */}
                      <div className="bg-[#F8ECE7] border border-[#DEB9AD] p-2.5 text-center">
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

                        <div className="border-t border-[#DEB9AD] pt-1.5 mt-1.5">
                          <div className="font-serif font-bold text-[22px] text-[#141512] leading-none">
                            20,800
                          </div>
                          <div className="font-mono text-[6px] text-[#666] mt-0.5 leading-tight">
                            Artifacts digitized this year across 12 collections.
                          </div>
                        </div>
                      </div>

                      {/* Box 2: Dark Audio Player Widget */}
                      <div className="bg-[#181917] text-[#EDEAE2] p-2 flex flex-col justify-between shadow-inner">
                        <div>
                          <div className="flex items-center space-x-1.5 text-[6.5px] font-mono font-bold tracking-wider uppercase text-[#C4C0B0]">
                            <Headphones className="w-2.5 h-2.5" />
                            <span>LISTEN TO TABLET</span>
                          </div>
                          <div className="font-serif font-bold text-[8.5px] leading-tight text-[#FAF8F3] mt-1">
                            What Can Faiths Learn From Each Other?
                          </div>
                          <div className="text-[6.5px] font-mono text-[#AAA99B] leading-tight mt-0.5">
                            Episode 195: 15-minute conversation on history, religion and coexistence.
                          </div>
                        </div>

                        <div className="pt-1.5 flex items-center space-x-1.5">
                          <button 
                            onClick={() => setIsPlayingAudio2(!isPlayingAudio2)}
                            className="w-4 h-4 rounded-full bg-[#EAE6DC] text-[#141512] flex items-center justify-center flex-shrink-0 hover:bg-white transition-colors"
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

                  {/* 3. BOTTOM TIER: Real Photo of Tobias Asser, Hitler's Mustache Censorship, Papers Please 4-Screen Grid */}
                  <div className="grid grid-cols-12 gap-3 pt-2.5">
                    {/* Col 1: JEWISH NOBEL LAUREATE with Real Archival Portrait (~22%) */}
                    <div className="col-span-3 bg-[#F8ECE7] border border-[#DEB9AD] p-2 flex flex-col items-center text-center justify-between">
                      <div>
                        <div className="font-mono text-[6px] font-bold uppercase tracking-widest text-[#B0452E] mb-1">
                          JEWISH NOBEL LAUREATE
                        </div>
                        {/* Real Archival Photo of Tobias Asser */}
                        <div className="w-11 h-11 rounded-full overflow-hidden border border-[#B0452E] bg-[#E8C5BA] mx-auto mb-1 flex items-center justify-center shadow-sm">
                          <img 
                            src="/images/gazette/tobias_asser.jpg" 
                            alt="Nobel Laureate Tobias Asser" 
                            className="w-full h-full object-cover grayscale contrast-125"
                          />
                        </div>
                        <h5 className="font-serif font-bold text-[8.5px] text-[#141512]">
                          TOBIAS ASSER
                        </h5>
                        <p className="font-serif text-[6.5px] text-[#555] leading-snug mt-0.5">
                          For his work in the field of private international law and the Hague Conference.
                        </p>
                      </div>
                    </div>

                    {/* Col 2: Hitler's Mustache Video Game & Gwyneth Paltrow (~38%) */}
                    <div className="col-span-4 border-r border-[#CCC7B8] pr-2 flex flex-col justify-between">
                      <div className="flex space-x-2 pb-1.5 border-b border-[#D5D0C2]">
                        {/* Real Photo: Vintage Censored Portrait */}
                        <div className="w-12 h-12 flex-shrink-0 bg-[#161713] border border-[#222] overflow-hidden">
                          <img 
                            src="/images/gazette/vintage_portrait.jpg" 
                            alt="Historical censorship archive photo" 
                            className="w-full h-full object-cover grayscale contrast-125 brightness-90"
                          />
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

                    {/* Col 3: PAPERS, PLEASE with 4-Monitor CRT Grid (~40%) */}
                    <div className="col-span-5 flex flex-col justify-between">
                      {/* 2x2 Grid of 4 CRT Game Screens */}
                      <div className="grid grid-cols-2 gap-1 mb-1.5">
                        {/* Monitor 1: Checkpoint Guard Post */}
                        <div className="aspect-[4/3] bg-[#0E100D] border border-[#222] p-0.5 relative overflow-hidden">
                          <svg viewBox="0 0 100 75" className="w-full h-full">
                            <rect width="100" height="75" fill="#141812" />
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
                            <rect x="25" y="48" width="22" height="7" fill="#B0452E" />
                          </svg>
                        </div>

                        {/* Monitor 3: Ministry Rulebook */}
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