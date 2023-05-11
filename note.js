async function getBTCAddressData(address) {
    const url = `https://blockchain.info/rawaddr/${address}`;
  
    const response = await fetch(url);
    const data = await response.json();
    
    const ad = {
      addr: data.address,
      num_tx: data.n_tx,
      bal_rec: data.total_received,
      bal_spent: data.total_sent,
      fin_bal: data.final_balance,
      txs: []
    };
  
    for (let i = 0; i < data.txs.length; i++) {
      const tx = data.txs[i];
      let input_tx = true; // Initialize as not an input
      let val = 0;
      for (let j = 0; j < tx.outs.length; j++) {
        const out_tx = tx.outs[j];
        val += out_tx.value;
        if (out_tx.addr === address) {
          input_tx = false;
        }
      }
      const disp_tx = {
        hash: tx.hash,
        value: val,
        input_tx: input_tx,
        time: tx.time
      };
      ad.txs.push(disp_tx);
    }
  
    return ad;
}
  
  async function getDOGEAddressData(address) {
    const url = 'https://dogechain.info/api/v1/address/';
  
    let response = await fetch(url + 'balance/' + address);
    let data = await response.json();
    
    const ad = {
      addr: address,
      fin_bal: data.final_balance,
      txs: []
    };
  
    response = await fetch(url + 'received/' + address);
    data = await response.json();
  
    ad.bal_rec = data.received;
  
    response = await fetch(url + 'sent/' + address);
    data = await response.json();
  
    ad.bal_spent = data.sent;
  
    response = await fetch(url + 'transactions/' + address);
    data = await response.json();
    
    for (let i = 0; i < data.transactions.length; i++) {
      const tx_hash = data.transactions[i].hash;
      response = await fetch('https://dogechain.info/api/v1/transaction/' + tx_hash);
      data = await response.json();
      const tx = data;
      let input_tx = true; // Initialize as not an input
      let val = tx.inputs_value;
      for (let j = 0; j < tx.outputs.length; j++) {
        const out_tx = tx.outputs[j];
        val += out_tx.value;
        if (out_tx.addr === address) {
          input_tx = false;
        }
      }
      const disp_tx = {
        hash: tx.hash,
        value: val,
        input_tx: input_tx,
        time: tx.time
      };
      ad.txs.push(disp_tx);
    }
  
    return ad;
  }