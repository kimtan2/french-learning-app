import React, { useEffect, useRef } from 'react';
import { Feedback as FeedbackType } from '@/types/mission';

interface FeedbackProps {
  feedback: FeedbackType;
}

const Feedback: React.FC<FeedbackProps> = ({ feedback }) => {
  const feedbackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (feedbackRef.current) {
      setTimeout(() => {
        feedbackRef.current?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'nearest'
        });
      }, 100);
    }
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case 'success': return '✅';
      case 'warning': return '⚠️';
      case 'error': return '❌';
      default: return '✅';
    }
  };

  const getBorderColor = (type: string) => {
    switch (type) {
      case 'success': return 'border-green-500 bg-green-500/10';
      case 'warning': return 'border-orange-500 bg-orange-500/10';
      case 'error': return 'border-red-500 bg-red-500/10';
      default: return 'border-green-500 bg-green-500/10';
    }
  };

  return (
    <div ref={feedbackRef} className={`bg-white/5 rounded-2xl p-5 mt-5 animate-slide-up border-2 ${getBorderColor(feedback.type)}`}>
      <div className="text-3xl mb-2.5 text-center">
        {getIcon(feedback.type)}
      </div>
      <div className="text-white text-lg font-bold mb-2.5 text-center">
        {feedback.title}
      </div>
      <div className="text-slate-300 text-sm leading-relaxed text-center">
        {feedback.message}
      </div>
      <div className="text-yellow-400 font-bold text-center mt-2.5">
        +{feedback.xp} XP
      </div>
    </div>
  );
};

export default Feedback;