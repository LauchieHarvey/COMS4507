import {createTheme} from '@mui/material';

export const theme = createTheme({
    palette: {
        primary: {
            main: '#3b1c61',
        },
        secondary: {
            main: '#42611C' 
        }
    },
    components: {
        MuiButton: {
            defaultProps: {
                sx: {
                    textTransform: 'none',
                }
            }
        }
    }
});