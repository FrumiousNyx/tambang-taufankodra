'use client';

import React from 'react';
import Layout from '@/components/layout/Layout';
import HeroSection from '@/components/home/HeroSection';
import ProductsSection from '@/components/home/ProductsSection';
import ProjectsSection from '@/components/home/ProjectsSection';
import CTASection from '@/components/home/CTASection';
import SEO from '@/components/SEO';
import { useLanguage } from '@/contexts/LanguageContext';

const Index: React.FC = () => {
  const { t, language } = useLanguage();
  return (
    <Layout>
      <SEO title={t('navigation.home')} description={t('hero.subtitle')} lang={language as any} />
      <HeroSection />
      <ProductsSection />
      <ProjectsSection />
      <CTASection />
    </Layout>
  );
};

export default Index;
