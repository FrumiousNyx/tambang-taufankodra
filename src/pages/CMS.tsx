'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { FileText, Plus, Edit, Trash2, Eye, Settings, Layout, Newspaper, MessageSquare, Package, Building, Users } from 'lucide-react';
import { cmsService } from '@/lib/cms';
import { CMSContent, CMSPage, CMSMedia } from '@/types/cms';
import { slugify } from '@/lib/slug';
import { z } from 'zod';
import { withLang } from '@/lib/i18nRoutes';
 

const CMS: React.FC = () => {
  const { user, roles, isAdmin } = useAuth();
  const { language } = useLanguage();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [contents, setContents] = useState<CMSContent[]>([]);
  const [pages, setPages] = useState<CMSPage[]>([]);
  const [media, setMedia] = useState<CMSMedia[]>([]);
  const [addOpen, setAddOpen] = useState(false);
  const canEdit = Boolean(isAdmin || roles?.includes('editor'));
  const [editOpen, setEditOpen] = useState(false);
  const [previewLang, setPreviewLang] = useState<'id' | 'en' | 'zh'>('id');
  const [editPageOpen, setEditPageOpen] = useState(false);
  const [addPageOpen, setAddPageOpen] = useState(false);
  const [newContent, setNewContent] = useState<{
    type: CMSContent['type'];
    title_id: string;
    title_en: string;
    title_zh: string;
    content_id: string;
    content_en: string;
    content_zh: string;
    published: boolean;
    order: number;
  }>({
    type: 'hero',
    title_id: '',
    title_en: '',
    title_zh: '',
    content_id: '',
    content_en: '',
    content_zh: '',
    published: true,
    order: 0,
  });
  const [editContentId, setEditContentId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState<{
    type: CMSContent['type'];
    title_id: string;
    title_en: string;
    title_zh: string;
    content_id: string;
    content_en: string;
    content_zh: string;
    published: boolean;
    order: number;
  }>({
    type: 'hero',
    title_id: '',
    title_en: '',
    title_zh: '',
    content_id: '',
    content_en: '',
    content_zh: '',
    published: true,
    order: 0,
  });

  const [editPageId, setEditPageId] = useState<string | null>(null);
  const [editPage, setEditPage] = useState<{
    slug: string;
    title_id: string;
    title_en: string;
    title_zh: string;
    description_id: string;
    description_en: string;
    description_zh: string;
    content_id: string;
    content_en: string;
    content_zh: string;
    seo_title_id: string;
    seo_title_en: string;
    seo_title_zh: string;
    seo_description_id: string;
    seo_description_en: string;
    seo_description_zh: string;
    published: boolean;
    order: number;
  }>({
    slug: '',
    title_id: '',
    title_en: '',
    title_zh: '',
    description_id: '',
    description_en: '',
    description_zh: '',
    content_id: '',
    content_en: '',
    content_zh: '',
    seo_title_id: '',
    seo_title_en: '',
    seo_title_zh: '',
    seo_description_id: '',
    seo_description_en: '',
    seo_description_zh: '',
    published: true,
    order: 0,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pageErrors, setPageErrors] = useState<Record<string, string>>({});

  const contentSchema = z.object({
    type: z.enum(['hero','about','product','project','news','testimonial','contact']),
    title_id: z.string().min(1, 'Title (ID) wajib diisi'),
    content_id: z.string().min(1, 'Content (ID) wajib diisi'),
    order: z.number().int().min(0).optional(),
  });

  const pageSchema = z.object({
    title_id: z.string().min(1, 'Title (ID) wajib diisi'),
    slug: z.string().optional(),
    order: z.number().int().min(0).optional(),
  });
  const [newPage, setNewPage] = useState<{
    slug: string;
    title_id: string;
    title_en: string;
    title_zh: string;
    description_id: string;
    description_en: string;
    description_zh: string;
    content_id: string;
    content_en: string;
    content_zh: string;
    seo_title_id: string;
    seo_title_en: string;
    seo_title_zh: string;
    seo_description_id: string;
    seo_description_en: string;
    seo_description_zh: string;
    published: boolean;
    order: number;
  }>({
    slug: '',
    title_id: '',
    title_en: '',
    title_zh: '',
    description_id: '',
    description_en: '',
    description_zh: '',
    content_id: '',
    content_en: '',
    content_zh: '',
    seo_title_id: '',
    seo_title_en: '',
    seo_title_zh: '',
    seo_description_id: '',
    seo_description_en: '',
    seo_description_zh: '',
    published: true,
    order: 0,
  });

  useEffect(() => {
    if (!user) {
      router.replace(withLang('/auth', language));
      return;
    }
    loadData();
  }, [user, router, language]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [contentsData, pagesData, mediaData] = await Promise.all([
        cmsService.getRawContentByType('hero'),
        cmsService.getRawPages(),
        cmsService.getMedia()
      ]);
      
      setContents(contentsData);
      setPages(pagesData);
      setMedia(mediaData as CMSMedia[]);
    } catch (error) {
      console.error('Error loading CMS data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePublish = async (item: CMSContent, value: boolean) => {
    if (!canEdit) return;
    try {
      const updated = await cmsService.updateContent(item.id, {
        metadata: { ...(item.metadata || {}), published: value },
      });
      setContents(prev => prev.map(c => c.id === item.id ? updated : c));
    } catch (e) {
      console.error(e);
    }
  };

  const handleReorder = async (item: CMSContent, delta: number) => {
    if (!canEdit) return;
    const currentOrder = item.metadata?.order ?? 0;
    const next = Math.max(0, currentOrder + delta);
    try {
      const updated = await cmsService.updateContent(item.id, {
        metadata: { ...(item.metadata || {}), order: next },
      });
      setContents(prev => prev.map(c => c.id === item.id ? updated : c).sort((a,b) => (a.metadata?.order ?? 0) - (b.metadata?.order ?? 0)));
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreateContent = async () => {
    if (!canEdit) return;
    const parsed = contentSchema.safeParse({
      type: newContent.type,
      title_id: newContent.title_id,
      content_id: newContent.content_id,
      order: newContent.order,
    });
    if (!parsed.success) {
      const e: Record<string, string> = {};
      for (const issue of parsed.error.issues) e[issue.path.join('.')] = issue.message;
      setErrors(e);
      return;
    }
    setErrors({});
    try {
      const created = await cmsService.createContent({
        type: newContent.type,
        title: { id: newContent.title_id, en: newContent.title_en || newContent.title_id, zh: newContent.title_zh || newContent.title_en || newContent.title_id },
        content: { id: newContent.content_id, en: newContent.content_en || newContent.content_id, zh: newContent.content_zh || newContent.content_en || newContent.content_id },
        metadata: { published: newContent.published, order: newContent.order },
        created_by: user?.email || 'admin',
      } as any);
      setContents(prev => [...prev, created].sort((a,b) => (a.metadata?.order ?? 0) - (b.metadata?.order ?? 0)));
      setAddOpen(false);
      setNewContent({
        type: 'hero',
        title_id: '',
        title_en: '',
        title_zh: '',
        content_id: '',
        content_en: '',
        content_zh: '',
        published: true,
        order: 0,
      });
    } catch (e) {
      console.error('Create content failed', e);
    }
  };

  const openEditDialog = (item: CMSContent) => {
    if (!canEdit) return;
    setEditContentId(item.id);
    setEditContent({
      type: item.type,
      title_id: item.title?.id || '',
      title_en: item.title?.en || '',
      title_zh: item.title?.zh || '',
      content_id: item.content?.id || '',
      content_en: item.content?.en || '',
      content_zh: item.content?.zh || '',
      published: Boolean(item.metadata?.published),
      order: item.metadata?.order ?? 0,
    });
    setEditOpen(true);
  };

  const handleUpdateContent = async () => {
    if (!canEdit) return;
    if (!editContentId) return;
    const parsed = contentSchema.safeParse({
      type: editContent.type,
      title_id: editContent.title_id,
      content_id: editContent.content_id,
      order: editContent.order,
    });
    if (!parsed.success) {
      const e: Record<string, string> = {};
      for (const issue of parsed.error.issues) e[issue.path.join('.')] = issue.message;
      setErrors(e);
      return;
    }
    setErrors({});

    const nextTitle = {
      id: editContent.title_id,
      en: editContent.title_en || editContent.title_id,
      zh: editContent.title_zh || editContent.title_en || editContent.title_id,
    };
    const nextContent = {
      id: editContent.content_id,
      en: editContent.content_en || editContent.content_id,
      zh: editContent.content_zh || editContent.content_en || editContent.content_id,
    };

    try {
      const current = contents.find(c => c.id === editContentId);
      const updated = await cmsService.updateContent(editContentId, {
        type: editContent.type,
        title: nextTitle as any,
        content: nextContent as any,
        metadata: {
          ...(current?.metadata || {}),
          published: editContent.published,
          order: editContent.order,
        },
      });
      setContents(prev =>
        prev
          .map(c => c.id === editContentId ? (updated as any) : c)
          .sort((a, b) => (a.metadata?.order ?? 0) - (b.metadata?.order ?? 0)),
      );
      setEditOpen(false);
      setEditContentId(null);
    } catch (e) {
      console.error('Update content failed', e);
    }
  };

  const handleDeleteContent = async (id: string) => {
    if (!canEdit) return;
    if (window.confirm('Are you sure you want to delete this content?')) {
      try {
        await cmsService.deleteContent(id);
        setContents(contents.filter(c => c.id !== id));
      } catch (error) {
        console.error('Error deleting content:', error);
      }
    }
  };

  const handleDeleteMedia = async (id: string) => {
    if (!canEdit) return;
    if (window.confirm('Are you sure you want to delete this media file?')) {
      try {
        await cmsService.deleteMedia(id);
        setMedia(media.filter(m => m.id !== id));
      } catch (error) {
        console.error('Error deleting media:', error);
      }
    }
  };

  const openEditPageDialog = (page: CMSPage) => {
    if (!canEdit) return;
    setEditPageId(page.id);
    setEditPage({
      slug: page.slug || '',
      title_id: page.title?.id || '',
      title_en: page.title?.en || '',
      title_zh: page.title?.zh || '',
      description_id: page.description?.id || '',
      description_en: page.description?.en || '',
      description_zh: page.description?.zh || '',
      content_id: page.content?.id || '',
      content_en: page.content?.en || '',
      content_zh: page.content?.zh || '',
      seo_title_id: page.metadata?.seo_title?.id || '',
      seo_title_en: page.metadata?.seo_title?.en || '',
      seo_title_zh: page.metadata?.seo_title?.zh || '',
      seo_description_id: page.metadata?.seo_description?.id || '',
      seo_description_en: page.metadata?.seo_description?.en || '',
      seo_description_zh: page.metadata?.seo_description?.zh || '',
      published: Boolean(page.metadata?.published),
      order: page.metadata?.order ?? 0,
    });
    setEditPageOpen(true);
  };

  const handleTogglePagePublish = async (page: CMSPage, value: boolean) => {
    if (!canEdit) return;
    try {
      const updated = await cmsService.updatePage(page.id, {
        metadata: { ...(page.metadata || {}), published: value },
      });
      setPages(prev => prev.map(p => p.id === page.id ? updated : p));
    } catch (e) {
      console.error(e);
    }
  };

  const handleReorderPage = async (page: CMSPage, delta: number) => {
    if (!canEdit) return;
    const currentOrder = page.metadata?.order ?? 0;
    const next = Math.max(0, currentOrder + delta);
    try {
      const updated = await cmsService.updatePage(page.id, {
        metadata: { ...(page.metadata || {}), order: next },
      });
      setPages(prev => prev.map(p => p.id === page.id ? updated : p).sort((a,b) => (a.metadata?.order ?? 0) - (b.metadata?.order ?? 0)));
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdatePage = async () => {
    if (!canEdit) return;
    if (!editPageId) return;
    const parsed = pageSchema.safeParse({
      title_id: editPage.title_id,
      slug: editPage.slug,
      order: editPage.order,
    });
    if (!parsed.success) {
      const e: Record<string, string> = {};
      for (const issue of parsed.error.issues) e[issue.path.join('.')] = issue.message;
      setPageErrors(e);
      return;
    }
    setPageErrors({});

    const finalSlug = editPage.slug ? slugify(editPage.slug) : slugify(editPage.title_id);

    const nextTitle = {
      id: editPage.title_id,
      en: editPage.title_en || editPage.title_id,
      zh: editPage.title_zh || editPage.title_en || editPage.title_id,
    };
    const nextDescription = {
      id: editPage.description_id || editPage.title_id,
      en: editPage.description_en || editPage.description_id || editPage.title_en || editPage.title_id,
      zh: editPage.description_zh || editPage.description_en || editPage.description_id || editPage.title_zh || editPage.title_en || editPage.title_id,
    };
    const nextContent = {
      id: editPage.content_id,
      en: editPage.content_en || editPage.content_id,
      zh: editPage.content_zh || editPage.content_en || editPage.content_id,
    };
    const nextSeoTitle = {
      id: editPage.seo_title_id || editPage.title_id,
      en: editPage.seo_title_en || editPage.seo_title_id || editPage.title_en || editPage.title_id,
      zh: editPage.seo_title_zh || editPage.seo_title_en || editPage.seo_title_id || editPage.title_zh || editPage.title_en || editPage.title_id,
    };
    const nextSeoDescription = {
      id: editPage.seo_description_id || editPage.description_id || editPage.title_id,
      en: editPage.seo_description_en || editPage.seo_description_id || editPage.description_en || editPage.description_id || editPage.title_en || editPage.title_id,
      zh: editPage.seo_description_zh || editPage.seo_description_en || editPage.seo_description_id || editPage.description_zh || editPage.description_en || editPage.description_id || editPage.title_zh || editPage.title_en || editPage.title_id,
    };

    try {
      const current = pages.find(p => p.id === editPageId);
      const updated = await cmsService.updatePage(editPageId, {
        slug: finalSlug,
        title: nextTitle as any,
        description: nextDescription as any,
        content: nextContent as any,
        metadata: {
          ...(current?.metadata || {}),
          published: editPage.published,
          order: editPage.order,
          seo_title: nextSeoTitle as any,
          seo_description: nextSeoDescription as any,
        },
      });
      setPages(prev =>
        prev
          .map(p => p.id === editPageId ? updated : p)
          .sort((a, b) => (a.metadata?.order ?? 0) - (b.metadata?.order ?? 0)),
      );
      setEditPageOpen(false);
      setEditPageId(null);
    } catch (e) {
      console.error('Update page failed', e);
    }
  };

  const handleCreatePage = async () => {
    if (!canEdit) return;
    const parsed = pageSchema.safeParse({
      title_id: newPage.title_id,
      slug: newPage.slug,
      order: newPage.order,
    });
    if (!parsed.success) {
      const e: Record<string, string> = {};
      for (const issue of parsed.error.issues) e[issue.path.join('.')] = issue.message;
      setPageErrors(e);
      return;
    }
    setPageErrors({});

    const finalSlug = newPage.slug ? slugify(newPage.slug) : slugify(newPage.title_id);
    const nextTitle = {
      id: newPage.title_id,
      en: newPage.title_en || newPage.title_id,
      zh: newPage.title_zh || newPage.title_en || newPage.title_id,
    };
    const nextDescription = {
      id: newPage.description_id || newPage.title_id,
      en: newPage.description_en || newPage.description_id || newPage.title_en || newPage.title_id,
      zh: newPage.description_zh || newPage.description_en || newPage.description_id || newPage.title_zh || newPage.title_en || newPage.title_id,
    };
    const nextContent = {
      id: newPage.content_id,
      en: newPage.content_en || newPage.content_id,
      zh: newPage.content_zh || newPage.content_en || newPage.content_id,
    };
    const nextSeoTitle = {
      id: newPage.seo_title_id || newPage.title_id,
      en: newPage.seo_title_en || newPage.seo_title_id || newPage.title_en || newPage.title_id,
      zh: newPage.seo_title_zh || newPage.seo_title_en || newPage.seo_title_id || newPage.title_zh || newPage.title_en || newPage.title_id,
    };
    const nextSeoDescription = {
      id: newPage.seo_description_id || newPage.description_id || newPage.title_id,
      en: newPage.seo_description_en || newPage.seo_description_id || newPage.description_en || newPage.description_id || newPage.title_en || newPage.title_id,
      zh: newPage.seo_description_zh || newPage.seo_description_en || newPage.seo_description_id || newPage.description_zh || newPage.description_en || newPage.description_id || newPage.title_zh || newPage.title_en || newPage.title_id,
    };

    try {
      const created = await cmsService.createPage({
        slug: finalSlug,
        title: nextTitle as any,
        description: nextDescription as any,
        content: nextContent as any,
        metadata: {
          published: newPage.published,
          order: newPage.order,
          seo_title: nextSeoTitle as any,
          seo_description: nextSeoDescription as any,
        },
        created_by: user?.email || 'admin',
      } as any);
      setPages(prev => [...prev, created].sort((a, b) => (a.metadata?.order ?? 0) - (b.metadata?.order ?? 0)));
      setAddPageOpen(false);
      setNewPage({
        slug: '',
        title_id: '',
        title_en: '',
        title_zh: '',
        description_id: '',
        description_en: '',
        description_zh: '',
        content_id: '',
        content_en: '',
        content_zh: '',
        seo_title_id: '',
        seo_title_en: '',
        seo_title_zh: '',
        seo_description_id: '',
        seo_description_en: '',
        seo_description_zh: '',
        published: true,
        order: 0,
      });
    } catch (e) {
      console.error('Create page failed', e);
    }
  };

  const contentTypeIcons = {
    hero: Layout,
    about: Users,
    product: Package,
    project: Building,
    news: Newspaper,
    testimonial: MessageSquare,
    contact: FileText,
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading CMS...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Content Management System</h1>
              <p className="text-gray-600 mt-1">Manage your website content and media</p>
            </div>
            <div className="flex space-x-4">
              <Button onClick={() => router.push(withLang('/admin', language))} variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                Admin Dashboard
              </Button>
              <Button onClick={() => router.push(withLang('/dashboard', language))}>
                <Layout className="h-4 w-4 mr-2" />
                Website
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!canEdit && (
          <div className="mb-6 rounded-md border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-900">
            Akun Anda hanya punya akses baca. Hubungi admin untuk akses editor.
          </div>
        )}
        <Tabs defaultValue="content" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="pages">Pages</TabsTrigger>
            <TabsTrigger value="media">Media Library</TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-gray-900">Content Management</h2>
              <Dialog open={addOpen} onOpenChange={setAddOpen}>
                <DialogTrigger asChild>
                  <Button disabled={!canEdit}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Content
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Content</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block">Type</label>
                      <Select value={newContent.type} onValueChange={(v) => setNewContent(prev => ({ ...prev, type: v as CMSContent['type'] }))}>
                        <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="hero">Hero</SelectItem>
                          <SelectItem value="about">About</SelectItem>
                          <SelectItem value="product">Product</SelectItem>
                          <SelectItem value="project">Project</SelectItem>
                          <SelectItem value="news">News</SelectItem>
                          <SelectItem value="testimonial">Testimonial</SelectItem>
                          <SelectItem value="contact">Contact</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <label className="text-sm font-medium mb-1 block">Title (ID)</label>
                        <Input value={newContent.title_id} onChange={e => setNewContent(prev => ({ ...prev, title_id: e.target.value }))} />
                       {errors.title_id && <div className="text-xs text-red-600 mt-1">{errors.title_id}</div>}
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1 block">Title (EN)</label>
                        <Input value={newContent.title_en} onChange={e => setNewContent(prev => ({ ...prev, title_en: e.target.value }))} />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1 block">Title (ZH)</label>
                        <Input value={newContent.title_zh} onChange={e => setNewContent(prev => ({ ...prev, title_zh: e.target.value }))} />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <label className="text-sm font-medium mb-1 block">Content (ID)</label>
                        <Textarea value={newContent.content_id} onChange={e => setNewContent(prev => ({ ...prev, content_id: e.target.value }))} />
                      {errors.content_id && <div className="text-xs text-red-600 mt-1">{errors.content_id}</div>}
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1 block">Content (EN)</label>
                        <Textarea value={newContent.content_en} onChange={e => setNewContent(prev => ({ ...prev, content_en: e.target.value }))} />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1 block">Content (ZH)</label>
                        <Textarea value={newContent.content_zh} onChange={e => setNewContent(prev => ({ ...prev, content_zh: e.target.value }))} />
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Switch checked={newContent.published} onCheckedChange={(v) => setNewContent(prev => ({ ...prev, published: v }))} />
                        <span className="text-sm">Published</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <label className="text-sm">Order</label>
                        <Input type="number" value={newContent.order} onChange={e => setNewContent(prev => ({ ...prev, order: Number(e.target.value) }))} className="w-24" />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setAddOpen(false)}>Cancel</Button>
                      <Button onClick={handleCreateContent} disabled={!canEdit || !newContent.title_id || !newContent.content_id}>Create</Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {contents.map((content) => {
                const Icon = contentTypeIcons[content.type] || FileText;
                return (
                  <Card key={content.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Icon className="h-5 w-5 text-orange-600" />
                          <Badge variant="secondary">{content.type}</Badge>
                        </div>
                        <div className="flex space-x-1">
                          <Button size="sm" variant="ghost" onClick={() => handleReorder(content, -1)} title="Move up" disabled={!canEdit}>
                            ↑
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => handleReorder(content, +1)} title="Move down" disabled={!canEdit}>
                            ↓
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost" disabled={!canEdit} onClick={() => openEditDialog(content)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            onClick={() => handleDeleteContent(content.id)}
                            disabled={!canEdit}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <CardTitle className="text-lg">{content.title?.id || ''}</CardTitle>
                      <CardDescription>
                        Last updated: {new Date(content.updated_at).toLocaleDateString()}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 line-clamp-3">{content.content?.id || ''}</p>
                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Switch checked={!!content.metadata?.published} onCheckedChange={(v) => handleTogglePublish(content, v)} disabled={!canEdit} />
                          <span className="text-xs text-gray-600">{content.metadata?.published ? 'Published' : 'Draft'}</span>
                        </div>
                        <Badge variant="outline">Order: {content.metadata?.order ?? 0}</Badge>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <Dialog open={editOpen} onOpenChange={setEditOpen}>
              <DialogContent className="max-w-3xl">
                <DialogHeader>
                  <DialogTitle>Edit Content</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block">Type</label>
                      <Select value={editContent.type} onValueChange={(v) => setEditContent(prev => ({ ...prev, type: v as CMSContent['type'] }))}>
                        <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="hero">Hero</SelectItem>
                          <SelectItem value="about">About</SelectItem>
                          <SelectItem value="product">Product</SelectItem>
                          <SelectItem value="project">Project</SelectItem>
                          <SelectItem value="news">News</SelectItem>
                          <SelectItem value="testimonial">Testimonial</SelectItem>
                          <SelectItem value="contact">Contact</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Switch checked={editContent.published} onCheckedChange={(v) => setEditContent(prev => ({ ...prev, published: v }))} disabled={!canEdit} />
                        <span className="text-sm">Published</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <label className="text-sm">Order</label>
                        <Input type="number" value={editContent.order} onChange={e => setEditContent(prev => ({ ...prev, order: Number(e.target.value) }))} className="w-24" disabled={!canEdit} />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="text-sm font-medium mb-1 block">Title (ID)</label>
                      <Input value={editContent.title_id} onChange={e => setEditContent(prev => ({ ...prev, title_id: e.target.value }))} disabled={!canEdit} />
                      {errors.title_id && <div className="text-xs text-red-600 mt-1">{errors.title_id}</div>}
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Title (EN)</label>
                      <Input value={editContent.title_en} onChange={e => setEditContent(prev => ({ ...prev, title_en: e.target.value }))} disabled={!canEdit} />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Title (ZH)</label>
                      <Input value={editContent.title_zh} onChange={e => setEditContent(prev => ({ ...prev, title_zh: e.target.value }))} disabled={!canEdit} />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="text-sm font-medium mb-1 block">Content (ID)</label>
                      <Textarea value={editContent.content_id} onChange={e => setEditContent(prev => ({ ...prev, content_id: e.target.value }))} disabled={!canEdit} />
                      {errors.content_id && <div className="text-xs text-red-600 mt-1">{errors.content_id}</div>}
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Content (EN)</label>
                      <Textarea value={editContent.content_en} onChange={e => setEditContent(prev => ({ ...prev, content_en: e.target.value }))} disabled={!canEdit} />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Content (ZH)</label>
                      <Textarea value={editContent.content_zh} onChange={e => setEditContent(prev => ({ ...prev, content_zh: e.target.value }))} disabled={!canEdit} />
                    </div>
                  </div>

                  <div className="rounded-md border bg-white p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-sm font-medium">Preview</div>
                      <Select value={previewLang} onValueChange={(v) => setPreviewLang(v as any)}>
                        <SelectTrigger className="w-28"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="id">ID</SelectItem>
                          <SelectItem value="en">EN</SelectItem>
                          <SelectItem value="zh">ZH</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="text-base font-semibold text-gray-900 mb-2">
                      {previewLang === 'id' ? editContent.title_id : previewLang === 'en' ? (editContent.title_en || editContent.title_id) : (editContent.title_zh || editContent.title_en || editContent.title_id)}
                    </div>
                    <div className="text-sm text-gray-700 whitespace-pre-wrap">
                      {previewLang === 'id' ? editContent.content_id : previewLang === 'en' ? (editContent.content_en || editContent.content_id) : (editContent.content_zh || editContent.content_en || editContent.content_id)}
                    </div>
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button>
                    <Button onClick={handleUpdateContent} disabled={!canEdit || !editContent.title_id || !editContent.content_id}>Save</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </TabsContent>

          <TabsContent value="pages" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-gray-900">Page Management</h2>
              <Dialog open={addPageOpen} onOpenChange={setAddPageOpen}>
                <DialogTrigger asChild>
                  <Button disabled={!canEdit}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Page
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl">
                  <DialogHeader>
                    <DialogTitle>Add Page</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-1 block">Slug</label>
                      <Input value={newPage.slug} onChange={e => setNewPage(prev => ({ ...prev, slug: slugify(e.target.value) }))} disabled={!canEdit} />
                      {pageErrors.slug && <div className="text-xs text-red-600 mt-1">{pageErrors.slug}</div>}
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Switch checked={newPage.published} onCheckedChange={(v) => setNewPage(prev => ({ ...prev, published: v }))} disabled={!canEdit} />
                          <span className="text-sm">Published</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <label className="text-sm">Order</label>
                          <Input type="number" value={newPage.order} onChange={e => setNewPage(prev => ({ ...prev, order: Number(e.target.value) }))} className="w-24" disabled={!canEdit} />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <label className="text-sm font-medium mb-1 block">Title (ID)</label>
                        <Input value={newPage.title_id} onChange={e => setNewPage(prev => ({ ...prev, title_id: e.target.value }))} disabled={!canEdit} />
                      {pageErrors.title_id && <div className="text-xs text-red-600 mt-1">{pageErrors.title_id}</div>}
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1 block">Title (EN)</label>
                        <Input value={newPage.title_en} onChange={e => setNewPage(prev => ({ ...prev, title_en: e.target.value }))} disabled={!canEdit} />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1 block">Title (ZH)</label>
                        <Input value={newPage.title_zh} onChange={e => setNewPage(prev => ({ ...prev, title_zh: e.target.value }))} disabled={!canEdit} />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <label className="text-sm font-medium mb-1 block">Description (ID)</label>
                        <Textarea value={newPage.description_id} onChange={e => setNewPage(prev => ({ ...prev, description_id: e.target.value }))} disabled={!canEdit} />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1 block">Description (EN)</label>
                        <Textarea value={newPage.description_en} onChange={e => setNewPage(prev => ({ ...prev, description_en: e.target.value }))} disabled={!canEdit} />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1 block">Description (ZH)</label>
                        <Textarea value={newPage.description_zh} onChange={e => setNewPage(prev => ({ ...prev, description_zh: e.target.value }))} disabled={!canEdit} />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <label className="text-sm font-medium mb-1 block">Content (ID)</label>
                        <Textarea value={newPage.content_id} onChange={e => setNewPage(prev => ({ ...prev, content_id: e.target.value }))} disabled={!canEdit} />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1 block">Content (EN)</label>
                        <Textarea value={newPage.content_en} onChange={e => setNewPage(prev => ({ ...prev, content_en: e.target.value }))} disabled={!canEdit} />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1 block">Content (ZH)</label>
                        <Textarea value={newPage.content_zh} onChange={e => setNewPage(prev => ({ ...prev, content_zh: e.target.value }))} disabled={!canEdit} />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <label className="text-sm font-medium mb-1 block">SEO Title (ID)</label>
                        <Input value={newPage.seo_title_id} onChange={e => setNewPage(prev => ({ ...prev, seo_title_id: e.target.value }))} disabled={!canEdit} />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1 block">SEO Title (EN)</label>
                        <Input value={newPage.seo_title_en} onChange={e => setNewPage(prev => ({ ...prev, seo_title_en: e.target.value }))} disabled={!canEdit} />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1 block">SEO Title (ZH)</label>
                        <Input value={newPage.seo_title_zh} onChange={e => setNewPage(prev => ({ ...prev, seo_title_zh: e.target.value }))} disabled={!canEdit} />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <label className="text-sm font-medium mb-1 block">SEO Description (ID)</label>
                        <Textarea value={newPage.seo_description_id} onChange={e => setNewPage(prev => ({ ...prev, seo_description_id: e.target.value }))} disabled={!canEdit} />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1 block">SEO Description (EN)</label>
                        <Textarea value={newPage.seo_description_en} onChange={e => setNewPage(prev => ({ ...prev, seo_description_en: e.target.value }))} disabled={!canEdit} />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1 block">SEO Description (ZH)</label>
                        <Textarea value={newPage.seo_description_zh} onChange={e => setNewPage(prev => ({ ...prev, seo_description_zh: e.target.value }))} disabled={!canEdit} />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setAddPageOpen(false)}>Cancel</Button>
                      <Button onClick={handleCreatePage} disabled={!canEdit || !newPage.slug || !newPage.title_id}>Create</Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pages.map((page) => (
                <Card key={page.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline">/{page.slug}</Badge>
                      <div className="flex space-x-1">
                        <Button size="sm" variant="ghost" onClick={() => router.push(withLang(`/p/${page.slug}`, language))}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" disabled={!canEdit} onClick={() => openEditPageDialog(page)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <CardTitle className="text-lg">{page.title?.id || ''}</CardTitle>
                    <CardDescription>{page.description?.id || ''}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 line-clamp-3">{page.content?.id || ''}</p>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Switch checked={!!page.metadata?.published} onCheckedChange={(v) => handleTogglePagePublish(page, v)} disabled={!canEdit} />
                        <span className="text-xs text-gray-600">{page.metadata?.published ? 'Published' : 'Draft'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="ghost" onClick={() => handleReorderPage(page, -1)} disabled={!canEdit} title="Move up">↑</Button>
                        <Button size="sm" variant="ghost" onClick={() => handleReorderPage(page, +1)} disabled={!canEdit} title="Move down">↓</Button>
                        <Badge variant="outline">Order: {page.metadata?.order ?? 0}</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Dialog open={editPageOpen} onOpenChange={setEditPageOpen}>
              <DialogContent className="max-w-4xl">
                <DialogHeader>
                  <DialogTitle>Edit Page</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block">Slug</label>
                      <Input value={editPage.slug} onChange={e => setEditPage(prev => ({ ...prev, slug: slugify(e.target.value) }))} disabled={!canEdit} />
                      {pageErrors.slug && <div className="text-xs text-red-600 mt-1">{pageErrors.slug}</div>}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Switch checked={editPage.published} onCheckedChange={(v) => setEditPage(prev => ({ ...prev, published: v }))} disabled={!canEdit} />
                        <span className="text-sm">Published</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <label className="text-sm">Order</label>
                        <Input type="number" value={editPage.order} onChange={e => setEditPage(prev => ({ ...prev, order: Number(e.target.value) }))} className="w-24" disabled={!canEdit} />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="text-sm font-medium mb-1 block">Title (ID)</label>
                      <Input value={editPage.title_id} onChange={e => setEditPage(prev => ({ ...prev, title_id: e.target.value }))} disabled={!canEdit} />
                      {pageErrors.title_id && <div className="text-xs text-red-600 mt-1">{pageErrors.title_id}</div>}
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Title (EN)</label>
                      <Input value={editPage.title_en} onChange={e => setEditPage(prev => ({ ...prev, title_en: e.target.value }))} disabled={!canEdit} />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Title (ZH)</label>
                      <Input value={editPage.title_zh} onChange={e => setEditPage(prev => ({ ...prev, title_zh: e.target.value }))} disabled={!canEdit} />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="text-sm font-medium mb-1 block">Description (ID)</label>
                      <Textarea value={editPage.description_id} onChange={e => setEditPage(prev => ({ ...prev, description_id: e.target.value }))} disabled={!canEdit} />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Description (EN)</label>
                      <Textarea value={editPage.description_en} onChange={e => setEditPage(prev => ({ ...prev, description_en: e.target.value }))} disabled={!canEdit} />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Description (ZH)</label>
                      <Textarea value={editPage.description_zh} onChange={e => setEditPage(prev => ({ ...prev, description_zh: e.target.value }))} disabled={!canEdit} />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="text-sm font-medium mb-1 block">Content (ID)</label>
                      <Textarea value={editPage.content_id} onChange={e => setEditPage(prev => ({ ...prev, content_id: e.target.value }))} disabled={!canEdit} />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Content (EN)</label>
                      <Textarea value={editPage.content_en} onChange={e => setEditPage(prev => ({ ...prev, content_en: e.target.value }))} disabled={!canEdit} />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Content (ZH)</label>
                      <Textarea value={editPage.content_zh} onChange={e => setEditPage(prev => ({ ...prev, content_zh: e.target.value }))} disabled={!canEdit} />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="text-sm font-medium mb-1 block">SEO Title (ID)</label>
                      <Input value={editPage.seo_title_id} onChange={e => setEditPage(prev => ({ ...prev, seo_title_id: e.target.value }))} disabled={!canEdit} />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">SEO Title (EN)</label>
                      <Input value={editPage.seo_title_en} onChange={e => setEditPage(prev => ({ ...prev, seo_title_en: e.target.value }))} disabled={!canEdit} />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">SEO Title (ZH)</label>
                      <Input value={editPage.seo_title_zh} onChange={e => setEditPage(prev => ({ ...prev, seo_title_zh: e.target.value }))} disabled={!canEdit} />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="text-sm font-medium mb-1 block">SEO Description (ID)</label>
                      <Textarea value={editPage.seo_description_id} onChange={e => setEditPage(prev => ({ ...prev, seo_description_id: e.target.value }))} disabled={!canEdit} />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">SEO Description (EN)</label>
                      <Textarea value={editPage.seo_description_en} onChange={e => setEditPage(prev => ({ ...prev, seo_description_en: e.target.value }))} disabled={!canEdit} />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">SEO Description (ZH)</label>
                      <Textarea value={editPage.seo_description_zh} onChange={e => setEditPage(prev => ({ ...prev, seo_description_zh: e.target.value }))} disabled={!canEdit} />
                    </div>
                  </div>

                  <div className="rounded-md border bg-white p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-sm font-medium">Preview SEO</div>
                      <Select value={previewLang} onValueChange={(v) => setPreviewLang(v as any)}>
                        <SelectTrigger className="w-28"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="id">ID</SelectItem>
                          <SelectItem value="en">EN</SelectItem>
                          <SelectItem value="zh">ZH</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="text-base font-semibold text-gray-900 mb-2">
                      {previewLang === 'id' ? (editPage.seo_title_id || editPage.title_id) : previewLang === 'en' ? (editPage.seo_title_en || editPage.seo_title_id || editPage.title_en || editPage.title_id) : (editPage.seo_title_zh || editPage.seo_title_en || editPage.seo_title_id || editPage.title_zh || editPage.title_en || editPage.title_id)}
                    </div>
                    <div className="text-sm text-gray-700 whitespace-pre-wrap">
                      {previewLang === 'id' ? (editPage.seo_description_id || editPage.description_id) : previewLang === 'en' ? (editPage.seo_description_en || editPage.seo_description_id || editPage.description_en || editPage.description_id) : (editPage.seo_description_zh || editPage.seo_description_en || editPage.seo_description_id || editPage.description_zh || editPage.description_en || editPage.description_id)}
                    </div>
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setEditPageOpen(false)}>Cancel</Button>
                    <Button onClick={handleUpdatePage} disabled={!canEdit || !editPage.slug || !editPage.title_id}>Save</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </TabsContent>

          <TabsContent value="media" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-gray-900">Media Library</h2>
              <Button disabled={!canEdit}>
                <Plus className="h-4 w-4 mr-2" />
                Upload Media
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {media.map((mediaItem) => (
                <Card key={mediaItem.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    {mediaItem.type === 'image' ? (
                      <img 
                        src={mediaItem.url} 
                        alt={mediaItem.name}
                        className="w-full h-32 object-cover rounded-md mb-3"
                      />
                    ) : (
                      <div className="w-full h-32 bg-gray-100 rounded-md mb-3 flex items-center justify-center">
                        <FileText className="h-8 w-8 text-gray-400" />
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium truncate">{mediaItem.name}</p>
                        <p className="text-xs text-gray-500">{formatFileSize(mediaItem.size)}</p>
                      </div>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => handleDeleteMedia(mediaItem.id)}
                        disabled={!canEdit}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <Badge variant="outline" className="mt-2">
                      {mediaItem.type}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CMS;
