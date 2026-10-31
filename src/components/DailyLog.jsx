import React, { useState, useEffect } from 'react';
import { Edit3, Check } from 'lucide-react';
import { useArchive } from '../context/ArchiveContext';

export function DailyLog({ onViewLog }) {
  const { dynamicMetrics, saveDailyLog } = useArchive();
  const todayData = dynamicMetrics?.todayLog || {
    date: '09 MAY 2025',
    note: "Started working on the database structure and record model for Athenaeum. Feeling focused and productive.",
    mood: 3, // 3 corresponds to the solid filled happy face ☻ in reference image
    energy: 72
  };

  const [isEditing, setIsEditing] = useState(false);
  const [noteText, setNoteText] = useState(todayData.note);
  const [selectedMood, setSelectedMood] = useState(todayData.mood !== undefined ? todayData.mood : 3);
  const [energy, setEnergy] = useState(todayData.energy !== undefined ? todayData.energy : 72);

  useEffect(() => {
    if (todayData) {
      setNoteText(todayData.note || "Started working on the database structure and record model for Athenaeum. Feeling focused and productive.");
      setSelectedMood(todayData.mood !== undefined ? todayData.mood : 3);
      setEnergy(todayData.energy !== undefined ? todayData.energy : 72);
    }
  }, [todayData]);

  const energyBlocks = 10;
  const filledBlocks = Math.round((energy / 100) * energyBlocks);

  const handleSave = async () => {
    await saveDailyLog('09 MAY 2025', {
      note: noteText,
      mood: selectedMood,
      energy: energy
    });
    setIsEditing(false);
  };

  const handleMoodSelect = async (mId) => {
    setSelectedMood(mId);
    await saveDailyLog('09 MAY 2025', {
      note: noteText,
      mood: mId,
      energy: energy
    });
  };

  const handleBlockClick = async (index) => {
    const newEnergy = Math.round(((index + 1) / energyBlocks) * 100);
    setEnergy(newEnergy);
    await saveDailyLog('09 MAY 2025', {
      note: noteText,
      mood: selectedMood,
      energy: newEnergy
    });
  };

  return (
    <div className="border border-[#B5B3A4] bg-[#EAE7D9] flex flex-col justify-between p-2.5 select-none h-full shadow-sm">
      {/* Header matching media_1793434566460_76b91e75.jpg */}
      <div>
        <div className="flex items-center justify-between pb-1.5 border-b border-[#D5D1C4]">
          <span className="text-[10px] uppercase tracking-wider font-mono font-bold text-[#171714]">
            DAILY LOG
          </span>
          <div className="flex items-center space-x-2 text-[8px] font-mono">
            <button
              onClick={() => {
                if (isEditing) handleSave();
                else setIsEditing(true);
              }}
              title={isEditing ? "Save note" : "Edit note"}
              className="text-[#171714] hover:underline flex items-center space-x-0.5 font-medium"
            >
              {isEditing ? <Check className="w-2.5 h-2.5" /> : <Edit3 className="w-2.5 h-2.5" />}
              <span>{isEditing ? 'SAVE' : 'EDIT'}</span>
            </button>
            <button
              onClick={onViewLog}
              className="text-[#171714] hover:underline tracking-wider"
            >
              VIEW
            </button>
          </div>
        </div>

        {/* Note Area with Timestamp on Right */}
        <div className="pt-2">
          <div className="flex items-center justify-between text-[7.5px] uppercase tracking-wider font-mono text-[#66655A] font-medium mb-1.5">
            <span>TODAY'S NOTE</span>
            <span>09 MAY 2025 &nbsp;10:24</span>
          </div>

          {isEditing ? (
            <div className="space-y-1.5">
              <textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                className="w-full text-[9px] font-mono leading-relaxed bg-[#FAF8F3] border border-[#B5B3A4] p-2 text-[#171714] focus:outline-none focus:border-[#171714] resize-none h-20"
                rows={4}
                autoFocus
              />
              <button
                onClick={handleSave}
                className="w-full bg-[#171714] text-[#FAF8F3] text-[7.5px] py-1 uppercase tracking-wider hover:bg-black transition-colors font-medium"
              >
                COMMIT LOG NOTE
              </button>
            </div>
          ) : (
            <p className="text-[9px] font-mono leading-relaxed text-[#25251F] italic line-clamp-4">
              "{noteText}"
            </p>
          )}
        </div>
      </div>

      {/* Bottom Controls: Mood (4 Minimalist Monochromatic Faces) & Energy (10 Segmented Blocks) */}
      <div className="pt-3 border-t border-[#D5D1C4] flex items-center justify-between">
        {/* Mood Selection: 4 Monochromatic Vector Faces matching Image 2 */}
        <div className="flex items-center space-x-2">
          <span className="text-[7.5px] font-mono uppercase tracking-wider text-[#66655A] font-bold">
            MOOD
          </span>
          <div className="flex items-center space-x-1.5">
            {/* 1. Sad / Frown */}
            <button
              onClick={() => handleMoodSelect(0)}
              className={`w-4 h-4 rounded-full flex items-center justify-center transition-all ${
                selectedMood === 0 ? 'bg-[#171714] text-[#FAF8F3]' : 'border border-[#77766B] text-[#555] hover:border-[#171714]'
              }`}
              title="Low"
            >
              <svg viewBox="0 0 16 16" className="w-3.5 h-3.5">
                <circle cx="8" cy="8" r="6.5" fill="none" stroke="currentColor" strokeWidth="1.2" />
                <circle cx="5.5" cy="6" r="0.9" fill="currentColor" />
                <circle cx="10.5" cy="6" r="0.9" fill="currentColor" />
                <path d="M 5.5 11 Q 8 8.5 10.5 11" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
            </button>
            {/* 2. Neutral */}
            <button
              onClick={() => handleMoodSelect(1)}
              className={`w-4 h-4 rounded-full flex items-center justify-center transition-all ${
                selectedMood === 1 ? 'bg-[#171714] text-[#FAF8F3]' : 'border border-[#77766B] text-[#555] hover:border-[#171714]'
              }`}
              title="Neutral"
            >
              <svg viewBox="0 0 16 16" className="w-3.5 h-3.5">
                <circle cx="8" cy="8" r="6.5" fill="none" stroke="currentColor" strokeWidth="1.2" />
                <circle cx="5.5" cy="6" r="0.9" fill="currentColor" />
                <circle cx="10.5" cy="6" r="0.9" fill="currentColor" />
                <line x1="5.5" y1="10" x2="10.5" y2="10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
            </button>
            {/* 3. Smile */}
            <button
              onClick={() => handleMoodSelect(2)}
              className={`w-4 h-4 rounded-full flex items-center justify-center transition-all ${
                selectedMood === 2 ? 'bg-[#171714] text-[#FAF8F3]' : 'border border-[#77766B] text-[#555] hover:border-[#171714]'
              }`}
              title="Good"
            >
              <svg viewBox="0 0 16 16" className="w-3.5 h-3.5">
                <circle cx="8" cy="8" r="6.5" fill="none" stroke="currentColor" strokeWidth="1.2" />
                <circle cx="5.5" cy="6" r="0.9" fill="currentColor" />
                <circle cx="10.5" cy="6" r="0.9" fill="currentColor" />
                <path d="M 5.5 9.5 Q 8 12 10.5 9.5" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
            </button>
            {/* 4. Solid Black Focused Face (Active Selected in Image 2) */}
            <button
              onClick={() => handleMoodSelect(3)}
              className={`w-4 h-4 rounded-full flex items-center justify-center transition-all ${
                selectedMood === 3 ? 'bg-[#171714] text-[#FAF8F3]' : 'border border-[#77766B] text-[#555] hover:border-[#171714]'
              }`}
              title="Focused / Inspired"
            >
              <svg viewBox="0 0 16 16" className="w-3.5 h-3.5">
                <circle cx="8" cy="8" r="7" fill={selectedMood === 3 ? "#171714" : "currentColor"} />
                <circle cx="5.5" cy="6" r="0.9" fill={selectedMood === 3 ? "#FAF8F3" : "#EAE7D9"} />
                <circle cx="10.5" cy="6" r="0.9" fill={selectedMood === 3 ? "#FAF8F3" : "#EAE7D9"} />
                <path d="M 5.5 9.5 Q 8 12 10.5 9.5" fill="none" stroke={selectedMood === 3 ? "#FAF8F3" : "#EAE7D9"} strokeWidth="1.2" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>

        {/* Energy Segmented Progress Bar matching Image 2 */}
        <div className="flex items-center space-x-2">
          <span className="text-[7.5px] font-mono uppercase tracking-wider text-[#66655A] font-bold">
            ENERGY
          </span>
          <div className="flex items-center space-x-[2px]">
            {[...Array(energyBlocks)].map((_, i) => (
              <button
                key={i}
                onClick={() => handleBlockClick(i)}
                className={`w-2 h-3.5 transition-colors rounded-[0.5px] ${
                  i < filledBlocks 
                    ? 'bg-[#171714]' 
                    : 'bg-[#D2CEBF] hover:bg-[#BBB7A8]'
                }`}
                title={`Energy: ${(i + 1) * 10}%`}
              />
            ))}
          </div>
          <span className="text-[8.5px] font-mono font-bold text-[#171714] pl-1">
            {energy}%
          </span>
        </div>
      </div>
    </div>
  );
}