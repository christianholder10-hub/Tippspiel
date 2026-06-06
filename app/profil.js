import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PLAYERS } from '../data/players';

const C = {
  bg: '#0B0F1A', surface: '#101828', card: '#141C2E',
  green: '#22C55E', text: '#F8FAFC', textSec: '#94A3B8', textMuted: '#3F5070', border: '#1A2540',
};

const me = PLAYERS.find(p => p.isMe);
const sorted = [...PLAYERS].sort((a, b) => b.points - a.points);
const myRank = sorted.findIndex(p => p.isMe) + 1;

const STATS = [
  { icon: 'trophy-outline',        label: 'Gesamtpunkte',    value: String(me.points),           color: C.green },
  { icon: 'checkmark-circle-outline', label: 'Richtige Tipps', value: String(me.correct),          color: '#60A5FA' },
  { icon: 'podium-outline',        label: 'Rang',             value: `#${myRank}`,                color: '#FBBF24' },
  { icon: 'analytics-outline',     label: 'Trefferquote',     value: `${Math.round((me.correct / me.total) * 100)} %`, color: '#A78BFA' },
];

export default function ProfilScreen() {
  return (
    <View style={s.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>

        {/* Avatar */}
        <View style={s.avatarRow}>
          <View style={s.avatar}>
            <Text style={s.avatarInitial}>{me.name.charAt(0)}</Text>
          </View>
          <Text style={s.name}>{me.name}</Text>
          <Text style={s.sub}>WM 2026 · Tippspiel</Text>
        </View>

        {/* Stats Grid */}
        <View style={s.grid}>
          {STATS.map((stat) => (
            <View key={stat.label} style={s.statCard}>
              <Ionicons name={stat.icon} size={22} color={stat.color} />
              <Text style={[s.statValue, { color: stat.color }]}>{stat.value}</Text>
              <Text style={s.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Letzten Spieltage */}
        <Text style={s.sectionLabel}>LETZTE SPIELTAGE</Text>
        {[1, 2, 3].map((day) => (
          <View key={day} style={s.historyRow}>
            <View style={s.historyLeft}>
              <Text style={s.historyDay}>Spieltag {day}</Text>
              <Text style={s.historyDate}>{['14. Jun', '15. Jun', '16. Jun'][day - 1]}</Text>
            </View>
            <View style={s.historyRight}>
              <Text style={s.historyPoints}>+{[8, 6, 10][day - 1]}</Text>
              <Text style={s.historyCorrect}>{[4, 3, 5][day - 1]}/10 richtig</Text>
            </View>
          </View>
        ))}

        <View style={s.hint}>
          <Ionicons name="information-circle-outline" size={14} color={C.textMuted} />
          <Text style={s.hintText}>
            Punkteberechnung: Quote des getippten Teams × Treffer. Quoten werden später live von Wettbüros bezogen.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container:      { flex: 1, backgroundColor: C.bg },
  scroll:         { padding: 16, gap: 16, paddingBottom: 40 },

  avatarRow:      { alignItems: 'center', paddingVertical: 20, gap: 8 },
  avatar: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: '#052E16', borderWidth: 2, borderColor: '#16A34A',
    alignItems: 'center', justifyContent: 'center',
  },
  avatarInitial:  { color: C.green, fontSize: 30, fontWeight: '800' },
  name:           { color: C.text, fontSize: 22, fontWeight: '800' },
  sub:            { color: C.textSec, fontSize: 13 },

  grid:           { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  statCard: {
    flex: 1, minWidth: '45%', backgroundColor: C.card, borderRadius: 14,
    borderWidth: 1, borderColor: C.border,
    padding: 16, alignItems: 'center', gap: 6,
  },
  statValue:      { fontSize: 24, fontWeight: '800' },
  statLabel:      { color: C.textSec, fontSize: 11, fontWeight: '600', textAlign: 'center' },

  sectionLabel:   { color: C.textMuted, fontSize: 11, fontWeight: '700', letterSpacing: 1 },

  historyRow: {
    backgroundColor: C.card, borderRadius: 12, borderWidth: 1, borderColor: C.border,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: 14, paddingHorizontal: 16,
  },
  historyLeft:    { gap: 2 },
  historyDay:     { color: C.text, fontSize: 15, fontWeight: '600' },
  historyDate:    { color: C.textMuted, fontSize: 12 },
  historyRight:   { alignItems: 'flex-end', gap: 2 },
  historyPoints:  { color: C.green, fontSize: 18, fontWeight: '800' },
  historyCorrect: { color: C.textSec, fontSize: 12 },

  hint: {
    flexDirection: 'row', gap: 6, alignItems: 'flex-start',
    backgroundColor: C.surface, borderRadius: 10, padding: 12,
    borderWidth: 1, borderColor: C.border,
  },
  hintText:       { color: C.textMuted, fontSize: 12, lineHeight: 17, flex: 1 },
});
