import React from "react";
import FavoritesEditMenu from "./FavoritesEditMenu";
import "./FavoriteCard.css";

function FavoriteCard(props) {
    const {userData, saveChanges, removeFavorite, favPrev, setFavPrev, Button} = props;
    return (
        <div className="favoriteCard" key={userData._id} id={userData._id}>
            <div id="favoriteCardHeader">
                <h3>{userData.recipeTitle}</h3>
                <div id="favoriteCardDateAndMenu">
                    <label id="dateCreatedLabel">Created on {userData.currentDate}</label>
                    <FavoritesEditMenu 
                        objectId={userData._id} 
                        removeFavorite={removeFavorite} 
                        userData={userData} 
                        favPrev={favPrev} 
                        setFavPrev={setFavPrev}  />
                </div>
            </div>
            <div className='favoriteCardTextClosed'>
                <p>{userData.recipeText}</p>
            </div>
            <div className="saveButtonContainerHidden">
                <Button action={() => {saveChanges(userData._id);}} title={"Save changes"}/>
            </div>
        </div>
    )
} 

export default FavoriteCard;