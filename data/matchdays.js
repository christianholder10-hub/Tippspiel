// Platzhalter-Daten — wird später durch WM-API + Wettquoten-API ersetzt

const TIMES = ['15:00', '18:00', '21:00'];
const DATES = [
  '14. Jun', '15. Jun', '16. Jun', '17. Jun', '18. Jun',
  '19. Jun', '20. Jun', '21. Jun', '22. Jun', '23. Jun',
];

const TEAM_PAIRS = [
  ['Team A', 'Team B'], ['Team C', 'Team D'], ['Team E', 'Team F'],
  ['Team G', 'Team H'], ['Team I', 'Team J'], ['Team K', 'Team L'],
  ['Team M', 'Team N'], ['Team O', 'Team P'], ['Team Q', 'Team R'],
  ['Team S', 'Team T'],
];

export const MATCHDAYS = Array.from({ length: 10 }, (_, di) => ({
  id: di + 1,
  label: `Spieltag ${di + 1}`,
  date: DATES[di],
  games: TEAM_PAIRS.map(([teamA, teamB], gi) => ({
    id: gi + 1,
    teamA,
    teamB,
    // Platzhalter-Quote — später von Wettbüro-API
    oddsA: 2.0,
    oddsB: 2.0,
    date: DATES[di],
    time: TIMES[gi % 3],
  })),
}));
