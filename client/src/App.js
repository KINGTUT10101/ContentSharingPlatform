import { Routes, Route } from "react-router-dom"

import { Link } from "react-router-dom"; // TEMP

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={ <div> hello world <Link to="about">about</Link><Link to="contact">contact</Link></div> } />
        <Route path="about" element={ <div> about me!!! </div> } />
        <Route path="contact" element={ <div> here are my contacts </div> } />
      </Routes>
    </div>
  )
}

export default App