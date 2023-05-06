async function checkBTCAbuse(address) {
  const url = 'https://www.bitcoinabuse.com/api/reports/check';
  const api_key = '1aQ4pCEjVpAFupqxdQuQuJxeAKm3cgyOxDlu7vCZ';

  const response = await fetch(`${url}?address=${address}&api_token=${api_key}`);
  const data = await response.json();

  console.log(JSON.stringify(data, null, 4));

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
      tx_out.spend_tx = output.spending_outpoints[0].tx_index;
    }

    tx.outputs.push(tx_out);
  }

  tx.value = total_val;

  console.log(JSON.stringify(tx, null, 4));
}


async function getETHTransactionData(txId) {
  
}

