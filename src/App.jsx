import { BrowserRouter, Routes, Route } from "react-router-dom"

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<h1>HomePage</h1>} />
        <Route path="/auth" element={<h1>AuthPage</h1>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
