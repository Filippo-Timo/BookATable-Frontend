import { Navbar, Nav, Button, Container } from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

function AppNavbar() {
    const { user, logout } = useAuth()
    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        navigate("/auth")
    }

    return (
        <Navbar bg="white" className="border-bottom shadow-sm px-4" style={{ height: 58 }}>
            <Container fluid>
                <Navbar.Brand
                    className="fw-black me-4"
                    style={{ color: "#c8102e", fontSize: 19, cursor: "pointer" }}
                    onClick={() => navigate("/")}
                >
                    Book<span style={{ color: "#1a1a2e" }}>ATable</span>
                </Navbar.Brand>

                <Nav className="me-auto">
                    <Nav.Link onClick={() => navigate("/")} style={{ fontSize: 13, color: "#6b7280", fontWeight: 600 }}>
                        Scopri
                    </Nav.Link>
                    {user?.role === "USER" && (
                        <Nav.Link onClick={() => navigate("/reservations")} style={{ fontSize: 13, color: "#6b7280", fontWeight: 600 }}>
                            Le mie prenotazioni
                        </Nav.Link>
                    )}
                    {user?.role === "RESTAURANT_OWNER" && (
                        <Nav.Link onClick={() => navigate("/dashboard")} style={{ fontSize: 13, color: "#6b7280", fontWeight: 600 }}>
                            Dashboard
                        </Nav.Link>
                    )}
                </Nav>

                <div className="d-flex align-items-center gap-2">
                    {user && (
                        <span style={{ fontSize: 13, color: "#6b7280", fontWeight: 600 }}>
                            👤 {user.firstName} {user.lastName}
                        </span>
                    )}
                    <Button
                        variant="outline-danger"
                        size="sm"
                        className="fw-semibold"
                        onClick={handleLogout}
                    >
                        Esci
                    </Button>
                </div>
            </Container>
        </Navbar>
    )
}

export default AppNavbar