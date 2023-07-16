import React, {useState, useRef, useEffect} from "react";
import {CSSTransition} from "react-transition-group";

function WelcomePrompt(props) {
    const { isFinishedLoading, user } = props
    const nodeRef = useRef(null);

    const welcomePrompt = isFinishedLoading ? "Here's what we got." : `What are we making today, ${user.name.split(" ")[0]}?`


    return (
    <CSSTransition
        key={isFinishedLoading}
        in={true}
        classNames="welcome-prompt"
        appear={true}
        timeout={500}
        nodeRef={nodeRef}>
        <div>
            <h1 className="welcome-prompt" ref={nodeRef}>{welcomePrompt}</h1>
        </div>
    </CSSTransition>
    )
}

export default WelcomePrompt;