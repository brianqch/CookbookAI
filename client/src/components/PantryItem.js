import React from "react";
import "./PantryItem.css";

function PantryItem(props) {
    const {pantryItem} = props;
    return (
        <div className="pantry-item">
            <p>{pantryItem}</p>
        </div>
    )
}

export default PantryItem