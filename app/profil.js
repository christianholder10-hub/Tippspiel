import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { PLAYERS } from '../data/players';
import { MATCHDAYS } from '../data/matchdays';

const C = {
  bg: '#F0FDF4', surface: '#FFFFFF', card: '#FFFFFF',
  green900: '#14532D', green700: '#15803D', green500: '#22C55E', green200: '#BBF7D0', green100: '#DCFCE7',
  text: '#0F172A', textSec: '#374151', textMuted: '#6B7280',
  border: '#D1FAE5', borderCard: '#E5E7EB',
};

const me     = PLAYERS.find(p => p.isMe);
const sorted = [...PLAYERS].sort((a, b) => b.points - a.points);
const myRank = sorted.findIndex(p => p.isMe) + 1;

const STATS = [
  { icon: 'trophy-outline',           label: 'Punkte',       value: String(me.points),                                        color: C.green700 },
  { icon: 'checkmark-circle-outline', label: 'Richtig',      value: String(me.correct),                                       color: '#2563EB' },
  { icon: 'podium-outline',           label: 'Rang',         value: `#${myRank}`,                                             color: '#D97706' },
  { icon: 'analytics-outline',        label: 'Trefferquote', value: `${Math.round((me.correct / me.total) * 100)} %`,         color: '#7C3AED' },
];

// Letzte 3 Spieltage als Platzhalter-Verlauf
const HISTORY = [
  { dayIndex: 0, correct: 14, total: 24, points: 28 },
  { dayIndex: 1, correct: 11, total: 24, points: 22 },
  { dayIndex: 2, correct: 16, total: 24, points: 32 },
];

export default function ProfilScreen() {
  const router = useRouter();

  const goToMatchday = (dayIndex) => {
    router.push({ pathname: '/', params: { day: String(dayIndex) } });
  };

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

        <Text style={s.sectionLabel}>LETZTE SPIELTAGE</Text>

        {HISTORY.map((entry) => {
          const md = MATCHDAYS[entry.dayIndex];
          return (
            <TouchableOpacity
              key={entry.dayIndex}
              style={s.historyRow}
              onPress={() => goToMatchday(entry.dayIndex)}
              activeOpacity={0.7}
            >
              <View style={s.historyLeft}>
                <Text style={s.historyDay}>{md.label}</Text>
                <Text style={s.historyDate}>{md.dateRange}</Text>
                <View style={s.historyLink}>
                  <Ionicons name="arrow-forward-circle-outline" size={13} color={C.green700} />
                  <Text style={s.historyLinkText}>Zum Spielplan</Text>
                </View>
              </View>
              <View style={s.historyRight}>
                <Text style={s.historyPoints}>+{entry.points}</Text>
                <Text style={s.historyCorrect}>{entry.correct}/{entry.total} richtig</Text>
              </View>
            </TouchableOpacity>
          );
        })}

        <View style={s.infoBox}>
          <Ionicons name="information-circle-outline" size={15} color={C.textMuted} />
          <Text style={s.infoText}>
            Punkte werden nach Spielende automatisch gutgeschrieben. Quoten kommen später live von Wettbüros.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container:      { flex: 1, backgroundColor: C.bg },
  scroll:         { padding: 16, gap: 14, paddingBottom: 40 },

  avatarRow:      { alignItems: 'center', paddingVertical: 20, gap: 8 },
  avatar: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: C.green100, borderWidth: 2, borderColor: C.green500,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarInitial:  { color: C.green700, fontSize: 30, fontWeight: '800' },
  name:           { color: C.green900, fontSize: 22, fontWeight: '800' },
  sub:            { color: C.textMuted, fontSize: 13 },

  grid:           { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  statCard: {
    flex: 1, minWidth: '45%', backgroundColor: C.card, borderRadius: 14,
    borderWidth: 1, borderColor: C.borderCard,
    padding: 16, alignItems: 'center', gap: 6,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
  },
  statValue:      { fontSize: 24, fontWeight: '800' },
  statLabel:      { color: C.textSec, fontSize: 11, fontWeight: '600', textAlign: 'center' },

  sectionLabel:   { color: C.textMuted, fontSize: 11, fontWeight: '700', letterSpacing: 1 },

  historyRow: {
    backgroundColor: C.card, borderRadius: 12, borderWidth: 1, borderColor: C.borderCard,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: 14, paddingHorizontal: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04, shadowRadius: 3, elevation: 1,
  },
  historyLeft:    { gap: 3 },
  historyDay:     { color: C.text, fontSize: 15, fontWeight: '700' },
  historyDate:    { color: C.textMuted, fontSize: 12 },
  historyLink:    { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  historyLinkText:{ color: C.green700, fontSize: 12, fontWeight: '600' },
  historyRight:   { alignItems: 'flex-end', gap: 4 },
  historyPoints:  { color: C.green700, fontSize: 20, fontWeight: '800' },
  historyCorrect: { color: C.textSec, fontSize: 12 },

  infoBox: {
    flexDirection: 'row', gap: 8, alignItems: 'flex-start',
    backgroundColor: C.surface, borderRadius: 10, padding: 12,
    borderWidth: 1, borderColor: C.border,
  },
  infoText:       { color: C.textMuted, fontSize: 12, lineHeight: 17, flex: 1 },
});
