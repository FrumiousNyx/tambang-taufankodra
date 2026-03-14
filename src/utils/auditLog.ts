// Audit log helper - track admin actions in Supabase
export async function logAdminAction(
  userId: string,
  action: string,
  resource: string,
  details?: Record<string, any>
) {
  try {
    const { supabase } = await import('@/lib/supabase');
    await supabase.from('admin_audit_log').insert([{
      user_id: userId,
      action,
      resource,
      details: JSON.stringify(details),
      timestamp: new Date().toISOString(),
      ip_address: (typeof window !== 'undefined') ? undefined : 'server'
    }]);
  } catch (e) {
    console.error('Failed to log admin action', e);
  }
}
