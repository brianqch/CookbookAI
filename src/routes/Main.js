import React from "react";
import { useAuth0 } from '@auth0/auth0-react';
import "./Main.css";
import LogoutButton from "../components/LogoutButton";

function Main() {
    const { user } = useAuth0();
    return (
        <div>
                <div><h1>Main Page</h1></div>
                <h2>Welcome, {user.name}</h2>
                <LogoutButton/>
        </div>
    )
}

export default Main;