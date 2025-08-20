import React from 'react';

interface SpotlightDisplayProps {
  title: string;
  content: string;
  onUnderstood: () => void;
}

const SpotlightDisplay: React.FC<SpotlightDisplayProps> = ({ 
  title, 
  content, 
  onUnderstood 
}) => {
  return (
    <div className="animate-slide-up">
      <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-2xl p-6 border-2 border-yellow-400/50">
        <div className="text-yellow-400 text-xl font-bold mb-4 flex items-center gap-3">
          💡 {title}
        </div>
        <div className="text-slate-200 text-base leading-relaxed mb-6">
          {content}
        </div>
        <button
          onClick={onUnderstood}
          className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-none p-4 rounded-2xl text-base font-semibold cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-yellow-500/30"
        >
          ✓ Understood
        </button>
      </div>
    </div>
  );
};

export default SpotlightDisplay;