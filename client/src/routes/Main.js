import React, { useEffect, useState } from "react";
import { useAuth0 } from '@auth0/auth0-react';
import { motion } from "framer-motion/dist/framer-motion";
import axios from "axios";
import "./Main.css";
import LogoutButton from "../components/LogoutButton";
import Button from "../components/Button";
import Recipe from "../components/Recipe";

function Main() {
    const { user } = useAuth0();
    const [time, setTime] = useState(0);
    const userId = user.sub;
    const [userData, setUserData] = useState([]);
    const name = user.name;
    const favoriteTitle = "Title test " + time.toString();
    const favoriteText = "Text test";

    const [response, setResponse] = useState("");

    const [ingredients, setIngredients] = useState({value: ""});
    const ingredientsRef = React.createRef();

    const inputsHandler = (e) =>{
        var taxt = e.target.innerHTML
        let textArray = taxt.split(/\n/gm)
        setIngredients( {value: e.target.value} )
    };

    let ingredientsText = ingredientsRef.current;
    // let ingredientsTextStart = ingredientsText.selectionStart;
    // let ingredientsTextEnd = ingredientsText.selectionEnd;
    let selectedIngredients = ingredientsText;
    const prompt = "Create a recipe that takes " + time.toString() + " minutes to cook with step by step instructions using the following ingredients: " + ingredients.value + ".";
    console.log(prompt);

    const handleSubmit = (e) => {
        e.preventDefault();

        axios
            .post('http://localhost:8000/chat', {prompt})
            .then((res) => {
                setResponse(res.data);
                console.log(res.data);
            })
            .catch((err) => {
                console.error(err);
            });

    };


    let incrementTime = () => {
        setTime(time + 30);
    }

    let decrementTime = () => {
        if (time > 0) {
            setTime(time - 30);
        }
    }

    let resetTime = () => {
        setTime(0);
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

    const createNewFavorite = async () => {
        const json = JSON.stringify({name, userId, favoriteTitle, favoriteText});
        const res = await axios.post('http://localhost:8000/createFavorite', json,
        {headers: 
            { "Content-Type": "application/json" }
        });
        getFavorites();
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

    // console.log(userData);
    // console.log(idToDelete);

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

                <div className="inputContainer">
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
                        <Button action={handleSubmit} title={"-->"}/>
                    </div>

                </div>

                <Recipe res={response} userData={userData} setUserData={setUserData}/>

                <div>
                    <div className="favoritesContainer">
                        <h2>Favorites</h2>
                        {userData.map(userData => 
                            <div className="favoriteCard">
                                <h3>{userData.recipeTitle}</h3>
                                <p>{userData.recipeText}</p>
                                <Button action={()=> {removeFavorite(userData._id);}} title={"Remove"}/>
                                
                            </div>
                        )}
                    </div>
                </div>


        </motion.div>
        )
        
    )
}

export default Main;