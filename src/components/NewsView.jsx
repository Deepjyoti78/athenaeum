import React, { useState } from 'react';
import { 
  Play, 
  Pause, 
  Headphones, 
  Newspaper, 
  Columns, 
  X,
  Share2,
  Bookmark,
  Check,
  BookOpen,
  ArrowRight,
  Printer
} from 'lucide-react';
import { useArchive } from '../context/ArchiveContext';

export function NewsView({ onOpenNewRecord }) {
  const { inspectRecord, createEntry, showToast } = useArchive();
  
  // View mode: 'spread' | 'news' | 'science'
  const [activeEdition, setActiveEdition] = useState('spread');
  
  // Interactive Audio Players State
  const [isPlayingAudio1, setIsPlayingAudio1] = useState(false);
  const [audioProgress1, setAudioProgress1] = useState(38);
  const [isPlayingAudio2, setIsPlayingAudio2] = useState(false);
  const [audioProgress2, setAudioProgress2] = useState(55);
  
  // Reading Modal State
  const [activeArticleModal, setActiveArticleModal] = useState(null);
  const [savedArticles, setSavedArticles] = useState(new Set());

  const handleArticleClick = (article) => {
    setActiveArticleModal(article);
    if (inspectRecord) {
      inspectRecord('entry', {
        id: `gazette-${Date.now()}`,
        title: article.title,
        category: article.category || 'Gazette Dispatch',
        author: article.author || 'Gazette Staff',
        content: article.fullText || article.deck || 'Archival dispatch reprinted from The Athenæum Gazette / Tablet Magazine.',
        date: '09 MAY 2025',
        time: 'Morning Broadsheet'
      });
    }
  };

  const handleSaveToArchive = async (e, article) => {
    e.stopPropagation();
    if (savedArticles.has(article.title)) return;

    try {
      if (createEntry) {
        await createEntry({
          title: article.title,
          category: article.category || 'Research',
          workId: 'WRK-2025-0003',
          content: `${article.deck}\n\nBy ${article.author} — The Athenæum Gazette (Vol. XLII, No. 104, May 2025).`,
          tags: ['gazette', (article.category || 'news').toLowerCase(), 'dispatch']
        });
      }
      setSavedArticles(prev => new Set([...prev, article.title]));
      if (showToast) {
        showToast(`Filed to Archive: "${article.title.slice(0, 32)}..."`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#EAE7D9] font-serif select-none overflow-hidden text-[#141512]">
      {/* ========================================================================= */}
      {/* 1. GAZETTE SUB-TOOLBAR                                                    */}
      {/* ========================================================================= */}
      <div className="bg-[#EAE7D9] border-b border-[#B5B3A4] px-4 py-1.5 flex items-center justify-between font-mono text-[9px] text-[#55544B] flex-shrink-0">
        <div className="flex items-center space-x-2.5">
          <div className="flex items-center space-x-1.5 font-bold text-[#141512]">
            <Newspaper className="w-3.5 h-3.5 text-[#141512]" />
            <span className="uppercase tracking-widest text-[9.5px]">THE ATHENÆUM GAZETTE</span>
          </div>
          <span className="text-[#888]">•</span>
          <span className="text-[#66655A] font-medium hidden sm:inline">
            VOL. XLII • No. 104 • FRIDAY, MAY 9, 2025
          </span>
        </div>

        {/* Segmented BroadSheet Switcher matching reference */}
        <div className="flex items-center border border-[#141512] divide-x divide-[#141512] bg-[#FAF8F3] text-[#141512] rounded-[0.5px] overflow-hidden shadow-sm">
          <button
            onClick={() => setActiveEdition('news')}
            className={`px-3 py-1 uppercase tracking-wider text-[8px] font-bold transition-colors ${
              activeEdition === 'news'
                ? 'bg-[#141512] text-[#FAF8F3]'
                : 'hover:bg-[#EAE7D9] text-[#141512]'
            }`}
          >
            P. 1 — NEWS
          </button>
          <button
            onClick={() => setActiveEdition('science')}
            className={`px-3 py-1 uppercase tracking-wider text-[8px] font-bold transition-colors ${
              activeEdition === 'science'
                ? 'bg-[#141512] text-[#FAF8F3]'
                : 'hover:bg-[#EAE7D9] text-[#141512]'
            }`}
          >
            P. 2 — SCIENCE
          </button>
          <button
            onClick={() => setActiveEdition('spread')}
            className={`px-3 py-1 uppercase tracking-wider text-[8px] font-bold transition-colors flex items-center space-x-1.5 ${
              activeEdition === 'spread'
                ? 'bg-[#141512] text-[#FAF8F3]'
                : 'hover:bg-[#EAE7D9] text-[#141512]'
            }`}
          >
            <Columns className="w-2.5 h-2.5" />
            <span>FULL SPREAD</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. BROADSHEET DESK WORKSPACE                                              */}
      {/* ========================================================================= */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-5 md:p-6 bg-[#EAE7D9] flex justify-center items-start">
        <div className={`w-full transition-all duration-300 ${
          activeEdition === 'spread' 
            ? 'max-w-[1480px] grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6' 
            : 'max-w-[740px]'
        }`}>
          
          {/* ========================================================================= */}
          {/* PAGE 1: "NEWS" BROADSHEET                                                 */}
          {/* ========================================================================= */}
          {(activeEdition === 'news' || activeEdition === 'spread') && (
            <article className="bg-[#FAF7F0] border border-[#141512] shadow-[0_2px_12px_rgba(0,0,0,0.08)] p-5 md:p-6 text-[#141512] flex flex-col justify-between">
              <div>
                {/* 1.1 Running Header Folio */}
                <div className="flex justify-between items-center text-[7.5px] font-mono tracking-widest text-[#555] uppercase pb-1.5 border-b border-[#141512]">
                  <div className="flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 bg-[#141512] inline-block" />
                    <span>TRUTH • CONTEXT • LONGER THINKING</span>
                  </div>
                  <div className="font-serif font-bold text-[10px] tracking-wider text-[#141512] uppercase">
                    THE ATHENÆUM GAZETTE
                  </div>
                  <span>VOL. XLII • No. 104 • 09 MAY 2025</span>
                </div>

                {/* 1.2 Bold Editorial Masthead: NEWS */}
                <div className="border-b border-[#141512] py-2 mb-3 text-center">
                  <h1 className="font-serif font-black text-[46px] md:text-[52px] uppercase tracking-[-0.02em] leading-none text-[#141512]">
                    NEWS
                  </h1>
                </div>

                {/* 1.3 TOP LEAD TIER: Bernie Sanders Image + "A Hard Conversation in America" */}
                <div className="border-b border-[#141512] pb-3.5 mb-3">
                  <div className="grid grid-cols-12 gap-3.5 items-start">
                    {/* Bernie Sanders Photo (Left ~70%) */}
                    <div 
                      onClick={() => handleArticleClick({
                        title: "Can Bernie Sanders Fix America's Broken Anti-Semitism Conversation?",
                        deck: "The presidential trailblazer just took a historic first step toward national dialogue with factious. But its success will depend on whether he's willing to confront some hard truths.",
                        author: "YAIR ROSENBERG",
                        category: "Lead Analysis",
                        page: "PAGE 1",
                        fullText: "As campuses, politicians and communities clash over the meaning of anti-Semitism, Bernie Sanders finds himself again at the center of a difficult debate about free speech, identity and political coalitions. His recent address marks a pivotal juncture in how American progressives and civic leaders navigate communal memory, rising intolerance, and public solidarity."
                      })}
                      className="col-span-8 cursor-pointer group relative overflow-hidden bg-[#12130F] border border-[#141512] aspect-[16/10] max-h-[220px]"
                    >
                      <img 
                        src="/images/gazette/bernie_sanders.jpg" 
                        alt="Bernie Sanders at political podium" 
                        className="w-full h-full object-cover object-top grayscale contrast-125 brightness-95 group-hover:scale-[1.01] transition-transform duration-300"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                      {/* Authentic Wire Service Tag */}
                      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-1.5 flex justify-between items-end text-[6.5px] font-mono text-[#EAE6DC]">
                        <span>CAPITOL HILL // NATIONAL POLICY FORUM</span>
                        <span>PHOTO: ARCHIVAL WIRE SERVICE</span>
                      </div>
                    </div>

                    {/* Right Story Column: "A Hard Conversation in America" (Right ~30%) */}
                    <div 
                      onClick={() => handleArticleClick({
                        title: "A Hard Conversation in America",
                        deck: "As campuses, politicians and communities clash over the meaning of anti-Semitism, Bernie Sanders finds himself again at the center of a difficult debate about free speech, identity and political coalitions.",
                        author: "SPECIAL DISPATCH",
                        category: "U.S. POLITICS",
                        page: "PAGE 6",
                        fullText: "Across academic halls and congressional committee rooms, the discourse surrounding civic tolerance has reached an inflection point. Leaders on both sides of the aisle are confronting the structural fractures in public discourse, balancing constitutionally protected expression against the acute duty of communal protection."
                      })}
                      className="col-span-4 pl-1 border-l border-[#CCC7B8] flex flex-col justify-between h-full cursor-pointer group"
                    >
                      <div>
                        <div className="text-[7px] font-mono font-bold uppercase tracking-widest text-[#B0452E] mb-1">
                          U.S. POLITICS
                        </div>
                        <h3 className="font-serif font-bold text-[13px] leading-tight text-[#141512] group-hover:underline">
                          A Hard Conversation in America
                        </h3>
                        <p className="font-serif text-[8px] text-[#444] leading-relaxed mt-1.5">
                          As campuses, politicians and communities clash over the meaning of anti-Semitism, Bernie Sanders finds himself again at the center of a difficult debate about free speech, identity and political coalitions.
                        </p>
                      </div>
                      <div className="font-mono text-[6.5px] text-[#777] uppercase tracking-wider mt-2 pt-1 border-t border-[#D5D0C2]">
                        PAGE 6
                      </div>
                    </div>
                  </div>

                  {/* Main Headline & Italic Deck beneath */}
                  <div 
                    onClick={() => handleArticleClick({
                      title: "Can Bernie Sanders Fix America's Broken Anti-Semitism Conversation?",
                      deck: "The presidential trailblazer just took a historic first step toward national dialogue with factious. But its success will depend on whether he's willing to confront some hard truths.",
                      author: "YAIR ROSENBERG",
                      category: "Lead Analysis",
                      page: "PAGE 1"
                    })}
                    className="cursor-pointer group pt-3"
                  >
                    <h2 className="font-serif font-bold text-[21px] md:text-[23px] leading-[1.15] text-[#141512] group-hover:underline">
                      Can Bernie Sanders Fix America's Broken Anti-Semitism Conversation?
                    </h2>
                    <p className="font-serif italic text-[9.5px] md:text-[10px] text-[#444] mt-1 leading-relaxed">
                      The presidential trailblazer just took a historic first step toward national dialogue with factious. But its success will depend on whether he's willing to confront some hard truths.
                    </p>
                    <div className="font-mono text-[7px] font-bold uppercase tracking-widest text-[#777] mt-1">
                      BY YAIR ROSENBERG
                    </div>
                  </div>
                </div>

                {/* 1.4 MIDDLE SECTION: Cancel Culture + Protest Photo + Columnist + Audio */}
                <div className="grid grid-cols-12 gap-3.5 pb-3.5 border-b border-[#141512]">
                  {/* Left Column (~58%): Protest Article + Clean Photo */}
                  <div className="col-span-7 border-r border-[#AAA99B] pr-3 flex flex-col justify-between">
                    {/* Grid with article text on left, protest photo on right matching Image 2 */}
                    <div className="grid grid-cols-12 gap-2.5 h-full">
                      {/* Text summary */}
                      <div 
                        onClick={() => handleArticleClick({
                          title: "The Real Problem With Cancel Culture",
                          deck: "It's not about celebrities. It's about losing trust in each other. A deeper look at how outrage, moralism and online mobs are reshaping public discourse — and what can be done about it.",
                          author: "KAT ROSENFIELD",
                          category: "CULTURE",
                          page: "PAGE 10",
                          fullText: "The contemporary panic over cancellation rarely centers on the famous, who possess the legal and financial resources to absorb reputational damage. Rather, the true social cost is borne by ordinary citizens, students, and workers navigating an environment where private sentiments are subjected to sudden public inquisitions and moralistic mob enforcement."
                        })}
                        className="col-span-7 cursor-pointer group flex flex-col justify-between pr-1"
                      >
                        <div>
                          <div className="text-[6.5px] font-mono font-bold uppercase tracking-widest text-[#B0452E] mb-0.5">
                            CULTURE
                          </div>
                          <h3 className="font-serif font-bold text-[14px] leading-tight text-[#141512] group-hover:underline">
                            The Real Problem With Cancel Culture
                          </h3>
                          <p className="font-serif text-[8.5px] text-[#444] leading-relaxed mt-1.5">
                            It's not about celebrities. It's about losing trust in each other. A deeper look at how outrage, moralism and online mobs are reshaping public discourse — and what can be done about it.
                          </p>
                        </div>
                        <div className="font-mono text-[6.5px] text-[#777] uppercase tracking-wider mt-2 pt-1 border-t border-[#D5D0C2]">
                          BY KAT ROSENFIELD &nbsp;•&nbsp; PAGE 10
                        </div>
                      </div>

                      {/* Authentic Protest Photo (with "CANCEL CULTURE != PROGRESS" placard) */}
                      <div 
                        onClick={() => handleArticleClick({
                          title: "The Real Problem With Cancel Culture",
                          deck: "It's not about celebrities. It's about losing trust in each other.",
                          author: "KAT ROSENFIELD",
                          category: "CULTURE",
                          page: "PAGE 10"
                        })}
                        className="col-span-5 aspect-[4/5] bg-[#1A1A18] border border-[#141512] overflow-hidden cursor-pointer group shadow-sm"
                      >
                        <img 
                          src="/images/gazette/protest_clean.jpg" 
                          alt="Demonstrators holding cancel culture protest signs" 
                          className="w-full h-full object-cover grayscale contrast-125 brightness-95 group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Right Column (~42%): Featured Columnist + Listen to Tablet Audio */}
                  <div className="col-span-5 flex flex-col justify-between space-y-2.5">
                    {/* Box 1: FEATURED COLUMNIST Card matching Image 2 */}
                    <div 
                      onClick={() => handleArticleClick({
                        title: "Liel Leibovitz: Archival Commentary Folio",
                        deck: "On history, identity and the stories we choose to tell across generations.",
                        author: "LIEL LEIBOVITZ",
                        category: "COLUMNIST",
                        page: "PAGE 12"
                      })}
                      className="bg-[#F8ECE7] border border-[#DEB9AD] p-2.5 text-center flex flex-col items-center cursor-pointer hover:bg-[#F3E3DD] transition-colors"
                    >
                      <div className="font-mono text-[6.5px] font-bold uppercase tracking-widest text-[#B0452E] mb-1.5">
                        FEATURED COLUMNIST
                      </div>
                      {/* Circular Portrait with Red Accent Ring */}
                      <div className="w-13 h-13 rounded-full overflow-hidden border-2 border-[#B0452E] bg-[#D48F7B]/30 mb-1.5 shadow-sm">
                        <img 
                          src="/images/gazette/liel_portrait.jpg" 
                          alt="Columnist Liel Leibovitz" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <h4 className="font-serif font-bold text-[11px] text-[#141512]">
                        LIEL LEIBOVITZ
                      </h4>
                      <p className="font-serif text-[7.5px] text-[#555] leading-snug mt-0.5 max-w-[190px]">
                        On history, identity and the stories we choose to tell.
                      </p>
                      <div className="font-mono text-[6px] text-[#B0452E] font-bold uppercase tracking-wider mt-1">
                        PAGE 12
                      </div>
                    </div>

                    {/* Box 2: Dark Audio Player Widget matching Image 2 */}
                    <div className="bg-[#181917] text-[#EDEAE2] p-2.5 flex flex-col justify-between shadow-sm border border-[#141512]">
                      <div>
                        <div className="flex items-center space-x-1.5 text-[6.5px] font-mono font-bold tracking-wider uppercase text-[#C4C0B0]">
                          <Headphones className="w-2.5 h-2.5 text-[#C4C0B0]" />
                          <span>LISTEN TO TABLET</span>
                        </div>
                        <div className="font-serif font-bold text-[9px] leading-tight text-[#FAF8F3] mt-1">
                          The New Moral Panic Isn't About Celebrities
                        </div>
                        <div className="text-[6.5px] font-mono text-[#AAA99B] leading-tight mt-0.5">
                          A 12-minute discussion on cancel culture and public trust.
                        </div>
                      </div>

                      {/* Scrubber & Play Controls */}
                      <div className="pt-2 flex items-center space-x-2">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsPlayingAudio1(!isPlayingAudio1);
                          }}
                          className="w-4 h-4 rounded-full bg-[#FAF8F3] text-[#141512] flex items-center justify-center flex-shrink-0 hover:bg-white active:scale-95 transition-all shadow-sm"
                          title={isPlayingAudio1 ? "Pause Audio" : "Play Audio"}
                        >
                          {isPlayingAudio1 ? <Pause className="w-2 h-2" /> : <Play className="w-2 h-2 ml-0.2" />}
                        </button>
                        <div 
                          onClick={(e) => {
                            e.stopPropagation();
                            const rect = e.currentTarget.getBoundingClientRect();
                            const pos = Math.max(0, Math.min(100, Math.round(((e.clientX - rect.left) / rect.width) * 100)));
                            setAudioProgress1(pos);
                          }}
                          className="flex-1 bg-[#2C2E29] h-1 rounded-full overflow-hidden cursor-pointer"
                        >
                          <div 
                            className={`bg-[#FAF8F3] h-full transition-all duration-150 ${isPlayingAudio1 ? 'animate-pulse' : ''}`}
                            style={{ width: `${audioProgress1}%` }} 
                          />
                        </div>
                        <span className="text-[6.5px] font-mono text-[#AAA99B]">12:34</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 1.5 BOTTOM TIER: 3 Structured Columns matching Image 2 */}
                <div className="grid grid-cols-12 gap-3 pt-3">
                  {/* Col 1: Doran on Wall Street */}
                  <div 
                    onClick={() => handleArticleClick({
                      title: "If Michael Doran Were on Wall Street, He'd Be a Billionaire",
                      deck: "What a foreign policy realist can teach us about markets, risk and conviction.",
                      author: "LEE SMITH",
                      category: "FINANCE",
                      page: "PAGE 14"
                    })}
                    className="col-span-4 border-r border-[#CCC7B8] pr-2 cursor-pointer group flex flex-col justify-between"
                  >
                    <div>
                      <div className="text-[6px] font-mono font-bold uppercase tracking-wider text-[#666] mb-0.5">
                        FINANCE
                      </div>
                      <h4 className="font-serif font-bold text-[9px] leading-tight text-[#141512] group-hover:underline">
                        If Michael Doran Were on Wall Street, He'd Be a Billionaire
                      </h4>
                      <p className="font-serif text-[7.5px] text-[#555] leading-snug mt-0.5">
                        What a foreign policy realist can teach us about markets, risk and conviction.
                      </p>
                    </div>
                    <div className="font-mono text-[6px] text-[#777] uppercase tracking-wider mt-1.5 pt-1 border-t border-[#D5D0C2]">
                      BY ALEX MARSH &nbsp;•&nbsp; PAGE 14
                    </div>
                  </div>

                  {/* Col 2: Jews Could Swing the 2020 Election */}
                  <div 
                    onClick={() => handleArticleClick({
                      title: "Jews Could Swing the 2020 Election",
                      deck: "A closer look at an influential voting bloc and what comes next.",
                      author: "JOEL KOTKIN",
                      category: "POLITICS",
                      page: "PAGE 16"
                    })}
                    className="col-span-4 border-r border-[#CCC7B8] pr-2 cursor-pointer group flex flex-col justify-between"
                  >
                    <div>
                      <div className="text-[6px] font-mono font-bold uppercase tracking-wider text-[#666] mb-0.5">
                        POLITICS
                      </div>
                      <h4 className="font-serif font-bold text-[9px] leading-tight text-[#141512] group-hover:underline">
                        Jews Could Swing the 2020 Election
                      </h4>
                      <p className="font-serif text-[7.5px] text-[#555] leading-snug mt-0.5">
                        A closer look at an influential voting bloc and what comes next.
                      </p>
                    </div>
                    <div className="font-mono text-[6px] text-[#777] uppercase tracking-wider mt-1.5 pt-1 border-t border-[#D5D0C2]">
                      BY NATHAN KLEIN &nbsp;•&nbsp; PAGE 16
                    </div>
                  </div>

                  {/* Col 3: Press Conference Photo + Story */}
                  <div 
                    onClick={() => handleArticleClick({
                      title: "Diplomatic Briefings and Media Conventions",
                      deck: "Inside the closed press conferences that establish national agenda.",
                      author: "WIRE SERVICE",
                      category: "MEDIA",
                      page: "PAGE 18"
                    })}
                    className="col-span-4 cursor-pointer group flex flex-col justify-between"
                  >
                    <div className="w-full h-11 bg-[#12130F] border border-[#141512] overflow-hidden mb-1">
                      <img 
                        src="/images/gazette/voting_press.jpg" 
                        alt="Diplomatic conference briefing" 
                        className="w-full h-full object-cover grayscale contrast-125 brightness-95 group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.target.src = '/images/gazette/press_conference.jpg';
                        }}
                      />
                    </div>
                    <div className="font-mono text-[6px] text-[#777] uppercase tracking-wider pt-0.5">
                      PHOTO WIRE // CAPITOL &nbsp;•&nbsp; PAGE 18
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
            <article className="bg-[#FAF7F0] border border-[#141512] shadow-[0_2px_12px_rgba(0,0,0,0.08)] p-5 md:p-6 text-[#141512] flex flex-col justify-between">
              <div>
                {/* 2.1 Running Header Folio */}
                <div className="flex justify-between items-center text-[7.5px] font-mono tracking-widest text-[#555] uppercase pb-1.5 border-b border-[#141512]">
                  <div className="flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 bg-[#141512] inline-block" />
                    <span>IDEAS • DISCOVERY • A MORE CURIOUS WORLD</span>
                  </div>
                  <div className="font-serif font-bold text-[10px] tracking-wider text-[#141512] uppercase">
                    THE ATHENÆUM GAZETTE
                  </div>
                  <span>VOL. XLII • No. 104 • 09 MAY 2025</span>
                </div>

                {/* 2.2 Bold Editorial Masthead: SCIENCE */}
                <div className="border-b border-[#141512] py-2 mb-3 text-center">
                  <h1 className="font-serif font-black text-[46px] md:text-[52px] uppercase tracking-[-0.02em] leading-none text-[#141512]">
                    SCIENCE
                  </h1>
                </div>

                {/* 2.3 TOP TIER: Inside This Section + Chef Solomonov + Email Archive */}
                <div className="grid grid-cols-12 gap-3 pb-3 border-b border-[#141512]">
                  {/* Left Column (~24%): INSIDE THIS SECTION Terracotta Card */}
                  <div className="col-span-3 bg-[#F8ECE7] border border-[#DEB9AD] p-2 flex flex-col justify-between text-[7px] font-mono">
                    <div>
                      <div className="font-bold text-[6.5px] text-[#B0452E] uppercase tracking-wider mb-1.5 leading-tight">
                        INSIDE THIS SECTION
                      </div>
                      <div className="space-y-1.5 text-[#333]">
                        <div>
                          <div className="font-bold text-[#141512] uppercase text-[6.5px]">FOOD &amp; CULTURE</div>
                          <div className="text-[6px] text-[#555] leading-tight">How migration shapes what we eat</div>
                          <div className="text-[5.5px] text-[#B0452E] font-bold">PAGE 2</div>
                        </div>
                        <div>
                          <div className="font-bold text-[#141512] uppercase text-[6.5px]">TECH &amp; SOCIETY</div>
                          <div className="text-[6px] text-[#555] leading-tight">AI, creativity and human work</div>
                          <div className="text-[5.5px] text-[#B0452E] font-bold">PAGE 4</div>
                        </div>
                        <div>
                          <div className="font-bold text-[#141512] uppercase text-[6.5px]">ENVIRONMENT</div>
                          <div className="text-[6px] text-[#555] leading-tight">A warmer world and shrinking habitats</div>
                          <div className="text-[5.5px] text-[#B0452E] font-bold">PAGE 5</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Center Column (~46%): Chef Michael Solomonov Real Photograph & Story */}
                  <div className="col-span-5 px-1 flex flex-col justify-between">
                    <div 
                      onClick={() => handleArticleClick({
                        title: "Zahav Chef Michael Solomonov a Semifinalist for James Beard Award",
                        deck: "From Philadelphia to Jerusalem, his cooking has always been about memory, migration and the power of food to bring people together.",
                        author: "LILA FERNANDEZ",
                        category: "Culinary History",
                        page: "PAGE 3",
                        fullText: "Chef Michael Solomonov's pioneering work at Zahav continues to redefine culinary diaspora scholarship. By treating culinary recipes as archival artifacts of exile, survival, and regional hospitality, his kitchen bridges centuries of culinary traditions with contemporary culinary rigor."
                      })}
                      className="cursor-pointer group flex flex-col justify-between h-full"
                    >
                      {/* Real Editorial Photograph */}
                      <div className="w-full aspect-[16/10] max-h-[140px] bg-[#12130F] border border-[#141512] overflow-hidden mb-1.5">
                        <img 
                          src="/images/gazette/michael_solomonov.jpg" 
                          alt="Chef Michael Solomonov" 
                          className="w-full h-full object-cover grayscale contrast-125 brightness-95 group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>

                      <h3 className="font-serif font-bold text-[13.5px] leading-tight text-[#141512] group-hover:underline">
                        Zahav Chef Michael Solomonov a Semifinalist for James Beard Award
                      </h3>
                      <p className="font-serif italic text-[7.5px] text-[#444] leading-relaxed mt-0.5">
                        From Philadelphia to Jerusalem, his cooking has always been about memory, migration and the power of food to bring people together.
                      </p>
                      <div className="font-mono text-[6px] text-[#777] uppercase tracking-wider mt-1">
                        BY LILA FERNANDEZ &nbsp;•&nbsp; PAGE 3
                      </div>
                    </div>
                  </div>

                  {/* Right Column (~30%): Jeremy Corbyn Archive & Yiddish Essay */}
                  <div className="col-span-4 pl-2 border-l border-[#CCC7B8] flex flex-col justify-between space-y-2">
                    <div 
                      onClick={() => handleArticleClick({
                        title: "Yiddish, The Jeremy Corbyn Email Archive",
                        deck: "How a leaked trove of emails reveals the inner debates, alliances and unresolved tensions within Britain's left.",
                        author: "SAMUEL PRICE",
                        category: "ARCHIVE",
                        page: "PAGE 7"
                      })}
                      className="cursor-pointer group pb-1.5 border-b border-[#D5D0C2]"
                    >
                      <div className="text-[6px] font-mono font-bold uppercase tracking-wider text-[#B0452E] mb-0.5">
                        ARCHIVE
                      </div>
                      <h4 className="font-serif font-bold text-[9.5px] leading-tight text-[#141512] group-hover:underline">
                        Yiddish, The Jeremy Corbyn Email Archive
                      </h4>
                      <p className="font-serif text-[7px] text-[#555] leading-tight mt-0.5">
                        How a leaked trove of emails reveals the inner debates, alliances and unresolved tensions within Britain's left.
                      </p>
                      <div className="font-mono text-[6px] text-[#888] uppercase tracking-wider mt-0.5">
                        BY SAMUEL PRICE
                      </div>
                    </div>

                    <div 
                      onClick={() => handleArticleClick({
                        title: "The Rabbi Who Helped Me Speak Into Yiddish",
                        deck: "A personal essay on language, belonging and the unexpected places we find our voice.",
                        author: "DAVID STERN",
                        category: "HISTORY",
                        page: "PAGE 9"
                      })}
                      className="cursor-pointer group"
                    >
                      <div className="text-[6px] font-mono font-bold uppercase tracking-wider text-[#B0452E] mb-0.5">
                        HISTORY
                      </div>
                      <h4 className="font-serif font-bold text-[9.5px] leading-tight text-[#141512] group-hover:underline">
                        The Rabbi Who Helped Me Speak Into Yiddish
                      </h4>
                      <p className="font-serif text-[7px] text-[#555] leading-tight mt-0.5">
                        A personal essay on language, belonging and the unexpected places we find our voice.
                      </p>
                      <div className="font-mono text-[6px] text-[#888] uppercase tracking-wider mt-0.5">
                        BY DAVID STERN
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2.4 MIDDLE CENTERPIECE: Isometric Labyrinth Cube + Lost Wisdom & Audio */}
                <div className="grid grid-cols-12 gap-3.5 py-3 border-b border-[#141512]">
                  {/* Left Centerpiece Feature: "Can Islam Be More Jewish?" (~65%) */}
                  <div className="col-span-8 pr-2 border-r border-[#AAA99B] text-center flex flex-col items-center justify-between">
                    <div 
                      onClick={() => handleArticleClick({
                        title: "Can Islam Be More Jewish?",
                        deck: "Two faiths, two histories, and a shared search for meaning in a complicated world. A look at how closer intellectual and cultural ties might reshape the future.",
                        author: "ELI COHEN",
                        category: "THEOLOGY & IDEAS",
                        page: "PAGE 11",
                        fullText: "Maimonides wrote his greatest philosophical treatises in Judeo-Arabic, navigating the intellectual frameworks of Islamic theology while anchoring his jurisprudence in Talmudic tradition. Today, revisiting this fertile historical encounter offers new paradigms for interfaith discourse and reciprocal theological discovery."
                      })}
                      className="cursor-pointer group w-full flex flex-col items-center"
                    >
                      {/* Authentic Isometric Labyrinth Cube matching reference */}
                      <div className="w-34 h-34 bg-[#FAF7F0] border border-[#141512] flex items-center justify-center p-2 my-1 shadow-sm overflow-hidden">
                        <img 
                          src="/images/gazette/labyrinth_cube.jpg" 
                          alt="Isometric labyrinth cube illustration" 
                          className="w-full h-full object-contain grayscale contrast-125 group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>

                      <h3 className="font-serif font-bold text-[18px] md:text-[20px] leading-tight text-[#141512] group-hover:underline mt-1.5">
                        Can Islam Be More Jewish?
                      </h3>
                      <p className="font-serif italic text-[8.5px] text-[#444] leading-relaxed max-w-[420px] mt-0.5">
                        Two faiths, two histories, and a shared search for meaning in a complicated world. A look at how closer intellectual and cultural ties might reshape the future.
                      </p>
                      <div className="font-mono text-[6.5px] text-[#777] uppercase tracking-wider mt-1">
                        BY ELI COHEN &nbsp;•&nbsp; PAGE 11
                      </div>
                    </div>
                  </div>

                  {/* Right: Lost Wisdom + Audio Widget (~35%) */}
                  <div className="col-span-4 flex flex-col justify-between space-y-2">
                    {/* Box 1: LOST WISDOM Card matching Image 2 */}
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

                      {/* 20,800 KPI */}
                      <div className="border-t border-[#DEB9AD] pt-1.5 mt-1.5">
                        <div className="font-serif font-bold text-[22px] text-[#141512] leading-none">
                          20,800
                        </div>
                        <div className="font-mono text-[6px] text-[#666] mt-0.5 leading-tight">
                          Artifacts digitized this year across 12 collections.
                        </div>
                      </div>
                    </div>

                    {/* Box 2: Dark Audio Player Widget matching Image 2 */}
                    <div className="bg-[#181917] text-[#EDEAE2] p-2.5 flex flex-col justify-between shadow-sm border border-[#141512]">
                      <div>
                        <div className="flex items-center space-x-1.5 text-[6.5px] font-mono font-bold tracking-wider uppercase text-[#C4C0B0]">
                          <Headphones className="w-2.5 h-2.5 text-[#C4C0B0]" />
                          <span>LISTEN TO TABLET</span>
                        </div>
                        <div className="font-serif font-bold text-[9px] leading-tight text-[#FAF8F3] mt-1">
                          What Can Faiths Learn From Each Other?
                        </div>
                        <div className="text-[6.5px] font-mono text-[#AAA99B] leading-tight mt-0.5">
                          Episode 195: 15-minute conversation on history, religion and coexistence.
                        </div>
                      </div>

                      {/* Scrubber & Play Controls */}
                      <div className="pt-2 flex items-center space-x-2">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsPlayingAudio2(!isPlayingAudio2);
                          }}
                          className="w-4 h-4 rounded-full bg-[#FAF8F3] text-[#141512] flex items-center justify-center flex-shrink-0 hover:bg-white active:scale-95 transition-all shadow-sm"
                          title={isPlayingAudio2 ? "Pause Audio" : "Play Audio"}
                        >
                          {isPlayingAudio2 ? <Pause className="w-2 h-2" /> : <Play className="w-2 h-2 ml-0.2" />}
                        </button>
                        <div 
                          onClick={(e) => {
                            e.stopPropagation();
                            const rect = e.currentTarget.getBoundingClientRect();
                            const pos = Math.max(0, Math.min(100, Math.round(((e.clientX - rect.left) / rect.width) * 100)));
                            setAudioProgress2(pos);
                          }}
                          className="flex-1 bg-[#2C2E29] h-1 rounded-full overflow-hidden cursor-pointer"
                        >
                          <div 
                            className={`bg-[#FAF8F3] h-full transition-all duration-150 ${isPlayingAudio2 ? 'animate-pulse' : ''}`}
                            style={{ width: `${audioProgress2}%` }} 
                          />
                        </div>
                        <span className="text-[6.5px] font-mono text-[#AAA99B]">15:27</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2.5 BOTTOM TIER: Neuroscience, Machine Learning for Texts, Papers Please */}
                <div className="grid grid-cols-12 gap-3 pt-3">
                  {/* Col 1: NEUROSCIENCE (~33%) */}
                  <div 
                    onClick={() => handleArticleClick({
                      title: "Mapping Memory in a Noisy World",
                      deck: "New research suggests the brain filters rather than stores most of what we experience.",
                      author: "MARIA CHEN",
                      category: "NEUROSCIENCE",
                      page: "PAGE 13",
                      fullText: "Recent neuro-imaging breakthroughs at the Max Planck Institute reveal that cognitive retention operates as an active gating mechanism. Rather than functioning as a digital camera capturing sensory surplus, neural circuits deliberately attenuate high-frequency environmental noise to preserve semantic salience."
                    })}
                    className="col-span-4 border-r border-[#CCC7B8] pr-2 cursor-pointer group flex flex-col justify-between"
                  >
                    <div>
                      <div className="text-[6px] font-mono font-bold uppercase tracking-wider text-[#B0452E] mb-0.5">
                        NEUROSCIENCE
                      </div>
                      <h4 className="font-serif font-bold text-[9px] leading-tight text-[#141512] group-hover:underline">
                        Mapping Memory in a Noisy World
                      </h4>
                      <p className="font-serif text-[7px] text-[#555] leading-snug mt-0.5">
                        New research suggests the brain filters rather than stores most of what we experience.
                      </p>
                    </div>

                    <div className="flex items-center space-x-2 mt-1.5 pt-1 border-t border-[#D5D0C2]">
                      <div className="w-8 h-8 bg-[#12130F] border border-[#141512] flex-shrink-0 overflow-hidden">
                        <img 
                          src="/images/gazette/brain_scan.jpg" 
                          alt="Brain scan MRI" 
                          className="w-full h-full object-cover grayscale contrast-125"
                        />
                      </div>
                      <div className="font-mono text-[5.5px] text-[#777] uppercase tracking-wider">
                        BY MARIA CHEN &nbsp;•&nbsp; PAGE 13
                      </div>
                    </div>
                  </div>

                  {/* Col 2: TECHNOLOGY (~33%) */}
                  <div 
                    onClick={() => handleArticleClick({
                      title: "Machine Learning for Ancient Texts",
                      deck: "AI is helping scholars restore damaged manuscripts and uncover lost histories.",
                      author: "RAHUL MEHTA",
                      category: "TECHNOLOGY",
                      page: "PAGE 15",
                      fullText: "Palimpsests and carbonized papyri from Herculaneum and Oxyrhynchus are being reconstituted through 3D synchrotron tomography and transformer neural architectures, revealing lost Greek philosophic dialogues previously thought erased forever."
                    })}
                    className="col-span-4 border-r border-[#CCC7B8] pr-2 cursor-pointer group flex flex-col justify-between"
                  >
                    <div>
                      <div className="text-[6px] font-mono font-bold uppercase tracking-wider text-[#B0452E] mb-0.5">
                        TECHNOLOGY
                      </div>
                      <h4 className="font-serif font-bold text-[9px] leading-tight text-[#141512] group-hover:underline">
                        Machine Learning for Ancient Texts
                      </h4>
                      <p className="font-serif text-[7px] text-[#555] leading-snug mt-0.5">
                        AI is helping scholars restore damaged manuscripts and uncover lost histories.
                      </p>
                    </div>

                    <div className="flex items-center space-x-2 mt-1.5 pt-1 border-t border-[#D5D0C2]">
                      <div className="w-8 h-8 bg-[#12130F] border border-[#141512] flex-shrink-0 overflow-hidden">
                        <img 
                          src="/images/gazette/ancient_manuscript.jpg" 
                          alt="Ancient manuscript archive" 
                          className="w-full h-full object-cover grayscale contrast-125"
                        />
                      </div>
                      <div className="font-mono text-[5.5px] text-[#777] uppercase tracking-wider">
                        BY RAHUL MEHTA &nbsp;•&nbsp; PAGE 15
                      </div>
                    </div>
                  </div>

                  {/* Col 3: GAMES & CULTURE (~34%) */}
                  <div 
                    onClick={() => handleArticleClick({
                      title: "Papers, Please: A Video Game With No Shootouts or Theft—Only the Banality of Evil",
                      deck: "How a simple border checkpoint simulator became one of the most powerful political games of the decade.",
                      author: "TOM WALKER",
                      category: "GAMES & CULTURE",
                      page: "PAGE 17",
                      fullText: "Lucas Pope's indie masterpiece places players behind the bureaucratic stamp-booth of the fictional totalitarian state of Arstotzka. In forcing users to weigh bureaucratic compliance against desperate human empathy, it captures Hannah Arendt's formulation of systemic complicity more vividly than any contemporary film."
                    })}
                    className="col-span-4 cursor-pointer group flex flex-col justify-between"
                  >
                    <div>
                      <div className="text-[6px] font-mono font-bold uppercase tracking-wider text-[#B0452E] mb-0.5">
                        GAMES &amp; CULTURE
                      </div>
                      <h4 className="font-serif font-bold text-[9px] leading-tight text-[#141512] group-hover:underline">
                        Papers, Please: A Game With Only the Banality of Evil
                      </h4>
                      <p className="font-serif text-[7px] text-[#555] leading-snug mt-0.5">
                        How a simple border checkpoint simulator became a profound political work.
                      </p>
                    </div>

                    <div className="flex items-center space-x-2 mt-1.5 pt-1 border-t border-[#D5D0C2]">
                      <div className="w-8 h-8 bg-[#12130F] border border-[#141512] flex-shrink-0 overflow-hidden">
                        <img 
                          src="/images/gazette/border_checkpoint.jpg" 
                          alt="Border checkpoint inspection silhouette" 
                          className="w-full h-full object-cover grayscale contrast-125"
                        />
                      </div>
                      <div className="font-mono text-[5.5px] text-[#777] uppercase tracking-wider">
                        BY TOM WALKER &nbsp;•&nbsp; PAGE 17
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </article>
          )}

        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. ELEGANT BROADSHEET ARTICLE READING MODAL (UX)                          */}
      {/* ========================================================================= */}
      {activeArticleModal && (
        <div 
          onClick={() => setActiveArticleModal(null)}
          className="fixed inset-0 bg-black/75 backdrop-blur-[2px] z-50 flex items-center justify-center p-4 select-text"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-[#FAF7F0] border-2 border-[#141512] shadow-2xl max-w-2xl w-full p-6 sm:p-8 text-[#141512] font-serif space-y-4 max-h-[90vh] overflow-y-auto"
          >
            {/* Modal Header */}
            <div className="flex justify-between items-center border-b border-[#141512] pb-2 font-mono text-[8px] text-[#666]">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-[#B0452E] inline-block" />
                <span className="uppercase tracking-widest font-bold text-[#141512]">
                  ATHENÆUM GAZETTE ARCHIVAL DISPATCH // {activeArticleModal.page || 'BROADSHEET'}
                </span>
              </div>
              <button 
                onClick={() => setActiveArticleModal(null)}
                className="hover:text-black font-bold uppercase tracking-wider text-[9px] px-2 py-0.5 hover:bg-[#EAE7D9] transition-colors"
              >
                ✕ ESC CLOSE
              </button>
            </div>

            {/* Article Heading & Metadata */}
            <div>
              <span className="text-[8px] font-mono font-bold uppercase tracking-wider text-[#B0452E]">
                {activeArticleModal.category || 'Gazette Dispatch'}
              </span>
              <h2 className="font-serif font-bold text-[24px] sm:text-[28px] leading-tight text-[#141512] mt-1">
                {activeArticleModal.title}
              </h2>
              <div className="text-[8.5px] font-mono text-[#666] uppercase tracking-wider mt-2 pb-2.5 border-b border-[#D5D0C2] flex items-center justify-between">
                <span>BY {activeArticleModal.author || 'Gazette Staff'} • MAY 2025 EDITION</span>
                <span>VOL. XLII // ARCHIVAL ISSUE 104</span>
              </div>
            </div>

            {/* Subtitle / Deck */}
            <p className="font-serif italic text-[13px] text-[#2E2E2A] leading-relaxed border-l-2 border-[#B0452E] pl-3 py-0.5">
              {activeArticleModal.deck}
            </p>

            {/* Full Body Content */}
            <div className="text-[11px] font-serif text-[#33322B] leading-relaxed space-y-3 pt-2 border-t border-[#D5D0C2]">
              <p>
                {activeArticleModal.fullText || (
                  `Reprinted from the archival broadsheet edition of The Athenæum Gazette. This record represents critical primary literature curated for research, contextual inquiry, and cross-disciplinary analysis.`
                )}
              </p>
              <p>
                As part of the institutional digital preservation initiative, full texts, associated wire dispatch imagery, and contextual commentary are indexed locally within the Athenæum vault.
              </p>
            </div>

            {/* Action Bar: File to Archive, Share Citation, Return */}
            <div className="pt-4 border-t border-[#141512] flex flex-wrap gap-2 justify-between items-center font-mono text-[8.5px]">
              <div className="flex items-center space-x-2">
                <button
                  onClick={(e) => handleSaveToArchive(e, activeArticleModal)}
                  className={`px-3 py-1.5 font-bold uppercase tracking-wider transition-colors flex items-center space-x-1.5 ${
                    savedArticles.has(activeArticleModal.title)
                      ? 'bg-[#74866A] text-white cursor-default'
                      : 'bg-[#141512] text-[#FAF8F3] hover:bg-[#333]'
                  }`}
                >
                  {savedArticles.has(activeArticleModal.title) ? (
                    <>
                      <Check className="w-3 h-3" />
                      <span>CATALOGED IN ARCHIVE</span>
                    </>
                  ) : (
                    <>
                      <Bookmark className="w-3 h-3" />
                      <span>FILE TO MY ENTRIES</span>
                    </>
                  )}
                </button>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    navigator.clipboard?.writeText?.(
                      `"${activeArticleModal.title}", by ${activeArticleModal.author}. The Athenæum Gazette, Vol. XLII, May 2025.`
                    );
                    if (showToast) showToast('Citation copied to clipboard!');
                  }}
                  className="px-2.5 py-1.5 border border-[#141512] text-[#141512] hover:bg-[#EAE7D9] transition-colors uppercase font-bold"
                >
                  COPY CITATION
                </button>
                <button
                  onClick={() => setActiveArticleModal(null)}
                  className="px-3 py-1.5 bg-[#FAF8F3] text-[#141512] border border-[#141512] font-bold uppercase tracking-wider hover:bg-[#EAE7D9] transition-colors"
                >
                  CLOSE
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
