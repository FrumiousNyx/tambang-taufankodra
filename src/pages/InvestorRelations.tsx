import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Building2, TrendingUp, FileText, Shield, Users, Award, Download } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ScrollReveal from '@/components/ui/scroll-reveal';

const InvestorRelationsPage: React.FC = () => {
  const { language } = useLanguage();
  const [selectedYear, setSelectedYear] = useState('2024');

  const governanceStructure = [
    {
      title: language === 'id' ? 'Dewan Komisaris' : language === 'en' ? 'Board of Commissioners' : '董事会',
      description: language === 'id'
        ? 'Pengawasan strategis dan independen terhadap manajemen untuk melindungi kepentingan seluruh stakeholder.'
        : language === 'en' ? 'Strategic and independent oversight of management to protect the interests of all stakeholders.'
        : '对管理层进行战略性和独立的监督，以保护所有利益相关者的利益。',
      members: language === 'id' ? '7 Komisaris' : language === 'en' ? '7 Commissioners' : '7名专员'
    },
    {
      title: language === 'id' ? 'Dewan Direksi' : language === 'en' ? 'Board of Directors' : '董事会执行委员会',
      description: language === 'id'
        ? 'Eksekutif berpengalaman yang bertanggung jawab atas operasional harian dan strategi perusahaan.'
        : language === 'en' ? 'Experienced executives responsible for daily operations and company strategy.'
        : '负责日常运营和公司战略的有经验的高管。',
      members: language === 'id' ? '5 Direktur' : language === 'en' ? '5 Directors' : '5名董事'
    },
    {
      title: language === 'id' ? 'Komite Audit' : language === 'en' ? 'Audit Committee' : '审计委员会',
      description: language === 'id'
        ? 'Memastikan integritas keuangan dan kepatuhan terhadap regulasi serta standar akuntansi.'
        : language === 'en' ? 'Ensuring financial integrity and compliance with regulations and accounting standards.'
        : '确保财务完整性并遵守法规和会计标准。',
      members: language === 'id' ? '3 Anggota' : language === 'en' ? '3 Members' : '3名成员'
    },
    {
      title: language === 'id' ? 'Komite Nominasi & Remunerasi' : language === 'en' ? 'Nomination & Remuneration Committee' : '提名与薪酬委员会',
      description: language === 'id'
        ? 'Menilai kinerja dan menentukan kompensasi yang sejalan dengan prinsip good governance.'
        : language === 'en' ? 'Assessing performance and determining compensation aligned with good governance principles.'
        : '评估业绩并确定符合良好治理原则的薪酬。',
      members: language === 'id' ? '3 Anggota' : language === 'en' ? '3 Members' : '3名成员'
    }
  ];

  const financialHighlights = [
    {
      metric: language === 'id' ? 'Pendapatan' : language === 'en' ? 'Revenue' : '总收入',
      value: 'Rp 15.2 Triliun',
      change: '+12.5%',
      positive: true
    },
    {
      metric: language === 'id' ? 'Lab Bersih' : language === 'en' ? 'Net Profit' : '净利润',
      value: 'Rp 2.1 Triliun',
      change: '+18.3%',
      positive: true
    },
    {
      metric: language === 'id' ? 'EBITDA' : 'EBITDA',
      value: 'Rp 3.8 Triliun',
      change: '+15.7%',
      positive: true
    },
    {
      metric: language === 'id' ? 'ROE' : 'ROE',
      value: '18.5%',
      change: '+2.1%',
      positive: true
    }
  ];

  const annualReports = [
    {
      year: '2024',
      title: language === 'id' ? 'Laporan Tahunan 2024' : language === 'en' ? 'Annual Report 2024' : '2024年度报告',
      description: language === 'id'
        ? 'Transformasi Digital dan Keberlanjutan: Membangun Masa Depan Industri Semen'
        : language === 'en' ? 'Digital Transformation and Sustainability: Building the Future of Cement Industry'
        : '数字化转型与可持续发展：构建水泥行业的未来',
      size: '12.5 MB',
      format: 'PDF',
      urlZh: '/downloads/zh/annual-report-2024.pdf'
    },
    {
      year: '2023',
      title: language === 'id' ? 'Laporan Tahunan 2023' : language === 'en' ? 'Annual Report 2023' : '2023年度报告',
      description: language === 'id'
        ? 'Resiliensi dan Inovasi: Strategi Pertumbuhan Berkelanjutan'
        : language === 'en' ? 'Resilience and Innovation: Sustainable Growth Strategy'
        : '韧性与创新：可持续增长战略',
      size: '11.8 MB',
      format: 'PDF',
      urlZh: '/downloads/zh/annual-report-2023.pdf'
    },
    {
      year: '2022',
      title: language === 'id' ? 'Laporan Tahunan 2022' : language === 'en' ? 'Annual Report 2022' : '2022年度报告',
      description: language === 'id'
        ? 'Kepemimpinan Industri: Menuju Net Zero Emissions 2050'
        : language === 'en' ? 'Industry Leadership: Towards Net Zero Emissions 2050'
        : '行业领导地位：迈向2050年净零排放',
      size: '10.9 MB',
      format: 'PDF',
      urlZh: '/downloads/zh/annual-report-2022.pdf'
    }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-32" style={{ background: 'var(--gradient-hero)' }}>
        <div className="container-enterprise">
          <ScrollReveal>
            {/* PERBAIKAN: Menambahkan flex flex-col items-center dan mx-auto */}
            <div className="max-w-4xl flex flex-col items-center text-center mx-auto">
              <div className="w-20 h-20 bg-accent/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6">
                <Building2 className="w-10 h-10 text-accent" />
              </div>
              <h1 className="heading-hero text-primary-foreground mb-6">
                {language === 'id' ? 'Hubungan Investor' : language === 'en' ? 'Investor Relations' : '投资者关系'}
              </h1>
              <p className="text-xl text-primary-foreground/90 mb-8 max-w-3xl">
                {language === 'id'
                  ? 'Transparansi dan akuntabilitas sebagai fondasi kepercayaan investor. Kami menyediakan informasi komprehensif untuk mendukung keputusan investasi yang tepat.'
                  : language === 'en' ? 'Transparency and accountability as the foundation of investor confidence. We provide comprehensive information to support informed investment decisions.'
                  : '透明度合规性是投资者信任的基石。我们提供全面的信息以支持明智的投资决策。'
                }
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Button className="btn-accent btn-enterprise">
                  <Download className="w-4 h-4 mr-2" />
                  {language === 'id' ? 'Laporan Tahunan 2024' : language === 'en' ? '2024 Annual Report' : '2024年度报告'}
                </Button>
                <Link to="/kontak">
                  <Button className="btn-outline border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground hover:text-primary btn-enterprise">
                    {language === 'id' ? 'Hubungi IR' : language === 'en' ? 'Contact IR' : '联系投资者关系'}
                  </Button>
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Financial Highlights */}
      <section className="section-padding">
        <div className="container-enterprise">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="heading-section text-foreground mb-4">
                {language === 'id' ? 'Kinerja Keuangan' : language === 'en' ? 'Financial Performance' : '财务业绩'}
              </h2>
              <p className="text-body-large max-w-3xl mx-auto">
                {language === 'id'
                  ? 'Pertumbuhan berkelanjutan didukung oleh efisiensi operasional dan ekspansi pasar yang strategis.'
                  : language === 'en' ? 'Sustainable growth supported by operational efficiency and strategic market expansion.'
                  : '通过运营效率和战略市场扩张支持的可持续增长。'
                }
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {financialHighlights.map((item, index) => (
              <ScrollReveal key={index} delay={index * 0.1}>
                <div className="card-enterprise p-6 text-center">
                  <div className="text-3xl font-black text-accent mb-2">{item.value}</div>
                  <div className="text-sm text-muted-foreground mb-2">{item.metric}</div>
                  <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    item.positive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    <TrendingUp className="w-3 h-3 mr-1" />
                    {item.change}
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Governance & Reports */}
      <section className="section-padding bg-secondary">
        <div className="container-enterprise">
          <ScrollReveal>
            <div className="text-center mb-16">
              <Shield className="w-16 h-16 text-accent mx-auto mb-4" />
              <h2 className="heading-section text-foreground mb-4">
                {language === 'id' ? 'Tata Kelola & Laporan' : language === 'en' ? 'Governance & Reports' : '治理与报告'}
              </h2>
              <p className="text-body-large max-w-3xl mx-auto">
                {language === 'id'
                  ? 'Praktik Good Corporate Governance (GCG) dan transparansi pelaporan untuk kepercayaan stakeholder.'
                  : language === 'en' ? 'Good Corporate Governance (GCG) practices and reporting transparency for stakeholder confidence.'
                  : '良好的公司治理 (GCG) 实践和报告透明度，以赢得利益相关者的信任。'
                }
              </p>
            </div>
          </ScrollReveal>

          <Tabs defaultValue="governance" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-12">
              <TabsTrigger value="governance">
                {language === 'id' ? 'Struktur GCG' : language === 'en' ? 'GCG Structure' : '公司治理结构'}
              </TabsTrigger>
              <TabsTrigger value="reports">
                {language === 'id' ? 'Laporan Tahunan' : language === 'en' ? 'Annual Reports' : '年度报告'}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="governance">
              <div className="grid md:grid-cols-2 gap-8">
                {governanceStructure.map((item, index) => (
                  <ScrollReveal key={index} delay={index * 0.1}>
                    <div className="card-enterprise p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center flex-shrink-0">
                          <Shield className="w-6 h-6 text-accent" />
                        </div>
                        <div>
                          <h3 className="font-black text-lg tracking-tight mb-2">{item.title}</h3>
                          <p className="text-muted-foreground text-sm mb-3 leading-relaxed">{item.description}</p>
                          <div className="inline-flex items-center px-3 py-1 bg-accent/10 text-accent rounded-full text-sm font-medium">
                            {item.members}
                          </div>
                        </div>
                      </div>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="reports">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {annualReports.map((report, index) => (
                  <ScrollReveal key={index} delay={index * 0.1}>
                    <div className="card-enterprise p-6 hover:shadow-lg transition-all duration-300 group">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
                          <FileText className="w-6 h-6 text-accent group-hover:text-accent-foreground" />
                        </div>
                        <div className="flex-1">
                          <div className="text-sm text-accent font-medium mb-2">{report.year}</div>
                          <h3 className="font-black text-lg tracking-tight mb-2 group-hover:text-accent transition-colors">
                            {report.title}
                          </h3>
                          <p className="text-muted-foreground text-sm mb-4 leading-relaxed">{report.description}</p>
                          <div className="flex items-center justify-between">
                            <div className="text-xs text-muted-foreground">
                              {report.format} • {report.size}
                            </div>
                            <Button size="sm" className="btn-accent">
                              <Download className="w-4 h-4 mr-1" />
                              {language === 'id' ? 'Unduh' : language === 'en' ? 'Download' : '下载'}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </Layout>
  );
};

export default InvestorRelationsPage;