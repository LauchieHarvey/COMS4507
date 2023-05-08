import { Box } from '@mui/material';
import React from 'react';
import Tree, {RawNodeDatum, CustomNodeElementProps} from 'react-d3-tree';
import { Typography } from '@mui/material';
import { Transaction } from '../../FetchData/Types';
import cloneDeep from 'lodash.clonedeep';


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

const WalletNode = (loadNodeTransaction: (txHash: number) => Promise<void>) => ({nodeDatum, onNodeClick, toggleNode}: CustomNodeElementProps) => {

    const handleNodeClick = (e: React.MouseEvent) => {
        console.log(`The node ${JSON.stringify(nodeDatum)} has been clicked.`);
        if (nodeDatum.attributes == undefined) {
            console.log("For some reason this node doesn't have any attributes.");
            console.log(JSON.stringify(nodeDatum));
            return;
        }
        if (nodeDatum.attributes.spend_tx) {
            loadNodeTransaction(parseInt(nodeDatum.attributes.spend_tx as string));
        }
        toggleNode();
        onNodeClick(e);
    }

    return (
        <>
            <circle r={15} onClick={handleNodeClick}></circle>
        </>

    )
}

interface VisualisationProps {
    txHash: string;
    loadTXData: (hash: string) => Promise<Transaction>;
};
 
const Visualisation = ({txHash, loadTXData}: VisualisationProps) => {
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
    }, [txHash]);

    const loadNodeTransaction = async (loadingSpendTX: number) => {
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
                        node.attributes = {...newNode.attributes};
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
                console.log(JSON.stringify(txData));
            }

        } catch (err) {
            console.log(`Failed when loading the transaction: ${loadingSpendTX}`);
            console.error(err);
        }
    }

    console.log("Tree Data on render:");
    console.log(JSON.stringify(treeData));

    return (
        <Box id="canvas" sx={{height: '90vh'}}>
            {treeData == undefined ? (
                <Typography>Could not load data for this Transaction hash.</Typography>
            ) : (
                <Tree
                    data={treeData}
                    orientation="horizontal"
                    renderCustomNodeElement={WalletNode(loadNodeTransaction)}
                ></Tree>
            )}
        </Box>
    )
}

export default Visualisation;