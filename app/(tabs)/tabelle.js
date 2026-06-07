import { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';

const C = {
  bg: '#1B5E2E', card: '#F0FDF4',
  green900: '#14532D', green700: '#15803D', green500: '#22C55E',
  green200: '#BBF7D0', green100: '#DCFCE7',
  onPitch: '#F0FDF4', onPitchSec: '#86EFAC',
  gold: '#D97706', silver: '#6B7280', bronze: '#92400E',
  text: '#0F172A', textSec: '#374151', textMuted: '#6B7280', border: '#D1FAE5',
};

const MEDAL = {
  1: { icon: 'trophy', color: C.gold },
  2: { icon: 'medal',  color: C.silver },
  3: { icon: 'medal',  color: C.bronze },
};

export default function TabelleScreen() {
  const { user }                  = useAuth();
  const [players, setPlayers]     = useState([]);
  const [loading, setLoading]     = useState(true);

  const fetchLeaderboard = useCallback(async () => {
    setLoading(true);

    // Alle registrierten Profile
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, username');

    // Aktuelle Punkte aus der points-Tabelle (leer bis Ergebnisse eintragen)
    const { data: pointRows } = await supabase
      .from('points')
      .select('user_id, points_earned');

    // Punkte pro Nutzer summieren
    const totals = {};
    for (const row of pointRows ?? []) {
      totals[row.user_id] = (totals[row.user_id] ?? 0) + row.points_earned;
    }

    const leaderboard = (profiles ?? [])
      .map(p => ({
        id:       p.id,
        username: p.username,
        points:   totals[p.id] ?? 0,
        isMe:     p.id === user?.id,
      }))
      .sort((a, b) => b.points - a.points || a.username.localeCompare(b.username));

    setPlayers(leaderboard);
    setLoading(false);
  }, [user?.id]);

  useEffect(() => { fetchLeaderboard(); }, [fetchLeaderboard]);

  const me     = players.find(p => p.isMe);
  const myRank = players.findIndex(p => p.isMe) + 1;

  return (
    <View style={s.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>
        <View style={s.titleRow}>
          <Text style={s.headline}>Gesamtwertung</Text>
          <TouchableOpacity onPress={fetchLeaderboard} style={s.refreshBtn}>
            <Ionicons name="refresh" size={18} color={C.onPitchSec} />
          </TouchableOpacity>
        </View>

        {loading ? (
          <View style={s.loadingBox}>
            <ActivityIndicator color={C.green500} size="large" />
          </View>
        ) : players.length === 0 ? (
          <View style={s.emptyBox}>
            <Ionicons name="people-outline" size={36} color={C.onPitchSec} />
            <Text style={s.emptyText}>Noch keine Mitspieler registriert.</Text>
          </View>
        ) : (
          <>
            {/* Eigene Zusammenfassung */}
            {me && (
              <View style={s.myCard}>
                <View style={s.myLeft}>
                  <Text style={s.myRank}>#{myRank}</Text>
                  <Text style={s.myName}>{me.username}</Text>
                </View>
                <View style={s.myPoints}>
                  <Text style={s.myPointsNum}>{me.points}</Text>
                  <Text style={s.myPointsLabel}>Punkte</Text>
                </View>
              </View>
            )}

            {/* Rangliste */}
            {players.map((player, i) => {
              const rank  = i + 1;
              const medal = MEDAL[rank];
              return (
                <View key={player.id} style={[s.row, player.isMe && s.rowMe]}>
                  <View style={s.rankCell}>
                    {medal
                      ? <Ionicons name={medal.icon} size={18} color={medal.color} />
                      : <Text style={s.rankNum}>{rank}</Text>}
                  </View>
                  <Text style={[s.playerName, player.isMe && s.playerNameMe]}>
                    {player.username}
                  </Text>
                  <Text style={[s.points, player.isMe && s.pointsMe]}>
                    {player.points}
                  </Text>
                </View>
              );
            })}

            <Text style={s.hint}>
              Punkte werden nach Spielende automatisch gutgeschrieben.
            </Text>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container:    { flex: 1, backgroundColor: C.bg },
  scroll:       { padding: 16, gap: 10, paddingBottom: 40 },

  titleRow:     { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 },
  headline:     { color: C.onPitch, fontSize: 22, fontWeight: '800' },
  refreshBtn:   { padding: 4 },

  loadingBox:   { paddingVertical: 60, alignItems: 'center' },
  emptyBox:     { paddingVertical: 48, alignItems: 'center', gap: 12 },
  emptyText:    { color: C.onPitchSec, fontSize: 14, textAlign: 'center' },

  myCard: {
    backgroundColor: C.green100, borderWidth: 1.5, borderColor: C.green500,
    borderRadius: 14, padding: 18,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1, shadowRadius: 6, elevation: 3,
  },
  myLeft:       { flexDirection: 'row', alignItems: 'center', gap: 12 },
  myRank:       { color: C.green700, fontSize: 22, fontWeight: '800', width: 40 },
  myName:       { color: C.green900, fontSize: 16, fontWeight: '700' },
  myPoints:     { alignItems: 'flex-end' },
  myPointsNum:  { color: C.green700, fontSize: 28, fontWeight: '800' },
  myPointsLabel:{ color: C.green700, fontSize: 12 },

  row: {
    backgroundColor: C.card, borderRadius: 12, borderWidth: 1, borderColor: C.border,
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 14, paddingHorizontal: 16, gap: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06, shadowRadius: 3, elevation: 2,
  },
  rowMe:        { borderColor: C.green500, backgroundColor: C.green100 },
  rankCell:     { width: 28, alignItems: 'center' },
  rankNum:      { color: C.textMuted, fontSize: 14, fontWeight: '700' },
  playerName:   { flex: 1, color: C.textSec, fontSize: 15, fontWeight: '600' },
  playerNameMe: { color: C.green900 },
  points:       { color: C.text, fontSize: 16, fontWeight: '700', minWidth: 32, textAlign: 'right' },
  pointsMe:     { color: C.green700 },

  hint:         { color: C.onPitchSec, fontSize: 11, textAlign: 'center', marginTop: 4, lineHeight: 16 },
});
