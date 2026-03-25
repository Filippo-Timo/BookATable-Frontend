import { Container, Row, Col } from "react-bootstrap"

function Footer() {
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
                        <p className="mb-0" style={{ fontSize: 13 }}>Scopri i ristoranti</p>
                        <p className="mb-0" style={{ fontSize: 13 }}>Come funziona</p>
                        <p className="mb-0" style={{ fontSize: 13 }}>Registra il tuo ristorante</p>
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