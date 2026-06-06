import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PLAYERS } from '../data/players';

const C = {
  bg: '#F0FDF4', surface: '#FFFFFF', card: '#FFFFFF',
  green900: '#14532D', green700: '#15803D', green500: '#22C55E', green200: '#BBF7D0', green100: '#DCFCE7',
  gold: '#D97706', silver: '#6B7280', bronze: '#92400E',
  text: '#0F172A', textSec: '#374151', textMuted: '#6B7280',
  border: '#D1FAE5', borderCard: '#E5E7EB',
};

const MEDAL = {
  1: { icon: 'trophy',  color: C.gold },
  2: { icon: 'medal',   color: C.silver },
  3: { icon: 'medal',   color: C.bronze },
};

export default function TabelleScreen() {
  const sorted = [...PLAYERS].sort((a, b) => b.points - a.points);
  const me     = sorted.find(p => p.isMe);
  const myRank = sorted.findIndex(p => p.isMe) + 1;

  return (
    <View style={s.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>

        {/* Eigene Karte */}
        <View style={s.myCard}>
          <View style={s.myLeft}>
            <Text style={s.myRank}>#{myRank}</Text>
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

        {sorted.map((player, i) => {
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
          Weitere Mitspieler erscheinen hier, sobald die Mehrspieler-Funktion verfügbar ist.
        </Text>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container:    { flex: 1, backgroundColor: C.bg },
  scroll:       { padding: 16, gap: 10, paddingBottom: 40 },

  myCard: {
    backgroundColor: C.green100, borderWidth: 1.5, borderColor: C.green500,
    borderRadius: 14, padding: 18,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: 4,
  },
  myLeft:       { flexDirection: 'row', alignItems: 'center', gap: 14 },
  myRank:       { color: C.green700, fontSize: 22, fontWeight: '800', width: 36 },
  myName:       { color: C.green900, fontSize: 16, fontWeight: '700' },
  mySub:        { color: C.green700, fontSize: 12, marginTop: 2 },
  myPoints:     { alignItems: 'flex-end' },
  myPointsNum:  { color: C.green700, fontSize: 28, fontWeight: '800' },
  myPointsLabel:{ color: C.green700, fontSize: 12 },

  sectionLabel: { color: C.textMuted, fontSize: 11, fontWeight: '700', letterSpacing: 1, marginTop: 4 },

  row: {
    backgroundColor: C.card, borderRadius: 12, borderWidth: 1, borderColor: C.borderCard,
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 14, paddingHorizontal: 16, gap: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03, shadowRadius: 3, elevation: 1,
  },
  rowMe:        { borderColor: C.green500, backgroundColor: C.green100 },
  rankCell:     { width: 28, alignItems: 'center' },
  rankNum:      { color: C.textMuted, fontSize: 14, fontWeight: '700' },
  playerName:   { flex: 1, color: C.textSec, fontSize: 15, fontWeight: '600' },
  playerNameMe: { color: C.green900 },
  statsCell:    { flexDirection: 'row', alignItems: 'center', gap: 16 },
  correct:      { color: C.textMuted, fontSize: 13 },
  points:       { color: C.text, fontSize: 16, fontWeight: '700', minWidth: 28, textAlign: 'right' },
  pointsMe:     { color: C.green700 },

  hint:         { color: C.textMuted, fontSize: 11, textAlign: 'center', marginTop: 8, lineHeight: 16 },
});
