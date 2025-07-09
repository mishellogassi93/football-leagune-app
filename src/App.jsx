import React from "react";
import axios from "axios";
import LeagueSelector from "./Components/LeagueSelector";
import NavButtons from "./Components/NavButtons";
import Standings from "./Components/Standings";
import MatchHistory from "./Components/MatchHistory";
import TopScorers from "./Components/TopScorers";
import Stats from "./Components/Stats";
import "./App.css";
const API_BASE = "https://app.seker.live/fm1";

class App extends React.Component {
    state = {
        leagues: [],
        selectedLeague: null,
        teams: [],
        standings: [],
        selectedTeamId: null,
        teamPlayers: [],
        teamHistory: [],
        matches: [],
        roundMin: 1,
        roundMax: 1,
        scorerTable: [],
        stats: {},
        page: "standings",
    };

    componentDidMount() {
        this.fetchLeagues();
    }

    fetchLeagues = async () => {
        const res = await axios.get(`${API_BASE}/leagues`);
        this.setState({ leagues: res.data });
    };

    handleLeagueChange = async (e) => {
        const leagueId = e.target.value;
        this.setState({ selectedLeague: leagueId, selectedTeamId: null });
        const [teamsRes, historyRes] = await Promise.all([
            axios.get(`${API_BASE}/teams/${leagueId}`),
            axios.get(`${API_BASE}/history/${leagueId}`),
        ]);

        const teams = teamsRes.data || [];
        const matches = historyRes.data || [];

        this.setState({
            teams,
            matches,
            roundMax: Math.max(...matches.map((m) => m.round)) || 1,
        });

        if (matches.length > 0 && teams.length > 0) {
            this.calculateStandings(matches || [], teams || []);
            this.calculateTopScorers(matches);
            this.calculateStats(matches);
        } else {
            console.warn("לא הועברו נתוני משחקים או קבוצות, חישוב הטבלאות לא בוצע.");
        }
    };
    calculateStandings = (matches, teams) => {
        const teamStats = {};

        teams.forEach((team) => {
            teamStats[team.id] = {
                id: team.id,
                name: team.name,
                points: 0,
                scored: 0,
                conceded: 0,
            };
        });

        // מעבר על כל משחק
        matches.forEach((match) => {
            const { homeTeam, awayTeam, goals } = match;

            let homeGoals = 0;
            let awayGoals = 0;

            // חישוב כמות הגולים לפי מערך goals
            goals?.forEach((g) => {
                if (g.home) homeGoals++;
                else awayGoals++;
            });

            // עדכון שערים לקבוצות
            teamStats[homeTeam.id].scored += homeGoals;
            teamStats[homeTeam.id].conceded += awayGoals;

            teamStats[awayTeam.id].scored += awayGoals;
            teamStats[awayTeam.id].conceded += homeGoals;

            // עדכון ניקוד
            if (homeGoals > awayGoals) {
                teamStats[homeTeam.id].points += 3;
            } else if (homeGoals < awayGoals) {
                teamStats[awayTeam.id].points += 3;
            } else {
                teamStats[homeTeam.id].points += 1;
                teamStats[awayTeam.id].points += 1;
            }
        });

        // יצירת טבלת ליגה עם חישוב הפרש שערים
        const standings = Object.values(teamStats).map((team) => ({
            ...team,
            diff: team.scored - team.conceded,
        }));

        // מיון לפי נקודות -> הפרש שערים -> שם קבוצה
        standings.sort((a, b) => {
            if (b.points !== a.points) return b.points - a.points;
            if (b.diff !== a.diff) return b.diff - a.diff;
            return a.name.localeCompare(b.name);
        });

        this.setState({ standings });
    };

    calculateTopScorers = (matches) => {
        const playerGoals = {};
        const playerNames = {};

        matches.forEach((match) => {
            match.goals?.forEach((goal) => {
                const playerId = goal.scorer?.id;
                const playerName = `${goal.scorer?.firstName ?? ""} ${goal.scorer?.lastName ?? ""}`.trim();

                if (!playerId) return;

                playerGoals[playerId] = (playerGoals[playerId] || 0) + 1;
                playerNames[playerId] = playerName;
            });
        });

        const top = Object.entries(playerGoals)
            .sort(([, goalsA], [, goalsB]) => goalsB - goalsA)
            .slice(0, 3)
            .map(([id, goals]) => ({
                name: playerNames[id],
                goals,
            }));

        this.setState({ scorerTable: top });
    }

    calculateStats = (matches) => {
        let firstHalf = 0,
            secondHalf = 0,
            minGoal = Infinity,
            maxGoal = -Infinity,
            roundGoals = {};
        matches.forEach((m) => {
            const goals = m.goals || [];

            goals.forEach((g) => {
                if (g.minute <= 45) firstHalf++;
                else secondHalf++;
                minGoal = Math.min(minGoal, g.minute);
                maxGoal = Math.max(maxGoal, g.minute);
            });
            const goalsInMatch = goals.length;
            roundGoals[m.round] = (roundGoals[m.round] || 0) + goalsInMatch
        });

        const sortedRounds = Object.entries(roundGoals).sort((a, b) => b[1] - a[1]);
        const mostGoalsRound = sortedRounds[0]?.[0] || "-";
        const leastGoalsRound = sortedRounds[sortedRounds.length - 1]?.[0] || "-";

        this.setState({
            stats: {
                firstHalf,
                secondHalf,
                minGoal: isFinite(minGoal) ? minGoal : "-",
                maxGoal: isFinite(maxGoal) ? maxGoal : "-",
                mostGoalsRound,
                leastGoalsRound,
            },
        });
    };
    handleTeamClick = async (teamId) => {
        const { selectedLeague } = this.state;

        if (teamId === null) {
            this.setState({
                selectedTeamId: null,
                teamPlayers: [],
                teamHistory: [],
            });
            return;
        }

        try {
            const [squadRes, historyRes] = await Promise.all([
                axios.get(`${API_BASE}/squad/${selectedLeague}/${teamId}`),
                axios.get(`${API_BASE}/history/${selectedLeague}/${teamId}`),
            ]);

            this.setState({
                selectedTeamId: teamId,
                teamPlayers: squadRes.data,
                teamHistory: historyRes.data,
            });
        } catch (error) {
            console.error("⚠️ שגיאה בקבלת נתוני קבוצה:", error);
        }
    };

    render() {
        const {
            leagues,
            selectedLeague,
            standings,
            selectedTeamId,
            teamPlayers,
            teamHistory,
            matches,
            roundMin,
            roundMax,
            scorerTable,
            stats,
            page,
        } = this.state;

        return (
            <div className="App">
                <h1 className="app-title">M.L Football Info App</h1>

                <LeagueSelector
                    leagues={leagues}
                    selectedLeague={selectedLeague}
                    onChange={this.handleLeagueChange}
                />

                <NavButtons onPageChange={(page) => this.setState({ page })} />

                {page === "standings" && (
                    <Standings
                        standings={standings}
                        selectedTeamId={selectedTeamId}
                        selectedTeamName={this.state.selectedTeamName}
                        teamPlayers={teamPlayers}
                        teamHistory={teamHistory}
                        onTeamClick={this.handleTeamClick}
                    />
                )}

                {page === "history" && (
                    <MatchHistory
                        matches={matches}
                        roundMin={roundMin}
                        roundMax={roundMax}
                        onRangeChange={(min, max) => this.setState({ roundMin: min, roundMax: max })}
                    />
                )}

                {page === "scorers" && <TopScorers scorers={scorerTable} />}
                {page === "stats" && <Stats stats={stats} />}
            </div>
        );
    }
}

export default App;
