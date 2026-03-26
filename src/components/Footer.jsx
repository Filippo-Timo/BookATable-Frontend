import { Container, Row, Col } from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { useState } from "react"

function Footer() {
    const navigate = useNavigate()
    const { user } = useAuth()

    // Stato per gestire l'hover sui singoli link
    const [hovered, setHovered] = useState(null)

    const linkStyle = (id) => ({
        fontSize: 13,
        cursor: "pointer",
        color: hovered === id ? "#c8102e" : "rgba(255,255,255,0.7)",
        transition: "color 0.2s"
    })

    return (
        <footer style={{ background: "#1a1a2e", color: "rgba(255,255,255,0.7)", marginTop: "auto" }}>
            <Container className="py-4">
                <Row className="align-items-center">

                    {/* Logo e descrizione */}
                    <Col xs={12} md={4} className="mb-3 mb-md-0">
                        <h5 className="fw-black mb-1">
                            <span style={{ color: "#c8102e" }}>Book</span>
                            <span style={{ color: "#fff" }}>ATable</span>
                        </h5>
                        <p className="mb-0" style={{ fontSize: 13 }}>
                            Prenota i migliori ristoranti della tua città in pochi secondi.
                        </p>
                    </Col>

                    {/* Link utili */}
                    <Col xs={12} md={4} className="mb-3 mb-md-0 text-md-center">
                        <p className="fw-bold mb-1" style={{ color: "#fff", fontSize: 13 }}>Link utili</p>

                        {/* Link alla homepage */}
                        <p
                            className="mb-0"
                            style={linkStyle("home")}
                            onClick={() => navigate("/")}
                            onMouseEnter={() => setHovered("home")}
                            onMouseLeave={() => setHovered(null)}
                        >
                            Scopri i ristoranti
                        </p>

                        {/* Come funziona */}
                        <p
                            className="mb-0"
                            style={linkStyle("how")}
                            onClick={() => navigate("/how-it-works")}
                            onMouseEnter={() => setHovered("how")}
                            onMouseLeave={() => setHovered(null)}
                        >
                            Come funziona
                        </p>

                        {/* Link diverso in base al ruolo */}
                        {user?.role === "RESTAURANT_OWNER" && (
                            <p
                                className="mb-0"
                                style={linkStyle("owner")}
                                onClick={() => navigate("/dashboard/new")}
                                onMouseEnter={() => setHovered("owner")}
                                onMouseLeave={() => setHovered(null)}
                            >
                                Registra il tuo ristorante
                            </p>
                        )}
                        {user?.role === "USER" && (
                            <p
                                className="mb-0"
                                style={linkStyle("reservations")}
                                onClick={() => navigate("/reservations")}
                                onMouseEnter={() => setHovered("reservations")}
                                onMouseLeave={() => setHovered(null)}
                            >
                                Le mie prenotazioni
                            </p>
                        )}
                    </Col>

                    {/* Copyright */}
                    <Col xs={12} md={4} className="text-md-end">
                        <p className="mb-0" style={{ fontSize: 12 }}>
                            © {new Date().getFullYear()} BookATable. Tutti i diritti riservati.
                        </p>
                        <p className="mb-0" style={{ fontSize: 12 }}>
                            Sviluppato da <span style={{ color: "#c8102e", fontWeight: 600 }}>Filippo Timo</span>
                        </p>
                    </Col>

                </Row>
            </Container>
        </footer>
    )
}

export default Footer