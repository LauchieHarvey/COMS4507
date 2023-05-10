import HeaderBar from "./Components/Header";
import FormSection from "./Components/FormSection";
import {theme} from "./Components/Theme";
import {ThemeProvider} from '@mui/material/styles';
import {Box} from '@mui/material';
import Visualisation from "./Components/Visualisation/Visualisation";
import {getBTCTransactionData} from "./FetchData/getTXData";

function App() {
  // Test BTC hash
  const currentHash = '3886957229608510';

  return (
    <div className="App" style={{height: '100vh', overflow: 'hidden'}}>
      <ThemeProvider theme={theme}>
        <HeaderBar></HeaderBar>
        <FormSection></FormSection>
        <Box sx={{border: '1px solid black', height: '100vh'}}>
          <Visualisation txHash={currentHash} loadTXData={getBTCTransactionData}/>
        </Box>
      </ThemeProvider>
    </div>
  );
}

export default App;
