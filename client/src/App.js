import { Routes, Route } from "react-router-dom"
import Container from "@mui/material/Container"
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Components
import Header from "./components/Header"
import Footer from "./components/Footer"

// Pages
import Home from "./pages/Home"

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

let style = {
  display: "flex",
  minHeight: "100vh",
  flexDirection: "column",
  justifyContent: "space-between"
}

function App() {
  return (
    <div className="App">
      <div style={style}>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <Header />
        <Container sx={{ pb: '2rem', wordWrap: 'break-word' }} style={{flex: 1}}>
          <Routes>
            <Route path="/" element={ <Home /> } />
            <Route path="about" element={ <div> about me!!! </div> } />
            <Route path="contact" element={ <div> here are my contacts </div> } />
          </Routes>
        </Container>
        <Footer />
      </ThemeProvider>
      </div>
    </div>
  )
}

export default App