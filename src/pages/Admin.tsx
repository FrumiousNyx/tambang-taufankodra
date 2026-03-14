'use client';

import React, { useEffect, useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { submissionService, Submission } from '@/services/submissionService';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { withLang } from '@/lib/i18nRoutes';

const Admin: React.FC = () => {
  const { user, loading: authLoading, isAdmin } = useAuth();
  const { language } = useLanguage();
  const router = useRouter();
  const [items, setItems] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(false);
  const [limit, setLimit] = useState(100);

  const fetchList = async () => {
    setLoading(true);
    try {
      const data = await submissionService.getSubmissions(limit);
      setItems(data);
    } catch (e: any) {
      toast.error(e.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchList().then(() => toast.success('Data refreshed'));
  };

  const exportCsv = async () => {
    try {
      await submissionService.exportSubmissions(limit);
      toast.success('Export started');
    } catch (e: any) {
      toast.error(e.message || 'Export failed');
    }
  };

  useEffect(() => {
    if (isAdmin && !authLoading) {
      fetchList();
    }
  }, [isAdmin, authLoading]);

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      router.replace(withLang('/auth', language));
    }
  }, [authLoading, user, isAdmin, router, language]);

  if (!authLoading && (!user || !isAdmin)) return null;

  return (
    <Layout>
      <div className="pt-24 pb-12 container mx-auto px-4">
        <div className="bg-white rounded-lg p-6 shadow">
          <h1 className="text-xl font-semibold mb-4">Admin - Submissions</h1>

          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <Button onClick={handleRefresh} disabled={loading || !isAdmin}>Refresh</Button>
            <Button onClick={exportCsv} variant="outline" disabled={!isAdmin || items.length === 0 || loading}>Export CSV</Button>
            <Input type="number" value={limit} onChange={(e) => setLimit(Number(e.target.value))} className="w-24" />
          </div>

          {loading && items.length === 0 ? (
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          ) : (
            <div className="overflow-auto rounded-md border">
              <table className="w-full text-sm table-auto">
                <thead className="bg-slate-50">
                  <tr className="text-left">
                    {(() => {
                      const first = items[0];
                      if (!first) return null;
                      return Object.keys(first).slice(0, 8).map((k) => (
                        <th key={k} className="p-3 font-medium text-slate-500 border-b">{k}</th>
                      ));
                    })()}
                  </tr>
                </thead>
                <tbody>
                  {items.map((row, i) => (
                    <tr key={i} className="border-b hover:bg-slate-50/50 transition-colors">
                      {Object.keys(row).slice(0, 8).map((k) => (
                        <td key={k} className="p-3 align-top break-words max-w-xs">{String(row[k] ?? '')}</td>
                      ))}
                    </tr>
                  ))}
                  {items.length === 0 && !loading && (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-muted-foreground">
                        No submissions found.
                      </td>
                    </tr>
                  )}
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
