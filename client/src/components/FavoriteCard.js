import React, {useState, useEffect} from "react";
import axios from "axios";
import FavoritesEditMenu from "./FavoritesEditMenu";
import "./FavoriteCard.css";

function FavoriteCard(props) {
    const {userData, id, removeFavorite, favoriteActive, setFavoriteActive, setEditsMade} = props;

    const [mode, setMode] = useState("defaultMode");

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
    )

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
    )

    const favoriteCardRegMode = (
        <div className="favorite-card" key={userData._id} id={userData._id}>
            <span className="favorite-card-header">
                <h3>{userData.recipeTitle}</h3>
            </span>
        </div>
    )

    const handleClick = () => {
        setMode(prevMode => prevMode === "openMode" || prevMode === "editMode" ? "defaultMode" : "openMode");
        setFavoriteActive(favoriteCardOpenMode);
    }


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

    useEffect(() => {
        if (favoriteActive && favoriteActive.props.id !== id) {
            setMode("defaultMode")
            return;
        }
    }, [favoriteActive])

    return (
        <div className="favorite-card-outer-container" onClick={handleClick}>
            {favoriteCardRegMode}
        </div>
    )
} 

export default FavoriteCard;
