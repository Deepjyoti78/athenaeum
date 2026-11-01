// ATHENAEUM — Client Authentication & Vault Sync Service
// Communicates with backend server (/api) with graceful local offline fallback.

import { 
  INITIAL_WORKS, 
  INITIAL_ACTIONS, 
  INITIAL_ENTRIES, 
  INITIAL_COLLECTIONS, 
  INITIAL_PEOPLE, 
  INITIAL_PLACES, 
  INITIAL_RESOURCES 
} from '../data/mockData';

const TOKEN_KEY = 'athenaeum_auth_token';
const USER_KEY = 'athenaeum_current_user';
const USERS_STORAGE_KEY = 'athenaeum_local_users';
const VAULTS_PREFIX = 'athenaeum_vault_';

// Check if backend server is accessible
let isBackendAvailable = true;

async function checkBackend() {
  try {
    const res = await fetch('/api/health', { signal: AbortSignal.timeout(2000) });
    if (res.ok) {
      isBackendAvailable = true;
      return true;
    }
  } catch (err) {
    // Backend not running on proxy, will use fallback
    isBackendAvailable = false;
  }
  return false;
}

// -------------------------------------------------------------
// LOCAL FALLBACK STORAGE HELPERS (when backend server is offline)
// -------------------------------------------------------------
function getLocalUsers() {
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalUsers(users) {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
}

function getLocalVault(userId) {
  try {
    const raw = localStorage.getItem(`${VAULTS_PREFIX}${userId}`);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error reading local vault:', e);
  }

  // If demo user, seed demo data
  if (userId === 'usr-curator-demo') {
    return {
      works: INITIAL_WORKS,
      actions: INITIAL_ACTIONS,
      entries: INITIAL_ENTRIES,
      collections: INITIAL_COLLECTIONS,
      people: INITIAL_PEOPLE,
      places: INITIAL_PLACES,
      resources: INITIAL_RESOURCES,
      dailyLogs: [
        {
          date: '09 MAY 2025',
          note: "Started working on the database structure and record model for Athenaeum. Feeling focused and productive.",
          mood: 2,
          energy: 72,
          updatedAt: Date.now()
        }
      ],
      activity: [
        {
          id: 'act-init-1',
          timestamp: Date.now() - 7200000,
          type: 'SYSTEM_STARTUP',
          details: 'System initialized in local mode. Database integrity: OK.',
          targetId: 'SYS',
          targetType: 'system'
        }
      ]
    };
  }

  // Any other NEW user gets strictly ZERO data
  return {
    works: [],
    actions: [],
    entries: [],
    collections: [],
    people: [],
    places: [],
    resources: [],
    dailyLogs: [],
    activity: [
      {
        id: `act-init-${Date.now()}`,
        timestamp: Date.now(),
        type: 'VAULT_INITIALIZED',
        details: 'Personal archive vault initialized with zero records. Ready for curatorial entry.',
        targetId: 'VAULT-ROOT',
        targetType: 'system'
      }
    ]
  };
}

function saveLocalVault(userId, vaultData) {
  try {
    localStorage.setItem(`${VAULTS_PREFIX}${userId}`, JSON.stringify(vaultData));
  } catch (e) {
    console.error('Error saving local vault:', e);
  }
}

// -------------------------------------------------------------
// PUBLIC AUTH METHODS
// -------------------------------------------------------------

export function getStoredAuth() {
  const token = localStorage.getItem(TOKEN_KEY);
  const userRaw = localStorage.getItem(USER_KEY);
  let user = null;
  try {
    if (userRaw) user = JSON.parse(userRaw);
  } catch {
    user = null;
  }
  return { token, user };
}

export function setStoredAuth(token, user) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);

  if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
  else localStorage.removeItem(USER_KEY);
}

export function clearStoredAuth() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

// SIGN UP (NEW USER GETS ZERO DATA)
export async function registerUser({ name, email, password, role }) {
  await checkBackend();

  if (isBackendAvailable) {
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Registration failed');
      }
      setStoredAuth(data.token, data.user);
      return data;
    } catch (err) {
      if (!err.message.includes('already exists')) {
        // Fall back to local storage if network error
        isBackendAvailable = false;
      } else {
        throw err;
      }
    }
  }

  // Local fallback implementation
  const users = getLocalUsers();
  const normalizedEmail = email.toLowerCase().trim();

  if (users.some(u => u.email.toLowerCase() === normalizedEmail)) {
    throw new Error('An archival curator identity with this email already exists.');
  }

  const userId = `usr-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  const newUser = {
    id: userId,
    email: normalizedEmail,
    name: name.trim(),
    role: (role && role.trim()) || 'Junior Curator & Archival Fellow',
    operatorId: `OPR-${Math.floor(1000 + Math.random() * 9000)}-LDN`,
    clearance: 'LEVEL 1 (READ_WRITE)',
    station: 'DESK_BETA_02',
    createdAt: new Date().toISOString(),
    isDemo: false
  };

  users.push({ ...newUser, password });
  saveLocalUsers(users);

  // Initialize zero data vault for new user
  const emptyVault = {
    works: [],
    actions: [],
    entries: [],
    collections: [],
    people: [],
    places: [],
    resources: [],
    dailyLogs: [],
    activity: [
      {
        id: `act-welcome-${Date.now()}`,
        timestamp: Date.now(),
        type: 'USER_REGISTERED',
        details: `Vault registered for operator ${newUser.name}. All records initialized to zero.`,
        targetId: userId,
        targetType: 'user'
      }
    ]
  };
  saveLocalVault(userId, emptyVault);

  const token = `local-token-${userId}`;
  setStoredAuth(token, newUser);

  return {
    success: true,
    user: newUser,
    token,
    vault: emptyVault
  };
}

// SIGN IN
export async function loginUser({ email, password }) {
  await checkBackend();

  if (isBackendAvailable) {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Login failed');
      }
      setStoredAuth(data.token, data.user);
      return data;
    } catch (err) {
      if (!err.message.includes('Invalid') && !err.message.includes('No curator record')) {
        isBackendAvailable = false;
      } else {
        throw err;
      }
    }
  }

  // Local fallback
  const normalizedEmail = email.toLowerCase().trim();

  // Demo user credentials check
  if (normalizedEmail === 'curator@athenaeum.vault') {
    const demoUser = {
      id: 'usr-curator-demo',
      email: 'curator@athenaeum.vault',
      name: 'Deepjyoti',
      role: 'Lead Curator & Systems Architect',
      operatorId: 'OPR-7821-LDN',
      clearance: 'LEVEL 5 (ROOT_VAULT)',
      station: 'DESK_ALPHA_01',
      isDemo: true
    };
    const token = `local-token-${demoUser.id}`;
    const vault = getLocalVault(demoUser.id);
    setStoredAuth(token, demoUser);
    return { success: true, user: demoUser, token, vault };
  }

  const users = getLocalUsers();
  const user = users.find(u => u.email.toLowerCase() === normalizedEmail);

  if (!user || user.password !== password) {
    throw new Error('Invalid email or password credentials.');
  }

  const safeUser = { ...user };
  delete safeUser.password;

  const token = `local-token-${safeUser.id}`;
  const vault = getLocalVault(safeUser.id);
  setStoredAuth(token, safeUser);

  return {
    success: true,
    user: safeUser,
    token,
    vault
  };
}

// QUICK DEMO SIGN IN
export async function loginAsDemoCurator() {
  return loginUser({
    email: 'curator@athenaeum.vault',
    password: 'password123'
  });
}

// LOGOUT
export async function logoutUser() {
  const { token } = getStoredAuth();
  if (token && isBackendAvailable) {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (e) {
      // Ignore network errors on logout
    }
  }
  clearStoredAuth();
  return { success: true };
}

// GET USER'S VAULT DATA
export async function fetchUserVault(token, userId) {
  if (isBackendAvailable && token) {
    try {
      const res = await fetch('/api/vault', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        return data.vault;
      }
    } catch (e) {
      isBackendAvailable = false;
    }
  }

  return getLocalVault(userId);
}

// SAVE USER'S VAULT DATA
export async function syncUserVault(token, userId, vaultData) {
  // Always update local cache first
  saveLocalVault(userId, vaultData);

  if (isBackendAvailable && token) {
    try {
      await fetch('/api/vault', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(vaultData)
      });
    } catch (e) {
      isBackendAvailable = false;
    }
  }
}

