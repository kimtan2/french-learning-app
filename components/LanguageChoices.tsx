import React, { useState } from 'react';
import { LanguageOption, Spotlight } from '@/types/mission';
import AudioButton from '@/components/AudioButton';
import elevenLabsService from '@/services/elevenlabs';

interface LanguageChoicesProps {
  prompt: string;
  options: LanguageOption[];
  selectedChoice: number | null;
  onSelectOption: (index: number) => void;
  spotlight?: Spotlight;
}

const LanguageChoices: React.FC<LanguageChoicesProps> = ({ 
  prompt, 
  options, 
  selectedChoice, 
  onSelectOption,
  spotlight 
}) => {
  const [tooltipData, setTooltipData] = useState<{ 
    show: boolean; 
    text: string;
    word: string;
    x: number; 
    y: number; 
  }>({ show: false, text: '', word: '', x: 0, y: 0 });

  const showWordTranslation = (event: React.MouseEvent, word: string, translation: string) => {
    event.stopPropagation();
    const rect = event.currentTarget.getBoundingClientRect();
    setTooltipData({
      show: true,
      text: translation,
      word: word,
      x: rect.left + rect.width / 2,
      y: rect.top - 10
    });
    
    setTimeout(() => {
      setTooltipData(prev => ({ ...prev, show: false }));
    }, 3000);
  };

  const handleOptionSelect = async (index: number) => {
    onSelectOption(index);
    
    // Auto-play the audio for the selected option
    try {
      await elevenLabsService.playAudio(options[index].french, false);
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  };

  return (
    <div>
      <div className="text-slate-300 text-base mb-5 text-center">
        {prompt}
      </div>
      
      {options.map((option, index) => (
        <div
          key={index}
          onClick={() => handleOptionSelect(index)}
          className={`bg-white/5 border-2 rounded-2xl p-4 mb-3 cursor-pointer transition-all duration-300 relative ${
            selectedChoice === index 
              ? 'bg-indigo-600/40 border-indigo-300 shadow-lg shadow-indigo-500/30 ring-2 ring-indigo-400' 
              : 'border-white/10 hover:bg-indigo-600/20 hover:border-indigo-400'
          }`}
        >
          {/* Selected indicator */}
          {selectedChoice === index && (
            <div className="absolute top-2 left-2 w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm">✓</span>
            </div>
          )}
          
          {/* Audio Button for full phrase pronunciation */}
          <div className="absolute top-3 right-3">
            <AudioButton 
              text={option.french} 
              size="small"
              className="shadow-md bg-purple-500/80 hover:bg-purple-500"
            />
          </div>
          
          <div className={`text-white text-lg mb-1 pr-10 ${selectedChoice === index ? 'pl-8' : ''}`}>
            {option.words.map((word, wordIndex) => (
              <span
                key={wordIndex}
                className="inline-block p-1 rounded transition-colors duration-200 cursor-pointer hover:bg-indigo-600/30"
                onClick={(e) => showWordTranslation(e, word.text, word.translation)}
              >
                {word.text}
              </span>
            ))}
          </div>
         
        </div>
      ))}
      
      {spotlight && (
        <div className="bg-gradient-to-br from-indigo-600/20 to-purple-600/20 rounded-2xl p-5 mt-5 border border-white/10">
          <div className="text-yellow-400 text-base mb-3 flex items-center gap-2">
            💡 {spotlight.title}
          </div>
          <div className="text-slate-300 text-sm leading-relaxed">
            {spotlight.content}
          </div>
        </div>
      )}
      
      {/* Word Tooltip */}
      {tooltipData.show && (
        <div 
          className="fixed bg-indigo-600 text-white px-3 py-2 rounded-lg text-sm z-50 shadow-lg transition-opacity duration-300 flex items-center gap-2"
          style={{ 
            left: tooltipData.x, 
            top: tooltipData.y,
            transform: 'translateX(-50%)'
          }}
        >
          <span>{tooltipData.text}</span>
          <AudioButton 
            text={tooltipData.word} 
            isWord={true}
            size="small"
            className="bg-white/20 hover:bg-white/30"
          />
        </div>
      )}
    </div>
  );
};

export default LanguageChoices;