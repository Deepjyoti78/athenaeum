import React, { useState } from 'react';
import { 
  CheckSquare, 
  Search, 
  Plus, 
  ArrowUpDown, 
  Check, 
  Clock, 
  Filter, 
  Trash2,
  Calendar
} from 'lucide-react';

export function ActionsView({ actions, onToggleActionStatus, onChangePriority, onAddAction }) {
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [filterPriority, setFilterPriority] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('time');
  const [isAdding, setIsAdding] = useState(false);

  // New action form state
  const [newTitle, setNewTitle] = useState('');
  const [newWork, setNewWork] = useState('Athenaeum App Project');
  const [newTime, setNewTime] = useState('12:00');
  const [newPriority, setNewPriority] = useState(3);

  const statuses = ['ALL', 'DUE TODAY', 'IN PROGRESS', 'TO DO', 'WAITING', 'COMPLETED'];
  const priorities = ['ALL', '1', '2', '3', '4', '5'];

  const handleCreateAction = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    const action = {
      id: Date.now(),
      time: newTime || '12:00',
      action: newTitle.trim(),
      work: newWork,
      status: 'To do',
      priority: Number(newPriority),
      date: '2025-05-09'
    };
    onAddAction(action);
    setNewTitle('');
    setIsAdding(false);
  };

  const filteredActions = actions.filter(act => {
    const matchesStatus = filterStatus === 'ALL' || 
      (filterStatus === 'DUE TODAY' && act.status !== 'Completed') ||
      act.status.toUpperCase() === filterStatus;
    const matchesPriority = filterPriority === 'ALL' || act.priority === Number(filterPriority);
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || act.action.toLowerCase().includes(q) || act.work.toLowerCase().includes(q);
    return matchesStatus && matchesPriority && matchesSearch;
  }).sort((a, b) => {
    if (sortBy === 'priority') return b.priority - a.priority;
    if (sortBy === 'work') return a.work.localeCompare(b.work);
    return a.time.localeCompare(b.time);
  });

  return (
    <div className="flex-1 flex flex-col h-full bg-[#E9E5D8] overflow-hidden select-none font-mono">
      {/* Header & Controls */}
      <div className="p-3 border-b border-[#AAA99B] bg-[#DFDBD0] flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 bg-[#738A62] inline-block"></span>
          <h1 className="text-xs font-bold uppercase tracking-wider text-[#25251F]">
            ACTIONS &amp; TASK REGISTRY
          </h1>
          <span className="text-[9px] text-[#77766B]">
            ({filteredActions.length} OF {actions.length} TASKS)
          </span>
        </div>

        <div className="flex items-center space-x-2">
          {/* Search */}
          <div className="flex items-center space-x-1.5 bg-[#FAF8F3] border border-[#AAA99B] px-2 py-0.5 text-[9px]">
            <Search className="w-3 h-3 text-[#77766B]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search actions or works..."
              className="bg-transparent text-[9px] text-[#25251F] focus:outline-none w-44"
            />
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-[#FAF8F3] border border-[#AAA99B] px-2 py-0.5 text-[8.5px] text-[#25251F] focus:outline-none"
          >
            <option value="time">SORT: TIME</option>
            <option value="priority">SORT: PRIORITY</option>
            <option value="work">SORT: WORK</option>
          </select>

          {/* + Add Action button */}
          <button
            onClick={() => setIsAdding(!isAdding)}
            className="bg-[#25251F] text-[#E9E5D8] hover:bg-black px-2.5 py-1 text-[8.5px] font-semibold uppercase tracking-wider flex items-center space-x-1"
          >
            <Plus className="w-2.5 h-2.5" />
            <span>ADD ACTION</span>
          </button>
        </div>
      </div>

      {/* Quick Add Bar */}
      {isAdding && (
        <form onSubmit={handleCreateAction} className="p-2 border-b border-[#AAA99B] bg-[#E3DFD2] flex flex-wrap items-center gap-2 text-[9px] animate-card-enter">
          <span className="font-bold text-[#25251F] text-[8px] uppercase">NEW:</span>
          <input
            type="text"
            required
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Action description..."
            className="flex-1 bg-[#FAF8F3] border border-[#AAA99B] px-2 py-1 text-[9px] focus:outline-none min-w-[200px]"
            autoFocus
          />
          <input
            type="text"
            value={newTime}
            onChange={(e) => setNewTime(e.target.value)}
            placeholder="14:00"
            className="w-16 bg-[#FAF8F3] border border-[#AAA99B] px-1.5 py-1 text-[9px] focus:outline-none text-center"
          />
          <select
            value={newWork}
            onChange={(e) => setNewWork(e.target.value)}
            className="bg-[#FAF8F3] border border-[#AAA99B] px-2 py-1 text-[9px] focus:outline-none"
          >
            <option value="Athenaeum App Project">Athenaeum App Project</option>
            <option value="East London Heritage Archive">East London Heritage Archive</option>
            <option value="Creature Concept Explorations">Creature Concept Explorations</option>
            <option value="Photography Portfolio">Photography Portfolio</option>
            <option value="Daily Journal">Daily Journal</option>
          </select>
          <select
            value={newPriority}
            onChange={(e) => setNewPriority(e.target.value)}
            className="bg-[#FAF8F3] border border-[#AAA99B] px-2 py-1 text-[9px] focus:outline-none"
          >
            <option value={1}>P1 (Low)</option>
            <option value={2}>P2 (Normal)</option>
            <option value={3}>P3 (Important)</option>
            <option value={4}>P4 (High)</option>
            <option value={5}>P5 (Critical)</option>
          </select>
          <button
            type="submit"
            className="bg-[#25251F] text-[#E9E5D8] px-3 py-1 font-semibold text-[8px] uppercase tracking-wider hover:bg-black"
          >
            COMMIT
          </button>
          <button
            type="button"
            onClick={() => setIsAdding(false)}
            className="border border-[#AAA99B] bg-[#DFDBD0] px-2 py-1 text-[8px] uppercase hover:bg-[#D5D1C4]"
          >
            CANCEL
          </button>
        </form>
      )}

      {/* Filter Tabs Bar */}
      <div className="px-3 py-1.5 border-b border-[#AAA99B] bg-[#ECE7DC] flex items-center justify-between text-[8px]">
        <div className="flex items-center space-x-1">
          <span className="text-[#77766B] mr-1 uppercase">STATUS:</span>
          {statuses.map(s => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-2 py-0.5 border ${
                filterStatus === s
                  ? 'border-[#25251F] bg-[#25251F] text-[#E9E5D8] font-bold'
                  : 'border-[#AAA99B] bg-[#DFDBD0] text-[#55544B] hover:bg-[#D5D1C4]'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-1">
          <span className="text-[#77766B] mr-1 uppercase">PRIORITY:</span>
          {priorities.map(p => (
            <button
              key={p}
              onClick={() => setFilterPriority(p)}
              className={`px-1.5 py-0.5 border ${
                filterPriority === p
                  ? 'border-[#25251F] bg-[#25251F] text-[#E9E5D8] font-bold'
                  : 'border-[#AAA99B] bg-[#DFDBD0] text-[#55544B] hover:bg-[#D5D1C4]'
              }`}
            >
              {p === 'ALL' ? 'ALL' : `P${p}`}
            </button>
          ))}
        </div>
      </div>

      {/* Actions Table */}
      <div className="flex-1 overflow-y-auto p-3">
        <div className="border border-[#AAA99B] bg-[#E9E5D8]">
          <table className="w-full text-left border-collapse text-[9px] font-mono">
            <thead>
              <tr className="border-b border-[#AAA99B] bg-[#DFDBD0] text-[#666] uppercase text-[8px]">
                <th className="py-2 px-3 font-normal w-10 text-center">DONE</th>
                <th className="py-2 px-3 font-normal w-16">TIME</th>
                <th className="py-2 px-3 font-normal">ACTION</th>
                <th className="py-2 px-3 font-normal w-48">LINKED WORK</th>
                <th className="py-2 px-3 font-normal w-28">STATUS</th>
                <th className="py-2 px-3 font-normal w-24 text-right">PRIORITY</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DDD9CD]">
              {filteredActions.map((item, idx) => {
                const isDone = item.status === 'Completed';
                return (
                  <tr 
                    key={item.id}
                    style={{ animationDelay: `${Math.min(idx * 25, 400)}ms` }}
                    className="hover:bg-[#E2DDD0] transition-colors group animate-fade-in"
                  >
                    {/* Done Checkbox */}
                    <td className="py-2 px-3 text-center">
                      <button
                        onClick={() => onToggleActionStatus(item.id)}
                        className={`w-3.5 h-3.5 border flex items-center justify-center transition-colors mx-auto ${
                          isDone 
                            ? 'bg-[#25251F] border-[#25251F] text-[#E9E5D8]' 
                            : 'border-[#AAA99B] bg-[#FAF8F3] hover:border-[#25251F]'
                        }`}
                        title={isDone ? "Mark incomplete" : "Mark completed"}
                      >
                        {isDone && <Check className="w-2.5 h-2.5" strokeWidth={3} />}
                      </button>
                    </td>

                    {/* Time */}
                    <td className="py-2 px-3 text-[#66655A] font-mono whitespace-nowrap">
                      {item.time}
                    </td>

                    {/* Action Text */}
                    <td className="py-2 px-3 text-[#25251F] font-medium">
                      <div className="flex items-center space-x-2">
                        <span className={isDone ? 'line-through text-[#88877A]' : ''}>
                          {item.action}
                        </span>
                      </div>
                      {item.notes && (
                        <div className="text-[7.5px] text-[#77766B] mt-0.5">
                          {item.notes}
                        </div>
                      )}
                    </td>

                    {/* Work */}
                    <td className="py-2 px-3 text-[#55544B]">
                      <span className="bg-[#DFDBD0] px-1.5 py-0.5 border border-[#AAA99B] text-[8px] truncate inline-block max-w-[180px]">
                        {item.work}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-2 px-3">
                      <button
                        onClick={() => onToggleActionStatus(item.id)}
                        className="flex items-center space-x-1.5 hover:underline cursor-pointer"
                        title="Click to advance status"
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          item.status === 'In progress' ? 'bg-[#738A62]' :
                          item.status === 'Completed' ? 'bg-[#3F5439]' :
                          item.status === 'Waiting' ? 'bg-[#6A7B8E]' : 'bg-[#9E9D8E]'
                        }`}></span>
                        <span className="font-semibold text-[#25251F]">
                          {item.status}
                        </span>
                      </button>
                    </td>

                    {/* Priority */}
                    <td className="py-2 px-3 text-right">
                      <button
                        onClick={() => onChangePriority(item.id)}
                        className="inline-flex space-x-0.5 cursor-pointer"
                        title="Click to cycle priority (1-5)"
                      >
                        {[1, 2, 3, 4, 5].map((lvl) => (
                          <span
                            key={lvl}
                            className={`w-2 h-2 rounded-full inline-block ${
                              lvl <= item.priority ? 'bg-[#25251F]' : 'bg-[#C7C3B7]'
                            }`}
                          />
                        ))}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

