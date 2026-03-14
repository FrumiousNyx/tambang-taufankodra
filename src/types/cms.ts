export interface CMSContent {
  id: string;
  type: 'hero' | 'about' | 'product' | 'project' | 'news' | 'testimonial' | 'contact';
  title: Record<string, string>; // id, en, zh
  content: Record<string, string>;
  metadata?: {
    image?: string;
    category?: string;
    tags?: string[];
    published?: boolean;
    featured?: boolean;
    order?: number;
  };
  created_at: string;
  updated_at: string;
  created_by: string;
  updated_by?: string;
}

export interface CMSPage {
  id: string;
  slug: string;
  title: Record<string, string>;
  description: Record<string, string>;
  content: Record<string, string>;
  metadata?: {
    image?: string;
    published?: boolean;
    seo_title?: Record<string, string>;
    seo_description?: Record<string, string>;
    order?: number;
  };
  created_at: string;
  updated_at: string;
  created_by: string;
  updated_by?: string;
}

export interface CMSMedia {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'video' | 'document';
  size: number;
  metadata?: {
    width?: number;
    height?: number;
    alt?: Record<string, string>;
    caption?: Record<string, string>;
  };
  created_at: string;
  created_by: string;
}
