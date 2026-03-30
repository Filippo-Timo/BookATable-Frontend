import { useState, useEffect } from "react"
import { Container, Row, Col, Form } from "react-bootstrap"
import { useAuth } from "../context/AuthContext"
import { getAllRestaurantsApi, getRestaurantsByCityApi } from "../api/restaurantApi"
import RestaurantCard from "../components/RestaurantCard"

function HomePage() {
    const [restaurants, setRestaurants] = useState([])
    const [search, setSearch] = useState("")
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const { token, user } = useAuth()

    useEffect(() => {
        const fetchRestaurants = async () => {
            try {
                let data
                // Se c'è una ricerca attiva mostro tutti i ristoranti
                // Se è un RESTAURANT_OWNER mostro tutti i ristoranti
                // Se è un USER senza ricerca mostro solo i ristoranti della sua città
                if (search || user?.role === "RESTAURANT_OWNER") {
                    data = await getAllRestaurantsApi(token)
                } else {
                    data = await getRestaurantsByCityApi(user?.city, token)
                }
                setRestaurants(data || [])
            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        fetchRestaurants()
    }, [search])

    // Filtro i ristoranti per nome o città e ordino mettendo prima quelli della città dell'utente
    const filtered = restaurants
        .filter((r) =>
            r.name.toLowerCase().includes(search.toLowerCase()) ||
            r.city.toLowerCase().includes(search.toLowerCase())
        )
        .sort((a, b) => {
            // I ristoranti della città dell'utente vengono prima
            const aIsLocal = a.city.toLowerCase() === user?.city?.toLowerCase()
            const bIsLocal = b.city.toLowerCase() === user?.city?.toLowerCase()
            if (aIsLocal && !bIsLocal) return -1
            if (!aIsLocal && bIsLocal) return 1
            return 0
        })

    if (loading) return <p className="text-center mt-5">Caricamento...</p>
    if (error) return <p className="text-center mt-5 text-danger">{error}</p>

    return (
        <Container className="py-4">
            {/* Titolo con la città dell'utente — per il RESTAURANT_OWNER o con ricerca attiva mostro titolo generico */}
            <h4 className="fw-bold mb-4" style={{ color: "#1a1a2e" }}>
                {user?.role === "RESTAURANT_OWNER" || search
                    ? "Scopri i ristoranti"
                    : `Scopri i ristoranti a ${user?.city}`}
            </h4>

            <div className="mb-4 position-relative" style={{ maxWidth: 400 }}>
                <Form.Control
                    placeholder="Cerca per nome o città..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                {/* Mostra la X solo se c'è del testo nella barra di ricerca */}
                {search && (
                    <span
                        onClick={() => setSearch("")}
                        style={{
                            position: "absolute",
                            right: 10,
                            top: "50%",
                            transform: "translateY(-50%)",
                            cursor: "pointer",
                            color: "#6b7280",
                            fontSize: 18,
                            lineHeight: 1
                        }}
                    >
                        ×
                    </span>
                )}
            </div>

            {filtered.length === 0 ? (
                <p className="text-muted">
                    {user?.role === "RESTAURANT_OWNER" || search
                        ? "Nessun ristorante trovato."
                        : `Nessun ristorante trovato a ${user?.city}.`}
                </p>
            ) : (
                <Row className="g-4">
                    {filtered.map((restaurant) => (
                        <Col key={restaurant.id} xs={12} sm={6} lg={4}>
                            <RestaurantCard restaurant={restaurant} />
                        </Col>
                    ))}
                </Row>
            )}
        </Container>
    )
}

export default HomePage