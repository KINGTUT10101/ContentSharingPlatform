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

function App() {
  return (
    <div className="App">
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <Header />
        <Container maxWidth="sm" sx={{ pb: '2rem', wordWrap: 'break-word' }}>
          <Routes>
            <Route path="/" element={ <Home /> } />
            <Route path="about" element={ <div> about me!!! </div> } />
            <Route path="contact" element={ <div> here are my contacts </div> } />
          </Routes>
        </Container>
        <Footer />
      </ThemeProvider>
    </div>
  )
}

export default App