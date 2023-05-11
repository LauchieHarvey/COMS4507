import { Typography } from '@mui/material';
import React from 'react';

interface WalletVisualisationProps {
    loadAddrData: () => void;
    addrHash: string;
}

const WalletVisualisation = ({addrHash, loadAddrData}: WalletVisualisationProps) => {


    return (
        <Typography variant="h1" component="div" sx={{ flexGrow: 1, fontSize: '1.5rem'}}>
            The current hash is {addrHash}
        </Typography>
    );
}

export default WalletVisualisation;