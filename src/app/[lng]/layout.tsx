import type { ReactNode } from 'react';
import { LocaleBoundary } from './LocaleBoundary';
import { DEFAULT_LANGUAGE, isSupportedLanguage } from '@/lib/i18nRoutes';
import { redirect } from 'next/navigation';

export default function LanguageLayout({
  children,
  params
}: {
  children: ReactNode;
  params: { lng: string };
}) {
  if (!isSupportedLanguage(params.lng)) {
    redirect(`/${DEFAULT_LANGUAGE}`);
  }

  return <LocaleBoundary lng={params.lng}>{children}</LocaleBoundary>;
}
