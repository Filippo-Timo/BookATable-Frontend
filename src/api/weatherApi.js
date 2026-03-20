// l'indirizzo del backend. Lo salvo in una variabile così se dovesse cambiare basterebbe modificare solo il valore di questa variabile.
const BASE_URL = "http://localhost:8080/api"

// Chiamata per ottenere il suggerimento meteo per una città, data e orario
export const getWeatherSuggestionApi = async (city, date, time, token) => {
  const response = await fetch(`${BASE_URL}/weather/suggestion?city=${encodeURIComponent(city)}&date=${date}&time=${time}`, {
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