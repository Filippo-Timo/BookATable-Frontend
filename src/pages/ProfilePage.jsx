import { useState } from "react"
import { Container, Row, Col, Form, Button } from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { updateUserApi, uploadAvatarApi, deleteUserApi } from "../api/userApi"

function ProfilePage() {
    const { user, token, login, logout } = useAuth()
    const navigate = useNavigate()

    // Precompilo il form con i dati dell'utente loggato
    const [formData, setFormData] = useState({
        firstName: user?.firstName || "",
        lastName: user?.lastName || "",
        city: user?.city || "",
        birthDate: user?.birthDate || ""
    })
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    // Gestisco l'aggiornamento dei dati del profilo
    const handleSubmit = async (e) => {
        e.preventDefault()
        setError(null)
        setSuccess(false)
        setLoading(true)
        try {
            const updatedUser = await updateUserApi(formData, token)
            // Aggiorno i dati dell'utente nel context
            login(updatedUser, token)
            setSuccess(true)
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    // Gestisco l'upload dell'avatar
    const handleAvatarChange = async (e) => {
        const file = e.target.files[0]
        if (!file) return
        try {
            const updatedUser = await uploadAvatarApi(file, token)
            // Aggiorno i dati dell'utente nel context con il nuovo avatar
            login(updatedUser, token)
        } catch (err) {
            setError(err.message)
        }
    }

    // Gestisco l'eliminazione dell'account
    const handleDelete = async () => {
        if (!window.confirm("Sei sicuro di voler eliminare il tuo account? Questa azione è irreversibile!")) return
        try {
            await deleteUserApi(token)
            logout()
            navigate("/auth")
        } catch (err) {
            setError(err.message)
        }
    }

    return (
        <Container className="py-4">
            <Row className="justify-content-center">
                <Col xs={12} md={6}>

                    <h4 className="fw-bold mb-4" style={{ color: "#1a1a2e" }}>👤 Il mio profilo</h4>

                    {/* Avatar */}
                    <div className="d-flex align-items-center gap-3 mb-4">
                        <img
                            src={user?.avatar || "https://placehold.co/80x80?text=Avatar"}
                            alt="Avatar"
                            style={{ width: 80, height: 80, borderRadius: "50%", objectFit: "cover", border: "3px solid #c8102e" }}
                        />
                        <div>
                            <p className="mb-1 fw-bold" style={{ color: "#1a1a2e" }}>{user?.firstName} {user?.lastName}</p>
                            <label
                                htmlFor="avatarInput"
                                className="btn btn-sm fw-semibold"
                                style={{ background: "#c8102e", color: "#fff", border: "none", cursor: "pointer" }}
                            >
                                Cambia foto
                            </label>
                            <input
                                id="avatarInput"
                                type="file"
                                accept="image/*"
                                style={{ display: "none" }}
                                onChange={handleAvatarChange}
                            />
                        </div>
                    </div>

                    {/* Form aggiornamento profilo */}
                    <Form onSubmit={handleSubmit}>
                        <Row className="g-2">
                            <Col>
                                <Form.Group className="mb-3">
                                    <Form.Label className="small fw-bold text-secondary text-uppercase">Nome</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group className="mb-3">
                                    <Form.Label className="small fw-bold text-secondary text-uppercase">Cognome</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
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
                        <Form.Group className="mb-4">
                            <Form.Label className="small fw-bold text-secondary text-uppercase">Data di nascita</Form.Label>
                            <Form.Control
                                type="date"
                                name="birthDate"
                                value={formData.birthDate}
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
                                Profilo aggiornato con successo!
                            </div>
                        )}

                        <Button
                            type="submit"
                            className="w-100 fw-bold mb-2"
                            style={{ background: "#c8102e", border: "none" }}
                            disabled={loading}
                        >
                            {loading ? "Salvataggio..." : "Salva modifiche"}
                        </Button>
                    </Form>

                    <hr />

                    {/* Zona pericolosa - eliminazione account */}
                    <div className="mt-3">
                        <h6 className="fw-bold mb-2" style={{ color: "#dc3545" }}>⚠️ Zona pericolosa</h6>
                        <p className="text-muted mb-3" style={{ fontSize: 13 }}>
                            L'eliminazione dell'account è irreversibile e cancellerà tutti i tuoi dati.
                        </p>
                        <Button
                            variant="outline-danger"
                            size="sm"
                            className="fw-semibold"
                            onClick={handleDelete}
                        >
                            Elimina account
                        </Button>
                    </div>

                </Col>
            </Row>
        </Container>
    )
}

export default ProfilePage