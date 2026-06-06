import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const C = {
  bg: '#0B0F1A', card: '#141C2E', green: '#22C55E',
  text: '#F8FAFC', textSec: '#94A3B8', textMuted: '#3F5070', border: '#1A2540',
};

const ROUNDS = ['Gruppenphase', 'Achtelfinale', 'Viertelfinale', 'Halbfinale', 'Finale'];

export default function TurnierbaumScreen() {
  return (
    <View style={s.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>

        <View style={s.placeholder}>
          <Ionicons name="git-branch-outline" size={52} color={C.textMuted} />
          <Text style={s.placeholderTitle}>Turnierbaum</Text>
          <Text style={s.placeholderSub}>
            Wird nach Abschluss der Gruppenphase freigeschaltet.
          </Text>
        </View>

        {ROUNDS.map((round, i) => (
          <View key={round} style={s.roundCard}>
            <View style={s.roundHeader}>
              <View style={[s.roundDot, i === 0 && s.roundDotActive]} />
              <Text style={[s.roundLabel, i === 0 && s.roundLabelActive]}>{round}</Text>
              {i === 0 && <View style={s.liveBadge}><Text style={s.liveText}>LÄUFT</Text></View>}
            </View>
            <View style={s.slots}>
              {Array.from({ length: Math.max(1, 8 >> i) }, (_, j) => (
                <View key={j} style={s.slot}>
                  <Text style={s.slotText}>—</Text>
                </View>
              ))}
            </View>
          </View>
        ))}

        <Text style={s.hint}>
          * Turnierbaum wird automatisch befüllt, sobald die Ergebnisse feststehen.
        </Text>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container:          { flex: 1, backgroundColor: C.bg },
  scroll:             { padding: 16, gap: 12, paddingBottom: 40 },

  placeholder: {
    backgroundColor: C.card, borderRadius: 16, borderWidth: 1, borderColor: C.border,
    padding: 36, alignItems: 'center', gap: 12, marginBottom: 4,
  },
  placeholderTitle:   { color: C.text, fontSize: 20, fontWeight: '700' },
  placeholderSub:     { color: C.textSec, fontSize: 14, textAlign: 'center', lineHeight: 20 },

  roundCard: {
    backgroundColor: C.card, borderRadius: 12, borderWidth: 1,
    borderColor: C.border, padding: 14,
  },
  roundHeader:        { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  roundDot:           { width: 8, height: 8, borderRadius: 4, backgroundColor: C.textMuted },
  roundDotActive:     { backgroundColor: C.green },
  roundLabel:         { color: C.textSec, fontSize: 14, fontWeight: '600', flex: 1 },
  roundLabelActive:   { color: C.text },
  liveBadge: {
    backgroundColor: '#052E16', borderRadius: 6, borderWidth: 1,
    borderColor: '#16A34A', paddingVertical: 2, paddingHorizontal: 8,
  },
  liveText:           { color: C.green, fontSize: 10, fontWeight: '700', letterSpacing: 0.5 },

  slots:              { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  slot: {
    backgroundColor: '#0F1623', borderRadius: 8, borderWidth: 1,
    borderColor: C.border, paddingVertical: 6, paddingHorizontal: 10,
    minWidth: 60, alignItems: 'center',
  },
  slotText:           { color: C.textMuted, fontSize: 12, fontWeight: '600' },

  hint:               { color: C.textMuted, fontSize: 11, textAlign: 'center', lineHeight: 16 },
});
