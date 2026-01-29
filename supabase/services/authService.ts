import { signup, verifyOtp, resendOtp } from '../../api/authService';

export async function signUpWorker(email: string, password: string, extra: any) {
  return signup({ email, password, extra });
}

// verify OTP for signup
export async function verifyEmailOtp(email: string, token: string) {
  return verifyOtp({ email, token, type: 'signup' });
}

// resend signup OTP
export async function resendSignupOtp(email: string) {
  return resendOtp({ email, type: 'signup' });
}
