import { AppBar, Toolbar, Typography } from '@mui/material';
import React from 'react';

const HeaderBar = () => {
    return (
        <AppBar elevation={1} sx={{position: 'static'}}>
            <Toolbar variant="dense">
                <Typography variant="h1" component="div" sx={{ flexGrow: 1, fontSize: '1.5rem'}}>
                    Crypto-Vis
                </Typography>
            </Toolbar>
        </AppBar>
        );
}

export default HeaderBar;