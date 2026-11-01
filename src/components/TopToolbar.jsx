import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Columns, 
  Grid, 
  Maximize2, 
  Minimize2, 
  Minus, 
  Square, 
  X, 
  Clock, 
  SidebarClose, 
  SidebarOpen,
  Menu
} from 'lucide-react';

export function TopToolbar({ 
  onOpenNewRecord, 
  isInspectorOpen, 
  onToggleInspector,
  onToggleFullscreen,
  isFullscreen,
  viewMode,
  setViewMode,
  onToggleMobileSidebar
}) {
  const [timeStr, setTimeStr] = useState('10:24:37');
  const [isLiveClock, setIsLiveClock] = useState(false);

  useEffect(() => {
    if (!isLiveClock) {
      setTimeStr('10:24:37');
      return;
    }
    const update = () => {
      const now = new Date();
      const h = String(now.getHours()).padStart(2, '0');
      const m = String(now.getMinutes()).padStart(2, '0');
      const s = String(now.getSeconds()).padStart(2, '0');
      setTimeStr(`${h}:${m}:${s}`);
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [isLiveClock]);

  return (
    <header className="h-9 bg-[#E9E5D8] border-b border-[#AAA99B] px-2 sm:px-3 flex items-center justify-between text-xs font-mono text-[#25251F] select-none flex-shrink-0">
      {/* Left: Mobile Menu & Archival Date & Time */}
      <div className="flex items-center space-x-1.5 sm:space-x-2 text-[10px] sm:text-[11px] tracking-wide">
        {/* Mobile Sidebar Hamburger Button */}
        <button
          onClick={onToggleMobileSidebar}
          className="md:hidden p-1 border border-[#AAA99B] bg-[#DFDBD0] hover:bg-[#D4D0C3] active:bg-[#C9C4B7] text-[#25251F] flex items-center justify-center mr-0.5"
          title="Open Navigation"
        >
          <Menu className="w-3.5 h-3.5 text-[#25251F]" />
        </button>

        <span className="font-semibold text-[#1C1E19]">09 MAY 2025</span>
        <span className="text-[#88877A] hidden xs:inline">•</span>
        <button
          onClick={() => setIsLiveClock(!isLiveClock)}
          title="Click to toggle reference freeze / live local clock"
          className="hover:text-[#5E6B56] transition-colors items-center space-x-1 hidden xs:flex"
        >
          <span className="font-mono">{timeStr}</span>
          {isLiveClock && <span className="w-1.5 h-1.5 bg-[#738A62] rounded-full inline-block"></span>}
        </button>
      </div>

      {/* Right Controls */}
      <div className="flex items-center space-x-2.5">
        {/* + NEW RECORD Button */}
        <button
          onClick={onOpenNewRecord}
          className="border border-[#AAA99B] bg-[#DFDBD0] hover:bg-[#D4D0C3] active:bg-[#C9C4B7] text-[#25251F] px-2.5 py-0.5 text-[10.5px] font-semibold tracking-wider flex items-center space-x-1 shadow-[0_1px_0_rgba(0,0,0,0.05)] transition-colors rounded-[1px]"
        >
          <Plus className="w-3 h-3 text-[#25251F]" strokeWidth={2.5} />
          <span>NEW RECORD</span>
        </button>

        {/* View Mode & Panel Toggles */}
        <div className="flex items-center border border-[#AAA99B] divide-x divide-[#AAA99B] bg-[#DFDBD0]">
          <button
            onClick={() => setViewMode(viewMode === 'default' ? 'compact' : 'default')}
            title="Toggle Layout Density"
            className={`p-1 hover:bg-[#D4D0C3] transition-colors ${viewMode === 'compact' ? 'bg-[#C7C3B5]' : ''}`}
          >
            <Columns className="w-3 h-3 text-[#3B3A33]" strokeWidth={1.8} />
          </button>
          
          <button
            onClick={onToggleInspector}
            title={isInspectorOpen ? "Hide Inspector Panel" : "Show Inspector Panel"}
            className={`p-1 hover:bg-[#D4D0C3] transition-colors ${!isInspectorOpen ? 'bg-[#C7C3B5]' : ''}`}
          >
            {isInspectorOpen ? (
              <SidebarClose className="w-3 h-3 text-[#3B3A33]" strokeWidth={1.8} />
            ) : (
              <SidebarOpen className="w-3 h-3 text-[#3B3A33]" strokeWidth={1.8} />
            )}
          </button>
        </div>

        {/* Window Controls */}
        <div className="flex items-center space-x-1 pl-1 border-l border-[#AAA99B]">
          <button 
            className="w-5 h-5 flex items-center justify-center hover:bg-[#DDD8CB] text-[#55544B] transition-colors"
            title="Minimize"
          >
            <Minus className="w-3 h-3" strokeWidth={1.8} />
          </button>
          <button 
            onClick={onToggleFullscreen}
            className="w-5 h-5 flex items-center justify-center hover:bg-[#DDD8CB] text-[#55544B] transition-colors"
            title={isFullscreen ? "Restore window" : "Maximize window"}
          >
            <Square className="w-2.5 h-2.5" strokeWidth={1.8} />
          </button>
          <button 
            className="w-5 h-5 flex items-center justify-center hover:bg-[#C97B74] hover:text-white text-[#55544B] transition-colors"
            title="Close"
          >
            <X className="w-3 h-3" strokeWidth={1.8} />
          </button>
        </div>
      </div>
    </header>
  );
}

