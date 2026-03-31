import { useState, useEffect } from "react"
import { Container, Row, Col, Form, Button } from "react-bootstrap"
import { useAuth } from "../context/AuthContext"
import { getAllRestaurantsApi, getRestaurantsByCityApi } from "../api/restaurantApi"
import RestaurantCard from "../components/RestaurantCard"

function HomePage() {
    const [restaurants, setRestaurants] = useState([])
    const [search, setSearch] = useState("")
    const [typeFilter, setTypeFilter] = useState("")
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    // Stato per la paginazione
    const [currentPage, setCurrentPage] = useState(0)
    const [totalPages, setTotalPages] = useState(0)

    // Numero di ristoranti per pagina
    const PAGE_SIZE = 9

    const { token, user } = useAuth()

    useEffect(() => {
        // Aspetto 400ms dopo che l'utente smette di scrivere prima di fare la chiamata (debounce)
        const timer = setTimeout(() => {
            const fetchRestaurants = async () => {
                // Mostro il loading solo al primo caricamento per non perdere il focus sulla barra di ricerca
                if (restaurants.length === 0) setLoading(true)
                try {
                    if (search || user?.role === "RESTAURANT_OWNER") {
                        const pageData = await getAllRestaurantsApi(token, currentPage, typeFilter)
                        // Filtro client-side per nome e città se c'è una ricerca attiva
                        const filtered = search
                            ? (pageData.content || []).filter(r =>
                                r.name.toLowerCase().includes(search.toLowerCase()) ||
                                r.city.toLowerCase().includes(search.toLowerCase())
                            )
                            : (pageData.content || [])
                        setRestaurants(filtered)
                        // Se c'è una ricerca attiva ricalcolo le pagine in base ai risultati filtrati
                        // altrimenti uso il totalPages del backend
                        setTotalPages(search
                            ? Math.ceil(filtered.length / PAGE_SIZE)
                            : pageData.totalPages || 0
                        )
                    } else {
                        const data = await getRestaurantsByCityApi(user?.city, token)
                        // Filtro per tipologia client-side per i ristoranti della città
                        const filtered = typeFilter
                            ? data.filter(r => r.restaurantType === typeFilter)
                            : data
                        setRestaurants(filtered || [])
                        // Calcolo il numero di pagine client-side
                        // Non resetto currentPage qui — viene già gestito da handleTypeFilterChange e handleSearchChange
                        setTotalPages(Math.ceil((filtered || []).length / PAGE_SIZE))
                    }
                } catch (err) {
                    setError(err.message)
                } finally {
                    setLoading(false)
                }
            }
            fetchRestaurants()
        }, 400)

        // Pulisco il timer se l'utente scrive un'altra lettera prima dei 400ms
        return () => clearTimeout(timer)
    }, [search, typeFilter, currentPage])

    // Quando cambia la ricerca torno alla prima pagina
    const handleSearchChange = (e) => {
        setSearch(e.target.value)
        setCurrentPage(0)
    }

    // Quando cambia il filtro tipologia torno alla prima pagina
    const handleTypeFilterChange = (e) => {
        setTypeFilter(e.target.value)
        setCurrentPage(0)
    }

    // Ordino mettendo prima i ristoranti della città dell'utente
    const sorted = [...restaurants].sort((a, b) => {
        const aIsLocal = a.city.toLowerCase() === user?.city?.toLowerCase()
        const bIsLocal = b.city.toLowerCase() === user?.city?.toLowerCase()
        if (aIsLocal && !bIsLocal) return -1
        if (!aIsLocal && bIsLocal) return 1
        return 0
    })

    // Se siamo in modalità città (USER senza ricerca) pagino client-side
    const isClientSide = !search && user?.role !== "RESTAURANT_OWNER"
    const paginated = isClientSide
        ? sorted.slice(currentPage * PAGE_SIZE, (currentPage + 1) * PAGE_SIZE)
        : sorted

    if (loading) return <p className="text-center mt-5">Caricamento...</p>
    if (error) return <p className="text-center mt-5 text-danger">{error}</p>

    return (
        <Container className="py-4">
            {/* Titolo con la città dell'utente */}
            <h4 className="fw-bold mb-4" style={{ color: "#1a1a2e" }}>
                {user?.role === "RESTAURANT_OWNER" || search
                    ? "Scopri i ristoranti"
                    : `Scopri i ristoranti a ${user?.city}`}
            </h4>

            {/* Barra di ricerca e filtro tipologia */}
            <div className="d-flex gap-3 mb-4 flex-wrap">
                <div className="position-relative" style={{ maxWidth: 400, flex: 1 }}>
                    <Form.Control
                        placeholder="Cerca per nome o città..."
                        value={search}
                        onChange={handleSearchChange}
                    />
                    {/* Mostra la X solo se c'è del testo nella barra di ricerca */}
                    {search && (
                        <span
                            onClick={() => { setSearch(""); setCurrentPage(0) }}
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

                {/* Filtro per tipologia — valori allineati all'enum RestaurantType del backend */}
                <Form.Select
                    value={typeFilter}
                    onChange={handleTypeFilterChange}
                    style={{ maxWidth: 200 }}
                >
                    <option value="">Tutte le tipologie</option>
                    <option value="RESTAURANT">Ristorante</option>
                    <option value="PIZZERIA">Pizzeria</option>
                    <option value="SUSHI">Sushi</option>
                    <option value="FAST_FOOD">Fast Food</option>
                    <option value="VEGAN">Vegan</option>
                    <option value="STEAKHOUSE">Steakhouse</option>
                    <option value="SEAFOOD">Seafood</option>
                    <option value="MEXICAN">Mexican</option>
                    <option value="CHINESE">Chinese</option>
                    <option value="BISTROT">Bistrot</option>
                    <option value="OSTERIA">Osteria</option>
                    <option value="TRATTORIA">Trattoria</option>
                    <option value="FINE_DINING">Fine Dining</option>
                    <option value="OTHER">Altro</option>
                </Form.Select>
            </div>

            {paginated.length === 0 ? (
                <p className="text-muted">
                    {user?.role === "RESTAURANT_OWNER" || search
                        ? "Nessun ristorante trovato."
                        : `Nessun ristorante trovato a ${user?.city}.`}
                </p>
            ) : (
                <>
                    <Row className="g-4">
                        {paginated.map((restaurant) => (
                            <Col key={restaurant.id} xs={12} sm={6} lg={4}>
                                <RestaurantCard restaurant={restaurant} />
                            </Col>
                        ))}
                    </Row>

                    {/* Paginazione - mostro solo se ci sono più pagine */}
                    {totalPages > 1 && (
                        <div className="d-flex justify-content-center align-items-center gap-2 mt-4">
                            {/* Bottone pagina precedente */}
                            <Button
                                size="sm"
                                disabled={currentPage === 0}
                                onClick={() => setCurrentPage(currentPage - 1)}
                                style={{
                                    background: currentPage === 0 ? "#e9ecef" : "#c8102e",
                                    border: "none",
                                    color: currentPage === 0 ? "#6b7280" : "#fff"
                                }}
                            >
                                ←
                            </Button>

                            {/* Numeri di pagina */}
                            {[...Array(totalPages)].map((_, i) => (
                                <Button
                                    key={i}
                                    size="sm"
                                    onClick={() => setCurrentPage(i)}
                                    style={{
                                        background: currentPage === i ? "#c8102e" : "transparent",
                                        border: `1px solid ${currentPage === i ? "#c8102e" : "#dee2e6"}`,
                                        color: currentPage === i ? "#fff" : "#6b7280",
                                        minWidth: 36
                                    }}
                                >
                                    {i + 1}
                                </Button>
                            ))}

                            {/* Bottone pagina successiva */}
                            <Button
                                size="sm"
                                disabled={currentPage === totalPages - 1}
                                onClick={() => setCurrentPage(currentPage + 1)}
                                style={{
                                    background: currentPage === totalPages - 1 ? "#e9ecef" : "#c8102e",
                                    border: "none",
                                    color: currentPage === totalPages - 1 ? "#6b7280" : "#fff"
                                }}
                            >
                                →
                            </Button>
                        </div>
                    )}
                </>
            )}
        </Container>
    )
}

export default HomePage