import React, { useEffect, useState } from "react";
import { useAuth0 } from '@auth0/auth0-react';
import { motion } from "framer-motion/dist/framer-motion";
import axios from "axios";
import "./Main.css";
import LogoutButton from "../components/LogoutButton";
import Button from "../components/Button";

function Main() {
    const { user } = useAuth0();
    const [time, setTime] = useState(0);
    const userId = user.sub;
    const [userData, setUserData] = useState([]);
    const favorites = ["Apples", "Oranges", "Bananas"];
    const name = user.name;

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

    // useEffect(() => {
    //     fetch('http://localhost:8000/GetUser', {
    //         method: "get",
    //     }).then(response => {
    //         setUserData(response.json())
    //     }).catch
    // }, [])



    const getFavorites = async () => {
        const res = await axios.get('http://localhost:8000/getFavorites', {params: { "userId": userId}});
        setUserData(res.data);
    };

    const loadOrCreateNewUser = async () => {
        const json = JSON.stringify({ name, userId, favorites })
        let result = await axios.post('http://localhost:8000/loadOrCreateUser', json,
        {headers: 
            { "Content-Type": "application/json" }
        });
    }
    
    loadOrCreateNewUser();

    useEffect(() => {
        getFavorites();
    }, []);

    console.log(userData);

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
                            <textarea id="mainIngredientsTextInput" name='ingredients' placeholder='ex. linguine, shrimp' />
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
                        <Button action={loadOrCreateNewUser} title={"-->"}/>
                    </div>

                </div>
                <div>
                    <div>
                        <h1>Favorites</h1>
                        {userData.map(userData => <div>{userData.favorites}</div>)}
                    </div>
                </div>


        </motion.div>
        )
        
    )
}

export default Main;