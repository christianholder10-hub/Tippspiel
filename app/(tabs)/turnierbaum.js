import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MATCHDAYS, isPlaceholderGame, formatDisplayDate } from '../../data/matchdays';

const C = {
  bg:        '#1B5E2E',
  card:      '#F0FDF4',
  cardInner: '#ECFDF5',
  pitch:     '#0F3D1A',
  accent:    '#4ADE80',
  accentDim: '#BBF7D0',
  onPitch:   '#F0FDF4',
  onPitchSec:'#86EFAC',
  text:      '#0F172A',
  textSec:   '#374151',
  textMuted: '#6B7280',
  border:    '#D1FAE5',
  dim:       '#ECFDF5',
};

export default function TurnierbaumScreen() {
  const [expanded, setExpanded] = useState({ 0: true }); // Spieltag 1 offen

  const toggle = (id) =>
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));

  return (
    <View style={s.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>
        <Text style={s.headline}>WM 2026 · Alle Runden</Text>

        {MATCHDAYS.map((md, i) => {
          const open = !!expanded[md.id];
          return (
            <View key={md.id} style={s.card}>
              {/* Header — klickbar */}
              <TouchableOpacity
                style={s.cardHeader}
                onPress={() => toggle(md.id)}
                activeOpacity={0.7}
              >
                <View style={[s.roundDot, i === 0 && s.roundDotActive]} />
                <View style={{ flex: 1 }}>
                  <Text style={s.roundLabel}>{md.label}</Text>
                  <Text style={s.roundDate}>{md.dateRange} · {md.games.length} Spiele</Text>
                </View>
                {i === 0 && (
                  <View style={s.badge}>
                    <Text style={s.badgeText}>AKTUELL</Text>
                  </View>
                )}
                <Ionicons
                  name={open ? 'chevron-up' : 'chevron-down'}
                  size={18}
                  color={C.textMuted}
                  style={{ marginLeft: 8 }}
                />
              </TouchableOpacity>

              {/* Ausgeklappte Spielliste */}
              {open && (
                <View style={s.gameList}>
                  <View style={s.divider} />
                  {md.games.map((game) => {
                    const placeholder = isPlaceholderGame(game);
                    const disp = formatDisplayDate(game.dateISO);
                    return (
                      <View
                        key={game.id}
                        style={[s.gameRow, placeholder && s.gameRowDim]}
                      >
                        <View style={s.gameTeams}>
                          <Text style={[s.gameTeam, placeholder && s.gameTeamDim]}>
                            {game.teamA}
                          </Text>
                          <Text style={s.gameVs}>vs</Text>
                          <Text style={[s.gameTeam, placeholder && s.gameTeamDim]}>
                            {game.teamB}
                          </Text>
                        </View>
                        <View style={s.gameMeta}>
                          {placeholder ? (
                            <View style={s.unknownBadge}>
                              <Ionicons name="time-outline" size={11} color={C.textMuted} />
                              <Text style={s.unknownText}>Noch nicht bekannt</Text>
                            </View>
                          ) : game.score ? (
                            <View style={s.scoreBox}>
                              <Text style={s.scoreText}>{game.score.home} : {game.score.away}</Text>
                              <Text style={s.gameTimeSub}>{disp} · {game.time}</Text>
                            </View>
                          ) : (
                            <Text style={s.gameTime}>{disp} · {game.time}</Text>
                          )}
                        </View>
                      </View>
                    );
                  })}
                </View>
              )}
            </View>
          );
        })}

        <Text style={s.hint}>
          Paarungen der Knockout-Runden werden nach Abschluss der Gruppenphase bekannt gegeben.
        </Text>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container:    { flex: 1, backgroundColor: C.bg },
  scroll:       { padding: 16, gap: 10, paddingBottom: 40 },
  headline:     { color: C.onPitch, fontSize: 22, fontWeight: '800', marginBottom: 4 },

  card: {
    backgroundColor: C.card, borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12, shadowRadius: 6, elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row', alignItems: 'center',
    padding: 14, gap: 10,
  },
  roundDot:       { width: 9, height: 9, borderRadius: 5, backgroundColor: C.border, flexShrink: 0, marginTop: 1 },
  roundDotActive: { backgroundColor: C.accent },
  roundLabel:     { color: C.text, fontSize: 15, fontWeight: '700' },
  roundDate:      { color: C.textMuted, fontSize: 12, marginTop: 2 },
  badge: {
    backgroundColor: '#DCFCE7', borderRadius: 6,
    paddingVertical: 2, paddingHorizontal: 8,
    borderWidth: 1, borderColor: '#86EFAC',
  },
  badgeText:      { color: '#15803D', fontSize: 10, fontWeight: '700', letterSpacing: 0.5 },

  divider:        { height: 1, backgroundColor: C.border, marginHorizontal: 14 },
  gameList:       { paddingBottom: 8 },

  gameRow: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 9, paddingHorizontal: 14,
    borderBottomWidth: 1, borderBottomColor: '#F3F4F6',
  },
  gameRowDim:     { backgroundColor: C.dim },
  gameTeams:      { flexDirection: 'row', alignItems: 'center', gap: 6, flex: 1 },
  gameTeam:       { color: C.text, fontSize: 13, fontWeight: '600', flexShrink: 1 },
  gameTeamDim:    { color: C.textMuted },
  gameVs:         { color: C.textMuted, fontSize: 11, fontWeight: '700' },
  gameMeta:       { alignItems: 'flex-end', marginLeft: 8 },
  gameTime:       { color: C.textSec, fontSize: 12, fontWeight: '600' },
  scoreBox:       { alignItems: 'flex-end', gap: 1 },
  scoreText:      { color: C.text, fontSize: 13, fontWeight: '800' },
  gameTimeSub:    { color: C.textMuted, fontSize: 10 },
  unknownBadge:   { flexDirection: 'row', alignItems: 'center', gap: 3 },
  unknownText:    { color: C.textMuted, fontSize: 11, fontStyle: 'italic' },

  hint:           { color: C.onPitchSec, fontSize: 11, textAlign: 'center', lineHeight: 16, marginTop: 4 },
});
