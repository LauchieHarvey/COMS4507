import {createTheme} from '@mui/material';

export const theme = createTheme({
    palette: {
        primary: {
            main: "#f7931a",
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