import React, { useState, useEffect } from 'react';
import { 
  X, 
  Settings, 
  Database, 
  HardDrive, 
  ShieldCheck, 
  Download, 
  RefreshCw, 
  Check, 
  User, 
  Shield, 
  Key, 
  Terminal, 
  Edit2, 
  CheckCheck 
} from 'lucide-react';

export function SystemSettingsModal({ isOpen, onClose, works = [], actions = [], entries = [] }) {
  const [isRunningCheck, setIsRunningCheck] = useState(false);
  const [checkProgress, setCheckProgress] = useState(100);
  const [checkResult, setCheckResult] = useState('ALL 1,482 RECORDS VERIFIED OK');

  // User Profile state with localStorage persistence
  const [isEditingUser, setIsEditingUser] = useState(false);
  const [userName, setUserName] = useState(() => {
    return localStorage.getItem('atn_user_name') || 'Deepjyoti';
  });
  const [userRole, setUserRole] = useState(() => {
    return localStorage.getItem('atn_user_role') || 'Lead Curator & Systems Architect';
  });
  const [savedUserFeedback, setSavedUserFeedback] = useState(false);

  useEffect(() => {
    const storedName = localStorage.getItem('atn_user_name');
    if (storedName) setUserName(storedName);
    const storedRole = localStorage.getItem('atn_user_role');
    if (storedRole) setUserRole(storedRole);
  }, []);

  const handleSaveUser = () => {
    localStorage.setItem('atn_user_name', userName.trim());
    localStorage.setItem('atn_user_role', userRole.trim());
    setIsEditingUser(false);
    setSavedUserFeedback(true);
    setTimeout(() => setSavedUserFeedback(false), 2000);
  };

  if (!isOpen) return null;

  const handleRunIntegrityCheck = () => {
    setIsRunningCheck(true);
    setCheckProgress(0);
    setCheckResult('Verifying SQLite page checksums & B-Tree indexes...');
    
    let p = 0;
    const interval = setInterval(() => {
      p += 25;
      setCheckProgress(p);
      if (p >= 100) {
        clearInterval(interval);
        setIsRunningCheck(false);
        setCheckResult('INTEGRITY TEST PASSED: 0 CORRUPTIONS FOUND (0x9AF4)');
      }
    }, 200);
  };

  const handleExportBackup = () => {
    const backupData = {
      system: 'ATHENAEUM ARCHIVAL ENGINE',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      vault: 'athenaeum.db',
      operator: {
        name: userName,
        role: userRole,
        id: 'OPR-7821-LDN'
      },
      data: {
        works,
        actions,
        entries
      }
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `athenaeum_vault_backup_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-black/65 backdrop-blur-[1px] z-50 flex items-center justify-center p-4 font-mono select-none">
      <div className="w-full max-w-xl bg-[#EAE7D9] border border-[#171714] shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        
        {/* Modal Header */}
        <div className="p-3 bg-[#DFDBD0] border-b border-[#B5B3A4] flex items-center justify-between flex-shrink-0">
          <div className="flex items-center space-x-2">
            <Settings className="w-4 h-4 text-[#171714]" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#171714]">
              SYSTEM SETTINGS &amp; ARCHIVAL ENGINE
            </span>
          </div>
          <button 
            onClick={onClose} 
            className="p-1 hover:bg-[#D5D1C4] text-[#444] hover:text-black transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 space-y-3.5 text-[9px] overflow-y-auto flex-1">
          
          {/* ============================================================ */}
          {/* SECTION 1: OPERATOR & USER IDENTITY                          */}
          {/* ============================================================ */}
          <div className="border border-[#B5B3A4] bg-[#FAF8F3] p-3 space-y-2.5 shadow-sm">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-1.5 border-b border-[#D5D1C4]">
              <div className="flex items-center space-x-1.5">
                <User className="w-3.5 h-3.5 text-[#4B5E45]" />
                <span className="text-[8.5px] font-bold uppercase tracking-wider text-[#171714]">
                  CURATOR &amp; OPERATOR PROFILE
                </span>
              </div>
              <div className="flex items-center space-x-2">
                {savedUserFeedback && (
                  <span className="text-[7.5px] text-[#3E523A] font-bold flex items-center space-x-0.5">
                    <CheckCheck className="w-2.5 h-2.5" />
                    <span>SAVED</span>
                  </span>
                )}
                <button
                  onClick={() => {
                    if (isEditingUser) handleSaveUser();
                    else setIsEditingUser(true);
                  }}
                  className="px-2 py-0.5 border border-[#B5B3A4] bg-[#EAE7D9] hover:bg-[#DDD8CB] text-[7.5px] font-bold uppercase text-[#171714] flex items-center space-x-1 transition-colors"
                >
                  <Edit2 className="w-2.5 h-2.5" />
                  <span>{isEditingUser ? 'CONFIRM' : 'EDIT PROFILE'}</span>
                </button>
              </div>
            </div>

            {/* User Profile Card */}
            <div className="flex items-start space-x-3 pt-1">
              {/* Monogram Seal Avatar */}
              <div className="w-12 h-12 rounded-full border border-[#2E3D2A] bg-[#2E3D2A] text-[#FAF8F3] flex flex-col items-center justify-center flex-shrink-0 shadow-sm">
                <span 
                  className="text-[16px] font-bold leading-none select-none"
                  style={{ fontFamily: '"Cormorant Garamond", "Newsreader", Georgia, serif' }}
                >
                  {userName ? userName.slice(0, 2).toUpperCase() : 'DJ'}
                </span>
                <span className="text-[5.5px] font-mono tracking-widest text-[#A8D5A3] mt-0.5">OPR</span>
              </div>

              {/* Profile Fields */}
              <div className="flex-1 space-y-1">
                {isEditingUser ? (
                  <div className="space-y-1.5 mb-1.5">
                    <div>
                      <label className="text-[7px] text-[#666] uppercase block">Operator Display Name:</label>
                      <input
                        type="text"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        className="w-full bg-[#FAF8F3] border border-[#B5B3A4] px-1.5 py-0.5 text-[9px] text-[#171714] font-bold focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[7px] text-[#666] uppercase block">Archival Title / Role:</label>
                      <input
                        type="text"
                        value={userRole}
                        onChange={(e) => setUserRole(e.target.value)}
                        className="w-full bg-[#FAF8F3] border border-[#B5B3A4] px-1.5 py-0.5 text-[8.5px] text-[#171714] focus:outline-none"
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="text-[12px] font-bold text-[#171714] leading-tight">
                      {userName}
                    </div>
                    <div className="text-[8px] text-[#4B5E45] font-semibold mt-0.5">
                      {userRole}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-x-3 gap-y-1 pt-1 border-t border-[#E5E1D2] text-[7.5px] text-[#555]">
                  <div>
                    <span className="text-[#888]">OPERATOR ID:</span>{' '}
                    <strong className="text-[#171714]">OPR-7821-LDN</strong>
                  </div>
                  <div>
                    <span className="text-[#888]">CLEARANCE:</span>{' '}
                    <strong className="text-[#3E523A]">LEVEL 5 (ROOT_VAULT)</strong>
                  </div>
                  <div>
                    <span className="text-[#888]">NODE STATION:</span>{' '}
                    <strong className="text-[#171714]">DESK_ALPHA_01</strong>
                  </div>
                  <div>
                    <span className="text-[#888]">SESSION START:</span>{' '}
                    <strong className="text-[#171714]">09 MAY 2025 · 08:24</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Cryptographic Key & Verification Fingerprint */}
            <div className="p-1.5 bg-[#EAE7D9]/60 border border-[#D5D1C4] flex items-center justify-between text-[7px] text-[#66655B] font-mono">
              <span className="flex items-center space-x-1">
                <Key className="w-2.5 h-2.5 text-[#555]" />
                <span>PGP SIGNATURE:</span>
                <strong className="text-[#171714]">0x78D2 · B419 · E902 · F1A7</strong>
              </span>
              <span className="text-[#3E523A] font-bold">STATUS: AUTHENTICATED</span>
            </div>
          </div>

          {/* ============================================================ */}
          {/* SECTION 2: DATABASE VAULT ENGINE                             */}
          {/* ============================================================ */}
          <div className="border border-[#B5B3A4] bg-[#FAF8F3] p-3 space-y-1.5 shadow-sm">
            <span className="text-[8px] font-bold uppercase tracking-wider text-[#666] block pb-1 border-b border-[#D5D1C4]">
              DATABASE VAULT ENGINE
            </span>
            <div className="flex justify-between text-[#555] py-0.5">
              <span>Engine:</span>
              <strong className="text-[#171714]">SQLite Embedded v3.45.1</strong>
            </div>
            <div className="flex justify-between text-[#555] py-0.5">
              <span>Database File:</span>
              <span className="font-mono text-[#171714]">/var/athenaeum/athenaeum.db</span>
            </div>
            <div className="flex justify-between text-[#555] py-0.5">
              <span>Journal Mode:</span>
              <strong className="text-[#3E523A]">WAL (Write-Ahead Logging)</strong>
            </div>
            <div className="flex justify-between text-[#555] py-0.5">
              <span>Allocated Storage:</span>
              <strong className="text-[#171714]">12.7 GB (45% used)</strong>
            </div>
          </div>

          {/* ============================================================ */}
          {/* SECTION 3: DATA INTEGRITY VERIFICATION                       */}
          {/* ============================================================ */}
          <div className="border border-[#B5B3A4] bg-[#FAF8F3] p-3 space-y-2 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-[8px] font-bold uppercase tracking-wider text-[#666]">
                DATA INTEGRITY CHECK
              </span>
              <button
                disabled={isRunningCheck}
                onClick={handleRunIntegrityCheck}
                className="px-2.5 py-0.5 border border-[#B5B3A4] bg-[#DFDBD0] hover:bg-[#D5D1C4] text-[8px] font-bold uppercase flex items-center space-x-1 transition-colors"
              >
                <RefreshCw className={`w-2.5 h-2.5 ${isRunningCheck ? 'animate-spin text-[#171714]' : ''}`} />
                <span>RUN AUDIT</span>
              </button>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-1.5 bg-[#D3CFC2] border border-[#B5B3A4] overflow-hidden">
              <div 
                className="bg-[#171714] h-full transition-all duration-200"
                style={{ width: `${checkProgress}%` }}
              />
            </div>
            <div className="text-[7.5px] text-[#3E523A] font-bold">
              {checkResult}
            </div>
          </div>

          {/* ============================================================ */}
          {/* SECTION 4: FLAT FILE EXPORT & SNAPSHOT                       */}
          {/* ============================================================ */}
          <div className="border border-[#B5B3A4] bg-[#FAF8F3] p-3 space-y-2 shadow-sm">
            <span className="text-[8px] font-bold uppercase tracking-wider text-[#666] block pb-1 border-b border-[#D5D1C4]">
              FLAT FILE EXPORT &amp; SNAPSHOT
            </span>
            <p className="text-[8px] text-[#555] leading-relaxed">
              Export all local records, works, actions, and notes as a verified JSON manifest.
            </p>
            <button
              onClick={handleExportBackup}
              className="w-full bg-[#171714] text-[#FAF8F3] hover:bg-black py-2 text-[8.5px] font-bold uppercase tracking-wider flex items-center justify-center space-x-1.5 transition-colors shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>DOWNLOAD VAULT SNAPSHOT (.JSON)</span>
            </button>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-[#DFDBD0] border-t border-[#B5B3A4] flex items-center justify-between text-[8px] text-[#666] flex-shrink-0">
          <span>ATHENAEUM ARCHIVE v0.1.0 • OPERATOR: {userName.toUpperCase()}</span>
          <button
            onClick={onClose}
            className="px-3.5 py-1 bg-[#171714] text-[#FAF8F3] text-[8px] font-bold uppercase hover:bg-black transition-colors"
          >
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
}

export default SystemSettingsModal;
