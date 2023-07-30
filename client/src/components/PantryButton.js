import React from "react";
import "./PantryButton.css";

function PantryButton() {
    const navigateToPantry = () => {
        window.location.href='/pantry'
    }
    return (
        <div className="pantry-button-container" onClick={() => navigateToPantry()}>
                <img id="pantry-button" src="/assets/pantry_image.png" alt="pantry button"></img>
                <p>Pantry</p>
        </div>
    )
}

export default PantryButton;