import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, GraduationCap, Home, Droplets, TreePine, Users, Award, Target, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import ScrollReveal from '@/components/ui/scroll-reveal';

const CSRPage: React.FC = () => {
  const { language } = useLanguage();

  const csrPillars = [
    {
      icon: <GraduationCap className="w-8 h-8" />,
      title: language === 'id' ? 'Pendidikan' : 'Education',
      description: language === 'id'
        ? 'Program beasiswa, pengembangan sekolah, dan pelatihan vokasi untuk meningkatkan kualitas sumber daya manusia lokal.'
        : 'Scholarship programs, school development, and vocational training to improve local human resource quality.',
      impact: language === 'id' ? '5,000+ Penerima Manfaat' : '5,000+ Beneficiaries',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: language === 'id' ? 'Kesehatan' : 'Healthcare',
      description: language === 'id'
        ? 'Fasilitas kesehatan masyarakat, program kesehatan preventif, dan bantuan medis untuk daerah terpencil.'
        : 'Community health facilities, preventive health programs, and medical assistance for remote areas.',
      impact: language === 'id' ? '50+ Fasilitas Kesehatan' : '50+ Health Facilities',
      color: 'from-red-500 to-red-600'
    },
    {
      icon: <Home className="w-8 h-8" />,
      title: language === 'id' ? 'Pemberdayaan Ekonomi' : 'Economic Empowerment',
      description: language === 'id'
        ? 'Pelatihan kewirausahaan, pengembangan UMKM, dan program kemitraan untuk meningkatkan kesejahteraan masyarakat.'
        : 'Entrepreneurship training, SME development, and partnership programs to improve community welfare.',
      impact: language === 'id' ? '1,200+ UMKM Dibina' : '1,200+ SMEs Developed',
      color: 'from-green-500 to-green-600'
    },
    {
      icon: <Droplets className="w-8 h-8" />,
      title: language === 'id' ? 'Air Bersih & Sanitasi' : 'Clean Water & Sanitation',
      description: language === 'id'
        ? 'Pembangunan infrastruktur air bersih, program sanitasi, dan konservasi sumber daya air berkelanjutan.'
        : 'Clean water infrastructure development, sanitation programs, and sustainable water resource conservation.',
      impact: language === 'id' ? '100+ Desa Terlayani' : '100+ Villages Served',
      color: 'from-cyan-500 to-cyan-600'
    }
  ];

  const featuredPrograms = [
    {
      title: language === 'id' ? 'Semen Nusantara Mengajar' : 'Semen Nusantara Teaches',
      category: language === 'id' ? 'Pendidikan' : 'Education',
      description: language === 'id'
        ? 'Program pengabdian guru profesional ke daerah terpencil dengan fokus pada STEM dan literasi digital.'
        : 'Professional teacher dedication program to remote areas focusing on STEM and digital literacy.',
      location: language === 'id' ? 'Papua, NTT, Maluku' : 'Papua, NTT, Maluku',
      beneficiaries: language === 'id' ? '2,500 Guru & Siswa' : '2,500 Teachers & Students',
      image: 'education'
    },
    {
      title: language === 'id' ? 'Klinik Sehat Bergerak' : 'Mobile Health Clinic',
      category: language === 'id' ? 'Kesehatan' : 'Healthcare',
      description: language === 'id'
        ? 'Layanan kesehatan bergerak yang melayani masyarakat di sekitar area operasional pabrik.'
        : 'Mobile health services serving communities around factory operational areas.',
      location: language === 'id' ? 'Jawa Barat, Jawa Tengah' : 'West Java, Central Java',
      beneficiaries: language === 'id' ? '15,000 Pasien/Tahun' : '15,000 Patients/Year',
      image: 'health'
    },
    {
      title: language === 'id' ? 'Wirausaha Muda Mandiri' : 'Young Independent Entrepreneurs',
      category: language === 'id' ? 'Ekonomi' : 'Economic',
      description: language === 'id'
        ? 'Program inkubasi bisnis untuk pemuda dengan pendampingan intensif dan akses permodalan.'
        : 'Business incubation program for youth with intensive mentoring and capital access.',
      location: language === 'id' ? 'Seluruh Indonesia' : 'Nationwide',
      beneficiaries: language === 'id' ? '500+ Wirausaha Muda' : '500+ Young Entrepreneurs',
      image: 'business'
    }
  ];

  const impactMetrics = [
    {
      number: 'Rp 150 Miliar',
      label: language === 'id' ? 'Investasi CSR Total' : 'Total CSR Investment',
      description: language === 'id' ? 'Sejak 2020' : 'Since 2020'
    },
    {
      number: '500+',
      label: language === 'id' ? 'Program CSR' : 'CSR Programs',
      description: language === 'id' ? 'Di 15 Provinsi' : 'In 15 Provinces'
    },
    {
      number: '1 Juta+',
      label: language === 'id' ? 'Penerima Manfaat' : 'Beneficiaries',
      description: language === 'id' ? 'Masyarakat Terbantu' : 'People Helped'
    },
    {
      number: '95%',
      label: language === 'id' ? 'Kepuasan Masyarakat' : 'Community Satisfaction',
      description: language === 'id' ? 'Berdasarkan Survei' : 'Based on Survey'
    }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-32" style={{ background: 'linear-gradient(135deg, hsl(28 65% 45%) 0%, hsl(28 75% 55%) 50%, hsl(220 25% 18%) 100%)' }}>
        <div className="container-enterprise">
          <ScrollReveal>
            <div className="max-w-4xl text-center">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Heart className="w-10 h-10 text-white" />
              </div>
              <h1 className="heading-hero text-white mb-6">
                {language === 'id' ? 'Tanggung Jawab Sosial' : 'Corporate Social Responsibility'}
              </h1>
              <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
                {language === 'id'
                  ? 'Komitmen kami untuk menciptakan dampak positif berkelanjutan bagi masyarakat melalui program pemberdayaan yang terukur dan berkelanjutan.'
                  : 'Our commitment to creating sustainable positive impact for communities through measurable and sustainable empowerment programs.'
                }
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link to="/kontak">
                  <Button className="bg-white text-accent hover:bg-white/90 btn-enterprise">
                    <Users className="w-4 h-4 mr-2" />
                    {language === 'id' ? 'Ajukan Kolaborasi' : 'Propose Partnership'}
                  </Button>
                </Link>
                <Link to="/download">
                  <Button className="btn-outline border-white text-white hover:bg-white hover:text-accent btn-enterprise">
                    <Award className="w-4 h-4 mr-2" />
                    {language === 'id' ? 'Laporan CSR' : 'CSR Report'}
                  </Button>
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Impact Metrics */}
      <section className="section-padding">
        <div className="container-enterprise">
          <ScrollReveal>
            <div className="text-center mb-16">
              <Target className="w-16 h-16 text-accent mx-auto mb-4" />
              <h2 className="heading-section text-foreground mb-4">
                {language === 'id' ? 'Dampak Nyata' : 'Real Impact'}
              </h2>
              <p className="text-body-large max-w-3xl mx-auto">
                {language === 'id'
                  ? 'Kontribusi nyata kami terhadap pembangunan masyarakat dan lingkungan di seluruh area operasional.'
                  : 'Our tangible contributions to community development and environment across all operational areas.'
                }
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {impactMetrics.map((metric, index) => (
              <ScrollReveal key={index} delay={index * 0.1}>
                <div className="card-enterprise p-6 text-center">
                  <div className="text-3xl font-black stat-number text-accent mb-2">{metric.number}</div>
                  <div className="text-sm text-muted-foreground mb-1">{metric.label}</div>
                  <div className="text-xs text-muted-foreground">{metric.description}</div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CSR Pillars */}
      <section className="section-padding bg-secondary">
        <div className="container-enterprise">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="heading-section text-foreground mb-4">
                {language === 'id' ? 'Pilar Program CSR' : 'CSR Program Pillars'}
              </h2>
              <p className="text-body-large max-w-3xl mx-auto">
                {language === 'id'
                  ? 'Empat pilar utama yang menjadi fokus investasi sosial kami untuk menciptakan nilai berkelanjutan.'
                  : 'Four main pillars that focus our social investment to create sustainable value.'
                }
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 gap-8">
            {csrPillars.map((pillar, index) => (
              <ScrollReveal key={index} delay={index * 0.1}>
                <div className="card-enterprise p-8 group hover:shadow-lg transition-all duration-300">
                  <div className="flex items-start gap-4">
                    <div className={`w-16 h-16 bg-gradient-to-br ${pillar.color} rounded-2xl flex items-center justify-center flex-shrink-0 text-white group-hover:scale-110 transition-transform`}>
                      {pillar.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-black text-xl tracking-tight mb-3">{pillar.title}</h3>
                      <p className="text-muted-foreground text-sm mb-4 leading-relaxed">{pillar.description}</p>
                      <div className="inline-flex items-center px-3 py-1 bg-accent/10 text-accent rounded-full text-sm font-medium">
                        {pillar.impact}
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Programs */}
      <section className="section-padding">
        <div className="container-enterprise">
          <ScrollReveal>
            <div className="text-center mb-16">
              <Award className="w-16 h-16 text-accent mx-auto mb-4" />
              <h2 className="heading-section text-foreground mb-4">
                {language === 'id' ? 'Program Unggulan' : 'Featured Programs'}
              </h2>
              <p className="text-body-large max-w-3xl mx-auto">
                {language === 'id'
                  ? 'Program-program inovatif yang telah terbukti menciptakan dampak signifikan bagi masyarakat.'
                  : 'Innovative programs that have proven to create significant impact for communities.'
                }
              </p>
            </div>
          </ScrollReveal>

          <div className="grid lg:grid-cols-3 gap-8">
            {featuredPrograms.map((program, index) => (
              <ScrollReveal key={index} delay={index * 0.1}>
                <div className="card-enterprise overflow-hidden group hover:shadow-lg transition-all duration-300">
                  <div className="h-48 bg-gradient-to-br from-accent/20 to-accent/10 flex items-center justify-center">
                    <div className="w-16 h-16 bg-accent/30 rounded-2xl flex items-center justify-center text-accent group-hover:scale-110 transition-transform">
                      {program.category === (language === 'id' ? 'Pendidikan' : 'Education') && <GraduationCap className="w-8 h-8" />}
                      {program.category === (language === 'id' ? 'Kesehatan' : 'Healthcare') && <Heart className="w-8 h-8" />}
                      {program.category === (language === 'id' ? 'Ekonomi' : 'Economic') && <Home className="w-8 h-8" />}
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-2 py-1 bg-accent/10 text-accent rounded-full text-xs font-medium">
                        {program.category}
                      </span>
                    </div>
                    <h3 className="font-black text-lg tracking-tight mb-3 group-hover:text-accent transition-colors">
                      {program.title}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4 leading-relaxed">{program.description}</p>
                    <div className="space-y-2 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <TreePine className="w-3 h-3" />
                        {program.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {program.beneficiaries}
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-secondary">
        <div className="container-enterprise">
          <ScrollReveal>
            <div className="card-enterprise p-12 text-center bg-gradient-to-br from-accent/5 to-accent/10 border-accent/20">
              <Heart className="w-16 h-16 text-accent mx-auto mb-6" />
              <h2 className="heading-section text-foreground mb-4">
                {language === 'id' ? 'Bergabung dalam Misi Sosial Kami' : 'Join Our Social Mission'}
              </h2>
              <p className="text-body-large max-w-2xl mx-auto mb-8">
                {language === 'id'
                  ? 'Mari bersama-sama menciptakan perubahan positif yang berkelanjutan untuk masyarakat Indonesia.'
                  : 'Let\'s together create sustainable positive change for Indonesian communities.'
                }
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link to="/kontak">
                  <Button className="btn-accent btn-enterprise">
                    {language === 'id' ? 'Ajukan Proposal CSR' : 'Submit CSR Proposal'}
                  </Button>
                </Link>
                <Link to="/download">
                  <Button className="btn-outline btn-enterprise">
                    {language === 'id' ? 'Unduh Panduan Kerja Sama' : 'Download Partnership Guide'}
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

export default CSRPage;
