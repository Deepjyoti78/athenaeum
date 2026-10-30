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
      return sortOrder === 'asc' ? a.time.localeCompare(b.time) : b.time.localeCompare(a.time);
    }
    return sortOrder === 'asc' ? a.priority - b.priority : b.priority - a.priority;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'In progress':
        return 'text-[#738A62]';
      case 'Completed':
        return 'text-[#4F6D48]';
      case 'Waiting':
        return 'text-[#6A7B8E]';
      case 'To do':
      default:
        return 'text-[#77766B]';
    }
  };

  // Canonical 5 primary actions to show on the dashboard matching Screenshot 2
  const displayActions = sortedActions.slice(0, 5);

  return (
    <div className="border border-[#AAA99B] bg-[#E9E5D8] flex flex-col justify-between select-none shadow-sm h-full">
      {/* Header */}
      <div>
        <div className="p-2.5 pb-2 border-b border-[#AAA99B]">
          <div className="text-[10px] uppercase tracking-wider font-mono font-semibold text-[#66655A]">
            UPCOMING ACTIONS
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-[8.5px] font-mono">
            <thead>
              <tr className="border-b border-[#D5D1C4] text-[#77766B] uppercase text-[7.5px]">
                <th className="py-1 px-2.5 font-normal w-12">TIME</th>
                <th className="py-1 px-2.5 font-normal">ACTION</th>
                <th className="py-1 px-2.5 font-normal">WORK</th>
                <th className="py-1 px-2.5 font-normal w-24">STATUS</th>
                <th className="py-1 px-2.5 font-normal w-20 text-right">PRIORITY</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DDD9CD]">
              {displayActions.map((item) => (
                <tr 
                  key={item.id} 
                  className="hover:bg-[#E2DDD0] transition-colors group cursor-pointer"
                  onClick={() => inspectRecord && inspectRecord('action', item)}
                >
                  {/* Time */}
                  <td className="py-2 px-2.5 text-[#66655A] font-mono whitespace-nowrap">
                    {item.time}
                  </td>

                  {/* Action Title */}
                  <td className="py-2 px-2.5 text-[#25251F] font-medium whitespace-nowrap group-hover:underline">
                    <span className={item.status === 'Completed' ? 'line-through text-[#88877A]' : ''}>
                      {item.action}
                    </span>
                  </td>

                  {/* Linked Work */}
                  <td className="py-2 px-2.5 text-[#5A594F] whitespace-nowrap truncate max-w-[150px]">
                    {item.work}
                  </td>

                  {/* Status Toggle Button */}
                  <td className="py-2 px-2.5 whitespace-nowrap">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleActionStatus(item.id);
                      }}
                      title="Click to toggle status"
                      className="flex items-center space-x-1.5 hover:underline cursor-pointer"
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        item.status === 'In progress' ? 'bg-[#738A62]' :
                        item.status === 'Completed' ? 'bg-[#3F5439]' :
                        item.status === 'Waiting' ? 'bg-[#6A7B8E]' : 'bg-[#9E9D8E]'
                      }`}></span>
                      <span className={`${getStatusColor(item.status)} font-medium`}>
                        {item.status}
                      </span>
                    </button>
                  </td>

                  {/* Priority Dots */}
                  <td className="py-2 px-2.5 text-right whitespace-nowrap">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onChangePriority(item.id);
                      }}
                      title="Click to cycle priority (1-5)"
                      className="inline-flex space-x-0.5"
                    >
                      {[1, 2, 3, 4, 5].map((lvl) => (
                        <span
                          key={lvl}
                          className={`w-1.5 h-1.5 rounded-full inline-block ${
                            lvl <= item.priority ? 'bg-[#25251F]' : 'bg-[#C7C3B7]'
                          }`}
                        />
                      ))}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer bar */}
      <div className="px-2.5 py-1.5 bg-[#E2DDCF] border-t border-[#AAA99B] flex items-center justify-between text-[7.5px] font-mono text-[#68675C]">
        <span className="font-semibold text-[#25251F]">
          5 ACTIONS
        </span>
        <button
          onClick={handleSort}
          className="flex items-center space-x-1 hover:text-[#25251F] transition-colors uppercase tracking-wider"
        >
          <ArrowUpDown className="w-2.5 h-2.5" />
          <span>SORT ({sortField.toUpperCase()})</span>
        </button>
      </div>
    </div>
  );
}
