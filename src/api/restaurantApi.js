// l'indirizzo del backend. Lo salvo in una variabile così se dovesse cambiare basterebbe modificare solo il valore di questa variabile.
const BASE_URL = "http://localhost:8080/api"

// Chiamata per ottenere tutti i ristoranti 
export const getAllRestaurantsApi = async (token) => {
  const response = await fetch(`${BASE_URL}/restaurants`, {
    headers: { Authorization: `Bearer ${token}` }
  })

  if (!response.ok) {
    const error = await response.json()
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

  //   Gestisco eventuali errori
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message)
  }

  return response.json()
}