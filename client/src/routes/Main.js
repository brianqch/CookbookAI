import React, { useEffect, useState, createRef} from "react";
import { useAuth0 } from '@auth0/auth0-react';
import { motion } from "framer-motion/dist/framer-motion";
import axios from "axios";
import "./Main.css";
import LogoutButton from "../components/LogoutButton";
import Button from "../components/Button";
import Recipe from "../components/Recipe";
import SearchBar from "../components/SearchBar";
import FavoriteCard from "../components/FavoriteCard";
import Pantry from "../components/Pantry";

function Main() {
    const { user } = useAuth0();
    const userId = user.sub;
    const [userData, setUserData] = useState([]);
    const name = user.name;

    const [response, setResponse] = useState("");

    const [ingredients, setIngredients] = useState({value: ""});
    const ingredientsRef = createRef();
    const [preferences, setPreferences] = useState({value: ""});
    const preferencesRef = createRef();

    const [isLoadingRecipe, setLoadingRecipe] = useState(false);
    const [isFinishedLoading, setFinishedLoading] = useState(false);
    const [favPrev, setFavPrev] = useState([]);
    
    const inputsHandler = (e) =>{
        var text = e.target.innerHTML
        text.split(/\n/gm)
        if (e.target.id === "mainIngredientsTextInput") {
            setIngredients( {value: e.target.value} )
            console.log(ingredients);
        }
        if (e.target.id === "preferencesTextInput") {
            setPreferences( {value: e.target.value} )
            console.log(preferences)
        }   
    };

    const prompt = `Create a recipe with step by step instructions using the following ingredients: ${ingredients.value}. Here are some preferences I have for the recipe. ${preferences.value}`

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

    useEffect(() => {
        loadOrCreateNewUser();
        getFavorites();
    }, []);

    const welcomePrompt = isFinishedLoading ? "Here's what we got." : `What are we making today, ${user.name.split(" ")[0]}?`

    const inputContainer = (
        <div className="input-container">
            <label className="input-label">Main Ingredients</label>
            <textarea 
                className="input-area" 
                id="mainIngredientsTextInput" 
                name='ingredients' 
                placeholder='ex. catfish, fish sauce' 
                ref={ingredientsRef} 
                onChange={inputsHandler} 
                value={ingredients.value}/>
            <label className="input-label">Preferences</label>
            <textarea 
                className="input-area" 
                id="preferencesTextInput" 
                name='preferences' 
                placeholder='I want it pan-fried and done in under 30 minutes.' 
                ref={preferencesRef} 
                onChange={inputsHandler} 
                value={preferences.value}
                /> 
            <button className="input-button" onClick={handleSubmit}> Submit </button>
        </div>
    );

    const outputContainer = (
        <div className="recipe-wrapper" id="outputContainer">
            <Recipe res={response} userData={userData} setUserData={setUserData} setFinishedLoading={setFinishedLoading}/>
        </div>
    )

    return (
        (
        <motion.div
            className="container text-center  bg-black"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="200vh" viewBox="0 0 100% 200vh" fill="none" className="background-svg" preserveAspectRatio="none">
                <path d="M0 0L2250 0L2250 1861.01C2250 1861.01 1905.5 1632.02 1125 1861.01C344.5 2090 1.3448e-05 1861.01 1.3448e-05 1861.01L0 0Z" fill="url(#paint0_linear_65_399)"/>
                <defs>
                <linearGradient id="paint0_linear_65_399" x1="100vh" y1="0" x2="100vw" y2="100vw" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#FFF3D3"/>
                    <stop offset="1" stop-color="white" stop-opacity="0"/>
                </linearGradient>
                </defs>
            </svg>
            <header className="header-container">
                    <h2 className="header-title">Cookbook.ai</h2> 
            </header>
            <div className="main-container">
                <span>
                    <h1 className="welcome-prompt">{welcomePrompt}</h1>
                </span>
                <section className="input-output-section">
                    <div className="input-output-container">
                        {isFinishedLoading ? outputContainer : inputContainer}
                    </div>
                </section>
            </div>



        </motion.div>
        )
        
    )
}

export default Main;

{/* <div className="header"><h1>Cookbook.ai</h1> <LogoutButton/></div>
                <div className="main-top">
                    <div className="inputOutputContainer">
                        <div className={isFinishedLoading ? "hideInputContainer" : "showInputContainer"}>
                            <div id="inputHeading1">
                                <h2>What are we making today, {user.name.split(" ")[0]}?</h2>
                            </div>
                            <div className="inputSection">
                                <div id="mainIngredientsInputContainer">
                                    <div id="headingAndButtonContainer">
                                        <label id="inputHeading2"> Main Ingredients </label>
                                    </div>
                                    <textarea id="mainIngredientsTextInput" name='ingredients' placeholder='ex. linguine, shrimp' ref={ingredientsRef} onChange={inputsHandler} value={ingredients.value}/>
                                </div>
                            </div>

                            <div id="submitButton">
                                <div className={isLoadingRecipe ? "loadingSymbol" : "notLoading"}>
                                    <p>Generating...</p>
                                </div>
                                <Button action={handleSubmit} title={"-->"}/>
                            </div>
                        </div>
                        <div className={isFinishedLoading ? "showRecipeContainer" : "hideRecipeContainer"}>
                            <Recipe res={response} userData={userData} setUserData={setUserData} setFinishedLoading={setFinishedLoading}/>
                        </div>
                    </div> 
                    <Pantry/>
                </div>

                <div>
                    <div className="favoritesContainer">
                        <h2>Favorites</h2>
                        <SearchBar/>
                        {userData.map(userData =>         
                            <FavoriteCard 
                                key={userData._id}
                                userData={userData}
                                removeFavorite={removeFavorite}
                                favPrev={favPrev}
                                setFavPrev={setFavPrev}
                                Button={Button}
                            />
                            
                        )}
                    </div>
                </div> */}