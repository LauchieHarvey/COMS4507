import { Box } from '@mui/material';
import React from 'react';
import Tree, {RawNodeDatum, CustomNodeElementProps} from 'react-d3-tree';
import { Typography } from '@mui/material';
import { Transaction } from '../../FetchData/Types';
import cloneDeep from 'lodash.clonedeep';
import { formatHashString, formatTime } from './utils';


/**
 * Converts a single transaction into a single node.
 * 
 * @param data The transaction to visually represent.
 * @returns The Raw tree node data that react-d3-tree will use to display the node.
 */
const convertDataToRawNodeDatum = (data: Transaction): RawNodeDatum => {
    const treeData: RawNodeDatum = {
        name: data.hash,
        attributes: {
            time: data.time,
            tx_hash: data.hash,
            tx_index: data.tx_index ?? -1,
            num_in: data.num_in,
            num_out: data.num_out,
            value: data.value,
        },
        children: [],
    };

    // Add the outputs as leaf nodes.
    for (let i = 0; i < data.outputs.length; ++i) {
        const txOutput = data.outputs[i];
        const rawOutput: RawNodeDatum = {
            name: txOutput.where,
            attributes: {
                value: txOutput.value,
                walletAddr: txOutput.where,
            }
        }
        if (txOutput.bad_address) {
            rawOutput.attributes!.bad_address = txOutput.bad_address;
        }
        if (txOutput.spend_tx) {
            rawOutput.attributes!.spend_tx = txOutput.spend_tx;
        }
        treeData.children!.push(rawOutput);
    }

    return treeData;
}

const WalletNode = (loadNodeTransaction: (txHash: number | string) => Promise<void>, currency: string) => ({nodeDatum, onNodeClick, toggleNode}: CustomNodeElementProps) => {

    const handleNodeClick = (e: React.MouseEvent) => {
        if (nodeDatum.attributes == undefined) {
            console.log("For some reason this node doesn't have any attributes.");
            console.log(JSON.stringify(nodeDatum));
            return;
        }
        if (nodeDatum.attributes.spend_tx) {
            let hashToRequest = nodeDatum.attributes.spend_tx;
            if (currency === 'sat') hashToRequest = parseInt(hashToRequest as string);
            loadNodeTransaction(nodeDatum.attributes.spend_tx as string);
        }
        toggleNode();
        onNodeClick(e);
    }

    const nodeHasLoadableChildren = nodeDatum.attributes?.spend_tx !== undefined;
    const nodeHasChildrenLoaded = nodeDatum.children && nodeDatum.children.length > 0;
    let tx_index = nodeDatum.attributes?.tx_index;
    if (tx_index == undefined || tx_index == -1) {
        tx_index = 'unknown';
    }
    const valueIn = nodeDatum.attributes?.value ?? 'unknown';
    const date = formatTime(nodeDatum.attributes?.time as number);
    const walletAddress = nodeDatum.attributes?.walletAddr;
    const shortenedWalletAddress = formatHashString(walletAddress as string);
    const xPos = -60;
    let yPos = 40;

    const nodeIsExpandable = nodeHasChildrenLoaded || nodeHasLoadableChildren;
    const isBadAddress = nodeDatum.attributes?.bad_address ?? false;

    return (
        <g>
            <circle r={15} onClick={handleNodeClick} style={nodeIsExpandable ? {cursor: 'pointer'} : {cursor: 'default'}} fill={isBadAddress ? '#ee0000' : undefined}></circle>
            <g>
                <text x={xPos} dy={yPos}>Wallet #: {shortenedWalletAddress}</text>
                <text x={xPos} dy={yPos + 20}>Value In: {valueIn}{` ${currency}`}</text>
                {nodeHasChildrenLoaded && (
                    <>
                        <text x={xPos} dy={yPos + 40}>Date: {date}</text>
                        <text key="txIndx" x={xPos} dy={yPos + 60}>Transaction Index: {tx_index}</text>
                        <text key="out-val" x={xPos} dy={yPos + 80}>Output Values:</text>
                        {nodeDatum.children?.map((childNode, index) => {
                            const value = childNode.attributes?.value ?? 'unkown';
                            const childNodeName = `${childNode.name.slice(0,5)}...`;
                            return (
                                <text key={`outval-${index}`} x={xPos + 10} dy={yPos + 100 + 20 * index}>To {childNodeName}: {value}</text>
                            );
                        })}
                    </>
                )}
            </g>
        </g>

    )
}

interface VisualisationProps {
    txHash: string;
    loadTXData: (hash: string | number) => Promise<Transaction>;
    currency: string;
};
 
const Visualisation = ({txHash, loadTXData, currency}: VisualisationProps) => {
    const [treeData, setTreeData] = React.useState<RawNodeDatum | undefined>();

    React.useEffect(() => {
        let cancel = false;
        loadTXData(txHash).then((tx: Transaction | undefined) => {
            if (cancel) return;
            if (tx == undefined) {
                setTreeData(undefined);
            } else {
                setTreeData(convertDataToRawNodeDatum(tx));
            }
        }).catch((err) => {
            console.log(err);
            setTreeData(undefined);
        });
        return () => {
            cancel = true;
        }
    }, [txHash, loadTXData]);

    const loadNodeTransaction = async (loadingSpendTX: number | string) => {
        try {
            const txData = await loadTXData(loadingSpendTX.toString());
            if (txData) {
                const clonedTreeData = cloneDeep(treeData); // Create a deep copy of prevTreeData

                // Find the target node and update its children
                const findAndUpdateChildren = (node: RawNodeDatum | undefined): boolean => {
                    if (!node) return false;
                    if (node.attributes && node.attributes.spend_tx === loadingSpendTX) {
                        const newNode = convertDataToRawNodeDatum(txData);
                        node.name = newNode.name;
                        node.attributes = {
                            walletAddr: node.attributes.walletAddr,
                            bad_address: node.attributes.bad_address ?? false,
                            ...newNode.attributes
                        };
                        node.children = newNode.children ? [...newNode.children] : [];
                        return true; // Indicates that the target node was found and updated
                    }
                    return (node.children || []).some((child) => findAndUpdateChildren(child));
                };
        
                // Perform the search and update operation on the cloned object
                findAndUpdateChildren(clonedTreeData);
                setTreeData(clonedTreeData);
            
            } else {
                console.log("No TX data returned.");
            }

        } catch (err) {
            console.log(`Failed when loading the transaction: ${loadingSpendTX}`);
            console.error(err);
        }
    }

    return (
        <Box id="canvas" sx={{height: '100vh'}}>
            {treeData == undefined ? (
                <Typography>Could not load data for this Transaction hash.</Typography>
            ) : (
                <Tree
                    data={treeData}
                    orientation="horizontal"
                    depthFactor={350}
                    separation={{siblings: 2, nonSiblings: 2}}
                    renderCustomNodeElement={WalletNode(loadNodeTransaction, currency)}
                ></Tree>
            )}
        </Box>
    )
}

export default Visualisation;