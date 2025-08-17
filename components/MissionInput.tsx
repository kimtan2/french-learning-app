import React, { useState } from 'react';
import { MissionData } from '@/types/mission';

interface MissionInputProps {
  onMissionLoaded: (mission: MissionData) => void;
  defaultMission: MissionData;
}

const MissionInput: React.FC<MissionInputProps> = ({ onMissionLoaded, defaultMission }) => {
  const [jsonInput, setJsonInput] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validateMissionFormat = (data: unknown): { isValid: boolean; error?: string } => {
    try {
      const mission = data as Record<string, unknown>;
      // Check if it has steps array
      if (!mission.steps || !Array.isArray(mission.steps)) {
        return { isValid: false, error: 'Mission must have a "steps" array' };
      }

      if (mission.steps.length === 0) {
        return { isValid: false, error: 'Mission must have at least one step' };
      }

      // Validate each step
      for (let i = 0; i < mission.steps.length; i++) {
        const step = mission.steps[i] as Record<string, unknown>;
        
        if (!step.id || typeof step.id !== 'string') {
          return { isValid: false, error: `Step ${i + 1}: Missing or invalid "id"` };
        }

        if (!step.type || typeof step.type !== 'string' || !['introduction', 'regular', 'cultural', 'completion'].includes(step.type)) {
          return { isValid: false, error: `Step ${i + 1}: Invalid "type". Must be introduction, regular, cultural, or completion` };
        }

        // Validate introduction steps
        if (step.type === 'introduction') {
          const content = step.content as Record<string, unknown>;
          if (!content || !content.title || !content.text || !Array.isArray(content.objectives)) {
            return { isValid: false, error: `Step ${i + 1}: Introduction step must have content with title, text, and objectives array` };
          }
        }

        // Validate cultural steps
        if (step.type === 'cultural') {
          const content = step.content as Record<string, unknown>;
          if (!content || !content.title || !content.text) {
            return { isValid: false, error: `Step ${i + 1}: Cultural step must have content with title and text` };
          }
        }

        // Validate completion steps
        if (step.type === 'completion') {
          const content = step.content as Record<string, unknown>;
          if (!content || !content.title || !Array.isArray(content.phrases)) {
            return { isValid: false, error: `Step ${i + 1}: Completion step must have content with title and phrases array` };
          }
        }

        // Validate regular steps
        if (step.type === 'regular') {
          const mainLayer = step.mainLayer as Record<string, unknown>;
          if (mainLayer && !mainLayer.preservePrevious) {
            const npc = mainLayer.npc as Record<string, unknown>;
            const dialogue = mainLayer.dialogue as Record<string, unknown>;
            
            if (!npc || !dialogue) {
              return { isValid: false, error: `Step ${i + 1}: Regular step must have mainLayer with npc and dialogue` };
            }
            
            if (!npc.name || !npc.emoji || !npc.mood || !npc.description) {
              return { isValid: false, error: `Step ${i + 1}: NPC must have name, emoji, mood, and description` };
            }

            if (!dialogue.text || !dialogue.translation) {
              return { isValid: false, error: `Step ${i + 1}: Dialogue must have text and translation` };
            }
          }

          const addonLayer = step.addonLayer as Record<string, unknown>;
          if (addonLayer) {
            if (!['action_choice', 'language_choice'].includes(addonLayer.type as string)) {
              return { isValid: false, error: `Step ${i + 1}: Addon layer type must be action_choice or language_choice` };
            }

            if (!addonLayer.prompt) {
              return { isValid: false, error: `Step ${i + 1}: Addon layer must have a prompt` };
            }

            if (addonLayer.type === 'action_choice') {
              const choices = addonLayer.choices as unknown[];
              if (!Array.isArray(choices) || choices.length === 0) {
                return { isValid: false, error: `Step ${i + 1}: Action choice must have choices array` };
              }
              
              for (let j = 0; j < choices.length; j++) {
                const choice = choices[j] as Record<string, unknown>;
                if (!choice.icon || !choice.text || !choice.action || typeof choice.moodChange !== 'number') {
                  return { isValid: false, error: `Step ${i + 1}, Choice ${j + 1}: Must have icon, text, action, and moodChange` };
                }
              }
            }

            if (addonLayer.type === 'language_choice') {
              const options = addonLayer.options as unknown[];
              if (!Array.isArray(options) || options.length === 0) {
                return { isValid: false, error: `Step ${i + 1}: Language choice must have options array` };
              }

              for (let j = 0; j < options.length; j++) {
                const option = options[j] as Record<string, unknown>;
                const feedback = option.feedback as Record<string, unknown>;
                const words = option.words as unknown[];
                
                if (!option.french || !option.phonetic || !Array.isArray(words) || !feedback) {
                  return { isValid: false, error: `Step ${i + 1}, Option ${j + 1}: Must have french, phonetic, words array, and feedback` };
                }

                if (!feedback.type || !feedback.title || !feedback.message || typeof feedback.xp !== 'number') {
                  return { isValid: false, error: `Step ${i + 1}, Option ${j + 1}: Feedback must have type, title, message, and xp` };
                }

                for (let k = 0; k < words.length; k++) {
                  const word = words[k] as Record<string, unknown>;
                  if (!word.text || !word.translation) {
                    return { isValid: false, error: `Step ${i + 1}, Option ${j + 1}, Word ${k + 1}: Must have text and translation` };
                  }
                }
              }
            }
          }
        }
      }

      return { isValid: true };
    } catch {
      return { isValid: false, error: 'Invalid JSON structure' };
    }
  };

  const handleSubmit = () => {
    if (!jsonInput.trim()) {
      setError('Please enter a mission JSON or use the default mission');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const parsedMission = JSON.parse(jsonInput);
      const validation = validateMissionFormat(parsedMission);
      
      if (!validation.isValid) {
        setError(`Invalid mission format: ${validation.error}`);
        setIsLoading(false);
        return;
      }

      // Mission is valid, load it
      onMissionLoaded(parsedMission as MissionData);
    } catch {
      setError('Invalid JSON format. Please check your syntax.');
    }
    
    setIsLoading(false);
  };

  const handleUseDefault = () => {
    onMissionLoaded(defaultMission);
  };

  return (
    <div className="w-full max-w-md h-screen max-h-[800px] bg-slate-900 rounded-3xl shadow-2xl overflow-hidden relative flex flex-col mx-auto p-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-4">🎓 French Learning App</h1>
        <p className="text-slate-300 text-sm">Load a custom mission or try the default baguette mission</p>
      </div>

      <div className="flex-1 flex flex-col">
        <label className="text-white text-sm font-medium mb-3">
          Mission JSON:
        </label>
        
        <textarea
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
          placeholder={`Paste your mission JSON here...\n\nExample:\n{\n  "steps": [\n    {\n      "id": "intro",\n      "type": "introduction",\n      "content": {\n        "title": "Mission Title",\n        "text": "Description",\n        "objectives": ["Goal 1", "Goal 2"]\n      }\n    }\n  ]\n}`}
          className="flex-1 bg-slate-800 border border-slate-600 rounded-xl p-4 text-white text-sm font-mono resize-none focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400"
          disabled={isLoading}
        />

        {error && (
          <div className="mt-4 p-4 bg-red-500/10 border border-red-500 rounded-xl">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        <div className="mt-6 space-y-3">
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className={`w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-4 rounded-xl font-semibold transition-all duration-200 ${
              isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-500/30'
            }`}
          >
            {isLoading ? 'Validating...' : 'Load Custom Mission'}
          </button>

          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-slate-600"></div>
            <span className="text-slate-400 text-xs">OR</span>
            <div className="flex-1 h-px bg-slate-600"></div>
          </div>

          <button
            onClick={handleUseDefault}
            disabled={isLoading}
            className="w-full bg-slate-700 text-white py-4 rounded-xl font-semibold transition-all duration-200 hover:bg-slate-600 hover:-translate-y-0.5"
          >
            🥖 Try Default Mission: &quot;Buying a Baguette&quot;
          </button>
        </div>
      </div>
    </div>
  );
};

export default MissionInput;