import React, { useEffect, useRef } from "react";
import {CSSTransition} from "react-transition-group"
import Button from "./CustomButton";
import axios from "axios";
import { useAuth0 } from '@auth0/auth0-react';
import "./Recipe.css";

function Recipe(props) {

    // Auth 0 User Data
    const { user } = useAuth0();
    const name = user.name;
    const userId = user.sub;
    const nodeRef = useRef(null);

    // Response from Chat GPT OpenAI API
    let {res, setUserData, setFinishedLoading} = props;
    
    const createNewFavorite = async () => {
        const dateObject = new Date();
        let day = dateObject.getDate();
        let month = dateObject.getMonth() + 1;
        let year = dateObject.getFullYear();
        let currentDate = `${month}-${day}-${year}`;
        const json = JSON.stringify({name, userId, recipeTitle, recipeText, currentDate});
        await axios.post('http://localhost:8000/createFavorite', json,
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

    const generateNewRecipe = () => {
        const inputOutputSection = document.getElementsByClassName("input-output-section")[0];
        inputOutputSection.classList.toggle('expand');
        setFinishedLoading(false)
    }

    useEffect(() => {
        getFavorites();
    }, []);

    return (
        <CSSTransition
            in={true}
            classNames="recipe-container"
            appear={true}
            timeout={500}
            nodeRef={nodeRef}
        >
            <div className="recipe-container" ref={nodeRef}>
                <div id="recipeHeading">
                    <label>{recipeTitle}</label>
                </div>
                <div id="recipeSection">
                    <p> {recipeText} </p>
                </div>
                <div id="saveOrGenerateNewSection">
                    <Button action={createNewFavorite} title={"Add to favorites"}/>
                    <Button action={generateNewRecipe} title={"Generate new recipe"}/>
                </div>
            </div>
        </CSSTransition>
    )
}

export default Recipe;