import React from "react";
import { useAuth0 } from '@auth0/auth0-react';
import "./App.css";
import Landing from "./Landing";
import Main from "./Main";


function App() {
    const { isAuthenticated, isLoading, error } = useAuth0();

    return (
       <main>
        {!isAuthenticated && ( <Landing/> )}
        {!error && isLoading && <p>Loading...</p>}
        {isAuthenticated && ( <Main/> )}
        </main>
    )
}

export default App;