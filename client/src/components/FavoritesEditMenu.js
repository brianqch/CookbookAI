import React, { useState } from "react";
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

function FavoritesEditMenu(props) {
    const {id, mode, setMode, setFavoriteActive, removeFavorite, setEditsMade} = props;
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

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

    const handleRemoveFavorite = () => {
        removeFavorite(id);
        setEditsMade(true);
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
            <MenuItem onClick={
                    () => {
                        handleRemoveFavorite(); handleClose();
                    }
                }>
                {"Remove favorite"}
            </MenuItem>
        </Menu>
        </div>
    );
    }

export default FavoritesEditMenu;