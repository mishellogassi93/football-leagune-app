import React from "react";

class TopScorers extends React.Component {
    render() {
        const { scorers } = this.props;
        if (!scorers || scorers.length === 0) {
            return <p>No scorer data available.</p>;
        }
        return (
            <div className="top-scorers">
                <h2>Top 3 Goal Scorers</h2>
                <table>
                    <thead>
                    <tr>
                        <th>Player Name</th>
                        <th>Goals</th>
                    </tr>
                    </thead>
                    <tbody>
                    {scorers.map((player, index) => (
                        <tr key={index}>
                            <td>{player.name}</td>
                            <td>{player.goals}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        );
    }
}

export default TopScorers;