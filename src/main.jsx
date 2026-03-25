import { createRoot } from 'react-dom/client'
import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'

createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <App />
    </div>
  </AuthProvider>
)
