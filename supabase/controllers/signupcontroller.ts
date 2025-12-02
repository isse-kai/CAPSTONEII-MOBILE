import * as signupService from '../services/signupservice'

export async function handleSignupClient(payload: any) {
  return await signupService.signupClient(payload)
}

export async function handleSignupWorker(payload: any) {
  return await signupService.signupWorker(payload)
}

export async function handleVerifyOtp(email: string, otpCode: string) {
  return await signupService.verifyEmailOtp(email, otpCode)
}
