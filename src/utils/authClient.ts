// Client-side auth helper - get admin token for API calls
export async function getAdminAuthHeader() {
  const { supabase } = await import('@/lib/supabase');
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.access_token) return null;
  return `Bearer ${session.access_token}`;
}
