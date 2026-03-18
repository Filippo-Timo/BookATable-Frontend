// l'indirizzo del backend. Lo salvo in una variabile così se dovesse cambiare basterebbe modificare solo il valore di questa variabile.
const BASE_URL = "http://localhost:8080/api"

// Chiamata per ottenere tutte le recensioni di un ristorante
export const getReviewsByRestaurantApi = async (restaurantId, token) => {
  const response = await fetch(`${BASE_URL}/restaurants/${restaurantId}/reviews`, {
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

// Chiamata per creare una recensione per un ristorante
export const createReviewApi = async (restaurantId, body, token) => {
  const response = await fetch(`${BASE_URL}/restaurants/${restaurantId}/reviews`, {
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

// Chiamata per modificare una recensione
export const updateReviewApi = async (restaurantId, reviewId, body, token) => {
  const response = await fetch(`${BASE_URL}/restaurants/${restaurantId}/reviews/${reviewId}`, {
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

// Chiamata per eliminare una recensione
export const deleteReviewApi = async (restaurantId, reviewId, token) => {
  const response = await fetch(`${BASE_URL}/restaurants/${restaurantId}/reviews/${reviewId}`, {
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