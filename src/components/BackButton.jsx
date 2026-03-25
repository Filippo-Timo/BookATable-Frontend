import { useState } from "react"
import { Button } from "react-bootstrap"
import { useNavigate } from "react-router-dom"

function BackButton() {
    const navigate = useNavigate()
    const [hovered, setHovered] = useState(false)

    return (
        <Button
            size="sm"
            className="mb-3 fw-semibold"
            style={{
                background: hovered ? "#c8102e" : "transparent",
                border: "1px solid #c8102e",
                color: hovered ? "#fff" : "#c8102e",
                transition: "all 0.2s"
            }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onClick={() => navigate(-1)}
        >
            ← Indietro
        </Button>
    )
}

export default BackButton