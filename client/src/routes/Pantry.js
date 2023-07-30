import React, { useState, useEffect } from "react";
import { useAuth0 } from '@auth0/auth0-react';
import { motion } from "framer-motion/dist/framer-motion";
import axios from "axios";

import "./Pantry.css"
import PantryItem from "../components/PantryItem";
import SideNav from "../components/SideNav";

// Pantry component that contains pantry input and exisiting pantry items. Handles functionality for MongoDB pantryItem HTTP requests.
function Pantry() {
    const { user } = useAuth0();
    const userId = user.sub;

    const [pantryList, setPantryList] = useState([]);
    const [textInput, setTextInput] = useState("")
    const [pantryItemsOnly, setPantryItemsOnly] = useState([]);

    // Handles event of user pressing add item button when inputting pantry items.
    const handleButtonClick = (e) => {
        addPantryItemToDB(textInput);
    }

    // Handles event of user pressing enter when inputting pantry items.
    function handleEnter(event) {
        if(event.key === 'Enter') {  
            addPantryItemToDB(textInput)
        }
    }

    // Retrieves the list of pantry items data for user with UserId and sets pantryList.
    const getPantryItemsData = async () => {
        const res = await axios.get('http://localhost:8000/getPantryItems', {params: { "userId": userId}});
        setPantryList(res.data);
    };

    // Retrieves the list of only pantry items from pantryList data and sets pantryItemsOnly
    const getPantryItemsOnly = () => {
        let pantryArr = [];
        for (const pantryObj of pantryList) {
            pantryArr.push(pantryObj.pantryItem)
        }
        setPantryItemsOnly(pantryArr);
    }

    // Adds the item(s) to MongoDB database. First checks to see if the item(s) exists. If not, add item(s) to pantryList and DB
    const addPantryItemToDB = async (pantryItems) => {
        let pantryItemsArr = pantryItems.toLowerCase().split(",");
        pantryItemsArr =  pantryItemsArr.map(item => item.trim());
        for (const pantryItem of pantryItemsArr) {
            if (!pantryItemsOnly.includes(pantryItem)) {
                const json = JSON.stringify({userId, pantryItem});
                await axios.post('http://localhost:8000/createPantryItem', json,
                {headers: 
                    { "Content-Type": "application/json" }
                });
            } else {
                alert("Item already in pantry");
            }
            setTextInput("");
        }
    }

    // Deletes the pantryItem from the database with given id.
    const removeFavorite = async (id) => {
        await axios.delete('http://localhost:8000/deletePantryItem', {data: {"_id": id}}, 
        {headers: 
            { "Content-Type": "application/json" }
        }).then(
            getPantryItemsData()
        ).catch((err) => {
            console.error(err);
        });
    }

    // Updates display of pantry items whenever pantryList changes.
      useEffect(() => {
        getPantryItemsData();
        getPantryItemsOnly();
      }, [pantryList])
      

    return (
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
            <main className="pantry-main">
                <h2 className="welcome-prompt">Here's what we have in our pantry.</h2>
                <section className="pantry-section">
                    <div className="pantry-container">
                    <label className="input-label">Pantry Items</label>
                        <div className="pantry-item-container">
                            {pantryList.map(pantryData => 
                                <PantryItem key={pantryData._id} pantryItem={pantryData.pantryItem} id={pantryData._id} removeFavorite={removeFavorite}/>
                            )}
                        </div>
                        <div className="pantry-input-and-button-container">
                            <input className="input-area" id="pantryItemTextInput" placeholder="ex. butter" onChange={e => setTextInput(e.target.value)} value={textInput} onKeyDown={handleEnter}></input>
                            <button className="pantry-button" onClick={handleButtonClick}>Add item</button>
                        </div>
                    </div>
                </section>
            </main>
        </motion.div>
    )
}

export default Pantry;