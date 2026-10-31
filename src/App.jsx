import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { TopToolbar } from './components/TopToolbar';
import { OverviewMetrics } from './components/OverviewMetrics';
import { RecentWorks } from './components/RecentWorks';
import { UpcomingActions } from './components/UpcomingActions';
import { DailyLog } from './components/DailyLog';
import { RecentEntries } from './components/RecentEntries';
import { CollectionHighlight } from './components/CollectionHighlight';
import { RecordInspector } from './components/RecordInspector';
import { BottomStatusBar } from './components/BottomStatusBar';
import { NewRecordModal } from './components/NewRecordModal';
import { SearchModal } from './components/SearchModal';
import { ViewAllModal } from './components/ViewAllModal';

// Dedicated Full-Page Archival Views
import { WorksView } from './components/WorksView';
import { ActionsView } from './components/ActionsView';
import { EntriesView } from './components/EntriesView';
import { CollectionsView } from './components/CollectionsView';
import { PeopleView } from './components/PeopleView';
import { PlacesView } from './components/PlacesView';
import { ResourcesView } from './components/ResourcesView';
import { CalendarView } from './components/CalendarView';
import { DailyLogView } from './components/DailyLogView';
import { NewsView } from './components/NewsView';
import { SystemSettingsModal } from './components/SystemSettingsModal';

import { ArchiveProvider, useArchive } from './context/ArchiveContext';

function AthenaeumApp() {
  // Navigation State: 'dashboard' | 'works' | 'actions' | 'entries' | 'collections' | 'people' | 'places' | 'resources' | 'calendar' | 'daily-log'
  const [activeNav, setActiveNav] = useState('dashboard');

  const {
    isInitialized,
    works,
    actions,
    entries,
    collections,
    people,
    places,
    resources,
    selectedRecord,
    selectedRecordType,
    inspectRecord,
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
    createPerson,
    deletePerson,
    createPlace,
    deletePlace,
    createResource,
    deleteResource,
  } = useArchive();

  // Panels & Modals state
  const [isInspectorOpen, setIsInspectorOpen] = useState(true);
  const [isNewRecordOpen, setIsNewRecordOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [viewAllModal, setViewAllModal] = useState({ isOpen: false, type: '', title: '', items: [] });
  const [viewMode, setViewMode] = useState('default');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Keyboard shortcut for search (⌘K or Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSelectWork = (work) => {
    inspectRecord('work', work);
    if (!isInspectorOpen) setIsInspectorOpen(true);
  };

  const handleSelectRecentView = (viewName) => {
    const matchedWork = works.find(w => 
      (w.shortTitle && w.shortTitle.toLowerCase().includes(viewName.toLowerCase())) ||
      (w.title && w.title.toLowerCase().includes(viewName.toLowerCase()))
    );
    if (matchedWork) {
      handleSelectWork(matchedWork);
      setActiveNav('dashboard');
    } else if (viewName.toLowerCase().includes('actions')) {
      setActiveNav('actions');
    } else if (viewName.toLowerCase().includes('inspirations')) {
      setActiveNav('collections');
    } else if (viewName.toLowerCase().includes('reading')) {
      setActiveNav('resources');
    } else {
      showToast(`Viewing: ${viewName}`);
    }
  };

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
        setIsFullscreen(false);
      }
    }
  };

  const handleNavigate = (page) => {
    setActiveNav(page);
  };

  return (
    <div className="w-screen h-screen bg-[#171915] text-[#25251F] flex flex-col overflow-hidden font-mono select-none antialiased">
      {/* Outer Application Frame */}
      <div className="flex-1 flex overflow-hidden border border-[#2B2E27] m-1 rounded-[1px] shadow-2xl bg-[#11130F]">
        
        {/* 1. Left Sidebar (Navigation & Institutional Status) */}
        <Sidebar
          activeNav={activeNav}
          setActiveNav={(nav) => {
            if (nav === 'search') {
              setIsSearchOpen(true);
            } else {
              if (nav === 'news') {
                setIsInspectorOpen(false);
              }
              setActiveNav(nav);
            }
          }}
          onSelectRecentView={handleSelectRecentView}
          onOpenSearch={() => setIsSearchOpen(true)}
          onOpenSettings={() => setIsSettingsOpen(true)}
        />

        {/* 2. Central Workspace & Right Inspector Container */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#E9E5D8] overflow-hidden">
          
          {/* Top Application Header Bar */}
          <TopToolbar
            onOpenNewRecord={() => setIsNewRecordOpen(true)}
            isInspectorOpen={isInspectorOpen}
            onToggleInspector={() => setIsInspectorOpen(!isInspectorOpen)}
            onToggleFullscreen={handleToggleFullscreen}
            isFullscreen={isFullscreen}
            viewMode={viewMode}
            setViewMode={setViewMode}
          />

          {/* Central Main Panel & Inspector Row */}
          <div className="flex-1 flex min-h-0 overflow-hidden">
            
            {/* View Switcher: Shows Selected Active Page */}
            {activeNav === 'dashboard' && (
              <main className="flex-1 overflow-y-auto p-3.5 space-y-3.5 bg-[#E9E5D8]">
                <div className="max-w-[1024px] space-y-3.5">
                  {/* Section A: Overview Metrics */}
                  <OverviewMetrics 
                    onNavigate={handleNavigate}
                  />

                  {/* Section B: Recent Works Grid */}
                  <RecentWorks
                    works={works}
                    selectedWorkId={selectedRecord?.id || 'WRK-2025-0003'}
                    onSelectWork={handleSelectWork}
                    onViewAll={() => setActiveNav('works')}
                  />

                  {/* Section C & D: Upcoming Actions (60%) & Daily Log (40%) precisely aligning with 3:2 ratio */}
                  <div className="grid grid-cols-1 lg:grid-cols-5 gap-3 pb-3">
                    <div className="lg:col-span-3">
                      <UpcomingActions
                        actions={actions}
                        onToggleActionStatus={toggleActionStatus}
                        onChangePriority={cycleActionPriority}
                      />
                    </div>
                    <div className="lg:col-span-2">
                      <DailyLog
                        onViewLog={() => setActiveNav('daily-log')}
                      />
                    </div>
                  </div>
                </div>
              </main>
            )}

            {activeNav === 'works' && (
              <WorksView
                works={works}
                onSelectWork={handleSelectWork}
                onAddNewWork={() => setIsNewRecordOpen(true)}
              />
            )}

            {activeNav === 'actions' && (
              <ActionsView
                actions={actions}
                onToggleActionStatus={toggleActionStatus}
                onChangePriority={cycleActionPriority}
                onAddAction={async (newAct) => {
                  await createAction(newAct);
                  showToast(`Scheduled Action: ${newAct.action}`);
                }}
              />
            )}

            {activeNav === 'entries' && (
              <EntriesView
                entries={entries}
                onAddEntry={async (newEnt) => {
                  await createEntry(newEnt);
                  showToast(`Logged Entry: ${newEnt.title}`);
                }}
                onUpdateEntry={async (updatedEnt) => {
                  await updateEntry(updatedEnt);
                  showToast(`Entry updated.`);
                }}
              />
            )}

            {activeNav === 'collections' && (
              <CollectionsView
                collections={collections}
              />
            )}

            {activeNav === 'people' && (
              <PeopleView
                people={people}
                onAddPerson={async (newP) => {
                  await createPerson(newP);
                  showToast(`Registered Person: ${newP.name}`);
                }}
              />
            )}

            {activeNav === 'places' && (
              <PlacesView
                places={places}
                onAddPlace={async (newPlc) => {
                  await createPlace(newPlc);
                  showToast(`Recorded Locus: ${newPlc.name}`);
                }}
              />
            )}

            {activeNav === 'resources' && (
              <ResourcesView
                resources={resources}
                onAddResource={async (newRes) => {
                  await createResource(newRes);
                  showToast(`Cataloged Resource: ${newRes.title}`);
                }}
              />
            )}

            {activeNav === 'calendar' && (
              <CalendarView
                actions={actions}
                entries={entries}
              />
            )}

            {activeNav === 'daily-log' && (
              <DailyLogView />
            )}

            {activeNav === 'news' && (
              <NewsView onOpenNewRecord={() => setIsNewRecordOpen(true)} />
            )}

            {/* 3. Right Sidebar — Universal Record Inspector */}
            {isInspectorOpen && (
              <aside className="h-full flex-shrink-0 animate-fadeIn">
                <RecordInspector
                  onClose={() => setIsInspectorOpen(false)}
                  onOpenLinkedRecords={(key) => {
                    if (key === 'actions') {
                      setActiveNav('actions');
                    } else if (key === 'entries') {
                      setActiveNav('entries');
                    } else if (key === 'collections') {
                      setActiveNav('collections');
                    } else if (key === 'people') {
                      setActiveNav('people');
                    }
                  }}
                />
              </aside>
            )}
          </div>
        </div>
      </div>

      {/* 4. Full-Width Bottom Status Bar */}
      <BottomStatusBar />

      {/* Modals & Dialogs */}
      <NewRecordModal
        isOpen={isNewRecordOpen}
        onClose={() => setIsNewRecordOpen(false)}
      />

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigate={handleNavigate}
      />

      <SystemSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        works={works}
        actions={actions}
        entries={entries}
      />

      <ViewAllModal
        isOpen={viewAllModal.isOpen}
        onClose={() => setViewAllModal({ ...viewAllModal, isOpen: false })}
        title={viewAllModal.title}
        type={viewAllModal.type}
        items={viewAllModal.items}
        onSelectItem={(item) => {
          if (viewAllModal.type === 'works') {
            handleSelectWork(item);
          }
        }}
      />

      {/* Ephemeral Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-9 right-4 bg-[#11130F] text-[#E9E5D8] border border-[#777A5A] px-3 py-1.5 text-[9px] font-mono shadow-xl z-50 flex items-center space-x-2 animate-bounce">
          <span className="w-1.5 h-1.5 rounded-full bg-[#738A62]"></span>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <ArchiveProvider>
      <AthenaeumApp />
    </ArchiveProvider>
  );
}
