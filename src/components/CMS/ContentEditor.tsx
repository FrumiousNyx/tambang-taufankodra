import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, X, Save, Eye, EyeOff } from 'lucide-react';
import { CMSContent, CMSPage } from '@/types/cms';
import { cmsService } from '@/lib/cms';
import { useLanguage } from '@/contexts/LanguageContext';

interface ContentEditorProps {
  content?: CMSContent;
  page?: CMSPage;
  onSave: (data: any) => void;
  onCancel: () => void;
}

const ContentEditor: React.FC<ContentEditorProps> = ({ content, page, onSave, onCancel }) => {
  const { language } = useLanguage();
  const [formData, setFormData] = useState({
    type: content?.type || 'hero',
    title: {
      id: content?.title?.id || page?.title?.id || '',
      en: content?.title?.en || page?.title?.en || '',
      zh: content?.title?.zh || page?.title?.zh || '',
    },
    content: {
      id: content?.content?.id || page?.content?.id || '',
      en: content?.content?.en || page?.content?.en || '',
      zh: content?.content?.zh || page?.content?.zh || '',
    },
    description: page?.description ? {
      id: page.description.id || '',
      en: page.description.en || '',
      zh: page.description.zh || '',
    } : undefined,
    slug: page?.slug || '',
    metadata: {
      image: content?.metadata?.image || page?.metadata?.image || '',
      category: content?.metadata?.category || '',
      tags: content?.metadata?.tags || [],
      published: content?.metadata?.published ?? page?.metadata?.published ?? true,
      featured: content?.metadata?.featured ?? false,
      order: content?.metadata?.order || page?.metadata?.order || 0,
      seo_title: page?.metadata?.seo_title || {},
      seo_description: page?.metadata?.seo_description || {},
    },
  });

  const [newTag, setNewTag] = useState('');
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(false);

  const handleLanguageChange = (field: 'title' | 'content' | 'description', lang: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: {
        ...prev[field],
        [lang]: value,
      },
    }));
  };

  const handleMetadataChange = (key: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      metadata: {
        ...prev.metadata,
        [key]: value,
      },
    }));
  };

  const handleAddTag = () => {
    if (newTag.trim()) {
      handleMetadataChange('tags', [...(formData.metadata.tags || []), newTag.trim()]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    handleMetadataChange('tags', formData.metadata.tags?.filter(tag => tag !== tagToRemove));
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploading(true);
      try {
        const media = await cmsService.uploadMedia(file, {
          alt: formData.title,
        });
        handleMetadataChange('image', media.url);
      } catch (error) {
        console.error('Error uploading image:', error);
      } finally {
        setUploading(false);
      }
    }
  };

  const handleSave = () => {
    const data = page ? {
      ...formData,
      slug: formData.slug,
      type: 'page',
    } : formData;
    
    onSave(data);
  };

  const contentTypes = [
    { value: 'hero', label: 'Hero Section' },
    { value: 'about', label: 'About Section' },
    { value: 'product', label: 'Product' },
    { value: 'project', label: 'Project' },
    { value: 'news', label: 'News/Article' },
    { value: 'testimonial', label: 'Testimonial' },
    { value: 'contact', label: 'Contact Info' },
  ];

  const languages = [
    { code: 'id', name: 'Bahasa Indonesia', flag: '🇮🇩' },
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
  ];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>
                {content ? 'Edit Content' : page ? 'Edit Page' : 'Create New Content'}
              </CardTitle>
              <CardDescription>
                Manage multilingual content for your website
              </CardDescription>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => setPreview(!preview)}>
                {preview ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
                {preview ? 'Edit' : 'Preview'}
              </Button>
              <Button variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {preview ? (
            <div className="space-y-6">
              <div className="border rounded-lg p-6">
                <h2 className="text-2xl font-bold mb-4">{formData.title[language]}</h2>
                {formData.metadata.image && (
                  <img 
                    src={formData.metadata.image} 
                    alt={formData.title[language]}
                    className="w-full h-64 object-cover rounded-lg mb-4"
                  />
                )}
                <div 
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: formData.content[language] }}
                />
                {formData.description && (
                  <p className="text-gray-600 mt-4">{formData.description[language]}</p>
                )}
              </div>
            </div>
          ) : (
            <Tabs defaultValue="basic" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="content">Content</TabsTrigger>
                <TabsTrigger value="media">Media</TabsTrigger>
                <TabsTrigger value="seo">SEO & Settings</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4">
                {!page && (
                  <div>
                    <Label htmlFor="type">Content Type</Label>
                    <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value as 'about' | 'hero' | 'product' | 'project' | 'news' | 'testimonial' | 'contact' }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {contentTypes.map(type => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {page && (
                  <div>
                    <Label htmlFor="slug">Page Slug</Label>
                    <Input
                      id="slug"
                      value={formData.slug}
                      onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                      placeholder="page-url"
                    />
                  </div>
                )}

                <div>
                  <Label>Category</Label>
                  <Input
                    value={formData.metadata.category}
                    onChange={(e) => handleMetadataChange('category', e.target.value)}
                    placeholder="Enter category"
                  />
                </div>

                <div>
                  <Label>Tags</Label>
                  <div className="flex space-x-2 mb-2">
                    <Input
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="Add tag"
                      onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                    />
                    <Button onClick={handleAddTag}>Add</Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.metadata.tags?.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="cursor-pointer">
                        {tag}
                        <X 
                          className="h-3 w-3 ml-1" 
                          onClick={() => handleRemoveTag(tag)}
                        />
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={formData.metadata.published}
                      onCheckedChange={(checked) => handleMetadataChange('published', checked)}
                    />
                    <Label>Published</Label>
                  </div>
                  {!page && (
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={formData.metadata.featured}
                        onCheckedChange={(checked) => handleMetadataChange('featured', checked)}
                      />
                      <Label>Featured</Label>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="content" className="space-y-4">
                {languages.map(lang => (
                  <div key={lang.code} className="space-y-4 p-4 border rounded-lg">
                    <div className="flex items-center space-x-2 mb-4">
                      <span className="text-lg">{lang.flag}</span>
                      <h3 className="font-semibold">{lang.name}</h3>
                    </div>
                    
                    <div>
                      <Label htmlFor={`title-${lang.code}`}>Title</Label>
                      <Input
                        id={`title-${lang.code}`}
                        value={formData.title[lang.code as keyof typeof formData.title]}
                        onChange={(e) => handleLanguageChange('title', lang.code, e.target.value)}
                        placeholder={`Title in ${lang.name}`}
                      />
                    </div>

                    <div>
                      <Label htmlFor={`content-${lang.code}`}>Content</Label>
                      <Textarea
                        id={`content-${lang.code}`}
                        value={formData.content[lang.code as keyof typeof formData.content]}
                        onChange={(e) => handleLanguageChange('content', lang.code, e.target.value)}
                        placeholder={`Content in ${lang.name}`}
                        rows={10}
                      />
                    </div>

                    {page && (
                      <div>
                        <Label htmlFor={`description-${lang.code}`}>Description</Label>
                        <Textarea
                          id={`description-${lang.code}`}
                          value={formData.description?.[lang.code as keyof typeof formData.description] || ''}
                          onChange={(e) => handleLanguageChange('description', lang.code, e.target.value)}
                          placeholder={`Description in ${lang.name}`}
                          rows={3}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="media" className="space-y-4">
                <div>
                  <Label>Featured Image</Label>
                  <div className="mt-2">
                    {formData.metadata.image ? (
                      <div className="relative">
                        <img 
                          src={formData.metadata.image} 
                          alt="Featured"
                          className="w-full h-64 object-cover rounded-lg"
                        />
                        <Button
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 right-2"
                          onClick={() => handleMetadataChange('image', '')}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600 mb-4">Upload featured image</p>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          disabled={uploading}
                          className="hidden"
                          id="image-upload"
                        />
                        <Button 
                          asChild 
                          variant="outline"
                          disabled={uploading}
                        >
                          <label htmlFor="image-upload" className="cursor-pointer">
                            {uploading ? 'Uploading...' : 'Choose Image'}
                          </label>
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="seo" className="space-y-4">
                {page && languages.map(lang => (
                  <div key={lang.code} className="space-y-4 p-4 border rounded-lg">
                    <div className="flex items-center space-x-2 mb-4">
                      <span className="text-lg">{lang.flag}</span>
                      <h3 className="font-semibold">SEO - {lang.name}</h3>
                    </div>
                    
                    <div>
                      <Label htmlFor={`seo-title-${lang.code}`}>SEO Title</Label>
                      <Input
                        id={`seo-title-${lang.code}`}
                        value={formData.metadata.seo_title?.[lang.code] || ''}
                        onChange={(e) => handleMetadataChange('seo_title', {
                          ...formData.metadata.seo_title,
                          [lang.code]: e.target.value,
                        })}
                        placeholder={`SEO Title in ${lang.name}`}
                      />
                    </div>

                    <div>
                      <Label htmlFor={`seo-description-${lang.code}`}>SEO Description</Label>
                      <Textarea
                        id={`seo-description-${lang.code}`}
                        value={formData.metadata.seo_description?.[lang.code] || ''}
                        onChange={(e) => handleMetadataChange('seo_description', {
                          ...formData.metadata.seo_description,
                          [lang.code]: e.target.value,
                        })}
                        placeholder={`SEO Description in ${lang.name}`}
                        rows={3}
                      />
                    </div>
                  </div>
                ))}

                <div>
                  <Label htmlFor="order">Display Order</Label>
                  <Input
                    id="order"
                    type="number"
                    value={formData.metadata.order}
                    onChange={(e) => handleMetadataChange('order', parseInt(e.target.value))}
                    placeholder="0"
                  />
                </div>
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ContentEditor;
