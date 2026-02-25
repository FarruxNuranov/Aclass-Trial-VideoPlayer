const getToken = () => {
  try {
    const raw = localStorage.getItem('vp_user')
    if (!raw) return null
    const user = JSON.parse(raw)
    return user?.token ?? null
  } catch {
    return null
  }
}

async function request(url, options = {}) {
  const token = getToken()

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  }

  const response = await fetch(url, {
    ...options,
    headers,
  })

  if (!response.ok) {
    let errorMessage = `HTTP error: ${response.status}`
    try {
      const data = await response.json()
      errorMessage = data?.message || data?.error || errorMessage
    } catch {
      // ignore parse error
    }
    throw new Error(errorMessage)
  }

  return response.json()
}

export const httpClient = {
  get: (url, options) => request(url, { ...options, method: 'GET' }),
  post: (url, body, options) =>
    request(url, { ...options, method: 'POST', body: JSON.stringify(body) }),
  put: (url, body, options) =>
    request(url, { ...options, method: 'PUT', body: JSON.stringify(body) }),
  patch: (url, body, options) =>
    request(url, { ...options, method: 'PATCH', body: JSON.stringify(body) }),
  delete: (url, options) => request(url, { ...options, method: 'DELETE' }),
}
