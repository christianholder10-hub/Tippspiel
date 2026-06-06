import { createContext, useContext, useState } from 'react';

// tips shape: { [dayIndex]: { [gameId]: 'A' | 'B' } }
// Points are NOT stored here — they will be calculated later
// when actual match results are provided via API.

const TipsContext = createContext(null);

export function TipsProvider({ children }) {
  const [tips, setTips] = useState({});

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
