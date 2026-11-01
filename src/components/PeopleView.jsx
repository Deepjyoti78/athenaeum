import React, { useState } from 'react';
import { Users, Search, Plus, Mail, MapPin, Briefcase, X } from 'lucide-react';
import { INITIAL_PEOPLE } from '../data/mockData';

export function PeopleView({ people = INITIAL_PEOPLE, onAddPerson }) {
  const [peopleList, setPeopleList] = useState(people);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [affiliation, setAffiliation] = useState('');
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');

  const filteredPeople = peopleList.filter(p => {
    const q = searchQuery.toLowerCase().trim();
    return !q || p.name.toLowerCase().includes(q) || p.role.toLowerCase().includes(q) || p.affiliation.toLowerCase().includes(q);
  });

  const handleCreate = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    const newPerson = {
      id: `p-${Date.now()}`,
      name: name.trim(),
      role: role.trim() || 'Researcher',
      affiliation: affiliation.trim() || 'Athenaeum Curation',
      location: 'London, UK',
      email: email.trim() || `${name.toLowerCase().replace(/\s+/g, '.')}@archive.local`,
      worksCount: 1,
      notes: notes.trim() || 'Registered researcher.',
      status: 'Active'
    };
    setPeopleList([newPerson, ...peopleList]);
    if (onAddPerson) onAddPerson(newPerson);
    setIsAdding(false);
    setName('');
    setRole('');
    setAffiliation('');
    setEmail('');
    setNotes('');
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#E9E5D8] overflow-hidden select-none font-mono">
      {/* Header */}
      <div className="p-3 border-b border-[#AAA99B] bg-[#DFDBD0] flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 bg-[#738A62] inline-block"></span>
          <h1 className="text-xs font-bold uppercase tracking-wider text-[#25251F]">
            COLLABORATORS &amp; PEOPLE REGISTRY
          </h1>
          <span className="text-[9px] text-[#77766B]">
            ({filteredPeople.length} CONTACTS)
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1.5 bg-[#FAF8F3] border border-[#AAA99B] px-2 py-0.5 text-[9px]">
            <Search className="w-3 h-3 text-[#77766B]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search researchers..."
              className="bg-transparent text-[9px] text-[#25251F] focus:outline-none w-36"
            />
          </div>

          <button
            onClick={() => setIsAdding(true)}
            className="bg-[#25251F] text-[#E9E5D8] hover:bg-black px-2.5 py-1 text-[8.5px] font-semibold uppercase tracking-wider flex items-center space-x-1"
          >
            <Plus className="w-2.5 h-2.5" />
            <span>ADD PERSON</span>
          </button>
        </div>
      </div>

      {/* Grid of Persons */}
      <div className="flex-1 overflow-y-auto p-2 sm:p-3">
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-2.5">
          {filteredPeople.map((p) => (
            <div
              key={p.id}
              className="border border-[#AAA99B] bg-[#E9E5D8] hover:bg-[#E3DFD3] p-2 sm:p-2.5 flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start pb-1 sm:pb-1.5 border-b border-[#D5D1C4]">
                  <div className="min-w-0 pr-1">
                    <h3 className="text-[10px] sm:text-[11px] font-bold text-[#25251F] truncate">
                      {p.name}
                    </h3>
                    <div className="text-[7.5px] sm:text-[8px] text-[#666] font-medium flex items-center space-x-1 mt-0.5 truncate">
                      <Briefcase className="w-2.5 h-2.5 flex-shrink-0" />
                      <span className="truncate">{p.role}</span>
                    </div>
                  </div>
                  <span className="text-[6.5px] sm:text-[7.5px] px-1 sm:px-1.5 py-0.2 border border-[#AAA99B] bg-[#DDD8CB] text-[#333] flex-shrink-0">
                    {p.status}
                  </span>
                </div>

                <div className="mt-1.5 sm:mt-2 space-y-0.5 sm:space-y-1 text-[7.5px] sm:text-[8px] text-[#555]">
                  <div className="flex items-center space-x-1 sm:space-x-1.5 truncate">
                    <span className="text-[#888]">ORG:</span>
                    <span className="text-[#25251F] font-medium truncate">{p.affiliation}</span>
                  </div>
                  <div className="flex items-center space-x-1 sm:space-x-1.5 truncate">
                    <Mail className="w-2.5 h-2.5 text-[#888] flex-shrink-0" />
                    <span className="text-[#444] truncate">{p.email}</span>
                  </div>
                  <div className="flex items-center space-x-1 sm:space-x-1.5 truncate">
                    <MapPin className="w-2.5 h-2.5 text-[#888] flex-shrink-0" />
                    <span className="text-[#444] truncate">{p.location}</span>
                  </div>
                  <p className="text-[7px] sm:text-[7.5px] text-[#666] italic mt-1 pt-1 border-t border-[#D5D1C4] line-clamp-2">
                    "{p.notes}"
                  </p>
                </div>
              </div>

              <div className="mt-2 pt-1 border-t border-[#D5D1C4] flex justify-between text-[7px] sm:text-[7.5px] text-[#77766B]">
                <span>WORKS: {p.worksCount}</span>
                <span>{p.id}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Person Modal */}
      {isAdding && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-[1px] z-50 flex items-center justify-center p-4">
          <div className="bg-[#E9E5D8] border border-[#25251F] max-w-md w-full p-3 shadow-2xl">
            <div className="flex justify-between items-center pb-2 border-b border-[#AAA99B]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#25251F]">
                REGISTER ARCHIVAL COLLABORATOR
              </span>
              <button onClick={() => setIsAdding(false)} className="hover:text-black">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <form onSubmit={handleCreate} className="space-y-2 mt-3 text-[9px]">
              <div>
                <label className="block text-[8px] uppercase tracking-wider text-[#666] mb-0.5">FULL NAME *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Dr. Arthur Conan"
                  className="w-full bg-[#FAF8F3] border border-[#AAA99B] p-1.5 text-[9px] focus:outline-none"
                  autoFocus
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[8px] uppercase tracking-wider text-[#666] mb-0.5">ROLE</label>
                  <input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="Historian"
                    className="w-full bg-[#FAF8F3] border border-[#AAA99B] p-1.5 text-[9px] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[8px] uppercase tracking-wider text-[#666] mb-0.5">ORGANIZATION</label>
                  <input
                    type="text"
                    value={affiliation}
                    onChange={(e) => setAffiliation(e.target.value)}
                    placeholder="Heritage Trust"
                    className="w-full bg-[#FAF8F3] border border-[#AAA99B] p-1.5 text-[9px] focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[8px] uppercase tracking-wider text-[#666] mb-0.5">EMAIL / HANDLE</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@archive.org"
                  className="w-full bg-[#FAF8F3] border border-[#AAA99B] p-1.5 text-[9px] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[8px] uppercase tracking-wider text-[#666] mb-0.5">SPECIALIZATION / NOTES</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  placeholder="Consulting focus, expertise..."
                  className="w-full bg-[#FAF8F3] border border-[#AAA99B] p-1.5 text-[9px] focus:outline-none resize-none"
                />
              </div>
              <div className="pt-2 border-t border-[#AAA99B] flex justify-end space-x-1.5">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-2.5 py-1 border border-[#AAA99B] bg-[#DFDBD0] text-[8px] uppercase"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="px-3 py-1 bg-[#25251F] text-[#E9E5D8] text-[8px] font-bold uppercase hover:bg-black"
                >
                  SAVE PERSON
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

