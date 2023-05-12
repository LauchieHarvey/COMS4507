import { Box, useTheme } from '@mui/material';
import Graph, { graphData, graphEvents } from 'react-graph-vis';
import { formatHashString } from './utils';
import 'vis-network/styles/vis-network.css';
import React from 'react';

type WalletTransactionData = Partial<{
    hash: string;
    value: number;
    input_tx: boolean;
    time: string;
}>;

type WalletData = Partial<{
    addr: any;
    num_tx: any;
    bal_rec: any;
    bal_spent: any;
    fin_bal: any;
    txs: Array<WalletTransactionData>;
}>;

const defaultGraphData = {
    nodes: [
        { id: 1, label: "Loading Wallet\nData...", group: 'wallet'},
    ],
    edges: []
};
const errorGraphData = {
    nodes: [
        { id: 1, label: "Failed to Load", group: 'wallet'},
    ],
    edges: []
};

const createWalletNodeLabel = (walletData: WalletData): string => {
    let numOutgoingTransactions: number | string = 'unkown';
    let numIncomingTransactions: number | string = 'unkown';
    if (walletData.txs) {
        numOutgoingTransactions = walletData.txs.filter((tx) => !tx.input_tx).length;
        numIncomingTransactions = (walletData.num_tx ?? walletData.txs.length) - numOutgoingTransactions;
    }
    const shortenedWalletAddress = formatHashString(walletData.addr);
    return [
        `Address: ${shortenedWalletAddress}`,
        `Balance: ${walletData.fin_bal ?? 'unknown'}`,
        `Total transactions: ${walletData.num_tx ?? 'unknown'}`,
        `outgoing: ${numOutgoingTransactions ?? 'unknown'}`,
        `incoming: ${numIncomingTransactions ?? 'unknown'}`

    ].join('\n');
}

const createTransactionLabel = (txData: WalletTransactionData, initial: boolean, currency: string) => {
    const directionText = txData.input_tx ? 'Incoming' : 'Outgoing';
    if (initial) {
        return `${txData.value} ${currency}`;
    }
    return [
        `${directionText} transaction.`,
        `Hash: ${formatHashString(txData.hash)}`,
        `Time: ${txData.time}`,
        `Value: ${txData.value}`
    ].join('\n');
}

const generateGraph = (walletData: WalletData, currency: string) => {
    console.log("== Wallet Data ==");
    console.log(JSON.stringify(walletData, null, 2));
    console.log("======");
    let nodes: any[] = [];
    let edges: any[] = [];
    // Push the Wallet node.
    nodes.push({id: 1, label: createWalletNodeLabel(walletData), group: 'wallet'});
    if (walletData.txs) {
        // Push the transaction nodes.
        for (let i = 0; i < walletData.txs.length; ++i) {
            const input_tx = walletData.txs[i].input_tx;
            nodes.push(
                {
                    id: i + 2,
                    label: createTransactionLabel(walletData.txs[i], true, currency),
                    group: input_tx ? 'incoming' : 'outgoing',
                    title: createTransactionLabel(walletData.txs[i], false, currency)
                }
            );
            edges.push(input_tx ? {from: i + 2, to: 1} : {from: 1, to: i + 2});
        }
    }
    return {nodes: nodes, edges: edges};
}

interface WalletVisualisationProps {
    loadAddrData: (addrHash: string) => Promise<WalletData>;
    addrHash: string;
    currency: string
}

const WalletVisualisation = ({addrHash, loadAddrData, currency}: WalletVisualisationProps) => {
    const [graph, setGraph] = React.useState<graphData>(defaultGraphData);
    const theme = useTheme();
    const options = {
        physics: false, 
        groups: {
            incoming: {color: theme.palette.secondary.light, font: {color: theme.palette.secondary.contrastText}},
            wallet: {color: theme.palette.primary.light, font: {color: theme.palette.primary.contrastText}},
            outgoing: {color: theme.palette.secondary.contrastText, font: {color: theme.palette.secondary.light}},
        },
        tooltip: true,
    };

    React.useEffect(() => {
        let cancel = false;
        loadAddrData(addrHash).then((walletData: WalletData | undefined) => {
            if (cancel) return;
            if (walletData == undefined) {
                setGraph(defaultGraphData);
            } else {
                setGraph(generateGraph(walletData, currency));
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
            <Graph key={Math.random()} graph={graph} options={options}></Graph>
        </Box>
    );
}

export default WalletVisualisation;