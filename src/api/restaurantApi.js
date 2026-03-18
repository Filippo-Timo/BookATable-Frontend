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