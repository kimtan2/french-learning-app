'use client';

import React from 'react';

interface BottomNavigationProps {
  activeTab: 'home' | 'skills' | 'settings';
  onTabChange: (tab: 'home' | 'skills' | 'settings') => void;
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="flex bg-slate-800 border-t border-slate-700">
      <button
        className={`flex-1 flex flex-col items-center py-3 px-4 transition-colors ${
          activeTab === 'skills' 
            ? 'text-indigo-400 bg-slate-700' 
            : 'text-slate-400 hover:text-slate-300'
        }`}
        onClick={() => onTabChange('skills')}
      >
        <div className="w-6 h-6 mb-1">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L15.09 8.26L22 9L17 14L18.18 21L12 17.77L5.82 21L7 14L2 9L8.91 8.26L12 2Z" />
          </svg>
        </div>
        <span className="text-xs">Skills</span>
      </button>

      <button
        className={`flex-1 flex flex-col items-center py-3 px-4 transition-colors ${
          activeTab === 'home' 
            ? 'text-indigo-400 bg-slate-700' 
            : 'text-slate-400 hover:text-slate-300'
        }`}
        onClick={() => onTabChange('home')}
      >
        <div className="w-6 h-6 mb-1">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M10 20V14H14V20H19V12H22L12 3L2 12H5V20H10Z" />
          </svg>
        </div>
        <span className="text-xs">Home</span>
      </button>

      <button
        className={`flex-1 flex flex-col items-center py-3 px-4 transition-colors ${
          activeTab === 'settings' 
            ? 'text-indigo-400 bg-slate-700' 
            : 'text-slate-400 hover:text-slate-300'
        }`}
        onClick={() => onTabChange('settings')}
      >
        <div className="w-6 h-6 mb-1">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.5,5.32 14.87,5.07L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.07C8.5,5.32 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.22,8.95 2.27,9.22 2.46,9.37L4.57,11C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.22,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.03 4.95,18.95L7.44,17.94C7.96,18.34 8.5,18.68 9.13,18.93L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.93C15.5,18.68 16.04,18.34 16.56,17.94L19.05,18.95C19.27,19.03 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z" />
          </svg>
        </div>
        <span className="text-xs">Settings</span>
      </button>
    </div>
  );
};

export default BottomNavigation;