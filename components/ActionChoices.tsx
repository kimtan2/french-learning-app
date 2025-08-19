import React from 'react';
import { ActionChoice } from '@/types/mission';

interface ActionChoicesProps {
  prompt: string;
  choices: ActionChoice[];
  selectedChoice: number | null;
  onSelectChoice: (index: number, moodChange: number) => void;
}

const ActionChoices: React.FC<ActionChoicesProps> = ({ 
  prompt, 
  choices, 
  selectedChoice, 
  onSelectChoice 
}) => {
  return (
    <div>
      <div className="text-slate-300 text-base mb-5 text-center">
        {prompt}
      </div>
      
      <div className="flex flex-col gap-3">
        {choices.map((choice, index) => (
          <button
            key={index}
            onClick={() => onSelectChoice(index, choice.moodChange)}
            className={`bg-white/5 border-2 rounded-2xl p-4 text-white transition-all duration-300 text-left relative ${
              selectedChoice === index 
                ? 'bg-indigo-600/40 border-indigo-300 shadow-lg shadow-indigo-500/30 ring-2 ring-indigo-400' 
                : 'border-white/10 hover:bg-indigo-600/20 hover:border-indigo-400 hover:translate-x-1'
            }`}
          >
            {/* Selected indicator */}
            {selectedChoice === index && (
              <div className="absolute top-2 left-2 w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm">✓</span>
              </div>
            )}
            
            <span className={`inline-block mr-2.5 text-xl ${selectedChoice === index ? 'ml-8' : ''}`}>{choice.icon}</span>
            <span className="text-base">{choice.text}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ActionChoices;