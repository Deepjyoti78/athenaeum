import React, { useState, useEffect } from 'react';
import { Smile, Meh, Frown, Laugh, Edit3, Check } from 'lucide-react';
import { useArchive } from '../context/ArchiveContext';

export function DailyLog({ onViewLog }) {
  const { dynamicMetrics, saveDailyLog } = useArchive();
  const todayData = dynamicMetrics?.todayLog || {
    date: '09 MAY 2025',
    note: "Started working on the database structure and record model for Athenaeum. Feeling focused and productive.",
    mood: 2,
    energy: 72
  };

  const [isEditing, setIsEditing] = useState(false);
  const [noteText, setNoteText] = useState(todayData.note);
  const [selectedMood, setSelectedMood] = useState(todayData.mood);
  const [energy, setEnergy] = useState(todayData.energy);

  useEffect(() => {
    if (todayData) {
      setNoteText(todayData.note || '');
      setSelectedMood(todayData.mood !== undefined ? todayData.mood : 2);
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
    <div className="border border-[#AAA99B] bg-[#E9E5D8] flex flex-col justify-between p-2.5 select-none h-full shadow-sm">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between pb-1.5 border-b border-[#D5D1C4]">
          <span className="text-[10px] uppercase tracking-wider font-mono font-semibold text-[#66655A]">
            DAILY LOG
          </span>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                if (isEditing) handleSave();
                else setIsEditing(true);
              }}
              title={isEditing ? "Save note" : "Edit note"}
              className="text-[#68675C] hover:text-[#25251F] text-[7.5px] uppercase tracking-wider flex items-center space-x-0.5 font-medium"
            >
              {isEditing ? <Check className="w-2.5 h-2.5" /> : <Edit3 className="w-2.5 h-2.5" />}
              <span>{isEditing ? 'SAVE' : 'EDIT'}</span>
            </button>
            <button
              onClick={onViewLog}
              className="text-[#68675C] hover:text-[#25251F] text-[8px] uppercase tracking-wider underline decoration-dotted"
            >
              VIEW
            </button>
          </div>
        </div>

        {/* Note Area */}
        <div className="pt-2">
          <div className="text-[7.5px] uppercase tracking-wider font-mono text-[#77766B] font-medium mb-1.5">
            TODAY'S NOTE
          </div>
          {isEditing ? (
            <div className="space-y-1.5">
              <textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                className="w-full text-[9px] font-mono leading-relaxed bg-[#F1ECE0] border border-[#AAA99B] p-1.5 text-[#25251F] focus:outline-none focus:ring-1 focus:ring-[#777A5A] resize-none h-20"
                rows={4}
                autoFocus
              />
              <button
                onClick={handleSave}
                className="w-full bg-[#25251F] text-[#E9E5D8] text-[7.5px] py-1 uppercase tracking-wider hover:bg-black transition-colors font-medium"
              >
                COMMIT LOG NOTE
              </button>
            </div>
          ) : (
            <p className="text-[9px] font-mono leading-relaxed text-[#2D2C24] line-clamp-4 italic">
              "{noteText}"
            </p>
          )}
        </div>
      </div>

      {/* Progress & Energy rating */}
      <div className="pt-2 border-t border-[#D5D1C4] space-y-1.5">
        <div className="flex items-center justify-between text-[7.5px] font-mono text-[#66655A]">
          <span className="tracking-wider uppercase">PROGRES</span>
          {/* Mood Icons */}
          <div className="flex items-center space-x-1.5 text-[#77766B]">
            {[
              { id: 0, label: 'Low', icon: Frown },
              { id: 1, label: 'Neutral', icon: Meh },
              { id: 2, label: 'Focused', icon: Smile },
              { id: 3, label: 'Inspired', icon: Laugh },
            ].map((m) => {
              const Icon = m.icon;
              const isSelected = selectedMood === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => handleMoodSelect(m.id)}
                  className={`p-0.5 transition-colors ${
                    isSelected ? 'text-[#25251F] scale-110 font-bold' : 'hover:text-[#444]'
                  }`}
                  title={m.label}
                >
                  <Icon className="w-3.5 h-3.5" strokeWidth={isSelected ? 2.2 : 1.5} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Energy bar */}
        <div className="flex items-center justify-between text-[7.5px] font-mono text-[#66655A]">
          <span className="tracking-wider uppercase">ENERGY</span>
          <div className="flex items-center space-x-1.5">
            {/* 10 Segmented blocks */}
            <div className="flex space-x-0.5">
              {Array.from({ length: energyBlocks }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => handleBlockClick(i)}
                  title={`Set energy to ${(i + 1) * 10}%`}
                  className={`w-2 h-2.5 transition-colors ${
                    i < filledBlocks ? 'bg-[#25251F]' : 'bg-[#D2CEBE] hover:bg-[#BBB7A7]'
                  }`}
                />
              ))}
            </div>
            <span className="font-mono text-[8px] text-[#25251F] font-semibold w-7 text-right">
              {energy}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
