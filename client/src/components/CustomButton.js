import React from "react";
import "./CustomButton.css";

function CustomButton(props) {
    let { action, title } = props;
    return <button className="customButton" onClick={action}>{title}</button>;
}

export default CustomButton;