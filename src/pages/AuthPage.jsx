import { useState } from "react"
import { Container, Row, Col, Form, Button } from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { loginApi, registerUserApi, registerRestaurantOwnerApi, getMeApi } from "../api/authApi"

function AuthPage() {
    // Gestisce se mostrare il form di login o di registrazione. Di default mostra il login.
    const [mode, setMode] = useState("login")

    // Gestisce il tipo di utente che si vuole registrare. Di default è utente normale.
    const [registerType, setRegisterType] = useState("user")

    // Un unico oggetto che contiene tutti i campi del form.
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        firstName: "",
        lastName: "",
        birthDate: "",
        city: ""
    })

    // Salvo il messaggio di errore da mostrare all'utente se la chiamata al backend fallisce.
    const [error, setError] = useState(null)

    const { login } = useAuth()
    const navigate = useNavigate()

    // Ogni volta che l'utente scrive in un campo, aggiorna solo quel campo nel formData usando il 
    // name dell'input come chiave. Il ...formData serve per non perdere i valori degli altri campi.
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    // Chiamo il backend con email e password, recupero i dati dell'utente con getMeApi,
    // salvo il token e i dati utente nel context e nel localStorage e mando l'utente alla homepage
    const handleLogin = async (e) => {
        e.preventDefault()
        setError(null)
        try {
            const data = await loginApi({ email: formData.email, password: formData.password })
            const userData = await getMeApi(data.accessToken)
            login(userData, data.accessToken)
            navigate("/")
        } catch (err) {
            setError(err.message)
        }
    }

    // Chiamo il backend con tutti i dati del form — in base al tipo di utente scelto
    // chiamo registerUserApi (con birthDate e city) o registerRestaurantOwnerApi (senza)
    const handleRegister = async (e) => {
        e.preventDefault()
        setError(null)
        try {
            if (registerType === "user") {
                await registerUserApi({
                    email: formData.email,
                    password: formData.password,
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    birthDate: formData.birthDate,
                    city: formData.city
                })
            } else {
                await registerRestaurantOwnerApi({
                    email: formData.email,
                    password: formData.password,
                    firstName: formData.firstName,
                    lastName: formData.lastName
                })
            }
            setMode("login")
        } catch (err) {
            setError(err.message)
        }
    }

    return (
        <Container fluid className="min-vh-100 d-flex align-items-center justify-content-center" style={{ background: "#f1f3f6" }}>
            <Row className="shadow rounded overflow-hidden bg-white" style={{ maxWidth: 800, width: "100%" }}>

                {/* Pannello sinistro */}
                <Col md={5} className="d-flex flex-column align-items-center justify-content-center p-5 text-white" style={{ background: "linear-gradient(145deg, #c8102e, #6d0017)" }}>
                    <div style={{ fontSize: 72, marginBottom: 20 }}>🍷</div>
                    <h2 className="fw-bold mb-3">Bentornato!</h2>
                    <p style={{ opacity: 0.85, lineHeight: 1.7, textAlign: "center", maxWidth: 260 }}>
                        Prenota i migliori ristoranti della tua città in pochi secondi, senza telefonate.
                    </p>
                </Col>

                {/* Pannello destro */}
                <Col md={7} className="d-flex align-items-center justify-content-center p-5">
                    <div style={{ width: "100%", maxWidth: 380 }}>

                        {/* Toggle Login / Register */}
                        <div className="d-flex bg-light rounded p-1 mb-4">
                            {["login", "register"].map((m) => (
                                <button
                                    key={m}
                                    onClick={() => setMode(m)}
                                    className="flex-fill border-0 py-2 rounded fw-semibold"
                                    style={{
                                        fontSize: 14,
                                        background: mode === m ? "#fff" : "transparent",
                                        color: mode === m ? "#c8102e" : "#6b7280",
                                        boxShadow: mode === m ? "0 2px 8px rgba(0,0,0,.1)" : "none",
                                        cursor: "pointer"
                                    }}>
                                    {m === "login" ? "Accedi" : "Registrati"}
                                </button>
                            ))}
                        </div>

                        {/* Form di Login */}
                        {/* Mostra il form di login in base al mode. */}
                        {mode === "login" && (
                            <Form onSubmit={handleLogin}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="small fw-bold text-secondary text-uppercase">Email</Form.Label>
                                    <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} placeholder="mario@email.it" required />
                                </Form.Group>
                                <Form.Group className="mb-4">
                                    <Form.Label className="small fw-bold text-secondary text-uppercase">Password</Form.Label>
                                    <Form.Control type="password" name="password" value={formData.password} onChange={handleChange} placeholder="••••••••" required />
                                </Form.Group>
                                {/* Mostro il messaggio di errore in rosso solo se error non è null. */}
                                {error && (
                                    <div className="alert alert-danger py-2 mb-3" style={{ fontSize: 13 }}>
                                        {error}
                                    </div>
                                )}
                                <Button type="submit" className="w-100 py-2 fw-bold" style={{ background: "#c8102e", border: "none" }}>
                                    Accedi →
                                </Button>
                            </Form>
                        )}

                        {/* Form di Registrazione */}
                        {/* Mostra il form di Register in base al mode. */}
                        {mode === "register" && (
                            <Form onSubmit={handleRegister}>

                                {/* Toggle tipo utente — Utente o Ristoratore */}
                                <div className="d-flex bg-light rounded p-1 mb-3">
                                    {["user", "owner"].map((t) => (
                                        <button
                                            key={t}
                                            type="button"
                                            onClick={() => setRegisterType(t)}
                                            className="flex-fill border-0 py-2 rounded fw-semibold"
                                            style={{
                                                fontSize: 13,
                                                background: registerType === t ? "#fff" : "transparent",
                                                color: registerType === t ? "#c8102e" : "#6b7280",
                                                boxShadow: registerType === t ? "0 2px 8px rgba(0,0,0,.1)" : "none",
                                                cursor: "pointer"
                                            }}>
                                            {t === "user" ? "👤 Utente" : "🍽️ Ristoratore"}
                                        </button>
                                    ))}
                                </div>

                                <Row className="g-2">
                                    <Col>
                                        <Form.Group className="mb-3">
                                            <Form.Label className="small fw-bold text-secondary text-uppercase">Nome</Form.Label>
                                            <Form.Control type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="Mario" required />
                                        </Form.Group>
                                    </Col>
                                    <Col>
                                        <Form.Group className="mb-3">
                                            <Form.Label className="small fw-bold text-secondary text-uppercase">Cognome</Form.Label>
                                            <Form.Control type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Rossi" required />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Form.Group className="mb-3">
                                    <Form.Label className="small fw-bold text-secondary text-uppercase">Email</Form.Label>
                                    <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} placeholder="mario@email.it" required />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label className="small fw-bold text-secondary text-uppercase">Password</Form.Label>
                                    <Form.Control type="password" name="password" value={formData.password} onChange={handleChange} placeholder="••••••••" required />
                                </Form.Group>

                                {/* Campi aggiuntivi solo per l'utente normale */}
                                {registerType === "user" && (
                                    <>
                                        <Form.Group className="mb-3">
                                            <Form.Label className="small fw-bold text-secondary text-uppercase">Data di nascita</Form.Label>
                                            <Form.Control type="date" name="birthDate" value={formData.birthDate} onChange={handleChange} required />
                                        </Form.Group>
                                        <Form.Group className="mb-4">
                                            <Form.Label className="small fw-bold text-secondary text-uppercase">Città</Form.Label>
                                            <Form.Control type="text" name="city" value={formData.city} onChange={handleChange} placeholder="Roma" required />
                                        </Form.Group>
                                    </>
                                )}

                                {/* Mostro il messaggio di errore in rosso solo se error non è null. */}
                                {error && (
                                    <div className="alert alert-danger py-2 mb-3" style={{ fontSize: 13 }}>
                                        {error}
                                    </div>
                                )}
                                <Button type="submit" className="w-100 py-2 fw-bold" style={{ background: "#c8102e", border: "none" }}>
                                    Crea account →
                                </Button>
                            </Form>
                        )}

                    </div>
                </Col>
            </Row>
        </Container>
    )
}

export default AuthPage