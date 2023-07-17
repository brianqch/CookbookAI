import React, { useEffect, useState, createRef, useRef} from "react";
import {CSSTransition} from "react-transition-group";
import { useAuth0 } from '@auth0/auth0-react';
import { motion } from "framer-motion/dist/framer-motion";
import axios from "axios";
import Button from '@mui/material/Button';
import "./Main.css";

import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import LogoutButton from "../components/LogoutButton";
import CustomButton from "../components/CustomButton";
import Recipe from "../components/Recipe";
import SearchBar from "../components/SearchBar";
import FavoriteCard from "../components/FavoriteCard";
import Pantry from "../components/Pantry";
import WelcomePrompt from "../components/WelcomePrompt";

function Main() {
    const { user } = useAuth0();
    const userId = user.sub;
    const [userData, setUserData] = useState([]);
    const name = user.name;

    const [response, setResponse] = useState("");

    const [ingredients, setIngredients] = useState({value: ""});
    const [preferences, setPreferences] = useState({value: ""});

    const nodeRef = useRef(null);

    const [editsMade, setEditsMade] = useState(false);

    const [isLoadingRecipe, setLoadingRecipe] = useState(false);
    const [isFinishedLoading, setFinishedLoading] = useState(false);
    
    const inputsHandler = (e) =>{
        var text = e.target.innerText;
        text.split(/\n/gm)
        if (e.target.id === "mainIngredientsTextInput") {
            setIngredients( {value: text} )
            console.log("These are my ingredients", ingredients);
        }
        if (e.target.id === "preferencesTextInput") {
            setPreferences( {value: text} )
            console.log("These are my preferences", preferences.value.length)
            
        }   
    };

    const prefPostBool = (preferences.value.length > 0) ? `Here are some preferences I have for the recipe. ${preferences.value}` : "";

    const prompt = `Create a recipe with step by step instructions using the following ingredients: ${ingredients.value}. ${prefPostBool}`

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
    }, [editsMade]);

    const inputContainer = (
            <div className="input-container">
                <label className="input-label">Main Ingredients</label>
                {/* <textarea 
                    className="input-area" 
                    id="mainIngredientsTextInput" 
                    name='ingredients' 
                    placeholder='ex. catfish, fish sauce' 
                    ref={ingredientsRef} 
                    onChange={inputsHandler} 
                    value={ingredients.value}
                /> */}
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
            </div>
    );

    const outputContainer = (
        <div className="recipe-wrapper" id="outputContainer">
            <Recipe res={response} userData={userData} setUserData={setUserData} setFinishedLoading={setFinishedLoading}/>
        </div>
    )

    const [drawerStatus, setDrawerStatus] = useState(false);

    const burgerMenu = (
        <svg viewBox="0 0 100 80" width="40" height="20" className="burger-menu">
            <rect width="90" height="15"></rect>
            <rect y="30" width="90" height="15"></rect>
            <rect y="60" width="90" height="15"></rect>
        </svg>
    )

    const toggleDrawer = (open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
          return;
        }
    
        setDrawerStatus(prevDrawerStatus => !prevDrawerStatus);
      };
    
    const anchor = 'right';

    const list =  (
        <Box
          sx={{ width: 250 }}
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          <List>
            <ListItem>
                <LogoutButton/>
            </ListItem>
          </List>
        </Box>
      );


    const [favoriteActive, setFavoriteActive] = useState(null);

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
                <Button onClick={toggleDrawer(true)}>{burgerMenu}</Button>
                <Drawer
                    anchor={'right'}
                    open={drawerStatus}
                    onClose={toggleDrawer(false)}
                >   
                    {list}
                </Drawer>
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
                        <SearchBar/>
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