import React, { useEffect, useState } from "react";
import Button from "./Button";
import axios from "axios";
import { useAuth0 } from '@auth0/auth0-react';
import "./Recipe.css";

function Recipe(props) {

    // Auth 0 User Data
    const { user } = useAuth0();
    const name = user.name;
    const userId = user.sub;

    // Response from Chat GPT OpenAI API
    let {res, userData, setUserData, setFinishedLoading} = props;
    
    const createNewFavorite = async () => {
        const dateObject = new Date();
        let day = dateObject.getDate();
        let month = dateObject.getMonth() + 1;
        let year = dateObject.getFullYear();
        let currentDate = `${month}-${day}-${year}`;
        const json = JSON.stringify({name, userId, recipeTitle, recipeText, currentDate});
        const res = await axios.post('http://localhost:8000/createFavorite', json,
        {headers: 
            { "Content-Type": "application/json" }
        });
        getFavorites();
    }

    const recipeText = res.trim().toString();
    const recipeTitle = recipeText.split("\n").shift().toString();


    const getFavorites = async () => {
        const res = await axios.get('http://localhost:8000/getFavorites', {params: { "userId": userId}});
        setUserData(res.data);
    };

    useEffect(() => {
        getFavorites();
    }, []);

    return (
        <div className="recipeContainer">
            <div id="recipeHeading">
                <label>{recipeTitle}</label>
            </div>
            <div id="recipeSection">
                <p> {recipeText} </p>
            </div>
            <div id="saveOrGenerateNewSection">
                <Button action={createNewFavorite} title={"Add to favorites"}/>
                <Button action={() => {setFinishedLoading(false)}} title={"Generate new recipe"}/>
            </div>
        </div>
    )
}

export default Recipe;