import { Routes, Route } from "react-router-dom"
import Container from "@mui/material/Container"

import { Link } from "react-router-dom"; // TEMP
import Header from "./components/Header"

import Home from "./pages/Home"

function App() {
  return (
    <div className="App">
      <Header />
      <Container maxWidth="sm">
        <Routes>
          <Route path="/" element={ <Home /> } />
          <Route path="about" element={ <div> about me!!! </div> } />
          <Route path="contact" element={ <div> here are my contacts </div> } />
        </Routes>
      </Container>
    </div>
  )
}

export default App