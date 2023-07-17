import React, { useState } from "react";
import "./Pantry.css"
import Button from "./CustomButton";
import PantryItem from "./PantryItem";

function Pantry(props) {
    const [pantryList, setPantryList] = useState([]);

    const addPantryItem = () => {
        const inputElement = document.getElementById("inputElement");
        const inputValue = inputElement.value;

        setPantryList([...pantryList, inputValue]);
        inputElement.value = "";
    }

    return (
        <div className="pantry-container">
            <h1>Pantry</h1>
            <div className="pantry-item-container">
                {pantryList.map(pantryItem => 
                    <PantryItem pantryItem={pantryItem} />
                )}
            </div>
            <div className="pantry-item-input-container">
                <input className="pantry-item-input" id="inputElement" placeholder="Enter a pantry item"></input>
                <div>
                    <Button action={addPantryItem} title="↑"/>
                </div>
            </div>
        </div>
    )
}

export default Pantry;