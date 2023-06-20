import React from "react";
import "./App.css";


function App() {
    return (
        <div>
            <div className="head">
                <div className="head1">
                    <h1>Cookbook.AI</h1>
                    <h3> — Your AI powered kitchen assistant. </h3>
                </div>
                <div className="button" id="cookingButton">
                    <div id="dub-arrow"><img src="https://github.com/atloomer/atloomer.github.io/blob/master/img/iconmonstr-arrow-48-240.png?raw=true" alt="" /></div>
                    <a href="#">Get cooking!</a>
                </div>
            </div>
            <div className="howContainer">
                <h1>How it works</h1>
            </div>
        </div>
    )
}

export default App;