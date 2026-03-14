'use client';

import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { rateLimiter } from '@/utils/rateLimiter';
import { analytics } from '@/utils/analytics';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { getContactSchema, ContactFormData } from '@/schemas/contactSchema';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const RECAPTCHA_SITE_KEY = (process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY as string) || '';

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

const Contact: React.FC = () => {
  const { language } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rateLimitRemaining, setRateLimitRemaining] = useState(0);

  const form = useForm<ContactFormData>({
    resolver: zodResolver(getContactSchema(language)),
    defaultValues: {
      name: '',
      company: '',
      email: '',
      phone: '',
      projectType: '',
      projectValue: '',
      location: '',
      message: '',
      hp_field: '',
      requestProposal: false,
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    if (data.hp_field && data.hp_field.trim() !== '') {
      toast.error(language === 'id' ? 'Permintaan terdeteksi sebagai spam' : 'Spam detected');
      try { analytics.trackFormSubmission('contact', false); } catch {}
      return;
    }
    
    const identifier = data.email || 'anonymous';
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

    setIsSubmitting(true);

    try {
      const recaptchaToken = await getRecaptchaToken();
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...data,
          project_type: data.projectType,
          project_value: data.projectValue,
          request_proposal: data.requestProposal,
          recaptchaToken,
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

      form.reset();
      setRateLimitRemaining(0);

    } catch (error: any) {
      toast.error(
        language === 'zh' 
          ? `发送失败：${error.message}` 
          : language === 'id' 
          ? `Gagal mengirim: ${error.message}` 
          : `Failed: ${error.message}`
      );
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
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div style={{ display: 'none' }} aria-hidden>
                  <label>Do not fill</label>
                  <Input {...form.register("hp_field")} tabIndex={-1} autoComplete="off" />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-semibold uppercase text-slate-500">{language === 'zh' ? '全名' : language === 'id' ? 'Nama Lengkap' : 'Full Name'}</FormLabel>
                        <FormControl>
                          <Input placeholder={language === 'zh' ? '张三' : language === 'id' ? 'John Doe' : 'John Doe'} {...field} />
                        </FormControl>
                        <FormMessage className="text-xs text-red-500" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="company"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-semibold uppercase text-slate-500">{language === 'zh' ? '机构/公司' : language === 'id' ? 'Instansi / Perusahaan' : 'Company'}</FormLabel>
                        <FormControl>
                          <Input placeholder={language === 'zh' ? '前进有限公司' : language === 'id' ? 'PT. Maju Jaya' : 'PT. Maju Jaya'} {...field} />
                        </FormControl>
                        <FormMessage className="text-xs text-red-500" />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-semibold uppercase text-slate-500">{language === 'zh' ? '电子邮件' : 'Email'}</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder={language === 'zh' ? 'email@公司.com' : language === 'id' ? 'email@perusahaan.com' : 'email@company.com'} {...field} />
                        </FormControl>
                        <FormMessage className="text-xs text-red-500" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-semibold uppercase text-slate-500">{language === 'zh' ? 'WhatsApp / 电话' : language === 'id' ? 'WhatsApp / Telepon' : 'Phone'}</FormLabel>
                        <FormControl>
                          <Input placeholder={language === 'zh' ? '08123456789' : language === 'id' ? '08123456789' : '+628123456789'} {...field} />
                        </FormControl>
                        <FormMessage className="text-xs text-red-500" />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="projectType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-semibold uppercase text-slate-500">{language === 'zh' ? '项目类型' : language === 'id' ? 'Tipe Proyek' : 'Project Type'}</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder={language === 'zh' ? '选择项目类型' : language === 'id' ? 'Pilih tipe proyek' : 'Select project type'} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="residential">{language === 'zh' ? '住宅' : language === 'id' ? 'Perumahan' : 'Residential'}</SelectItem>
                            <SelectItem value="commercial">{language === 'zh' ? '商业' : language === 'id' ? 'Komersial' : 'Commercial'}</SelectItem>
                            <SelectItem value="industrial">{language === 'zh' ? '工业' : language === 'id' ? 'Industri' : 'Industrial'}</SelectItem>
                            <SelectItem value="infrastructure">{language === 'zh' ? '基础设施' : language === 'id' ? 'Infrastruktur' : 'Infrastructure'}</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage className="text-xs text-red-500" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="projectValue"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-semibold uppercase text-slate-500">{language === 'zh' ? '项目价值' : language === 'id' ? 'Nilai Proyek' : 'Project Value'}</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder={language === 'zh' ? '选择价值范围' : language === 'id' ? 'Pilih rentang nilai' : 'Select value range'} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="<1M">{language === 'zh' ? '小于 100万' : language === 'id' ? '< 1 Miliar' : '< 1 Million'}</SelectItem>
                            <SelectItem value="1-5M">{language === 'zh' ? '100万-500万' : language === 'id' ? '1-5 Miliar' : '1-5 Million'}</SelectItem>
                            <SelectItem value="5-10M">{language === 'zh' ? '500万-1000万' : language === 'id' ? '5-10 Miliar' : '5-10 Million'}</SelectItem>
                            <SelectItem value=">10M">{language === 'zh' ? '大于 1000万' : language === 'id' ? '> 10 Miliar' : '> 10 Million'}</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage className="text-xs text-red-500" />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold uppercase text-slate-500">{language === 'zh' ? '项目地点' : language === 'id' ? 'Lokasi Proyek' : 'Project Location'}</FormLabel>
                      <FormControl>
                        <Input placeholder={language === 'zh' ? '城市，省份' : language === 'id' ? 'Kota, Provinsi' : 'City, Province'} {...field} />
                      </FormControl>
                      <FormMessage className="text-xs text-red-500" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold uppercase text-slate-500">{language === 'zh' ? '项目描述' : language === 'id' ? 'Deskripsi Proyek' : 'Project Description'}</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder={language === 'zh' ? '请详细描述您的项目需求...' : language === 'id' ? 'Jelaskan kebutuhan proyek Anda secara detail...' : 'Please describe your project requirements in detail...'} 
                          rows={4}
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage className="text-xs text-red-500" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="requestProposal"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          {language === 'zh' ? '请求项目提案' : language === 'id' ? 'Minta proposal proyek' : 'Request project proposal'}
                        </FormLabel>
                      </div>
                    </FormItem>
                  )}
                />

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
            </Form>

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
