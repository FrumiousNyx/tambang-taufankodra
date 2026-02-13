import React from 'react';
import { Target, Eye, Heart, Award, Users, Factory, Leaf, Shield, History } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import Layout from '@/components/layout/Layout';
import ScrollReveal from '@/components/ui/scroll-reveal';

const AboutPage: React.FC = () => {
  const { t, language } = useLanguage();

  const values = [
    {
      icon: Shield,
      title: t('about.quality'),
      description: t('about.qualityDesc'),
    },
    {
      icon: Users,
      title: t('about.integrity'),
      description: t('about.integrityDesc'),
    },
    {
      icon: Leaf,
      title: t('about.sustainability'),
      description: t('about.sustainabilityDesc'),
    },
    {
      icon: Award,
      title: t('about.innovation'),
      description: t('about.innovationDesc'),
    },
  ];

  const milestones = [
    {
      year: '1995',
      title: language === 'id' ? 'Pendirian Perusahaan' : language === 'en' ? 'Company Establishment' : '公司成立',
      description: language === 'id' 
        ? 'PT Semen Nusantara didirikan dengan visi menjadi produsen semen terkemuka di Indonesia. Memulai operasional dengan pabrik pertama di Jawa Barat dengan kapasitas produksi 500.000 ton per tahun.'
        : language === 'en' 
        ? 'PT Semen Nusantara was established with the vision to become a leading cement producer in Indonesia. Started operations with the first plant in West Java with a production capacity of 500,000 tons per year.'
        : 'PT Semen Nusantara成立，愿景成为印度尼西亚领先的水泥生产商。在西爪哇启动第一个工厂运营，年产能50万吨。'
    },
    {
      year: '2000',
      title: language === 'id' ? 'Ekspansi Pasar' : language === 'en' ? 'Market Expansion' : '市场扩张',
      description: language === 'id'
        ? 'Melakukan ekspansi ke pasar regional Jawa dan Sumatera. Mendapatkan sertifikasi ISO 9001 untuk sistem manajemen mutu dan memperkenalkan produk OPC (Ordinary Portland Cement).'
        : language === 'en'
        ? 'Expanded to Java and Sumatra regional markets. Obtained ISO 9001 certification for quality management system and introduced OPC (Ordinary Portland Cement) products.'
        : '扩张到爪哇和苏门答腊区域市场。获得ISO 9001质量管理体系认证，并推出OPC（普通硅酸盐水泥）产品。'
    },
    {
      year: '2005',
      title: language === 'id' ? 'Inovasi Produk' : language === 'en' ? 'Product Innovation' : '产品创新',
      description: language === 'id'
        ? 'Meluncurkan produk PCC (Portland Composite Cement) yang lebih ramah lingkungan. Berinvestasi dalam teknologi produksi modern untuk mengurangi emisi karbon hingga 20%.'
        : language === 'en'
        ? 'Launched PCC (Portland Composite Cement) products that are more environmentally friendly. Invested in modern production technology to reduce carbon emissions by up to 20%.'
        : '推出更环保的PCC（复合硅酸盐水泥）产品。投资现代化生产技术，将碳排放减少20%。'
    },
    {
      year: '2010',
      title: language === 'id' ? 'Sertifikasi Internasional' : language === 'en' ? 'International Certification' : '国际认证',
      description: language === 'id'
        ? 'Mendapatkan sertifikasi ISO 14001 untuk sistem manajemen lingkungan. Memulai ekspor ke negara ASEAN seperti Malaysia, Singapura, dan Filipina.'
        : language === 'en'
        ? 'Obtained ISO 14001 certification for environmental management system. Started exporting to ASEAN countries such as Malaysia, Singapore, and the Philippines.'
        : '获得ISO 14001环境管理体系认证。开始向马来西亚、新加坡和菲律宾等东盟国家出口。'
    },
    {
      year: '2015',
      title: language === 'id' ? 'Diversifikasi Produk' : language === 'en' ? 'Product Diversification' : '产品多元化',
      description: language === 'id'
        ? 'Meluncurkan produk SRPC (Sulfate Resistant Portland Cement) untuk proyek konstruksi khusus. Mendapatkan penghargaan "Green Industry" dari Kementerian Perindustrian.'
        : language === 'en'
        ? 'Launched SRPC (Sulfate Resistant Portland Cement) for special construction projects. Received "Green Industry" award from the Ministry of Industry.'
        : '推出SRPC（抗硫酸盐硅酸盐水泥）用于特殊建筑项目。获得工业部颁发的"绿色工业"奖。'
    },
    {
      year: '2018',
      title: language === 'id' ? 'Transformasi Digital' : language === 'en' ? 'Digital Transformation' : '数字化转型',
      description: language === 'id'
        ? 'Meluncurkan sistem manajemen terintegrasi dan platform e-commerce. Mengimplementasikan teknologi Industry 4.0 untuk meningkatkan efisiensi produksi.'
        : language === 'en'
        ? 'Launched integrated management system and e-commerce platform. Implemented Industry 4.0 technology to improve production efficiency.'
        : '推出综合管理系统和电子商务平台。实施工业4.0技术以提高生产效率。'
    },
    {
      year: '2020',
      title: language === 'id' ? 'Program Keberlanjutan' : language === 'en' ? 'Sustainability Program' : '可持续发展计划',
      description: language === 'id'
        ? 'Meluncurkan program "Semen Hijau" dengan target netral karbon 2030. Mengimplementasikan sistem pengelolaan limbah nol dan menggunakan energi terbarukan.'
        : language === 'en'
        ? 'Launched "Green Cement" program with 2030 carbon neutrality target. Implemented zero waste management system and renewable energy usage.'
        : '启动"绿色水泥"计划，目标2030年实现碳中和。实施零废物管理系统和使用可再生能源。'
    },
    {
      year: '2023',
      title: language === 'id' ? 'Ekspansi Regional' : language === 'en' ? 'Regional Expansion' : '区域扩张',
      description: language === 'id'
        ? 'Membangun pabrik baru di Kalimantan dengan kapasitas 1 juta ton per tahun. Menjadi mitra strategis untuk proyek infrastruktur nasional seperti Ibu Kota Nusantara.'
        : language === 'en'
        ? 'Built new plant in Kalimantan with 1 million tons per year capacity. Became strategic partner for national infrastructure projects such as the new capital city.'
        : '在加里曼丹建设新工厂，年产能100万吨。成为新首都等国家基础设施项目的战略合作伙伴。'
    },
    {
      year: '2024',
      title: language === 'id' ? 'Inovasi Teknologi' : language === 'en' ? 'Technology Innovation' : '技术创新',
      description: language === 'id'
        ? 'Meluncurkan produk semen dengan teknologi carbon capture. Mendapatkan investasi dari perusahaan teknologi global untuk pengembangan green technology.'
        : language === 'en'
        ? 'Launched cement products with carbon capture technology. Received investment from global technology companies for green technology development.'
        : '推出具有碳捕获技术的水泥产品。获得全球技术公司的绿色技术开发投资。'
    }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-32" style={{ background: 'var(--gradient-hero)' }}>
        <div className="container-enterprise">
          <ScrollReveal>
            <div className="max-w-4xl flex flex-col items-center text-center mx-auto">
              <h1 className="heading-hero text-primary-foreground mb-6">
                {language === 'id' ? 'Membangun Masa Depan' : language === 'en' ? 'Building the Future' : '共建未来'}
              </h1>
              <p className="text-xl text-primary-foreground/90 max-w-3xl">
                {language === 'id' 
                  ? 'Menjadi pemimpin industri semen yang inovatif dan berkelanjutan di Asia Tenggara.' 
                  : language === 'en' ? 'To be an innovative and sustainable cement industry leader in Southeast Asia.'
                  : '成为东南亚创新且可持续的水泥行业领导者。'}
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="section-padding">
        <div className="container-enterprise">
          <div className="grid md:grid-cols-2 gap-12">
            <ScrollReveal>
              <div className="card-enterprise p-8 bg-secondary h-full">
                <Target className="w-12 h-12 text-accent mb-6" />
                <h2 className="text-3xl font-black mb-4">{language === 'id' ? 'Visi' : language === 'en' ? 'Vision' : '愿景'}</h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {language === 'id' 
                    ? 'Menjadi penyedia solusi bahan bangunan terkemuka yang ramah lingkungan dan inovatif.'
                    : language === 'en' ? 'To be a leading provider of innovative and eco-friendly building material solutions.'
                    : '成为领先的创新环保建材解决方案供应商。'}
                </p>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={0.2}>
              <div className="card-enterprise p-8 border-accent/20 h-full">
                <Eye className="w-12 h-12 text-accent mb-6" />
                <h2 className="text-3xl font-black mb-4">{language === 'id' ? 'Misi' : language === 'en' ? 'Mission' : '使命'}</h2>
                <ul className="space-y-4 text-muted-foreground">
                  <li className="flex gap-3">
                    <div className="mt-1.5 w-2 h-2 rounded-full bg-accent shrink-0" />
                    {language === 'id' ? 'Menyediakan produk berkualitas tinggi' : language === 'en' ? 'Providing high-quality products' : '提供高品质产品'}
                  </li>
                  <li className="flex gap-3">
                    <div className="mt-1.5 w-2 h-2 rounded-full bg-accent shrink-0" />
                    {language === 'id' ? 'Mengutamakan keberlanjutan lingkungan' : language === 'en' ? 'Prioritizing environmental sustainability' : '优先考虑环境可持续性'}
                  </li>
                  <li className="flex gap-3">
                    <div className="mt-1.5 w-2 h-2 rounded-full bg-accent shrink-0" />
                    {language === 'id' ? 'Mendorong inovasi teknologi' : language === 'en' ? 'Driving technological innovation' : '驱动技术创新'}
                  </li>
                </ul>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding bg-secondary">
        <div className="container-enterprise">
          <h2 className="heading-section text-center mb-16">
            {language === 'id' ? 'Nilai Perusahaan' : language === 'en' ? 'Corporate Values' : '企业价值'}
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <ScrollReveal key={index} delay={index * 0.1}>
                <div className="text-center">
                  <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <value.icon className="w-8 h-8 text-accent" />
                  </div>
                  <h3 className="font-black text-xl mb-3">{value.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{value.description}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* History */}
      <section className="section-padding">
        <div className="container-enterprise">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-12">
              <History className="w-10 h-10 text-accent" />
              <h2 className="text-4xl font-black">{language === 'id' ? 'Perjalanan Kami' : language === 'en' ? 'Our Journey' : '我们的历程'}</h2>
            </div>
            <div className="space-y-16 relative before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-0.5 before:bg-accent/20">
              {milestones.map((milestone, index) => (
                <ScrollReveal key={index} delay={index * 0.1}>
                  <div className="relative pl-12">
                    <div className="absolute left-0 top-2 w-10 h-10 bg-white border-4 border-accent rounded-full flex items-center justify-center z-10" />
                    <div className="mb-3">
                      <div className="text-accent font-black text-xl mb-2">{milestone.year}</div>
                      <h3 className="text-2xl font-bold text-foreground mb-3">{milestone.title}</h3>
                    </div>
                    <p className="text-lg text-muted-foreground leading-relaxed">{milestone.description}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default AboutPage;