import React, { useState } from 'react';
import { X, Plus, Check, FolderGit2, CheckSquare, FileText, Layers, Users, MapPin, HardDrive } from 'lucide-react';
import { useArchive } from '../context/ArchiveContext';

export function NewRecordModal({ isOpen, onClose }) {
  const { 
    createWork, 
    createAction, 
    createEntry, 
    createCollection, 
    createPerson, 
    createPlace, 
    createResource 
  } = useArchive();

  // Selected Category: 'work' | 'action' | 'entry' | 'collection' | 'person' | 'place' | 'resource'
  const [recordCategory, setRecordCategory] = useState('work');

  // Shared / Specific Form States
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('Project');
  const [status, setStatus] = useState('In progress');
  const [tags, setTags] = useState('archive, design');
  const [time, setTime] = useState('11:30');
  const [priority, setPriority] = useState(3);
  const [workLink, setWorkLink] = useState('Athenaeum App Project');
  const [category, setCategory] = useState('Project Note');
  const [author, setAuthor] = useState('You');
  const [role, setRole] = useState('Research Fellow');
  const [org, setOrg] = useState('Athenaeum Society');
  const [email, setEmail] = useState('');
  const [coordinates, setCoordinates] = useState('51.5123° N, 0.0911° W');
  const [region, setRegion] = useState('Greater London');
  const [format, setFormat] = useState('PDF');
  const [size, setSize] = useState('2.4 MB');
  const [locus, setLocus] = useState('Vault Shelf B-12');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (recordCategory === 'work') {
      await createWork({
        title: title.toUpperCase(),
        shortTitle: title,
        type: type,
        status: status,
        category: type,
        area: 'Creative / Archival',
        owner: 'You',
        description: description || 'New archival record created in local repository.',
        longDescription: description || 'New archival record created in local repository.',
        tags: tags.split(',').map(t => t.trim()).filter(Boolean),
        progress: 10,
        artwork: 'blueprint'
      });
    } else if (recordCategory === 'action') {
      await createAction({
        action: title,
        work: workLink || 'General Archive',
        time: time || '12:00',
        status: status,
        priority: Number(priority),
        notes: description
      });
    } else if (recordCategory === 'entry') {
      await createEntry({
        title: title,
        category: category,
        author: author,
        content: description,
        time: time || '12:00'
      });
    } else if (recordCategory === 'collection') {
      await createCollection({
        title: title,
        description: description,
        tags: tags.split(',').map(t => t.trim()).filter(Boolean),
        items: ['highlight_blueprint', 'highlight_specimen']
      });
    } else if (recordCategory === 'person') {
      await createPerson({
        name: title,
        role: role,
        org: org,
        email: email || `${title.toLowerCase().replace(/\s+/g, '.')}@athenaeum.org`,
        status: 'Active',
        notes: description
      });
    } else if (recordCategory === 'place') {
      await createPlace({
        name: title,
        coordinates: coordinates,
        region: region,
        description: description
      });
    } else if (recordCategory === 'resource') {
      await createResource({
        title: title,
        format: format,
        size: size,
        locus: locus,
        description: description
      });
    }

    // Reset & Close
    setTitle('');
    setDescription('');
    onClose();
  };

  const categories = [
    { id: 'work', label: 'WORK', icon: FolderGit2 },
    { id: 'action', label: 'ACTION', icon: CheckSquare },
    { id: 'entry', label: 'ENTRY', icon: FileText },
    { id: 'collection', label: 'COLLECTION', icon: Layers },
    { id: 'person', label: 'PERSON', icon: Users },
    { id: 'place', label: 'PLACE', icon: MapPin },
    { id: 'resource', label: 'RESOURCE', icon: HardDrive },
  ];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-[1px] z-50 flex items-center justify-center p-4 font-mono select-none">
      <div className="w-full max-w-lg bg-[#E9E5D8] border border-[#25251F] shadow-2xl flex flex-col">
        {/* Modal Header */}
        <div className="bg-[#DFDBD0] border-b border-[#AAA99B] p-2.5 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 bg-[#738A62] inline-block"></span>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#25251F]">
              CREATE ARCHIVAL RECORD
            </span>
          </div>
          <button onClick={onClose} className="p-0.5 text-[#555] hover:text-black">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Category Picker */}
        <div className="flex border-b border-[#AAA99B] bg-[#D7D2C4] text-[8.5px] overflow-x-auto">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = recordCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setRecordCategory(cat.id)}
                className={`flex-1 py-1.5 px-2 text-center uppercase tracking-wider font-semibold transition-colors flex items-center justify-center space-x-1 whitespace-nowrap ${
                  isSelected
                    ? 'bg-[#E9E5D8] text-[#25251F] border-b-2 border-[#25251F]'
                    : 'text-[#68675C] hover:text-[#25251F]'
                }`}
              >
                <Icon className="w-2.5 h-2.5" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-3.5 space-y-2.5 text-[9px]">
          <div>
            <label className="block text-[8px] uppercase tracking-wider text-[#66655A] font-semibold mb-1">
              {recordCategory === 'person' ? 'FULL NAME *' : 
               recordCategory === 'place' ? 'LOCUS / SITE NAME *' :
               recordCategory === 'action' ? 'ACTION DESCRIPTION *' : 'RECORD TITLE / DESIGNATION *'}
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={
                recordCategory === 'work' ? "e.g. THAMES BASIN CARTOGRAPHY" :
                recordCategory === 'action' ? "e.g. Calibrate optical rangefinder" :
                recordCategory === 'person' ? "e.g. Dr. Arthur Pendelton" :
                recordCategory === 'place' ? "e.g. Greenwich Observatory Crypt" :
                recordCategory === 'resource' ? "e.g. Nautical Almanac 1888" :
                "e.g. Field observations on optics"
              }
              className="w-full bg-[#F4EFE3] border border-[#AAA99B] p-1.5 text-[#25251F] font-mono focus:outline-none focus:ring-1 focus:ring-[#777A5A]"
            />
          </div>

          {/* Type / Category / Context Row */}
          {recordCategory === 'work' && (
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[7.5px] uppercase tracking-wider text-[#66655A] font-semibold mb-0.5">
                  WORK TYPE
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full bg-[#F4EFE3] border border-[#AAA99B] p-1 text-[#25251F]"
                >
                  <option value="Project">Project</option>
                  <option value="Research">Research</option>
                  <option value="Creative">Creative</option>
                  <option value="Maintenance">Maintenance</option>
                </select>
              </div>
              <div>
                <label className="block text-[7.5px] uppercase tracking-wider text-[#66655A] font-semibold mb-0.5">
                  INITIAL STATUS
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full bg-[#F4EFE3] border border-[#AAA99B] p-1 text-[#25251F]"
                >
                  <option value="In progress">In progress</option>
                  <option value="Planned">Planned</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            </div>
          )}

          {recordCategory === 'action' && (
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-[7.5px] uppercase tracking-wider text-[#66655A] font-semibold mb-0.5">
                  TIME
                </label>
                <input
                  type="text"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full bg-[#F4EFE3] border border-[#AAA99B] p-1 text-[#25251F]"
                />
              </div>
              <div>
                <label className="block text-[7.5px] uppercase tracking-wider text-[#66655A] font-semibold mb-0.5">
                  PRIORITY (1-5)
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full bg-[#F4EFE3] border border-[#AAA99B] p-1 text-[#25251F]"
                >
                  <option value={1}>1 - Low</option>
                  <option value={2}>2 - Guarded</option>
                  <option value={3}>3 - Elevated</option>
                  <option value={4}>4 - High</option>
                  <option value={5}>5 - Critical</option>
                </select>
              </div>
              <div>
                <label className="block text-[7.5px] uppercase tracking-wider text-[#66655A] font-semibold mb-0.5">
                  STATUS
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full bg-[#F4EFE3] border border-[#AAA99B] p-1 text-[#25251F]"
                >
                  <option value="To do">To do</option>
                  <option value="In progress">In progress</option>
                  <option value="Waiting">Waiting</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            </div>
          )}

          {recordCategory === 'entry' && (
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[7.5px] uppercase tracking-wider text-[#66655A] font-semibold mb-0.5">
                  CATEGORY
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-[#F4EFE3] border border-[#AAA99B] p-1 text-[#25251F]"
                >
                  <option value="Project Note">Project Note</option>
                  <option value="Idea">Idea</option>
                  <option value="Meeting">Meeting</option>
                  <option value="Research">Research</option>
                </select>
              </div>
              <div>
                <label className="block text-[7.5px] uppercase tracking-wider text-[#66655A] font-semibold mb-0.5">
                  AUTHOR
                </label>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="w-full bg-[#F4EFE3] border border-[#AAA99B] p-1 text-[#25251F]"
                />
              </div>
            </div>
          )}

          {recordCategory === 'person' && (
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[7.5px] uppercase tracking-wider text-[#66655A] font-semibold mb-0.5">
                  ROLE
                </label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-[#F4EFE3] border border-[#AAA99B] p-1 text-[#25251F]"
                />
              </div>
              <div>
                <label className="block text-[7.5px] uppercase tracking-wider text-[#66655A] font-semibold mb-0.5">
                  ORGANIZATION
                </label>
                <input
                  type="text"
                  value={org}
                  onChange={(e) => setOrg(e.target.value)}
                  className="w-full bg-[#F4EFE3] border border-[#AAA99B] p-1 text-[#25251F]"
                />
              </div>
            </div>
          )}

          {recordCategory === 'place' && (
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[7.5px] uppercase tracking-wider text-[#66655A] font-semibold mb-0.5">
                  COORDINATES
                </label>
                <input
                  type="text"
                  value={coordinates}
                  onChange={(e) => setCoordinates(e.target.value)}
                  className="w-full bg-[#F4EFE3] border border-[#AAA99B] p-1 text-[#25251F]"
                />
              </div>
              <div>
                <label className="block text-[7.5px] uppercase tracking-wider text-[#66655A] font-semibold mb-0.5">
                  REGION
                </label>
                <input
                  type="text"
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className="w-full bg-[#F4EFE3] border border-[#AAA99B] p-1 text-[#25251F]"
                />
              </div>
            </div>
          )}

          {recordCategory === 'resource' && (
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-[7.5px] uppercase tracking-wider text-[#66655A] font-semibold mb-0.5">
                  FORMAT
                </label>
                <input
                  type="text"
                  value={format}
                  onChange={(e) => setFormat(e.target.value)}
                  className="w-full bg-[#F4EFE3] border border-[#AAA99B] p-1 text-[#25251F]"
                />
              </div>
              <div>
                <label className="block text-[7.5px] uppercase tracking-wider text-[#66655A] font-semibold mb-0.5">
                  SIZE
                </label>
                <input
                  type="text"
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                  className="w-full bg-[#F4EFE3] border border-[#AAA99B] p-1 text-[#25251F]"
                />
              </div>
              <div>
                <label className="block text-[7.5px] uppercase tracking-wider text-[#66655A] font-semibold mb-0.5">
                  LOCUS
                </label>
                <input
                  type="text"
                  value={locus}
                  onChange={(e) => setLocus(e.target.value)}
                  className="w-full bg-[#F4EFE3] border border-[#AAA99B] p-1 text-[#25251F]"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[8px] uppercase tracking-wider text-[#66655A] font-semibold mb-1">
              ARCHIVAL DESCRIPTION / NOTES
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detailed description, provenance, and historical context..."
              className="w-full bg-[#F4EFE3] border border-[#AAA99B] p-1.5 text-[#25251F] font-mono focus:outline-none focus:ring-1 focus:ring-[#777A5A] resize-none"
            />
          </div>

          <div>
            <label className="block text-[8px] uppercase tracking-wider text-[#66655A] font-semibold mb-1">
              METADATA TAGS (COMMA SEPARATED)
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="archive, design, notes"
              className="w-full bg-[#F4EFE3] border border-[#AAA99B] p-1.5 text-[#25251F] font-mono focus:outline-none focus:ring-1 focus:ring-[#777A5A]"
            />
          </div>

          {/* Form Actions */}
          <div className="pt-2 border-t border-[#AAA99B] flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1 border border-[#AAA99B] text-[#555] hover:bg-[#DFDBD0] text-[8.5px] uppercase tracking-wider transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1 bg-[#25251F] text-[#E9E5D8] hover:bg-black text-[8.5px] uppercase tracking-wider font-semibold flex items-center space-x-1 transition-colors shadow-sm"
            >
              <Check className="w-3 h-3" />
              <span>COMMIT TO VAULT</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
