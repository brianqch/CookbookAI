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
    let {res, userData, setUserData} = props;

    console.log(userData);

    
    const createNewFavorite = async () => {
        const json = JSON.stringify({name, userId, recipeTitle, recipeText});
        const res = await axios.post('http://localhost:8000/createFavorite', json,
        {headers: 
            { "Content-Type": "application/json" }
        });
        getFavorites();
    }

    const recipeText = res.trim().toString();
    const recipeTitle = recipeText.split("\n")[0].toString();

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
            </div>
        </div>
    )
}

export default Recipe;