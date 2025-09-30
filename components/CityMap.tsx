'use client';

import React from 'react';

interface CityMapProps {
  language: 'french' | 'german';
  onLocationClick?: (locationId: string) => void;
}

const CityMap: React.FC<CityMapProps> = ({ language, onLocationClick }) => {
  const cityData = {
    french: {
      name: 'Paris',
      landmarks: [
        { id: 'eiffel', name: 'Tour Eiffel', x: 30, y: 45, color: 'bg-yellow-400' },
        { id: 'louvre', name: 'Musée du Louvre', x: 50, y: 55, color: 'bg-purple-400' },
        { id: 'notredame', name: 'Notre-Dame', x: 55, y: 60, color: 'bg-blue-400' },
        { id: 'arc', name: 'Arc de Triomphe', x: 35, y: 40, color: 'bg-red-400' },
        { id: 'sacre', name: 'Sacré-Cœur', x: 60, y: 25, color: 'bg-green-400' }
      ]
    },
    german: {
      name: 'Berlin',
      landmarks: [
        { id: 'brandenburg', name: 'Brandenburger Tor', x: 50, y: 45, color: 'bg-yellow-400' },
        { id: 'reichstag', name: 'Reichstag', x: 48, y: 42, color: 'bg-blue-400' },
        { id: 'museuminsel', name: 'Museuminsel', x: 55, y: 50, color: 'bg-purple-400' },
        { id: 'fernsehturm', name: 'Fernsehturm', x: 60, y: 48, color: 'bg-red-400' },
        { id: 'checkpoint', name: 'Checkpoint Charlie', x: 52, y: 55, color: 'bg-green-400' }
      ]
    }
  };

  const currentCity = cityData[language];

  return (
    <div className="w-full h-full relative bg-gradient-to-br from-green-200 to-blue-300 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-green-100/50 to-blue-200/50">
        
        <div className="absolute top-4 left-4 bg-white/80 backdrop-blur-sm rounded-lg px-3 py-2 shadow-md">
          <h2 className="text-xl font-bold text-gray-800">{currentCity.name}</h2>
          <p className="text-sm text-gray-600">
            {language === 'french' ? 'Français' : 'Deutsch'}
          </p>
        </div>

        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
          <path
            d="M20,20 Q50,10 80,20 Q90,50 80,80 Q50,90 20,80 Q10,50 20,20"
            fill="rgba(34, 197, 94, 0.1)"
            stroke="rgba(34, 197, 94, 0.3)"
            strokeWidth="0.5"
          />
          
          <path
            d="M25,30 Q40,25 70,35 Q75,50 70,70 Q45,75 25,70 Q20,50 25,30"
            fill="rgba(59, 130, 246, 0.1)"
            stroke="rgba(59, 130, 246, 0.3)"
            strokeWidth="0.3"
          />
        </svg>

        {currentCity.landmarks.map((landmark) => (
          <div
            key={landmark.id}
            className={`absolute w-4 h-4 ${landmark.color} rounded-full shadow-lg cursor-pointer transform hover:scale-125 transition-all duration-200 hover:shadow-xl animate-pulse`}
            style={{
              left: `${landmark.x}%`,
              top: `${landmark.y}%`,
              transform: 'translate(-50%, -50%)'
            }}
            onClick={() => onLocationClick?.(landmark.id)}
          >
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
              {landmark.name}
            </div>
          </div>
        ))}

        <div className="absolute bottom-4 left-4 right-4 bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-md">
          <h3 className="font-semibold text-gray-800 mb-2">
            {language === 'french' ? 'Explorez Paris' : 'Erkunde Berlin'}
          </h3>
          <p className="text-sm text-gray-600">
            {language === 'french' 
              ? 'Cliquez sur les monuments pour commencer votre aventure linguistique!'
              : 'Klicken Sie auf die Sehenswürdigkeiten, um Ihr Sprachabenteuer zu beginnen!'
            }
          </p>
        </div>
      </div>
    </div>
  );
};

export default CityMap;