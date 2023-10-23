import React from "react"
import { Route, Routes } from "react-router-dom"

import App from "./App"

function RouterTree() {
  return (
    <div>
      <Routes>
        <Route path="/">
          <App />
        </Route>
      </Routes>
    </div>
  )
}

export default RouterTree