// Supabase shim: lightweight placeholders so existing imports don't break.
// These stubs intentionally return `{ data: null, error: null }` results
// and should be replaced with real calls to your Laravel API endpoints.

export const supabase: any = {
  auth: {
    getUser: async () => ({ data: null, error: null }),
    signUp: async (_: any) => ({ data: null, error: null }),
    verifyOtp: async (_: any) => ({ data: null, error: null }),
    resend: async (_: any) => ({ data: null, error: null }),
  },
  from: (_table: string) => ({
    select: () => ({
      eq: () => ({ single: async () => ({ data: null, error: null }) }),
    }),
    insert: async () => ({ data: null, error: null }),
    update: async () => ({ data: null, error: null }),
    delete: async () => ({ data: null, error: null }),
  }),
}
