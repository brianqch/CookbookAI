import React from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import "./LogoutButton.css";

function LogoutButton() {
    const {logout, isAuthenticated} = useAuth0();
    return (
        isAuthenticated && (
            <div className="logout-button-container" onClick={() => logout()}>
                <img id="logout-button" src="/assets/logoutButton.png" alt="Logout"></img>
                <p>Logout</p>
            </div>
        )
    )

}

export default LogoutButton