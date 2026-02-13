import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, LogOut, Save } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

const DashboardPage: React.FC = () => {
  const { t, language } = useLanguage();
  const [products, setProducts] = useState<any[]>([]);
  const [newsForm, setNewsForm] = useState({
    title: '', title_en: '', title_zh: '',
    content: '', content_en: '', content_zh: ''
  });

  // Contoh fungsi simpan dengan field China
  const handleSaveProduct = async (productData: any) => {
    // Logika Supabase di sini mencakup field name_zh dan description_zh
    toast.success(t('common.save'));
  };

  return (
    <Layout>
      <div className="py-12 bg-slate-50 min-h-screen">
        <div className="container-enterprise">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-black">
              {t('dashboard.title')}
            </h1>
            <Button variant="outline" className="flex gap-2">
              <LogOut size={18} /> {t('auth.logout')}
            </Button>
          </div>

          <Tabs defaultValue="news" className="space-y-6">
            <TabsList>
              <TabsTrigger value="news">{t('dashboard.news')}</TabsTrigger>
              <TabsTrigger value="products">{t('dashboard.products')}</TabsTrigger>
            </TabsList>

            <TabsContent value="news">
              <div className="card-enterprise p-8 bg-white">
                <h2 className="text-xl font-bold mb-6">{t('dashboard.addNews')}</h2>
                <div className="grid gap-6">
                  {/* Judul Tiga Bahasa */}
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Judul (ID)</Label>
                      <Input value={newsForm.title} onChange={e => setNewsForm({...newsForm, title: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <Label>Title (EN)</Label>
                      <Input value={newsForm.title_en} onChange={e => setNewsForm({...newsForm, title_en: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <Label>标题 (ZH)</Label>
                      <Input value={newsForm.title_zh} onChange={e => setNewsForm({...newsForm, title_zh: e.target.value})} />
                    </div>
                  </div>

                  {/* Konten Tiga Bahasa */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Konten (ID)</Label>
                      <Textarea rows={3} value={newsForm.content} onChange={e => setNewsForm({...newsForm, content: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <Label>Content (EN)</Label>
                      <Textarea rows={3} value={newsForm.content_en} onChange={e => setNewsForm({...newsForm, content_en: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <Label>内容 (ZH)</Label>
                      <Textarea rows={3} value={newsForm.content_zh} onChange={e => setNewsForm({...newsForm, content_zh: e.target.value})} />
                    </div>
                  </div>

                  <Button className="btn-accent w-full flex gap-2">
                    <Save size={18} /> {language === 'zh' ? '保存新闻' : 'Simpan Berita'}
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default DashboardPage;