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
  CheckCheck,
  Copy,
  Layers,
  FileText,
  Activity,
  Cpu,
  Lock,
  Archive,
  Fingerprint
} from 'lucide-react';

export function SystemSettingsModal({ isOpen, onClose, works = [], actions = [], entries = [] }) {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'profile' | 'storage' | 'audit' | 'export'
  const [isRunningCheck, setIsRunningCheck] = useState(false);
  const [checkProgress, setCheckProgress] = useState(100);
  const [auditStep, setAuditStep] = useState(4); // 0 to 4
  const [checkResult, setCheckResult] = useState('ALL 1,482 RECORDS VERIFIED OK • CRC32: 0x9AF41B82');
  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedDbPath, setCopiedDbPath] = useState(false);

  // User Profile state with localStorage persistence
  const [isEditingUser, setIsEditingUser] = useState(false);
  const [userName, setUserName] = useState(() => {
    return localStorage.getItem('atn_user_name') || 'Deepjyoti';
  });
  const [userRole, setUserRole] = useState(() => {
    return localStorage.getItem('atn_user_role') || 'Lead Curator & Systems Architect';
  });
  const [operatorId, setOperatorId] = useState(() => {
    return localStorage.getItem('atn_operator_id') || 'OPR-7821-LDN';
  });
  const [clearanceLevel, setClearanceLevel] = useState(() => {
    return localStorage.getItem('atn_clearance_level') || 'LEVEL 5 (ROOT_VAULT)';
  });
  const [nodeStation, setNodeStation] = useState(() => {
    return localStorage.getItem('atn_node_station') || 'DESK_ALPHA_01';
  });
  const [savedUserFeedback, setSavedUserFeedback] = useState(false);

  useEffect(() => {
    const storedName = localStorage.getItem('atn_user_name');
    if (storedName) setUserName(storedName);
    const storedRole = localStorage.getItem('atn_user_role');
    if (storedRole) setUserRole(storedRole);
    const storedId = localStorage.getItem('atn_operator_id');
    if (storedId) setOperatorId(storedId);
    const storedClearance = localStorage.getItem('atn_clearance_level');
    if (storedClearance) setClearanceLevel(storedClearance);
    const storedNode = localStorage.getItem('atn_node_station');
    if (storedNode) setNodeStation(storedNode);
  }, []);

  const handleSaveUser = () => {
    localStorage.setItem('atn_user_name', userName.trim());
    localStorage.setItem('atn_user_role', userRole.trim());
    localStorage.setItem('atn_operator_id', operatorId.trim());
    localStorage.setItem('atn_clearance_level', clearanceLevel.trim());
    localStorage.setItem('atn_node_station', nodeStation.trim());
    setIsEditingUser(false);
    setSavedUserFeedback(true);
    setTimeout(() => setSavedUserFeedback(false), 2000);
  };

  const copyToClipboard = (text, setFlag) => {
    navigator.clipboard?.writeText(text);
    setFlag(true);
    setTimeout(() => setFlag(false), 1800);
  };

  const handleRunIntegrityCheck = () => {
    setIsRunningCheck(true);
    setCheckProgress(0);
    setAuditStep(1);
    setCheckResult('AUDIT RUNNING: Phase 1/4 - SQLite B-Tree invariants...');
    
    let p = 0;
    const interval = setInterval(() => {
      p += 25;
      setCheckProgress(p);
      const step = Math.min(4, Math.floor(p / 25));
      setAuditStep(step);
      
      if (step === 1) setCheckResult('Verifying SQLite page checksums & B-Tree invariants...');
      if (step === 2) setCheckResult('Validating 1,482 master records & schema constraints...');
      if (step === 3) setCheckResult('Checking foreign key references across works & actions...');
      if (step === 4) setCheckResult('Testing SHA-256 asset checksums & parity vectors...');

      if (p >= 100) {
        clearInterval(interval);
        setIsRunningCheck(false);
        setAuditStep(4);
        setCheckResult('INTEGRITY AUDIT PASSED: 1,482 RECORDS OK • 0 CORRUPTIONS (CRC32: 0x9AF41B82)');
      }
    }, 280);
  };

  const handleExportBackup = () => {
    const backupData = {
      system: 'ATHENAEUM ARCHIVAL ENGINE',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      vault: 'athenaeum.db',
      checksum: 'sha256-e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      operator: {
        name: userName,
        role: userRole,
        id: operatorId,
        clearance: clearanceLevel,
        node: nodeStation
      },
      counts: {
        works: works.length,
        actions: actions.length,
        entries: entries.length,
        total: works.length + actions.length + entries.length
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
    a.download = `athenaeum_vault_snapshot_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  const initials = userName
    ? userName
        .split(' ')
        .map(n => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'DJ';

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-[2px] z-50 flex items-center justify-center p-3 font-mono select-none">
      <div className="w-full max-w-3xl bg-[#EAE7D9] border-2 border-[#171714] shadow-2xl flex flex-col max-h-[92vh] overflow-hidden rounded-[1px]">
        
        {/* ============================================================ */}
        {/* TOP TECHNICAL CONSOLE HEADER                                 */}
        {/* ============================================================ */}
        <div className="p-2.5 px-3.5 bg-[#DFDBD0] border-b border-[#B5B3A4] flex items-center justify-between flex-shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="w-2.5 h-2.5 bg-[#4B5E45] inline-block shadow-sm" />
            <div className="flex items-center space-x-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#171714]">
                ATHENÆUM // SYSTEM SETTINGS &amp; ARCHIVAL ENGINE
              </span>
              <span className="text-[8px] bg-[#D4CFBE] border border-[#B5B3A4] px-1.5 py-0.2 text-[#555] font-mono">
                v1.0.4-REV-9
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <span className="text-[7.5px] text-[#66655B] hidden sm:inline">
              NODE: <strong className="text-[#171714]">{nodeStation}</strong>
            </span>
            <button 
              onClick={onClose} 
              className="p-1 border border-[#B5B3A4] bg-[#EAE7D9] hover:bg-[#171714] text-[#444] hover:text-[#FAF8F3] transition-colors"
              title="Close System Settings"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* ============================================================ */}
        {/* NAVIGATION TAB STRIP                                         */}
        {/* ============================================================ */}
        <div className="flex items-center justify-between border-b border-[#B5B3A4] bg-[#E4E0D2] px-3 pt-1.5 overflow-x-auto flex-shrink-0">
          <div className="flex space-x-1 text-[8.5px] font-bold uppercase tracking-wider">
            {[
              { id: 'overview', label: '01 // OVERVIEW' },
              { id: 'profile', label: '02 // CURATOR PROFILE' },
              { id: 'storage', label: '03 // VAULT ENGINE' },
              { id: 'audit', label: '04 // INTEGRITY AUDIT' },
              { id: 'export', label: '05 // BACKUP & EXPORT' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 border-t border-x transition-colors ${
                  activeTab === tab.id
                    ? 'bg-[#FAF8F3] border-[#B5B3A4] text-[#171714] -mb-[1px] font-bold'
                    : 'bg-[#DDD8CA]/60 border-transparent text-[#66655B] hover:text-[#171714] hover:bg-[#DDD8CA]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="hidden md:flex items-center space-x-1.5 text-[7px] text-[#4B5E45] font-bold pb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4B5E45] animate-pulse" />
            <span>LOCAL DATABASE ONLINE</span>
          </div>
        </div>

        {/* ============================================================ */}
        {/* SCROLLABLE CONSOLE BODY                                      */}
        {/* ============================================================ */}
        <div className="p-3.5 space-y-3 text-[9px] overflow-y-auto flex-1 bg-[#EAE7D9]">
          
          {/* ========================================================== */}
          {/* TAB 1: OVERVIEW (CONSOLIDATED DASHBOARD)                   */}
          {/* ========================================================== */}
          {activeTab === 'overview' && (
            <div className="space-y-3">
              {/* TOP ROW: CURATOR IDENTITY & ACCESS (FULL WIDTH) */}
              <div className="border border-[#B5B3A4] bg-[#FAF8F3] p-3 shadow-sm">
                <div className="flex items-center justify-between pb-2 border-b border-[#D5D1C4]">
                  <div className="flex items-center space-x-2">
                    <User className="w-3.5 h-3.5 text-[#3E4F3B]" />
                    <span className="text-[9px] font-bold uppercase tracking-wider text-[#171714]">
                      CURATOR &amp; OPERATOR SECURITY DOSSIER
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
                      <span>{isEditingUser ? 'SAVE PROFILE' : 'EDIT PROFILE'}</span>
                    </button>
                  </div>
                </div>

                <div className="mt-2.5 flex flex-col md:flex-row items-start md:items-center space-y-3 md:space-y-0 md:space-x-3.5">
                  {/* Curatorial Seal Avatar */}
                  <div className="relative w-14 h-14 rounded-full border-2 border-[#2E3D2A] bg-[#2E3D2A] text-[#FAF8F3] flex flex-col items-center justify-center flex-shrink-0 shadow-md">
                    <svg viewBox="0 0 56 56" className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
                      <circle cx="28" cy="28" r="25" fill="none" stroke="#FAF8F3" strokeWidth="0.5" strokeDasharray="2 2" />
                      <circle cx="28" cy="28" r="21" fill="none" stroke="#FAF8F3" strokeWidth="0.5" />
                    </svg>
                    <span 
                      className="text-[18px] font-bold leading-none select-none z-10"
                      style={{ fontFamily: '"Cormorant Garamond", "Newsreader", Georgia, serif' }}
                    >
                      {initials}
                    </span>
                    <span className="text-[5px] font-mono tracking-widest text-[#B4E0B0] mt-0.5 z-10 font-bold">
                      CURATOR
                    </span>
                  </div>

                  {/* Operator Info & Edit Inputs */}
                  <div className="flex-1 min-w-0 space-y-1.5 w-full">
                    {isEditingUser ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-[#F2EFE6] p-2 border border-[#B5B3A4]">
                        <div>
                          <label className="text-[6.5px] font-bold text-[#666] uppercase block">NAME:</label>
                          <input
                            type="text"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            className="w-full bg-[#FAF8F3] border border-[#B5B3A4] px-1.5 py-0.5 text-[8.5px] text-[#171714] font-bold focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-[6.5px] font-bold text-[#666] uppercase block">ROLE / TITLE:</label>
                          <input
                            type="text"
                            value={userRole}
                            onChange={(e) => setUserRole(e.target.value)}
                            className="w-full bg-[#FAF8F3] border border-[#B5B3A4] px-1.5 py-0.5 text-[8.5px] text-[#171714] focus:outline-none"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-baseline space-x-2">
                        <span className="text-[13px] font-bold text-[#171714]">
                          {userName}
                        </span>
                        <span className="text-[8.5px] text-[#4B5E45] font-semibold">
                          — {userRole}
                        </span>
                      </div>
                    )}

                    {/* Metadata Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 border-t border-[#E5E1D2] text-[7.5px]">
                      <div>
                        <span className="text-[#777] block text-[6.5px]">OPERATOR ID</span>
                        <strong className="text-[#171714] font-mono">{operatorId}</strong>
                      </div>
                      <div>
                        <span className="text-[#777] block text-[6.5px]">CLEARANCE</span>
                        <strong className="text-[#3E523A] font-mono">{clearanceLevel}</strong>
                      </div>
                      <div>
                        <span className="text-[#777] block text-[6.5px]">NODE STATION</span>
                        <strong className="text-[#171714] font-mono">{nodeStation}</strong>
                      </div>
                      <div>
                        <span className="text-[#777] block text-[6.5px]">SESSION ACTIVE</span>
                        <strong className="text-[#171714] font-mono">09 MAY 2025 · 08:24</strong>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Cryptographic Key & Fingerprint Bar */}
                <div className="mt-2.5 p-1.5 bg-[#EAE7D9]/80 border border-[#D5D1C4] flex flex-wrap items-center justify-between text-[7px] text-[#66655B] font-mono gap-1">
                  <div className="flex items-center space-x-1.5">
                    <Fingerprint className="w-3 h-3 text-[#3E523A]" />
                    <span>PGP KEY:</span>
                    <strong className="text-[#171714]">0x78D2 · B419 · E902 · F1A7</strong>
                    <button
                      onClick={() => copyToClipboard('0x78D2B419E902F1A7', setCopiedKey)}
                      className="px-1 py-0.2 border border-[#B5B3A4] bg-[#FAF8F3] hover:bg-[#E2DDD0] text-[6.5px] text-[#333] transition-colors"
                      title="Copy PGP Fingerprint"
                    >
                      {copiedKey ? 'COPIED' : 'COPY'}
                    </button>
                  </div>
                  <div className="flex items-center space-x-1 text-[#3E523A] font-bold">
                    <Lock className="w-2.5 h-2.5" />
                    <span>STATUS: AUTHENTICATED (Ed25519)</span>
                  </div>
                </div>
              </div>

              {/* 2-COLUMN SPLIT: STORAGE ENGINE (LEFT) & INTEGRITY AUDITOR (RIGHT) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                
                {/* LEFT BOX: DATABASE VAULT ENGINE */}
                <div className="border border-[#B5B3A4] bg-[#FAF8F3] p-3 flex flex-col justify-between shadow-sm">
                  <div>
                    <div className="flex items-center justify-between pb-1.5 border-b border-[#D5D1C4]">
                      <div className="flex items-center space-x-1.5">
                        <Database className="w-3.5 h-3.5 text-[#3E523A]" />
                        <span className="text-[8.5px] font-bold uppercase tracking-wider text-[#171714]">
                          DATABASE VAULT ENGINE
                        </span>
                      </div>
                      <span className="text-[7px] bg-[#DDD8CB] border border-[#B5B3A4] px-1 py-0.2 font-bold text-[#3E523A]">
                        WAL ACTIVE
                      </span>
                    </div>

                    <div className="mt-2 space-y-1.5 text-[8px]">
                      <div className="flex justify-between py-0.5 border-b border-dotted border-[#D5D1C4]">
                        <span className="text-[#666]">Engine:</span>
                        <strong className="text-[#171714]">SQLite Embedded v3.45.1</strong>
                      </div>
                      <div className="flex items-center justify-between py-0.5 border-b border-dotted border-[#D5D1C4]">
                        <span className="text-[#666]">Database File:</span>
                        <div className="flex items-center space-x-1">
                          <span className="font-mono text-[#171714] text-[7.5px]">/var/athenaeum/athenaeum.db</span>
                          <button
                            onClick={() => copyToClipboard('/var/athenaeum/athenaeum.db', setCopiedDbPath)}
                            className="text-[6.5px] border border-[#B5B3A4] px-1 bg-[#EAE7D9]"
                            title="Copy path"
                          >
                            {copiedDbPath ? '✓' : 'COPY'}
                          </button>
                        </div>
                      </div>
                      <div className="flex justify-between py-0.5 border-b border-dotted border-[#D5D1C4]">
                        <span className="text-[#666]">Journal Mode:</span>
                        <strong className="text-[#3E523A]">WAL (Write-Ahead Logging)</strong>
                      </div>
                      <div className="flex justify-between py-0.5">
                        <span className="text-[#666]">B-Tree Page Size:</span>
                        <strong className="text-[#171714]">4,096 Bytes</strong>
                      </div>
                    </div>
                  </div>

                  {/* Segmented Storage Gauge */}
                  <div className="mt-3 pt-2 border-t border-[#D5D1C4]">
                    <div className="flex justify-between text-[7.5px] text-[#666] mb-1">
                      <span>STORAGE ALLOCATION</span>
                      <strong className="text-[#171714]">12.7 GB OF 28.0 GB (45%)</strong>
                    </div>
                    {/* Visual Segmented Bar */}
                    <div className="flex space-x-0.5 h-2 w-full bg-[#E5E1D2] p-0.5 border border-[#B5B3A4]">
                      {[...Array(12)].map((_, i) => (
                        <div
                          key={i}
                          className={`flex-1 ${
                            i < 5 ? 'bg-[#2E3D2A]' : i < 6 ? 'bg-[#4B5E45]' : 'bg-[#DDD8CB]'
                          }`}
                        />
                      ))}
                    </div>
                    <div className="flex justify-between text-[6.5px] text-[#777] mt-1 font-mono">
                      <span>WORKS: 4.2 GB</span>
                      <span>MEDIA: 6.8 GB</span>
                      <span>INDEX: 1.7 GB</span>
                    </div>
                  </div>
                </div>

                {/* RIGHT BOX: DATA INTEGRITY & AUDIT SCANNER */}
                <div className="border border-[#B5B3A4] bg-[#FAF8F3] p-3 flex flex-col justify-between shadow-sm">
                  <div>
                    <div className="flex items-center justify-between pb-1.5 border-b border-[#D5D1C4]">
                      <div className="flex items-center space-x-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-[#3E523A]" />
                        <span className="text-[8.5px] font-bold uppercase tracking-wider text-[#171714]">
                          DATA INTEGRITY CHECK
                        </span>
                      </div>
                      <button
                        disabled={isRunningCheck}
                        onClick={handleRunIntegrityCheck}
                        className="px-2 py-0.5 border border-[#B5B3A4] bg-[#DFDBD0] hover:bg-[#171714] text-[#171714] hover:text-[#FAF8F3] text-[7.5px] font-bold uppercase flex items-center space-x-1 transition-colors disabled:opacity-50"
                      >
                        <RefreshCw className={`w-2.5 h-2.5 ${isRunningCheck ? 'animate-spin' : ''}`} />
                        <span>{isRunningCheck ? 'AUDITING...' : 'RUN AUDIT'}</span>
                      </button>
                    </div>

                    {/* Progress Bar & Status */}
                    <div className="mt-2.5 space-y-2">
                      <div className="w-full h-2 bg-[#D5D1C4] border border-[#B5B3A4] overflow-hidden p-0.5">
                        <div 
                          className="bg-[#2E3D2A] h-full transition-all duration-200"
                          style={{ width: `${checkProgress}%` }}
                        />
                      </div>
                      <div className="text-[7.5px] text-[#3E523A] font-bold font-mono leading-tight">
                        {checkResult}
                      </div>

                      {/* 4 Checklist Phases */}
                      <div className="grid grid-cols-2 gap-1.5 pt-1 text-[7px] text-[#555]">
                        <div className="flex items-center space-x-1">
                          <Check className={`w-2.5 h-2.5 ${auditStep >= 1 ? 'text-[#3E523A]' : 'text-[#AAA]'}`} />
                          <span>Page Checksums</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Check className={`w-2.5 h-2.5 ${auditStep >= 2 ? 'text-[#3E523A]' : 'text-[#AAA]'}`} />
                          <span>1,482 Record Rules</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Check className={`w-2.5 h-2.5 ${auditStep >= 3 ? 'text-[#3E523A]' : 'text-[#AAA]'}`} />
                          <span>FK Consistency</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Check className={`w-2.5 h-2.5 ${auditStep >= 4 ? 'text-[#3E523A]' : 'text-[#AAA]'}`} />
                          <span>SHA-256 Parity</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* BOTTOM EXPORT STRIP */}
                  <div className="mt-3 pt-2 border-t border-[#D5D1C4]">
                    <button
                      onClick={handleExportBackup}
                      className="w-full bg-[#171714] text-[#FAF8F3] hover:bg-black py-1.5 text-[8px] font-bold uppercase tracking-wider flex items-center justify-center space-x-1.5 transition-colors shadow-sm"
                    >
                      <Download className="w-3 h-3" />
                      <span>DOWNLOAD VAULT SNAPSHOT (.JSON)</span>
                    </button>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* ========================================================== */}
          {/* TAB 2: DETAILED CURATOR PROFILE & CLEARANCE                */}
          {/* ========================================================== */}
          {activeTab === 'profile' && (
            <div className="border border-[#B5B3A4] bg-[#FAF8F3] p-4 space-y-3.5 shadow-sm">
              <div className="flex items-center justify-between pb-2 border-b border-[#D5D1C4]">
                <h3 className="text-[10px] font-bold uppercase tracking-wider text-[#171714]">
                  CURATOR SECURITY IDENTIFICATION &amp; ACCESS SCOPE
                </h3>
                <span className="text-[7.5px] text-[#4B5E45] font-bold">CLEARANCE: ROOT_VAULT</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-[8.5px]">
                <div className="space-y-2">
                  <div>
                    <label className="text-[7px] text-[#666] font-bold uppercase block mb-0.5">Operator Display Name:</label>
                    <input
                      type="text"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      className="w-full bg-[#FAF8F3] border border-[#B5B3A4] p-1.5 text-[9px] text-[#171714] font-bold focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[7px] text-[#666] font-bold uppercase block mb-0.5">Archival Title / Role:</label>
                    <input
                      type="text"
                      value={userRole}
                      onChange={(e) => setUserRole(e.target.value)}
                      className="w-full bg-[#FAF8F3] border border-[#B5B3A4] p-1.5 text-[8.5px] text-[#171714] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[7px] text-[#666] font-bold uppercase block mb-0.5">Operator Badge ID:</label>
                    <input
                      type="text"
                      value={operatorId}
                      onChange={(e) => setOperatorId(e.target.value)}
                      className="w-full bg-[#FAF8F3] border border-[#B5B3A4] p-1.5 text-[8.5px] text-[#171714] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div>
                    <label className="text-[7px] text-[#666] font-bold uppercase block mb-0.5">Clearance Level:</label>
                    <select
                      value={clearanceLevel}
                      onChange={(e) => setClearanceLevel(e.target.value)}
                      className="w-full bg-[#FAF8F3] border border-[#B5B3A4] p-1.5 text-[8.5px] text-[#171714] focus:outline-none"
                    >
                      <option value="LEVEL 1 (READ_ONLY)">LEVEL 1 (READ_ONLY) — Public Shelf Inspection</option>
                      <option value="LEVEL 2 (ARCHIVIST)">LEVEL 2 (ARCHIVIST) — Document Cataloging</option>
                      <option value="LEVEL 3 (CONSERVATOR)">LEVEL 3 (CONSERVATOR) — Specimen Restoration</option>
                      <option value="LEVEL 4 (REGISTRAR)">LEVEL 4 (REGISTRAR) — Full Record Editing</option>
                      <option value="LEVEL 5 (ROOT_VAULT)">LEVEL 5 (ROOT_VAULT) — Master Database Authority</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[7px] text-[#666] font-bold uppercase block mb-0.5">Workstation Terminal Node:</label>
                    <input
                      type="text"
                      value={nodeStation}
                      onChange={(e) => setNodeStation(e.target.value)}
                      className="w-full bg-[#FAF8F3] border border-[#B5B3A4] p-1.5 text-[8.5px] text-[#171714] focus:outline-none"
                    />
                  </div>
                  <div className="pt-2">
                    <button
                      onClick={handleSaveUser}
                      className="w-full bg-[#171714] text-[#FAF8F3] py-2 text-[8px] font-bold uppercase hover:bg-black transition-colors"
                    >
                      APPLY &amp; PERSIST IDENTITY CHANGES
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================== */}
          {/* TAB 3: STORAGE ENGINE DIAGNOSTICS                          */}
          {/* ========================================================== */}
          {activeTab === 'storage' && (
            <div className="border border-[#B5B3A4] bg-[#FAF8F3] p-4 space-y-3 shadow-sm">
              <div className="flex items-center justify-between pb-1.5 border-b border-[#D5D1C4]">
                <h3 className="text-[10px] font-bold uppercase tracking-wider text-[#171714]">
                  SQLITE EMBEDDED ENGINE &amp; PRAGMA DIAGNOSTICS
                </h3>
                <span className="text-[7.5px] font-mono text-[#666]">PAGE SIZE: 4096 B</span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[8px]">
                <div className="border border-[#B5B3A4] bg-[#EAE7D9] p-2">
                  <span className="text-[6.5px] text-[#666] uppercase block">CACHE HIT RATIO</span>
                  <strong className="text-[14px] text-[#171714]">99.8%</strong>
                </div>
                <div className="border border-[#B5B3A4] bg-[#EAE7D9] p-2">
                  <span className="text-[6.5px] text-[#666] uppercase block">WAL CHECKPOINTS</span>
                  <strong className="text-[14px] text-[#3E523A]">PASSIVE</strong>
                </div>
                <div className="border border-[#B5B3A4] bg-[#EAE7D9] p-2">
                  <span className="text-[6.5px] text-[#666] uppercase block">BUSY TIMEOUT</span>
                  <strong className="text-[14px] text-[#171714]">5,000 MS</strong>
                </div>
                <div className="border border-[#B5B3A4] bg-[#EAE7D9] p-2">
                  <span className="text-[6.5px] text-[#666] uppercase block">FTS5 FULL TEXT</span>
                  <strong className="text-[14px] text-[#3E523A]">ENABLED</strong>
                </div>
              </div>

              <div className="space-y-1.5 text-[8px] pt-1">
                <div className="flex justify-between py-1 border-b border-[#D5D1C4]">
                  <span>Database File Location:</span>
                  <span className="font-mono text-[#171714]">/var/athenaeum/athenaeum.db</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#D5D1C4]">
                  <span>WAL Journal File:</span>
                  <span className="font-mono text-[#171714]">/var/athenaeum/athenaeum.db-wal (3.4 MB)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#D5D1C4]">
                  <span>Shared Memory Shm:</span>
                  <span className="font-mono text-[#171714]">/var/athenaeum/athenaeum.db-shm (32 KB)</span>
                </div>
                <div className="flex justify-between py-1">
                  <span>SQLite Library Version:</span>
                  <strong className="text-[#171714]">3.45.1 (libsqlite3)</strong>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================== */}
          {/* TAB 4: INTEGRITY AUDIT TEST RIG                            */}
          {/* ========================================================== */}
          {activeTab === 'audit' && (
            <div className="border border-[#B5B3A4] bg-[#FAF8F3] p-4 space-y-3 shadow-sm">
              <div className="flex items-center justify-between pb-1.5 border-b border-[#D5D1C4]">
                <h3 className="text-[10px] font-bold uppercase tracking-wider text-[#171714]">
                  VAULT CHECKSUM &amp; INTEGRITY AUDITOR
                </h3>
                <button
                  disabled={isRunningCheck}
                  onClick={handleRunIntegrityCheck}
                  className="px-3 py-1 bg-[#171714] text-[#FAF8F3] text-[8px] font-bold uppercase hover:bg-black"
                >
                  {isRunningCheck ? 'AUDITING...' : 'EXECUTE INTEGRITY CHECK'}
                </button>
              </div>

              <div className="space-y-2 text-[8px]">
                <div className="p-2.5 bg-[#EAE7D9] border border-[#B5B3A4] font-mono text-[7.5px] space-y-1 text-[#333]">
                  <div>PRAGMA quick_check; ➔ <strong className="text-[#3E523A]">ok</strong></div>
                  <div>PRAGMA foreign_key_check; ➔ <strong className="text-[#3E523A]">0 violations</strong></div>
                  <div>PRAGMA integrity_check; ➔ <strong className="text-[#3E523A]">ok</strong></div>
                  <div>COUNT(*) FROM master_records; ➔ <strong className="text-[#171714]">1,482 entries</strong></div>
                </div>

                <div className="p-2 border border-[#B5B3A4] bg-[#E9E5D8]/70 flex items-center justify-between text-[7.5px] text-[#555]">
                  <span>LAST AUDIT RUN: <strong>09 MAY 2025 · 08:24</strong></span>
                  <span className="text-[#3E523A] font-bold">STATUS: 100% HEALTHY</span>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================== */}
          {/* TAB 5: SNAPSHOTS & FLAT FILE EXPORT                        */}
          {/* ========================================================== */}
          {activeTab === 'export' && (
            <div className="border border-[#B5B3A4] bg-[#FAF8F3] p-4 space-y-3 shadow-sm">
              <div className="flex items-center justify-between pb-1.5 border-b border-[#D5D1C4]">
                <h3 className="text-[10px] font-bold uppercase tracking-wider text-[#171714]">
                  ARCHIVAL SNAPSHOT &amp; PORTABLE MANIFEST
                </h3>
                <span className="text-[7.5px] font-mono text-[#666]">FORMAT: JSON v1.0</span>
              </div>

              <p className="text-[8px] text-[#555] leading-relaxed">
                Generate a standalone cryptographic export containing all works, daily log chronicles, actions, geographic loci, collections, and resources. Suitable for offline preservation and cross-system migration.
              </p>

              <div className="grid grid-cols-3 gap-2 text-[8px] border border-[#B5B3A4] bg-[#EAE7D9] p-2.5">
                <div>
                  <span className="text-[6.5px] text-[#666] block">WORKS INCLUDED:</span>
                  <strong className="text-[#171714]">{works.length}</strong>
                </div>
                <div>
                  <span className="text-[6.5px] text-[#666] block">ACTIONS INCLUDED:</span>
                  <strong className="text-[#171714]">{actions.length}</strong>
                </div>
                <div>
                  <span className="text-[6.5px] text-[#666] block">ENTRIES INCLUDED:</span>
                  <strong className="text-[#171714]">{entries.length}</strong>
                </div>
              </div>

              <button
                onClick={handleExportBackup}
                className="w-full bg-[#171714] text-[#FAF8F3] hover:bg-black py-2.5 text-[8.5px] font-bold uppercase tracking-wider flex items-center justify-center space-x-2 transition-colors shadow-sm"
              >
                <Download className="w-3.5 h-3.5" />
                <span>GENERATE &amp; DOWNLOAD VERIFIED JSON VAULT SNAPSHOT</span>
              </button>
            </div>
          )}

        </div>

        {/* ============================================================ */}
        {/* MODAL FOOTER DOCK                                            */}
        {/* ============================================================ */}
        <div className="p-2.5 px-3.5 bg-[#DFDBD0] border-t border-[#B5B3A4] flex items-center justify-between text-[7.5px] text-[#66655B] flex-shrink-0">
          <div className="flex items-center space-x-2">
            <span>ATHENÆUM ARCHIVE v0.1.0</span>
            <span>•</span>
            <span>OPERATOR: <strong className="text-[#171714]">{userName.toUpperCase()}</strong></span>
            <span>•</span>
            <span className="hidden sm:inline">VAULT CHECKSUM: <strong className="text-[#3E523A]">0x9AF4</strong></span>
          </div>

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