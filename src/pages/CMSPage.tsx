'use client';

import React, { useEffect, useState } from 'react';
import Layout from '@/components/layout/Layout';
import SEO from '@/components/SEO';
import { cmsService } from '@/lib/cms';
import { useLanguage } from '@/contexts/LanguageContext';
import { MarkdownContent } from '@/components/ui/markdown';

const CMSPage: React.FC<{ slug?: string }> = ({ slug }) => {
  const { language } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState<any>(null);

  useEffect(() => {
    const load = async () => {
      if (!slug) return;
      try {
        setLoading(true);
        const data = await cmsService.getPageBySlug(slug, language);
        setPage(data);
      } catch (e) {
        setPage(null);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [slug, language]);

  if (loading) {
    return (
      <Layout>
        <div className="container-enterprise py-24">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-center text-sm text-muted-foreground">Loading...</p>
        </div>
      </Layout>
    );
  }

  if (!page) {
    return (
      <Layout>
        <div className="container-enterprise py-24 text-center">
          <h1 className="text-3xl font-bold">404</h1>
          <p className="text-sm text-muted-foreground mt-2">Page not found</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <SEO
        title={page.seoTitle || page.title}
        description={page.seoDescription || page.description}
        lang={language as any}
      />
      <div className="container-enterprise py-24">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">{page.title}</h1>
        {page.description && (
          <p className="text-muted-foreground max-w-3xl mb-10">{page.description}</p>
        )}
        <MarkdownContent text={String(page.content || '')} />
      </div>
    </Layout>
  );
};

export default CMSPage;
