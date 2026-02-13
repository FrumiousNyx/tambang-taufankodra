import { createClient } from '@supabase/supabase-js';
import { CMSContent, CMSPage, CMSMedia } from '@/types/cms';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!
);

// Content Management
export const cmsService = {
  // Get all content by type
  async getContentByType(type: CMSContent['type'], language = 'id') {
    const { data, error } = await supabase
      .from('cms_content')
      .select('*')
      .eq('type', type)
      .eq('metadata->>published', 'true')
      .order('metadata->>order', { ascending: true });

    if (error) throw error;
    
    return data.map(item => ({
      ...item,
      title: item.title[language] || item.title.id,
      content: item.content[language] || item.content.id,
    }));
  },

  // Get single content by ID
  async getContentById(id: string, language = 'id') {
    const { data, error } = await supabase
      .from('cms_content')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    
    return {
      ...data,
      title: data.title[language] || data.title.id,
      content: data.content[language] || data.content.id,
    };
  },

  // Create new content
  async createContent(content: Partial<CMSContent>) {
    const { data, error } = await supabase
      .from('cms_content')
      .insert({
        ...content,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update content
  async updateContent(id: string, updates: Partial<CMSContent>) {
    const { data, error } = await supabase
      .from('cms_content')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete content
  async deleteContent(id: string) {
    const { error } = await supabase
      .from('cms_content')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // Get all pages
  async getPages(language = 'id') {
    const { data, error } = await supabase
      .from('cms_pages')
      .select('*')
      .eq('metadata->>published', 'true')
      .order('metadata->>order', { ascending: true });

    if (error) throw error;
    
    return data.map(item => ({
      ...item,
      title: item.title[language] || item.title.id,
      description: item.description[language] || item.description.id,
      content: item.content[language] || item.content.id,
    }));
  },

  // Get page by slug
  async getPageBySlug(slug: string, language = 'id') {
    const { data, error } = await supabase
      .from('cms_pages')
      .select('*')
      .eq('slug', slug)
      .eq('metadata->>published', 'true')
      .single();

    if (error) throw error;
    
    return {
      ...data,
      title: data.title[language] || data.title.id,
      description: data.description[language] || data.description.id,
      content: data.content[language] || data.content.id,
    };
  },

  // Upload media
  async uploadMedia(file: File, metadata?: CMSMedia['metadata']) {
    const fileName = `${Date.now()}-${file.name}`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('cms-media')
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    const { data: publicUrl } = supabase.storage
      .from('cms-media')
      .getPublicUrl(fileName);

    const { data, error } = await supabase
      .from('cms_media')
      .insert({
        name: file.name,
        url: publicUrl.publicUrl,
        type: file.type.startsWith('image/') ? 'image' : 
              file.type.startsWith('video/') ? 'video' : 'document',
        size: file.size,
        metadata,
        created_at: new Date().toISOString(),
        created_by: 'admin', // TODO: Get from auth context
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Get media files
  async getMedia(type?: CMSMedia['type']) {
    let query = supabase.from('cms_media').select('*');
    
    if (type) {
      query = query.eq('type', type);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Delete media
  async deleteMedia(id: string) {
    // Get media info first
    const { data: media } = await supabase
      .from('cms_media')
      .select('url')
      .eq('id', id)
      .single();

    if (media) {
      // Extract file name from URL
      const fileName = media.url.split('/').pop();
      if (fileName) {
        await supabase.storage
          .from('cms-media')
          .remove([fileName]);
      }
    }

    // Delete from database
    const { error } = await supabase
      .from('cms_media')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },
};
