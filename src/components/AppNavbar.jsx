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
        <Navbar
            expand="md"
            className="shadow-sm px-3"
            style={{ background: "linear-gradient(135deg, #c8102e 0%, #6d0017 100%)", minHeight: 70 }}
        >
            <Container fluid>
                {/* Logo */}
                <Navbar.Brand
                    className="fw-black"
                    style={{ color: "#fff", fontSize: 19, cursor: "pointer" }}
                    onClick={() => navigate("/")}
                >
                    Book<span style={{ color: "rgba(255,255,255,0.7)" }}>ATable</span>
                </Navbar.Brand>

                {/* Hamburger menu per mobile */}
                <Navbar.Toggle
                    aria-controls="main-navbar"
                    style={{ borderColor: "rgba(255,255,255,0.3)" }}
                >
                    <span style={{ color: "#fff", fontSize: 20 }}>☰</span>
                </Navbar.Toggle>

                <Navbar.Collapse id="main-navbar">
                    {/* Link di navigazione a sinistra */}
                    <Nav className="me-auto mt-2 mt-md-0">
                        <Nav.Link
                            onClick={() => navigate("/")}
                            style={{ fontSize: 13, color: "rgba(255,255,255,0.85)", fontWeight: 600 }}
                        >
                            Scopri
                        </Nav.Link>
                        {user?.role === "USER" && (
                            <Nav.Link
                                onClick={() => navigate("/reservations")}
                                style={{ fontSize: 13, color: "rgba(255,255,255,0.85)", fontWeight: 600 }}
                            >
                                Le mie prenotazioni
                            </Nav.Link>
                        )}
                        {user?.role === "RESTAURANT_OWNER" && (
                            <Nav.Link
                                onClick={() => navigate("/dashboard")}
                                style={{ fontSize: 13, color: "rgba(255,255,255,0.85)", fontWeight: 600 }}
                            >
                                Dashboard
                            </Nav.Link>
                        )}
                    </Nav>

                    {/* Profilo e logout - allineati a destra */}
                    <div className="d-flex align-items-center justify-content-end gap-2 mt-2 mt-md-0 pb-2 pb-md-0">

                        {/* Avatar + nome cliccabile per USER */}
                        {user?.role === "USER" && (
                            <div
                                onClick={() => navigate("/profile")}
                                className="d-flex align-items-center gap-2"
                                style={{ cursor: "pointer" }}
                            >
                                <img
                                    src={user?.avatar || "https://placehold.co/32x32?text=👤"}
                                    alt="Avatar"
                                    style={{ width: 32, height: 32, borderRadius: "50%", objectFit: "cover", border: "1px solid rgba(255,255,255,0.7)" }}
                                />
                                <span style={{ fontSize: 13, color: "rgba(255,255,255,0.85)", fontWeight: 600 }}>
                                    {user.firstName} {user.lastName}
                                </span>
                            </div>
                        )}

                        {/* Solo nome per RESTAURANT_OWNER (non ha avatar) */}
                        {user?.role === "RESTAURANT_OWNER" && (
                            <span style={{ fontSize: 13, color: "rgba(255,255,255,0.85)", fontWeight: 600 }}>
                                👤 {user.firstName} {user.lastName}
                            </span>
                        )}

                        <Button
                            variant="outline-light"
                            size="sm"
                            className="fw-semibold"
                            onClick={handleLogout}
                        >
                            Logout
                        </Button>
                    </div>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

export default AppNavbar