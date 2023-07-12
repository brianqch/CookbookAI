import React, { useEffect, useState } from "react";
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
    const [time, setTime] = useState(0);
    const userId = user.sub;
    const [userData, setUserData] = useState([]);
    const name = user.name;

    const [response, setResponse] = useState("");

    const [ingredients, setIngredients] = useState({value: ""});
    const ingredientsRef = React.createRef();

    const [isLoadingRecipe, setLoadingRecipe] = useState(false);
    const [isFinishedLoading, setFinishedLoading] = useState(false);
    const [favPrev, setFavPrev] = useState([]);
    
    const inputsHandler = (e) =>{
        var text = e.target.innerHTML
        text.split(/\n/gm)
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


    const incrementTime = () => {
        setTime(time + 15);
    }

    const decrementTime = () => {
        if (time > 0) {
            setTime(time - 15);
        }
    }

    const resetTime = () => {
        setTime(0);
    }

    
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
                </div>


        </motion.div>
        )
        
    )
}

export default Main;