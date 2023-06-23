import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import "./App.css";
import AnimatedRoutes from "./AnimatedRoutes";


function App() {

    return (
    <Router>
        <AnimatedRoutes/>
    </Router>
    )
}

export default App;