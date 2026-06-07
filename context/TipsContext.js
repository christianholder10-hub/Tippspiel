import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';
import { DEMO_TIPS } from '../data/matchdays';

// Cache key per user so tips don't bleed between accounts
const cacheKey = (userId) => `tippspiel_tips_${userId}`;

const TipsContext = createContext(null);

export function TipsProvider({ children }) {
  const { user } = useAuth();
  const [tips, setTips]         = useState(DEMO_TIPS);
  const [syncing, setSyncing]   = useState(false);

  // ── Hydration ──────────────────────────────────────────────────────────────
  // 1. Load from AsyncStorage instantly (snappy UI)
  // 2. Then fetch from Supabase and merge (source of truth)
  useEffect(() => {
    if (!user) {
      setTips(DEMO_TIPS);
      return;
    }

    let cancelled = false;

    async function hydrate() {
      // Step 1: local cache (instant)
      try {
        const raw = await AsyncStorage.getItem(cacheKey(user.id));
        if (raw && !cancelled) setTips(JSON.parse(raw));
      } catch (_) {}

      // Step 2: Supabase (background, overwrites cache)
      setSyncing(true);
      const { data, error } = await supabase
        .from('tips')
        .select('matchday_id, game_id, pick')
        .eq('user_id', user.id);

      if (!error && data && !cancelled) {
        const rebuilt = {};
        for (const row of data) {
          if (!rebuilt[row.matchday_id]) rebuilt[row.matchday_id] = {};
          rebuilt[row.matchday_id][row.game_id] = row.pick;
        }
        // Merge: keep demo tips (index 0) + real tips
        const merged = { ...DEMO_TIPS, ...rebuilt };
        setTips(merged);
        await AsyncStorage.setItem(cacheKey(user.id), JSON.stringify(merged));
      }
      if (!cancelled) setSyncing(false);
    }

    hydrate();
    return () => { cancelled = true; };
  }, [user?.id]);

  // ── Set a tip ──────────────────────────────────────────────────────────────
  // Write order: state → AsyncStorage → Supabase
  // UI never waits for network.
  const setTip = useCallback(async (dayIndex, gameId, team) => {
    setTips(prev => {
      const prevDay = prev[dayIndex] || {};
      if (prevDay[gameId] === team) return prev;
      const next = { ...prev, [dayIndex]: { ...prevDay, [gameId]: team } };

      // Persist to cache immediately (fire-and-forget)
      if (user) {
        AsyncStorage.setItem(cacheKey(user.id), JSON.stringify(next)).catch(() => {});

        // Sync to Supabase (upsert = insert or update)
        supabase.from('tips').upsert({
          user_id:     user.id,
          matchday_id: dayIndex,
          game_id:     gameId,
          pick:        team,
        }, { onConflict: 'user_id,matchday_id,game_id' }).then(({ error }) => {
          if (error) console.warn('Supabase sync error:', error.message);
        });
      }

      return next;
    });
  }, [user]);

  return (
    <TipsContext.Provider value={{ tips, setTip, syncing }}>
      {children}
    </TipsContext.Provider>
  );
}

export const useTips = () => useContext(TipsContext);
