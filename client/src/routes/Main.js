import React, { useEffect, useState } from "react";
import { useAuth0 } from '@auth0/auth0-react';
import { motion } from "framer-motion/dist/framer-motion";
import axios from "axios";
import "./Main.css";
import LogoutButton from "../components/LogoutButton";
import Button from "../components/Button";
import Recipe from "../components/Recipe";
import SearchBar from "../components/SearchBar";
import FavoritesEditMenu from "../components/FavoritesEditMenu";

function Main() {
    const { user } = useAuth0();
    const [time, setTime] = useState(0);
    const userId = user.sub;
    const [userData, setUserData] = useState([]);
    const name = user.name;

    const [response, setResponse] = useState("");

    const [ingredients, setIngredients] = useState({value: ""});
    const ingredientsRef = React.createRef();

    const [isLoadingRecipe, setLoadingRecipe] = useState(false);
    const [isFinishedLoading, setFinishedLoading] = useState(false);
    
    const [isEditing, setEditing] = useState(false);

    const inputsHandler = (e) =>{
        var taxt = e.target.innerHTML
        let textArray = taxt.split(/\n/gm)
        setIngredients( {value: e.target.value} )
    };


    

    const prompt = "Create a recipe that takes " + time.toString() + " minutes to cook with step by step instructions using the following ingredients: " + ingredients.value + ".";

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (ingredients.value === "") {
            alert("Please add some ingredients.")
            return;
        } else if (time === 0) {
            alert("Please enter the time you have.")
            return;
        }

        setLoadingRecipe(true);

        axios
            .post('http://localhost:8000/chat', {prompt})
            .then((res) => {
                setResponse(res.data);
                setLoadingRecipe(false);
                setFinishedLoading(true);
            })
            .catch((err) => {
                console.error(err);
            });

    };


    let incrementTime = () => {
        setTime(time + 15);
    }

    let decrementTime = () => {
        if (time > 0) {
            setTime(time - 15);
        }
    }

    let resetTime = () => {
        setTime(0);
    }

    const [openOrCloseLabel, setLabel] = useState("View recipe")

    let openOrClose = (elementId) => {
        const element = document.getElementById(elementId);
        const favoriteCardText = element.children[1];
        if (favoriteCardText.className == "favoriteCardTextOpen") {
            favoriteCardText.className = "favoriteCardTextClosed";
            element.style.flexDirection = "row";
            setLabel("View recipe");
        } else {
            favoriteCardText.className = "favoriteCardTextOpen";
            element.style.flexDirection = "column";
            setLabel("Close recipe");
        }
    }

    const getFavorites = async () => {
        const res = await axios.get('http://localhost:8000/getFavorites', {params: { "userId": userId}});
        setUserData(res.data);
    };

    const loadOrCreateNewUser = async () => {
        const json = JSON.stringify({ name, userId})
        let result = await axios.post('http://localhost:8000/loadOrCreateUser', json,
        {headers: 
            { "Content-Type": "application/json" }
        });
    }

    const removeFavorite = async (id) => {
        const res = await axios.delete('http://localhost:8000/deleteFavorite', {data: {"_id": id}}, 
        {headers: 
            { "Content-Type": "application/json" }
        });
        getFavorites();
    }

    useEffect(() => {
        loadOrCreateNewUser();
        getFavorites();
    }, []);

    return (
        (
            <motion.div
            className="container text-center  bg-black"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
        >
                <div className="header"><h1>Cookbook.ai</h1> <LogoutButton/></div>

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
                            <div id="timeInputContainer">
                                <div id="headingAndButtonContainer">
                                    <label id="inputHeading2"> Time </label>
                                    <div id="timerButtonContainer">
                                            <Button title={"Reset"} action={resetTime} />
                                            <Button title={"-"} action={decrementTime} />
                                            <Button title={"+"} action={incrementTime} />
                                    </div>
                                </div>
                                <div id="displayTime">
                                    <p>{time} mins</p>
                                </div>

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

                <div>
                    <div className="favoritesContainer">
                        <h2>Favorites</h2>
                        <SearchBar/>
                        {userData.map(userData => 
                            <div className="favoriteCard" id={userData._id}>
                                <div id="favoriteCardHeader">
                                    <h3>{userData.recipeTitle}</h3>
                                    <div id="favoriteCardDateAndMenu">
                                        <label id="dateCreatedLabel">Created on {userData.currentDate}</label>
                                        <FavoritesEditMenu objectId={userData._id} openOrClose={openOrClose} removeFavorite={removeFavorite} openOrCloseLabel={openOrCloseLabel} setLabel={setLabel} userData={userData} isEditing={isEditing} setEditing={setEditing}/>
                                    </div>
                                </div>
                                <div className='favoriteCardTextClosed'>
                                    <p>{userData.recipeText}</p>
                                </div>
                                <div className="saveButtonContainerHidden">
                                    <Button action={console.log()} title={"Save changes"}/>
                                </div>
                            </div>
                        )}
                    </div>
                </div>


        </motion.div>
        )
        
    )
}

export default Main;