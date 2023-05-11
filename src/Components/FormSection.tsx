import { Box, TextField, Typography, ButtonGroup, IconButton, Button, RadioGroup, Radio, Switch, FormControl, FormLabel, FormControlLabel } from '@mui/material';
import CurrencyBitcoinIcon from '@mui/icons-material/CurrencyBitcoin';
import React from 'react';

export type Coin = 'bitcoin' | 'dogecoin';

export type HashType = 'walletAddress' | 'transactionHash';

export type UserInput = {
  coin: Coin,
  text: string,
  type: HashType,
};

export interface FormSectionProps {
    userInput: UserInput;
    setUserInput: (userInput: UserInput) => void;
};

const FormSection = ({userInput, setUserInput}: FormSectionProps) => {
    const [text, setText] = React.useState<string>(userInput.text);
    const [textType, setTextType] = React.useState<HashType>(userInput.type);

    const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setText(e.target.value ?? '');
    }

    const handleSetTextType = (e: React.ChangeEvent<HTMLInputElement>, value: string) => {
        setTextType(value as HashType);        
    }

    const handleSubmit = (coin: Coin) => {
        setUserInput({coin: coin, text: text, type: textType});
    }

    return (
        <Box sx={{
                width: '100%',
                display: 'flex',
                height: {xs: '50%', sm: '25%', md: '15%', lg: '10%'},
                gap: 5,
                marginX: '20px',
            }}
            >
            <TextField placeholder="TX Hash or Wallet Address" onChange={handleTextChange} value={text} sx={{minWidth: {lg: '500px', md: '400px', sm: '300px', xs: '200px', alignSelf: 'center'}}}/>
            <Box sx={{display: 'flex', flexDirection: 'column', marginTop: '12px'}}>
                <Typography alignSelf="center">Search {textType === 'transactionHash' ? 'Transaction Hash' : 'Wallet Address'}</Typography>
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
            <FormControl sx={{alignSelf: 'center'}}>
                <FormLabel id="demo-controlled-radio-buttons-group">Input Type</FormLabel>
                <RadioGroup
                    aria-labelledby="demo-controlled-radio-buttons-group"
                    name="controlled-radio-buttons-group"
                    value={textType}
                    onChange={handleSetTextType}
                    row
                >
                    <FormControlLabel value="transactionHash" control={<Radio />} label="Transaction Hash"/>
                    <FormControlLabel value="walletAddress" control={<Radio />} label="Wallet Address"/>
                </RadioGroup>
            </FormControl>
        </Box>
    );
}

export default FormSection;