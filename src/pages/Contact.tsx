import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { Mail, Phone, MapPin, Send, AlertCircle } from 'lucide-react';
import { rateLimiter } from '@/utils/rateLimiter';
import { analytics } from '@/utils/analytics';

const RECAPTCHA_SITE_KEY = (import.meta.env.VITE_RECAPTCHA_SITE_KEY as string) || '';

async function loadReCaptcha(siteKey: string) {
  if (!siteKey) return;
  if ((window as any).grecaptcha) return;

  return new Promise<void>((resolve, reject) => {
    const script = document.createElement('script');
    script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load reCAPTCHA'));
    document.head.appendChild(script);
  });
}

async function getRecaptchaToken(action = 'contact_form') {
  if (!RECAPTCHA_SITE_KEY) return undefined;
  try {
    await loadReCaptcha(RECAPTCHA_SITE_KEY);
    const grecaptcha = (window as any).grecaptcha;
    if (!grecaptcha || !grecaptcha.execute) return undefined;
    return await grecaptcha.execute(RECAPTCHA_SITE_KEY, { action });
  } catch (e) {
    console.error('reCAPTCHA error', e);
    return undefined;
  }
}

interface ContactFormData {
  name: string;
  company: string;
  email: string;
  phone: string;
  projectType: string;
  projectValue: string;
  location: string;
  message: string;
  hp_field?: string; // honeypot field to deter bots
  requestProposal: boolean;
}

const Contact: React.FC = () => {
  const { language } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rateLimitRemaining, setRateLimitRemaining] = useState(0);

  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    company: '',
    email: '',
    phone: '',
    projectType: '',
    projectValue: '',
    location: '',
    message: '',
    requestProposal: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = language === 'zh' ? '姓名必填' : language === 'id' ? 'Nama wajib diisi' : 'Name is required';
    } else if (formData.name.length < 3) {
      newErrors.name = language === 'zh' ? '姓名至少3个字符' : language === 'id' ? 'Nama minimal 3 karakter' : 'Name must be at least 3 characters';
    }

    // Company validation
    if (!formData.company.trim()) {
      newErrors.company = language === 'zh' ? '公司必填' : language === 'id' ? 'Perusahaan wajib diisi' : 'Company is required';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = language === 'zh' ? '邮箱必填' : language === 'id' ? 'Email wajib diisi' : 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = language === 'zh' ? '邮箱格式无效' : language === 'id' ? 'Format email tidak valid' : 'Invalid email format';
    }

    // Phone validation
    const phoneRegex = /^[+]?[0-9]{8,15}$/;
    if (!formData.phone.trim()) {
      newErrors.phone = language === 'zh' ? '电话号码必填' : language === 'id' ? 'Nomor telepon wajib diisi' : 'Phone number is required';
    } else if (!phoneRegex.test(formData.phone.replace(/[^0-9+]/g, ''))) {
      newErrors.phone = language === 'zh' ? '电话号码格式无效' : language === 'id' ? 'Format nomor telepon tidak valid' : 'Invalid phone number format';
    }

    // Project type validation
    if (!formData.projectType) {
      newErrors.projectType = language === 'zh' ? '项目类型必选' : language === 'id' ? 'Tipe proyek wajib dipilih' : 'Project type is required';
    }

    // Message validation
    if (!formData.message.trim()) {
      newErrors.message = language === 'zh' ? '消息必填' : language === 'id' ? 'Pesan wajib diisi' : 'Message is required';
    } else if (formData.message.length < 10) {
      newErrors.message = language === 'zh' ? '消息至少10个字符' : language === 'id' ? 'Pesan minimal 10 karakter' : 'Message must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Honeypot check (bots often fill hidden fields)
    if (formData.hp_field && formData.hp_field.trim() !== '') {
      toast.error(language === 'id' ? 'Permintaan terdeteksi sebagai spam' : 'Spam detected');
      try { analytics.trackFormSubmission('contact', false); } catch {}
      return;
    }
    
    // Rate limiting check
    const identifier = formData.email || 'anonymous';
    if (!rateLimiter.isAllowed(identifier)) {
      const remainingTime = rateLimiter.getRemainingTime(identifier);
      setRateLimitRemaining(remainingTime);
      
      toast.error(
        language === 'zh' 
          ? `请求过多。请在 ${remainingTime} 秒后重试。` 
          : language === 'id' 
          ? `Terlalu banyak permintaan. Coba lagi dalam ${remainingTime} detik.` 
          : `Too many requests. Try again in ${remainingTime} seconds.`
      );
      return;
    }

    if (!validateForm()) {
      toast.error(
        language === 'zh' 
          ? '请修复表单错误' 
          : language === 'id' 
          ? 'Silakan perbaiki error pada form' 
          : 'Please fix the form errors'
      );
      return;
    }

    setIsSubmitting(true);

    try {
      // get reCAPTCHA token (if configured)
      const recaptchaToken = await getRecaptchaToken();
      // Submit to server-side endpoint which handles rate-limiting and verification
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        // include token in body for server verification
        body: JSON.stringify({
          name: formData.name,
          company: formData.company,
          email: formData.email,
          phone: formData.phone,
          project_type: formData.projectType,
          project_value: formData.projectValue,
          location: formData.location,
          message: formData.message,
          recaptchaToken,
          request_proposal: formData.requestProposal,
          hp_field: formData.hp_field
        })
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || 'Submission failed');
      }

      toast.success(
        language === 'zh' 
          ? '数据成功发送到数据库！' 
          : language === 'id' 
          ? 'Data berhasil dikirim ke database!' 
          : 'Data successfully sent to database!'
      );

      try { analytics.trackFormSubmission('contact', true); } catch {}

      // Reset form setelah berhasil
      setFormData({
        name: '', company: '', email: '', phone: '',
        projectType: '', projectValue: '', location: '',
        message: '', hp_field: '', requestProposal: false,
      });
      setErrors({}); // Clear errors after successful submission

    } catch (error: any) {
      // Error handling without console.log for production
      toast.error(
        language === 'zh' 
          ? `发送失败：${error.message}` 
          : language === 'id' 
          ? `Gagal mengirim: ${error.message}` 
          : `Failed: ${error.message}`
      );
      // track failure
      try { analytics.trackFormSubmission('contact', false); } catch {}
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="pt-24 pb-16 bg-slate-50 min-h-screen">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white rounded-2xl shadow-xl border p-8">
            <div className="text-center mb-10">
              <h1 className="text-3xl font-bold text-slate-900 mb-2">
                {language === 'zh' ? '项目联系表单' : language === 'id' ? 'Formulir Kontak Proyek' : 'Project Contact Form'}
              </h1>
              <p className="text-slate-500">
                {language === 'zh' ? '填写以下数据获取特别报价。' : language === 'id' ? 'Lengkapi data di bawah untuk mendapatkan penawaran khusus.' : 'Complete the data below to get a special offer.'}
              </p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Honeypot field - hidden from users but visible to bots */}
              <div style={{ display: 'none' }} aria-hidden>
                <label>Do not fill</label>
                <input
                  name="hp_field"
                  tabIndex={-1}
                  autoComplete="off"
                  value={formData.hp_field || ''}
                  onChange={(e) => setFormData({...formData, hp_field: e.target.value})}
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold uppercase text-slate-500">{language === 'zh' ? '全名' : language === 'id' ? 'Nama Lengkap' : 'Full Name'}</label>
                  <Input 
                    placeholder={language === 'zh' ? '张三' : language === 'id' ? 'John Doe' : 'John Doe'}
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className={errors.name ? 'border-red-500 focus:ring-red-500' : ''}
                  />
                  {errors.name && (
                    <div className="flex items-center gap-1 text-red-500 text-xs mt-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.name}
                    </div>
                  )}
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold uppercase text-slate-500">{language === 'zh' ? '机构/公司' : language === 'id' ? 'Instansi / Perusahaan' : 'Company'}</label>
                  <Input 
                    placeholder={language === 'zh' ? '前进有限公司' : language === 'id' ? 'PT. Maju Jaya' : 'PT. Maju Jaya'}
                    required
                    value={formData.company}
                    onChange={(e) => setFormData({...formData, company: e.target.value})}
                    className={errors.company ? 'border-red-500 focus:ring-red-500' : ''}
                  />
                  {errors.company && (
                    <div className="flex items-center gap-1 text-red-500 text-xs mt-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.company}
                    </div>
                  )}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold uppercase text-slate-500">{language === 'zh' ? '电子邮件' : 'Email'}</label>
                  <Input 
                    type="email" 
                    placeholder={language === 'zh' ? 'email@公司.com' : language === 'id' ? 'email@perusahaan.com' : 'email@company.com'} 
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className={errors.email ? 'border-red-500 focus:ring-red-500' : ''}
                  />
                  {errors.email && (
                    <div className="flex items-center gap-1 text-red-500 text-xs mt-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.email}
                    </div>
                  )}
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold uppercase text-slate-500">{language === 'zh' ? 'WhatsApp / 电话' : language === 'id' ? 'WhatsApp / Telepon' : 'Phone'}</label>
                  <Input 
                    placeholder={language === 'zh' ? '08123456789' : language === 'id' ? '08123456789' : '+628123456789'} 
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className={errors.phone ? 'border-red-500 focus:ring-red-500' : ''}
                  />
                  {errors.phone && (
                    <div className="flex items-center gap-1 text-red-500 text-xs mt-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.phone}
                    </div>
                  )}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold uppercase text-slate-500">{language === 'zh' ? '项目类型' : language === 'id' ? 'Tipe Proyek' : 'Project Type'}</label>
                  <select 
                    required
                    value={formData.projectType}
                    onChange={(e) => setFormData({...formData, projectType: e.target.value})}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-accent ${errors.projectType ? 'border-red-500' : 'border-slate-200'}`}
                  >
                    <option value="">{language === 'zh' ? '选择项目类型' : language === 'id' ? 'Pilih tipe proyek' : 'Select project type'}</option>
                    <option value="residential">{language === 'zh' ? '住宅' : language === 'id' ? 'Perumahan' : 'Residential'}</option>
                    <option value="commercial">{language === 'zh' ? '商业' : language === 'id' ? 'Komersial' : 'Commercial'}</option>
                    <option value="industrial">{language === 'zh' ? '工业' : language === 'id' ? 'Industri' : 'Industrial'}</option>
                    <option value="infrastructure">{language === 'zh' ? '基础设施' : language === 'id' ? 'Infrastruktur' : 'Infrastructure'}</option>
                  </select>
                  {errors.projectType && (
                    <div className="flex items-center gap-1 text-red-500 text-xs mt-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.projectType}
                    </div>
                  )}
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold uppercase text-slate-500">{language === 'zh' ? '项目价值' : language === 'id' ? 'Nilai Proyek' : 'Project Value'}</label>
                  <select 
                    value={formData.projectValue}
                    onChange={(e) => setFormData({...formData, projectValue: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
                  >
                    <option value="">{language === 'zh' ? '选择价值范围' : language === 'id' ? 'Pilih rentang nilai' : 'Select value range'}</option>
                    <option value="<1M">{language === 'zh' ? '小于 100万' : language === 'id' ? '< 1 Miliar' : '< 1 Million'}</option>
                    <option value="1-5M">{language === 'zh' ? '100万-500万' : language === 'id' ? '1-5 Miliar' : '1-5 Million'}</option>
                    <option value="5-10M">{language === 'zh' ? '500万-1000万' : language === 'id' ? '5-10 Miliar' : '5-10 Million'}</option>
                    <option value=">10M">{language === 'zh' ? '大于 1000万' : language === 'id' ? '> 10 Miliar' : '> 10 Million'}</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase text-slate-500">{language === 'zh' ? '项目地点' : language === 'id' ? 'Lokasi Proyek' : 'Project Location'}</label>
                <Input 
                  placeholder={language === 'zh' ? '城市，省份' : language === 'id' ? 'Kota, Provinsi' : 'City, Province'} 
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  className={errors.location ? 'border-red-500 focus:ring-red-500' : ''}
                />
                {errors.location && (
                  <div className="flex items-center gap-1 text-red-500 text-xs mt-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.location}
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase text-slate-500">{language === 'zh' ? '项目描述' : language === 'id' ? 'Deskripsi Proyek' : 'Project Description'}</label>
                <Textarea 
                  placeholder={language === 'zh' ? '请详细描述您的项目需求...' : language === 'id' ? 'Jelaskan kebutuhan proyek Anda secara detail...' : 'Please describe your project requirements in detail...'} 
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  className={errors.message ? 'border-red-500 focus:ring-red-500' : ''}
                />
                {errors.message && (
                  <div className="flex items-center gap-1 text-red-500 text-xs mt-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.message}
                    </div>
                  )}
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="proposal"
                  checked={formData.requestProposal}
                  onCheckedChange={(checked) => setFormData({...formData, requestProposal: checked as boolean})}
                />
                <label htmlFor="proposal" className="text-sm text-slate-700">
                  {language === 'zh' ? '请求项目提案' : language === 'id' ? 'Minta proposal proyek' : 'Request project proposal'}
                </label>
              </div>

              {rateLimitRemaining > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-3 rounded-md">
                  <p className="text-sm">
                    {language === 'zh' 
                      ? `请等待 ${rateLimitRemaining} 秒后再试。` 
                      : language === 'id' 
                      ? `Silakan tunggu ${rateLimitRemaining} detik sebelum mencoba lagi.` 
                      : `Please wait ${rateLimitRemaining} seconds before trying again.`
                    }
                  </p>
                </div>
              )}

              <Button 
                type="submit" 
                disabled={isSubmitting || rateLimitRemaining > 0}
                className="w-full bg-accent hover:bg-accent/90 text-white font-bold py-3 px-6 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    {language === 'zh' ? '发送中...' : language === 'id' ? 'Mengirim...' : 'Sending...'}
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Send className="w-4 h-4" />
                    {language === 'zh' ? '发送消息' : language === 'id' ? 'Kirim Pesan' : 'Send Message'}
                  </div>
                )}
              </Button>
            </form>

            <div className="mt-12 pt-8 border-t border-slate-200">
              <div className="grid md:grid-cols-3 gap-8 text-center">
                <div className="space-y-2">
                  <Mail className="w-6 h-6 text-accent mx-auto" />
                  <h3 className="font-semibold text-slate-900">{language === 'zh' ? '电子邮件' : language === 'id' ? 'Email' : 'Email'}</h3>
                  <p className="text-sm text-slate-600">info@semen-nusantara.com</p>
                </div>
                <div className="space-y-2">
                  <Phone className="w-6 h-6 text-accent mx-auto" />
                  <h3 className="font-semibold text-slate-900">{language === 'zh' ? '电话' : language === 'id' ? 'Telepon' : 'Phone'}</h3>
                  <p className="text-sm text-slate-600">+62 21 1234 5678</p>
                </div>
                <div className="space-y-2">
                  <MapPin className="w-6 h-6 text-accent mx-auto" />
                  <h3 className="font-semibold text-slate-900">{language === 'zh' ? '地址' : language === 'id' ? 'Alamat' : 'Address'}</h3>
                  <p className="text-sm text-slate-600">Jakarta, Indonesia</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;
