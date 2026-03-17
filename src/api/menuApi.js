// l'indirizzo del backend. Lo salvo in una variabile così se dovesse cambiare basterebbe modificare solo il valore di questa variabile.
const BASE_URL = "http://localhost:8080/api"

// Chiamata per ottenere tutti i menu di un ristorante
export const getMenusByRestaurantApi = async (restaurantId, token) => {
  const response = await fetch(`${BASE_URL}/restaurants/${restaurantId}/menus`, {
    headers: { Authorization: `Bearer ${token}` }
  })

  // Gestisco eventuali errori
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message)
  }

  return response.json()
}

// Chiamata per creare un menu per un ristorante
export const createMenuApi = async (restaurantId, body, token) => {
  const response = await fetch(`${BASE_URL}/restaurants/${restaurantId}/menus`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  })

  // Gestisco eventuali errori
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message)
  }

  return response.json()
}

// Chiamata per eliminare un menu
export const deleteMenuApi = async (menuId, token) => {
  const response = await fetch(`${BASE_URL}/menus/${menuId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` }
  })

  // Gestisco eventuali errori
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message)
  }
}