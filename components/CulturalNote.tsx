import React from 'react';
import { CulturalContent } from '@/types/mission';

interface CulturalNoteProps {
  content: CulturalContent;
}

const CulturalNote: React.FC<CulturalNoteProps> = ({ content }) => {
  return (
    <div className="bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl p-5 m-5 text-white animate-slide-up">
      <div className="text-lg font-bold mb-3 flex items-center gap-2">
        ⚠️ {content.title}
      </div>
      <div className="text-sm leading-relaxed">
        {content.text}
      </div>
    </div>
  );
};

export default CulturalNote;