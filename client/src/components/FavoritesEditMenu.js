import React, { useState } from "react";
import Button from '@mui/material/Button';
import ButtonComponent from "./Button";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

function FavoritesEditMenu(props) {
    const {objectId, openOrClose, removeFavorite, openOrCloseLabel, setLabel, userData, isEditing, setEditing} = props;
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleEdit = (objectId) => {
        setEditing(true);
        const element = document.getElementById(objectId);
        const favCardHeader = element.children[0];
        const favCardTextOpen = element.children[1];
        const favCardTextOpenP = favCardTextOpen.children[0]
        const heading = favCardHeader.children[0];
        
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

    return (
        <div>
        <Button
            id="basic-button"
            aria-controls={open ? 'basic-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={handleClick}
        >
            <img width="30px" src="/assets/editmenuicon.png"/>
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
            <MenuItem onClick={() => {openOrClose(objectId); handleClose();}}>{openOrCloseLabel}</MenuItem>
            <MenuItem onClick={() => {handleEdit(objectId); handleClose();}}>Edit</MenuItem>
            <MenuItem onClick={() => {removeFavorite(objectId); handleClose();}}>Remove</MenuItem>
        </Menu>
        </div>
    );
    }

export default FavoritesEditMenu;