import React from "react";
import { useAuth0 } from '@auth0/auth0-react';
import "./Landing.css";


function Landing() {
    const { loginWithRedirect, isAuthenticated } = useAuth0();
    return (
        !isAuthenticated && (
            <div>
                <div className="head">
                    <div className="head1">
                        <h1>Cookbook.AI</h1>
                        <h3> — Your AI powered kitchen assistant. </h3>
                    </div>
                    <div onClick={() => loginWithRedirect()} id="cookingButton">
                        <div id="cookingButtonText">Get cooking!</div>
                    </div>
                </div>
                <div className="howContainer">
                    <h1>How it works</h1>
                </div>
            </div>
        )
    )
}

export default Landing;