import React, { useState } from 'react';
import { 
  Lock, 
  User, 
  Mail, 
  Key, 
  ArrowRight, 
  ShieldCheck, 
  Database, 
  Sparkles, 
  AlertTriangle,
  Fingerprint,
  Layers,
  Terminal,
  FileText
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function AuthScreen() {
  const { login, signup, loginDemo, authError, setAuthError } = useAuth();

  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('Archival Researcher & Curator');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAuthError(null);
    setIsSubmitting(true);

    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        await signup({ name, email, password, role });
      }
    } catch (err) {
      // Error handled in AuthContext
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoClick = async () => {
    setAuthError(null);
    setIsSubmitting(true);
    try {
      await loginDemo();
    } catch (err) {
      // Error handled in AuthContext
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#E5E1D2] text-[#171714] font-mono flex flex-col items-center justify-center p-4 select-none relative overflow-hidden">
      
      {/* Background Architectural Grid Pattern */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage: `
            linear-gradient(to right, #D8D2C2 1px, transparent 1px),
            linear-gradient(to bottom, #D8D2C2 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      />

      {/* Atmospheric Top Bar */}
      <div className="w-full max-w-lg mb-4 flex items-center justify-between text-[7.5px] text-[#66655B] uppercase tracking-wider border-b border-[#B5B3A4] pb-2 z-10">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 bg-[#4B5E45] inline-block shadow-sm" />
          <span>SECURITY NODE: GATEWAY_ALPHA</span>
        </div>
        <div>
          <span>PGP_FINGERPRINT: <strong>0x78D2 · B419 · E902</strong></span>
        </div>
      </div>

      {/* Main Archival Authentication Console */}
      <div className="w-full max-w-lg bg-[#FAF8F3] border-2 border-[#171714] shadow-2xl relative z-10">
        
        {/* Terminal Header */}
        <div className="p-3 bg-[#DFDBD0] border-b-2 border-[#171714] flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            {/* Seal Emblem */}
            <div className="w-7 h-7 rounded-full border border-[#171714] bg-[#2E3D2A] text-[#FAF8F3] flex items-center justify-center shadow-inner">
              <span 
                className="text-[13px] font-bold leading-none"
                style={{ fontFamily: '"Cormorant Garamond", Georgia, serif' }}
              >
                Æ
              </span>
            </div>
            <div>
              <h1 className="text-[11px] font-bold uppercase tracking-wider text-[#171714]">
                ATHENÆUM // CURATORIAL ACCESS TERMINAL
              </h1>
              <p className="text-[7.5px] text-[#66655B]">
                PERSONAL ARCHIVE &amp; CREATIVE WORKSPACE · VERIFIED ACCESS
              </p>
            </div>
          </div>
          <span className="text-[7px] font-mono bg-[#EAE7D9] border border-[#B5B3A4] px-1.5 py-0.5 text-[#444]">
            v1.0.4
          </span>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="grid grid-cols-2 border-b border-[#B5B3A4] bg-[#EAE7D9] text-[8.5px] font-bold uppercase tracking-wider">
          <button
            type="button"
            onClick={() => { setMode('login'); setAuthError(null); }}
            className={`py-2 text-center transition-colors border-r border-[#B5B3A4] ${
              mode === 'login'
                ? 'bg-[#FAF8F3] text-[#171714] font-bold border-b-2 border-b-[#171714]'
                : 'text-[#66655B] hover:bg-[#E2DDD0]'
            }`}
          >
            01 // SIGN IN TO VAULT
          </button>
          <button
            type="button"
            onClick={() => { setMode('signup'); setAuthError(null); }}
            className={`py-2 text-center transition-colors ${
              mode === 'signup'
                ? 'bg-[#FAF8F3] text-[#171714] font-bold border-b-2 border-b-[#171714]'
                : 'text-[#66655B] hover:bg-[#E2DDD0]'
            }`}
          >
            02 // REGISTER NEW VAULT (ZERO DATA)
          </button>
        </div>

        {/* Form Body */}
        <div className="p-4 space-y-3.5">
          
          {/* Quick Demo Access Button */}
          <div className="p-2.5 bg-[#EAE7D9]/80 border border-[#B5B3A4] space-y-1">
            <div className="flex items-center justify-between text-[7.5px] font-bold uppercase text-[#4B5E45]">
              <span className="flex items-center space-x-1">
                <Sparkles className="w-3 h-3 text-[#4B5E45]" />
                <span>DEMO ARCHIVE ACCESS</span>
              </span>
              <span className="text-[6.5px] bg-[#DFDBD0] border border-[#B5B3A4] px-1 py-0.2 text-[#555]">
                PRE-POPULATED (7 WORKS)
              </span>
            </div>
            <p className="text-[7.5px] text-[#66655B] leading-tight">
              Test Athenæum immediately with complete sample records (East London Heritage, Creature Concept, Photo Portfolio).
            </p>
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleDemoClick}
              className="w-full mt-1.5 py-1.5 bg-[#2E3D2A] text-[#FAF8F3] hover:bg-[#1E291B] text-[8px] font-bold uppercase tracking-wider flex items-center justify-center space-x-1.5 transition-colors shadow-sm disabled:opacity-50"
            >
              <span>ENTER AS DEMO CURATOR (PRE-POPULATED VAULT)</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="flex items-center my-2">
            <div className="flex-1 border-t border-[#D5D1C4]" />
            <span className="px-2 text-[7px] text-[#888] uppercase tracking-widest font-mono">
              OR AUTHENTICATE WITH CREDENTIALS
            </span>
            <div className="flex-1 border-t border-[#D5D1C4]" />
          </div>

          {/* New User Zero Data Notice */}
          {mode === 'signup' && (
            <div className="p-2 border border-[#B5B3A4] bg-[#E8E4D5] text-[7.5px] text-[#333] space-y-0.5 leading-relaxed">
              <div className="font-bold uppercase text-[#171714] flex items-center space-x-1">
                <Layers className="w-3 h-3 text-[#3E523A]" />
                <span>FRESH CURATORIAL ONBOARDING PROTOCOL:</span>
              </div>
              <p>
                Registering creates a brand new, private personal vault with <strong>strictly zero records</strong> (0 works, 0 actions, 0 entries). You will begin with a completely clean workspace.
              </p>
            </div>
          )}

          {/* Error Message Box */}
          {authError && (
            <div className="p-2 border border-[#9A3B3B] bg-[#F7ECEC] text-[#9A3B3B] text-[8px] flex items-center space-x-1.5">
              <AlertTriangle className="w-3 h-3 flex-shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          {/* Main Credentials Form */}
          <form onSubmit={handleSubmit} className="space-y-2.5 text-[8.5px]">
            {mode === 'signup' && (
              <>
                <div>
                  <label className="block text-[7px] font-bold uppercase tracking-wider text-[#66655B] mb-0.5">
                    CURATOR FULL NAME *
                  </label>
                  <div className="flex items-center space-x-1.5 bg-[#FAF8F3] border border-[#B5B3A4] px-2 py-1.5">
                    <User className="w-3 h-3 text-[#666]" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Eleanor Vance"
                      className="bg-transparent text-[8.5px] text-[#171714] font-bold focus:outline-none w-full"
                      autoFocus
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[7px] font-bold uppercase tracking-wider text-[#66655B] mb-0.5">
                    CURATORIAL ROLE / TITLE
                  </label>
                  <div className="flex items-center space-x-1.5 bg-[#FAF8F3] border border-[#B5B3A4] px-2 py-1.5">
                    <FileText className="w-3 h-3 text-[#666]" />
                    <input
                      type="text"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      placeholder="e.g. Rare Books Archivist &amp; Conservator"
                      className="bg-transparent text-[8.5px] text-[#171714] focus:outline-none w-full"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-[7px] font-bold uppercase tracking-wider text-[#66655B] mb-0.5">
                CURATOR EMAIL ADDRESS *
              </label>
              <div className="flex items-center space-x-1.5 bg-[#FAF8F3] border border-[#B5B3A4] px-2 py-1.5">
                <Mail className="w-3 h-3 text-[#666]" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={mode === 'login' ? 'curator@athenaeum.vault' : 'curator@vault.local'}
                  className="bg-transparent text-[8.5px] text-[#171714] focus:outline-none w-full"
                  autoFocus={mode === 'login'}
                />
              </div>
            </div>

            <div>
              <label className="block text-[7px] font-bold uppercase tracking-wider text-[#66655B] mb-0.5">
                MASTER PASSWORD *
              </label>
              <div className="flex items-center space-x-1.5 bg-[#FAF8F3] border border-[#B5B3A4] px-2 py-1.5">
                <Key className="w-3 h-3 text-[#666]" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="bg-transparent text-[8.5px] text-[#171714] focus:outline-none w-full"
                />
              </div>
              <span className="text-[6.5px] text-[#777] mt-0.5 block">
                {mode === 'signup' ? 'Minimum 4 characters · Crypto-hashed on local vault' : 'Password for encrypted vault decryption'}
              </span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 py-2 bg-[#171714] text-[#FAF8F3] hover:bg-black text-[9px] font-bold uppercase tracking-wider flex items-center justify-center space-x-2 transition-colors shadow-sm disabled:opacity-50"
            >
              <Lock className="w-3 h-3" />
              <span>
                {isSubmitting 
                  ? 'VERIFYING CREDENTIALS...' 
                  : mode === 'login' 
                    ? 'AUTHENTICATE & OPEN VAULT' 
                    : 'INITIALIZE PERSONAL VAULT (ZERO RECORDS)'}
              </span>
              <ArrowRight className="w-3 h-3 ml-1" />
            </button>
          </form>

        </div>

        {/* Console Technical Footer */}
        <div className="p-2.5 bg-[#DFDBD0] border-t border-[#B5B3A4] flex items-center justify-between text-[7px] text-[#66655B]">
          <div className="flex items-center space-x-1.5">
            <Database className="w-2.5 h-2.5 text-[#333]" />
            <span>STORAGE: SQLITE / ATN_VAULT</span>
          </div>
          <div>
            <span>INTEGRITY: <strong>PARITY_VERIFIED</strong></span>
          </div>
        </div>

      </div>

      {/* Security Disclaimer */}
      <div className="mt-3 text-center text-[7px] text-[#77766B] max-w-sm leading-relaxed">
        ATHENÆUM ARCHIVAL SYSTEM · LOCAL-FIRST STORAGE · ZERO DATA TELEMETRY
      </div>

    </div>
  );
}

export default AuthScreen;
