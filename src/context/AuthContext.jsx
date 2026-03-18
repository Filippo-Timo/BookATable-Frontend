import { createContext, useContext, useState, useEffect } from "react"
import { getMeApi } from "../api/authApi"

const AuthContext = createContext()

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [token, setToken] = useState(localStorage.getItem("token") || null)

    const login = (userData, accessToken) => {
        setUser(userData)
        setToken(accessToken)
        localStorage.setItem("token", accessToken)
    }

    const logout = () => {
        setUser(null)
        setToken(null)
        localStorage.removeItem("token")
    }

    // All'avvio, se c'è un token nel localStorage recupero i dati dell'utente
    useEffect(() => {
        const fetchUser = async () => {
            if (token && !user) {
                try {
                    const userData = await getMeApi(token)
                    setUser(userData)
                } catch (err) {
                    // Se il token non è valido faccio il logout
                    logout()
                }
            }
        }
        fetchUser()
    }, [token])

    return (
        <AuthContext.Provider value={{ user, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    return useContext(AuthContext)
}