import React from "react";
import "./SearchBar.css";

function SearchBar(props) {
    const {searchInputsHandler} = props;
    return (
        <div 
        className="input-area" 
        id="favoritesSearchInput"
        contentEditable="true" 
        data-placeholder="Search by ingredients"
        onInput={searchInputsHandler}
        >
        </div>
    )
}

export default SearchBar;