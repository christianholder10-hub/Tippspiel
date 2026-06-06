import { useState, useRef, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, Modal, Animated, Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MATCHDAYS } from '../data/matchdays';

const C = {
  bg:           '#0B0F1A',
  surface:      '#101828',
  card:         '#141C2E',
  selected:     '#052E16',
  selectedBorder:'#16A34A',
  green:        '#22C55E',
  text:         '#F8FAFC',
  textSec:      '#94A3B8',
  textMuted:    '#3F5070',
  border:       '#1A2540',
  dim:          '#1A2130',
};

export default function SpieltagScreen() {
  const [dayIndex, setDayIndex] = useState(0);
  const [tips, setTips] = useState({});           // { dayIndex: { gameId: 'A'|'B' } }
  const [showModal, setShowModal] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const toastOpacity = useRef(new Animated.Value(0)).current;

  const matchday = MATCHDAYS[dayIndex];
  const dayTips  = tips[dayIndex] || {};
  const tipped   = Object.keys(dayTips).length;
  const total    = matchday.games.length;
  const allDone  = tipped === total;

  const showToast = useCallback((msg) => {
    setToastMsg(msg);
    toastOpacity.setValue(0);
    Animated.sequence([
      Animated.timing(toastOpacity, { toValue: 1, duration: 180, useNativeDriver: true }),
      Animated.delay(900),
      Animated.timing(toastOpacity, { toValue: 0, duration: 180, useNativeDriver: true }),
    ]).start();
  }, [toastOpacity]);

  const handleTip = useCallback((gameId, team) => {
    setTips(prev => {
      const prevDay  = prev[dayIndex] || {};
      const isChange = prevDay[gameId] !== team;
      if (!isChange) return prev;

      const newDay  = { ...prevDay, [gameId]: team };
      const newTips = { ...prev, [dayIndex]: newDay };
      const nowDone = Object.keys(newDay).length === total;

      if (nowDone && Object.keys(prevDay).length < total) {
        setTimeout(() => setShowModal(true), 350);
      } else {
        showToast('Tipp gespeichert');
      }
      return newTips;
    });
  }, [dayIndex, total, showToast]);

  const goDay = (dir) => {
    const next = dayIndex + dir;
    if (next >= 0 && next < MATCHDAYS.length) setDayIndex(next);
  };

  return (
    <View style={s.container}>

      {/* Toast */}
      <Animated.View style={[s.toast, { opacity: toastOpacity }]} pointerEvents="none">
        <Ionicons name="checkmark-circle" size={16} color={C.green} />
        <Text style={s.toastText}>{toastMsg}</Text>
      </Animated.View>

      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity
          style={[s.navBtn, dayIndex === 0 && s.navBtnDisabled]}
          onPress={() => goDay(-1)}
          disabled={dayIndex === 0}
        >
          <Ionicons name="chevron-back" size={20} color={dayIndex === 0 ? C.textMuted : C.text} />
        </TouchableOpacity>

        <View style={s.headerCenter}>
          <Text style={s.dayLabel}>{matchday.label}</Text>
          <Text style={s.dayDate}>{matchday.date}</Text>
        </View>

        <TouchableOpacity
          style={[s.navBtn, dayIndex === MATCHDAYS.length - 1 && s.navBtnDisabled]}
          onPress={() => goDay(1)}
          disabled={dayIndex === MATCHDAYS.length - 1}
        >
          <Ionicons name="chevron-forward" size={20} color={dayIndex === MATCHDAYS.length - 1 ? C.textMuted : C.text} />
        </TouchableOpacity>
      </View>

      {/* Progress */}
      <View style={s.progressRow}>
        <View style={s.progressBar}>
          <View style={[s.progressFill, { width: `${(tipped / total) * 100}%` }]} />
        </View>
        <Text style={s.progressLabel}>
          {allDone ? '✓ Alle Tipps gesetzt' : `${tipped} / ${total} getippt`}
        </Text>
      </View>

      {/* Games */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.scroll}
      >
        {matchday.games.map((game) => {
          const pick = dayTips[game.id];
          return (
            <View key={game.id} style={s.card}>
              <Text style={s.gameTime}>{game.date} · {game.time} Uhr</Text>

              <View style={s.teamsRow}>
                <TeamButton
                  label={game.teamA}
                  odds={game.oddsA}
                  selected={pick === 'A'}
                  dimmed={pick === 'B'}
                  onPress={() => handleTip(game.id, 'A')}
                />
                <Text style={s.vs}>vs</Text>
                <TeamButton
                  label={game.teamB}
                  odds={game.oddsB}
                  selected={pick === 'B'}
                  dimmed={pick === 'A'}
                  onPress={() => handleTip(game.id, 'B')}
                />
              </View>
            </View>
          );
        })}
        <View style={{ height: 24 }} />
      </ScrollView>

      {/* Success Modal */}
      <Modal visible={showModal} transparent animationType="fade">
        <View style={s.modalOverlay}>
          <View style={s.modalCard}>
            <Text style={s.modalEmoji}>🎉</Text>
            <Text style={s.modalTitle}>Alle Tipps abgegeben!</Text>
            <Text style={s.modalSub}>
              Du hast alle {total} Tipps für {matchday.label} gesetzt.
              Viel Erfolg!
            </Text>
            {dayIndex < MATCHDAYS.length - 1 ? (
              <Pressable
                style={s.modalBtn}
                onPress={() => { setShowModal(false); goDay(1); }}
              >
                <Text style={s.modalBtnText}>Weiter zu Spieltag {dayIndex + 2}</Text>
                <Ionicons name="arrow-forward" size={16} color="#fff" />
              </Pressable>
            ) : null}
            <Pressable style={s.modalBtnGhost} onPress={() => setShowModal(false)}>
              <Text style={s.modalBtnGhostText}>Schließen</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

function TeamButton({ label, odds, selected, dimmed, onPress }) {
  return (
    <TouchableOpacity
      style={[
        s.teamBtn,
        selected && s.teamBtnSelected,
        dimmed   && s.teamBtnDimmed,
      ]}
      onPress={onPress}
      activeOpacity={0.75}
    >
      {selected && (
        <Ionicons name="checkmark-circle" size={14} color={C.green} style={s.checkIcon} />
      )}
      <Text style={[s.teamName, dimmed && s.teamNameDimmed, selected && s.teamNameSelected]}>
        {label}
      </Text>
      <View style={[s.oddsBadge, selected && s.oddsBadgeSelected]}>
        <Text style={[s.oddsText, selected && s.oddsTextSelected]}>
          {odds.toFixed(1)}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  container:          { flex: 1, backgroundColor: C.bg },
  toast: {
    position: 'absolute', top: 12, alignSelf: 'center', zIndex: 99,
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: '#0F1F14', borderWidth: 1, borderColor: C.selectedBorder,
    paddingVertical: 8, paddingHorizontal: 14, borderRadius: 20,
  },
  toastText:          { color: C.green, fontSize: 13, fontWeight: '600' },

  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingTop: 16, paddingBottom: 12,
  },
  navBtn: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: C.surface, alignItems: 'center', justifyContent: 'center',
  },
  navBtnDisabled:     { opacity: 0.3 },
  headerCenter:       { alignItems: 'center' },
  dayLabel:           { color: C.text, fontSize: 18, fontWeight: '700' },
  dayDate:            { color: C.textSec, fontSize: 12, marginTop: 2 },

  progressRow:        { paddingHorizontal: 16, paddingBottom: 14, gap: 6 },
  progressBar:        { height: 3, backgroundColor: C.border, borderRadius: 2 },
  progressFill:       { height: '100%', backgroundColor: C.green, borderRadius: 2 },
  progressLabel:      { color: C.textSec, fontSize: 12 },

  scroll:             { paddingHorizontal: 16, gap: 10 },

  card: {
    backgroundColor: C.card, borderRadius: 14,
    padding: 14, borderWidth: 1, borderColor: C.border,
  },
  gameTime:           { color: C.textMuted, fontSize: 11, fontWeight: '600', marginBottom: 12 },
  teamsRow:           { flexDirection: 'row', alignItems: 'center', gap: 8 },
  vs:                 { color: C.textMuted, fontSize: 12, fontWeight: '700', width: 24, textAlign: 'center' },

  teamBtn: {
    flex: 1, borderRadius: 10, borderWidth: 1.5,
    borderColor: C.border, backgroundColor: C.surface,
    paddingVertical: 12, paddingHorizontal: 10,
    alignItems: 'center', gap: 6, minHeight: 70,
    justifyContent: 'center',
  },
  teamBtnSelected: {
    borderColor: C.selectedBorder,
    backgroundColor: C.selected,
  },
  teamBtnDimmed:      { opacity: 0.35 },
  checkIcon:          { position: 'absolute', top: 6, right: 6 },
  teamName:           { color: C.text, fontSize: 13, fontWeight: '600', textAlign: 'center' },
  teamNameDimmed:     { color: C.textMuted },
  teamNameSelected:   { color: C.green },
  oddsBadge: {
    paddingHorizontal: 8, paddingVertical: 3,
    borderRadius: 6, backgroundColor: C.dim,
  },
  oddsBadgeSelected:  { backgroundColor: '#0A3D1A' },
  oddsText:           { color: C.textSec, fontSize: 12, fontWeight: '700' },
  oddsTextSelected:   { color: C.green },

  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.75)',
    alignItems: 'center', justifyContent: 'center', padding: 32,
  },
  modalCard: {
    backgroundColor: C.card, borderRadius: 20, padding: 28,
    width: '100%', alignItems: 'center', gap: 10,
    borderWidth: 1, borderColor: C.border,
  },
  modalEmoji:         { fontSize: 48 },
  modalTitle:         { color: C.text, fontSize: 22, fontWeight: '800', textAlign: 'center' },
  modalSub:           { color: C.textSec, fontSize: 14, textAlign: 'center', lineHeight: 20 },
  modalBtn: {
    marginTop: 8, backgroundColor: C.green, borderRadius: 12,
    paddingVertical: 14, paddingHorizontal: 24, width: '100%',
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
  },
  modalBtnText:       { color: '#fff', fontSize: 15, fontWeight: '700' },
  modalBtnGhost:      { paddingVertical: 10 },
  modalBtnGhostText:  { color: C.textSec, fontSize: 14 },
});
