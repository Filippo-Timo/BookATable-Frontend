import { useState, useEffect } from "react"
import { Container, Row, Col, Form } from "react-bootstrap"
import { useParams, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { getReservationsByRestaurantApi } from "../api/reservationApi"
import BackButton from "../components/BackButton"

function OwnerReservationsPage() {
    const { id } = useParams()
    const { token } = useAuth()
    const navigate = useNavigate()

    const [reservations, setReservations] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    // Stato per il filtro data
    const [filterDate, setFilterDate] = useState("")

    // Recupero le prenotazioni del ristorante all'avvio
    useEffect(() => {
        const fetchReservations = async () => {
            try {
                const data = await getReservationsByRestaurantApi(id, token)
                setReservations(data)
            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }
        fetchReservations()
    }, [id])

    // Filtro le prenotazioni per data — se non c'è filtro mostro tutte
    const filtered = filterDate
        ? reservations.filter(r => r.date === filterDate)
        : reservations

    if (loading) return <p className="text-center mt-5">Caricamento...</p>
    if (error) return <p className="text-center mt-5 text-danger">{error}</p>

    return (
        <Container className="py-4">
            <BackButton />

            {/* Titolo e filtro per data inline */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="fw-bold mb-0" style={{ color: "#1a1a2e" }}>📋 Prenotazioni ricevute</h4>

                <div className="d-flex align-items-center gap-2">
                    <Form.Control
                        type="date"
                        value={filterDate}
                        onChange={(e) => setFilterDate(e.target.value)}
                        style={{ maxWidth: 180 }}
                    />
                    {/* Bottone per resettare il filtro */}
                    {filterDate && (
                        <span
                            onClick={() => setFilterDate("")}
                            style={{ cursor: "pointer", color: "#c8102e", fontWeight: 600, fontSize: 13 }}
                        >
                            ✕
                        </span>
                    )}
                </div>
            </div>

            {filtered.length === 0 ? (
                <p className="text-muted">
                    {filterDate ? `Nessuna prenotazione per il ${filterDate}.` : "Nessuna prenotazione ricevuta ancora."}
                </p>
            ) : (
                <Row className="g-3">
                    {filtered.map((reservation) => (
                        <Col key={reservation.id} xs={12} md={6} lg={4}>
                            <div className="p-3 rounded shadow-sm bg-white h-100" style={{ border: "1px solid #e9ecef" }}>

                                {/* Nome utente */}
                                <h6 className="fw-bold mb-2" style={{ color: "#1a1a2e" }}>
                                    👤 {reservation.user?.firstName} {reservation.user?.lastName}
                                </h6>

                                {/* Data e ora */}
                                <p className="mb-1" style={{ fontSize: 13, color: "#6b7280" }}>
                                    📅 {reservation.date} alle {reservation.time}
                                </p>

                                {/* Numero di persone */}
                                <p className="mb-1" style={{ fontSize: 13, color: "#6b7280" }}>
                                    👥 {reservation.seatsBooked} {reservation.seatsBooked === 1 ? "persona" : "persone"}
                                </p>

                                {/* Preferenza posto */}
                                <div
                                    className="d-inline-block px-2 py-1 rounded fw-semibold"
                                    style={{
                                        background: reservation.seatingPreference === "OUTDOOR" ? "#198754" : "#0ea5e9",
                                        color: "#fff",
                                        fontSize: 11
                                    }}
                                >
                                    {reservation.seatingPreference === "OUTDOOR" ? "🌿 Esterno" : "🏠 Interno"}
                                </div>

                            </div>
                        </Col>
                    ))}
                </Row>
            )}
        </Container>
    )
}

export default OwnerReservationsPage