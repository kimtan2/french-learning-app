'use client';

import React from 'react';

const SkillArea: React.FC = () => {
  return (
    <div className="flex-1 bg-slate-800 p-6 overflow-y-auto">
      <h1 className="text-2xl font-bold text-white mb-6">Skill Area</h1>
      
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-slate-400" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L15.09 8.26L22 9L17 14L18.18 21L12 17.77L5.82 21L7 14L2 9L8.91 8.26L12 2Z" />
          </svg>
        </div>
        
        <h2 className="text-xl font-semibold text-white mb-2">Skills Coming Soon</h2>
        <p className="text-slate-400 max-w-sm">
          Track your progress, view achievements, and practice specific language skills. 
          This feature will be available in a future update.
        </p>
      </div>
    </div>
  );
};

export default SkillArea;