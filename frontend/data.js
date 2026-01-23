(() => {
  const teamNames = [
    "Los Tigres",
    "Atl Central",
    "Maristas FC",
    "Northside",
    "Union FC",
    "Ciudad Sur",
    "Rivergate",
    "Blue Harbor",
    "Redwood",
    "Pacifico",
    "Rangers",
    "Storm",
    "Highland",
    "Atlas",
    "Orion",
    "Lakeside",
    "Eagles",
    "Falcons",
    "Knights",
    "Lions",
    "Santos",
    "Vanguard",
    "Celtic",
    "Phoenix"
  ];
  const firstNames = [
    "Liam",
    "Noah",
    "Ethan",
    "Lucas",
    "Mateo",
    "Mason",
    "Leo",
    "Owen",
    "Aiden",
    "Julian",
    "Ezra",
    "Axel"
  ];
  const lastNames = [
    "Rivera",
    "Silva",
    "Torres",
    "Vega",
    "Santos",
    "Reyes",
    "Morales",
    "Lopez",
    "Castro",
    "Gomez",
    "Diaz",
    "Navarro"
  ];
  const positions = ["GK", "DF", "DF", "DF", "MF", "MF", "MF", "FW", "FW", "FW", "MF", "DF"];
  const pointsOrder = [7, 6, 6, 5, 4, 4, 3, 3, 2, 1, 1, 0];

  const slugify = name =>
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

  function recordFromPoints(points) {
    switch (points) {
      case 7:
        return { wins: 2, draws: 1, losses: 0 };
      case 6:
        return { wins: 2, draws: 0, losses: 1 };
      case 5:
        return { wins: 1, draws: 2, losses: 0 };
      case 4:
        return { wins: 1, draws: 1, losses: 1 };
      case 3:
        return { wins: 1, draws: 0, losses: 2 };
      case 2:
        return { wins: 0, draws: 2, losses: 1 };
      case 1:
        return { wins: 0, draws: 1, losses: 2 };
      default:
        return { wins: 0, draws: 0, losses: 3 };
    }
  }

  const teams = [];
  const players = [];
  const zones = ["Zone A", "Zone B"].map((zoneName, zoneIndex) => {
    const zoneTeams = [];
    for (let i = 0; i < 12; i += 1) {
      const teamIndex = zoneIndex * 12 + i;
      const name = teamNames[teamIndex];
      const id = slugify(name);
      const points = pointsOrder[i];
      const record = recordFromPoints(points);
      const goalsFor = 4 + (teamIndex % 5) * 2;
      const goalsAgainst = 2 + (teamIndex % 4) * 2;
      const teamPlayers = [];

      for (let p = 0; p < 12; p += 1) {
        const first = firstNames[(p + teamIndex) % firstNames.length];
        const last = lastNames[(p * 2 + teamIndex) % lastNames.length];
        const position = positions[p];
        const baseGoals = p % 4;
        const goals = baseGoals + (teamIndex % 3) + (position === "FW" ? 2 : 0);
        const assists = (p % 3) + (teamIndex % 2);
        const apps = 1 + (p % 3);
        const minutes = apps * 90;
        const yellow = (p + teamIndex) % 3;
        const red = p % 9 === 0 ? 1 : 0;
        const blue = p % 7 === 0 ? 1 : 0;
        const player = {
          id: `${id}-p${p + 1}`,
          name: `${first} ${last}`,
          teamId: id,
          teamName: name,
          position,
          stats: {
            goals,
            assists,
            apps,
            minutes,
            yellow,
            red,
            blue,
            cards: yellow + red + blue
          }
        };
        teamPlayers.push(player);
        players.push(player);
      }

      const team = {
        id,
        name,
        zone: zoneName,
        points,
        played: 3,
        wins: record.wins,
        draws: record.draws,
        losses: record.losses,
        goalsFor,
        goalsAgainst,
        players: teamPlayers
      };
      zoneTeams.push(team);
      teams.push(team);
    }
    return { name: zoneName, teams: zoneTeams };
  });

  const baseDate = new Date("2026-04-10T00:00:00");
  const toDateString = date => date.toISOString().slice(0, 10);

  const results = zones.flatMap((zone, zoneIndex) => {
    const zoneResults = [];
    for (let i = 0; i < zone.teams.length; i += 2) {
      const home = zone.teams[i];
      const away = zone.teams[i + 1];
      const homeScore = 1 + ((i + home.name.length) % 3);
      const awayScore = (i + away.name.length) % 3;
      const shotsHome = 8 + ((i + zoneIndex) % 6);
      const shotsAway = 6 + ((i + zoneIndex * 2) % 5);
      const xgHome = (homeScore + shotsHome / 10).toFixed(1);
      const xgAway = (awayScore + shotsAway / 10).toFixed(1);
      const possessionHome = 48 + ((i + zoneIndex) % 7);
      const possessionAway = 100 - possessionHome;
      const yellowHome = (i + zoneIndex) % 3;
      const yellowAway = (i + zoneIndex + 1) % 3;
      const redHome = i % 5 === 0 ? 1 : 0;
      const redAway = i % 7 === 0 ? 1 : 0;
      const blueHome = i % 4 === 0 ? 1 : 0;
      const blueAway = i % 6 === 0 ? 1 : 0;
      const matchId = `${slugify(home.name)}-vs-${slugify(away.name)}-md3-${zoneIndex + 1}-${i / 2 + 1}`;
      const matchDate = new Date(baseDate);
      zoneResults.push({
        id: matchId,
        zone: zone.name,
        home: home.name,
        away: away.name,
        homeScore,
        awayScore,
        matchday: 3,
        status: "final",
        date: toDateString(matchDate),
        stats: {
          shotsHome,
          shotsAway,
          xgHome,
          xgAway,
          possessionHome,
          possessionAway,
          yellowHome,
          yellowAway,
          redHome,
          redAway,
          blueHome,
          blueAway
        }
      });
    }
    return zoneResults;
  });

  function buildUpcomingFixtures(matchday, offset) {
    return zones.flatMap((zone, zoneIndex) => {
      const fixtures = [];
      const teamsInZone = zone.teams;
      for (let i = 0; i < teamsInZone.length; i += 2) {
        const home = teamsInZone[(i + offset + zoneIndex) % teamsInZone.length];
        const away = teamsInZone[(i + 1 + offset + zoneIndex) % teamsInZone.length];
        const matchId = `${slugify(home.name)}-vs-${slugify(away.name)}-md${matchday}-${zoneIndex + 1}-${i / 2 + 1}`;
        const matchDate = new Date(baseDate);
        matchDate.setDate(baseDate.getDate() + (matchday - 3) * 7);
        fixtures.push({
          id: matchId,
          zone: zone.name,
          home: home.name,
          away: away.name,
          homeScore: null,
          awayScore: null,
          matchday,
          status: "scheduled",
          date: toDateString(matchDate),
          stats: {
            shotsHome: 0,
            shotsAway: 0,
            xgHome: "0.0",
            xgAway: "0.0",
            possessionHome: 50,
            possessionAway: 50,
            yellowHome: 0,
            yellowAway: 0,
            redHome: 0,
            redAway: 0,
            blueHome: 0,
            blueAway: 0
          }
        });
      }
      return fixtures;
    });
  }

  const upcomingFixtures = [
    ...buildUpcomingFixtures(4, 1),
    ...buildUpcomingFixtures(5, 3)
  ];

  const tournament = {
    name: "Papi Futbol 2026",
    matchday: 3,
    zones,
    teams,
    players,
    results,
    matches: [...results, ...upcomingFixtures]
  };

  const getTeamById = id => teams.find(team => team.id === id);
  const getPlayerById = id => players.find(player => player.id === id);
  const getTopScorer = team =>
    team.players.reduce((top, player) =>
      player.stats.goals > top.stats.goals ? player : top
    );
  const getMatchById = id => tournament.matches.find(match => match.id === id);
  const getMatchesForTeam = teamName =>
    tournament.matches.filter(match => match.home === teamName || match.away === teamName);

  window.StatlineData = {
    tournament,
    getTeamById,
    getPlayerById,
    getTopScorer,
    getMatchById,
    getMatchesForTeam
  };
})();
