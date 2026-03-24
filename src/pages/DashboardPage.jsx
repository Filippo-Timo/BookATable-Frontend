import { useState, useEffect } from "react"
import { Container, Row, Col, Button } from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { getMyRestaurantsApi } from "../api/restaurantApi"

function DashboardPage() {
    const { token } = useAuth()
    const navigate = useNavigate()

    const [restaurants, setRestaurants] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    // Recupero i ristoranti dell'owner loggato all'avvio
    useEffect(() => {
        const fetchRestaurants = async () => {
            try {
                const data = await getMyRestaurantsApi(token)
                setRestaurants(data)
            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }
        fetchRestaurants()
    }, [])

    if (loading) return <p className="text-center mt-5">Caricamento...</p>
    if (error) return <p className="text-center mt-5 text-danger">{error}</p>

    return (
        <Container className="py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="fw-bold mb-0" style={{ color: "#1a1a2e" }}>🍽️ I miei ristoranti</h4>
                {/* Bottone per creare un nuovo ristorante */}
                <Button
                    className="fw-bold"
                    style={{ background: "#c8102e", border: "none" }}
                    onClick={() => navigate("/dashboard/new")}
                >
                    + Nuovo ristorante
                </Button>
            </div>

            {restaurants.length === 0 ? (
                <div className="text-center py-5">
                    <p className="text-muted mb-3">Non hai ancora nessun ristorante.</p>
                    <Button
                        style={{ background: "#c8102e", border: "none" }}
                        className="fw-bold"
                        onClick={() => navigate("/dashboard/new")}
                    >
                        Crea il tuo primo ristorante
                    </Button>
                </div>
            ) : (
                <Row className="g-3">
                    {restaurants.map((restaurant) => (
                        <Col key={restaurant.id} xs={12} md={6} lg={4}>
                            <div className="p-3 rounded shadow-sm bg-white h-100" style={{ border: "1px solid #e9ecef" }}>

                                {/* Immagine ristorante */}
                                <img
                                    src={restaurant.imageUrl || "https://placehold.co/400x200?text=Ristorante"}
                                    alt={restaurant.name}
                                    className="w-100 mb-3 rounded"
                                    style={{ height: 140, objectFit: "cover" }}
                                />

                                {/* Nome e città */}
                                <h6 className="fw-bold mb-1" style={{ color: "#1a1a2e" }}>{restaurant.name}</h6>
                                <p className="text-muted mb-3" style={{ fontSize: 13 }}>
                                    📍 {restaurant.city}, {restaurant.address}
                                </p>

                                {/* Bottoni gestione */}
                                <div className="d-flex flex-column gap-2">
                                    <Button
                                        size="sm"
                                        className="fw-semibold"
                                        style={{ background: "#1a1a2e", border: "none" }}
                                        onClick={() => navigate(`/dashboard/restaurants/${restaurant.id}`)}
                                    >
                                        ✏️ Gestisci ristorante
                                    </Button>
                                    <Button
                                        size="sm"
                                        className="fw-semibold"
                                        style={{ background: "#c8102e", border: "none" }}
                                        onClick={() => navigate(`/dashboard/restaurants/${restaurant.id}/menu`)}
                                    >
                                        📖 Gestisci menu
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline-secondary"
                                        className="fw-semibold"
                                        onClick={() => navigate(`/dashboard/restaurants/${restaurant.id}/reservations`)}
                                    >
                                        📋 Vedi prenotazioni
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

export default DashboardPage