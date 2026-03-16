import { useState, useEffect } from "react"
import { Container, Row, Col, Form, InputGroup } from "react-bootstrap"
import { useAuth } from "../context/AuthContext"
import { getAllRestaurantsApi } from "../api/restaurantApi"

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

            <InputGroup className="mb-4" style={{ maxWidth: 400 }}>
                <Form.Control
                    placeholder="Cerca per nome o città..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </InputGroup>

            {filtered.length === 0 ? (
                <p className="text-muted">Nessun ristorante trovato.</p>
            ) : (
                <Row className="g-4">
                    {filtered.map((restaurant) => (
                        <Col key={restaurant.id} xs={12} sm={6} lg={4}>
                            <p>{restaurant.name}</p>
                        </Col>
                    ))}
                </Row>
            )}
        </Container>
    )
}

export default HomePage