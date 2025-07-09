import React from "react";

const Standings = ({
                       standings,
                       onTeamClick,
                       selectedTeamId,
                       teamPlayers,
                       teamHistory,
                   }) => {
    const selectedTeam = standings.find((t) => t.id === selectedTeamId);
    return (
        <div className="standings">
            <h2>League Teams</h2>
            <table>
                <thead>
                <tr>
                    <th>#</th>
                    <th>Team</th>
                    <th>Points</th>
                    <th>Goal Diff</th>
                </tr>
                </thead>
                <tbody>
                {standings.map((team, idx) => (
                    <tr
                        key={team.id}
                        className={
                            idx === 0
                                ? "first-place"
                                : idx >= standings.length - 3
                                    ? "last-places"
                                    : ""
                        }
                        onClick={() => onTeamClick(team.id)}
                        style={{ cursor: "pointer" }}
                    >
                        <td>{idx + 1}</td>
                        <td>{team.name}</td>
                        <td>{Number.isFinite(team.points) ? team.points : 0}</td>
                        <td>{Number.isFinite(team.diff) ? team.diff : 0}</td>
                    </tr>
                ))}
                </tbody>
            </table>

            {selectedTeamId && selectedTeam && (
                <div className="team-details" >
                    <h2>{selectedTeam.name}</h2>
                    <h3>Players</h3>
                    {teamPlayers && teamPlayers.length > 0 ? (
                        <ul>
                            {teamPlayers.map((p) => (
                                <li key={p.id}>
                                    {p.firstName} {p.lastName}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No players available.</p>
                    )}

                    <h3>Match History</h3>
                    {teamHistory && teamHistory.length > 0 ? (
                        <ul>
                            {teamHistory.map((m, i) => {
                                let homeGoals = 0;
                                let awayGoals = 0;
                                m.goals?.forEach((g) => {
                                    if (g.home) homeGoals++;
                                    else awayGoals++;
                                });

                                return (
                                    <li key={`${m.homeTeam.name}-${m.awayTeam.name}-${i}`}>
                                        {m.homeTeam.name} {homeGoals} – {awayGoals} {m.awayTeam.name}
                                    </li>
                                );
                            })}
                        </ul>
                    ) : (
                        <p>No match history available.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default Standings;