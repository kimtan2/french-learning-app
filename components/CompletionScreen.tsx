import React from 'react';
import { CompletionContent } from '@/types/mission';

interface CompletionScreenProps {
  content: CompletionContent;
  totalXP: number;
  onRestart: () => void;
}

const CompletionScreen: React.FC<CompletionScreenProps> = ({ content, totalXP, onRestart }) => {
  return (
    <div className="p-8 text-white text-center animate-fade-in">
      <div className="text-8xl mb-5">🎉</div>
      
      <div className="text-3xl font-bold mb-5 bg-gradient-to-r from-yellow-400 to-yellow-300 bg-clip-text text-transparent">
        {content.title}
      </div>
      
      <div className="bg-white/5 rounded-2xl p-5 my-5">
        <div className="flex justify-between my-2.5 text-slate-300">
          <span>Total XP Earned:</span>
          <span className="text-yellow-400 font-bold">{totalXP} XP</span>
        </div>
        <div className="flex justify-between my-2.5 text-slate-300">
          <span>Phrases Learned:</span>
          <span className="text-yellow-400 font-bold">{content.phrases.length}</span>
        </div>
      </div>
      
      <div className="mt-5">
        <h3 className="text-yellow-400 mb-2.5 text-lg">Phrases Mastered:</h3>
        {content.phrases.map((phrase, index) => (
          <div key={index} className="my-1 text-slate-300">
            ✓ {phrase}
          </div>
        ))}
      </div>
      
      <button
        onClick={onRestart}
        className="mt-8 bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-none p-4 rounded-2xl text-base font-semibold cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-500/30"
      >
        🔄 Restart Mission
      </button>
    </div>
  );
};

export default CompletionScreen;