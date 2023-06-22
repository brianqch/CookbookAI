import React from "react";
import "./Button.css";

function Button(props) {
    let { action, title } = props;
    return <button className="Button" onClick={action}>{title}</button>;
}

export default Button;