import { createContext, useContext, useState } from 'react';
import { DEMO_TIPS } from '../data/matchdays';

// tips shape: { [dayIndex]: { [gameId]: 'A' | 'B' } }
// Points are NOT stored here — calculated later when real results arrive via API.
// dayIndex 0 = Testspieltag (pre-populated for demo purposes)

const TipsContext = createContext(null);

export function TipsProvider({ children }) {
  const [tips, setTips] = useState(DEMO_TIPS);

  const setTip = (dayIndex, gameId, team) => {
    setTips(prev => {
      const prevDay = prev[dayIndex] || {};
      if (prevDay[gameId] === team) return prev;
      return { ...prev, [dayIndex]: { ...prevDay, [gameId]: team } };
    });
  };

  return (
    <TipsContext.Provider value={{ tips, setTip }}>
      {children}
    </TipsContext.Provider>
  );
}

export const useTips = () => useContext(TipsContext);
