/**
 * @member value The monetary value of this transaction. (TODO: Define units).
 * @member tx_index The index of the transaction in the block.
 * @member where Wallet address.
 */
export type TransactionInput = {
    value: number;
    tx_index?: number;
    where: string; 
    bad_address?: boolean;
    walletAddr?: string;
};

export type TransactionOutput = {
    value: number;
    tx_index?: number;
    spend_tx?: number; 
    where: string;
    bad_address?: boolean;
};

/**
 * Transaction type.
 * @member num_in The number of transaction inputs.
 * @member num_out The number of transaction outputs.
 */
export type Transaction = {
    hash: string;
    time: number;
    num_in: number;
    num_out: number;
    tx_index?: number;
    inputs: Array<TransactionInput>;
    outputs: Array<TransactionOutput>;
    value: number;
};