import { Card, Badge } from "react-bootstrap"
import { useNavigate } from "react-router-dom"

function RestaurantCard({ restaurant }) {
    const navigate = useNavigate()

    return (
        <Card
            className="h-100 border-0 shadow-sm"
            style={{ cursor: "pointer", borderRadius: 12, overflow: "hidden" }}
            onClick={() => navigate(`/restaurants/${restaurant.id}`)}
        >
            {/* Immagine ristorante */}
            <Card.Img
                variant="top"
                src={restaurant.imageUrl || "https://placehold.co/400x200?text=Ristorante"}
                style={{ height: 180, objectFit: "cover" }}
            />

            <Card.Body className="p-3">
                {/* Nome e città */}
                <Card.Title className="fw-bold mb-1" style={{ fontSize: 16, color: "#1a1a2e" }}>
                    {restaurant.name}
                </Card.Title>
                <p className="text-muted mb-2" style={{ fontSize: 13 }}>
                    📍 {restaurant.city}
                </p>

                {/* Tipologia */}
                {restaurant.type && (
                    <Badge style={{ background: "#c8102e", fontSize: 11 }}>
                        {restaurant.type}
                    </Badge>
                )}

                {/* Posti disponibili */}
                <p className="mb-0 mt-2" style={{ fontSize: 12, color: "#6b7280" }}>
                    🪑 {restaurant.maxSeats} posti totali
                </p>
            </Card.Body>
        </Card>
    )
}

export default RestaurantCard