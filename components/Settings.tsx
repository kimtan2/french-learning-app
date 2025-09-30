'use client';

import React, { useState } from 'react';
import { MissionData } from '@/types/mission';

interface SettingsProps {
  currentLanguage: 'french' | 'german';
  onLanguageChange: (language: 'french' | 'german') => void;
  onMissionImport: (mission: MissionData) => void;
}

const Settings: React.FC<SettingsProps> = ({ 
  currentLanguage, 
  onLanguageChange, 
  onMissionImport 
}) => {
  const [jsonInput, setJsonInput] = useState('');
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleLanguageSelect = (language: 'french' | 'german') => {
    onLanguageChange(language);
  };

  const handleMissionImport = () => {
    try {
      setImportStatus('idle');
      setErrorMessage('');
      
      if (!jsonInput.trim()) {
        setImportStatus('error');
        setErrorMessage('Please paste JSON content');
        return;
      }

      const parsedMission = JSON.parse(jsonInput);
      
      if (!parsedMission.id || !parsedMission.title || !parsedMission.steps) {
        throw new Error('Invalid mission format. Mission must have id, title, and steps.');
      }

      onMissionImport(parsedMission as MissionData);
      setImportStatus('success');
      setJsonInput('');
      
      setTimeout(() => {
        setImportStatus('idle');
      }, 3000);
    } catch (error) {
      setImportStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Invalid JSON format');
    }
  };

  const clearJsonInput = () => {
    setJsonInput('');
    setImportStatus('idle');
    setErrorMessage('');
  };

  return (
    <div className="flex-1 bg-slate-800 p-6 overflow-y-auto">
      <h1 className="text-2xl font-bold text-white mb-6">Settings</h1>

      <div className="space-y-6">
        <div className="bg-slate-700 rounded-lg p-4">
          <h2 className="text-lg font-semibold text-white mb-4">Language to Learn</h2>
          <div className="space-y-3">
            <button
              className={`w-full p-3 rounded-lg text-left transition-colors ${
                currentLanguage === 'french'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-600 text-slate-300 hover:bg-slate-500'
              }`}
              onClick={() => handleLanguageSelect('french')}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">French</div>
                  <div className="text-sm opacity-75">Français - Paris</div>
                </div>
                <span className="text-2xl">🇫🇷</span>
              </div>
            </button>

            <button
              className={`w-full p-3 rounded-lg text-left transition-colors ${
                currentLanguage === 'german'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-600 text-slate-300 hover:bg-slate-500'
              }`}
              onClick={() => handleLanguageSelect('german')}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">German</div>
                  <div className="text-sm opacity-75">Deutsch - Berlin</div>
                </div>
                <span className="text-2xl">🇩🇪</span>
              </div>
            </button>
          </div>
        </div>

        <div className="bg-slate-700 rounded-lg p-4">
          <h2 className="text-lg font-semibold text-white mb-4">Import Mission</h2>
          <p className="text-sm text-slate-400 mb-4">
            Paste JSON content for a custom mission below:
          </p>
          
          <div className="space-y-3">
            <textarea
              className="w-full h-32 bg-slate-600 border border-slate-500 rounded-lg p-3 text-white placeholder-slate-400 resize-none focus:outline-none focus:border-indigo-500"
              placeholder="Paste your mission JSON here..."
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
            />
            
            {importStatus === 'error' && (
              <div className="text-red-400 text-sm">
                {errorMessage}
              </div>
            )}
            
            {importStatus === 'success' && (
              <div className="text-green-400 text-sm">
                Mission imported successfully!
              </div>
            )}
            
            <div className="flex space-x-3">
              <button
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleMissionImport}
                disabled={!jsonInput.trim() || importStatus === 'success'}
              >
                Import Mission
              </button>
              
              <button
                className="bg-slate-600 hover:bg-slate-500 text-white py-2 px-4 rounded-lg transition-colors"
                onClick={clearJsonInput}
              >
                Clear
              </button>
            </div>
          </div>
        </div>

        <div className="bg-slate-700 rounded-lg p-4">
          <h2 className="text-lg font-semibold text-white mb-4">About</h2>
          <div className="text-sm text-slate-400 space-y-2">
            <p>French Learning App v1.0</p>
            <p>Interactive language learning through city exploration</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;