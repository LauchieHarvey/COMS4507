async function checkBTCAbuse(address) {
  const url = 'https://www.bitcoinabuse.com/api/reports/check';
  const api_key = '1aQ4pCEjVpAFupqxdQuQuJxeAKm3cgyOxDlu7vCZ';

  const response = await fetch(`${url}?address=${address}&api_token=${api_key}`);
  const data = await response.json();

  //console.log(JSON.stringify(data, null, 4));

  return data.count > 0;
}

//https://www.walletexplorer.com/ Has lots of wallets but no API

async function getBTCTransactionData(tx_hash) {
  const url = `https://blockchain.info/rawtx/${tx_hash}`;

  const response = await fetch(url);
  const data = await response.json();

  const tx = {};

  tx.hash = data.hash;
  tx.time = data.time;
  tx.num_in = data.vin_sz;
  tx.num_out = data.vout_sz;
  tx.tx_index = data.tx_index;
  tx.inputs = [];
  tx.outputs = [];

  let total_val = 0;

  for (let i = 0; i < data.inputs.length; i++) {
    const input = data.inputs[i];
    const tx_in = {};

    tx_in.value = input.prev_out.value;
    tx_in.tx_index = input.prev_out.tx_index;
    total_val += tx_in.value;
    tx_in.where = input.prev_out.addr;
    tx_in.bad_address = await checkBTCAbuse(tx_in.where);

    tx.inputs.push(tx_in);
  }

  for (let i = 0; i < data.out.length; i++) {
    const output = data.out[i];
    const tx_out = {};

    tx_out.value = output.value;
    tx_out.tx_index = output.tx_index;
    tx_out.where = output.addr;
    tx_out.bad_address = await checkBTCAbuse(tx_out.where);

    if (output.spending_outpoints.length !== 0) {
      tx_out.spent = true;
      tx_out.spend_tx = output.spending_outpoints[0].tx_index; //Need to update to handle multiple spendings --------------
    }

    tx.outputs.push(tx_out);
  }

  tx.value = total_val;

  console.log(JSON.stringify(tx, null, 4));
  return tx;
}


async function getDOGETransactionData(hash) {
  const proxyUrl = "https://cors-anywhere.herokuapp.com/";
  const url = `https://dogechain.info/api/v1/transaction/${hash}`;
  const response = await fetch(proxyUrl + url);
  const data = await response.json();


  //Output formatted data
  //print(json.dumps(data, indent=4))
  //print("                   #######################                           ")


  const tx = {};

  tx.hash = data.transaction.hash;
  tx.time = data.transaction.time;
  tx.num_in = data.transaction.inputs_n;
  tx.num_out = data.transaction.outputs_n //May do different
  //tx["tx_index"] = data["tx_index"]
  tx.inputs = [];
  tx.outputs = [];

  var total_val = 0;
  for (let i = 0; i < data.transaction.inputs.length; i++) {
        input = data.transaction.inputs[i];
        tx_in = {};
        tx_in.value = input.value;
        tx_in.tx_index = input.previous_output.hash;  //HASH of the trans where it came from
        total_val += parseFloat(tx_in.value);
        tx_in.where = input.address; //Who it came from
        
      
        tx.inputs.push(tx_in);
  }

  for(let i = 0; i < data.transaction.outputs.length; i++) {
    output = data.transaction.outputs[i];
    tx_out = {};

    tx_out.value = output.value;
    tx_out.tx_index = tx.hash;
    tx_out.where = output.address;
    
    if (output.spent != null) {
        tx_out.spent = true;
        tx_out.spend_tx = output.spent.hash;
    }

    tx.outputs.push(tx_out);
  }

  tx.value = total_val;

  console.log(JSON.stringify(tx, null, 4));
  return tx;
}

