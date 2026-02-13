import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Phone, MapPin, Linkedin, Instagram } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';

const Footer: React.FC = () => {
  const { t, language } = useLanguage();
  const [creditText, setCreditText] = useState<string>('Created by Taufan Kodra 2026');

  useEffect(() => {
    const fetchCreditText = async () => {
      try {
        const { data } = await supabase
          .from('site_settings')
          .select('credit_text')
          .eq('id', 1)
          .single();
        if (data?.credit_text) setCreditText(data.credit_text);
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Error:', error);
        }
      }
    };
    fetchCreditText();
  }, []);

  // Fungsi pembantu untuk teks deskripsi
  const getDescription = () => {
    return t('footer.description');
  };

  return (
    <footer className="bg-[#0f172a] text-white border-t border-white/5">
      <div className="container-enterprise py-24">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-accent flex items-center justify-center font-black text-black text-xl italic">SN</div>
              <span className="font-black tracking-tighter text-xl uppercase italic">Semen Nusantara</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-8">
              {getDescription()}
            </p>
            <div className="flex gap-4">
              <Linkedin className="w-5 h-5 text-slate-500 hover:text-accent cursor-pointer transition-colors" />
              <Instagram className="w-5 h-5 text-slate-500 hover:text-accent cursor-pointer transition-colors" />
            </div>
          </div>
          
          <div>
             <h4 className="font-bold text-xs uppercase tracking-[0.2em] mb-8 text-slate-500">
               {t('footer.quickLinks')}
             </h4>
             <ul className="space-y-4 text-sm font-medium text-slate-300">
               <li>
                 <Link to="/produk" className="hover:text-accent">
                   {t('navigation.products')}
                 </Link>
               </li>
               <li>
                 <Link to="/proyek" className="hover:text-accent">
                   {t('navigation.projects')}
                 </Link>
               </li>
               <li>
                 <Link to="/kontak" className="hover:text-accent">
                   {t('navigation.contact')}
                 </Link>
               </li>
             </ul>
          </div>

          <div>
             <h4 className="font-bold text-xs uppercase tracking-[0.2em] mb-8 text-slate-500">
               {t('footer.contact')}
             </h4>
             <ul className="space-y-4 text-sm text-slate-400">
               <li className="flex gap-3">
                 <MapPin className="w-4 h-4 text-accent" /> 
                 {language === 'zh' ? t('footer.addressZh') : language === 'en' ? 'Cikarang, Indonesia' : 'Cikarang, Indonesia'}
               </li>
               <li className="flex gap-3"><Phone className="w-4 h-4 text-accent" /> +62 21 8900 1234</li>
             </ul>
          </div>

          <div>
             <h4 className="font-bold text-xs uppercase tracking-[0.2em] mb-8 text-slate-500">
               {t('footer.newsletter')}
             </h4>
             <div className="flex gap-2">
               <Input 
                 className="bg-white/5 border-white/10 text-white" 
                 placeholder={t('footer.emailPlaceholder')} 
               />
               <Button className="btn-accent px-4">OK</Button>
             </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/5 py-8">
        <div className="container-enterprise flex flex-col md:flex-row justify-between items-center text-[10px] font-bold uppercase tracking-widest text-slate-500">
          <p>© {new Date().getFullYear()} PT Semen Nusantara.</p>
          <p className="text-white uppercase">{creditText}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;