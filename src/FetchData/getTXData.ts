import { Transaction, TransactionInput, TransactionOutput } from "./Types";

const proxyUrl = "https://cors-anywhere.herokuapp.com/";
export const formatProxyURL = (actualURL: string) => {
  return proxyUrl + actualURL;
}

function parseCSVAndGetColumn(csvData: string, columnIndex: number) {
  const rows = csvData.split('\n');
  const columnArray: Array<string> = [];

  rows.forEach(row => {
    const columns = row.split(',');
    if (columns.length > columnIndex) {
      columnArray.push(columns[columnIndex]);
    }
  });

  return columnArray;
}

const loadBadAddresses = async () => {
  const url = 'https://www.bitcoinabuse.com/api/download/1d?api_token=';
  const api_key = '1aQ4pCEjVpAFupqxdQuQuJxeAKm3cgyOxDlu7vCZ';
  try {
    const res = await fetch(`${url}${api_key}`);
    const csvData = await res.text();
    badAddresses = parseCSVAndGetColumn(csvData, 1);
    console.log("These are bad Bitcoin addresses for today. See what happens when you search one.");
    badAddresses.forEach((address) => {
      if (address !== 'address') {
        console.log(address);
      }
    });
    console.log("=== End Bad Addresses ===");
  } catch (err) {
    console.log("Couldn't fetch bad bitcoin address data.");
    console.log(err);
  }
}

// Gets populated with bad addresses on startup.
let badAddresses: Array<string> = [];
loadBadAddresses();


export const checkBTCAbuse = (address: string): boolean => {
  return badAddresses.includes(address);
}

//https://www.walletexplorer.com/ Has lots of wallets but no API

export async function getBTCTransactionData(tx_hash: string | number): Promise<Transaction> {
  const url = `https://blockchain.info/rawtx/${tx_hash}`;

  const response = await fetch(url);
  const data = await response.json();

  const tx: Transaction = {
    hash: data.hash,
    time: data.time,
    num_in:  data.vin_sz,
    num_out:  data.vout_sz,
    tx_index:  data.tx_index, //TRANSACTION INDEX OF THE WHOLE TRANSACTION
    value: 0,
    inputs:  [],
    outputs:  [],
  };


  let total_val = 0;

  for (let i = 0; i < data.inputs.length; i++) {
    const input = data.inputs[i];
    const tx_in: TransactionInput = {
      value: input.prev_out.value,
      tx_index: input.prev_out.tx_index, //TRANSACTION INDEX OF WHERE THIS INPUT CAME FROM, ie PREVIOUS TRANSACTION, WOULD EXPAND LEFT.
      where: input.prev_out.addr,
      bad_address: checkBTCAbuse(input.prev_out.addr),
    };

    total_val += tx_in.value;

    tx.inputs.push(tx_in);
  }

  for (let i = 0; i < data.out.length; i++) {
    const output = data.out[i];
    const tx_out: TransactionOutput = {
      value:  output.value,
      tx_index:  output.tx_index, //TRANSACTION INDEX OF THE WHOLE TRANSACTION
      where:  output.addr,
      bad_address: checkBTCAbuse(output.addr),
    };

    if (output.spending_outpoints.length !== 0) {
      tx_out.spend_tx = output.spending_outpoints[0].tx_index; //Need to update to handle multiple spendings -------------- //TRANSACTION INDEX OF WHERE THIS TRANSFERED MONEY WAS SPENT, EXPANDING RIGHT
    }

    tx.outputs.push(tx_out);
  }

  tx.value = total_val;

  return tx;
}


export async function getDOGETransactionData(hash: string | number): Promise<Transaction> {
  const url = `https://dogechain.info/api/v1/transaction/${hash}`;
  const response = await fetch(proxyUrl + url);
  const data = await response.json();


  //Output formatted data
  //print(json.dumps(data, indent=4))
  //print("                   #######################                           ")


  const tx: Transaction = {
    hash: data.transaction.hash,
    time: data.transaction.time,
    num_in: data.transaction.inputs_n,
    num_out: data.transaction.outputs_n, // May do different
    value: 0,
    inputs: [],
    outputs: [],
  };

  //tx["tx_index"] = data["tx_index"]

  var total_val = 0;
  for (let i = 0; i < data.transaction.inputs.length; i++) {
        const input = data.transaction.inputs[i];
        const tx_in: TransactionInput = {
          value: parseFloat(input.value),
          tx_index: input.previous_output.hash, // HASH of the trans where it came from
          where: input.address, // Who it came from
        };
        total_val += tx_in.value;
      
        tx.inputs.push(tx_in);
  }

  for(let i = 0; i < data.transaction.outputs.length; i++) {
    const output = data.transaction.outputs[i];
    const tx_out: TransactionOutput = {
      value: output.value,
      where: output.address,
    };

    // tx_out.tx_index = tx.hash;
    
    if (output.spent != null) {
        tx_out.spend_tx = output.spent.hash;
    }

    tx.outputs.push(tx_out);
  }

  tx.value = total_val;

  return tx;
}

