import { useState, useEffect } from "react"
import { Container, Row, Col, Form, Button } from "react-bootstrap"
import { useParams, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { getMenusByRestaurantApi, createMenuApi, deleteMenuApi } from "../api/menuApi"
import { createDishApi, updateDishApi, deleteDishApi } from "../api/dishApi"
import BackButton from "../components/BackButton"

function ManageMenuPage() {
    const { id } = useParams()
    const { token } = useAuth()
    const navigate = useNavigate()

    const [menus, setMenus] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    // Stato per il form nuovo menu
    const [newMenuType, setNewMenuType] = useState("LUNCH")
    const [menuError, setMenuError] = useState(null)

    // Stato per il form nuovo piatto — salvo l'id del menu a cui aggiungere il piatto
    const [newDish, setNewDish] = useState({ menuId: "", name: "", ingredients: "", price: "" })
    const [dishError, setDishError] = useState(null)

    // Stato per il piatto in modifica
    const [editingDishId, setEditingDishId] = useState(null)
    const [editDish, setEditDish] = useState({ name: "", ingredients: "", price: "" })
    const [editDishError, setEditDishError] = useState(null)

    // Recupero i menu del ristorante all'avvio
    useEffect(() => {
        const fetchMenus = async () => {
            try {
                const data = await getMenusByRestaurantApi(id, token)
                setMenus(data)
            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }
        fetchMenus()
    }, [id])

    // Gestisco la creazione di un nuovo menu
    const handleCreateMenu = async (e) => {
        e.preventDefault()
        setMenuError(null)
        try {
            const newMenu = await createMenuApi(id, { restaurantId: id, menuType: newMenuType }, token)
            // Aggiungo il nuovo menu alla lista con un array di piatti vuoto
            setMenus([...menus, { ...newMenu, dishes: [] }])
            setNewMenuType("LUNCH")
        } catch (err) {
            setMenuError(err.message)
        }
    }

    // Gestisco l'eliminazione di un menu
    const handleDeleteMenu = async (menuId) => {
        try {
            await deleteMenuApi(menuId, token)
            // Rimuovo il menu dalla lista senza ricaricare la pagina
            setMenus(menus.filter(m => m.id !== menuId))
        } catch (err) {
            alert(err.message)
        }
    }

    // Gestisco la creazione di un nuovo piatto
    const handleCreateDish = async (e, menuId) => {
        e.preventDefault()
        setDishError(null)
        try {
            const dish = await createDishApi({
                menuId: menuId,
                name: newDish.name,
                ingredients: newDish.ingredients,
                price: parseFloat(newDish.price)
            }, token)
            // Aggiungo il piatto al menu corretto senza ricaricare la pagina
            setMenus(menus.map(m => m.id === menuId
                ? { ...m, dishes: [...(m.dishes || []), dish] }
                : m
            ))
            setNewDish({ menuId: "", name: "", ingredients: "", price: "" })
        } catch (err) {
            setDishError(err.message)
        }
    }

    // Apro il form di modifica per un piatto
    const handleStartEditDish = (dish) => {
        setEditingDishId(dish.id)
        setEditDish({ name: dish.name, ingredients: dish.ingredients, price: dish.price })
        setEditDishError(null)
    }

    // Annullo la modifica del piatto
    const handleCancelEditDish = () => {
        setEditingDishId(null)
        setEditDish({ name: "", ingredients: "", price: "" })
        setEditDishError(null)
    }

    // Gestisco il salvataggio della modifica del piatto
    const handleEditDish = async (e, menuId, dishId) => {
        e.preventDefault()
        setEditDishError(null)
        try {
            const updatedDish = await updateDishApi(dishId, {
                name: editDish.name,
                ingredients: editDish.ingredients,
                price: parseFloat(editDish.price)
            }, token)
            // Aggiorno il piatto nel menu corretto senza ricaricare la pagina
            setMenus(menus.map(m => m.id === menuId
                ? { ...m, dishes: m.dishes.map(d => d.id === dishId ? updatedDish : d) }
                : m
            ))
            setEditingDishId(null)
        } catch (err) {
            setEditDishError(err.message)
        }
    }

    // Gestisco l'eliminazione di un piatto
    const handleDeleteDish = async (menuId, dishId) => {
        try {
            await deleteDishApi(dishId, token)
            // Rimuovo il piatto dal menu corretto senza ricaricare la pagina
            setMenus(menus.map(m => m.id === menuId
                ? { ...m, dishes: m.dishes.filter(d => d.id !== dishId) }
                : m
            ))
        } catch (err) {
            alert(err.message)
        }
    }

    if (loading) return <p className="text-center mt-5">Caricamento...</p>
    if (error) return <p className="text-center mt-5 text-danger">{error}</p>

    return (
        <Container className="py-4">

            <BackButton />

            <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="fw-bold mb-0" style={{ color: "#1a1a2e" }}>📖 Gestisci menu</h4>
                <Button
                    variant="outline-secondary"
                    size="sm"
                    onClick={() => navigate("/dashboard")}
                >
                    ← Torna alla dashboard
                </Button>
            </div>

            {/* Form per aggiungere un nuovo menu */}
            <div className="p-3 rounded mb-4" style={{ background: "#f8f9fa", border: "1px solid #e9ecef" }}>
                <h6 className="fw-bold mb-3" style={{ color: "#1a1a2e" }}>Aggiungi un menu</h6>
                <Form onSubmit={handleCreateMenu} className="d-flex gap-2 align-items-end">
                    <Form.Group style={{ flex: 1 }}>
                        <Form.Label className="small fw-bold text-secondary text-uppercase">Tipo di menu</Form.Label>
                        <Form.Select
                            value={newMenuType}
                            onChange={(e) => setNewMenuType(e.target.value)}
                        >
                            <option value="LUNCH">Pranzo</option>
                            <option value="DINNER">Cena</option>
                            <option value="HOLIDAY">Festivo</option>
                            <option value="ALLYOUCANEAT">All You Can Eat</option>
                            <option value="A_LA_CARTE">À la carte</option>
                        </Form.Select>
                    </Form.Group>
                    <Button
                        type="submit"
                        className="fw-bold"
                        style={{ background: "#c8102e", border: "none" }}
                    >
                        + Aggiungi
                    </Button>
                </Form>
                {menuError && (
                    <div className="alert alert-danger py-2 mt-2 mb-0" style={{ fontSize: 13 }}>
                        {menuError}
                    </div>
                )}
            </div>

            {/* Lista dei menu con i piatti */}
            {menus.length === 0 ? (
                <p className="text-muted">Nessun menu è stato ancora aggiunto. Aggiungine uno!</p>
            ) : (
                menus.map((menu) => (
                    <div key={menu.id} className="mb-4 p-3 rounded shadow-sm bg-white" style={{ border: "1px solid #e9ecef" }}>

                        {/* Header menu */}
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h5 className="fw-bold mb-0" style={{ color: "#c8102e" }}>
                                {menu.menuType === "LUNCH" ? "Pranzo"
                                    : menu.menuType === "DINNER" ? "Cena"
                                        : menu.menuType === "HOLIDAY" ? "Festivo"
                                            : menu.menuType === "ALLYOUCANEAT" ? "All You Can Eat"
                                                : "À la carte"}
                            </h5>
                            <Button
                                size="sm"
                                variant="outline-danger"
                                onClick={() => handleDeleteMenu(menu.id)}
                            >
                                Elimina menu
                            </Button>
                        </div>

                        {/* Lista piatti */}
                        {menu.dishes && menu.dishes.length === 0 ? (
                            <p className="text-muted mb-3" style={{ fontSize: 13 }}>Nessun piatto è stato ancora aggiunto.</p>
                        ) : (
                            menu.dishes && menu.dishes.map((dish) => (
                                <div key={dish.id} className="py-2 border-bottom">
                                    {editingDishId === dish.id ? (
                                        // Form di modifica inline del piatto
                                        <Form onSubmit={(e) => handleEditDish(e, menu.id, dish.id)}>
                                            <Row className="g-2">
                                                <Col md={4}>
                                                    <Form.Control
                                                        type="text"
                                                        placeholder="Nome"
                                                        value={editDish.name}
                                                        onChange={(e) => setEditDish({ ...editDish, name: e.target.value })}
                                                        required
                                                    />
                                                </Col>
                                                <Col md={5}>
                                                    <Form.Control
                                                        type="text"
                                                        placeholder="Ingredienti"
                                                        value={editDish.ingredients}
                                                        onChange={(e) => setEditDish({ ...editDish, ingredients: e.target.value })}
                                                        required
                                                    />
                                                </Col>
                                                <Col md={3}>
                                                    <Form.Control
                                                        type="number"
                                                        placeholder="Prezzo"
                                                        value={editDish.price}
                                                        onChange={(e) => setEditDish({ ...editDish, price: e.target.value })}
                                                        min={0}
                                                        step="0.01"
                                                        required
                                                    />
                                                </Col>
                                            </Row>
                                            {editDishError && (
                                                <div className="alert alert-danger py-2 mt-2 mb-0" style={{ fontSize: 13 }}>
                                                    {editDishError}
                                                </div>
                                            )}
                                            <div className="d-flex gap-2 mt-2">
                                                <Button type="submit" size="sm" style={{ background: "#c8102e", border: "none" }} className="fw-semibold">
                                                    Salva
                                                </Button>
                                                <Button type="button" size="sm" variant="outline-secondary" onClick={handleCancelEditDish}>
                                                    Annulla
                                                </Button>
                                            </div>
                                        </Form>
                                    ) : (
                                        // Visualizzazione normale del piatto
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div>
                                                <p className="mb-0 fw-semibold" style={{ fontSize: 14 }}>{dish.name}</p>
                                                <p className="mb-0 text-muted" style={{ fontSize: 12 }}>{dish.ingredients}</p>
                                            </div>
                                            <div className="d-flex align-items-center gap-2">
                                                <span className="fw-bold" style={{ color: "#c8102e", fontSize: 14 }}>
                                                    €{dish.price}
                                                </span>
                                                <Button
                                                    size="sm"
                                                    variant="outline-secondary"
                                                    onClick={() => handleStartEditDish(dish)}
                                                >
                                                    Modifica
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline-danger"
                                                    onClick={() => handleDeleteDish(menu.id, dish.id)}
                                                >
                                                    Elimina
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))
                        )}

                        {/* Form per aggiungere un nuovo piatto al menu */}
                        <div className="mt-3 p-2 rounded" style={{ background: "#f8f9fa" }}>
                            <p className="mb-2 small fw-bold text-secondary text-uppercase">Aggiungi piatto</p>
                            <Form onSubmit={(e) => handleCreateDish(e, menu.id)}>
                                <Row className="g-2">
                                    <Col md={4}>
                                        <Form.Control
                                            type="text"
                                            placeholder="Nome piatto"
                                            value={newDish.menuId === menu.id ? newDish.name : ""}
                                            onChange={(e) => setNewDish({ ...newDish, menuId: menu.id, name: e.target.value })}
                                            required
                                        />
                                    </Col>
                                    <Col md={5}>
                                        <Form.Control
                                            type="text"
                                            placeholder="Ingredienti"
                                            value={newDish.menuId === menu.id ? newDish.ingredients : ""}
                                            onChange={(e) => setNewDish({ ...newDish, menuId: menu.id, ingredients: e.target.value })}
                                            required
                                        />
                                    </Col>
                                    <Col md={2}>
                                        <Form.Control
                                            type="number"
                                            placeholder="€"
                                            value={newDish.menuId === menu.id ? newDish.price : ""}
                                            onChange={(e) => setNewDish({ ...newDish, menuId: menu.id, price: e.target.value })}
                                            min={0}
                                            step="0.01"
                                            required
                                        />
                                    </Col>
                                    <Col md={1}>
                                        <Button
                                            type="submit"
                                            className="w-100 fw-bold"
                                            style={{ background: "#c8102e", border: "none" }}
                                        >
                                            +
                                        </Button>
                                    </Col>
                                </Row>
                                {dishError && newDish.menuId === menu.id && (
                                    <div className="alert alert-danger py-2 mt-2 mb-0" style={{ fontSize: 13 }}>
                                        {dishError}
                                    </div>
                                )}
                            </Form>
                        </div>

                    </div>
                ))
            )}
        </Container>
    )
}

export default ManageMenuPage