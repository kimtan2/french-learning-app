import React from 'react';

interface HeaderProps {
  totalXP: number;
  currentStep: number;
  totalSteps: number;
  mood: string;
  progress: number;
}

const Header: React.FC<HeaderProps> = ({ totalXP, currentStep, totalSteps, mood, progress }) => {
  const getMoodEmoji = (mood: string) => {
    switch (mood) {
      case 'Friendly': return '😊';
      case 'Cold': return '😐';
      default: return '😊';
    }
  };

  return (
    <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-5 relative z-10">
      <div className="text-white text-lg font-semibold mb-3 flex items-center gap-2">
        <span>🥖</span>
        <span>Buying a Baguette</span>
      </div>
      
      <div className="bg-white/20 h-1.5 rounded-full overflow-hidden">
        <div 
          className="bg-white h-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      
      <div className="flex justify-between mt-3 text-white text-sm">
        <div className="flex items-center gap-1">
          ⭐ <span>{totalXP}</span> XP
        </div>
        <div className="flex items-center gap-1">
          📍 Step <span>{currentStep}</span>/<span>{totalSteps}</span>
        </div>
        <div className="flex items-center gap-1">
          {getMoodEmoji(mood)} <span>{mood}</span>
        </div>
      </div>
    </div>
  );
};

export default Header;