import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Image, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Settings,
  Layout,
  Newspaper,
  MessageSquare,
  Star,
  Package,
  Building,
  Users
} from 'lucide-react';
import { cmsService } from '@/lib/cms';
import { CMSContent, CMSPage, CMSMedia } from '@/types/cms';
import { useLanguage } from '@/contexts/LanguageContext';

const CMS: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [contents, setContents] = useState<CMSContent[]>([]);
  const [pages, setPages] = useState<CMSPage[]>([]);
  const [media, setMedia] = useState<CMSMedia[]>([]);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    loadData();
  }, [user, navigate]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [contentsData, pagesData, mediaData] = await Promise.all([
        cmsService.getContentByType('hero'),
        cmsService.getPages(),
        cmsService.getMedia()
      ]);
      
      setContents(contentsData);
      setPages(pagesData);
      setMedia(mediaData);
    } catch (error) {
      console.error('Error loading CMS data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteContent = async (id: string) => {
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
    if (window.confirm('Are you sure you want to delete this media file?')) {
      try {
        await cmsService.deleteMedia(id);
        setMedia(media.filter(m => m.id !== id));
      } catch (error) {
        console.error('Error deleting media:', error);
      }
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
              <Button onClick={() => navigate('/admin')} variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                Admin Dashboard
              </Button>
              <Button onClick={() => navigate('/dashboard')}>
                <Layout className="h-4 w-4 mr-2" />
                Website
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="content" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="pages">Pages</TabsTrigger>
            <TabsTrigger value="media">Media Library</TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-gray-900">Content Management</h2>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Content
              </Button>
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
                          <Button size="sm" variant="ghost">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            onClick={() => handleDeleteContent(content.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <CardTitle className="text-lg">{content.title}</CardTitle>
                      <CardDescription>
                        Last updated: {new Date(content.updated_at).toLocaleDateString()}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 line-clamp-3">
                        {content.content}
                      </p>
                      {content.metadata?.published && (
                        <Badge variant="default" className="mt-2">
                          Published
                        </Badge>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="pages" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-gray-900">Page Management</h2>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Page
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pages.map((page) => (
                <Card key={page.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline">/{page.slug}</Badge>
                      <div className="flex space-x-1">
                        <Button size="sm" variant="ghost">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <CardTitle className="text-lg">{page.title}</CardTitle>
                    <CardDescription>{page.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 line-clamp-3">
                      {page.content}
                    </p>
                    {page.metadata?.published && (
                      <Badge variant="default" className="mt-2">
                        Published
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="media" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-gray-900">Media Library</h2>
              <Button>
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
