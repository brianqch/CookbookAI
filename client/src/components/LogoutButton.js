import React from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import "./LogoutButton.css";

function LogoutButton() {
    const {logout, isAuthenticated} = useAuth0();
    return (
        isAuthenticated && (
            <img id="logoutButton" src="/assets/logoutButton.png" alt="Logout" onClick={() => logout()}></img>
        )
    )

}

export default LogoutButton