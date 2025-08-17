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
            className={`bg-white/5 border-2 border-white/10 rounded-2xl p-4 text-white transition-all duration-300 text-left relative hover:bg-indigo-600/20 hover:border-indigo-400 hover:translate-x-1 ${
              selectedChoice === index ? 'bg-indigo-600/30 border-indigo-400' : ''
            }`}
          >
            <span className="inline-block mr-2.5 text-xl">{choice.icon}</span>
            <span className="text-base">{choice.text}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ActionChoices;