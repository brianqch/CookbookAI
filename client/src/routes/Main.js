import React, { useEffect, useState, useRef} from "react";
import {CSSTransition} from "react-transition-group";
import { useAuth0 } from '@auth0/auth0-react';
import { motion } from "framer-motion/dist/framer-motion";
import {Rings, RevolvingDot} from 'react-loader-spinner';
import axios from "axios";
import "./Main.css";

import CustomButton from "../components/CustomButton";
import Recipe from "../components/Recipe";
import SearchBar from "../components/SearchBar";
import FavoriteCard from "../components/FavoriteCard";
import WelcomePrompt from "../components/WelcomePrompt";
import SideNav from "../components/SideNav";

// Main component that contains user's input and output section and favorites section. Handles functionality for OpenAI API and MongoDB HTTP requests.
function Main() {
    const { user } = useAuth0();
    const userId = user.sub;
    const [userData, setUserData] = useState([]);
    const name = user.name;

    const [response, setResponse] = useState("");

    const [ingredients, setIngredients] = useState({value: ""});
    const [preferences, setPreferences] = useState({value: ""});
    const [pantryItems, setPantryItems] = useState([]);

    const [favoriteActive, setFavoriteActive] = useState(null);

    const nodeRef = useRef(null);

    const [editsMade, setEditsMade] = useState(false);

    const [isLoadingRecipe, setLoadingRecipe] = useState(false);
    const [isFinishedLoading, setFinishedLoading] = useState(false);
    
    // Handles user's inputs in the input section and sets appropriate useStates.
    const inputsHandler = (e) =>{
        var text = e.target.innerText;
        text.split(/\n/gm)
        if (e.target.id === "mainIngredientsTextInput") {
            setIngredients( {value: text} )
        }
        if (e.target.id === "preferencesTextInput") {
            setPreferences( {value: text} )
            
        }   
    };

    // Handles user's search inputs in the favorite search section.
    const searchInputsHandler = (e) => {
        var text = e.target.innerText;
        text.split(/\n/gm)
        getFavoritesByIngredient(text);
        if (text.length === 0) {
            getFavorites();
        }
    }

    // Prompt Handling.
    const prefPostBool = (preferences.value.length > 0) ? `Here are some preferences I have for the recipe. ${preferences.value}` : "";
    const pantryItemsString = `Here are some optional ingredients in my pantry that you can use:${pantryItems}`;
    const prompt = `Create a recipe with step by step instructions and accurate measurements using the following ingredients: ${ingredients.value}. ${prefPostBool} ${pantryItemsString}`


    // Submits the prompts to back end OpenAI API and handles any necesary useStates for loading and animations.
    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (ingredients.value === "") {
            alert("Please add some ingredients.")
            return;
        }

        setLoadingRecipe(true);

        axios
            .post('http://localhost:8000/chat', {prompt})
            .then((res) => {
                setResponse(res.data);
                setLoadingRecipe(false);
                setFinishedLoading(true);
                const inputOutputSection = document.getElementsByClassName("input-output-section")[0];
                inputOutputSection.classList.toggle('expand');
                setIngredients({value: ""});
                setPreferences({value: ""});
            })
            .catch((err) => {
                console.error(err);
            });

    };

    
    // Retrieves the list of favorites for user with UserId and sets userData.
    const getFavorites = async () => {
        const res = await axios.get('http://localhost:8000/getFavorites', {params: { "userId": userId}});
        setUserData(res.data);
    };

    // Retrieves the list of favorites for user with UserId and specified ingredients and sets userData.
    const getFavoritesByIngredient = async (ingredient) => {
        const res = await axios.get('http://localhost:8000/getFavoritesByIngredient', {params: { "userId": userId, "ingredient": ingredient}});
        setUserData(res.data);
    }

    // Stores the userId in the database if one does not exist. Else, loads the user's information.
    const loadOrCreateNewUser = async () => {
        const json = JSON.stringify({ name, userId})
        await axios.post('http://localhost:8000/loadOrCreateUser', json,
        {headers: 
            { "Content-Type": "application/json" }
        });
    }

    // Deletes the favorite from the database with given id.
    const removeFavorite = async (id) => {
        await axios.delete('http://localhost:8000/deleteFavorite', {data: {"_id": id}}, 
        {headers: 
            { "Content-Type": "application/json" }
        }).then(
            getFavorites()
        ).catch((err) => {
            console.error(err);
        });
    }

    // Revtries the list of pantry items for user with UserId and sets pantryItems.
    const getPantryItemsData = async () => {
        let pantryArr = [];
        const res = await axios.get('http://localhost:8000/getPantryItems', {params: { "userId": userId}});
        for (const pantryObj of res.data) {
            pantryArr.push(" " + pantryObj.pantryItem)
        }
        setPantryItems(pantryArr);
    };

    // Loads or creates a new user upon first render.
    useEffect(() => {
        loadOrCreateNewUser();
    }, [])

    // Loads user's favorites and pantry items.
    useEffect(() => {
        getFavorites();
        setEditsMade(false);
        getPantryItemsData();
    }, [editsMade]);

    // Div container for user input.
    const inputContainer = (
            <div className="input-container">
                <label className="input-label">Main Ingredients</label>
                <div 
                    className="input-area" 
                    id="mainIngredientsTextInput"
                    contentEditable="true" 
                    data-placeholder="catfish, fish sauce"
                    onInput={inputsHandler}
                >
                </div>
                <label className="input-label">Preferences</label>
                <div 
                    className="input-area" 
                    id="preferencesTextInput"
                    contentEditable="true" 
                    data-placeholder="I want it pan-fried and done in under 30 minutes"
                    onInput={inputsHandler}
                >
                </div>
                <button className="input-button" onClick={handleSubmit}> Submit </button>
                <div className="loading-area">
                    {isLoadingRecipe ? 
                        <RevolvingDot
                        height="100"
                        width="100"
                        radius="10"
                        color="#F39A59"
                        secondaryColor=''
                        ariaLabel="revolving-dot-loading"
                        wrapperStyle={{}}
                        wrapperClass=""
                        visible={true}
                        />
                    :
                        <></>
                    }
                </div>
            </div>
    );

    // Div container for user output.
    const outputContainer = (
        <div className="recipe-wrapper" id="outputContainer">
            <Recipe res={response} userData={userData} setUserData={setUserData} setFinishedLoading={setFinishedLoading}/>
        </div>
    )

    const favoriteCards = (
        userData.map(userData =>         
            <FavoriteCard 
                key={userData._id}
                id={userData._id}
                userData={userData}
                removeFavorite={removeFavorite}
                Button={CustomButton}
                favoriteActive={favoriteActive}
                setFavoriteActive={setFavoriteActive}
                setEditsMade={setEditsMade}
            />
        )
    )

    return (
        (
        <motion.div
            className="container text-center  bg-black"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="200vh" viewBox="0 0 1000 5000" fill="none" className="background-svg" preserveAspectRatio="none">
                <path d="M0 0L2250 0L2250 1861.01C2250 1861.01 1905.5 1632.02 1125 1861.01C344.5 2090 1.3448e-05 1861.01 1.3448e-05 1861.01L0 0Z" fill="url(#paint0_linear_65_399)"/>
                <defs>
                <linearGradient id="paint0_linear_65_399" x1="100vh" y1="0" x2="100vw" y2="100vw" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#FFF3D3"/>
                    <stop offset="1" stopColor="white" stopOpacity="0"/>
                </linearGradient>
                </defs>
            </svg>
            <header className="header-container">
                <h2 className="header-title" onClick={event =>  window.location.href='/home'}>Cookbook.ai</h2> 
                <SideNav/>
            </header>
            <div className="main-container">
            <WelcomePrompt isFinishedLoading={isFinishedLoading} user={user}/>
                <section className="input-output-section">
                    <CSSTransition
                        in={true}
                        classNames="input-output-container"
                        appear={true}
                        timeout={500}
                        nodeRef={nodeRef}
                    >
                        <div className="input-output-container" ref={nodeRef}>
                            {isFinishedLoading ? outputContainer : inputContainer}
                        </div>
                    </CSSTransition>
                </section>
            </div>
            <div className="favorites-container">
                <section className="favorites-section">
                        <h2 className="favorites-title">Favorites</h2>
                        <SearchBar searchInputsHandler={searchInputsHandler}/>
                        <section className="favorite-card-column-section">
                            <div className="favorite-card-container">
                                {favoriteCards}
                            </div>
                            {favoriteActive}
                        </section>
                </section>
            </div>
        </motion.div>
        )
        
    )
}

export default Main;