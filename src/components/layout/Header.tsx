import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Globe, ChevronDown } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const location = useLocation();

  const navLinks = [
    { href: '/', label: t('navigation.home') },
    { href: '/produk', label: t('navigation.products') },
    { href: '/proyek', label: t('navigation.projects') },
    { href: '/keberlanjutan', label: t('navigation.sustainability') },
    { href: '/investor', label: t('navigation.investor') },
    { href: '/download', label: t('navigation.download') },
    { href: '/tentang', label: t('navigation.about') },
    { href: '/dashboard', label: t('navigation.dashboard') },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-b border-slate-200">
      <div className="container-enterprise">
        <div className="flex items-center justify-between h-20 md:h-24">
          {/* Logo Section - Fixed for Mobile */}
          <Link to="/" className="flex items-center gap-2 md:gap-4 group shrink-0">
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
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
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
                  onClick={() => setLanguage('id')}
                  className={cn(language === 'id' && "bg-accent/10 text-accent")}
                >
                  🇮🇩 Bahasa Indonesia
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setLanguage('en')}
                  className={cn(language === 'en' && "bg-accent/10 text-accent")}
                >
                  🇺🇸 English
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setLanguage('zh')}
                  className={cn(language === 'zh' && "bg-accent/10 text-accent")}
                >
                  🇨🇳 中文
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Contact CTA */}
            <Link to="/kontak" className="hidden sm:block">
              <Button className="btn-accent text-sm px-5 py-2">
                {t('navigation.contact')}
              </Button>
            </Link>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden py-4 border-t border-border animate-fade-in bg-white">
            <nav className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setIsOpen(false)}
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
                to="/kontak"
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