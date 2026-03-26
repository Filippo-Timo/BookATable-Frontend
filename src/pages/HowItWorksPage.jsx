import { Container, Row, Col } from "react-bootstrap"
import { useAuth } from "../context/AuthContext"
import BackButton from "../components/BackButton"

function HowItWorksPage() {
    const { user } = useAuth()

    return (
        <Container className="py-4">
            <BackButton />

            {/* Contenuto per USER */}
            {user?.role === "USER" && (
                <>
                    {/* Hero */}
                    <div className="text-center py-5 mb-4 rounded" style={{ background: "linear-gradient(135deg, #c8102e 0%, #6d0017 100%)" }}>
                        <div style={{ fontSize: 64 }}>🍽️</div>
                        <h1 className="fw-black mt-3 mb-2" style={{ color: "#fff" }}>Benvenuto su BookATable</h1>
                        <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 18, maxWidth: 500, margin: "0 auto" }}>
                            Il modo più semplice per prenotare un tavolo nei migliori ristoranti della tua città.
                        </p>
                    </div>

                    {/* Step */}
                    <Row className="g-4 mb-5">
                        <Col xs={12} md={4}>
                            <div className="p-4 rounded shadow-sm h-100 bg-white" style={{ border: "1px solid #e9ecef" }}>
                                <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
                                <h5 className="fw-bold mb-2" style={{ color: "#1a1a2e" }}>1. Scopri i ristoranti</h5>
                                <p className="text-muted mb-0" style={{ fontSize: 14 }}>
                                    Sfoglia tutti i ristoranti disponibili nella tua città. Cerca per nome o per zona e trova il posto perfetto per ogni occasione.
                                </p>
                            </div>
                        </Col>
                        <Col xs={12} md={4}>
                            <div className="p-4 rounded shadow-sm h-100 bg-white" style={{ border: "1px solid #e9ecef" }}>
                                <div style={{ fontSize: 40, marginBottom: 12 }}>📖</div>
                                <h5 className="fw-bold mb-2" style={{ color: "#1a1a2e" }}>2. Esplora menu e recensioni</h5>
                                <p className="text-muted mb-0" style={{ fontSize: 14 }}>
                                    Consulta il menu del ristorante, leggi le recensioni di altri utenti e scopri se è il posto giusto per te prima di prenotare.
                                </p>
                            </div>
                        </Col>
                        <Col xs={12} md={4}>
                            <div className="p-4 rounded shadow-sm h-100 bg-white" style={{ border: "1px solid #e9ecef" }}>
                                <div style={{ fontSize: 40, marginBottom: 12 }}>📅</div>
                                <h5 className="fw-bold mb-2" style={{ color: "#1a1a2e" }}>3. Prenota in pochi click</h5>
                                <p className="text-muted mb-0" style={{ fontSize: 14 }}>
                                    Scegli data, orario, numero di persone e preferenza di posto. BookATable ti suggerisce anche il meteo previsto per aiutarti nella scelta!
                                </p>
                            </div>
                        </Col>
                    </Row>

                    {/* Features aggiuntive */}
                    <div className="p-4 rounded mb-4" style={{ background: "#f8f9fa", border: "1px solid #e9ecef" }}>
                        <h4 className="fw-bold mb-4" style={{ color: "#1a1a2e" }}>✨ Cosa puoi fare con BookATable</h4>
                        <Row className="g-3">
                            <Col xs={12} md={6}>
                                <div className="d-flex align-items-start gap-3">
                                    <span style={{ fontSize: 24 }}>⭐</span>
                                    <div>
                                        <p className="fw-bold mb-1" style={{ fontSize: 14, color: "#1a1a2e" }}>Lascia recensioni</p>
                                        <p className="text-muted mb-0" style={{ fontSize: 13 }}>Condividi la tua esperienza con altri utenti e aiutali a scegliere il ristorante giusto.</p>
                                    </div>
                                </div>
                            </Col>
                            <Col xs={12} md={6}>
                                <div className="d-flex align-items-start gap-3">
                                    <span style={{ fontSize: 24 }}>📋</span>
                                    <div>
                                        <p className="fw-bold mb-1" style={{ fontSize: 14, color: "#1a1a2e" }}>Gestisci le tue prenotazioni</p>
                                        <p className="text-muted mb-0" style={{ fontSize: 13 }}>Visualizza e cancella le tue prenotazioni in qualsiasi momento dalla sezione "Le mie prenotazioni".</p>
                                    </div>
                                </div>
                            </Col>
                            <Col xs={12} md={6}>
                                <div className="d-flex align-items-start gap-3">
                                    <span style={{ fontSize: 24 }}>🌤️</span>
                                    <div>
                                        <p className="fw-bold mb-1" style={{ fontSize: 14, color: "#1a1a2e" }}>Previsioni meteo integrate</p>
                                        <p className="text-muted mb-0" style={{ fontSize: 13 }}>Durante la prenotazione ti mostriamo le previsioni meteo per aiutarti a scegliere tra posto interno ed esterno.</p>
                                    </div>
                                </div>
                            </Col>
                            <Col xs={12} md={6}>
                                <div className="d-flex align-items-start gap-3">
                                    <span style={{ fontSize: 24 }}>🗺️</span>
                                    <div>
                                        <p className="fw-bold mb-1" style={{ fontSize: 14, color: "#1a1a2e" }}>Trova il ristorante su Maps</p>
                                        <p className="text-muted mb-0" style={{ fontSize: 13 }}>Ogni ristorante ha un link diretto a Google Maps per trovare facilmente la strada.</p>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </>
            )}

            {/* Contenuto per RESTAURANT_OWNER */}
            {user?.role === "RESTAURANT_OWNER" && (
                <>
                    {/* Hero */}
                    <div className="text-center py-5 mb-4 rounded" style={{ background: "linear-gradient(135deg, #c8102e 0%, #6d0017 100%)" }}>
                        <div style={{ fontSize: 64 }}>🍴</div>
                        <h1 className="fw-black mt-3 mb-2" style={{ color: "#fff" }}>Gestisci il tuo ristorante</h1>
                        <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 18, maxWidth: 500, margin: "0 auto" }}>
                            BookATable ti permette di gestire il tuo ristorante, il menu e le prenotazioni in un unico posto.
                        </p>
                    </div>

                    {/* Step */}
                    <Row className="g-4 mb-5">
                        <Col xs={12} md={4}>
                            <div className="p-4 rounded shadow-sm h-100 bg-white" style={{ border: "1px solid #e9ecef" }}>
                                <div style={{ fontSize: 40, marginBottom: 12 }}>🍽️</div>
                                <h5 className="fw-bold mb-2" style={{ color: "#1a1a2e" }}>1. Crea il tuo ristorante</h5>
                                <p className="text-muted mb-0" style={{ fontSize: 14 }}>
                                    Registra il tuo ristorante inserendo tutte le informazioni: nome, indirizzo, tipologia, posti disponibili e una foto accattivante.
                                </p>
                            </div>
                        </Col>
                        <Col xs={12} md={4}>
                            <div className="p-4 rounded shadow-sm h-100 bg-white" style={{ border: "1px solid #e9ecef" }}>
                                <div style={{ fontSize: 40, marginBottom: 12 }}>📖</div>
                                <h5 className="fw-bold mb-2" style={{ color: "#1a1a2e" }}>2. Gestisci il menu</h5>
                                <p className="text-muted mb-0" style={{ fontSize: 14 }}>
                                    Crea i tuoi menu (pranzo, cena, festivo, ecc.) e aggiungi i piatti con nome, ingredienti e prezzo. Puoi modificarli in qualsiasi momento.
                                </p>
                            </div>
                        </Col>
                        <Col xs={12} md={4}>
                            <div className="p-4 rounded shadow-sm h-100 bg-white" style={{ border: "1px solid #e9ecef" }}>
                                <div style={{ fontSize: 40, marginBottom: 12 }}>📋</div>
                                <h5 className="fw-bold mb-2" style={{ color: "#1a1a2e" }}>3. Monitora le prenotazioni</h5>
                                <p className="text-muted mb-0" style={{ fontSize: 14 }}>
                                    Visualizza tutte le prenotazioni ricevute, filtra per data e tieni sempre sotto controllo chi ha prenotato un tavolo nel tuo ristorante.
                                </p>
                            </div>
                        </Col>
                    </Row>

                    {/* Features aggiuntive */}
                    <div className="p-4 rounded mb-4" style={{ background: "#f8f9fa", border: "1px solid #e9ecef" }}>
                        <h4 className="fw-bold mb-4" style={{ color: "#1a1a2e" }}>✨ Cosa puoi fare con BookATable</h4>
                        <Row className="g-3">
                            <Col xs={12} md={6}>
                                <div className="d-flex align-items-start gap-3">
                                    <span style={{ fontSize: 24 }}>📷</span>
                                    <div>
                                        <p className="fw-bold mb-1" style={{ fontSize: 14, color: "#1a1a2e" }}>Carica foto del ristorante</p>
                                        <p className="text-muted mb-0" style={{ fontSize: 13 }}>Aggiungi una foto del tuo ristorante per renderlo più attraente agli occhi dei clienti.</p>
                                    </div>
                                </div>
                            </Col>
                            <Col xs={12} md={6}>
                                <div className="d-flex align-items-start gap-3">
                                    <span style={{ fontSize: 24 }}>✏️</span>
                                    <div>
                                        <p className="fw-bold mb-1" style={{ fontSize: 14, color: "#1a1a2e" }}>Modifica le informazioni</p>
                                        <p className="text-muted mb-0" style={{ fontSize: 13 }}>Aggiorna in qualsiasi momento le informazioni del tuo ristorante, dal numero di posti alla descrizione.</p>
                                    </div>
                                </div>
                            </Col>
                            <Col xs={12} md={6}>
                                <div className="d-flex align-items-start gap-3">
                                    <span style={{ fontSize: 24 }}>📅</span>
                                    <div>
                                        <p className="fw-bold mb-1" style={{ fontSize: 14, color: "#1a1a2e" }}>Filtra per data</p>
                                        <p className="text-muted mb-0" style={{ fontSize: 13 }}>Nella sezione prenotazioni puoi filtrare per data per vedere chi ha prenotato in un giorno specifico.</p>
                                    </div>
                                </div>
                            </Col>
                            <Col xs={12} md={6}>
                                <div className="d-flex align-items-start gap-3">
                                    <span style={{ fontSize: 24 }}>⭐</span>
                                    <div>
                                        <p className="fw-bold mb-1" style={{ fontSize: 14, color: "#1a1a2e" }}>Leggi le recensioni</p>
                                        <p className="text-muted mb-0" style={{ fontSize: 13 }}>Scopri cosa pensano i clienti del tuo ristorante leggendo le recensioni nella pagina di dettaglio.</p>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </>
            )}

        </Container>
    )
}

export default HowItWorksPage