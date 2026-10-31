import express from 'express';
import cors from 'cors';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Directories
const DATA_DIR = path.join(__dirname, 'data');
const VAULTS_DIR = path.join(DATA_DIR, 'vaults');

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(VAULTS_DIR)) fs.mkdirSync(VAULTS_DIR, { recursive: true });

const USERS_FILE = path.join(DATA_DIR, 'users.json');

// Password hashing with crypto PBKDF2
function hashPassword(password, salt = crypto.randomBytes(16).toString('hex')) {
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return { hash, salt };
}

function verifyPassword(password, salt, storedHash) {
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return hash === storedHash;
}

// Generate Auth Token
function generateToken(userId) {
  const payload = `${userId}:${Date.now()}:${crypto.randomBytes(16).toString('hex')}`;
  return Buffer.from(payload).toString('base64');
}

function parseToken(token) {
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const [userId] = decoded.split(':');
    return userId;
  } catch {
    return null;
  }
}

// Read / Write Users
function getUsers() {
  if (!fs.existsSync(USERS_FILE)) return [];
  try {
    const raw = fs.readFileSync(USERS_FILE, 'utf-8');
    return JSON.parse(raw) || [];
  } catch (err) {
    console.error('Error reading users file:', err);
    return [];
  }
}

function saveUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf-8');
}

// Read / Write Vault Data for a user
function getVaultPath(userId) {
  return path.join(VAULTS_DIR, `${userId}.json`);
}

function getUserVault(userId) {
  const vPath = getVaultPath(userId);
  if (!fs.existsSync(vPath)) {
    // New empty vault
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
  try {
    const raw = fs.readFileSync(vPath, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error(`Error reading vault for ${userId}:`, err);
    return null;
  }
}

function saveUserVault(userId, vaultData) {
  const vPath = getVaultPath(userId);
  fs.writeFileSync(vPath, JSON.stringify(vaultData, null, 2), 'utf-8');
}

// Initialize Demo User if not exists
function ensureDemoUser() {
  const users = getUsers();
  let demoUser = users.find(u => u.email === 'curator@athenaeum.vault');

  if (!demoUser) {
    const { hash, salt } = hashPassword('password123');
    demoUser = {
      id: 'usr-curator-demo',
      email: 'curator@athenaeum.vault',
      name: 'Deepjyoti',
      role: 'Lead Curator & Systems Architect',
      operatorId: 'OPR-7821-LDN',
      clearance: 'LEVEL 5 (ROOT_VAULT)',
      station: 'DESK_ALPHA_01',
      passwordHash: hash,
      salt: salt,
      createdAt: '2025-05-01T08:00:00.000Z',
      isDemo: true
    };
    users.push(demoUser);
    saveUsers(users);
    console.log('[Athenaeum Server] Seeded master demo curator user');
  }

  // Ensure demo user has the reference mock data
  const demoVaultPath = getVaultPath('usr-curator-demo');
  if (!fs.existsSync(demoVaultPath)) {
    // Try to load initial mockData from src if available
    try {
      const mockDataPath = path.join(__dirname, '..', 'src', 'data', 'mockData.js');
      if (fs.existsSync(mockDataPath)) {
        // Will be seeded from frontend or default seed helper
      }
    } catch (e) {
      console.warn('Could not load mockData for demo seed:', e);
    }
  }
}

ensureDemoUser();

// Auth Middleware
function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required. No bearer token provided.' });
  }

  const token = authHeader.split(' ')[1];
  const userId = parseToken(token);
  if (!userId) {
    return res.status(401).json({ error: 'Invalid or malformed authentication token.' });
  }

  const users = getUsers();
  const user = users.find(u => u.id === userId);
  if (!user) {
    return res.status(401).json({ error: 'User associated with token no longer exists.' });
  }

  req.user = user;
  next();
}

// ==========================================
// ROUTES
// ==========================================

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    service: 'ATHENAEUM_AUTH_ENGINE',
    version: '1.0.4',
    timestamp: new Date().toISOString()
  });
});

// 1. SIGN UP (NEW USER GETS ZERO DATA)
app.post('/api/auth/signup', (req, res) => {
  try {
    const { email, password, name, role } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Full name, email address, and password are required.' });
    }

    if (password.length < 4) {
      return res.status(400).json({ error: 'Password must be at least 4 characters long.' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const users = getUsers();

    if (users.some(u => u.email.toLowerCase() === normalizedEmail)) {
      return res.status(409).json({ error: 'An archival curator identity with this email already exists.' });
    }

    const { hash, salt } = hashPassword(password);
    const userId = `usr-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const randomOpNum = Math.floor(1000 + Math.random() * 9000);

    const newUser = {
      id: userId,
      email: normalizedEmail,
      name: name.trim(),
      role: (role && role.trim()) || 'Junior Curator & Archival Fellow',
      operatorId: `OPR-${randomOpNum}-LDN`,
      clearance: 'LEVEL 1 (READ_WRITE)',
      station: `NODE_STATION_${Math.floor(Math.random() * 8) + 1}`,
      passwordHash: hash,
      salt: salt,
      createdAt: new Date().toISOString(),
      isDemo: false
    };

    // CRITICAL: Initialize with completely ZERO data for new users!
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

    users.push(newUser);
    saveUsers(users);
    saveUserVault(userId, emptyVault);

    const token = generateToken(userId);

    const safeUser = { ...newUser };
    delete safeUser.passwordHash;
    delete safeUser.salt;

    console.log(`[Athenaeum Auth] New user registered: ${safeUser.email} (ID: ${userId}) with ZERO data.`);

    return res.status(201).json({
      success: true,
      message: 'Curator account registered successfully. Personal vault initialized to zero.',
      user: safeUser,
      token,
      vault: emptyVault
    });
  } catch (err) {
    console.error('Signup error:', err);
    return res.status(500).json({ error: 'Internal archival authentication error during signup.' });
  }
});

// 2. SIGN IN
app.post('/api/auth/login', (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const users = getUsers();
    const user = users.find(u => u.email.toLowerCase() === normalizedEmail);

    if (!user) {
      return res.status(401).json({ error: 'No curator record found matching this email address.' });
    }

    const isValid = verifyPassword(password, user.salt, user.passwordHash);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid password. Check credentials and retry.' });
    }

    const token = generateToken(user.id);
    const vault = getUserVault(user.id);

    const safeUser = { ...user };
    delete safeUser.passwordHash;
    delete safeUser.salt;

    console.log(`[Athenaeum Auth] User logged in: ${safeUser.email}`);

    return res.json({
      success: true,
      user: safeUser,
      token,
      vault
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Internal archival authentication error during login.' });
  }
});

// 3. CURRENT AUTHENTICATED USER
app.get('/api/auth/me', authenticate, (req, res) => {
  const safeUser = { ...req.user };
  delete safeUser.passwordHash;
  delete safeUser.salt;
  const vault = getUserVault(req.user.id);

  res.json({
    user: safeUser,
    vaultSummary: {
      worksCount: vault?.works?.length || 0,
      actionsCount: vault?.actions?.length || 0,
      entriesCount: vault?.entries?.length || 0,
      collectionsCount: vault?.collections?.length || 0
    }
  });
});

// 4. UPDATE CURRENT PROFILE
app.put('/api/auth/profile', authenticate, (req, res) => {
  try {
    const { name, role, clearance, station } = req.body;
    const users = getUsers();
    const idx = users.findIndex(u => u.id === req.user.id);

    if (idx === -1) {
      return res.status(404).json({ error: 'User not found.' });
    }

    if (name) users[idx].name = name.trim();
    if (role) users[idx].role = role.trim();
    if (clearance) users[idx].clearance = clearance.trim();
    if (station) users[idx].station = station.trim();

    saveUsers(users);

    const safeUser = { ...users[idx] };
    delete safeUser.passwordHash;
    delete safeUser.salt;

    res.json({
      success: true,
      user: safeUser
    });
  } catch (err) {
    console.error('Profile update error:', err);
    res.status(500).json({ error: 'Failed to update user profile.' });
  }
});

// 5. GET USER VAULT DATA
app.get('/api/vault', authenticate, (req, res) => {
  const vault = getUserVault(req.user.id);
  res.json({ vault: vault || {} });
});

// 6. SAVE / SYNC USER VAULT DATA
app.put('/api/vault', authenticate, (req, res) => {
  try {
    const { works, actions, entries, collections, people, places, resources, dailyLogs, activity } = req.body;
    const current = getUserVault(req.user.id) || {};

    const updatedVault = {
      ...current,
      works: works !== undefined ? works : current.works || [],
      actions: actions !== undefined ? actions : current.actions || [],
      entries: entries !== undefined ? entries : current.entries || [],
      collections: collections !== undefined ? collections : current.collections || [],
      people: people !== undefined ? people : current.people || [],
      places: places !== undefined ? places : current.places || [],
      resources: resources !== undefined ? resources : current.resources || [],
      dailyLogs: dailyLogs !== undefined ? dailyLogs : current.dailyLogs || [],
      activity: activity !== undefined ? activity : current.activity || []
    };

    saveUserVault(req.user.id, updatedVault);
    res.json({ success: true, timestamp: Date.now() });
  } catch (err) {
    console.error('Vault save error:', err);
    res.status(500).json({ error: 'Failed to persist vault changes.' });
  }
});

// 7. SEED DEMO VAULT (Helper to populate demo user if needed)
app.post('/api/vault/seed-demo', authenticate, (req, res) => {
  try {
    const { works, actions, entries, collections, people, places, resources } = req.body;
    const demoVault = {
      works: works || [],
      actions: actions || [],
      entries: entries || [],
      collections: collections || [],
      people: people || [],
      places: places || [],
      resources: resources || [],
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
    saveUserVault(req.user.id, demoVault);
    res.json({ success: true, vault: demoVault });
  } catch (err) {
    res.status(500).json({ error: 'Failed to seed demo vault.' });
  }
});

// 8. LOGOUT
app.post('/api/auth/logout', authenticate, (req, res) => {
  res.json({ success: true, message: 'Logged out successfully.' });
});

// Start listening
app.listen(PORT, () => {
  console.log(`[Athenaeum Vault Server] Authentication & Vault Engine active on http://localhost:${PORT}`);
});
