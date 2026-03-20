// l'indirizzo del backend. Lo salvo in una variabile così se dovesse cambiare basterebbe modificare solo il valore di questa variabile.
const BASE_URL = "http://localhost:8080/api"

// Chiamata per aggiornare i dati dell'utente loggato
export const updateUserApi = async (body, token) => {
  const response = await fetch(`${BASE_URL}/users/me`, {
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

// Chiamata per fare l'upload dell'avatar dell'utente loggato
export const uploadAvatarApi = async (imageFile, token) => {
  const formData = new FormData()
  formData.append("avatar", imageFile)

  const response = await fetch(`${BASE_URL}/users/me/avatar`, {
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

// Chiamata per eliminare l'account dell'utente loggato
export const deleteUserApi = async (token) => {
  const response = await fetch(`${BASE_URL}/users/me`, {
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