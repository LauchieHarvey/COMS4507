import HeaderBar from "./Components/Header";
import {theme} from "./Components/Theme";
import {ThemeProvider} from '@mui/material/styles';
import {Box} from '@mui/material';
import Visualisation from "./Components/Visualisation/Visualisation";
import {getBTCTransactionData} from "./FetchData/getTXData";

function App() {
  // Test BTC hash
  const currentHash = '3886957229608510';

  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <Box sx={{display: 'flex', height: '100vh', flexDirection: 'column'}}>
          <HeaderBar></HeaderBar>
          <Box sx={{border: '1px solid black'}}>
            <Visualisation txHash={currentHash} loadTXData={getBTCTransactionData}/>
          </Box>
        </Box>
      </ThemeProvider>
    </div>
  );
}

export default App;
