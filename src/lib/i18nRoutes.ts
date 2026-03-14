export const SUPPORTED_LANGUAGES = ['id', 'en', 'zh'] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];
export const DEFAULT_LANGUAGE: SupportedLanguage = 'id';

export function isSupportedLanguage(value: string | undefined): value is SupportedLanguage {
  return value === 'id' || value === 'en' || value === 'zh';
}

export function withLang(path: string, lang: string | undefined) {
  const safeLang = isSupportedLanguage(lang || '') ? (lang as SupportedLanguage) : DEFAULT_LANGUAGE;
  const normalized = path.startsWith('/') ? path : `/${path}`;
  const parts = normalized.split('/').filter(Boolean);
  if (parts.length > 0 && isSupportedLanguage(parts[0])) {
    parts[0] = safeLang;
    return `/${parts.join('/')}`;
  }
  return `/${safeLang}${normalized === '/' ? '' : normalized}`;
}
