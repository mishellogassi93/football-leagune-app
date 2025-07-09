import React from "react";

class MatchHistory extends React.Component {
    getFilteredMatches() {
        const { matches, roundMin, roundMax } = this.props;
        return matches.filter(
            (match) => match.round >= roundMin && match.round <= roundMax
        );
    }

    render() {
        const { roundMin, roundMax, onRangeChange } = this.props;
        const filteredMatches = this.getFilteredMatches();

        return (
            <div className="match-history">
                <h2>Match History</h2>
                <div className="round-filter">
                    <label>
                        Min Round:
                        <input
                            type="number"
                            value={roundMin}
                            onChange={(e) => onRangeChange(Number(e.target.value), roundMax)}
                        />
                    </label>
                    <label>
                        Max Round:
                        <input
                            type="number"
                            value={roundMax}
                            onChange={(e) => onRangeChange(roundMin, Number(e.target.value))}
                        />
                    </label>
                </div>

                <ul>
                    {filteredMatches.map((match) => {
                        const home = match.homeTeam;
                        const away = match.awayTeam;
                        let homeGoals = 0;
                        let awayGoals = 0;
                        match.goals?.forEach((g) => {
                            if (g.home) homeGoals++;
                            else awayGoals++;
                        });
                        return (
                            <li key={match.id}>
                                {home.name} {homeGoals} – {awayGoals} {away.name}
                            </li>
                        );
                    })}
                </ul>
            </div>
        );
    }
}

export default MatchHistory;