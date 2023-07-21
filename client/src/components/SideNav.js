import React, {useState} from "react";
import Button from '@mui/material/Button';

import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';

import LogoutButton from "./LogoutButton";
import PantryButton from "./PantryButton";
import HomeButton from "./HomeButton";

function SideNav() {
    const [drawerStatus, setDrawerStatus] = useState(false);

    const burgerMenu = (
        <svg viewBox="0 0 100 80" width="40" height="20" className="burger-menu">
            <rect width="90" height="15"></rect>
            <rect y="30" width="90" height="15"></rect>
            <rect y="60" width="90" height="15"></rect>
        </svg>
    )

    const toggleDrawer = (open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
          return;
        }
    
        setDrawerStatus(prevDrawerStatus => !prevDrawerStatus);
      };

    const list =  (
        <Box
          sx={{ width: 250 }}
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          <List>
          <ListItem>
                <HomeButton/>
            </ListItem>
            <ListItem>
                <PantryButton/>
            </ListItem>
            <Divider/>
            <ListItem>
                <LogoutButton/>
            </ListItem>
          </List>
        </Box>
      );

    return (
        <>
            <Button onClick={toggleDrawer(true)}>{burgerMenu}</Button>
            <Drawer
                anchor={'right'}
                open={drawerStatus}
                onClose={toggleDrawer(false)}
            >   
                {list}
            </Drawer>
        </>
    )
}

export default SideNav;