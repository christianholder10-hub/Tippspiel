import { useState, useRef, useCallback, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, Modal, Animated, Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { MATCHDAYS, isGameLocked, formatDisplayDate } from '../data/matchdays';

const C = {
  bg:             '#F0FDF4',
  surface:        '#FFFFFF',
  card:           '#FFFFFF',
  selectedBg:     '#DCFCE7',
  selectedBorder: '#16A34A',
  lockedBg:       '#F9FAFB',
  lockedBorder:   '#E5E7EB',
  green900:       '#14532D',
  green700:       '#15803D',
  green500:       '#22C55E',
  green200:       '#BBF7D0',
  text:           '#0F172A',
  textSec:        '#374151',
  textMuted:      '#6B7280',
  border:         '#D1FAE5',
  borderCard:     '#E5E7EB',
};

export default function SpieltagScreen() {
  const params = useLocalSearchParams();
  const [dayIndex, setDayIndex]     = useState(0);
  const [tips, setTips]             = useState({});
  const [showModal, setShowModal]   = useState(false);
  const [toastMsg, setToastMsg]     = useState('');
  const toastOpacity                = useRef(new Animated.Value(0)).current;
  const appliedParam                = useRef(null);

  // Navigate to correct matchday when coming from Profil
  useEffect(() => {
    const d = params.day;
    if (d !== undefined && d !== appliedParam.current) {
      appliedParam.current = d;
      setDayIndex(Number(d));
    }
  }, [params.day]);

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
      Animated.delay(1000),
      Animated.timing(toastOpacity, { toValue: 0, duration: 180, useNativeDriver: true }),
    ]).start();
  }, [toastOpacity]);

  const handleTip = useCallback((gameId, team, locked) => {
    if (locked) return;
    setTips(prev => {
      const prevDay = prev[dayIndex] || {};
      if (prevDay[gameId] === team) return prev;
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
        <Ionicons name="checkmark-circle" size={15} color={C.green700} />
        <Text style={s.toastText}>{toastMsg}</Text>
      </Animated.View>

      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity
          style={[s.navBtn, dayIndex === 0 && s.navBtnDisabled]}
          onPress={() => goDay(-1)}
          disabled={dayIndex === 0}
        >
          <Ionicons name="chevron-back" size={20} color={dayIndex === 0 ? C.textMuted : C.green700} />
        </TouchableOpacity>

        <View style={s.headerCenter}>
          <Text style={s.dayLabel}>{matchday.label}</Text>
          <Text style={s.dayDate}>{matchday.dateRange}</Text>
        </View>

        <TouchableOpacity
          style={[s.navBtn, dayIndex === MATCHDAYS.length - 1 && s.navBtnDisabled]}
          onPress={() => goDay(1)}
          disabled={dayIndex === MATCHDAYS.length - 1}
        >
          <Ionicons name="chevron-forward" size={20} color={dayIndex === MATCHDAYS.length - 1 ? C.textMuted : C.green700} />
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
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>
        {matchday.games.map((game) => {
          const pick   = dayTips[game.id];
          const locked = isGameLocked(game.dateISO, game.time);
          const disp   = formatDisplayDate(game.dateISO);
          return (
            <View key={game.id} style={[s.card, locked && s.cardLocked]}>
              <View style={s.cardTopRow}>
                <Text style={s.gameTime}>
                  <Text style={s.gameDate}>{disp}</Text>{'  ·  '}
                  <Text style={s.gameTimeVal}>{game.time} Uhr</Text>
                </Text>
                {locked && (
                  <View style={s.lockedBadge}>
                    <Ionicons name="lock-closed" size={11} color={C.textMuted} />
                    <Text style={s.lockedText}>Gesperrt</Text>
                  </View>
                )}
              </View>

              <View style={s.teamsRow}>
                <TeamButton
                  label={game.teamA}
                  odds={game.oddsA}
                  selected={pick === 'A'}
                  dimmed={pick === 'B'}
                  locked={locked}
                  onPress={() => handleTip(game.id, 'A', locked)}
                />
                <Text style={s.vs}>vs</Text>
                <TeamButton
                  label={game.teamB}
                  odds={game.oddsB}
                  selected={pick === 'B'}
                  dimmed={pick === 'A'}
                  locked={locked}
                  onPress={() => handleTip(game.id, 'B', locked)}
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
              Du hast alle {total} Tipps für {matchday.label} gesetzt.{'\n'}
              Punkte werden nach Spielende gutgeschrieben.
            </Text>
            {dayIndex < MATCHDAYS.length - 1 && (
              <Pressable style={s.modalBtn} onPress={() => { setShowModal(false); goDay(1); }}>
                <Text style={s.modalBtnText}>Weiter zu {MATCHDAYS[dayIndex + 1].label}</Text>
                <Ionicons name="arrow-forward" size={16} color="#fff" />
              </Pressable>
            )}
            <Pressable style={s.modalBtnGhost} onPress={() => setShowModal(false)}>
              <Text style={s.modalBtnGhostText}>Schließen</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

function TeamButton({ label, odds, selected, dimmed, locked, onPress }) {
  const base = locked
    ? [s.teamBtn, s.teamBtnLocked]
    : selected
    ? [s.teamBtn, s.teamBtnSelected]
    : dimmed
    ? [s.teamBtn, s.teamBtnDimmed]
    : [s.teamBtn];

  return (
    <TouchableOpacity style={base} onPress={onPress} activeOpacity={locked ? 1 : 0.7}>
      {selected && !locked && (
        <Ionicons name="checkmark-circle" size={14} color={C.green700} style={s.checkIcon} />
      )}
      <Text style={[
        s.teamName,
        selected && !locked && s.teamNameSelected,
        (dimmed || locked) && s.teamNameDimmed,
      ]}>
        {label}
      </Text>
      <View style={[s.oddsBadge, selected && !locked && s.oddsBadgeSelected]}>
        <Text style={[s.oddsText, selected && !locked && s.oddsTextSelected]}>
          {odds.toFixed(1)}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  container:          { flex: 1, backgroundColor: C.bg },

  toast: {
    position: 'absolute', top: 14, alignSelf: 'center', zIndex: 99,
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: C.green200,
    paddingVertical: 8, paddingHorizontal: 14, borderRadius: 20,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08, shadowRadius: 6, elevation: 4,
  },
  toastText:          { color: C.green700, fontSize: 13, fontWeight: '600' },

  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingTop: 16, paddingBottom: 12,
    backgroundColor: C.surface,
  },
  navBtn: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: C.bg, borderWidth: 1, borderColor: C.border,
    alignItems: 'center', justifyContent: 'center',
  },
  navBtnDisabled:     { opacity: 0.3 },
  headerCenter:       { alignItems: 'center' },
  dayLabel:           { color: C.green900, fontSize: 18, fontWeight: '800' },
  dayDate:            { color: C.textMuted, fontSize: 12, marginTop: 2 },

  progressRow:        { paddingHorizontal: 16, paddingVertical: 12, backgroundColor: C.surface, gap: 6, borderBottomWidth: 1, borderBottomColor: C.border },
  progressBar:        { height: 4, backgroundColor: C.green200, borderRadius: 2 },
  progressFill:       { height: '100%', backgroundColor: C.green500, borderRadius: 2 },
  progressLabel:      { color: C.textMuted, fontSize: 12 },

  scroll:             { paddingHorizontal: 14, paddingTop: 12, gap: 10 },

  card: {
    backgroundColor: C.card, borderRadius: 14,
    padding: 14, borderWidth: 1, borderColor: C.borderCard,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
  },
  cardLocked:         { backgroundColor: C.lockedBg, borderColor: C.lockedBorder },
  cardTopRow:         { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  gameTime:           { fontSize: 12 },
  gameDate:           { color: C.text, fontWeight: '700' },
  gameTimeVal:        { color: C.textSec, fontWeight: '600' },
  lockedBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: '#F3F4F6', borderRadius: 6,
    paddingVertical: 3, paddingHorizontal: 7,
  },
  lockedText:         { color: C.textMuted, fontSize: 10, fontWeight: '600' },

  teamsRow:           { flexDirection: 'row', alignItems: 'center', gap: 8 },
  vs:                 { color: C.textMuted, fontSize: 11, fontWeight: '700', width: 22, textAlign: 'center' },

  teamBtn: {
    flex: 1, borderRadius: 10, borderWidth: 1.5, borderColor: C.borderCard,
    backgroundColor: C.surface, paddingVertical: 12, paddingHorizontal: 8,
    alignItems: 'center', gap: 5, minHeight: 66, justifyContent: 'center',
  },
  teamBtnSelected:    { borderColor: C.selectedBorder, backgroundColor: C.selectedBg },
  teamBtnDimmed:      { opacity: 0.4 },
  teamBtnLocked:      { borderColor: C.lockedBorder, backgroundColor: C.lockedBg },
  checkIcon:          { position: 'absolute', top: 5, right: 5 },

  teamName:           { color: C.text, fontSize: 12, fontWeight: '700', textAlign: 'center' },
  teamNameSelected:   { color: C.green700 },
  teamNameDimmed:     { color: C.textMuted },

  oddsBadge: {
    paddingHorizontal: 8, paddingVertical: 2,
    borderRadius: 5, backgroundColor: C.bg,
  },
  oddsBadgeSelected:  { backgroundColor: C.green200 },
  oddsText:           { color: C.textMuted, fontSize: 11, fontWeight: '700' },
  oddsTextSelected:   { color: C.green700 },

  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center', justifyContent: 'center', padding: 32,
  },
  modalCard: {
    backgroundColor: C.surface, borderRadius: 20, padding: 28,
    width: '100%', alignItems: 'center', gap: 10,
    borderWidth: 1, borderColor: C.border,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12, shadowRadius: 16, elevation: 8,
  },
  modalEmoji:         { fontSize: 48 },
  modalTitle:         { color: C.green900, fontSize: 22, fontWeight: '800', textAlign: 'center' },
  modalSub:           { color: C.textSec, fontSize: 14, textAlign: 'center', lineHeight: 21 },
  modalBtn: {
    marginTop: 8, backgroundColor: C.green700, borderRadius: 12,
    paddingVertical: 14, paddingHorizontal: 24, width: '100%',
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
  },
  modalBtnText:       { color: '#fff', fontSize: 15, fontWeight: '700' },
  modalBtnGhost:      { paddingVertical: 10 },
  modalBtnGhostText:  { color: C.textMuted, fontSize: 14 },
});
