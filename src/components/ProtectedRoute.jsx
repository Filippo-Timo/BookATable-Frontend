import { Navigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

function ProtectedRoute({ children, requiredRole }) {
    const { token, user } = useAuth()

    // Se l'utente non è loggato lo mando alla pagina di login (endpoint --> /auth)
    if (!token) {
        return <Navigate to="/auth" />
    }

    // Se l'utente è loggato ma non ha il ruolo giusto lo mando alla home (endpoint --> /)
    if (requiredRole && user?.role !== requiredRole) {
        return <Navigate to="/" />
    }

    return children
}

export default ProtectedRoute