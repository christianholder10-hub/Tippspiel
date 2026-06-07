import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTips } from '../../context/TipsContext';
import { useAuth } from '../../context/AuthContext';
import { MATCHDAYS } from '../../data/matchdays';

const C = {
  bg: '#1B5E2E', card: '#F0FDF4',
  green900: '#14532D', green700: '#15803D', green500: '#22C55E',
  green200: '#BBF7D0', green100: '#DCFCE7',
  onPitch: '#F0FDF4', onPitchSec: '#86EFAC',
  text: '#0F172A', textSec: '#374151', textMuted: '#6B7280',
  border: '#D1FAE5',
  pending: '#92400E', pendingBg: '#FEF3C7',
};


export default function ProfilScreen() {
  const router         = useRouter();
  const { tips }       = useTips();
  const { user, signOut } = useAuth();
  const displayName = user?.email?.split('@')[0] ?? 'Du';

  // Echte Metriken aus den gespeicherten Tipps
  const totalTipped = Object.values(tips).reduce(
    (sum, day) => sum + Object.keys(day).length, 0
  );
  const completedDays = MATCHDAYS.filter((md, i) =>
    Object.keys(tips[i] || {}).length === md.games.length
  ).length;

  // Spieltage wo mindestens 1 Tipp gesetzt wurde (für Verlauf)
  const tippedHistory = MATCHDAYS
    .map((md, i) => ({ md, i, count: Object.keys(tips[i] || {}).length }))
    .filter(({ count }) => count > 0)
    .slice(-5)
    .reverse();

  const STATS = [
    { icon: 'football-outline',         label: 'Tipps gesetzt',    value: String(totalTipped),      color: C.green700 },
    { icon: 'checkmark-done-outline',   label: 'Spieltage fertig', value: String(completedDays),    color: '#2563EB' },
    { icon: 'trophy-outline',           label: 'Punkte',           value: '—',                      color: '#D97706', pending: true },
    { icon: 'analytics-outline',        label: 'Trefferquote',     value: '—',                      color: '#7C3AED', pending: true },
  ];

  return (
    <View style={s.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>

        {/* Avatar */}
        <View style={s.avatarRow}>
          <View style={s.avatar}>
            <Text style={s.avatarInitial}>{displayName.charAt(0).toUpperCase()}</Text>
          </View>
          <Text style={s.name}>{displayName}</Text>
          <Text style={s.sub}>WM 2026 · Tippspiel</Text>
        </View>

        {/* Info: Punkte erst nach Spielergebnissen */}
        <View style={s.pendingBox}>
          <Ionicons name="time-outline" size={15} color={C.pending} />
          <Text style={s.pendingText}>
            Punkte und Trefferquote werden nach Spielende auf Basis der tatsächlichen Ergebnisse berechnet.
          </Text>
        </View>

        {/* Stats Grid */}
        <View style={s.grid}>
          {STATS.map((stat) => (
            <View key={stat.label} style={s.statCard}>
              <Ionicons name={stat.icon} size={20} color={stat.pending ? C.textMuted : stat.color} />
              <Text style={[s.statValue, { color: stat.pending ? C.textMuted : stat.color }]}>
                {stat.value}
              </Text>
              <Text style={s.statLabel}>{stat.label}</Text>
              {stat.pending && <Text style={s.statPending}>ausstehend</Text>}
            </View>
          ))}
        </View>

        {/* Spieltag-Verlauf */}
        {tippedHistory.length > 0 && (
          <>
            <Text style={s.sectionLabel}>MEINE TIPPS</Text>
            {tippedHistory.map(({ md, i, count }) => (
              <TouchableOpacity
                key={i}
                style={s.historyRow}
                onPress={() => router.push({ pathname: '/', params: { day: String(i) } })}
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
                  <Text style={s.historyCount}>{count}/{md.games.length}</Text>
                  <Text style={s.historyCountLabel}>getippt</Text>
                  <Text style={s.historyPoints}>— Pkt.</Text>
                </View>
              </TouchableOpacity>
            ))}
          </>
        )}

        {tippedHistory.length === 0 && (
          <View style={s.emptyBox}>
            <Ionicons name="football-outline" size={32} color={C.onPitchSec} />
            <Text style={s.emptyText}>Noch keine Tipps abgegeben.{'\n'}Geh zum Spieltag-Tab und leg los!</Text>
          </View>
        )}

        <TouchableOpacity style={s.signOutBtn} onPress={signOut}>
          <Ionicons name="log-out-outline" size={18} color={C.textMuted} />
          <Text style={s.signOutText}>Abmelden</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container:      { flex: 1, backgroundColor: C.bg },
  scroll:         { padding: 16, gap: 14, paddingBottom: 40 },

  avatarRow:      { alignItems: 'center', paddingVertical: 16, gap: 8 },
  avatar: {
    width: 70, height: 70, borderRadius: 35,
    backgroundColor: C.green100, borderWidth: 2, borderColor: C.green500,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarInitial:  { color: C.green700, fontSize: 28, fontWeight: '800' },
  name:           { color: C.onPitch, fontSize: 22, fontWeight: '800' },
  sub:            { color: C.onPitchSec, fontSize: 13 },

  pendingBox: {
    flexDirection: 'row', gap: 8, alignItems: 'flex-start',
    backgroundColor: C.pendingBg, borderRadius: 10, padding: 12,
  },
  pendingText:    { color: C.pending, fontSize: 12, lineHeight: 17, flex: 1 },

  grid:           { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  statCard: {
    flex: 1, minWidth: '45%', backgroundColor: C.card, borderRadius: 14,
    borderWidth: 1, borderColor: C.border,
    padding: 14, alignItems: 'center', gap: 4,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08, shadowRadius: 4, elevation: 2,
  },
  statValue:      { fontSize: 24, fontWeight: '800' },
  statLabel:      { color: C.textSec, fontSize: 11, fontWeight: '600', textAlign: 'center' },
  statPending:    { color: C.textMuted, fontSize: 10, fontStyle: 'italic' },

  sectionLabel:   { color: C.onPitchSec, fontSize: 11, fontWeight: '700', letterSpacing: 1 },

  historyRow: {
    backgroundColor: C.card, borderRadius: 12, borderWidth: 1, borderColor: C.border,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: 14, paddingHorizontal: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06, shadowRadius: 3, elevation: 2,
  },
  historyLeft:    { gap: 3 },
  historyDay:     { color: C.text, fontSize: 15, fontWeight: '700' },
  historyDate:    { color: C.textMuted, fontSize: 12 },
  historyLink:    { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  historyLinkText:{ color: C.green700, fontSize: 12, fontWeight: '600' },
  historyRight:   { alignItems: 'flex-end', gap: 2 },
  historyCount:   { color: C.green700, fontSize: 20, fontWeight: '800' },
  historyCountLabel: { color: C.textMuted, fontSize: 11 },
  historyPoints:  { color: C.textMuted, fontSize: 12, fontStyle: 'italic' },

  emptyBox:       { alignItems: 'center', gap: 10, paddingVertical: 32 },
  emptyText:      { color: C.onPitchSec, fontSize: 14, textAlign: 'center', lineHeight: 20 },
  signOutBtn:     { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 14, marginTop: 8 },
  signOutText:    { color: C.textMuted, fontSize: 14 },
});
