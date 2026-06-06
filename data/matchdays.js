// Reale WM 2026 Daten — Quelle: sportschau.de
// oddsA / oddsB = Platzhalter 2.0 — wird später durch Wettbüro-API ersetzt

export function isGameLocked(dateISO, time) {
  return new Date() >= new Date(`${dateISO}T${time}:00`);
}

export function formatDisplayDate(dateISO) {
  const [y, m, d] = dateISO.split('-');
  const months = ['Jan','Feb','Mär','Apr','Mai','Jun','Jul','Aug','Sep','Okt','Nov','Dez'];
  return `${parseInt(d)}. ${months[parseInt(m) - 1]}`;
}

export const MATCHDAYS = [
  {
    id: 1,
    label: 'Gruppenspieltag 1',
    dateRange: '11. – 18. Jun',
    games: [
      { id:  1, teamA: 'Mexiko',              teamB: 'Südafrika',          oddsA: 2.0, oddsB: 2.0, dateISO: '2026-06-11', time: '21:00' },
      { id:  2, teamA: 'Südkorea',            teamB: 'Tschechien',         oddsA: 2.0, oddsB: 2.0, dateISO: '2026-06-12', time: '04:00' },
      { id:  3, teamA: 'Kanada',              teamB: 'Bosnien-Herzegowina',oddsA: 2.0, oddsB: 2.0, dateISO: '2026-06-12', time: '21:00' },
      { id:  4, teamA: 'USA',                 teamB: 'Paraguay',           oddsA: 2.0, oddsB: 2.0, dateISO: '2026-06-13', time: '03:00' },
      { id:  5, teamA: 'Katar',               teamB: 'Schweiz',            oddsA: 2.0, oddsB: 2.0, dateISO: '2026-06-13', time: '21:00' },
      { id:  6, teamA: 'Brasilien',           teamB: 'Marokko',            oddsA: 2.0, oddsB: 2.0, dateISO: '2026-06-14', time: '00:00' },
      { id:  7, teamA: 'Haiti',               teamB: 'Schottland',         oddsA: 2.0, oddsB: 2.0, dateISO: '2026-06-14', time: '03:00' },
      { id:  8, teamA: 'Australien',          teamB: 'Türkei',             oddsA: 2.0, oddsB: 2.0, dateISO: '2026-06-14', time: '06:00' },
      { id:  9, teamA: 'Deutschland',         teamB: 'Curaçao',            oddsA: 2.0, oddsB: 2.0, dateISO: '2026-06-14', time: '19:00' },
      { id: 10, teamA: 'Niederlande',         teamB: 'Japan',              oddsA: 2.0, oddsB: 2.0, dateISO: '2026-06-14', time: '22:00' },
      { id: 11, teamA: 'Elfenbeinküste',      teamB: 'Ecuador',            oddsA: 2.0, oddsB: 2.0, dateISO: '2026-06-15', time: '01:00' },
      { id: 12, teamA: 'Schweden',            teamB: 'Tunesien',           oddsA: 2.0, oddsB: 2.0, dateISO: '2026-06-15', time: '04:00' },
      { id: 13, teamA: 'Spanien',             teamB: 'Kap Verde',          oddsA: 2.0, oddsB: 2.0, dateISO: '2026-06-15', time: '18:00' },
      { id: 14, teamA: 'Belgien',             teamB: 'Ägypten',            oddsA: 2.0, oddsB: 2.0, dateISO: '2026-06-15', time: '21:00' },
      { id: 15, teamA: 'Saudi-Arabien',       teamB: 'Uruguay',            oddsA: 2.0, oddsB: 2.0, dateISO: '2026-06-16', time: '00:00' },
      { id: 16, teamA: 'Iran',                teamB: 'Neuseeland',         oddsA: 2.0, oddsB: 2.0, dateISO: '2026-06-16', time: '03:00' },
      { id: 17, teamA: 'Frankreich',          teamB: 'Senegal',            oddsA: 2.0, oddsB: 2.0, dateISO: '2026-06-16', time: '21:00' },
      { id: 18, teamA: 'Irak',               teamB: 'Norwegen',           oddsA: 2.0, oddsB: 2.0, dateISO: '2026-06-17', time: '00:00' },
      { id: 19, teamA: 'Argentinien',         teamB: 'Algerien',           oddsA: 2.0, oddsB: 2.0, dateISO: '2026-06-17', time: '03:00' },
      { id: 20, teamA: 'Österreich',          teamB: 'Jordanien',          oddsA: 2.0, oddsB: 2.0, dateISO: '2026-06-17', time: '06:00' },
      { id: 21, teamA: 'Portugal',            teamB: 'DR Kongo',           oddsA: 2.0, oddsB: 2.0, dateISO: '2026-06-17', time: '19:00' },
      { id: 22, teamA: 'England',             teamB: 'Kroatien',           oddsA: 2.0, oddsB: 2.0, dateISO: '2026-06-17', time: '22:00' },
      { id: 23, teamA: 'Ghana',               teamB: 'Panama',             oddsA: 2.0, oddsB: 2.0, dateISO: '2026-06-18', time: '01:00' },
      { id: 24, teamA: 'Usbekistan',          teamB: 'Kolumbien',          oddsA: 2.0, oddsB: 2.0, dateISO: '2026-06-18', time: '04:00' },
    ],
  },
  {
    id: 2,
    label: 'Gruppenspieltag 2',
    dateRange: '19. – 26. Jun',
    games: Array.from({ length: 24 }, (_, i) => ({
      id: i + 1,
      teamA: `Gruppe ${String.fromCharCode(65 + Math.floor(i / 2))} Team 1`,
      teamB: `Gruppe ${String.fromCharCode(65 + Math.floor(i / 2))} Team 3`,
      oddsA: 2.0, oddsB: 2.0,
      dateISO: `2026-06-${19 + Math.floor(i / 3)}`,
      time: ['15:00', '18:00', '21:00'][i % 3],
    })),
  },
  {
    id: 3,
    label: 'Gruppenspieltag 3',
    dateRange: '27. Jun – 4. Jul',
    games: Array.from({ length: 24 }, (_, i) => ({
      id: i + 1,
      teamA: `Gruppe ${String.fromCharCode(65 + Math.floor(i / 2))} Team 1`,
      teamB: `Gruppe ${String.fromCharCode(65 + Math.floor(i / 2))} Team 4`,
      oddsA: 2.0, oddsB: 2.0,
      dateISO: `2026-06-${27 + Math.floor(i / 4)}`,
      time: ['15:00', '18:00', '21:00'][i % 3],
    })),
  },
  {
    id: 4,
    label: 'Sechzehntelfinale',
    dateRange: '6. – 9. Jul',
    games: Array.from({ length: 16 }, (_, i) => ({
      id: i + 1,
      teamA: `Sieger Gruppe ${String.fromCharCode(65 + i * 2 % 12)}`,
      teamB: `2. Platz Gruppe ${String.fromCharCode(66 + i * 2 % 12)}`,
      oddsA: 2.0, oddsB: 2.0,
      dateISO: `2026-07-0${6 + Math.floor(i / 4)}`,
      time: ['15:00', '19:00', '22:00', '02:00'][i % 4],
    })),
  },
  {
    id: 5,
    label: 'Achtelfinale',
    dateRange: '10. – 13. Jul',
    games: Array.from({ length: 8 }, (_, i) => ({
      id: i + 1,
      teamA: `Sieger Spiel ${i * 2 + 1}`,
      teamB: `Sieger Spiel ${i * 2 + 2}`,
      oddsA: 2.0, oddsB: 2.0,
      dateISO: `2026-07-${10 + Math.floor(i / 2)}`,
      time: ['18:00', '22:00'][i % 2],
    })),
  },
  {
    id: 6,
    label: 'Viertelfinale',
    dateRange: '14. – 15. Jul',
    games: Array.from({ length: 4 }, (_, i) => ({
      id: i + 1,
      teamA: `Sieger AF ${i * 2 + 1}`,
      teamB: `Sieger AF ${i * 2 + 2}`,
      oddsA: 2.0, oddsB: 2.0,
      dateISO: `2026-07-${14 + Math.floor(i / 2)}`,
      time: i % 2 === 0 ? '18:00' : '22:00',
    })),
  },
  {
    id: 7,
    label: 'Halbfinale',
    dateRange: '18. – 19. Jul',
    games: [
      { id: 1, teamA: 'Sieger VF 1', teamB: 'Sieger VF 2', oddsA: 2.0, oddsB: 2.0, dateISO: '2026-07-18', time: '21:00' },
      { id: 2, teamA: 'Sieger VF 3', teamB: 'Sieger VF 4', oddsA: 2.0, oddsB: 2.0, dateISO: '2026-07-19', time: '21:00' },
    ],
  },
  {
    id: 8,
    label: 'Finale',
    dateRange: '19. Jul',
    games: [
      { id: 1, teamA: 'Sieger HF 1', teamB: 'Sieger HF 2', oddsA: 2.0, oddsB: 2.0, dateISO: '2026-07-19', time: '21:00' },
    ],
  },
];
