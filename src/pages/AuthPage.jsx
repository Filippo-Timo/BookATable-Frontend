import { useState } from "react"
import { Container, Row, Col, Form, Button } from "react-bootstrap"

function AuthPage() {
    // Gestisce se mostrare il form di login o di registrazione. Di default mostra il login.
    const [mode, setMode] = useState("login")

    // Un unico oggetto che contiene tutti i campi del form.
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        firstName: "",
        lastName: "",
        birthDate: "",
        city: ""
    })

    // Ogni volta che l'utente scrive in un campo, aggiorna solo quel campo nel formData usando il 
    // name dell'input come chiave. Il ...formData serve per non perdere i valori degli altri campi.
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleLogin = async (e) => {
        e.preventDefault()
        console.log("login", formData)
    }

    const handleRegister = async (e) => {
        e.preventDefault()
        console.log("register", formData)
    }

    return (
        <Container fluid className="min-vh-100 d-flex align-items-center justify-content-center" style={{ background: "#f1f3f6" }}>
            <Row className="shadow rounded overflow-hidden bg-white" style={{ maxWidth: 800, width: "100%" }}>

                {/* Pannello di sinistra */}
                <Col md={5} className="d-flex flex-column align-items-center justify-content-center p-5 text-white" style={{ background: "linear-gradient(145deg, #c8102e, #6d0017)" }}>
                    <div style={{ fontSize: 72, marginBottom: 20 }}>🍷</div>
                    <h2 className="fw-bold mb-3">Bentornato!</h2>
                    <p style={{ opacity: 0.85, lineHeight: 1.7, textAlign: "center", maxWidth: 260 }}>
                        Prenota i migliori ristoranti della tua città in pochi secondi, senza telefonate.
                    </p>
                </Col>

                {/* Pannello di destra */}
                <Col md={7} className="d-flex align-items-center justify-content-center p-5">
                    <div style={{ width: "100%", maxWidth: 380 }}>

                        {/* Toggle Login / Register */}
                        <div className="d-flex bg-light rounded p-1 mb-4">
                            {/* Crea i due bottoni con un .map() e al click cambia il mode. */}
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
                                <Button type="submit" className="w-100 py-2 fw-bold" style={{ background: "#c8102e", border: "none" }}>
                                    Accedi →
                                </Button>
                            </Form>
                        )}

                        {/* Form di Registrazione */}
                        {/* Mostra il form di Register in base al mode. */}
                        {mode === "register" && (
                            <Form onSubmit={handleRegister}>
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
                                <Form.Group className="mb-3">
                                    <Form.Label className="small fw-bold text-secondary text-uppercase">Data di nascita</Form.Label>
                                    <Form.Control type="date" name="birthDate" value={formData.birthDate} onChange={handleChange} required />
                                </Form.Group>
                                <Form.Group className="mb-4">
                                    <Form.Label className="small fw-bold text-secondary text-uppercase">Città</Form.Label>
                                    <Form.Control type="text" name="city" value={formData.city} onChange={handleChange} placeholder="Roma" required />
                                </Form.Group>
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