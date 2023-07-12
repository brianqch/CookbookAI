import React, { useState } from "react";
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

function FavoritesEditMenu(props) {
    const {objectId, removeFavorite, userData, favPrev, setFavPrev, isEditing, setEditing} = props;
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const element = document.getElementById(objectId);
    const [isOpen, setOpenStatus] = useState(false);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const openOrClose = (elementId) => {
        const element = document.getElementById(elementId);
        const favoriteCardText = element.children[1];

        if (favPrev.length > 0) {
            handleCancelEdit(elementId);
        }

        if (favoriteCardText.className === "favoriteCardTextOpen") {
            favoriteCardText.className = "favoriteCardTextClosed";
            element.style.flexDirection = "row";
            setOpenStatus(false);
        } else {
            favoriteCardText.className = "favoriteCardTextOpen";
            element.style.flexDirection = "column";
            setOpenStatus(true);
        }
    };

    const handleEdit = (objectId) => {
        setEditing(true);
        setOpenStatus(true);
        const favCardHeader = element.children[0];
        const favoriteCardText = element.children[1];
        if (favoriteCardText.className === "favoriteCardTextClosed") {
            favoriteCardText.className = "favoriteCardTextOpen";
            element.style.flexDirection = "column";
            element.setAttribute("favStatus", "Open");
        }
        const favCardTextOpenP = favoriteCardText.children[0];
        const heading = favCardHeader.children[0];

        const favCardTextOpenPClone = favCardTextOpenP.cloneNode(true);
        const headingClone = heading.cloneNode(true);

        let tempFavPrev = [];
        tempFavPrev.push(headingClone);
        tempFavPrev.push(favCardTextOpenPClone);
        setFavPrev(tempFavPrev);

        console.log(favPrev);
        
        const editRecipeTitle = document.createElement("input");
        editRecipeTitle.className = "editHeadingBox";
        editRecipeTitle.value = userData.recipeTitle;

        const editRecipeText = document.createElement("textarea");
        editRecipeText.className = "editRecipeTextBox";
        editRecipeText.value = userData.recipeText;

        element.style.padding = "1rem 3rem";

        heading.parentNode.replaceChild(editRecipeTitle, heading);
        favCardTextOpenP.parentNode.replaceChild(editRecipeText, favCardTextOpenP);

        editRecipeText.style.height = editRecipeText.scrollHeight + "px";
        editRecipeText.addEventListener("input", function (e) {
            this.style.height = "auto";
            this.style.height = this.scrollHeight + "px";
          });

        const saveButtonContainer = element.children[2];
        if (saveButtonContainer.className === "saveButtonContainerHidden") {
            saveButtonContainer.className = "saveButtonContainerShown"
        } else {
            saveButtonContainer.className = "saveButtonContainerHidden"
        }
    };

    const handleCancelEdit = (objectId) => {
        setEditing(false);
        const element = document.getElementById(objectId);
        const header = element.children[0];
        const heading = header.children[0];
        const favoriteCardText = element.children[1];
        const favCardTextOpenP = favoriteCardText.children[0]

        console.log(favPrev);

        const favCardHeading = favPrev.shift();
        const favCardText = favPrev.shift();

        heading.parentNode.replaceChild(favCardHeading, heading);
        favCardTextOpenP.parentNode.replaceChild(favCardText, favCardTextOpenP);
        element.style.padding = "1rem 4rem";

        const saveButtonContainer = element.children[2];
        saveButtonContainer.className = "saveButtonContainerHidden";

        setFavPrev([]);
    };


    return (
        <div>
        <Button
            id="basic-button"
            aria-controls={open ? 'basic-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={handleClick}
        >
            <img width="30px" src="/assets/editmenuicon.png" alt="editMenuIcon"/>
        </Button>
        <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
            'aria-labelledby': 'basic-button',
            }}
        >
            <MenuItem onClick={() => {handleClose(); openOrClose(objectId);}}>{isOpen ? "Close recipe" : "View recipe"}</MenuItem>
            <MenuItem onClick={() => {isEditing ? handleCancelEdit(objectId) : handleEdit(objectId); handleClose();}}>{isEditing ? "Cancel edit": "Edit recipe"}</MenuItem>
            <MenuItem onClick={() => {removeFavorite(objectId); handleClose();}}>Remove</MenuItem>
        </Menu>
        </div>
    );
    }

export default FavoritesEditMenu;