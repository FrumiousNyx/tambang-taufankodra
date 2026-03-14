import { getAdminAuthHeader } from '@/utils/authClient';

export interface Submission {
  [key: string]: any;
}

export const submissionService = {
  async getSubmissions(limit: number = 100): Promise<Submission[]> {
    const authHeader = await getAdminAuthHeader();
    if (!authHeader) {
      throw new Error('Not authenticated');
    }

    const res = await fetch(`/api/admin/submissions?limit=${limit}`, {
      headers: { Authorization: authHeader }
    });
    if (!res.ok) throw new Error('Failed to fetch submissions');
    const body = await res.json();
    return body.data || [];
  },

  async exportSubmissions(limit: number = 100): Promise<void> {
    const authHeader = await getAdminAuthHeader();
    if (!authHeader) {
      throw new Error('Not authenticated');
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
  }
};
