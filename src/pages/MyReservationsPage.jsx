import { useState, useEffect } from "react"
import { Container, Row, Col, Button } from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { getMyReservationsApi, deleteReservationApi } from "../api/reservationApi"
import BackButton from "../components/BackButton"

function MyReservationsPage() {
    const { token } = useAuth()
    const navigate = useNavigate()

    const [reservations, setReservations] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    // Recupero le prenotazioni dell'utente loggato all'avvio
    useEffect(() => {
        const fetchReservations = async () => {
            try {
                const data = await getMyReservationsApi(token)
                setReservations(data)
            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }
        fetchReservations()
    }, [])

    // Gestisco la cancellazione di una prenotazione
    const handleDelete = async (reservationId) => {
        try {
            await deleteReservationApi(reservationId, token)
            // Rimuovo la prenotazione dalla lista senza ricaricare la pagina
            setReservations(reservations.filter(r => r.id !== reservationId))
        } catch (err) {
            alert(err.message)
        }
    }

    if (loading) return <p className="text-center mt-5">Caricamento...</p>
    if (error) return <p className="text-center mt-5 text-danger">{error}</p>

    return (
        <Container className="py-4">

            <BackButton />

            <h4 className="fw-bold mb-4" style={{ color: "#1a1a2e" }}>📋 Le mie prenotazioni</h4>

            {reservations.length === 0 ? (
                <div className="text-center py-5">
                    <p className="text-muted mb-3">Non hai ancora nessuna prenotazione.</p>
                    <Button
                        style={{ background: "#c8102e", border: "none" }}
                        className="fw-bold"
                        onClick={() => navigate("/")}
                    >
                        Scopri i ristoranti
                    </Button>
                </div>
            ) : (
                <Row className="g-3">
                    {reservations.map((reservation) => (
                        <Col key={reservation.id} xs={12} md={6} lg={4}>
                            <div className="p-3 rounded shadow-sm bg-white h-100" style={{ border: "1px solid #e9ecef" }}>

                                {/* Nome ristorante */}
                                <h6 className="fw-bold mb-2" style={{ color: "#1a1a2e" }}>
                                    🍽️ {reservation.restaurant?.name}
                                </h6>

                                {/* Data e ora */}
                                <p className="mb-1" style={{ fontSize: 13, color: "#6b7280" }}>
                                    📅 {reservation.date} alle {reservation.time}
                                </p>

                                {/* Numero di persone */}
                                <p className="mb-1" style={{ fontSize: 13, color: "#6b7280" }}>
                                    👥 {reservation.seatsBooked} {reservation.seatsBooked === 1 ? "persona" : "persone"}
                                </p>

                                {/* Targhetta preferenza posto con colori diversi */}
                                <div
                                    className="mb-3 d-inline-block px-2 py-1 rounded fw-semibold"
                                    style={{
                                        background: reservation.seatingPreference === "OUTDOOR" ? "#198754" : "#0ea5e9",
                                        color: "#fff",
                                        fontSize: 11
                                    }}
                                >
                                    {reservation.seatingPreference === "OUTDOOR" ? "🌿 Esterno" : "🏠 Interno"}
                                </div>

                                {/* Bottone cancella - rosso pieno, diventa bianco con bordo al hover */}
                                <div>
                                    <Button
                                        size="sm"
                                        className="fw-bold"
                                        style={{ background: "#c8102e", border: "none", color: "#fff" }}
                                        onMouseEnter={e => {
                                            e.currentTarget.style.background = "#fff"
                                            e.currentTarget.style.color = "#c8102e"
                                            e.currentTarget.style.border = "1px solid #c8102e"
                                        }}
                                        onMouseLeave={e => {
                                            e.currentTarget.style.background = "#c8102e"
                                            e.currentTarget.style.color = "#fff"
                                            e.currentTarget.style.border = "none"
                                        }}
                                        onClick={() => handleDelete(reservation.id)}
                                    >
                                        Cancella prenotazione
                                    </Button>
                                </div>

                            </div>
                        </Col>
                    ))}
                </Row>
            )}
        </Container>
    )
}

export default MyReservationsPage