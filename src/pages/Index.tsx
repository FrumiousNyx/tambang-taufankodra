// @ts-nocheck
'use client';

import React from 'react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const Index: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    // Redirect ke bahasa Indonesia
    router.replace('/id');
  }, [router]);

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      fontSize: '18px',
      backgroundColor: '#f8fafc'
    }}>
      <div>
        <div>Loading...</div>
        <div style={{ fontSize: '14px', marginTop: '10px', color: '#64748b' }}>
          Redirecting to Indonesian version...
        </div>
      </div>
    </div>
  );
};

export default Index;
