import { useState, useEffect } from 'react';
import { cmsService } from '@/lib/cms';
import { CMSContent, CMSPage, CMSMedia } from '@/types/cms';

export const useCMS = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Content hooks
  const useContent = (type: CMSContent['type'], language = 'id') => {
    const [contents, setContents] = useState<CMSContent[]>([]);

    const loadContents = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await cmsService.getContentByType(type, language);
        setContents(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load content');
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
      loadContents();
    }, [type, language]);

    const createContent = async (content: Partial<CMSContent>) => {
      try {
        setLoading(true);
        const newContent = await cmsService.createContent(content);
        setContents(prev => [...prev, newContent]);
        return newContent;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to create content');
        throw err;
      } finally {
        setLoading(false);
      }
    };

    const updateContent = async (id: string, updates: Partial<CMSContent>) => {
      try {
        setLoading(true);
        const updatedContent = await cmsService.updateContent(id, updates);
        setContents(prev => prev.map(c => c.id === id ? updatedContent : c));
        return updatedContent;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to update content');
        throw err;
      } finally {
        setLoading(false);
      }
    };

    const deleteContent = async (id: string) => {
      try {
        setLoading(true);
        await cmsService.deleteContent(id);
        setContents(prev => prev.filter(c => c.id !== id));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to delete content');
        throw err;
      } finally {
        setLoading(false);
      }
    };

    return {
      contents,
      loading,
      error,
      createContent,
      updateContent,
      deleteContent,
      refresh: loadContents,
    };
  };

  // Pages hooks
  const usePages = (language = 'id') => {
    const [pages, setPages] = useState<CMSPage[]>([]);

    const loadPages = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await cmsService.getPages(language);
        setPages(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load pages');
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
      loadPages();
    }, [language]);

    const getPageBySlug = async (slug: string, lang = language) => {
      try {
        setLoading(true);
        setError(null);
        return await cmsService.getPageBySlug(slug, lang);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load page');
        throw err;
      } finally {
        setLoading(false);
      }
    };

    return {
      pages,
      loading,
      error,
      getPageBySlug,
      refresh: loadPages,
    };
  };

  // Media hooks
  const useMedia = (type?: CMSMedia['type']) => {
    const [media, setMedia] = useState<CMSMedia[]>([]);

    const loadMedia = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await cmsService.getMedia(type);
        setMedia(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load media');
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
      loadMedia();
    }, [type]);

    const uploadMedia = async (file: File, metadata?: CMSMedia['metadata']) => {
      try {
        setLoading(true);
        const newMedia = await cmsService.uploadMedia(file, metadata);
        setMedia(prev => [newMedia, ...prev]);
        return newMedia;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to upload media');
        throw err;
      } finally {
        setLoading(false);
      }
    };

    const deleteMedia = async (id: string) => {
      try {
        setLoading(true);
        await cmsService.deleteMedia(id);
        setMedia(prev => prev.filter(m => m.id !== id));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to delete media');
        throw err;
      } finally {
        setLoading(false);
      }
    };

    return {
      media,
      loading,
      error,
      uploadMedia,
      deleteMedia,
      refresh: loadMedia,
    };
  };

  // Single content hook
  const useSingleContent = (id: string, language = 'id') => {
    const [content, setContent] = useState<CMSContent | null>(null);

    const loadContent = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        setError(null);
        const data = await cmsService.getContentById(id, language);
        setContent(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load content');
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
      loadContent();
    }, [id, language]);

    return {
      content,
      loading,
      error,
      refresh: loadContent,
    };
  };

  return {
    loading,
    error,
    useContent,
    usePages,
    useMedia,
    useSingleContent,
  };
};
