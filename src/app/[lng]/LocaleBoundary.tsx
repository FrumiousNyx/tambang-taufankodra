'use client';

import { useEffect, type ReactNode } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { DEFAULT_LANGUAGE, isSupportedLanguage } from '@/lib/i18nRoutes';

export function LocaleBoundary({ lng, children }: { lng: string; children: ReactNode }) {
  const { setLanguage } = useLanguage();

  useEffect(() => {
    const safe = isSupportedLanguage(lng) ? lng : DEFAULT_LANGUAGE;
    setLanguage(safe);
    document.documentElement.lang = safe;
  }, [lng, setLanguage]);

  return <>{children}</>;
}
