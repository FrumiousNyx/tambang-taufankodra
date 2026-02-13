import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import ScrollReveal from '@/components/ui/scroll-reveal';

const products = [
  {
    id: 'pcc',
    name: 'Portland Composite Cement',
    nameEn: 'Portland Composite Cement',
    slug: 'portland-composite-cement',
    description: 'Semen serbaguna untuk konstruksi umum dengan kekuatan optimal',
    descriptionEn: 'Versatile cement for general construction with optimal strength',
    features: ['Kekuatan Tinggi', 'Anti Retak', 'Eco-Friendly'],
    featuresEn: ['High Strength', 'Crack Resistant', 'Eco-Friendly'],
    image: '/images/products/pcc-cement.jpg',
    color: 'from-slate-600 to-slate-800',
  },
  {
    id: 'opc',
    name: 'Ordinary Portland Cement',
    nameEn: 'Ordinary Portland Cement',
    slug: 'ordinary-portland-cement',
    description: 'Standar industri untuk proyek infrastruktur berskala besar',
    descriptionEn: 'Industry standard for large-scale infrastructure projects',
    features: ['SNI Certified', 'High Performance', 'Durable'],
    featuresEn: ['SNI Certified', 'High Performance', 'Durable'],
    image: '/images/products/opc-cement.jpg',
    color: 'from-zinc-600 to-zinc-800',
  },
  {
    id: 'srpc',
    name: 'Sulfate Resistant Cement',
    nameEn: 'Sulfate Resistant Cement',
    slug: 'sulfate-resistant-cement',
    description: 'Ketahanan tinggi untuk konstruksi area pesisir dan tanah sulfat',
    descriptionEn: 'High resistance for coastal area and sulfate soil construction',
    features: ['Marine Grade', 'Corrosion Resistant', 'Long-lasting'],
    featuresEn: ['Marine Grade', 'Corrosion Resistant', 'Long-lasting'],
    image: '/images/products/cement-bags.jpg',
    color: 'from-blue-700 to-blue-900',
  },
];

const ProductsSection: React.FC = () => {
  const { t, language } = useLanguage();

  return (
    <section className="section-padding bg-secondary">
      <div className="container-enterprise">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h2 className="heading-section text-foreground mb-4">
              {t('products.title')}
            </h2>
            <p className="text-body-large max-w-2xl mx-auto">
              {t('products.subtitle')}
            </p>
            <div className="divider-accent mx-auto mt-6" />
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <ScrollReveal key={product.id} delay={index * 0.1}>
              <Link to={`/produk/${product.slug}`} className="block group">
                <div className="card-enterprise overflow-hidden h-full">
                  {/* Product Image */}
                  <div className={`h-48 bg-gradient-to-br ${product.color} relative overflow-hidden`}>
                    <img 
                      src={product.image}
                      alt={language === 'id' ? product.name : product.nameEn}
                      className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
                      onError={(e) => {
                        // Fallback to placeholder if image fails
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent) {
                          parent.innerHTML = `
                            <div class="absolute inset-0 flex items-center justify-center">
                              <div class="w-24 h-32 bg-primary-foreground/20 rounded-lg flex items-center justify-center">
                                <span class="text-lg font-bold product-label text-accent">
                                  ${product.id.toUpperCase()}
                                </span>
                              </div>
                            </div>
                            <div class="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                          `;
                        }
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                  </div>

                  {/* Product Info */}
                  <div className="p-6">
                    <h3 className="font-bold font-semibold text-xl text-foreground mb-2 group-hover:text-accent transition-colors">
                      {language === 'id' ? product.name : product.nameEn}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                      {language === 'id' ? product.description : product.descriptionEn}
                    </p>

                    {/* Features */}
                    <div className="space-y-2 mb-6">
                      {(language === 'id' ? product.features : product.featuresEn).map((feature, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm">
                          <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0" />
                          <span className="text-muted-foreground">{feature}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center text-accent font-medium text-sm group-hover:gap-3 transition-all">
                      <span>{t('products.specs')}</span>
                      <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal delay={0.4}>
          <div className="text-center mt-12">
            <Link to="/produk">
              <Button className="btn-primary">
                {t('products.viewAll')}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default ProductsSection;
