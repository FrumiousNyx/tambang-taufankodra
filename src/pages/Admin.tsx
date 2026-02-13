import React, { useEffect, useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { getAdminAuthHeader } from '@/utils/authClient';

type Submission = Record<string, any>;

const Admin: React.FC = () => {
  const { user, loading: authLoading, isAdmin } = useAuth();
  const [items, setItems] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(false);
  const [limit, setLimit] = useState(100);

  const fetchList = async () => {
    setLoading(true);
    try {
      const authHeader = await getAdminAuthHeader();
      if (!authHeader) {
        alert('Not authenticated');
        setLoading(false);
        return;
      }

      const res = await fetch(`/api/admin/submissions?limit=${limit}`, {
        headers: { Authorization: authHeader }
      });
      if (!res.ok) throw new Error('Failed to fetch');
      const body = await res.json();
      setItems(body.data || []);
    } catch (e: any) {
      alert(e.message || 'Failed');
    } finally {
      setLoading(false);
    }
  };

  const exportCsv = async () => {
    try {
      const authHeader = await getAdminAuthHeader();
      if (!authHeader) {
        alert('Not authenticated');
        return;
      }

      const url = `/api/admin/submissions?limit=${limit}&export=1`;
      const res = await fetch(url, { headers: { Authorization: authHeader } });
      if (!res.ok) throw new Error('Export failed');
      
      const blob = await res.blob();
      const href = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = href;
      a.download = 'submissions.csv';
      a.click();
      URL.revokeObjectURL(href);
    } catch (e: any) {
      alert(e.message || 'Export failed');
    }
  };

  useEffect(() => {
    if (isAdmin && !authLoading) {
      fetchList();
    }
     
  }, [isAdmin, authLoading]);

  if (!authLoading && (!user || !isAdmin)) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <Layout>
      <div className="pt-24 pb-12 container mx-auto px-4">
        <div className="bg-white rounded-lg p-6 shadow">
          <h1 className="text-xl font-semibold mb-4">Admin - Submissions</h1>

          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <Button onClick={fetchList} disabled={loading || !isAdmin}>Refresh</Button>
            <Button onClick={exportCsv} variant="outline" disabled={!isAdmin || items.length===0 || loading}>Export CSV</Button>
            <Input type="number" value={limit} onChange={(e) => setLimit(Number(e.target.value))} className="w-24" />
          </div>

          {loading ? (
            <p>Loading...</p>
          ) : (
            <div className="overflow-auto">
              <table className="w-full text-sm table-auto">
                <thead>
                  <tr className="text-left">
                    {items[0] && Object.keys(items[0]).slice(0, 8).map((k) => <th key={k} className="p-2 font-medium">{k}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {items.map((row, i) => (
                    <tr key={i} className="border-t">
                      {Object.keys(row).slice(0, 8).map((k) => (
                        <td key={k} className="p-2 align-top break-words max-w-xs">{String(row[k] ?? '')}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Admin;
