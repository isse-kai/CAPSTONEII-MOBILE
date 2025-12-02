import * as loginService from '../services/loginservice'

export async function handleLogin(email: string, password: string) {
  return await loginService.loginUser(email, password)
}

export async function handleLogout() {
  return await loginService.logoutUser()
}

export async function handleGetCurrentUser() {
  return await loginService.getCurrentUser()
}