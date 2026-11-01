import React from 'react';
import { 
  LayoutDashboard, 
  FolderGit2, 
  CheckSquare, 
  FileText, 
  Layers, 
  Users, 
  MapPin, 
  Archive, 
  Calendar, 
  BookOpen, 
  Newspaper,
  Search, 
  Settings,
  MoreHorizontal,
  LogOut,
  X
} from 'lucide-react';
import { AthenaeumLogo } from './AthenaeumLogo';
import { RECENT_VIEWS } from '../data/mockData';
import { useAuth } from '../context/AuthContext';

export function Sidebar({ 
  activeNav, 
  setActiveNav, 
  onSelectRecentView,
  onOpenSearch,
  onOpenSettings,
  isMobileOpen = false,
  onCloseMobile
}) {
  const { currentUser, logout } = useAuth();
  const navItems = [
    { id: 'dashboard', label: 'DASHBOARD', icon: LayoutDashboard },
    { id: 'works', label: 'WORKS', icon: FolderGit2 },
    { id: 'actions', label: 'ACTIONS', icon: CheckSquare },
    { id: 'entries', label: 'ENTRIES', icon: FileText },
    { id: 'collections', label: 'COLLECTIONS', icon: Layers },
    { id: 'people', label: 'PEOPLE', icon: Users },
    { id: 'places', label: 'PLACES', icon: MapPin },
    { id: 'resources', label: 'RESOURCES', icon: Archive },
    { id: 'calendar', label: 'CALENDAR', icon: Calendar },
    { id: 'daily-log', label: 'DAILY LOG', icon: BookOpen },
    { id: 'news', label: 'NEWS', icon: Newspaper },
    { id: 'search', label: 'SEARCH', icon: Search, action: onOpenSearch },
  ];

  const handleNavClick = (item) => {
    if (item.action) {
      item.action();
    } else {
      setActiveNav(item.id);
    }
    if (onCloseMobile) onCloseMobile();
  };

  const handleRecentViewClick = (name) => {
    if (onSelectRecentView) onSelectRecentView(name);
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-[1px] z-40 md:hidden animate-fadeIn"
          onClick={onCloseMobile}
        />
      )}

      <aside className={`
        ${isMobileOpen 
          ? 'fixed inset-y-0 left-0 z-50 w-64 shadow-2xl flex flex-col justify-between h-full' 
          : 'hidden md:flex md:w-60 md:min-w-[230px] md:max-w-[260px] md:static'}
        bg-[#11130F] text-[#AAA99B] border-r border-[#262922] select-none text-xs font-mono transition-transform duration-200
      `}>
        {/* Upper Area */}
        <div className="flex flex-col p-2.5 space-y-2.5 overflow-y-auto">
          {/* Brand & Logo Header */}
          <div className="flex items-center justify-between pb-1 border-b border-[#262922]">
            <div className="flex items-center space-x-2">
              <AthenaeumLogo className="w-7 h-7 text-[#AAA99B] flex-shrink-0" />
              <div className="flex flex-col">
                <span className="font-serif tracking-[0.16em] text-[13px] text-[#E9E5D8] font-bold leading-none">
                  ATHENÆUM
                </span>
                <span className="text-[7px] text-[#77766B] tracking-wider mt-1 uppercase leading-tight font-mono">
                  Personal Archive &amp; Creative Workspace
                </span>
              </div>
            </div>

            {/* Mobile Close Button */}
            {onCloseMobile && (
              <button 
                onClick={onCloseMobile}
                className="md:hidden text-[#77766B] hover:text-[#E9E5D8] p-1 border border-[#262922] hover:bg-[#1E211A] transition-colors"
                title="Close Navigation"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

        {/* Active Curator Profile Badge */}
        {currentUser && (
          <div className="border border-[#2B2E27] bg-[#141712] p-2 space-y-1">
            <div className="flex items-center justify-between text-[7px] text-[#77766B] uppercase tracking-wider pb-1 border-b border-[#22251E] font-medium">
              <span>ACTIVE CURATOR</span>
              <button 
                onClick={logout} 
                className="text-[#9A3B3B] hover:text-[#C97B74] uppercase text-[6.5px] font-bold tracking-wider hover:underline flex items-center space-x-0.5"
                title="Sign out of current vault"
              >
                <span>SIGN OUT</span>
              </button>
            </div>
            <div className="flex items-center space-x-2 pt-0.5">
              <div className="w-5 h-5 rounded-full bg-[#2E3D2A] text-[#FAF8F3] text-[8px] font-bold flex items-center justify-center font-mono flex-shrink-0">
                {currentUser.name ? currentUser.name.slice(0, 2).toUpperCase() : 'CU'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[8.5px] text-[#E9E5D8] font-bold truncate">
                  {currentUser.name}
                </div>
                <div className="text-[6.5px] text-[#8C8B7E] truncate">
                  {currentUser.operatorId || 'OPR-VAULT'} · {currentUser.clearance || 'LEVEL 1'}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Institution Status Box */}
        <div className="border border-[#2B2E27] bg-[#141712] p-2 space-y-1">
          <div className="flex items-center justify-between text-[7px] text-[#77766B] uppercase tracking-wider pb-1 border-b border-[#22251E] font-medium">
            <span>INSTITUTION STATUS</span>
            <span className="text-[#5A5D54] tracking-widest text-[8px]">•••</span>
          </div>
          <div className="text-[7.5px] text-[#8C8B7E] pt-0.5">
            LOCAL MODE
          </div>
          <div className="flex justify-between items-center text-[7.5px] text-[#8C8B7E]">
            <span>DATA INTEGRITY</span>
            <span className="flex items-center space-x-1">
              <span className="text-[#AAA99B] text-[7.5px]">OK</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#738A62] inline-block"></span>
            </span>
          </div>
        </div>

        {/* Navigation Section */}
        <div className="space-y-0.5">
          <div className="text-[8.5px] uppercase tracking-wider text-[#68675C] px-1 font-medium pb-0.5">
            NAVIGATION
          </div>
          <nav className="space-y-0.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeNav === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item)}
                  className={`w-full flex items-center space-x-2.5 px-2 py-1 transition-all duration-100 text-left text-[10px] rounded-[1px] ${
                    isActive
                      ? 'bg-[#E9E5D8] text-[#1E201B] font-semibold shadow-sm'
                      : 'text-[#9A988B] hover:text-[#E9E5D8] hover:bg-[#1A1D17]'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 flex-shrink-0 ${isActive ? 'text-[#1E201B]' : 'text-[#77766B]'}`} strokeWidth={1.75} />
                  <span className="tracking-wide text-[10px]">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Recent Views Section */}
        <div className="pt-2 border-t border-[#22251E] space-y-1">
          <div className="text-[8.5px] uppercase tracking-wider text-[#68675C] px-1 font-medium">
            RECENT VIEWS
          </div>
          <div className="space-y-0.5 text-[9px]">
            {RECENT_VIEWS.map((view, i) => (
              <button
                key={i}
                onClick={() => handleRecentViewClick(view)}
                className="w-full text-left px-1.5 py-0.5 flex items-center space-x-1.5 text-[#7E7D72] hover:text-[#E9E5D8] hover:bg-[#161914] truncate transition-colors"
              >
                <span className="text-[#57594F] text-[8px]">•</span>
                <span className="truncate">{view}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* System Panel (Bottom) */}
      <div className="p-2.5 border-t border-[#262922] bg-[#0E100D] space-y-1.5">
        <div className="text-[8px] uppercase tracking-wider text-[#68675C] font-medium">
          SYSTEM PANEL
        </div>
        
        {/* Metric bars */}
        <div className="space-y-1.5 text-[9px]">
          <div className="flex items-center justify-between text-[#8A897D]">
            <span>FILES</span>
            <div className="flex items-center space-x-2">
              <div className="w-12 h-1 bg-[#23271F] overflow-hidden">
                <div className="h-full bg-[#77796C] w-[62%]"></div>
              </div>
              <span className="text-[#AAA99B] font-mono text-[8.5px]">1,482</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-[#8A897D]">
            <span>STORAGE</span>
            <div className="flex items-center space-x-2">
              <div className="w-12 h-1 bg-[#23271F] overflow-hidden">
                <div className="h-full bg-[#77796C] w-[45%]"></div>
              </div>
              <span className="text-[#AAA99B] font-mono text-[8.5px]">12.7 GB</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-[#8A897D]">
            <span>BACKUP</span>
            <div className="flex items-center space-x-1.5">
              <span className="text-[#8A897D] text-[8.5px]">2h ago</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#738A62]"></span>
            </div>
          </div>
        </div>

        {/* Footer version & settings */}
        <div className="pt-1.5 border-t border-[#1C1F18] flex items-center justify-between text-[8.5px] text-[#6E7065]">
          <span>ATHENAEUM v0.1.0</span>
          <button 
            onClick={() => {
              if (onOpenSettings) onOpenSettings();
              if (onCloseMobile) onCloseMobile();
            }}
            title="System Settings"
            className="text-[#6E7065] hover:text-[#AAA99B] transition-colors p-0.5"
          >
            <Settings className="w-3 h-3" strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </aside>
    </>
  );
}
