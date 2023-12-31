import { Routes, Route } from "react-router-dom"
import Container from "@mui/material/Container"
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Components
import Header from "./components/Header"
import Footer from "./components/Footer"

// Pages
import Home from "./pages/Home"
import Profile from "./pages/Profile"
import ContentPage from "./pages/ContentPage"
import Browse from "./pages/Browse"
import Login from "./pages/Login"
import Upload from "./pages/Upload"
import NotFound from "./pages/NotFound"

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    // primary: {
    //   main: '#FF0000', // Change this to your desired link color
    // },
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
            <Route path="profile/:Username" element={ <Profile /> } />
            <Route path="content/:ContentID" element={ <ContentPage /> } />
            <Route path="browse" element={ <Browse /> } />
            <Route path="login" element={ <Login /> } />
            <Route path="upload" element={ <Upload /> } />
            <Route path="*" element={ <NotFound /> } />
          </Routes>
        </Container>
        <Footer />
      </ThemeProvider>
      </div>
    </div>
  )
}

export default App