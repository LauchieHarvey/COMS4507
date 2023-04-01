import HeaderBar from "./Components/Header";
import {theme} from "./Components/Theme";
import {ThemeProvider} from '@mui/material/styles';

function App() {
  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <HeaderBar></HeaderBar>
      </ThemeProvider>
    </div>
  );
}

export default App;
