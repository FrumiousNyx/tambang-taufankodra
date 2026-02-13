import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, MapPin, Building, Calendar, TrendingUp } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import ScrollReveal from '@/components/ui/scroll-reveal';

const allProjects = [
  {
    id: 1,
    slug: 'tol-trans-jawa',
    title: 'Jalan Tol Trans Jawa',
    titleEn: 'Trans Java Toll Road',
    titleZh: '跨爪哇高速公路',
    client: 'Kementerian PUPR',
    clientEn: 'Ministry of Public Works',
    clientZh: '公共工程与住房部',
    location: 'Jawa Tengah - Jawa Timur',
    locationEn: 'Central Java - East Java',
    locationZh: '中爪哇省 - 东爪哇省',
    volume: '850,000 Ton',
    scope: 'Konstruksi jalan tol sepanjang 300 km menghubungkan Semarang-Surabaya dengan standar tol kelas satu.',
    scopeEn: '300 km toll road construction connecting Semarang-Surabaya with first-class toll standards.',
    scopeZh: '连接三宝垄和泗水的 300 公里高速公路建设，采用一级高速公路标准。',
    year: 2023,
    duration: '24 bulan',
    durationEn: '24 months',
    durationZh: '24个月',
    products: ['PCC', 'OPC'],
    image: '/images/projects/Trans Java Toll Road.png',
    highlights: [
      'Proyek infrastruktur strategis nasional',
      'Kolaborasi dengan kontraktor BUMN',
      'Standar kualitas internasional',
    ],
    highlightsEn: [
      'National strategic infrastructure project',
      'Collaboration with state-owned contractors',
      'International quality standards',
    ],
    highlightsZh: [
      '国家战略基础设施项目',
      '与国有承包商合作',
      '国际质量标准',
    ],
  },
  {
    id: 2,
    slug: 'pelabuhan-patimban',
    title: 'Pelabuhan Patimban',
    titleEn: 'Patimban Port',
    titleZh: '巴廷班港',
    client: 'Pelindo',
    clientEn: 'Pelindo',
    clientZh: '印尼港口公司',
    location: 'Subang, Jawa Barat',
    locationEn: 'Subang, West Java',
    locationZh: '西爪哇省, 苏邦',
    volume: '420,000 Ton',
    scope: 'Pembangunan dermaga dan terminal kontainer modern untuk mendukung ekspor-impor nasional.',
    scopeEn: 'Construction of modern pier and container terminal to support national export-import.',
    scopeZh: '建设现代化的码头和集装箱终端，以支持国家的进出口。',
    year: 2024,
    duration: '36 bulan',
    durationEn: '36 months',
    durationZh: '36个月',
    products: ['SRPC', 'PCC'],
    image: '/images/projects/Patimban Port.png',
    highlights: [
      'Pelabuhan terbesar di Jawa Barat',
      'Menggunakan semen tahan sulfat',
      'Kapasitas 7.5 juta TEUs',
    ],
    highlightsEn: [
      'Largest port in West Java',
      'Using sulfate-resistant cement',
      'Capacity of 7.5 million TEUs',
    ],
    highlightsZh: [
      '西爪哇省最大的港口',
      '使用抗硫酸盐水泥',
      '容量为 750 万标准箱 (TEUs)',
    ],
  },
  {
    id: 3,
    slug: 'kawasan-industri-kendal',
    title: 'Kawasan Industri Kendal',
    titleEn: 'Kendal Industrial Park',
    titleZh: '肯德尔工业园',
    client: 'PT Kawasan Industri Jababeka',
    clientEn: 'PT Kawasan Industri Jababeka',
    clientZh: 'Jababeka 工业园区公司',
    location: 'Kendal, Jawa Tengah',
    locationEn: 'Kendal, Central Java',
    locationZh: '中爪哇省, 肯德尔',
    volume: '320,000 Ton',
    scope: 'Infrastruktur kawasan industri terpadu seluas 2,700 hektar dengan fasilitas lengkap.',
    scopeEn: 'Integrated industrial park infrastructure covering 2,700 hectares with complete facilities.',
    scopeZh: '占地 2,700 公顷且设施齐全的综合工业园基础设施。',
    year: 2024,
    duration: '48 bulan',
    durationEn: '48 months',
    durationZh: '48个月',
    products: ['PCC', 'OPC'],
    image: '/images/projects/Kendal Insdustri Park.png',
    highlights: [
      'Kawasan industri terpadu',
      'Joint venture Indonesia-Singapore',
      'Infrastruktur kelas dunia',
    ],
    highlightsEn: [
      'Integrated industrial park',
      'Indonesia-Singapore joint venture',
      'World-class infrastructure',
    ],
    highlightsZh: [
      '综合工业园区',
      '印尼-新加坡合资企业',
      '世界级基础设施',
    ],
  },
  {
    id: 4,
    slug: 'bandara-kertajati',
    title: 'Bandara Internasional Kertajati',
    titleEn: 'Kertajati International Airport',
    titleZh: '克塔贾蒂国际机场',
    client: 'PT Angkasa Pura II',
    clientEn: 'PT Angkasa Pura II',
    clientZh: '印尼第二机场管理公司',
    location: 'Majalengka, Jawa Barat',
    locationEn: 'Majalengka, West Java',
    locationZh: '西爪哇省, 马贾伦卡',
    volume: '280,000 Ton',
    scope: 'Pembangunan runway, taxiway, dan apron untuk bandara internasional.',
    scopeEn: 'Construction of runway, taxiway, and apron for international airport.',
    scopeZh: '国际机场跑道、滑行道和停机坪建设。',
    year: 2023,
    duration: '30 bulan',
    durationEn: '30 months',
    durationZh: '30个月',
    products: ['OPC', 'PCC'],
    image: '/images/projects/Kertajati International Airport.png',
    highlights: [
      'Bandara terbesar di Jawa Barat',
      'Runway sepanjang 3,000 meter',
      'Kapasitas 5 juta penumpang/tahun',
    ],
    highlightsEn: [
      'Largest airport in West Java',
      '3,000-meter runway',
      'Capacity of 5 million passengers/year',
    ],
    highlightsZh: [
      '西爪哇省最大的机场',
      '3,000 米跑道',
      '每年 500 万旅客吞吐量',
    ],
  },
  {
    id: 5,
    slug: 'pltu-cirebon',
    title: 'PLTU Cirebon Unit 2',
    titleEn: 'Cirebon Power Plant Unit 2',
    titleZh: '井里汶电厂 2 号机组',
    client: 'PT PLN (Persero)',
    clientEn: 'PT PLN (Persero)',
    clientZh: '国家电力公司',
    location: 'Cirebon, Jawa Barat',
    locationEn: 'Cirebon, West Java',
    locationZh: '西爪哇省, 井里汶',
    volume: '180,000 Ton',
    scope: 'Pembangunan pembangkit listrik tenaga uap 1,000 MW.',
    scopeEn: 'Construction of 1,000 MW coal-fired power plant.',
    scopeZh: '1,000 兆瓦燃煤电厂建设。',
    year: 2022,
    duration: '40 bulan',
    durationEn: '40 months',
    durationZh: '40个月',
    products: ['OPC', 'SRPC'],
    image: '/images/projects/Cirebon Power Plant Unit 2.png',
    highlights: [
      'Kapasitas 1,000 MW',
      'Teknologi ultra-supercritical',
      'Efisiensi tinggi',
    ],
    highlightsEn: [
      'Capacity of 1,000 MW',
      'Ultra-supercritical technology',
      'High efficiency',
    ],
    highlightsZh: [
      '1,000 兆瓦容量',
      '超超临界技术',
      '高效率',
    ],
  },
  {
    id: 6,
    slug: 'mrt-jakarta-fase-2',
    title: 'MRT Jakarta Fase 2',
    titleEn: 'Jakarta MRT Phase 2',
    titleZh: '雅加达捷运二期工程',
    client: 'PT MRT Jakarta',
    clientEn: 'PT MRT Jakarta',
    clientZh: '雅加达捷运公司',
    location: 'DKI Jakarta',
    locationEn: 'Jakarta',
    locationZh: '雅加达特别首都区',
    volume: '150,000 Ton',
    scope: 'Pembangunan jalur MRT dari Bundaran HI ke Kota sepanjang 8.1 km.',
    scopeEn: 'Construction of MRT line from Bundaran HI to Kota spanning 8.1 km.',
    scopeZh: '建设从 Bundaran HI 到 Kota 的 8.1 公里捷运线路。',
    year: 2024,
    duration: '48 bulan',
    durationEn: '48 months',
    durationZh: '48个月',
    products: ['OPC', 'PCC'],
    image: '/images/projects/Jakarta MRT Phase 2.png',
    highlights: [
      'Jalur bawah tanah',
      '7 stasiun baru',
      'Transportasi massal modern',
    ],
    highlightsEn: [
      'Underground line',
      '7 new stations',
      'Modern mass transportation',
    ],
    highlightsZh: [
      '地下线路',
      '7 个新站点',
      '现代公共交通',
    ],
  },
];

const ProjectsPage: React.FC = () => {
  const { slug } = useParams();
  const { t, language } = useLanguage();

  if (slug) {
    const project = allProjects.find(p => p.slug === slug);
    
    if (!project) {
      return (
        <Layout>
          <div className="section-padding container-enterprise text-center">
            <h1 className="heading-section">
              {t('common.projectNotFound')}
            </h1>
            <Link to="/proyek">
              <Button className="mt-6">
                {t('common.backToProjects')}
              </Button>
            </Link>
          </div>
        </Layout>
      );
    }

    return (
      <Layout>
        {/* Hero */}
        <section className="py-20 relative overflow-hidden" style={{ background: 'var(--gradient-hero)' }}>
          <div className="absolute inset-0">
            <img 
              src={project.image}
              alt={language === 'zh' ? project.titleZh : language === 'en' ? project.titleEn : project.title}
              className="absolute inset-0 w-full h-full object-cover opacity-20"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
          </div>
          <div className="container-enterprise relative z-10">
            <Link to="/proyek" className="inline-flex items-center text-primary-foreground/80 hover:text-primary-foreground mb-6 transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t('common.backToProjects')}
            </Link>
            <div className="max-w-3xl">
              <span className="inline-block px-3 py-1 bg-accent text-accent-foreground rounded-full text-sm font-medium mb-4">
                {project.year}
              </span>
              <h1 className="heading-hero text-primary-foreground mb-4">
                {language === 'zh' ? project.titleZh : language === 'en' ? project.titleEn : project.title}
              </h1>
              <p className="text-xl text-primary-foreground/80 mb-8">
                {language === 'zh' ? project.scopeZh : language === 'en' ? project.scopeEn : project.scope}
              </p>
              <div className="flex flex-wrap gap-6">
                <div className="flex items-center gap-2 text-primary-foreground/70">
                  <Building className="w-5 h-5" />
                  <span>{language === 'zh' ? project.clientZh : language === 'en' ? project.clientEn : project.client}</span>
                </div>
                <div className="flex items-center gap-2 text-primary-foreground/70">
                  <MapPin className="w-5 h-5" />
                  <span>{language === 'zh' ? project.locationZh : language === 'en' ? project.locationEn : project.location}</span>
                </div>
                <div className="flex items-center gap-2 text-primary-foreground/70">
                  <Calendar className="w-5 h-5" />
                  <span>{language === 'zh' ? project.durationZh : language === 'en' ? project.durationEn : project.duration}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Details */}
        <section className="section-padding">
          <div className="container-enterprise">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Main Info */}
              <div className="lg:col-span-2 space-y-8">
                <div className="card-enterprise p-8">
                  <h3 className="font-bold font-semibold text-2xl mb-6">
                    {t('projects.highlights')}
                  </h3>
                  <div className="space-y-4">
                    {(language === 'zh' ? project.highlightsZh : language === 'en' ? project.highlightsEn : project.highlights)?.map((highlight, index) => (
                      <div key={index} className="flex items-start gap-4">
                        <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                          <TrendingUp className="w-4 h-4 text-accent" />
                        </div>
                        <p className="text-muted-foreground">{highlight}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="card-enterprise p-8">
                  <h3 className="font-bold font-semibold text-2xl mb-6">
                    {t('projects.productsUsed')}
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {project.products.map((product, index) => (
                      <Link
                        key={index}
                        to={`/produk/${product.toLowerCase() === 'pcc' ? 'portland-composite-cement' : product.toLowerCase() === 'opc' ? 'ordinary-portland-cement' : 'sulfate-resistant-cement'}`}
                        className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-accent transition-colors"
                      >
                        {product}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                <div className="card-enterprise p-6">
                  <h4 className="font-bold font-semibold text-lg mb-4">{t('projects.volume')}</h4>
                  <p className="text-3xl font-bold font-bold text-accent">{project.volume}</p>
                </div>

                <div className="card-enterprise p-6">
                  <h4 className="font-bold font-semibold text-lg mb-4">{t('projects.client')}</h4>
                  <p className="text-muted-foreground">{language === 'zh' ? project.clientZh : language === 'en' ? project.clientEn : project.client}</p>
                </div>

                <div className="card-enterprise p-6">
                  <h4 className="font-bold font-semibold text-lg mb-4">
                    {t('projects.location')}
                  </h4>
                  <p className="text-muted-foreground">{language === 'zh' ? project.locationZh : language === 'en' ? project.locationEn : project.location}</p>
                </div>

                <Link to="/kontak">
                  <Button className="btn-accent w-full">
                    {t('hero.ctaPrimary')}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </Layout>
    );
  }

  // Projects List
  return (
    <Layout>
      <section className="section-padding">
        <div className="container-enterprise">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h1 className="heading-hero text-foreground mb-4">
                    {t('projects.ourProjects')}
              </h1>
              <p className="text-body-large max-w-2xl mx-auto">
                {t('projects.supportingProjects')}
              </p>
              <div className="divider-accent mx-auto mt-6" />
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {allProjects.map((project, index) => (
              <ScrollReveal key={project.id} delay={index * 0.1}>
                <Link to={`/proyek/${project.slug}`} className="block group">
                  <div className="card-enterprise overflow-hidden h-full">
                    <div className="h-48 bg-gradient-to-br from-muted to-secondary relative overflow-hidden">
                      <img 
                        src={project.image}
                        alt={language === 'zh' ? project.titleZh : language === 'en' ? project.titleEn : project.title}
                        className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-500"
                        onError={(e) => {
                          // Fallback to placeholder if image fails
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const parent = target.parentElement;
                          if (parent) {
                            parent.innerHTML = `
                              <div class="absolute inset-0 flex items-center justify-center">
                                <div class="w-16 h-16 rounded-lg bg-muted/30 flex items-center justify-center">
                                  <svg class="w-8 h-8 text-muted-foreground/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                                  </svg>
                                </div>
                              </div>
                            `;
                          }
                        }}
                      />
                      <div className="absolute top-4 right-4 px-3 py-1 bg-accent text-accent-foreground text-sm font-medium rounded-full">
                        {project.year}
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="font-bold font-semibold text-xl text-primary-foreground">
                          {language === 'zh' ? project.titleZh : language === 'en' ? project.titleEn : project.title}
                        </h3>
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="space-y-3 mb-6">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Building className="w-4 h-4 text-accent" />
                          <span>{language === 'zh' ? project.clientZh : language === 'en' ? project.clientEn : project.client}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="w-4 h-4 text-accent" />
                          <span>{language === 'zh' ? project.locationZh : language === 'en' ? project.locationEn : project.location}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-border">
                        <div>
                          <p className="text-xs text-muted-foreground uppercase">{language === 'zh' ? '用量' : t('projects.volume')}</p>
                          <p className="text-lg font-bold font-semibold text-accent">{project.volume}</p>
                        </div>
                        <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-accent group-hover:translate-x-1 transition-all" />
                      </div>
                    </div>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ProjectsPage;