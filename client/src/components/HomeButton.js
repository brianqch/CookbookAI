import React from "react";
import "./HomeButton.css";

function HomeButton() {
    const navigateToHome = () => {
        window.location.href='/home'
    }
    return (
        <div className="home-button-container" onClick={() => navigateToHome()}>
                <img id="home-button" src="/assets/homeButton.png" alt="home button"></img>
                <p>Home</p>
        </div>
    )
}

export default HomeButton;