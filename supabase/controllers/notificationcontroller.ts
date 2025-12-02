import * as notificationService from '../services/notificationservice'

export async function handleGetNotifications() {
  return await notificationService.getNotificationsForCurrentUser()
}
