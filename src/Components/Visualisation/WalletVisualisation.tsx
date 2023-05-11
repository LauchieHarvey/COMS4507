import { Box } from '@mui/material';
import Graph, { graphData } from 'react-graph-vis';
import React from 'react';

type WalletData = Partial<{
    addr: any;
    num_tx: any;
    bal_rec: any;
    bal_spent: any;
    fin_bal: any;
    txs: Array<{
        hash: string;
        value: number;
        input_tx: string;
        time: string;
    }>;
}>;

interface WalletVisualisationProps {
    loadAddrData: (addrHash: string) => Promise<WalletData>;
    addrHash: string;
}

const defaultGraphData = {
    nodes: [
        { id: 1, label: "Loading Wallet\nData..." },
    ],
    edges: []
};
const errorGraphData = {
    nodes: [
        { id: 1, label: "Failed to Load" },
    ],
    edges: []
};

const generateGraph = (walletData: WalletData) => {
    console.log("Wallet Data:");
    console.log(JSON.stringify(walletData));
    return {nodes: [{id: 1, label: "converted new\n data!"}], edges: []};
}

const WalletVisualisation = ({addrHash, loadAddrData}: WalletVisualisationProps) => {
    const [graph, setGraph] = React.useState<graphData>(defaultGraphData);
    const options = {}

    React.useEffect(() => {
        let cancel = false;
        loadAddrData(addrHash).then((walletData: WalletData | undefined) => {
            if (cancel) return;
            if (walletData == undefined) {
                setGraph(defaultGraphData);
            } else {
                setGraph(generateGraph(walletData));
            }
        }).catch((err) => {
            console.log(err);
            setGraph(errorGraphData);
        });
        return () => {
            cancel = true;
        }
    }, [addrHash, loadAddrData])


    return (
        <Box height="100vh">
            <Graph graph={graph} options={options}></Graph>
        </Box>
    );
}

export default WalletVisualisation;