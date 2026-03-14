'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES, withLang } from '@/lib/i18nRoutes';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  ogUrl?: string;
  noIndex?: boolean;
  lang?: 'id' | 'en' | 'zh';
}

const SEO: React.FC<SEOProps> = ({
  title,
  description,
  keywords,
  ogImage = '/og-image.jpg',
  ogUrl = (process.env.NEXT_PUBLIC_SITE_URL as string) || 'https://semen-nusantara.com',
  noIndex = false,
  lang = 'id'
}) => {
  const pathname = usePathname() || '/';
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

  const canonicalPath = pathname || '/';
  const canonicalUrl = `${ogUrl.replace(/\/$/, '')}${canonicalPath}`;
  const ogLocale = lang === 'id' ? 'id_ID' : lang === 'zh' ? 'zh_CN' : 'en_US';

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

  React.useEffect(() => {
    if (typeof document === 'undefined') return;

    const upsertMeta = (selector: string, attrs: Record<string, string>) => {
      let el = document.head.querySelector(selector) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement('meta');
        Object.entries(attrs).forEach(([k, v]) => el!.setAttribute(k, v));
        document.head.appendChild(el);
        return;
      }
      Object.entries(attrs).forEach(([k, v]) => el!.setAttribute(k, v));
    };

    const upsertLink = (selector: string, attrs: Record<string, string>) => {
      let el = document.head.querySelector(selector) as HTMLLinkElement | null;
      if (!el) {
        el = document.createElement('link');
        Object.entries(attrs).forEach(([k, v]) => el!.setAttribute(k, v));
        document.head.appendChild(el);
        return;
      }
      Object.entries(attrs).forEach(([k, v]) => el!.setAttribute(k, v));
    };

    const upsertScript = (id: string, type: string, text: string) => {
      let el = document.getElementById(id) as HTMLScriptElement | null;
      if (!el) {
        el = document.createElement('script');
        el.id = id;
        el.type = type;
        document.head.appendChild(el);
      }
      el.text = text;
    };

    document.title = finalTitle;
    document.documentElement.lang = lang;

    upsertMeta('meta[name="description"]', { name: 'description', content: finalDescription });
    upsertMeta('meta[name="keywords"]', { name: 'keywords', content: finalKeywords });
    upsertMeta('meta[name="author"]', { name: 'author', content: 'PT Semen Nusantara' });
    upsertMeta('meta[name="viewport"]', { name: 'viewport', content: 'width=device-width, initial-scale=1.0' });
    upsertMeta('meta[name="robots"]', {
      name: 'robots',
      content: noIndex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
    });

    upsertMeta('meta[property="og:type"]', { property: 'og:type', content: 'website' });
    upsertMeta('meta[property="og:title"]', { property: 'og:title', content: finalTitle });
    upsertMeta('meta[property="og:description"]', { property: 'og:description', content: finalDescription });
    upsertMeta('meta[property="og:image"]', { property: 'og:image', content: ogImage });
    upsertMeta('meta[property="og:image:width"]', { property: 'og:image:width', content: '1200' });
    upsertMeta('meta[property="og:image:height"]', { property: 'og:image:height', content: '630' });
    upsertMeta('meta[property="og:url"]', { property: 'og:url', content: canonicalUrl });
    upsertMeta('meta[property="og:site_name"]', { property: 'og:site_name', content: 'PT Semen Nusantara' });
    upsertMeta('meta[property="og:locale"]', { property: 'og:locale', content: ogLocale });

    SUPPORTED_LANGUAGES.filter(l => l !== lang).forEach(l => {
      upsertMeta(`meta[property="og:locale:alternate"][content="${l === 'id' ? 'id_ID' : l === 'zh' ? 'zh_CN' : 'en_US'}"]`, {
        property: 'og:locale:alternate',
        content: l === 'id' ? 'id_ID' : l === 'zh' ? 'zh_CN' : 'en_US'
      });
    });

    upsertMeta('meta[name="twitter:card"]', { name: 'twitter:card', content: 'summary_large_image' });
    upsertMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: finalTitle });
    upsertMeta('meta[name="twitter:description"]', { name: 'twitter:description', content: finalDescription });
    upsertMeta('meta[name="twitter:image"]', { name: 'twitter:image', content: ogImage });

    upsertMeta('meta[name="theme-color"]', { name: 'theme-color', content: '#D97706' });
    upsertMeta('meta[name="msapplication-TileColor"]', { name: 'msapplication-TileColor', content: '#D97706' });

    upsertLink('link[rel="canonical"]', { rel: 'canonical', href: canonicalUrl });
    upsertLink('link[rel="manifest"]', { rel: 'manifest', href: '/manifest.json' });

    upsertLink('link[rel="alternate"][hrefLang="x-default"]', {
      rel: 'alternate',
      href: `${ogUrl.replace(/\/$/, '')}${withLang(canonicalPath, DEFAULT_LANGUAGE)}`,
      hrefLang: 'x-default'
    });
    SUPPORTED_LANGUAGES.forEach(l => {
      upsertLink(`link[rel="alternate"][hrefLang="${l}"]`, {
        rel: 'alternate',
        href: `${ogUrl.replace(/\/$/, '')}${withLang(canonicalPath, l)}`,
        hrefLang: l
      });
    });

    upsertScript('org-jsonld', 'application/ld+json', JSON.stringify(organizationSchema));
  }, [
    finalTitle,
    finalDescription,
    finalKeywords,
    ogImage,
    canonicalUrl,
    canonicalPath,
    ogLocale,
    noIndex,
    lang,
    ogUrl
  ]);

  return null;
};

export default SEO;
