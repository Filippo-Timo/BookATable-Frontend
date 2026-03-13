// l'indirizzo del backend. Lo salvo in una variabile così se dovesse cambiare basterebbe modificare solo il valore di questa variabile.
const BASE_URL = "http://localhost:8080/api"

// Fetch per chiamare la POST di login
export const loginApi = async (credentials) => {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials)
  })

//   Gestisco eventuali errori
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message)
  }

  return response.json()
}

// Fetch per chiamare la POST di register dell'utente
export const registerUserApi = async (userData) => {
  const response = await fetch(`${BASE_URL}/auth/register/user`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData)
  })

  //   Gestisco eventuali errori
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message)
  }

  return response.json()
}

// Fetch per chiamare la POST di register del ristoratore
export const registerRestaurantOwnerApi = async (userData) => {
  const response = await fetch(`${BASE_URL}/auth/register/restaurant-owner`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData)
  })

  //   Gestisco eventuali errori
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message)
  }

  return response.json()
}