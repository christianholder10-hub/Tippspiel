import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PLAYERS } from '../data/players';

const C = {
  bg: '#0B0F1A', surface: '#101828', card: '#141C2E',
  green: '#22C55E', gold: '#FBBF24', silver: '#94A3B8', bronze: '#CD7C2F',
  text: '#F8FAFC', textSec: '#94A3B8', textMuted: '#3F5070', border: '#1A2540',
};

const MEDAL = { 1: { icon: 'trophy', color: C.gold }, 2: { icon: 'medal', color: C.silver }, 3: { icon: 'medal', color: C.bronze } };

export default function TabelleScreen() {
  const sorted = [...PLAYERS].sort((a, b) => b.points - a.points);
  const me = sorted.find(p => p.isMe);

  return (
    <View style={s.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>

        {/* Eigene Zusammenfassung */}
        <View style={s.myCard}>
          <View style={s.myLeft}>
            <Text style={s.myRank}>#{sorted.findIndex(p => p.isMe) + 1}</Text>
            <View>
              <Text style={s.myName}>{me.name}</Text>
              <Text style={s.mySub}>{me.correct} richtige Tipps</Text>
            </View>
          </View>
          <View style={s.myPoints}>
            <Text style={s.myPointsNum}>{me.points}</Text>
            <Text style={s.myPointsLabel}>Punkte</Text>
          </View>
        </View>

        <Text style={s.sectionLabel}>GESAMTWERTUNG</Text>

        {/* Tabelle */}
        {sorted.map((player, i) => {
          const rank = i + 1;
          const medal = MEDAL[rank];
          return (
            <View key={player.id} style={[s.row, player.isMe && s.rowMe]}>
              <View style={s.rankCell}>
                {medal
                  ? <Ionicons name={medal.icon} size={18} color={medal.color} />
                  : <Text style={s.rankNum}>{rank}</Text>
                }
              </View>
              <Text style={[s.playerName, player.isMe && s.playerNameMe]}>
                {player.name}
              </Text>
              <View style={s.statsCell}>
                <Text style={s.correct}>{player.correct}/{player.total}</Text>
                <Text style={[s.points, player.isMe && s.pointsMe]}>{player.points}</Text>
              </View>
            </View>
          );
        })}

        <Text style={s.hint}>
          * Weitere Mitspieler erscheinen hier, sobald die Mehrspieler-Funktion verfügbar ist.
        </Text>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container:        { flex: 1, backgroundColor: C.bg },
  scroll:           { padding: 16, gap: 10, paddingBottom: 40 },

  myCard: {
    backgroundColor: '#0A1F10', borderWidth: 1.5, borderColor: '#16A34A',
    borderRadius: 14, padding: 18,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: 4,
  },
  myLeft:           { flexDirection: 'row', alignItems: 'center', gap: 14 },
  myRank:           { color: C.green, fontSize: 22, fontWeight: '800', width: 32 },
  myName:           { color: C.text, fontSize: 16, fontWeight: '700' },
  mySub:            { color: '#4ADE80', fontSize: 12, marginTop: 2 },
  myPoints:         { alignItems: 'flex-end' },
  myPointsNum:      { color: C.green, fontSize: 28, fontWeight: '800' },
  myPointsLabel:    { color: '#4ADE80', fontSize: 12 },

  sectionLabel:     { color: C.textMuted, fontSize: 11, fontWeight: '700', letterSpacing: 1, marginTop: 8 },

  row: {
    backgroundColor: C.card, borderRadius: 12, borderWidth: 1, borderColor: C.border,
    flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 16,
    gap: 12,
  },
  rowMe:            { borderColor: '#16A34A', backgroundColor: '#0A1F10' },
  rankCell:         { width: 28, alignItems: 'center' },
  rankNum:          { color: C.textMuted, fontSize: 14, fontWeight: '700' },
  playerName:       { flex: 1, color: C.textSec, fontSize: 15, fontWeight: '600' },
  playerNameMe:     { color: C.text },
  statsCell:        { flexDirection: 'row', alignItems: 'center', gap: 16 },
  correct:          { color: C.textMuted, fontSize: 13 },
  points:           { color: C.text, fontSize: 16, fontWeight: '700', minWidth: 28, textAlign: 'right' },
  pointsMe:         { color: C.green },

  hint:             { color: C.textMuted, fontSize: 11, textAlign: 'center', marginTop: 12, lineHeight: 16 },
});
