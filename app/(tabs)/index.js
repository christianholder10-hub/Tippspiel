import { useState, useRef, useCallback, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, Modal, Animated, Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { MATCHDAYS, isGameLocked, formatDisplayDate } from '../../data/matchdays';
import { useTips } from '../../context/TipsContext';

// ─── Design-System ────────────────────────────────────────────────────────────
const C = {
  bg:           '#1B5E2E',
  card:         '#F0FDF4',
  onPitch:      '#F0FDF4',
  onPitchSec:   '#86EFAC',
  accent:       '#4ADE80',
  green900:     '#14532D',
  green700:     '#15803D',
  green200:     '#BBF7D0',
  text:         '#0F172A',
  textSec:      '#374151',
  textMuted:    '#6B7280',
  border:       '#D1FAE5',

  // Alle vergangenen/gesperrten Karten: einheitliches gedimmtes Grün
  lockedCard:   '#DDE8DF',
  lockedBtn:    '#CDD8CF',
  lockedText:   '#7A9880',
  lockedBorder: '#B8CEBC',

  // Tipp gespeichert (noch kein Ergebnis) → blau
  saved:        '#1D4ED8',
  savedBg:      '#EFF6FF',
  savedBorder:  '#3B82F6',

  // Ergebnis richtig → selbe Grüntöne wie Legende
  correct:      '#14532D',
  correctBg:    '#DCFCE7',
  correctBorder:'#16A34A',

  // Ergebnis falsch → selbe Rottöne wie Legende
  wrong:        '#991B1B',
  wrongBg:      '#FCE8E8',
  wrongBorder:  '#B91C1C',
};

// ─── Hilfsfunktion: Spielkarten-Zustand ──────────────────────────────────────
function getGameState(game, tip, locked) {
  if (game.result && tip) return tip === game.result ? 'correct' : 'wrong';
  if (game.result && !tip) return 'locked_no_tip';
  if (locked && tip) return 'locked_saved';
  if (locked) return 'locked';
  if (tip) return 'saved';
  return 'empty';
}

export default function SpieltagScreen() {
  const params              = useLocalSearchParams();
  const { tips, setTip }    = useTips();
  const [dayIndex, setDayIndex]   = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [toastMsg, setToastMsg]   = useState('');
  const toastOpacity              = useRef(new Animated.Value(0)).current;
  const appliedParam              = useRef(null);

  useEffect(() => {
    const d = params.day;
    if (d !== undefined && d !== appliedParam.current) {
      appliedParam.current = d;
      setDayIndex(Number(d));
    }
  }, [params.day]);

  const matchday = MATCHDAYS[dayIndex];
  const dayTips  = tips[dayIndex] || {};
  const tippable = matchday.games.filter(g => !g.result && !isGameLocked(g.dateISO, g.time));
  const tipped   = tippable.filter(g => dayTips[g.id]).length;
  const total    = tippable.length;
  const allDone  = total > 0 && tipped === total;

  const showToast = useCallback((msg) => {
    setToastMsg(msg);
    toastOpacity.setValue(0);
    Animated.sequence([
      Animated.timing(toastOpacity, { toValue: 1, duration: 180, useNativeDriver: true }),
      Animated.delay(1000),
      Animated.timing(toastOpacity, { toValue: 0, duration: 180, useNativeDriver: true }),
    ]).start();
  }, [toastOpacity]);

  const handleTip = useCallback((gameId, team, locked, hasResult) => {
    if (locked || hasResult) return;
    const prevDay = tips[dayIndex] || {};
    if (prevDay[gameId] === team) return;
    const newDay  = { ...prevDay, [gameId]: team };
    const nowDone = tippable.every(g => newDay[g.id]);
    setTip(dayIndex, gameId, team);
    if (nowDone && !allDone) {
      setTimeout(() => setShowModal(true), 350);
    } else {
      showToast('Tipp gespeichert');
    }
  }, [dayIndex, tips, tippable, allDone, setTip, showToast]);

  const goDay = (dir) => {
    const next = dayIndex + dir;
    if (next >= 0 && next < MATCHDAYS.length) setDayIndex(next);
  };

  return (
    <View style={s.container}>

      {/* Toast */}
      <Animated.View style={[s.toast, { opacity: toastOpacity }]} pointerEvents="none">
        <Ionicons name="checkmark-circle" size={15} color={C.saved} />
        <Text style={s.toastText}>{toastMsg}</Text>
      </Animated.View>

      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity
          style={[s.navBtn, dayIndex === 0 && s.navBtnDisabled]}
          onPress={() => goDay(-1)} disabled={dayIndex === 0}
        >
          <Ionicons name="chevron-back" size={20} color={dayIndex === 0 ? '#4D8060' : C.onPitch} />
        </TouchableOpacity>
        <View style={s.headerCenter}>
          <Text style={s.dayLabel}>{matchday.label}</Text>
          <Text style={s.dayDate}>{matchday.dateRange}</Text>
        </View>
        <TouchableOpacity
          style={[s.navBtn, dayIndex === MATCHDAYS.length - 1 && s.navBtnDisabled]}
          onPress={() => goDay(1)} disabled={dayIndex === MATCHDAYS.length - 1}
        >
          <Ionicons name="chevron-forward" size={20} color={dayIndex === MATCHDAYS.length - 1 ? '#4D8060' : C.onPitch} />
        </TouchableOpacity>
      </View>

      {/* Progress (nur wenn tippbare Spiele vorhanden) */}
      {total > 0 && (
        <View style={s.progressRow}>
          <View style={s.progressBar}>
            <View style={[s.progressFill, { width: `${(tipped / total) * 100}%` }]} />
          </View>
          <Text style={s.progressLabel}>
            {allDone ? '✓ Alle Tipps gesetzt' : `${tipped} / ${total} tippbar`}
          </Text>
        </View>
      )}

      {/* Testspieltag-Legende */}
      {matchday.isTest && (
        <View style={s.legendRow}>
          <View style={s.legendItem}><View style={[s.legendDot, { backgroundColor: '#6B7280' }]} /><Text style={s.legendText}>Kein Tipp</Text></View>
          <View style={s.legendItem}><View style={[s.legendDot, { backgroundColor: C.wrong }]} /><Text style={s.legendText}>Falsch</Text></View>
          <View style={s.legendItem}><View style={[s.legendDot, { backgroundColor: C.correct }]} /><Text style={s.legendText}>Richtig</Text></View>
        </View>
      )}

      {/* Spielliste */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>
        {matchday.games.map((game) => {
          const tip    = dayTips[game.id];
          const locked = isGameLocked(game.dateISO, game.time);
          const state  = getGameState(game, tip, locked);
          const disp   = formatDisplayDate(game.dateISO);
          return (
            <GameCard
              key={game.id}
              game={game}
              tip={tip}
              state={state}
              displayDate={disp}
              onPress={(team) => handleTip(game.id, team, locked, !!game.result)}
            />
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
              Du hast alle Tipps für {matchday.label} gesetzt.{'\n'}
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

// ─── GameCard ─────────────────────────────────────────────────────────────────
function GameCard({ game, tip, state, displayDate, onPress }) {
  const hasResult = state === 'correct' || state === 'wrong';
  // Alle Spiele, die nicht mehr aktiv tippbar sind, gelten als gesperrt
  const isLocked  = state !== 'empty' && state !== 'saved';

  const cardStyle = [
    s.card,
    state === 'correct'      && s.cardCorrect,
    state === 'wrong'        && s.cardWrong,
    (state === 'locked' || state === 'locked_no_tip' || state === 'locked_saved') && s.cardLocked,
  ];

  return (
    <View style={cardStyle}>
      {/* Obere Zeile: Datum | Score | Uhrzeit */}
      <View style={s.cardTop}>
        <Text style={[s.topDate, isLocked && s.topDateLocked]}>
          {displayDate}
        </Text>
        <ScoreBadge game={game} />
        <View style={s.topRight}>
          <Text style={[s.topTime, isLocked && s.topTimeLocked]}>{game.time} Uhr</Text>
          {isLocked && (
            <View style={s.lockRow}>
              <Ionicons name="lock-closed" size={10} color={C.lockedText} />
              <Text style={s.lockText}>Gesperrt</Text>
            </View>
          )}
        </View>
      </View>

      {/* Team-Buttons */}
      <View style={s.teamsRow}>
        <TeamButton side="A" game={game} tip={tip} state={state} onPress={() => onPress('A')} />
        <TeamButton side="B" game={game} tip={tip} state={state} onPress={() => onPress('B')} />
      </View>

      {/* Ergebnis-Badge */}
      {hasResult && (
        <ResultBadge state={state} tip={tip} game={game} />
      )}
    </View>
  );
}

// ─── ScoreBadge ───────────────────────────────────────────────────────────────
function ScoreBadge({ game }) {
  const hasScore = game.score != null;
  return (
    <View style={s.scoreBadge}>
      {hasScore ? (
        <Text style={s.scoreText}>{game.score.home} : {game.score.away}</Text>
      ) : (
        <Text style={s.scorePlaceholder}>– : –</Text>
      )}
    </View>
  );
}

// ─── TeamButton ───────────────────────────────────────────────────────────────
// Regel: Nur der vom Spieler gewählte Button bekommt Farbe.
// Alle anderen Buttons bleiben im neutralen "gesperrt"-Stil.
function TeamButton({ side, game, tip, state, onPress }) {
  const isMyPick  = tip === side;
  const hasResult = state === 'correct' || state === 'wrong';
  const isLocked  = state !== 'empty' && state !== 'saved';

  let btnStyle  = [s.teamBtn];
  let nameStyle = [s.teamName];
  let oddsStyle = [s.oddsText];
  let icon      = null;

  if (hasResult && isMyPick) {
    if (state === 'correct') {
      btnStyle  = [s.teamBtn, s.teamBtnCorrect];
      nameStyle = [s.teamName, s.teamNameCorrect];
      oddsStyle = [s.oddsText, s.oddsCorrect];
      icon      = <Ionicons name="checkmark-circle" size={13} color={C.correct} style={s.btnIcon} />;
    } else {
      btnStyle  = [s.teamBtn, s.teamBtnWrong];
      nameStyle = [s.teamName, s.teamNameWrong];
      oddsStyle = [s.oddsText, s.oddsWrong];
      icon      = <Ionicons name="close-circle" size={13} color={C.wrong} style={s.btnIcon} />;
    }
  } else if (isLocked) {
    // Alle nicht-gewählten Buttons + gesperrte ohne Tipp: neutrales gedimmtes Grün
    btnStyle  = [s.teamBtn, s.teamBtnLocked];
    nameStyle = [s.teamName, s.teamNameLocked];
    oddsStyle = [s.oddsText, s.oddsLocked];
  } else if (state === 'saved' && isMyPick) {
    btnStyle  = [s.teamBtn, s.teamBtnSaved];
    nameStyle = [s.teamName, s.teamNameSaved];
    oddsStyle = [s.oddsText, s.oddsSaved];
    icon      = <Ionicons name="bookmark" size={12} color={C.saved} style={s.btnIcon} />;
  } else if (state === 'saved' && !isMyPick) {
    btnStyle  = [s.teamBtn, s.teamBtnDimmed];
    nameStyle = [s.teamName, s.teamNameLocked];
  }

  return (
    <TouchableOpacity
      style={btnStyle}
      onPress={onPress}
      activeOpacity={isLocked || hasResult ? 1 : 0.7}
    >
      {icon}
      <Text style={nameStyle}>{side === 'A' ? game.teamA : game.teamB}</Text>
      <View style={s.oddsBadge}>
        <Text style={oddsStyle}>{(side === 'A' ? game.oddsA : game.oddsB).toFixed(1)}</Text>
      </View>
    </TouchableOpacity>
  );
}

// ─── ResultBadge ──────────────────────────────────────────────────────────────
function ResultBadge({ state, tip, game }) {
  const correct = state === 'correct';
  return (
    <View style={s.resultBadge}>
      <Ionicons
        name={correct ? 'checkmark-circle' : 'close-circle'}
        size={14}
        color={C.lockedText}
      />
      <Text style={s.resultText}>
        {correct
          ? `Richtig! +${(tip === 'A' ? game.oddsA : game.oddsB).toFixed(1)} Punkte`
          : `Falsch — ${game.result === 'A' ? game.teamA : game.teamB} hat gewonnen`
        }
      </Text>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  container:     { flex: 1, backgroundColor: C.bg },

  toast: {
    position: 'absolute', top: 14, alignSelf: 'center', zIndex: 99,
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: '#EFF6FF', borderWidth: 1, borderColor: '#93C5FD',
    paddingVertical: 8, paddingHorizontal: 14, borderRadius: 20,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1, shadowRadius: 6, elevation: 4,
  },
  toastText:     { color: C.saved, fontSize: 13, fontWeight: '600' },

  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingTop: 16, paddingBottom: 14,
  },
  navBtn: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center', justifyContent: 'center',
  },
  navBtnDisabled:  { opacity: 0.3 },
  headerCenter:    { alignItems: 'center' },
  dayLabel:        { color: C.onPitch, fontSize: 18, fontWeight: '800' },
  dayDate:         { color: C.onPitchSec, fontSize: 12, marginTop: 2 },

  progressRow:     { paddingHorizontal: 16, paddingBottom: 14, gap: 6 },
  progressBar:     { height: 4, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 2 },
  progressFill:    { height: '100%', backgroundColor: C.accent, borderRadius: 2 },
  progressLabel:   { color: C.onPitchSec, fontSize: 12 },

  legendRow: {
    flexDirection: 'row', gap: 16, paddingHorizontal: 16,
    paddingBottom: 10, justifyContent: 'center',
  },
  legendItem:      { flexDirection: 'row', alignItems: 'center', gap: 5 },
  legendDot:       { width: 8, height: 8, borderRadius: 4 },
  legendText:      { color: C.onPitchSec, fontSize: 11 },

  scroll:          { paddingHorizontal: 14, paddingTop: 4, gap: 10 },

  // ── Card states ──
  card: {
    backgroundColor: C.card, borderRadius: 14, padding: 14,
    borderWidth: 1.5, borderColor: C.border,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08, shadowRadius: 6, elevation: 3,
  },
  // Alle abgeschlossenen Spiele: einheitliches gedimmtes Grün
  cardLocked:  { backgroundColor: C.lockedCard, borderColor: C.lockedBorder },
  cardCorrect: { backgroundColor: C.lockedCard, borderColor: C.lockedBorder },
  cardWrong:   { backgroundColor: C.lockedCard, borderColor: C.lockedBorder },

  // ── Card top row ──
  cardTop:         { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  topDate:         { color: C.text, fontWeight: '700', fontSize: 12, flex: 1 },
  topDateLocked:   { color: C.lockedText },
  topRight:        { flex: 1, alignItems: 'flex-end', gap: 2 },
  topTime:         { color: C.textSec, fontWeight: '600', fontSize: 12 },
  topTimeLocked:   { color: C.lockedText },
  lockRow:         { flexDirection: 'row', alignItems: 'center', gap: 3 },
  lockText:        { color: C.lockedText, fontSize: 10, fontWeight: '600' },

  // ── Score badge ── neutral für alle Spielkarten
  scoreBadge: {
    backgroundColor: C.lockedBtn, borderRadius: 8,
    paddingVertical: 4, paddingHorizontal: 12, minWidth: 64, alignItems: 'center',
  },
  scoreText:        { color: C.text, fontSize: 15, fontWeight: '800' },
  scorePlaceholder: { color: C.lockedText, fontSize: 14, fontWeight: '700' },

  // ── Teams row ──
  teamsRow:          { flexDirection: 'row', gap: 8 },

  // ── Team button base ──
  teamBtn: {
    flex: 1, borderRadius: 10, borderWidth: 1.5, borderColor: C.border,
    backgroundColor: '#E8F5EC',
    paddingVertical: 12, paddingHorizontal: 8,
    alignItems: 'center', gap: 5, minHeight: 66, justifyContent: 'center',
  },
  // Gesperrt (kein Tipp / nicht gewählt): gedimmtes einheitliches Grün
  teamBtnLocked:   { borderColor: C.lockedBorder, backgroundColor: C.lockedBtn },
  teamBtnDimmed:   { borderColor: C.lockedBorder, backgroundColor: C.lockedBtn },
  // Tipp gespeichert → blau
  teamBtnSaved:    { borderColor: C.savedBorder,  backgroundColor: C.savedBg },
  // Ergebnis richtig → grün (wie Legende)
  teamBtnCorrect:  { borderColor: C.correctBorder, backgroundColor: C.correctBg },
  // Ergebnis falsch → rot (wie Legende)
  teamBtnWrong:    { borderColor: C.wrongBorder,   backgroundColor: C.wrongBg },

  btnIcon:          { position: 'absolute', top: 5, right: 5 },

  teamName:         { color: C.text,       fontSize: 12, fontWeight: '700', textAlign: 'center' },
  teamNameSaved:    { color: C.saved },
  teamNameCorrect:  { color: C.correct },
  teamNameWrong:    { color: C.wrong },
  teamNameLocked:   { color: C.lockedText },

  oddsBadge:        { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 5, backgroundColor: 'rgba(0,0,0,0.06)' },
  oddsText:         { color: C.textMuted, fontSize: 11, fontWeight: '700' },
  oddsSaved:        { color: C.saved },
  oddsCorrect:      { color: C.correct },
  oddsWrong:        { color: C.wrong },
  oddsLocked:       { color: C.lockedText },

  // ── Result badge — einheitliche gedimmte Grünfarbe wie Datum/Uhrzeit ──
  resultBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    marginTop: 10, paddingVertical: 6, paddingHorizontal: 10,
    borderRadius: 8, backgroundColor: C.lockedBtn,
  },
  resultText: { color: C.lockedText, fontSize: 12, fontWeight: '600' },

  // ── Modal ──
  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center', justifyContent: 'center', padding: 32,
  },
  modalCard: {
    backgroundColor: C.card, borderRadius: 20, padding: 28,
    width: '100%', alignItems: 'center', gap: 10,
    shadowColor: '#000', shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2, shadowRadius: 20, elevation: 10,
  },
  modalEmoji:      { fontSize: 48 },
  modalTitle:      { color: C.green900, fontSize: 22, fontWeight: '800', textAlign: 'center' },
  modalSub:        { color: C.textSec, fontSize: 14, textAlign: 'center', lineHeight: 21 },
  modalBtn: {
    marginTop: 8, backgroundColor: C.green700, borderRadius: 12,
    paddingVertical: 14, paddingHorizontal: 24, width: '100%',
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
  },
  modalBtnText:    { color: '#fff', fontSize: 15, fontWeight: '700' },
  modalBtnGhost:   { paddingVertical: 10 },
  modalBtnGhostText: { color: C.textMuted, fontSize: 14 },
});
