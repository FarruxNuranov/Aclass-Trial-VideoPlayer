import { httpClient } from '../../client/httpClient'
import { ENDPOINTS } from '../../constants/endpoints'

function getDeviceType() {
  const ua = navigator.userAgent
  if (/iPhone/i.test(ua)) return 'iPhone'
  if (/iPad/i.test(ua)) return 'iPad'
  if (/Android/i.test(ua)) return 'Android'
  if (/Macintosh|Mac OS X/i.test(ua)) return 'Mac'
  if (/Windows/i.test(ua)) return 'Windows'
  if (/Linux/i.test(ua)) return 'Linux'
  return 'Unknown'
}

export const authService = {
  async login(phone_number, password) {
    const body = {
      phone_number,
      password,
      ip_address: '',
      geolocation: '',
      type_device: getDeviceType(),
      device_info: navigator.userAgent,
    }
    const data = await httpClient.post(ENDPOINTS.AUTH.LOGIN, body)
    return data
  },

  async logout() {
    try {
      await httpClient.post(ENDPOINTS.AUTH.LOGOUT, {})
    } catch {
      // ignore — clear local state regardless
    }
  },

  async getMe() {
    return httpClient.get(ENDPOINTS.AUTH.ME)
  },
}
