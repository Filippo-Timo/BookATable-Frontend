import { useState, useEffect } from "react"
import { Container, Row, Col, Badge, Button, Form } from "react-bootstrap"
import { useParams, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { getRestaurantByIdApi } from "../api/restaurantApi"
import { getMenusByRestaurantApi } from "../api/menuApi"
import { getReviewsByRestaurantApi, createReviewApi, deleteReviewApi, updateReviewApi } from "../api/reviewApi"

function RestaurantDetailPage() {
    const { id } = useParams()
    const { token, user } = useAuth()
    const navigate = useNavigate()

    const [restaurant, setRestaurant] = useState(null)
    const [menus, setMenus] = useState([])
    const [reviews, setReviews] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    // Stato per il form nuova recensione
    const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" })
    const [reviewError, setReviewError] = useState(null)

    // Stato per la recensione in modifica — salvo l'id e i dati della recensione che si sta modificando
    const [editingReviewId, setEditingReviewId] = useState(null)
    const [editForm, setEditForm] = useState({ rating: 5, comment: "" })
    const [editError, setEditError] = useState(null)

    useEffect(() => {
        // Faccio 3 chiamate in parallelo con Promise.all per ottimizzare i tempi di caricamento
        const fetchAll = async () => {
            try {
                const [restaurantData, menusData, reviewsData] = await Promise.all([
                    getRestaurantByIdApi(id, token),
                    getMenusByRestaurantApi(id, token),
                    getReviewsByRestaurantApi(id, token)
                ])
                setRestaurant(restaurantData)
                setMenus(menusData)
                setReviews(reviewsData)
            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        fetchAll()
    }, [id])

    // Gestisco la creazione di una nuova recensione
    const handleReviewSubmit = async (e) => {
        e.preventDefault()
        setReviewError(null)
        try {
            const newReview = await createReviewApi(id, reviewForm, token)
            // Aggiungo la nuova recensione alla lista senza ricaricare la pagina
            setReviews([...reviews, newReview])
            setReviewForm({ rating: 5, comment: "" })
        } catch (err) {
            setReviewError(err.message)
        }
    }

    // Gestisco l'eliminazione di una recensione
    const handleDeleteReview = async (reviewId) => {
        try {
            await deleteReviewApi(id, reviewId, token)
            // Rimuovo la recensione dalla lista senza ricaricare la pagina
            setReviews(reviews.filter(r => r.id !== reviewId))
        } catch (err) {
            alert(err.message)
        }
    }

    // Apro il form di modifica per una recensione — precompilo con i dati esistenti
    const handleStartEdit = (review) => {
        setEditingReviewId(review.id)
        setEditForm({ rating: review.rating, comment: review.comment || "" })
        setEditError(null)
    }

    // Annullo la modifica e pulisco l'errore
    const handleCancelEdit = () => {
        setEditingReviewId(null)
        setEditForm({ rating: 5, comment: "" })
        setEditError(null)
    }

    // Gestisco il salvataggio della modifica
    const handleEditSubmit = async (e, reviewId) => {
        e.preventDefault()
        setEditError(null)
        try {
            const updatedReview = await updateReviewApi(id, reviewId, editForm, token)
            // Aggiorno la recensione nella lista senza ricaricare la pagina
            setReviews(reviews.map(r => r.id === reviewId ? updatedReview : r))
            setEditingReviewId(null)
        } catch (err) {
            setEditError(err.message)
        }
    }

    if (loading) return <p className="text-center mt-5">Caricamento...</p>
    if (error) return <p className="text-center mt-5 text-danger">{error}</p>

    // Costruisco il link a Google Maps con nome, indirizzo e città del ristorante
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(restaurant.name + " " + restaurant.address + " " + restaurant.city)}`

    return (
        <Container className="py-4">

            {/* Immagine grande del ristorante */}
            <img
                src={restaurant.imageUrl || "https://placehold.co/1200x400?text=Ristorante"}
                alt={restaurant.name}
                className="w-100 mb-4"
                style={{ height: 300, objectFit: "cover", borderRadius: 12 }}
            />

            {/* Info principali + Google Maps */}
            <Row className="mb-4">

                {/* Colonna sinistra - Info ristorante */}
                <Col md={6}>
                    <Badge className="mb-2" style={{ background: "#c8102e", fontSize: 12 }}>
                        {restaurant.restaurantType}
                    </Badge>
                    <h2 className="fw-bold" style={{ color: "#1a1a2e" }}>{restaurant.name}</h2>
                    <p className="text-muted mb-1">📍 {restaurant.city}, {restaurant.address}</p>
                    <p className="text-muted mb-1">📞 {restaurant.phone}</p>
                    <p className="text-muted mb-1">🪑 {restaurant.maxSeats} posti totali ({restaurant.availableSeatsIndoor} interni, {restaurant.availableSeatsOutdoor} esterni)</p>
                    {restaurant.description && (
                        <p className="mt-3" style={{ color: "#6b7280" }}>{restaurant.description}</p>
                    )}

                    {/* Bottone prenota - solo per USER */}
                    {user?.role === "USER" && (
                        <Button
                            className="mt-3 fw-bold"
                            style={{ background: "#c8102e", border: "none" }}
                            onClick={() => navigate(`/restaurants/${id}/booking`)}
                        >
                            📅 Prenota un tavolo
                        </Button>
                    )}
                </Col>

                {/* Colonna destra - Link Google Maps cliccabile */}
                <Col md={6} className="d-flex align-items-stretch">
                    <a
                        href={mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ textDecoration: "none", width: "100%" }}
                    >
                        <div
                            className="w-100 h-100 d-flex flex-column align-items-center justify-content-center rounded"
                            style={{
                                minHeight: 200,
                                background: "linear-gradient(135deg, #c8102e 0%, #6d0017 100%)",
                                cursor: "pointer",
                                position: "relative",
                                overflow: "hidden",
                                boxShadow: "0 4px 15px rgba(0,0,0,0.2)"
                            }}
                        >
                            {/* Cerchi decorativi di sfondo */}
                            <div style={{
                                position: "absolute",
                                width: 200,
                                height: 200,
                                borderRadius: "50%",
                                border: "1px solid rgba(255,255,255,0.1)",
                                top: -50,
                                right: -50
                            }} />
                            <div style={{
                                position: "absolute",
                                width: 150,
                                height: 150,
                                borderRadius: "50%",
                                border: "1px solid rgba(255,255,255,0.1)",
                                bottom: -30,
                                left: -30
                            }} />

                            {/* Contenuto */}
                            <div style={{ fontSize: 48, zIndex: 1 }}>📍</div>
                            <p className="fw-bold mt-2 mb-1" style={{ color: "#fff", fontSize: 16, zIndex: 1 }}>
                                Vedi su Google Maps
                            </p>
                            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 13, zIndex: 1, textAlign: "center", padding: "0 20px" }}>
                                {restaurant.address}, {restaurant.city}
                            </p>
                            <div
                                className="mt-2 px-4 py-2 rounded-pill fw-semibold"
                                style={{ background: "#c8102e", color: "#fff", fontSize: 13, zIndex: 1 }}
                            >
                                Apri mappa →
                            </div>
                        </div>
                    </a>
                </Col>

            </Row>

            <hr />

            {/* Sezione Menu */}
            <h4 className="fw-bold mb-3" style={{ color: "#1a1a2e" }}>📖 Menu</h4>
            {
                menus.length === 0 ? (
                    <p className="text-muted">Nessun menu disponibile.</p>
                ) : (
                    menus.map((menu) => (
                        <div key={menu.id} className="mb-4">
                            {/* Titolo del menu basato sul tipo */}
                            <h5 className="fw-bold" style={{ color: "#c8102e" }}>{menu.menuType}</h5>
                            {menu.dishes && menu.dishes.length === 0 ? (
                                <p className="text-muted" style={{ fontSize: 13 }}>Il menu "{menu.menuType}" non è stato ancora aggiunto.</p>
                            ) : (
                                menu.dishes && menu.dishes.map((dish) => (
                                    <div key={dish.id} className="d-flex justify-content-between align-items-center py-2 border-bottom">
                                        <div>
                                            <p className="mb-0 fw-semibold" style={{ fontSize: 14 }}>{dish.name}</p>
                                            {dish.description && (
                                                <p className="mb-0 text-muted" style={{ fontSize: 12 }}>{dish.description}</p>
                                            )}
                                        </div>
                                        <span className="fw-bold" style={{ color: "#c8102e", fontSize: 14 }}>
                                            €{dish.price}
                                        </span>
                                    </div>
                                ))
                            )}
                        </div>
                    ))
                )
            }

            <hr />

            {/* Sezione Recensioni */}
            <h4 className="fw-bold mb-3" style={{ color: "#1a1a2e" }}>⭐ Recensioni</h4>
            {
                reviews.length === 0 ? (
                    <p className="text-muted">Nessuna recensione ancora.</p>
                ) : (
                    reviews.map((review) => (
                        <div key={review.id} className="mb-3 p-3 bg-light rounded">
                            <div className="d-flex justify-content-between align-items-center mb-1">
                                <span className="fw-bold" style={{ fontSize: 14 }}>
                                    👤 {review.user?.firstName} {review.user?.lastName}
                                </span>
                                <div className="d-flex align-items-center gap-2">
                                    <span style={{ color: "#c8102e", fontWeight: 700 }}>{"⭐".repeat(review.rating)}</span>
                                    {/* Mostra i bottoni modifica ed elimina solo se la recensione appartiene all'utente loggato */}
                                    {user?.id === review.user?.id && (
                                        <>
                                            <Button
                                                size="sm"
                                                variant="outline-secondary"
                                                onClick={() => handleStartEdit(review)}
                                            >
                                                Modifica
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline-danger"
                                                onClick={() => handleDeleteReview(review.id)}
                                            >
                                                Elimina
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </div>
                            {review.comment && (
                                <p className="mb-0 text-muted" style={{ fontSize: 13 }}>{review.comment}</p>
                            )}

                            {/* Form di modifica inline - appare solo per la recensione in modifica */}
                            {editingReviewId === review.id && (
                                <Form className="mt-3" onSubmit={(e) => handleEditSubmit(e, review.id)}>
                                    <Form.Group className="mb-2">
                                        <Form.Label className="small fw-bold text-secondary text-uppercase">Valutazione</Form.Label>
                                        <Form.Select
                                            value={editForm.rating}
                                            onChange={(e) => setEditForm({ ...editForm, rating: parseInt(e.target.value) })}
                                        >
                                            {[1, 2, 3, 4, 5].map(n => (
                                                <option key={n} value={n}>{"⭐".repeat(n)} ({n})</option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                    <Form.Group className="mb-2">
                                        <Form.Label className="small fw-bold text-secondary text-uppercase">Commento</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            rows={2}
                                            value={editForm.comment}
                                            onChange={(e) => setEditForm({ ...editForm, comment: e.target.value })}
                                        />
                                    </Form.Group>
                                    {/* Messaggio di errore inline */}
                                    {editError && (
                                        <div className="alert alert-danger py-2 mb-2" style={{ fontSize: 13 }}>
                                            {editError}
                                        </div>
                                    )}
                                    <div className="d-flex gap-2">
                                        <Button type="submit" size="sm" style={{ background: "#c8102e", border: "none" }} className="fw-semibold">
                                            Salva
                                        </Button>
                                        <Button type="button" size="sm" variant="outline-secondary" onClick={handleCancelEdit}>
                                            Annulla
                                        </Button>
                                    </div>
                                </Form>
                            )}
                        </div>
                    ))
                )
            }

            {/* Form nuova recensione - solo per USER */}
            {
                user?.role === "USER" && (
                    <div className="mt-4">
                        <h5 className="fw-bold mb-3" style={{ color: "#1a1a2e" }}>Lascia una recensione</h5>
                        <Form onSubmit={handleReviewSubmit}>
                            <Form.Group className="mb-3">
                                <Form.Label className="small fw-bold text-secondary text-uppercase">Valutazione</Form.Label>
                                <Form.Select
                                    value={reviewForm.rating}
                                    onChange={(e) => setReviewForm({ ...reviewForm, rating: parseInt(e.target.value) })}
                                >
                                    {[1, 2, 3, 4, 5].map(n => (
                                        <option key={n} value={n}>{"⭐".repeat(n)} ({n})</option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label className="small fw-bold text-secondary text-uppercase">Commento</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    value={reviewForm.comment}
                                    onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                                    placeholder="Scrivi la tua esperienza..."
                                />
                            </Form.Group>
                            {reviewError && (
                                <div className="alert alert-danger py-2 mb-3" style={{ fontSize: 13 }}>
                                    {reviewError}
                                </div>
                            )}
                            <Button type="submit" style={{ background: "#c8102e", border: "none" }} className="fw-bold">
                                Pubblica recensione
                            </Button>
                        </Form>
                    </div>
                )
            }

        </Container >
    )
}

export default RestaurantDetailPage