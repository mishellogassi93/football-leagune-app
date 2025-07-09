import React from "react";

const LeagueSelector = ({ leagues, selectedLeague, onChange }) => {
    return (
        <select className="league-select" onChange={onChange} value={selectedLeague || ""}>
            <option value="" disabled>
                Select League
            </option>
            {leagues.map((l) => (
                <option key={l.id} value={l.id}>
                    {l.name}
                </option>
            ))}
        </select>
    );
};

export default LeagueSelector;