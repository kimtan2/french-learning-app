import React, { useState } from 'react';
import { NPC, Dialogue } from '@/types/mission';
import AudioButton from '@/components/AudioButton';

interface NPCDisplayProps {
  npc: NPC;
  dialogue: Dialogue;
}

const NPCDisplay: React.FC<NPCDisplayProps> = ({ npc, dialogue }) => {
  const [showTranslation, setShowTranslation] = useState(false);

  const toggleTranslation = () => {
    setShowTranslation(!showTranslation);
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-start p-8 pt-12 animate-fade-in relative overflow-visible">
      {/* Speech Bubble - positioned above the NPC */}
      <div 
        className="bg-white/95 border-2 border-indigo-400/50 rounded-2xl p-4 mb-6 cursor-pointer transition-all duration-300 hover:bg-white hover:scale-105 shadow-lg max-w-xs w-full animate-slide-up relative"
        onClick={toggleTranslation}
      >
        {/* Audio Button */}
        <div className="absolute top-2 right-2">
          <AudioButton 
            text={dialogue.text} 
            size="small"
            className="shadow-md"
          />
        </div>
        
        <div className="text-slate-800 text-base text-center font-semibold pr-8">
          {dialogue.text}
        </div>
        <div 
          className={`text-indigo-600 text-sm text-center italic mt-2 transition-all duration-300 ${
            showTranslation ? 'block animate-fade-in' : 'hidden'
          }`}
        >
          {dialogue.translation}
        </div>
        
        {/* Speech bubble arrow pointing down */}
        <div className="absolute -bottom-2.5 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white/95"></div>
      </div>

      {/* NPC Avatar */}
      <div className="w-32 h-32 bg-gradient-to-br from-pink-400 to-red-500 rounded-full flex items-center justify-center text-6xl shadow-lg shadow-pink-400/30">
        {npc.emoji}
      </div>
      
      {/* NPC Info */}
      <div className="text-slate-300 text-sm mt-4 mb-2">{npc.name}</div>
      <div className="text-slate-400 text-xs text-center italic">
        {npc.description}
      </div>
    </div>
  );
};

export default NPCDisplay;