import { useState, useEffect } from "react"
import { Container, Row, Col, Form, Button } from "react-bootstrap"
import { useParams, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { createRestaurantApi, updateRestaurantApi, deleteRestaurantApi, getRestaurantByIdApi, uploadRestaurantImageApi } from "../api/restaurantApi"
import BackButton from "../components/BackButton"

function ManageRestaurantPage() {
    const { id } = useParams()
    const { token } = useAuth()
    const navigate = useNavigate()

    // Se c'è un id nell'URL siamo in modalità modifica, altrimenti in modalità creazione
    const isEditing = !!id

    const [formData, setFormData] = useState({
        name: "",
        city: "",
        address: "",
        restaurantType: "RESTAURANT",
        description: "",
        availableSeatsIndoor: 0,
        availableSeatsOutdoor: 0,
        phone: ""
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(false)
    const [restaurant, setRestaurant] = useState(null)

    // Se siamo in modalità modifica, recupero i dati del ristorante e precompilo il form
    useEffect(() => {
        if (isEditing) {
            const fetchRestaurant = async () => {
                try {
                    const data = await getRestaurantByIdApi(id, token)
                    setRestaurant(data)
                    setFormData({
                        name: data.name || "",
                        city: data.city || "",
                        address: data.address || "",
                        restaurantType: data.restaurantType || "RESTAURANT",
                        description: data.description || "",
                        availableSeatsIndoor: data.availableSeatsIndoor || 0,
                        availableSeatsOutdoor: data.availableSeatsOutdoor || 0,
                        phone: data.phone || ""
                    })
                } catch (err) {
                    setError(err.message)
                }
            }
            fetchRestaurant()
        }
    }, [id])

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    // Gestisco la creazione o modifica del ristorante
    const handleSubmit = async (e) => {
        e.preventDefault()
        setError(null)
        setSuccess(false)
        setLoading(true)
        try {
            const body = {
                ...formData,
                availableSeatsIndoor: parseInt(formData.availableSeatsIndoor),
                availableSeatsOutdoor: parseInt(formData.availableSeatsOutdoor)
            }
            if (isEditing) {
                await updateRestaurantApi(id, body, token)
            } else {
                await createRestaurantApi(body, token)
            }
            setSuccess(true)
            // Dopo il salvataggio torno alla dashboard
            setTimeout(() => navigate("/dashboard"), 1500)
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    // Gestisco l'upload dell'immagine del ristorante
    const handleImageChange = async (e) => {
        const file = e.target.files[0]
        if (!file) return
        try {
            const updatedRestaurant = await uploadRestaurantImageApi(id, file, token)
            setRestaurant(updatedRestaurant)
        } catch (err) {
            setError(err.message)
        }
    }

    // Gestisco l'eliminazione del ristorante
    const handleDelete = async () => {
        if (!window.confirm("Sei sicuro di voler eliminare questo ristorante? Questa azione è irreversibile!")) return
        try {
            await deleteRestaurantApi(id, token)
            navigate("/dashboard")
        } catch (err) {
            setError(err.message)
        }
    }

    return (
        <Container className="py-4">

            <BackButton />

            <Row className="justify-content-center">
                <Col xs={12} md={8}>

                    <h4 className="fw-bold mb-4" style={{ color: "#1a1a2e" }}>
                        {isEditing ? "✏️ Modifica ristorante" : "🍽️ Nuovo ristorante"}
                    </h4>

                    {/* Sezione immagine - solo in modalità modifica */}
                    {isEditing && restaurant && (
                        <div className="mb-4">
                            <img
                                src={restaurant.imageUrl || "https://placehold.co/800x300?text=Ristorante"}
                                alt={restaurant.name}
                                className="w-100 rounded mb-2"
                                style={{ height: 200, objectFit: "cover" }}
                            />
                            <label
                                htmlFor="imageInput"
                                className="btn btn-sm fw-semibold"
                                style={{ background: "#c8102e", color: "#fff", border: "none", cursor: "pointer" }}
                            >
                                📷 Cambia immagine
                            </label>
                            <input
                                id="imageInput"
                                type="file"
                                accept="image/*"
                                style={{ display: "none" }}
                                onChange={handleImageChange}
                            />
                        </div>
                    )}

                    <Form onSubmit={handleSubmit}>
                        <Row className="g-2">
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="small fw-bold text-secondary text-uppercase">Nome</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="small fw-bold text-secondary text-uppercase">Città</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Form.Group className="mb-3">
                            <Form.Label className="small fw-bold text-secondary text-uppercase">Indirizzo</Form.Label>
                            <Form.Control
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label className="small fw-bold text-secondary text-uppercase">Tipo di ristorante</Form.Label>
                            <Form.Select
                                name="restaurantType"
                                value={formData.restaurantType}
                                onChange={handleChange}
                            >
                                <option value="RESTAURANT">Ristorante</option>
                                <option value="PIZZERIA">Pizzeria</option>
                                <option value="SUSHI">Sushi</option>
                                <option value="BURGER">Burger</option>
                                <option value="VEGAN">Vegan</option>
                                <option value="STEAKHOUSE">Steakhouse</option>
                                <option value="CAFE">Cafè</option>
                                <option value="BAKERY">Bakery</option>
                                <option value="SEAFOOD">Seafood</option>
                                <option value="MEXICAN">Mexican</option>
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label className="small fw-bold text-secondary text-uppercase">Descrizione</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <Row className="g-2">
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="small fw-bold text-secondary text-uppercase">Posti interni</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="availableSeatsIndoor"
                                        value={formData.availableSeatsIndoor}
                                        onChange={handleChange}
                                        min={0}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="small fw-bold text-secondary text-uppercase">Posti esterni</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="availableSeatsOutdoor"
                                        value={formData.availableSeatsOutdoor}
                                        onChange={handleChange}
                                        min={0}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Form.Group className="mb-4">
                            <Form.Label className="small fw-bold text-secondary text-uppercase">Telefono</Form.Label>
                            <Form.Control
                                type="text"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        {/* Messaggi di errore e successo */}
                        {error && (
                            <div className="alert alert-danger py-2 mb-3" style={{ fontSize: 13 }}>
                                {error}
                            </div>
                        )}
                        {success && (
                            <div className="alert alert-success py-2 mb-3" style={{ fontSize: 13 }}>
                                {isEditing ? "Ristorante aggiornato con successo!" : "Ristorante creato con successo!"}
                            </div>
                        )}

                        <div className="d-flex gap-2">
                            <Button
                                type="submit"
                                className="fw-bold"
                                style={{ background: "#c8102e", border: "none" }}
                                disabled={loading}
                            >
                                {loading ? "Salvataggio..." : isEditing ? "Salva modifiche" : "Crea ristorante"}
                            </Button>
                            <Button
                                type="button"
                                variant="outline-secondary"
                                onClick={() => navigate("/dashboard")}
                            >
                                Annulla
                            </Button>
                        </div>
                    </Form>

                    {/* Zona pericolosa - solo in modalità modifica */}
                    {isEditing && (
                        <div className="mt-4">
                            <hr />
                            <h6 className="fw-bold mb-2" style={{ color: "#dc3545" }}>⚠️ Zona pericolosa</h6>
                            <p className="text-muted mb-3" style={{ fontSize: 13 }}>
                                L'eliminazione del ristorante è irreversibile e cancellerà anche tutti i menu, le recensioni e le prenotazioni collegate.
                            </p>
                            <Button
                                variant="outline-danger"
                                size="sm"
                                className="fw-semibold"
                                onClick={handleDelete}
                            >
                                Elimina ristorante
                            </Button>
                        </div>
                    )}

                </Col>
            </Row>
        </Container>
    )
}

export default ManageRestaurantPage