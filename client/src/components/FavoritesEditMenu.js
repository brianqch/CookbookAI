import React, { useState, useEffect } from "react";
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

function FavoritesEditMenu(props) {
    // const {objectId, removeFavorite, userData, favPrev, setFavPrev, isEditing, setEditing} = props;
    const {mode, setMode, favoriteActive, setFavoriteActive} = props;
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    // const element = document.getElementById(objectId);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const viewLabel = mode === "openMode" || mode === "editMode" ? "Close recipe" : "View recipe";
    const editLabel = mode === "editMode" ? "Cancel edit" : "Edit recipe";

    const handleEditClick = () => {
        mode === "editMode" ? setMode("openMode") : setMode("editMode");
    }

    const handleCloseRecipe = () => {
        setMode("defaultMode");
        setFavoriteActive(null);

    }

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
            <MenuItem 
                onClick={
                    () => {
                        handleCloseRecipe(); handleClose();
                    }
                }>
                {viewLabel}
            </MenuItem>
            <MenuItem onClick={
                    () => {
                        handleEditClick(); handleClose();
                    }
                }>
                {editLabel}
                
            </MenuItem>
        </Menu>
        </div>
    );
    }

export default FavoritesEditMenu;