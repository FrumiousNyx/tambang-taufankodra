import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Phone } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import ScrollReveal from '@/components/ui/scroll-reveal';

const CTASection: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section className="section-padding relative overflow-hidden">
      {/* Background */}
      <div 
        className="absolute inset-0 z-0"
        style={{ background: 'var(--gradient-hero)' }}
      />
      
      {/* Decorative */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-accent/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />
      </div>

      <div className="container-enterprise relative z-10">
        <ScrollReveal>
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="heading-section text-primary-foreground mb-4">
              {t('cta.title')}
            </h2>
            <p className="text-lg text-primary-foreground/80 mb-8">
              {t('cta.subtitle')}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/kontak">
                <Button className="btn-accent group">
                  {t('cta.button')}
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <a href="tel:+622189001234">
                <Button className="btn-outline border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                  <Phone className="w-4 h-4 mr-2" />
                  +62 21 8900 1234
                </Button>
              </a>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default CTASection;
