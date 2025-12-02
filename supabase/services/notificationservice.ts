import { supabase } from '../db'

export async function getNotificationsForCurrentUser() {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) throw new Error('User not authenticated')

  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) throw new Error('Failed to fetch user notifications')
  return data
}
