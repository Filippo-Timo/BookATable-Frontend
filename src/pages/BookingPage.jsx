import { useState, useEffect } from "react"
import { Container, Row, Col, Form, Button } from "react-bootstrap"
import { useParams, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { createReservationApi } from "../api/reservationApi"
import { getRestaurantByIdApi } from "../api/restaurantApi"
import { getWeatherSuggestionApi } from "../api/weatherApi"

function BookingPage() {
    const { id } = useParams()
    const { token } = useAuth()
    const navigate = useNavigate()

    // Stato per il form di prenotazione
    const [formData, setFormData] = useState({
        date: "",
        time: "",
        seatsBooked: 1,
        seatingPreference: "INDOOR"
    })
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)

    // Stato per i dati del ristorante — ci serve la città per il meteo
    const [restaurant, setRestaurant] = useState(null)

    // Stato per il suggerimento meteo
    const [weather, setWeather] = useState(null)
    const [weatherLoading, setWeatherLoading] = useState(false)

    // Recupero i dati del ristorante all'avvio per ottenere la città
    useEffect(() => {
        const fetchRestaurant = async () => {
            try {
                const data = await getRestaurantByIdApi(id, token)
                setRestaurant(data)
            } catch (err) {
                console.error("Errore nel recupero del ristorante:", err.message)
            }
        }
        fetchRestaurant()
    }, [id])

    // Ogni volta che cambiano data o orario, aggiorno il suggerimento meteo
    useEffect(() => {
        const fetchWeather = async () => {
            // Chiamo il meteo solo se abbiamo tutti i dati necessari
            if (!restaurant || !formData.date || !formData.time) return

            setWeatherLoading(true)
            setWeather(null)
            try {
                const data = await getWeatherSuggestionApi(restaurant.city, formData.date, formData.time, token)
                setWeather(data)
            } catch (err) {
                // Se il meteo non è disponibile (es. data troppo lontana) non mostro errori
                setWeather(null)
            } finally {
                setWeatherLoading(false)
            }
        }
        fetchWeather()
    }, [formData.date, formData.time, restaurant])

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    // Gestisco la creazione della prenotazione
    const handleSubmit = async (e) => {
        e.preventDefault()
        setError(null)
        setLoading(true)
        try {
            await createReservationApi({
                restaurantId: id,
                date: formData.date,
                time: formData.time,
                seatsBooked: parseInt(formData.seatsBooked),
                seatingPreference: formData.seatingPreference
            }, token)
            // Dopo la prenotazione mando l'utente alla pagina delle prenotazioni
            navigate("/reservations")
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Container className="py-4">
            <Row className="justify-content-center">
                <Col xs={12} md={6}>

                    {/* Titolo */}
                    <h4 className="fw-bold mb-4" style={{ color: "#1a1a2e" }}>📅 Prenota un tavolo</h4>

                    <Form onSubmit={handleSubmit}>

                        {/* Data */}
                        <Form.Group className="mb-3">
                            <Form.Label className="small fw-bold text-secondary text-uppercase">Data</Form.Label>
                            <Form.Control
                                type="date"
                                name="date"
                                value={formData.date}
                                onChange={handleChange}
                                min={new Date().toISOString().split("T")[0]}
                                required
                            />
                        </Form.Group>

                        {/* Ora */}
                        <Form.Group className="mb-3">
                            <Form.Label className="small fw-bold text-secondary text-uppercase">Ora</Form.Label>
                            <Form.Control
                                type="time"
                                name="time"
                                value={formData.time}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        {/* Suggerimento meteo - appare solo se abbiamo data e orario */}
                        {formData.date && formData.time && (
                            <div className="mb-3">
                                {weatherLoading ? (
                                    <div className="p-3 rounded" style={{ background: "#f8f9fa", border: "1px solid #e9ecef" }}>
                                        <p className="mb-0 text-muted" style={{ fontSize: 13 }}>🌤️ Caricamento meteo...</p>
                                    </div>
                                ) : weather ? (
                                    <div
                                        className="p-3 rounded"
                                        style={{
                                            background: weather.suggestion === "OUTDOOR"
                                                ? "linear-gradient(135deg, #d4edda, #c3e6cb)"
                                                : "linear-gradient(135deg, #fff3cd, #ffeeba)",
                                            border: weather.suggestion === "OUTDOOR"
                                                ? "1px solid #c3e6cb"
                                                : "1px solid #ffeeba"
                                        }}
                                    >
                                        {/* Icona meteo e temperatura */}
                                        <div className="d-flex align-items-center gap-3 mb-2">
                                            <div style={{ fontSize: 40 }}>
                                                {weather.description?.toLowerCase().includes("rain") ? "🌧️"
                                                    : weather.description?.toLowerCase().includes("cloud") ? "☁️"
                                                        : weather.description?.toLowerCase().includes("snow") ? "❄️"
                                                            : weather.description?.toLowerCase().includes("storm") ? "⛈️"
                                                                : "☀️"}
                                            </div>
                                            <div>
                                                <p className="mb-0 fw-bold" style={{ fontSize: 15, color: "#1a1a2e" }}>
                                                    {weather.temperature}°C — {weather.description}
                                                </p>
                                                <p className="mb-0" style={{ fontSize: 12, color: "#6b7280" }}>
                                                    {formData.date} alle {formData.time} — {restaurant?.city}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Suggerimento INDOOR/OUTDOOR basato sul meteo */}
                                        <div
                                            className="d-flex align-items-center gap-2 px-3 py-2 rounded"
                                            style={{
                                                background: weather.suggestion === "OUTDOOR"
                                                    ? "rgba(25, 135, 84, 0.15)"
                                                    : "rgba(255, 193, 7, 0.3)",
                                                fontSize: 13,
                                                fontWeight: 600,
                                                color: weather.suggestion === "OUTDOOR" ? "#146c43" : "#856404"
                                            }}
                                        >
                                            <span style={{ fontSize: 18 }}>
                                                {weather.suggestion === "OUTDOOR" ? "🌿" : "🏠"}
                                            </span>
                                            <span>
                                                {weather.suggestion === "OUTDOOR"
                                                    ? "Ottimo tempo! Ti consigliamo un posto esterno"
                                                    : "Ti consigliamo un posto interno"}
                                            </span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="p-3 rounded" style={{ background: "#f8f9fa", border: "1px solid #e9ecef" }}>
                                        <p className="mb-0 text-muted" style={{ fontSize: 13 }}>
                                            🌤️ Previsioni meteo non disponibili per questa data
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Numero di posti */}
                        <Form.Group className="mb-3">
                            <Form.Label className="small fw-bold text-secondary text-uppercase">Numero di persone</Form.Label>
                            <Form.Control
                                type="number"
                                name="seatsBooked"
                                value={formData.seatsBooked}
                                onChange={handleChange}
                                min={1}
                                max={20}
                                required
                            />
                        </Form.Group>

                        {/* Preferenza posto */}
                        <Form.Group className="mb-4">
                            <Form.Label className="small fw-bold text-secondary text-uppercase">Preferenza posto</Form.Label>
                            <Form.Select
                                name="seatingPreference"
                                value={formData.seatingPreference}
                                onChange={handleChange}
                            >
                                <option value="INDOOR">🏠 Interno</option>
                                <option value="OUTDOOR">🌿 Esterno</option>
                            </Form.Select>
                        </Form.Group>

                        {/* Messaggio di errore */}
                        {error && (
                            <div className="alert alert-danger py-2 mb-3" style={{ fontSize: 13 }}>
                                {error}
                            </div>
                        )}

                        {/* Bottoni */}
                        <div className="d-flex gap-2">
                            <Button
                                type="submit"
                                className="fw-bold"
                                style={{ background: "#c8102e", border: "none" }}
                                disabled={loading}
                            >
                                {loading ? "Prenotazione in corso..." : "Conferma prenotazione"}
                            </Button>
                            <Button
                                type="button"
                                variant="outline-secondary"
                                onClick={() => navigate(`/restaurants/${id}`)}
                            >
                                Annulla
                            </Button>
                        </div>

                    </Form>
                </Col>
            </Row>
        </Container>
    )
}

export default BookingPage