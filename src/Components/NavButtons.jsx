import React from "react";

const NavButtons = ({ onPageChange }) => {
    return (
        <div className="nav-buttons">
            <button onClick={() => onPageChange("standings")}>Standings</button>
            <button onClick={() => onPageChange("history")}>Match History</button>
            <button onClick={() => onPageChange("scorers")}>Top Scorers</button>
            <button onClick={() => onPageChange("stats")}>Stats</button>
        </div>
    );
};

export default NavButtons;