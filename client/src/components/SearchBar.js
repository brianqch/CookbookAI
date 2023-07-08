import React, { useState } from "react";
import "./SearchBar.css";

function SearchBar() {
    return (
        <div className="input-wrapper">
            <input placeholder="Search by ingredients"></input>
        </div>
    )
}

export default SearchBar;