import { AppBar, Toolbar, IconButton, Typography, Button } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import React from 'react';


const HeaderBar = () => {
    return (
        <AppBar position="static" >
            <Toolbar variant="dense">
                <IconButton
                    size="small"
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    sx={{ mr: 2 }}
                >
                    <MenuIcon />
                </IconButton>
                <Typography variant="h1" component="div" sx={{ flexGrow: 1, fontSize: '1.5rem'}}>
                    Crypto-Vis
                </Typography>
            </Toolbar>
        </AppBar>
        );
}

export default HeaderBar;