import React from 'react';
import { IntroductionContent } from '@/types/mission';

interface IntroductionStepProps {
  content: IntroductionContent;
}

const IntroductionStep: React.FC<IntroductionStepProps> = ({ content }) => {
  return (
    <div className="p-8 text-white text-center animate-fade-in">
      <div className="text-3xl font-bold mb-5 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
        {content.title}
      </div>
      
      <div className="text-base leading-relaxed text-slate-300 mb-8">
        {content.text}
      </div>
      
      <div className="bg-white/5 rounded-2xl p-5 mb-8">
        <h3 className="text-yellow-400 mb-4 text-base font-semibold">Your Objectives:</h3>
        {content.objectives.map((objective, index) => (
          <div key={index} className="text-slate-300 my-2.5 pl-5 relative">
            <span className="absolute left-0 text-indigo-400">✓</span>
            {objective}
          </div>
        ))}
      </div>
    </div>
  );
};

export default IntroductionStep;