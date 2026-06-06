import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MATCHDAYS } from '../data/matchdays';

const C = {
  bg: '#F0FDF4', card: '#FFFFFF',
  green900: '#14532D', green700: '#15803D', green500: '#22C55E', green200: '#BBF7D0', green100: '#DCFCE7',
  text: '#0F172A', textSec: '#374151', textMuted: '#6B7280',
  border: '#D1FAE5', borderCard: '#E5E7EB',
};

export default function TurnierbaumScreen() {
  return (
    <View style={s.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>

        <View style={s.placeholder}>
          <Ionicons name="git-branch-outline" size={48} color={C.green500} />
          <Text style={s.placeholderTitle}>Turnierbaum</Text>
          <Text style={s.placeholderSub}>
            Wird nach Abschluss der Gruppenphase freigeschaltet.
          </Text>
        </View>

        {MATCHDAYS.map((md, i) => (
          <View key={md.id} style={s.roundCard}>
            <View style={s.roundHeader}>
              <View style={[s.roundDot, i === 0 && s.roundDotActive]} />
              <View style={{ flex: 1 }}>
                <Text style={[s.roundLabel, i === 0 && s.roundLabelActive]}>{md.label}</Text>
                <Text style={s.roundDate}>{md.dateRange}</Text>
              </View>
              {i === 0 && (
                <View style={s.activeBadge}>
                  <Text style={s.activeBadgeText}>AKTUELL</Text>
                </View>
              )}
              <Text style={s.gameCount}>{md.games.length} Spiele</Text>
            </View>
          </View>
        ))}

        <Text style={s.hint}>
          Der Turnierbaum wird automatisch befüllt, sobald die Ergebnisse feststehen.
        </Text>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container:        { flex: 1, backgroundColor: C.bg },
  scroll:           { padding: 16, gap: 10, paddingBottom: 40 },

  placeholder: {
    backgroundColor: C.card, borderRadius: 16,
    borderWidth: 1, borderColor: C.border,
    padding: 32, alignItems: 'center', gap: 10, marginBottom: 4,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
  },
  placeholderTitle: { color: C.green900, fontSize: 20, fontWeight: '700' },
  placeholderSub:   { color: C.textSec, fontSize: 14, textAlign: 'center', lineHeight: 20 },

  roundCard: {
    backgroundColor: C.card, borderRadius: 12, borderWidth: 1,
    borderColor: C.borderCard, padding: 14,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03, shadowRadius: 3, elevation: 1,
  },
  roundHeader:      { flexDirection: 'row', alignItems: 'center', gap: 10 },
  roundDot:         { width: 8, height: 8, borderRadius: 4, backgroundColor: C.borderCard, marginTop: 2, flexShrink: 0 },
  roundDotActive:   { backgroundColor: C.green500 },
  roundLabel:       { color: C.textSec, fontSize: 14, fontWeight: '600' },
  roundLabelActive: { color: C.green900 },
  roundDate:        { color: C.textMuted, fontSize: 12, marginTop: 2 },
  activeBadge: {
    backgroundColor: C.green100, borderRadius: 6, borderWidth: 1,
    borderColor: C.green200, paddingVertical: 2, paddingHorizontal: 8,
  },
  activeBadgeText:  { color: C.green700, fontSize: 10, fontWeight: '700', letterSpacing: 0.5 },
  gameCount:        { color: C.textMuted, fontSize: 12, fontWeight: '600' },

  hint:             { color: C.textMuted, fontSize: 11, textAlign: 'center', lineHeight: 16, marginTop: 4 },
});
