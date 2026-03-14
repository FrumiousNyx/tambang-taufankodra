'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Menu, X, Globe, ChevronDown, Sun, Moon } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { cmsService } from '@/lib/cms';
import { withLang } from '@/lib/i18nRoutes';

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const { setTheme } = useTheme();
  const [cmsPages, setCmsPages] = useState<{ href: string; label: string }[]>([]);

  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const pages = await cmsService.getPages(language);
        if (!mounted) return;
        const links = (pages || []).map((p: any) => ({
          href: withLang(`/p/${p.slug}`, language),
          label: p.title || p.slug
        }));
        setCmsPages(links);
      } catch {
        if (mounted) setCmsPages([]);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, [language]);

  const switchLanguage = (nextLanguage: 'id' | 'en' | 'zh') => {
    setLanguage(nextLanguage);
    const search = searchParams?.toString();
    const hash = typeof window !== 'undefined' ? window.location.hash : '';
    const nextPath = `${withLang(pathname || '/', nextLanguage)}${search ? `?${search}` : ''}${hash}`;
    router.push(nextPath);
  };

  const navLinks = [
    { href: withLang('/', language), label: t('navigation.home') },
    { href: withLang('/produk', language), label: t('navigation.products') },
    { href: withLang('/proyek', language), label: t('navigation.projects') },
    { href: withLang('/keberlanjutan', language), label: t('navigation.sustainability') },
    { href: withLang('/investor', language), label: t('navigation.investor') },
    { href: withLang('/download', language), label: t('navigation.download') },
    { href: withLang('/tentang', language), label: t('navigation.about') },
    ...cmsPages,
    { href: withLang('/dashboard', language), label: t('navigation.dashboard') },
  ];

  const isActive = (path: string) => (pathname || '') === path;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-xl border-b border-border">
      <div className="container-enterprise">
        <div className="flex items-center justify-between h-20 md:h-24">
          {/* Logo Section - Fixed for Mobile */}
          <Link href={withLang('/', language)} className="flex items-center gap-2 md:gap-4 group shrink-0">
            <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-[#1e293b] flex items-center justify-center shadow-md">
              <span className="text-white font-bold font-bold text-lg md:text-2xl tracking-tighter">SN</span>
            </div>
            <div className="block"> {/* Menghilangkan hidden agar teks muncul di mobile */}
              <h1 className="font-bold font-bold text-foreground text-sm md:text-xl tracking-tight leading-none">
                PT Semen <br className="xs:hidden" /> Nusantara
              </h1>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                prefetch={!link.href.includes('/investor')}
                className={cn(
                  "px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200",
                  isActive(link.href)
                    ? "text-accent bg-accent/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-1 md:gap-3">
            {/* Theme Toggle */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="w-9 h-9 px-0">
                  <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                  <span className="sr-only">Toggle theme</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-popover border border-border z-50">
                <DropdownMenuItem onClick={() => setTheme("light")}>
                  Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                  Dark
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>
                  System
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Language Switcher */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-1 md:gap-2 px-2">
                  <Globe className="w-4 h-4" />
                  <span className="hidden xs:inline uppercase text-xs md:text-sm">{language}</span>
                  <ChevronDown className="w-3 h-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-popover border border-border z-50">
                <DropdownMenuItem 
                  onClick={() => switchLanguage('id')}
                  className={cn(language === 'id' && "bg-accent/10 text-accent")}
                >
                  🇮🇩 Bahasa Indonesia
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => switchLanguage('en')}
                  className={cn(language === 'en' && "bg-accent/10 text-accent")}
                >
                  🇺🇸 English
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => switchLanguage('zh')}
                  className={cn(language === 'zh' && "bg-accent/10 text-accent")}
                >
                  🇨🇳 中文
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Contact CTA */}
            <Link href={withLang('/kontak', language)} className="hidden sm:block">
              <Button className="btn-accent text-sm px-5 py-2">
                {t('navigation.contact')}
              </Button>
            </Link>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="py-4 border-t border-border animate-fade-in bg-background">
            <nav className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  prefetch={!link.href.includes('/investor')}
                  className={cn(
                    "px-4 py-3 text-sm font-medium rounded-md transition-colors duration-200",
                    isActive(link.href)
                      ? "text-accent bg-accent/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href={withLang('/kontak', language)}
                onClick={() => setIsOpen(false)}
                className="mt-2 px-4"
              >
                <Button className="btn-accent w-full">
                  {t('navigation.contact')}
                </Button>
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
