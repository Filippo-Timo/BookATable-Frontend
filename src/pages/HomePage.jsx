import { useState, useEffect } from "react"
import { Container, Row, Col, Form, InputGroup } from "react-bootstrap"
import { useAuth } from "../context/AuthContext"
import { getAllRestaurantsApi } from "../api/restaurantApi"
import RestaurantCard from "../components/RestaurantCard"

function HomePage() {
    const [restaurants, setRestaurants] = useState([])
    const [search, setSearch] = useState("")
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const { token } = useAuth()

    useEffect(() => {
        const fetchRestaurants = async () => {
            try {
                const data = await getAllRestaurantsApi(token)
                setRestaurants(data || [])
            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        fetchRestaurants()
    }, [])

    const filtered = restaurants.filter((r) =>
        r.name.toLowerCase().includes(search.toLowerCase()) ||
        r.city.toLowerCase().includes(search.toLowerCase())
    )

    if (loading) return <p className="text-center mt-5">Caricamento...</p>
    if (error) return <p className="text-center mt-5 text-danger">{error}</p>

    return (
        <Container className="py-4">
            <h4 className="fw-bold mb-4" style={{ color: "#1a1a2e" }}>Scopri i ristoranti</h4>

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
                <p className="text-muted">Nessun ristorante trovato.</p>
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