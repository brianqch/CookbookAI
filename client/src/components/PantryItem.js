import React from "react";
import "./PantryItem.css";

function PantryItem(props) {
    const {pantryItem, id, removeFavorite} = props;

    const deletePantryItem = () => {
        removeFavorite(id);
    }

    const deleteButton = (
        <svg xmlns="http://www.w3.org/2000/svg" 
            width="16" 
            height="16" 
            fill="currentColor"
            className="xDeleteButton" 
            viewBox="0 0 16 16"
            onClick={e => deletePantryItem(e)}> 
            <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/> 
        </svg>
    )

    return (
        <div className="pantry-item">
            <p>{pantryItem}</p>
            {deleteButton}
        </div>
    )
}

export default PantryItem