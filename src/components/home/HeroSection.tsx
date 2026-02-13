import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Award, Building2, Factory, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import heroImage from '@/assets/hero-cement-factory.jpg';

const HeroSection: React.FC = () => {
  const { t } = useLanguage();

  const stats = [
    { 
      icon: Factory, 
      value: '5M+', 
      label: t('stats.production'), 
      suffix: t('stats.unit') // Diperbarui untuk multi-bahasa
    },
    { icon: Building2, value: '500+', label: t('stats.projects'), suffix: '' },
    { icon: Award, value: '38+', label: t('stats.experience'), suffix: '' },
    { icon: Users, value: '200+', label: t('stats.clients'), suffix: '' },
  ];

  return (
    <section className="relative min-h-[95vh] flex items-center overflow-hidden bg-[#0f0f0f]">
      {/* Background Image with Parallax-like effect */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-60"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      
      {/* Premium Gradient Overlay */}
      <div className="absolute inset-0 z-0 bg-gradient-to-t from-[#0f0f0f] via-primary/60 to-transparent" />
      <div className="absolute inset-0 z-0 bg-gradient-to-r from-[#0f0f0f] via-transparent to-transparent" />

      <div className="container-enterprise relative z-10 pt-20">
        <div className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-600/10 border border-orange-600/20 text-orange-500 text-xs md:text-sm font-bold tracking-widest uppercase mb-8">
              <span className="w-2 h-2 rounded-full bg-orange-600 animate-pulse" />
              Trusted by BUMN & Government
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-[0.9] tracking-tighter mb-8"
          >
            {t('hero.title').split(' ').map((word, i) => (
              <span key={i} className={i === 2 ? "text-orange-600" : ""}> {word} </span>
            ))}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-base md:text-lg text-gray-400 leading-relaxed mb-10 max-w-2xl font-medium"
          >
            {t('hero.subtitle')}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-wrap gap-4 mb-20"
          >
            <Link to="/kontak">
              <Button className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-6 rounded-none font-bold uppercase tracking-wider transition-all transform hover:scale-105">
                {t('hero.ctaPrimary')}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link to="/produk">
              <Button className="bg-white/5 hover:bg-white/10 text-white border border-white/20 px-8 py-6 rounded-none font-bold uppercase tracking-wider backdrop-blur-md">
                {t('hero.ctaSecondary')}
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Stats Grid - Fixed for Mobile Wrap */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-0 divide-x-0 lg:divide-x divide-white/10"
        >
          {stats.map((stat, index) => (
            <div
              key={index}
              className="p-4 md:p-8 group hover:bg-white/[0.02] transition-all"
            >
              <stat.icon className="w-6 h-6 text-orange-600 mb-4 group-hover:scale-110 transition-transform" />
              <div className="flex flex-col">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl md:text-5xl font-black text-white tracking-tighter">
                    {stat.value}
                  </span>
                  {stat.suffix && (
                    <span className="text-[10px] md:text-xs font-bold text-orange-600 uppercase tracking-tighter leading-none max-w-[50px]">
                      {stat.suffix.split('/').join(' / ')}
                    </span>
                  )}
                </div>
                <p className="text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-[0.2em] mt-2">
                  {stat.label}
                </p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;