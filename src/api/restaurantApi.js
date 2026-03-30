// l'indirizzo del backend. Lo salvo in una variabile così se dovesse cambiare basterebbe modificare solo il valore di questa variabile.
const BASE_URL = "http://localhost:8080/api"

// Chiamata per ottenere tutti i ristoranti
export const getAllRestaurantsApi = async (token) => {
  const response = await fetch(`${BASE_URL}/restaurants`, {
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

  const data = await response.json()
  return data.content
}

// Chiamata per ottenere i ristoranti filtrati per città
export const getRestaurantsByCityApi = async (city, token) => {
  const response = await fetch(`${BASE_URL}/restaurants/city/${encodeURIComponent(city)}`, {
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

// Chiamata per cercare un ristorante tramite ID
export const getRestaurantByIdApi = async (id, token) => {
  const response = await fetch(`${BASE_URL}/restaurants/${id}`, {
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

// Chiamata per ottenere i ristoranti dell'owner loggato
export const getMyRestaurantsApi = async (token) => {
  const response = await fetch(`${BASE_URL}/restaurants/my`, {
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

// Chiamata per creare un nuovo ristorante
export const createRestaurantApi = async (body, token) => {
  const response = await fetch(`${BASE_URL}/restaurants`, {
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

// Chiamata per aggiornare un ristorante
export const updateRestaurantApi = async (id, body, token) => {
  const response = await fetch(`${BASE_URL}/restaurants/${id}`, {
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

// Chiamata per eliminare un ristorante
export const deleteRestaurantApi = async (id, token) => {
  const response = await fetch(`${BASE_URL}/restaurants/${id}`, {
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

// Chiamata per fare l'upload dell'immagine del ristorante
export const uploadRestaurantImageApi = async (id, imageFile, token) => {
  const formData = new FormData()
  formData.append("image", imageFile)

  const response = await fetch(`${BASE_URL}/restaurants/${id}/image`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}` },
    body: formData
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