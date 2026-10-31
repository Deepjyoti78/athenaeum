// ATHENAEUM — Central Archival Context & State Manager
// Supports Multi-Tenant Vault Isolation per Curator Account
import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { fetchUserVault, syncUserVault } from '../services/auth';
import { 
  seedDatabaseIfEmpty, 
  dbGetAll, 
  dbPut, 
  dbDelete, 
  logActivity, 
  resetDatabaseToDefaults, 
  exportVaultJSON, 
  importVaultJSON 
} from '../services/db';

const ArchiveContext = createContext(null);

export function ArchiveProvider({ children }) {
  const { currentUser, token } = useAuth();
  const [isInitialized, setIsInitialized] = useState(false);

  // Core Data Stores (scoped to the authenticated user)
  const [works, setWorks] = useState([]);
  const [actions, setActions] = useState([]);
  const [entries, setEntries] = useState([]);
  const [collections, setCollections] = useState([]);
  const [people, setPeople] = useState([]);
  const [places, setPlaces] = useState([]);
  const [resources, setResources] = useState([]);
  const [dailyLogs, setDailyLogs] = useState([]);
  const [activity, setActivity] = useState([]);

  // Universal Inspector Selection
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [selectedRecordType, setSelectedRecordType] = useState('work');

  // Load User's Isolated Vault
  const refreshData = useCallback(async () => {
    if (!currentUser) {
      setWorks([]);
      setActions([]);
      setEntries([]);
      setCollections([]);
      setPeople([]);
      setPlaces([]);
      setResources([]);
      setDailyLogs([]);
      setActivity([]);
      setSelectedRecord(null);
      setIsInitialized(false);
      return;
    }

    try {
      // Fetch user-specific vault from backend / local vault store
      const vault = await fetchUserVault(token, currentUser.id);

      const w = vault?.works || [];
      const a = vault?.actions || [];
      const e = vault?.entries || [];
      const c = vault?.collections || [];
      const p = vault?.people || [];
      const pl = vault?.places || [];
      const r = vault?.resources || [];
      const dl = vault?.dailyLogs || [];
      const act = vault?.activity || [];

      setWorks(w);
      setActions(a);
      setEntries(e);
      setCollections(c);
      setPeople(p);
      setPlaces(pl);
      setResources(r);
      setDailyLogs(dl);
      setActivity(act);

      // Default inspector selection if works exist
      if (w.length > 0) {
        const defaultWork = w.find(item => item.id === 'WRK-2025-0003') || w[0];
        setSelectedRecord(defaultWork);
        setSelectedRecordType('work');
      } else {
        setSelectedRecord(null);
      }

      setIsInitialized(true);
    } catch (err) {
      console.error('Failed to load user vault:', err);
      setIsInitialized(true);
    }
  }, [currentUser, token]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Sync changes to user's vault
  const persistVaultState = async (overrides = {}) => {
    if (!currentUser) return;
    const vaultData = {
      works,
      actions,
      entries,
      collections,
      people,
      places,
      resources,
      dailyLogs,
      activity,
      ...overrides
    };
    await syncUserVault(token, currentUser.id, vaultData);
  };

  // Universal Inspector Selection helper
  const inspectRecord = (type, record) => {
    setSelectedRecordType(type);
    setSelectedRecord(record);
  };

  // --- WORKS CRUD ---
  const createWork = async (workData) => {
    const id = workData.id || `WRK-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9000) + 1000)}`;
    const newWork = {
      ...workData,
      id,
      created: workData.created || '09 May 2025',
      updated: 'Today',
      progress: workData.progress || 0,
      tags: workData.tags || [],
      milestones: workData.milestones || [
        { name: 'Initial Planning', status: 'done' },
        { name: 'Core Implementation', status: 'current' },
        { name: 'Archival Storage', status: 'pending' },
      ],
      linkedRecords: workData.linkedRecords || { actions: 0, entries: 0, collections: 0, people: 0 },
      notes: workData.notes || [],
      links: workData.links || [],
      files: workData.files || [],
      artwork: workData.artwork || 'blueprint'
    };

    const updatedWorks = [newWork, ...works];
    setWorks(updatedWorks);
    inspectRecord('work', newWork);
    await persistVaultState({ works: updatedWorks });
    return newWork;
  };

  const updateWork = async (updatedWork) => {
    const work = {
      ...updatedWork,
      updated: 'Today 10:24'
    };
    const updatedWorks = works.map(w => w.id === work.id ? work : w);
    setWorks(updatedWorks);
    if (selectedRecord?.id === work.id) setSelectedRecord(work);
    await persistVaultState({ works: updatedWorks });
    return work;
  };

  const deleteWork = async (id) => {
    const updatedWorks = works.filter(w => w.id !== id);
    setWorks(updatedWorks);
    if (selectedRecord?.id === id) {
      if (updatedWorks.length > 0) {
        inspectRecord('work', updatedWorks[0]);
      } else {
        setSelectedRecord(null);
      }
    }
    await persistVaultState({ works: updatedWorks });
  };

  // --- ACTIONS CRUD ---
  const createAction = async (actionData) => {
    const id = actionData.id || Date.now();
    const newAction = {
      ...actionData,
      id,
      time: actionData.time || '12:00',
      status: actionData.status || 'To do',
      priority: Number(actionData.priority) || 3,
      date: actionData.date || '2025-05-09',
      notes: actionData.notes || ''
    };
    const updatedActions = [newAction, ...actions];
    setActions(updatedActions);
    await persistVaultState({ actions: updatedActions });
    return newAction;
  };

  const updateAction = async (updatedAction) => {
    const updatedActions = actions.map(a => a.id === updatedAction.id ? updatedAction : a);
    setActions(updatedActions);
    if (selectedRecord?.id === updatedAction.id) setSelectedRecord(updatedAction);
    await persistVaultState({ actions: updatedActions });
    return updatedAction;
  };

  const deleteAction = async (id) => {
    const updatedActions = actions.filter(a => a.id !== id);
    setActions(updatedActions);
    if (selectedRecord?.id === id) setSelectedRecord(null);
    await persistVaultState({ actions: updatedActions });
  };

  const toggleActionStatus = async (id) => {
    const act = actions.find(a => a.id === id);
    if (!act) return;
    const cycle = {
      'To do': 'In progress',
      'In progress': 'Completed',
      'Completed': 'Waiting',
      'Waiting': 'To do'
    };
    const nextStatus = cycle[act.status] || 'To do';
    const updated = { ...act, status: nextStatus };
    const updatedActions = actions.map(a => a.id === id ? updated : a);
    setActions(updatedActions);
    if (selectedRecord?.id === id) setSelectedRecord(updated);
    await persistVaultState({ actions: updatedActions });
  };

  const cycleActionPriority = async (id) => {
    const act = actions.find(a => a.id === id);
    if (!act) return;
    const nextP = (act.priority % 5) + 1;
    const updated = { ...act, priority: nextP };
    const updatedActions = actions.map(a => a.id === id ? updated : a);
    setActions(updatedActions);
    if (selectedRecord?.id === id) setSelectedRecord(updated);
    await persistVaultState({ actions: updatedActions });
  };

  // --- ENTRIES CRUD ---
  const createEntry = async (entryData) => {
    const id = entryData.id || Date.now();
    const newEntry = {
      ...entryData,
      id,
      date: entryData.date || '09 MAY 2025',
      time: entryData.time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      category: entryData.category || 'Project Note',
      author: currentUser?.name || 'Curator',
      content: entryData.content || ''
    };
    const updatedEntries = [newEntry, ...entries];
    setEntries(updatedEntries);
    inspectRecord('entry', newEntry);
    await persistVaultState({ entries: updatedEntries });
    return newEntry;
  };

  const updateEntry = async (updatedEntry) => {
    const updatedEntries = entries.map(e => e.id === updatedEntry.id ? updatedEntry : e);
    setEntries(updatedEntries);
    if (selectedRecord?.id === updatedEntry.id) setSelectedRecord(updatedEntry);
    await persistVaultState({ entries: updatedEntries });
    return updatedEntry;
  };

  const deleteEntry = async (id) => {
    const updatedEntries = entries.filter(e => e.id !== id);
    setEntries(updatedEntries);
    if (selectedRecord?.id === id) setSelectedRecord(null);
    await persistVaultState({ entries: updatedEntries });
  };

  // --- COLLECTIONS CRUD ---
  const createCollection = async (colData) => {
    const id = colData.id || `col-${Date.now()}`;
    const newCol = {
      ...colData,
      id,
      itemCount: (colData.items || []).length,
      items: colData.items || [],
      created: '09 May 2025'
    };
    const updatedCols = [newCol, ...collections];
    setCollections(updatedCols);
    inspectRecord('collection', newCol);
    await persistVaultState({ collections: updatedCols });
    return newCol;
  };

  const updateCollection = async (updatedCol) => {
    const col = {
      ...updatedCol,
      itemCount: (updatedCol.items || []).length
    };
    const updatedCols = collections.map(c => c.id === col.id ? col : c);
    setCollections(updatedCols);
    if (selectedRecord?.id === col.id) setSelectedRecord(col);
    await persistVaultState({ collections: updatedCols });
    return col;
  };

  const deleteCollection = async (id) => {
    const updatedCols = collections.filter(c => c.id !== id);
    setCollections(updatedCols);
    if (selectedRecord?.id === id) setSelectedRecord(null);
    await persistVaultState({ collections: updatedCols });
  };

  // --- PEOPLE CRUD ---
  const createPerson = async (personData) => {
    const id = personData.id || `p-${Date.now()}`;
    const newPerson = {
      ...personData,
      id,
      worksCount: personData.worksCount || 0,
      status: personData.status || 'Active'
    };
    const updatedPeople = [newPerson, ...people];
    setPeople(updatedPeople);
    inspectRecord('person', newPerson);
    await persistVaultState({ people: updatedPeople });
    return newPerson;
  };

  const updatePerson = async (updatedPerson) => {
    const updatedPeople = people.map(p => p.id === updatedPerson.id ? updatedPerson : p);
    setPeople(updatedPeople);
    if (selectedRecord?.id === updatedPerson.id) setSelectedRecord(updatedPerson);
    await persistVaultState({ people: updatedPeople });
    return updatedPerson;
  };

  const deletePerson = async (id) => {
    const updatedPeople = people.filter(p => p.id !== id);
    setPeople(updatedPeople);
    if (selectedRecord?.id === id) setSelectedRecord(null);
    await persistVaultState({ people: updatedPeople });
  };

  // --- PLACES CRUD ---
  const createPlace = async (placeData) => {
    const id = placeData.id || `plc-${Date.now()}`;
    const newPlace = {
      ...placeData,
      id,
      recordsCount: placeData.recordsCount || 1,
      established: placeData.established || '1900'
    };
    const updatedPlaces = [newPlace, ...places];
    setPlaces(updatedPlaces);
    inspectRecord('place', newPlace);
    await persistVaultState({ places: updatedPlaces });
    return newPlace;
  };

  const updatePlace = async (updatedPlace) => {
    const updatedPlaces = places.map(p => p.id === updatedPlace.id ? updatedPlace : p);
    setPlaces(updatedPlaces);
    if (selectedRecord?.id === updatedPlace.id) setSelectedRecord(updatedPlace);
    await persistVaultState({ places: updatedPlaces });
    return updatedPlace;
  };

  const deletePlace = async (id) => {
    const updatedPlaces = places.filter(p => p.id !== id);
    setPlaces(updatedPlaces);
    if (selectedRecord?.id === id) setSelectedRecord(null);
    await persistVaultState({ places: updatedPlaces });
  };

  // --- RESOURCES CRUD ---
  const createResource = async (resData) => {
    const id = resData.id || `res-${Date.now()}`;
    const newRes = {
      ...resData,
      id,
      format: resData.format || 'PDF',
      size: resData.size || '1.0 MB',
      locus: resData.locus || 'General Shelf'
    };
    const updatedRes = [newRes, ...resources];
    setResources(updatedRes);
    inspectRecord('resource', newRes);
    await persistVaultState({ resources: updatedRes });
    return newRes;
  };

  const updateResource = async (updatedRes) => {
    const updated = resources.map(r => r.id === updatedRes.id ? updatedRes : r);
    setResources(updated);
    if (selectedRecord?.id === updatedRes.id) setSelectedRecord(updatedRes);
    await persistVaultState({ resources: updated });
    return updatedRes;
  };

  const deleteResource = async (id) => {
    const updated = resources.filter(r => r.id !== id);
    setResources(updated);
    if (selectedRecord?.id === id) setSelectedRecord(null);
    await persistVaultState({ resources: updated });
  };

  // --- DAILY LOG SAVE ---
  const saveDailyLog = async (logData) => {
    const date = logData.date || '09 MAY 2025';
    const logItem = {
      ...logData,
      date,
      updatedAt: Date.now()
    };
    const exists = dailyLogs.some(l => l.date === date);
    const updatedLogs = exists
      ? dailyLogs.map(l => l.date === date ? logItem : l)
      : [logItem, ...dailyLogs];
    setDailyLogs(updatedLogs);
    await persistVaultState({ dailyLogs: updatedLogs });
    return logItem;
  };

  // --- NOTES ON RECORDS ---
  const addNoteToRecord = async (recordType, recordId, noteText) => {
    if (!noteText.trim()) return;
    const newNote = {
      id: `n-${Date.now()}`,
      date: '09 May 2025',
      text: noteText.trim()
    };

    if (recordType === 'work') {
      const updatedWorks = works.map(w => w.id === recordId ? { ...w, notes: [newNote, ...(w.notes || [])] } : w);
      setWorks(updatedWorks);
      if (selectedRecord?.id === recordId) setSelectedRecord(updatedWorks.find(w => w.id === recordId));
      await persistVaultState({ works: updatedWorks });
    } else if (recordType === 'action') {
      const updatedActions = actions.map(a => a.id === recordId ? { ...a, notes: (a.notes ? a.notes + '\n' : '') + noteText.trim() } : a);
      setActions(updatedActions);
      if (selectedRecord?.id === recordId) setSelectedRecord(updatedActions.find(a => a.id === recordId));
      await persistVaultState({ actions: updatedActions });
    } else if (recordType === 'entry') {
      const updatedEntries = entries.map(e => e.id === recordId ? { ...e, notes: [newNote, ...(e.notes || [])] } : e);
      setEntries(updatedEntries);
      if (selectedRecord?.id === recordId) setSelectedRecord(updatedEntries.find(e => e.id === recordId));
      await persistVaultState({ entries: updatedEntries });
    }
  };

  const deleteNoteFromRecord = async (recordType, recordId, noteId) => {
    if (recordType === 'work') {
      const updatedWorks = works.map(w => w.id === recordId ? { ...w, notes: (w.notes || []).filter(n => n.id !== noteId) } : w);
      setWorks(updatedWorks);
      if (selectedRecord?.id === recordId) setSelectedRecord(updatedWorks.find(w => w.id === recordId));
      await persistVaultState({ works: updatedWorks });
    }
  };

  // --- DYNAMIC METRICS CALCULATION (ZERO DATA FOR NEW USERS) ---
  const dynamicMetrics = useMemo(() => {
    const isReady = isInitialized;
    const hasData = works.length > 0 || actions.length > 0 || entries.length > 0;

    // Actions Breakdown (Exact live counts)
    const actionsBreakdown = {
      todo: actions.filter(a => a.status === 'To do').length,
      inProgress: actions.filter(a => a.status === 'In progress').length,
      waiting: actions.filter(a => a.status === 'Waiting').length,
      completed: actions.filter(a => a.status === 'Completed').length,
      total: actions.length
    };

    // Works Breakdown
    const activeWorks = works.filter(w => w.status !== 'Completed');
    const worksBreakdown = {
      projects: works.filter(w => w.type === 'Project').length,
      research: works.filter(w => w.type === 'Research').length,
      creative: works.filter(w => w.type === 'Creative').length,
      maintenance: works.filter(w => w.type === 'Maintenance').length,
      activeTotal: activeWorks.length
    };

    // Entries
    const totalEntries = entries.length;

    // Weekly progress: 0 if no works exist
    const avgWorksProgress = works.length > 0 
      ? Math.round(works.reduce((acc, w) => acc + (Number(w.progress) || 0), 0) / works.length) 
      : 0;
    const weeklyProgress = avgWorksProgress;

    // Today's log
    const todayLog = dailyLogs.find(dl => dl.date === '09 MAY 2025' || dl.date === 'Today') || {
      date: '09 MAY 2025',
      note: hasData ? "Started working on the database structure and record model for Athenaeum." : "",
      mood: hasData ? 3 : 0,
      energy: hasData ? 72 : 0
    };

    return {
      pendingActionsCount: actionsBreakdown.total,
      actionsBreakdown,
      activeWorksCount: worksBreakdown.activeTotal,
      worksBreakdown,
      totalEntries,
      weeklyProgress,
      todayLog
    };
  }, [works, actions, entries, dailyLogs, isInitialized]);

  // System Administration
  const resetDemoData = async () => {
    await resetDatabaseToDefaults();
    await refreshData();
  };

  const exportBackupJSON = async () => {
    return exportVaultJSON();
  };

  const importBackupJSON = async (jsonObj) => {
    await importVaultJSON(jsonObj);
    await refreshData();
  };

  return (
    <ArchiveContext.Provider
      value={{
        isInitialized,
        works,
        actions,
        entries,
        collections,
        people,
        places,
        resources,
        dailyLogs,
        activity,
        selectedRecord,
        selectedRecordType,
        inspectRecord,
        dynamicMetrics,
        refreshData,
        // CRUD Methods
        createWork,
        updateWork,
        deleteWork,
        createAction,
        updateAction,
        deleteAction,
        toggleActionStatus,
        cycleActionPriority,
        createEntry,
        updateEntry,
        deleteEntry,
        createCollection,
        updateCollection,
        deleteCollection,
        createPerson,
        updatePerson,
        deletePerson,
        createPlace,
        updatePlace,
        deletePlace,
        createResource,
        updateResource,
        deleteResource,
        saveDailyLog,
        addNoteToRecord,
        deleteNoteFromRecord,
        resetDemoData,
        exportBackupJSON,
        importBackupJSON
      }}
    >
      {children}
    </ArchiveContext.Provider>
  );
}

export function useArchive() {
  const context = useContext(ArchiveContext);
  if (!context) {
    throw new Error('useArchive must be used within an ArchiveProvider');
  }
  return context;
}

export default ArchiveContext;
