import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Recycle, TreePine, Droplets, Wind, Factory, Award, Target } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import ScrollReveal from '@/components/ui/scroll-reveal';

const SustainabilityPage: React.FC = () => {
  const { language } = useLanguage();

  const esgInitiatives = [
    {
      icon: <Leaf className="w-8 h-8" />,
      title: language === 'id' ? 'Manajemen Emisi Karbon' : language === 'en' ? 'Carbon Emission Management' : '碳排放管理',
      description: language === 'id' 
        ? 'Reduksi emisi CO2 hingga 30% melalui teknologi produksi hijau dan penggunaan bahan bakar alternatif.'
        : language === 'en' ? '30% CO2 emission reduction through green production technology and alternative fuel usage.'
        : '通过绿色生产技术和替代燃料的使用，减少高达30%的二氧化碳排放。',
      metrics: language === 'id' ? '30% Reduksi CO2' : language === 'en' ? '30% CO2 Reduction' : '30% 二氧化碳减排'
    },
    {
      icon: <Droplets className="w-8 h-8" />,
      title: language === 'id' ? 'Konservasi Air' : language === 'en' ? 'Water Conservation' : '水资源保护',
      description: language === 'id'
        ? 'Sistem daur ulang air tertutup dengan efisiensi 95% untuk meminimalkan konsumsi air industri.'
        : language === 'en' ? 'Closed-loop water recycling system with 95% efficiency to minimize industrial water consumption.'
        : '效率高达95%的闭环水循环系统，最大限度地减少工业用水。',
      metrics: language === 'id' ? '95% Efisiensi Air' : language === 'en' ? '95% Water Efficiency' : '95% 水资源效率'
    },
    {
      icon: <Recycle className="w-8 h-8" />,
      title: language === 'id' ? 'Ekonomi Sirkular' : language === 'en' ? 'Circular Economy' : '循环经济',
      description: language === 'id'
        ? 'Pemanfaatan limbah industri sebagai bahan baku alternatif dan program daur ulang produk.'
        : language === 'en' ? 'Utilization of industrial waste as alternative raw materials and product recycling programs.'
        : '利用工业废物作为替代原料，并开展产品回收计划。',
      metrics: language === 'id' ? '85% Material Daur Ulang' : language === 'en' ? '85% Recycled Materials' : '85% 回收材料'
    },
    {
      icon: <Wind className="w-8 h-8" />,
      title: language === 'id' ? 'Energi Terbarukan' : language === 'en' ? 'Renewable Energy' : '可再生能源',
      description: language === 'id'
        ? 'Transisi ke energi terbarukan dengan target 40% dari total kebutuhan energi pabrik.'
        : language === 'en' ? 'Transition to renewable energy with target of 40% of total plant energy requirements.'
        : '向可再生能源转型，目标占工厂总能源需求的40%。',
      metrics: language === 'id' ? '40% Energi Hijau' : language === 'en' ? '40% Green Energy' : '40% 绿色能源'
    }
  ];

  const reclamationProjects = [
    {
      title: language === 'id' ? 'Reklamasi Tambang Cibuni' : language === 'en' ? 'Cibuni Mine Reclamation' : 'Cibuni 矿区复垦',
      location: language === 'id' ? 'Jawa Barat' : language === 'en' ? 'West Java' : '西爪哇',
      area: language === 'id' ? '250 Hektar' : language === 'en' ? '250 Hectares' : '250 公顷',
      status: language === 'id' ? 'Selesai 2024' : language === 'en' ? 'Completed 2024' : '2024年完成',
      description: language === 'id'
        ? 'Transformasi bekas lahan tambang menjadi kawasan konservasi dan agroforestri.'
        : language === 'en' ? 'Transformation of former mining land into conservation and agroforestry area.'
        : '将前矿区转变为保护区和农林业区。'
    },
    {
      title: language === 'id' ? 'Program Hijau Citeureup' : language === 'en' ? 'Citeureup Green Program' : 'Citeureup 绿色计划',
      location: language === 'id' ? 'Bogor, Jawa Barat' : language === 'en' ? 'Bogor, West Java' : '西爪哇省茂物',
      area: language === 'id' ? '180 Hektar' : language === 'en' ? '180 Hectares' : '180 公顷',
      status: language === 'id' ? 'Berlangsung 2025' : language === 'en' ? 'Ongoing 2025' : '2025年进行中',
      description: language === 'id'
        ? 'Revegetasi dan pengembangan ekosistem dengan 50.000 pohon endemik.'
        : language === 'en' ? 'Revegetation and ecosystem development with 50,000 endemic trees.'
        : '通过50,000棵原生树木进行植被恢复和生态系统开发。'
    }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-32" style={{ background: 'linear-gradient(135deg, hsl(142 70% 40%) 0%, hsl(142 60% 30%) 50%, hsl(220 25% 18%) 100%)' }}>
        <div className="container-enterprise">
          <ScrollReveal>
            {/* PERBAIKAN: Menambahkan flex flex-col items-center dan mx-auto agar teks di tengah */}
            <div className="max-w-4xl flex flex-col items-center text-center mx-auto">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6">
                <TreePine className="w-10 h-10 text-white" />
              </div>
              <h1 className="heading-hero text-white mb-6">
                {language === 'id' ? 'Keberlanjutan' : language === 'en' ? 'Sustainability' : '可持续发展'}
              </h1>
              <p className="text-xl text-white/90 mb-8 max-w-3xl">
                {language === 'id'
                  ? 'Komitmen kami terhadap pembangunan berkelanjutan melalui praktik industri hijau, perlindungan lingkungan, dan penciptaan nilai bersama untuk stakeholder.'
                  : language === 'en' ? 'Our commitment to sustainable development through green industry practices, environmental protection, and shared value creation for stakeholders.'
                  : '我们通过绿色工业实践、环境保护以及为利益相关者创造共享价值，致力于可持续发展。'
                }
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link to="/investor">
                  <Button className="bg-white text-green-700 hover:bg-white/90 btn-enterprise">
                    <Award className="w-4 h-4 mr-2" />
                    {language === 'id' ? 'Laporan ESG' : language === 'en' ? 'ESG Reports' : 'ESG 报告'}
                  </Button>
                </Link>
                <Link to="/kontak">
                  <Button className="btn-outline border-white text-white hover:bg-white hover:text-green-700 btn-enterprise">
                    <Target className="w-4 h-4 mr-2" />
                    {language === 'id' ? 'Kolaborasi' : language === 'en' ? 'Partnership' : '合作伙伴关系'}
                  </Button>
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ESG Initiatives */}
      <section className="section-padding">
        <div className="container-enterprise">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="heading-section text-foreground mb-4">
                {language === 'id' ? 'Inisiatif ESG Terpadu' : language === 'en' ? 'Integrated ESG Initiatives' : '综合 ESG 倡议'}
              </h2>
              <p className="text-body-large max-w-3xl mx-auto">
                {language === 'id'
                  ? 'Implementasi Environmental, Social, dan Governance (ESG) sebagai fondasi strategis keberlanjutan korporat.'
                  : language === 'en' ? 'Implementation of Environmental, Social, and Governance (ESG) as the foundation of corporate sustainability strategy.'
                  : '实施环境、社会和治理 (ESG) 作为企业可持续发展战略的基石。'
                }
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {esgInitiatives.map((initiative, index) => (
              <ScrollReveal key={index} delay={index * 0.1}>
                <div className="card-enterprise p-6 text-center group">
                  <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-green-600 group-hover:bg-green-600 group-hover:text-white transition-colors">
                    {initiative.icon}
                  </div>
                  <h3 className="font-black text-lg tracking-tight mb-3">{initiative.title}</h3>
                  <p className="text-muted-foreground text-sm mb-4 leading-relaxed">{initiative.description}</p>
                  <div className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                    {initiative.metrics}
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Mining Reclamation */}
      <section className="section-padding bg-secondary">
        <div className="container-enterprise">
          <ScrollReveal>
            <div className="text-center mb-16">
              <div className="w-16 h-16 bg-accent rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Factory className="w-8 h-8 text-accent-foreground" />
              </div>
              <h2 className="heading-section text-foreground mb-4">
                {language === 'id' ? 'Reklamasi & Restorasi Tambang' : language === 'en' ? 'Mining Reclamation & Restoration' : '矿区复垦与修复'}
              </h2>
              <p className="text-body-large max-w-3xl mx-auto">
                {language === 'id'
                  ? 'Program rehabilitasi lahan pasca-tambang untuk mengembalikan fungsi ekologis dan manfaat sosial.'
                  : language === 'en' ? 'Post-mining land rehabilitation program to restore ecological functions and social benefits.'
                  : '矿后土地修复计划，旨在恢复生态功能和社会效益。'
                }
              </p>
            </div>
          </ScrollReveal>

          <div className="grid lg:grid-cols-2 gap-8">
            {reclamationProjects.map((project, index) => (
              <ScrollReveal key={index} delay={index * 0.1}>
                <div className="card-enterprise p-8">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <TreePine className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-black text-xl tracking-tight mb-2">{project.title}</h3>
                      <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mb-3">
                        <span className="flex items-center gap-1">
                          <Leaf className="w-4 h-4" />
                          {project.location}
                        </span>
                        <span>{project.area}</span>
                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                          {project.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">{project.description}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding">
        <div className="container-enterprise">
          <ScrollReveal>
            <div className="card-enterprise p-12 text-center bg-gradient-to-br from-green-50 to-emerald-50 border-green-100">
              <Target className="w-16 h-16 text-green-600 mx-auto mb-6" />
              <h2 className="heading-section text-foreground mb-4">
                {language === 'id' ? 'Bergabung dalam Perjalanan Hijau Kami' : language === 'en' ? 'Join Our Green Journey' : '加入我们的绿色旅程'}
              </h2>
              <p className="text-body-large max-w-2xl mx-auto mb-8">
                {language === 'id'
                  ? 'Mari bersama-sama membangun industri semen yang berkelanjutan dan bertanggung jawab secara lingkungan.'
                  : language === 'en' ? 'Let\'s together build a sustainable and environmentally responsible cement industry.'
                  : '让我们共同建设一个可持续且对环境负责的水泥行业。'
                }
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link to="/kontak">
                  <Button className="btn-accent btn-enterprise">
                    {language === 'id' ? 'Diskusikan Proyek Hijau' : language === 'en' ? 'Discuss Green Projects' : '讨论绿色项目'}
                  </Button>
                </Link>
                <Link to="/download">
                  <Button className="btn-outline btn-enterprise">
                    {language === 'id' ? 'Unduh Laporan Keberlanjutan' : language === 'en' ? 'Download Sustainability Report' : '下载可持续发展报告'}
                  </Button>
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </Layout>
  );
};

export default SustainabilityPage;