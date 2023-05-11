import HeaderBar from "./Components/Header";
import FormSection, { UserInput } from "./Components/FormSection";
import {theme} from "./Components/Theme";
import {ThemeProvider} from '@mui/material/styles';
import {Box} from '@mui/material';
import TransactionVisualisation from "./Components/Visualisation/TransactionVisualisation";
import WalletVisualisation from "./Components/Visualisation/WalletVisualisation";
import {getBTCTransactionData, getDOGETransactionData} from "./FetchData/getTXData";
import {getBTCAddressData, getDOGEAddressData} from './FetchData/note';
import React from 'react';


function App() {
  const [userInput, setUserInput] = React.useState<UserInput>({coin: 'bitcoin', text: '3886957229608510', type: 'transactionHash'});

  const txLoadFn = userInput.coin === 'bitcoin' ? getBTCTransactionData : getDOGETransactionData;
  const addrLoadFn = userInput.coin === 'bitcoin' ? getBTCAddressData : getDOGEAddressData;

  return (
    <div className="App" style={{height: '100vh', overflow: 'hidden'}}>
      <ThemeProvider theme={theme}>
        <HeaderBar></HeaderBar>
        <FormSection userInput={userInput} setUserInput={setUserInput}></FormSection>
        <Box sx={{border: '1px solid black', height: '100vh'}}>
          {userInput.type === 'transactionHash' ? (
            <TransactionVisualisation txHash={userInput.text} loadTXData={txLoadFn}/>
          ) : (
            <WalletVisualisation addrHash={userInput.text} loadAddrData={addrLoadFn}></WalletVisualisation>
          )}
        </Box>
      </ThemeProvider>
    </div>
  );
}

export default App;
