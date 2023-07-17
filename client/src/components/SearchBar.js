import React from "react";
import "./SearchBar.css";

function SearchBar() {
    return (
        <div 
        className="input-area" 
        id="favoritesSearchInput"
        contentEditable="true" 
        data-placeholder="Search by ingredients"
        // onInput={inputsHandler}
        >
        </div>
    )
}

export default SearchBar;