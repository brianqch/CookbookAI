import React, {useState, useEffect} from "react";
import axios from "axios";
import FavoritesEditMenu from "./FavoritesEditMenu";
import "./FavoriteCard.css";

// FavoriteCard component that contains information about recipes that the user has favorited. Handles MongoDB FavoriteCard HTTP requests.
function FavoriteCard(props) {
    const {userData, id, removeFavorite, favoriteActive, setFavoriteActive, setEditsMade} = props;

    const [mode, setMode] = useState("defaultMode");

    // Saves the edits made to this favorite card to DB. Sets editsMade to true to rerender exisiting favorites.
    const saveChanges = async () => {
        const userId = userData._id;
        const editedRecipeTitleContainer = document.getElementById("user-edited-recipe-title");
        const editedRecipeTextContainer = document.getElementById("user-edited-recipe-text");

        const recipeTitle = editedRecipeTitleContainer.children[0].innerHTML;
        const recipeText = editedRecipeTextContainer.children[0].innerHTML;

        const json = JSON.stringify({ userId, recipeTitle, recipeText });

        await axios
        .put('http://localhost:8000/saveEdits', json,
            {headers: 
                { "Content-Type": "application/json" }
            })
        .then(
            setMode("openMode"),
            setEditsMade(true),
            console.log("Saved changes")
        )
        .catch((err) => {
            console.error(err);
        });
    }

    // Handles user clicking the favoriteCard, setting it to active.
    const handleClick = () => {
        setMode(prevMode => prevMode === "openMode" || prevMode === "editMode" ? "defaultMode" : "openMode");
        setFavoriteActive(favoriteCardOpenMode);
    }

    // Div container for favoriteCard in openMode.
    const favoriteCardOpenMode = (
        <div className="favorite-card-active" key={userData._id} id={userData._id}>
            <span className="favorite-card-header">
                <div className="favorite-card-open-mode-box" id="open-recipe-title"><h3>{userData.recipeTitle}</h3></div>
                <FavoritesEditMenu id={id} mode={mode} setMode={setMode} setFavoriteActive={setFavoriteActive} removeFavorite={removeFavorite} setEditsMade={setEditsMade}/>
            </span>
            <div className="favorite-card-details">
                <div className="favorite-card-open-mode-box" id="open-recipe-text"><p>{userData.recipeText}</p></div>
            </div>
        </div>
    );

    // Div container for favoriteCard in editMode.
    const favoriteCardEditMode = (
        <div className="favorite-card-active" key={userData._id} id={userData._id}>
            <span className="favorite-card-header">
                <div                     
                    className="favorite-card-edit-mode-box" 
                    id="user-edited-recipe-title" 
                    contentEditable="true"
                    suppressContentEditableWarning={true}
                >
                    <h3>{userData.recipeTitle}</h3>
                </div>
                <FavoritesEditMenu id={id} mode={mode} setMode={setMode} favoriteActive={favoriteActive} setFavoriteActive={setFavoriteActive} removeFavorite={removeFavorite} setEditsMade={setEditsMade}/>
            </span>
            <div className="favorite-card-details">
                <div 
                    className="favorite-card-edit-mode-box" 
                    id="user-edited-recipe-text" 
                    contentEditable="true"
                    suppressContentEditableWarning={true}
                >
                    <p>{userData.recipeText}</p>
                </div>
            </div>
            <button className="input-button" onClick={saveChanges}> Save changes </button>
        </div>
    );
    
    // Div container for favoriteCard in defaultMode
    const favoriteCardDefaultMode = (
        <div className="favorite-card" key={userData._id} id={userData._id}>
            <span className="favorite-card-header">
                <h3>{userData.recipeTitle}</h3>
            </span>
        </div>
    );

    // Sets appropriate active favoriteCard based on mode.
    useEffect(() => {
        switch(mode) {
            case "editMode":
                setFavoriteActive(favoriteCardEditMode);
                break;
            case "openMode":
                setFavoriteActive(favoriteCardOpenMode);
                break;
            default:
                break;
        }
    }, [mode])

    // Sets all other favoriteCards back to defaultMode.
    useEffect(() => {
        if (favoriteActive && favoriteActive.props.id !== id) {
            setMode("defaultMode")
            return;
        }
    }, [favoriteActive])

    return (
        <div className="favorite-card-outer-container" onClick={handleClick}>
            {favoriteCardDefaultMode}
        </div>
    )
} 

export default FavoriteCard;
