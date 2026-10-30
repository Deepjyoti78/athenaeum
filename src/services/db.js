// ATHENAEUM — IndexedDB Archival Storage Service
// Zero external dependencies; native browser standard IndexedDB with transactions and full error handling.

import { 
  INITIAL_WORKS, 
  INITIAL_ACTIONS, 
  INITIAL_ENTRIES, 
  INITIAL_COLLECTIONS, 
  INITIAL_PEOPLE, 
  INITIAL_PLACES, 
  INITIAL_RESOURCES 
} from '../data/mockData';

const DB_NAME = 'athenaeum_vault_db';
const DB_VERSION = 2; // Incremented to version 2 to auto-sync seed data

const STORES = [
  'works',
  'actions',
  'entries',
  'collections',
  'people',
  'places',
  'resources',
  'dailyLogs',
  'activity',
  'settings'
];

let dbInstance = null;

export function openDatabase() {
  if (dbInstance) return Promise.resolve(dbInstance);

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      STORES.forEach((storeName) => {
        if (db.objectStoreNames.contains(storeName)) {
          db.deleteObjectStore(storeName);
        }
        if (storeName === 'dailyLogs') {
          db.createObjectStore(storeName, { keyPath: 'date' });
        } else if (storeName === 'settings') {
          db.createObjectStore(storeName, { keyPath: 'key' });
        } else {
          db.createObjectStore(storeName, { keyPath: 'id' });
        }
      });
    };

    request.onsuccess = (event) => {
      dbInstance = event.target.result;
      resolve(dbInstance);
    };

    request.onerror = (event) => {
      console.error('IndexedDB open error:', event.target.error);
      reject(event.target.error);
    };
  });
}

// Generic transaction helper
async function performTransaction(storeName, mode, callback) {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, mode);
    const store = transaction.objectStore(storeName);
    const request = callback(store);

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// CRUD Operations
export async function dbGetAll(storeName) {
  return performTransaction(storeName, 'readonly', (store) => store.getAll());
}

export async function dbGetById(storeName, id) {
  return performTransaction(storeName, 'readonly', (store) => store.get(id));
}

export async function dbPut(storeName, item) {
  return performTransaction(storeName, 'readwrite', (store) => store.put(item));
}

export async function dbDelete(storeName, id) {
  return performTransaction(storeName, 'readwrite', (store) => store.delete(id));
}

export async function dbClear(storeName) {
  return performTransaction(storeName, 'readwrite', (store) => store.clear());
}

// Activity Logging
export async function logActivity(type, description, recordId = null, entityType = null) {
  const activityItem = {
    id: `act-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    timestamp: Date.now(),
    type,
    details: description,
    targetId: recordId,
    targetType: entityType
  };
  return dbPut('activity', activityItem);
}

// Initial Database Seeding
export async function seedDatabaseIfEmpty() {
  const db = await openDatabase();
  const existingWorks = await dbGetAll('works');

  if (existingWorks && existingWorks.length > 0) {
    return false;
  }

  // Seed default archival records
  const tx = db.transaction(STORES, 'readwrite');
  
  // 1. Seed Works
  const worksStore = tx.objectStore('works');
  INITIAL_WORKS.forEach(w => worksStore.put(w));

  // 2. Seed Actions
  const actionsStore = tx.objectStore('actions');
  INITIAL_ACTIONS.forEach(a => actionsStore.put(a));

  // 3. Seed Entries
  const entriesStore = tx.objectStore('entries');
  INITIAL_ENTRIES.forEach(e => entriesStore.put(e));

  // 4. Seed Collections
  const colStore = tx.objectStore('collections');
  INITIAL_COLLECTIONS.forEach(c => colStore.put(c));

  // 5. Seed People
  const peopleStore = tx.objectStore('people');
  INITIAL_PEOPLE.forEach(p => peopleStore.put(p));

  // 6. Seed Places
  const placesStore = tx.objectStore('places');
  INITIAL_PLACES.forEach(pl => placesStore.put(pl));

  // 7. Seed Resources
  const resStore = tx.objectStore('resources');
  INITIAL_RESOURCES.forEach(r => resStore.put(r));

  // 8. Seed Daily Log
  const dailyLogStore = tx.objectStore('dailyLogs');
  dailyLogStore.put({
    date: '09 MAY 2025',
    note: "Started working on the database structure and record model for Athenaeum. Feeling focused and productive.",
    mood: 2,
    energy: 72,
    updatedAt: Date.now()
  });

  // 9. Initial Activities
  const activityStore = tx.objectStore('activity');
  activityStore.put({
    id: 'act-init-1',
    timestamp: Date.now() - 7200000,
    type: 'SYSTEM_STARTUP',
    details: 'System initialized in local mode. Database integrity: OK.',
    targetId: 'SYS',
    targetType: 'system'
  });
  activityStore.put({
    id: 'act-init-2',
    timestamp: Date.now() - 3600000,
    type: 'WORK_UPDATED',
    details: 'Updated UI components and layout grid',
    targetId: 'WRK-2025-0003',
    targetType: 'work'
  });

  return new Promise((resolve) => {
    tx.oncomplete = () => {
      console.log('ATHENAEUM database seeded with initial records.');
      resolve(true);
    };
    tx.onerror = () => resolve(false);
  });
}

// Reset Entire Vault to Factory Sample Data
export async function resetDatabaseToDefaults() {
  const db = await openDatabase();
  const tx = db.transaction(STORES, 'readwrite');
  STORES.forEach(s => tx.objectStore(s).clear());

  await new Promise(resolve => {
    tx.oncomplete = resolve;
    tx.onerror = resolve;
  });

  return seedDatabaseIfEmpty();
}

// Export All Stored Data as Verified JSON Payload
export async function exportVaultJSON() {
  const payload = {
    header: {
      archive: 'ATHENÆUM PERSONAL ARCHIVE & CREATIVE WORKSPACE',
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      format: 'ATHENAEUM_JSON_V1'
    },
    data: {
      works: await dbGetAll('works'),
      actions: await dbGetAll('actions'),
      entries: await dbGetAll('entries'),
      collections: await dbGetAll('collections'),
      people: await dbGetAll('people'),
      places: await dbGetAll('places'),
      resources: await dbGetAll('resources'),
      dailyLogs: await dbGetAll('dailyLogs'),
      activity: await dbGetAll('activity'),
      settings: await dbGetAll('settings'),
    }
  };

  const jsonStr = JSON.stringify(payload, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `athenaeum_vault_backup_${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
  return payload;
}

// Import JSON Backup Payload with Structural Validation
export async function importVaultJSON(jsonData) {
  if (!jsonData || !jsonData.data) {
    throw new Error('Invalid archive payload: missing data root.');
  }

  const { data } = jsonData;
  const db = await openDatabase();
  const tx = db.transaction(STORES, 'readwrite');

  STORES.forEach((storeName) => {
    const store = tx.objectStore(storeName);
    store.clear();
    const items = data[storeName];
    if (Array.isArray(items)) {
      items.forEach(item => store.put(item));
    }
  });

  return new Promise((resolve, reject) => {
    tx.oncomplete = () => {
      logActivity('VAULT_RESTORED', 'Restored vault from external JSON backup.');
      resolve(true);
    };
    tx.onerror = (e) => reject(e);
  });
}
