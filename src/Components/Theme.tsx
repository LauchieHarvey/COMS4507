import {createTheme} from '@mui/material';

export const theme = createTheme({
    palette: {
        primary: {
            main: '#3b1c61',
        },
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