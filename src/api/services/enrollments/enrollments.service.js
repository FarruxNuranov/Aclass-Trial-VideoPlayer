import { httpClient } from '../../client/httpClient'
import { ENDPOINTS } from '../../constants/endpoints'

export const enrollmentsService = {
  async getMyCourses() {
    return httpClient.get(ENDPOINTS.ENROLLMENTS.MY_COURSES)
  },

  async getEnrollmentById(id) {
    return httpClient.get(ENDPOINTS.ENROLLMENTS.BY_ID(id))
  },
}
