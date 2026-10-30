import React from 'react';
import { Database, ShieldCheck, HardDrive, Wifi } from 'lucide-react';

export function BottomStatusBar() {
  return (
    <footer className="h-6 bg-[#11130F] text-[#AAA99B] border-t border-[#262922] px-3 flex items-center justify-between text-[9px] font-mono select-none flex-shrink-0 z-10">
      {/* Left Item */}
      <div className="flex items-center space-x-2">
        <Database className="w-2.5 h-2.5 text-[#77766B]" />
        <span className="text-[#77766B]">LOCAL DATABASE:</span>
        <span className="text-[#D6D4C8] font-medium">athenaeum.db</span>
      </div>

      {/* Center Item */}
      <div className="flex items-center space-x-1.5">
        <span className="text-[#77766B]">LAST BACKUP:</span>
        <span className="text-[#D6D4C8]">09 May 2025 08:24</span>
        <span className="w-1.5 h-1.5 rounded-full bg-[#738A62] inline-block animate-pulse"></span>
      </div>

      {/* Right Item */}
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-1.5">
          <ShieldCheck className="w-2.5 h-2.5 text-[#738A62]" />
          <span className="text-[#77766B]">DATA INTEGRITY:</span>
          <span className="text-[#738A62] font-semibold">OK</span>
        </div>
        <div className="hidden md:flex items-center space-x-2 text-[#57594F] border-l border-[#22251E] pl-2">
          <span>PORT: 5173</span>
          <span>UTF-8</span>
          <Wifi className="w-2.5 h-2.5 text-[#738A62]" />
        </div>
      </div>
    </footer>
  );
}

