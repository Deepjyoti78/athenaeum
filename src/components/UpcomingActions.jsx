import React, { useState } from 'react';
import { ArrowUpDown } from 'lucide-react';
import { useArchive } from '../context/ArchiveContext';

export function UpcomingActions({ 
  actions: propActions, 
  onToggleActionStatus: propToggle, 
  onChangePriority: propPriority 
}) {
  const context = useArchive();
  const actions = propActions || context.actions || [];
  const onToggleActionStatus = propToggle || context.toggleActionStatus;
  const onChangePriority = propPriority || context.cycleActionPriority;
  const { inspectRecord } = context;

  const [sortField, setSortField] = useState('time');
  const [sortOrder, setSortOrder] = useState('asc');
  const [showAll, setShowAll] = useState(false);

  const handleSort = () => {
    if (sortField === 'time') {
      setSortField('priority');
    } else {
      setSortField('time');
    }
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const sortedActions = [...actions].sort((a, b) => {
    if (sortField === 'time') {
      return sortOrder === 'asc' ? (a.time || '').localeCompare(b.time || '') : (b.time || '').localeCompare(a.time || '');
    }
    return sortOrder === 'asc' ? (a.priority || 1) - (b.priority || 1) : (b.priority || 1) - (a.priority || 1);
  });

  // Display 5 primary actions initially, with working option to view additional tasks
  const displayActions = showAll ? sortedActions : sortedActions.slice(0, 5);

  return (
    <div className="border border-[#B5B3A4] bg-[#EAE7D9] flex flex-col justify-between select-none shadow-sm h-full">
      {/* Header */}
      <div>
        <div className="p-2.5 pb-2 border-b border-[#B5B3A4] flex items-center justify-between">
          <div className="flex items-center space-x-1.5">
            <span className="w-1.5 h-1.5 bg-[#171714] inline-block" />
            <span className="text-[10px] uppercase tracking-wider font-mono font-bold text-[#171714]">
              UPCOMING ACTIONS
            </span>
          </div>
        </div>

        {/* Table matching reference image */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-[8.5px] font-mono table-fixed">
            <thead>
              <tr className="border-b border-[#D5D1C4] text-[#66655A] uppercase text-[7.5px] font-mono tracking-wider">
                <th className="py-1.5 px-2 font-normal w-[12%]">TIME</th>
                <th className="py-1.5 px-2 font-normal w-[34%]">ACTION</th>
                <th className="py-1.5 px-2 font-normal w-[24%]">WORK</th>
                <th className="py-1.5 px-2 font-normal w-[18%]">STATUS</th>
                <th className="py-1.5 px-2 font-normal w-[12%] text-right pr-2">PRIORITY</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DCD8CB]">
              {displayActions.map((item) => {
                const isCompleted = item.status === 'Completed';
                return (
                  <tr 
                    key={item.id} 
                    className="hover:bg-[#E2DFD0] transition-colors group cursor-pointer"
                    onClick={() => inspectRecord && inspectRecord('action', item)}
                  >
                    {/* Time */}
                    <td className="py-1.5 px-2 text-[#66655A] font-mono whitespace-nowrap truncate">
                      {item.time}
                    </td>

                    {/* Action Title */}
                    <td className="py-1.5 px-2 text-[#171714] font-bold text-[8.5px] truncate group-hover:underline" title={item.action}>
                      <span className={`truncate block ${isCompleted ? 'line-through text-[#88877A]' : ''}`}>
                        {item.action}
                      </span>
                    </td>

                    {/* Linked Work */}
                    <td className="py-1.5 px-2 text-[#55544B] whitespace-nowrap truncate" title={item.work}>
                      <span className="truncate block">
                        {item.work}
                      </span>
                    </td>

                    {/* Status with half-moon / dot icon */}
                    <td className="py-1.5 px-2 whitespace-nowrap truncate">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleActionStatus && onToggleActionStatus(item.id);
                        }}
                        title="Click to toggle status"
                        className="flex items-center space-x-1.5 hover:underline cursor-pointer truncate max-w-full"
                      >
                        {item.status === 'In progress' ? (
                          <span className="w-2 h-2 rounded-full border border-[#74866A] bg-[#74866A] inline-block flex-shrink-0" />
                        ) : isCompleted ? (
                          <span className="w-2 h-2 rounded-full bg-[#4B5E44] inline-block flex-shrink-0" />
                        ) : item.status === 'Waiting' ? (
                          <span className="w-2 h-2 rounded-full border border-[#6A7B8E] bg-[#6A7B8E] inline-block flex-shrink-0" />
                        ) : (
                          <span className="w-2 h-2 rounded-full border border-[#88877A] bg-transparent inline-block flex-shrink-0" />
                        )}
                        <span className={`font-medium truncate ${isCompleted ? 'text-[#4B5E44]' : 'text-[#171714]'}`}>
                          {item.status}
                        </span>
                      </button>
                    </td>

                    {/* Priority Dots */}
                    <td className="py-1.5 px-2 text-right whitespace-nowrap pr-2">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          onChangePriority && onChangePriority(item.id);
                        }}
                        title="Click to cycle priority (1-5)"
                        className="inline-flex items-center justify-end space-x-0.5"
                      >
                        {[1, 2, 3, 4, 5].map((lvl) => (
                          <span
                            key={lvl}
                            className={`w-1.5 h-1.5 rounded-full inline-block flex-shrink-0 ${
                              lvl <= (item.priority || 1) ? 'bg-[#171714]' : 'bg-[#D2CEBF]'
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

      {/* Clean bottom line inside table: working option to view additional tasks */}
      <div className="px-3 py-1.5 border-t border-[#B5B3A4] flex items-center justify-between text-[7.5px] font-mono text-[#66655A]">
        <button
          onClick={() => setShowAll(!showAll)}
          className="font-bold text-[#171714] hover:underline cursor-pointer uppercase transition-colors"
          title={showAll ? "Show fewer tasks" : "View additional tasks"}
        >
          {showAll ? '- LESS ACTIONS' : `+${Math.max(1, actions.length - 5)} ACTIONS`}
        </button>
        <button
          onClick={handleSort}
          className="flex items-center space-x-1 hover:text-[#171714] transition-colors uppercase tracking-wider"
        >
          <ArrowUpDown className="w-2.5 h-2.5" />
          <span>SORT ({sortField.toUpperCase()})</span>
        </button>
      </div>
    </div>
  );
}