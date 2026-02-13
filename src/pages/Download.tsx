import React, { useState } from 'react';
import { FileText, Download, Lock, CheckCircle, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { toast } from 'sonner';
import ScrollReveal from '@/components/ui/scroll-reveal';

const documents = [
  {
    id: 1,
    title: 'Brosur Produk Lengkap',
    titleEn: 'Complete Product Brochure',
    titleZh: '完整产品手册',
    description: 'Katalog lengkap semua produk semen dengan spesifikasi teknis.',
    descriptionEn: 'Complete catalog of all cement products with technical specifications.',
    descriptionZh: '包含所有水泥产品技术规格的完整目录。',
    type: 'PDF',
    size: '4.2 MB',
    icon: FileText,
  },
  {
    id: 2,
    title: 'Datasheet Teknis PCC',
    titleEn: 'PCC Technical Datasheet',
    titleZh: 'PCC 技术参数表',
    description: 'Spesifikasi detail Portland Composite Cement.',
    descriptionEn: 'Detailed specifications of Portland Composite Cement.',
    descriptionZh: '波特兰复合水泥的详细规格。',
    type: 'PDF',
    size: '1.8 MB',
    icon: FileText,
  },
  {
    id: 3,
    title: 'Datasheet Teknis OPC',
    titleEn: 'OPC Technical Datasheet',
    titleZh: 'OPC 技术参数表',
    description: 'Spesifikasi detail Ordinary Portland Cement.',
    descriptionEn: 'Detailed specifications of Ordinary Portland Cement.',
    descriptionZh: '普通波特兰水泥的详细规格。',
    type: 'PDF',
    size: '1.6 MB',
    icon: FileText,
  },
  {
    id: 4,
    title: 'Datasheet Teknis SRPC',
    titleEn: 'SRPC Technical Datasheet',
    titleZh: 'SRPC 技术参数表',
    description: 'Spesifikasi detail Sulfate Resistant Portland Cement.',
    descriptionEn: 'Detailed specifications of Sulfate Resistant Portland Cement.',
    descriptionZh: '抗硫酸盐波特兰水泥的详细规格。',
    type: 'PDF',
    size: '1.9 MB',
    icon: FileText,
  },
  {
    id: 5,
    title: 'Profil Perusahaan',
    titleEn: 'Company Profile',
    titleZh: '公司简介',
    description: 'Informasi lengkap tentang PT Semen Nusantara.',
    descriptionEn: 'Complete information about PT Semen Nusantara.',
    descriptionZh: '关于 PT Semen Nusantara 的完整信息。',
    type: 'PDF',
    size: '8.5 MB',
    icon: FileText,
  },
  {
    id: 6,
    title: 'Sertifikat & Akreditasi',
    titleEn: 'Certificates & Accreditations',
    titleZh: '证书与认证',
    description: 'Koleksi sertifikat SNI, ISO, dan akreditasi lainnya.',
    descriptionEn: 'Collection of SNI, ISO certificates and other accreditations.',
    descriptionZh: 'SNI、ISO 证书及其他认证集合。',
    type: 'PDF',
    size: '3.2 MB',
    icon: FileText,
  },
];

const DownloadPage: React.FC = () => {
  const { t, language } = useLanguage();
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));

    setIsUnlocked(true);
    setShowModal(false);
    setIsSubmitting(false);
    
    const successMsg = {
      id: 'Akses diberikan! Anda sekarang dapat mengunduh dokumen.',
      en: 'Access granted! You can now download the documents.',
      zh: '权限已授予！您现在可以下载文档。'
    };
    toast.success(successMsg[language as keyof typeof successMsg] || successMsg.en);
  };

  const handleDownload = (doc: any) => {
    if (!isUnlocked) {
      setShowModal(true);
      return;
    }
    const currentTitle = language === 'id' ? doc.title : (language === 'zh' ? doc.titleZh : doc.titleEn);
    const downloadMsg = {
      id: `Mengunduh ${currentTitle}...`,
      en: `Downloading ${currentTitle}...`,
      zh: `正在下载 ${currentTitle}...`
    };
    toast.success(downloadMsg[language as keyof typeof downloadMsg] || downloadMsg.en);
  };

  // Helper function to get text based on current language
  const getText = (doc: any, field: 'title' | 'description') => {
    if (language === 'id') return doc[field];
    if (language === 'zh') return doc[`${field}Zh`];
    return doc[`${field}En`];
  };

  return (
    <Layout>
      <section className="section-padding bg-secondary">
        <div className="container-enterprise">
          <ScrollReveal>
            <div className="text-center mb-16 flex flex-col items-center">
              <h1 className="heading-hero text-foreground mb-4">
                {t('download.title')}
              </h1>
              <p className="text-body-large max-w-2xl mx-auto">
                {t('download.subtitle')}
              </p>
              <div className="divider-accent mx-auto mt-6" />
            </div>
          </ScrollReveal>

          {!isUnlocked && (
            <ScrollReveal>
              <div className="mb-12 p-6 bg-accent/10 rounded-xl border border-accent/20 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
                    <Lock className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">
                      {language === 'zh' ? '填写详细信息以访问文档' : t('download.unlock')}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {language === 'id' ? 'Gratis dan tanpa komitmen' : (language === 'zh' ? '免费且无义务' : 'Free and no commitment')}
                    </p>
                  </div>
                </div>
                <Button onClick={() => setShowModal(true)} className="btn-accent">
                  {language === 'id' ? 'Buka Akses' : (language === 'zh' ? '开启权限' : 'Unlock Access')}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </ScrollReveal>
          )}

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {documents.map((doc, index) => (
              <ScrollReveal key={doc.id} delay={index * 0.1}>
                <div className="card-enterprise p-6 h-full flex flex-col">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                      <doc.icon className="w-6 h-6 text-accent" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold font-semibold text-lg text-foreground mb-1">
                        {getText(doc, 'title')}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{doc.type}</span>
                        <span>•</span>
                        <span>{doc.size}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-6 flex-1">
                    {getText(doc, 'description')}
                  </p>
                  <Button
                    onClick={() => handleDownload(doc)}
                    variant={isUnlocked ? 'default' : 'outline'}
                    className={isUnlocked ? 'btn-accent w-full' : 'w-full'}
                  >
                    {isUnlocked ? (
                      <>
                        <Download className="w-4 h-4 mr-2" />
                        {language === 'id' ? 'Unduh' : (language === 'zh' ? '下载' : 'Download')}
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4 mr-2" />
                        {language === 'id' ? 'Buka untuk Unduh' : (language === 'zh' ? '开启下载' : 'Unlock to Download')}
                      </>
                    )}
                  </Button>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Unlock Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="sm:max-w-md bg-card border-border">
          <DialogHeader>
            <DialogTitle className="font-bold text-2xl">
              {language === 'id' ? 'Buka Akses Dokumen' : (language === 'zh' ? '解锁文档访问权限' : 'Unlock Document Access')}
            </DialogTitle>
            <DialogDescription>
              {language === 'id' 
                ? 'Isi data Anda untuk mengakses semua dokumen secara gratis.' 
                : (language === 'zh' ? '请填写您的详细信息以免费获取所有文档。' : 'Fill in your details to access all documents for free.')}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">{language === 'zh' ? '姓名' : t('form.name')}</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                placeholder={language === 'id' ? 'Nama lengkap Anda' : (language === 'zh' ? '您的全名' : 'Your full name')}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">{language === 'zh' ? '电子邮箱' : t('form.email')}</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                placeholder={language === 'id' ? 'email@perusahaan.com' : (language === 'zh' ? 'yourname@company.com' : 'email@company.com')}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company">{language === 'zh' ? '公司名称' : t('form.company')}</Label>
              <Input
                id="company"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                required
                placeholder={language === 'id' ? 'Nama perusahaan' : (language === 'zh' ? '公司名称' : 'Company name')}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">{language === 'zh' ? '电话号码' : t('form.phone')}</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
                placeholder="+62 812 3456 7890"
              />
            </div>
            <Button type="submit" className="btn-accent w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                language === 'id' ? 'Memproses...' : (language === 'zh' ? '处理中...' : 'Processing...')
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  {language === 'id' ? 'Buka Akses Sekarang' : (language === 'zh' ? '立即开启权限' : 'Unlock Access Now')}
                </>
              )}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default DownloadPage;