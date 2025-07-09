import React from "react";

const Stats = ({ stats }) => {
    if (!stats || Object.keys(stats).length === 0) {
        return <p>No statistics available.</p>;
    }

    return (
        <div className="stats-container">
            <h2>League Statistics</h2>
            <ul>
                <li><strong>Goals in First Half:</strong> {stats.firstHalf}</li>
                <li><strong>Goals in Second Half:</strong> {stats.secondHalf}</li>
                <li><strong>Earliest Goal Minute:</strong> {stats.minGoal}'</li>
                <li><strong>Latest Goal Minute:</strong> {stats.maxGoal}'</li>
                <li><strong>League round with Most Goals:</strong> League round number {stats.mostGoalsRound}</li>
                <li><strong>League round with Least Goals:</strong> League round number {stats.leastGoalsRound}</li>
            </ul>
        </div>
    );
};

export default Stats;