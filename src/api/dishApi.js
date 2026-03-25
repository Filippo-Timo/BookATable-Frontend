// l'indirizzo del backend. Lo salvo in una variabile così se dovesse cambiare basterebbe modificare solo il valore di questa variabile.
const BASE_URL = "http://localhost:8080/api"

// Chiamata per ottenere tutti i piatti di un menu
export const getDishesByMenuApi = async (menuId, token) => {
  const response = await fetch(`${BASE_URL}/menus/${menuId}/dishes`, {
    headers: { Authorization: `Bearer ${token}` }
  })

  // Gestisco eventuali errori
  if (!response.ok) {
    const error = await response.json()
    if (error.errors && error.errors.length > 0) {
      throw new Error(error.errors.join(", "))
    }
    throw new Error(error.message)
  }

  return response.json()
}

// Chiamata per creare un piatto
export const createDishApi = async (body, token) => {
  const response = await fetch(`${BASE_URL}/dishes`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  })

  // Gestisco eventuali errori — se ci sono errori di validazione li mostro come lista
  if (!response.ok) {
    const error = await response.json()
    if (error.errors && error.errors.length > 0) {
      throw new Error(error.errors.join(", "))
    }
    throw new Error(error.message)
  }

  return response.json()
}

// Chiamata per modificare un piatto
export const updateDishApi = async (id, body, token) => {
  const response = await fetch(`${BASE_URL}/dishes/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  })

  // Gestisco eventuali errori — se ci sono errori di validazione li mostro come lista
  if (!response.ok) {
    const error = await response.json()
    if (error.errors && error.errors.length > 0) {
      throw new Error(error.errors.join(", "))
    }
    throw new Error(error.message)
  }

  return response.json()
}

// Chiamata per eliminare un piatto
export const deleteDishApi = async (id, token) => {
  const response = await fetch(`${BASE_URL}/dishes/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` }
  })

  // Gestisco eventuali errori
  if (!response.ok) {
    const error = await response.json()
    if (error.errors && error.errors.length > 0) {
      throw new Error(error.errors.join(", "))
    }
    throw new Error(error.message)
  }
}