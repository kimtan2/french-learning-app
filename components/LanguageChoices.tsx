import React, { useState } from 'react';
import { LanguageOption, Spotlight } from '@/types/mission';
import AudioButton from '@/components/AudioButton';

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
    }, 3000); // Increased timeout to account for audio button
  };

  return (
    <div>
      <div className="text-slate-300 text-base mb-5 text-center">
        {prompt}
      </div>
      
      {options.map((option, index) => (
        <div
          key={index}
          onClick={() => onSelectOption(index)}
          className={`bg-white/5 border-2 border-white/10 rounded-2xl p-4 mb-3 cursor-pointer transition-all duration-300 hover:bg-indigo-600/20 hover:border-indigo-400 relative ${
            selectedChoice === index ? 'bg-indigo-600/30 border-indigo-400' : ''
          }`}
        >
          {/* Audio Button for full phrase pronunciation */}
          <div className="absolute top-3 right-3">
            <AudioButton 
              text={option.french} 
              size="small"
              className="shadow-md bg-purple-500/80 hover:bg-purple-500"
            />
          </div>
          
          <div className="text-white text-lg mb-1 pr-10">
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
          <div className="text-indigo-400 text-sm italic">
            {option.phonetic}
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