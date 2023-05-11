import { Box } from '@mui/material';
import Graph from 'react-graph-vis';
import React from 'react';

interface WalletVisualisationProps {
    loadAddrData: () => void;
    addrHash: string;
}

const WalletVisualisation = ({addrHash, loadAddrData}: WalletVisualisationProps) => {
    const graph = {
        nodes: [
            { id: 1, label: "Node 1\nvalue: 50", title: "node 1 tootip text" },
            { id: 2, label: "Node 2", title: "node 2 tootip text" },
            { id: 3, label: "Node 3", title: "node 3 tootip text" },
            { id: 4, label: "Node 4", title: "node 4 tootip text" },
            { id: 5, label: "Node 5", title: "node 5 tootip text" }
        ],
        edges: [
            { from: 1, to: 2 },
            { from: 1, to: 3 },
            { from: 4, to: 1 },
            { from: 5, to: 1 }  
        ]
    }
    const options = {}


    return (
        <Box height="100vh">
            <Graph graph={graph} options={options}></Graph>
        </Box>
    );
}

export default WalletVisualisation;