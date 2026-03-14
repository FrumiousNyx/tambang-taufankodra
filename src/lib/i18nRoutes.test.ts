import { describe, it, expect } from 'vitest';
import { withLang, isSupportedLanguage, DEFAULT_LANGUAGE } from './i18nRoutes';

describe('i18nRoutes', () => {
  it('detects supported languages', () => {
    expect(isSupportedLanguage('id')).toBe(true);
    expect(isSupportedLanguage('en')).toBe(true);
    expect(isSupportedLanguage('zh')).toBe(true);
    expect(isSupportedLanguage('en-US')).toBe(false);
    expect(isSupportedLanguage(undefined)).toBe(false);
  });

  it('prefixes paths with default language when missing', () => {
    expect(withLang('/', undefined)).toBe(`/${DEFAULT_LANGUAGE}`);
    expect(withLang('/produk', undefined)).toBe(`/${DEFAULT_LANGUAGE}/produk`);
  });

  it('replaces existing language prefix', () => {
    expect(withLang('/en/produk', 'id')).toBe('/id/produk');
    expect(withLang('/zh/keberlanjutan', 'en')).toBe('/en/keberlanjutan');
  });

  it('normalizes relative paths', () => {
    expect(withLang('produk', 'id')).toBe('/id/produk');
  });
});

