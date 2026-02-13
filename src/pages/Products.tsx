import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, CheckCircle2, AlertTriangle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/lib/supabase';
import { Product } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import ProductSkeleton from '@/components/ui/ProductSkeleton';

const ProductsPage: React.FC = () => {
  const { slug } = useParams();
  const { t, language } = useLanguage(); 
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: true });
        
        if (error) {
          setError(error.message || 'Failed to fetch products');
          return;
        }
        
        if (data) setProducts(data);
      } catch (err) {
        setError('An unexpected error occurred while loading products');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) return (
    <Layout>
      <div className="py-24 bg-white">
        <div className="container-enterprise">
          <div className="text-center mb-16">
            <Skeleton className="h-16 w-64 bg-slate-200 mx-auto mb-2" />
            <Skeleton className="h-1.5 w-24 bg-slate-200 mx-auto" />
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {[1, 2, 3, 4].map((i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );

  if (error) return (
    <Layout>
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="max-w-md w-full">
          <Alert className="border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              {error}
            </AlertDescription>
          </Alert>
          <Button 
            onClick={() => window.location.reload()} 
            className="mt-4 w-full"
            variant="outline"
          >
            {t('common.retry')}
          </Button>
        </div>
      </div>
    </Layout>
  );

  // --- VIEW DETAIL PRODUK (Saat Klik PPC/OPC) ---
  if (slug) {
    const p = products.find(item => item.slug === slug);
    if (!p) return (
      <Layout>
        <div className="py-20 text-center">
          <p className="font-bold uppercase tracking-widest text-slate-400">
            {t('common.productNotFound')}
          </p>
        </div>
      </Layout>
    );

    // Logika Bahasa Detail
    const getDetailName = () => {
      if (language === 'zh') return (p.name_zh || p.name_en || p.name);
      if (language === 'en') return (p.name_en || p.name);
      return (p.name || p.name_en);
    };

    const getDetailDesc = () => {
      if (language === 'zh') return (p.description_zh || p.description_en || p.description);
      if (language === 'en') return (p.description_en || p.description);
      return (p.description || p.description_en);
    };

    const getDetailFeatures = () => {
      if (language === 'zh') return (p.features_zh || p.features_en || p.features || []);
      if (language === 'en') return (p.features_en || p.features || []);
      return (p.features || p.features_en || []);
    };

    const detailName = getDetailName();
    const detailDesc = getDetailDesc();
    const detailFeatures = getDetailFeatures();

    return (
      <Layout>
        <div className="bg-[#0f172a] pt-32 pb-20 text-white">
          <div className="container-enterprise">
            <Link to="/produk" className="text-accent flex items-center gap-2 mb-8 uppercase text-[10px] font-bold tracking-widest hover:opacity-70 transition-opacity">
              <ArrowLeft size={14} /> 
              {t('common.backToProducts')}
            </Link>
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="animate-in fade-in slide-in-from-left duration-700">
                <h1 className="text-5xl md:text-6xl font-bold uppercase mb-4 leading-tight">
                  {detailName}
                </h1>
                <p className="text-slate-400 mb-8 max-w-md text-sm md:text-base leading-relaxed">
                  {detailDesc}
                </p>
                <Button className="btn-accent px-10 py-6 rounded-none font-bold tracking-widest text-xs">
                  {t('hero.ctaPrimary')}
                </Button>
              </div>
              <div className="bg-white/5 border border-white/10 aspect-square flex items-center justify-center relative overflow-hidden group">
                <img 
                  src={`/images/products/${p.slug === 'portland-composite-cement' ? 'pcc-cement' : p.slug === 'ordinary-portland-cement' ? 'opc-cement' : 'srpc-cement'}.jpg`}
                  alt={detailName}
                  className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-500"
                  onError={(e) => {
                    // Fallback to placeholder if image fails
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent) {
                      parent.innerHTML = `
                        <span class="text-[15rem] font-bold opacity-5 uppercase transition-transform duration-700 group-hover:scale-110">
                          ${p.slug?.[0] || 'SN'}
                        </span>
                        <div class="absolute inset-0 flex items-center justify-center">
                          <div class="w-48 h-64 border-2 border-accent/20 rotate-12 flex items-center justify-center">
                            <span class="text-5xl font-bold -rotate-12 text-accent">SN</span>
                          </div>
                        </div>
                      `;
                    }
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                <div className="absolute top-4 left-4 px-3 py-1 bg-accent/90 backdrop-blur-sm rounded-full">
                  <span className="text-xs font-bold text-white">
                    {language === 'zh' ? '优质' : 'PREMIUM'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="py-24 bg-white">
           <div className="container-enterprise">
              <Tabs defaultValue="features" className="w-full">
                <TabsList className="mb-12 bg-slate-100 p-1 rounded-none inline-flex">
                  <TabsTrigger value="features" className="rounded-none font-bold text-[10px] tracking-widest uppercase">
                    {t('products.keyFeatures')}
                  </TabsTrigger>
                  <TabsTrigger value="specs" className="rounded-none font-bold text-[10px] tracking-widest uppercase">
                    {t('products.specifications')}
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="features" className="animate-in fade-in duration-500">
                   <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {detailFeatures.map((f: string, i: number) => (
                        <div key={i} className="p-6 bg-slate-50 border border-slate-100 flex gap-4 items-start">
                          <CheckCircle2 className="text-accent shrink-0" size={20} />
                          <span className="font-bold text-xs uppercase tracking-tight text-slate-700 leading-snug">{f}</span>
                        </div>
                      ))}
                   </div>
                </TabsContent>

                <TabsContent value="specs" className="animate-in fade-in duration-500">
                   <div className="max-w-2xl bg-slate-50 border border-slate-100 p-8">
                      <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">
                        {t('products.technicalDataSheet')}
                      </p>
                      <div className="mt-6 space-y-4">
                         <div className="flex justify-between border-b pb-2 text-sm uppercase font-bold text-slate-600">
                            <span>{t('products.standard')}</span>
                            <span className="text-slate-900">SNI 7064:2014</span>
                         </div>
                      </div>
                   </div>
                </TabsContent>
              </Tabs>
           </div>
        </div>
      </Layout>
    );
  }

  // --- VIEW KATALOG (Halaman Utama /produk) ---
  return (
    <Layout>
      <div className="py-24 bg-white">
        <div className="container-enterprise">
          <div className="text-center mb-16">
            <h1 className="text-6xl font-bold uppercase mb-2 tracking-tighter text-slate-900">
              {t('products.title')}
            </h1>
            <div className="h-1.5 w-24 bg-accent mx-auto" />
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {products.map((p) => {
              // Logika Bahasa Katalog
              const getName = () => {
                if (language === 'zh') return (p.name_zh || p.name_en || p.name);
                if (language === 'en') return (p.name_en || p.name);
                return (p.name || p.name_en);
              };
              const name = getName();
              const desc = language === 'en' ? (p.description_en || p.description) : (p.description || p.description_en);
              
              const getProductType = (slug: string) => {
                const slugLower = slug.toLowerCase();
                if (slugLower.includes('portland-composite') || slugLower.includes('pcc')) return 'PCC';
                if (slugLower.includes('ordinary-portland') || slugLower.includes('opc')) return 'OPC';
                if (slugLower.includes('sulfate-resistant') || slugLower.includes('src')) return 'SRC';
                if (slugLower.includes('portland-pozzolan') || slugLower.includes('srpc') || slugLower.includes('pozzolan')) return 'SRPC';
                return slug.split('-').map((w: any) => w[0]).join('').toUpperCase();
              };

              const productType = getProductType(p.slug || '');
              
              const productDesc = t(`productDescriptions.${productType}`) || desc;

              return (
                <Link 
                  key={p.id} 
                  to={`/produk/${p.slug}`} 
                  className="group border border-slate-200 hover:border-accent transition-all duration-500 shadow-sm hover:shadow-2xl bg-white rounded-xl overflow-hidden"
                >
                  <div className="grid grid-cols-5 min-h-[320px]">
                    <div className="col-span-2 bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-6 text-white relative overflow-hidden">
                      <img 
                        src={`/images/products/${p.slug === 'portland-composite-cement' ? 'pcc-cement' : p.slug === 'ordinary-portland-cement' ? 'opc-cement' : 'srpc-cement'}.jpg`}
                        alt={name}
                        className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-90 transition-opacity duration-500"
                        onError={(e) => {
                          // Fallback to placeholder if image fails
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                        }}
                      />
                      
                      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/40 to-slate-800/40" />
                      
                      <div className="absolute top-4 left-4 px-2 py-1 bg-accent/90 backdrop-blur-sm rounded-full">
                        <span className="text-xs font-bold text-white">
                          {language === 'zh' ? '优质' : 'PREMIUM'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="col-span-3 p-8 flex flex-col justify-between bg-white">
                      <div>
                        <div className="flex items-start justify-between mb-4">
                          <h3 className="text-2xl font-bold uppercase text-slate-900 leading-none group-hover:text-accent transition-colors">
                            {name}
                          </h3>
                          <div className="flex flex-col items-end gap-1">
                            <div className="flex items-center gap-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <svg key={star} className="w-3 h-3 fill-accent text-accent" viewBox="0 0 20 20">
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                            </div>
                            <span className="text-xs text-slate-500">5.0</span>
                          </div>
                        </div>
                        
                        <p className="text-slate-600 text-sm leading-relaxed mb-4 line-clamp-3">
                          {productDesc}
                        </p>
                        
                        <div className="flex flex-wrap gap-2 mb-4">
                          {productType === 'PCC' && (
                            <>
                              <span className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded-full font-medium">
                                {language === 'zh' ? '多用途' : language === 'id' ? 'Multi-Aplikasi' : 'Multi-Purpose'}
                              </span>
                              <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full font-medium">
                                {language === 'zh' ? '环保型' : language === 'id' ? 'Eco-Friendly' : 'Eco-Friendly'}
                              </span>
                            </>
                          )}
                          {productType === 'OPC' && (
                            <>
                              <span className="px-2 py-1 bg-orange-50 text-orange-700 text-xs rounded-full font-medium">
                                {language === 'zh' ? '高强度' : language === 'id' ? 'Kekuatan Tinggi' : 'High Strength'}
                              </span>
                              <span className="px-2 py-1 bg-red-50 text-red-700 text-xs rounded-full font-medium">
                                {language === 'zh' ? 'SNI 认证' : 'SNI Certified'}
                              </span>
                            </>
                          )}
                          {productType === 'SRC' && (
                            <>
                              <span className="px-2 py-1 bg-purple-50 text-purple-700 text-xs rounded-full font-medium">
                                {language === 'zh' ? '抗腐蚀' : language === 'id' ? 'Tahan Korosi' : 'Corrosion Resistant'}
                              </span>
                              <span className="px-2 py-1 bg-cyan-50 text-cyan-700 text-xs rounded-full font-medium">
                                {language === 'zh' ? '沿海地区' : language === 'id' ? 'Area Pantai' : 'Coastal Areas'}
                              </span>
                            </>
                          )}
                          {productType === 'SRPC' && (
                            <>
                              <span className="px-2 py-1 bg-emerald-50 text-emerald-700 text-xs rounded-full font-medium">
                                {language === 'zh' ? '高耐久性' : language === 'id' ? 'Daya Tahan Tinggi' : 'High Durability'}
                              </span>
                              <span className="px-2 py-1 bg-teal-50 text-teal-700 text-xs rounded-full font-medium">
                                {language === 'zh' ? '耐化学性' : language === 'id' ? 'Ketahanan Kimia' : 'Chemical Resistance'}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                        <div className="flex items-center gap-3">
                          <div className="text-left">
                            <p className="text-xs text-slate-500 uppercase tracking-wide">
                              {language === 'zh' ? '质量' : language === 'id' ? 'KUALITAS' : 'QUALITY'}
                            </p>
                            <p className="text-sm font-bold text-accent">
                              {language === 'zh' ? '优质' : 'PREMIUM'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center text-accent text-[10px] font-bold tracking-[0.2em] group-hover:translate-x-1 transition-all">
                          {language === 'zh' ? '探索产品' : language === 'en' ? 'EXPLORE PRODUCT' : 'LIHAT PRODUK'} 
                          <ArrowRight size={14} className="ml-2" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductsPage;