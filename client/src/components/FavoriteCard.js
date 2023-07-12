import React, {useState} from "react";
import axios from "axios";
import FavoritesEditMenu from "./FavoritesEditMenu";
import "./FavoriteCard.css";

function FavoriteCard(props) {
    const {userData, removeFavorite, favPrev, setFavPrev, Button} = props;
    const [isEditing, setEditing] = useState(false);

    const saveChanges = async (objectId) => {
        const element = document.getElementById(objectId);
        const favCardHeader = element.children[0];
        const favCardHeading = favCardHeader.children[0];
        const recipeTitle = favCardHeading.value;
        const favCardTextOpen = element.children[1];
        const favCardTextOpenP = favCardTextOpen.children[0];
        const recipeText = favCardTextOpenP.value;

        const userId = objectId;
        const json = JSON.stringify({ userId, recipeTitle, recipeText })

        let favCardHeadingPrev = favPrev.shift();
        let favCardTextPrev = favPrev.shift();

        favCardHeadingPrev.innerHTML = recipeTitle;
        favCardTextPrev.innerHTML = recipeText;

        console.log(favCardHeadingPrev);
        console.log(favCardTextPrev);


        favCardHeading.parentNode.replaceChild(favCardHeadingPrev, favCardHeading);
        favCardTextOpenP.parentNode.replaceChild(favCardTextPrev, favCardTextOpenP);

        const saveButtonContainer = element.children[2];
        saveButtonContainer.className = "saveButtonContainerHidden";
        setEditing(false);

        await axios
            .put('http://localhost:8000/saveEdits', json,
                {headers: 
                    { "Content-Type": "application/json" }
                })
            .then(
                console.log("Saved changes")
            )
            .catch((err) => {
                console.error(err);
            });
        
    };

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
                        setFavPrev={setFavPrev}
                        isEditing={isEditing}
                        setEditing={setEditing}  />
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