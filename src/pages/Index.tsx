import React from 'react';
import Layout from '@/components/layout/Layout';
import HeroSection from '@/components/home/HeroSection';
import ProductsSection from '@/components/home/ProductsSection';
import ProjectsSection from '@/components/home/ProjectsSection';
import CTASection from '@/components/home/CTASection';

const Index: React.FC = () => {
  return (
    <Layout>
      <HeroSection />
      <ProductsSection />
      <ProjectsSection />
      <CTASection />
    </Layout>
  );
};

export default Index;
