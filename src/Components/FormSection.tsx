import { Box, TextField, Typography, ButtonGroup, IconButton, Button, RadioGroup, Radio } from '@mui/material';
import CurrencyBitcoinIcon from '@mui/icons-material/CurrencyBitcoin';
import React from 'react';

export type Coin = 'bitcoin' | 'dogecoin';

export type UserInput = {
  coin: Coin,
  text: string,
  type: 'walletAddress' | 'transactionHash',
};

export interface FormSectionProps {
    userInput: UserInput;
    setUserInput: (userInput: UserInput) => void;
};

const FormSection = ({userInput, setUserInput}: FormSectionProps) => {
    const [text, setText] = React.useState<string>(userInput.text);

    const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setText(e.target.value ?? '');
    }

    const handleSubmit = (coin: Coin) => {
        // TODO: Support button for switching between transaction and wallet address.
        setUserInput({coin: coin, text: text, type: 'transactionHash'});
    }

    return (
        <Box sx={{
                width: '100%',
                display: 'flex',
                height: {xs: '50%', sm: '25%', md: '15%', lg: '10%'},
                alignItems: "center",
                gap: 1,
                marginX: '20px',
            }}
            >
            <TextField placeholder="TX Hash or Wallet Address" onChange={handleTextChange} value={text} sx={{minWidth: {lg: '500px', md: '400px', sm: '300px', xs: '200px'}}}/>
            <Box sx={{display: 'flex', flexDirection: 'column'}}>
                <Typography alignSelf="center">Search For</Typography>
                <ButtonGroup variant="contained">
                    <Button onClick={() => handleSubmit('bitcoin')}>
                        <CurrencyBitcoinIcon/>
                        <Typography component="span" sx={{textDecorationLine: userInput?.coin === 'bitcoin' ? 'underline' : 'none'}}>
                            Bitcoin
                        </Typography>
                    </Button>
                    <Button onClick={() => handleSubmit('dogecoin')}>
                        <Typography component="span" fontWeight="bold" marginRight="5px">Ð</Typography>
                        <Typography component="span" sx={{textDecorationLine: userInput?.coin === 'dogecoin' ? 'underline' : 'none'}}>
                            Doge Coin
                        </Typography>
                    </Button>
                </ButtonGroup>
            </Box>
        </Box>
    );
}

export default FormSection;