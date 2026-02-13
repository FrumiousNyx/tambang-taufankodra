import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  ogUrl?: string;
  noIndex?: boolean;
  lang?: 'id' | 'en';
}

const SEO: React.FC<SEOProps> = ({
  title,
  description,
  keywords,
  ogImage = '/og-image.jpg',
  ogUrl = 'https://semen-nusantara.com',
  noIndex = false,
  lang = 'id'
}) => {
  const siteTitle = lang === 'id' 
    ? 'PT Semen Nusantara - Mitra Strategis Infrastruktur Nasional'
    : 'PT Semen Nusantara - Strategic National Infrastructure Partner';
  
  const siteDescription = lang === 'id'
    ? 'PT Semen Nusantara adalah mitra strategis infrastruktur nasional yang menyediakan produk semen berkualitas tinggi untuk proyek BUMN dan Kementerian Indonesia.'
    : 'PT Semen Nusantara is a strategic national infrastructure partner providing high-quality cement products for Indonesian state-owned enterprises and ministry projects.';

  const finalTitle = title ? `${title} | ${siteTitle}` : siteTitle;
  const finalDescription = description || siteDescription;
  const finalKeywords = keywords || (lang === 'id' 
    ? 'semen, semen nusantara, infrastruktur, konstruksi, BUMN, Kementerian, proyek nasional, semen berkualitas'
    : 'cement, semen nusantara, infrastructure, construction, state-owned enterprises, ministry, national projects, quality cement'
  );

  const GA_ID = (import.meta.env.VITE_GA_ID as string) || '';

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "PT Semen Nusantara",
    "url": ogUrl,
    "logo": `${ogUrl}/images/company/logo.png`,
    "contactPoint": [{
      "@type": "ContactPoint",
      "telephone": "+62 21 1234 5678",
      "contactType": "customer service",
      "areaServed": "ID",
      "availableLanguage": ["id","en","zh"]
    }]
  };

  return (
    <Helmet>
      {/* Google Site Verification */}
      <meta name="google-site-verification" content="Xm8xhQxzLzRppGEfZnxu-HErbfOAyLmfasLkqLGGtNE" />
      
      {/* Basic Meta Tags */}
      <title>{finalTitle}</title>
      <meta name="description" content={finalDescription} />
      <meta name="keywords" content={finalKeywords} />
      <meta name="author" content="PT Semen Nusantara" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta charSet="UTF-8" />
      
      {/* HTML Attributes */}
      <html lang={lang} />
      
      {/* Robots */}
      {noIndex && <meta name="robots" content="noindex, nofollow" />}
      {!noIndex && <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />}
      
      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:url" content={ogUrl} />
      <meta property="og:site_name" content="PT Semen Nusantara" />
      <meta property="og:locale" content={lang === 'id' ? 'id_ID' : 'en_US'} />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={finalTitle} />
      <meta name="twitter:description" content={finalDescription} />
      <meta name="twitter:image" content={ogImage} />
      
      {/* Additional Meta */}
      <meta name="theme-color" content="#D97706" />
      <meta name="msapplication-TileColor" content="#D97706" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={ogUrl} />
      
      {/* Favicon */}
      <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      
      {/* Apple Touch Icon */}
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      
      {/* Manifest */}
      <link rel="manifest" href="/site.webmanifest" />
      {/* hreflang for multi-language pages */}
      <link rel="alternate" href={ogUrl} hrefLang="x-default" />
      <link rel="alternate" href={`${ogUrl}/id`} hrefLang="id" />
      <link rel="alternate" href={`${ogUrl}/en`} hrefLang="en" />
      <link rel="alternate" href={`${ogUrl}/zh`} hrefLang="zh" />

      {/* Preconnect for analytics (if configured) */}
      {GA_ID && <link rel="preconnect" href="https://www.googletagmanager.com" />}

      {/* Structured data (Organization) */}
      <script type="application/ld+json">{JSON.stringify(organizationSchema)}</script>

      {/* Preload OG / LCP image to improve LCP */}
      {ogImage && <link rel="preload" as="image" href={ogImage} />}
    </Helmet>
  );
};

export default SEO;
