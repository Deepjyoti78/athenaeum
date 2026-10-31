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

  // Display 5 primary actions on the dashboard matching media_1793434566460_76b91e75.jpg
  const displayActions = sortedActions.slice(0, 5);

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
          <table className="w-full text-left border-collapse text-[8.5px] font-mono">
            <thead>
              <tr className="border-b border-[#D5D1C4] text-[#66655A] uppercase text-[7.5px] font-mono tracking-wider">
                <th className="py-1.5 px-3 font-normal w-14">TIME</th>
                <th className="py-1.5 px-3 font-normal">ACTION</th>
                <th className="py-1.5 px-3 font-normal">WORK</th>
                <th className="py-1.5 px-3 font-normal w-28">STATUS</th>
                <th className="py-1.5 px-3 font-normal w-20 text-right">PRIORITY</th>
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
                    <td className="py-2 px-3 text-[#66655A] font-mono whitespace-nowrap">
                      {item.time}
                    </td>

                    {/* Action Title */}
                    <td className="py-2 px-3 text-[#171714] font-bold text-[9px] whitespace-nowrap group-hover:underline">
                      <span className={isCompleted ? 'line-through text-[#88877A]' : ''}>
                        {item.action}
                      </span>
                    </td>

                    {/* Linked Work */}
                    <td className="py-2 px-3 text-[#55544B] whitespace-nowrap truncate max-w-[180px]">
                      {item.work}
                    </td>

                    {/* Status with half-moon / dot icon */}
                    <td className="py-2 px-3 whitespace-nowrap">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleActionStatus && onToggleActionStatus(item.id);
                        }}
                        title="Click to toggle status"
                        className="flex items-center space-x-1.5 hover:underline cursor-pointer"
                      >
                        {item.status === 'In progress' ? (
                          <span className="w-2 h-2 rounded-full border border-[#74866A] bg-[#74866A] inline-block" />
                        ) : isCompleted ? (
                          <span className="w-2 h-2 rounded-full bg-[#4B5E44] inline-block" />
                        ) : item.status === 'Waiting' ? (
                          <span className="w-2 h-2 rounded-full border border-[#6A7B8E] bg-[#6A7B8E] inline-block" />
                        ) : (
                          <span className="w-2 h-2 rounded-full border border-[#88877A] bg-transparent inline-block" />
                        )}
                        <span className={`font-medium ${isCompleted ? 'text-[#4B5E44]' : 'text-[#171714]'}`}>
                          {item.status}
                        </span>
                      </button>
                    </td>

                    {/* Priority Dots */}
                    <td className="py-2 px-3 text-right whitespace-nowrap">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          onChangePriority && onChangePriority(item.id);
                        }}
                        title="Click to cycle priority (1-5)"
                        className="inline-flex space-x-0.5"
                      >
                        {[1, 2, 3, 4, 5].map((lvl) => (
                          <span
                            key={lvl}
                            className={`w-1.5 h-1.5 rounded-full inline-block ${
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

      {/* Clean bottom line inside table: *5 ACTIONS matching reference image */}
      <div className="px-3 py-1.5 border-t border-[#B5B3A4] flex items-center justify-between text-[7.5px] font-mono text-[#66655A]">
        <span className="font-bold text-[#171714]">
          *5 ACTIONS
        </span>
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