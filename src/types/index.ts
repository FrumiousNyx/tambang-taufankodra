// Database Types
export interface Product {
  id: string;
  slug: string;
  name: string;
  name_en: string;
  name_zh?: string;
  tagline?: string;
  tagline_en?: string;
  tagline_zh?: string;
  description?: string;
  description_en?: string;
  description_zh?: string;
  features?: string[];
  features_en?: string[];
  features_zh?: string[];
  applications?: string[];
  applications_en?: string[];
  applications_zh?: string[];
  specs?: Record<string, any>;
  specs_en?: Record<string, any>;
  specs_zh?: Record<string, any>;
  color?: string;
  image_url?: string;
  datasheet_url?: string;
  status: 'active' | 'inactive' | 'discontinued';
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  title_en: string;
  client: string;
  client_en: string;
  location: string;
  location_en: string;
  volume: string;
  scope: string;
  scope_en: string;
  year: number;
  duration: string;
  duration_en: string;
  products?: string[];
  highlights?: string[];
  highlights_en?: string[];
  image_url?: string;
  status: 'active' | 'inactive' | 'completed';
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface ContactForm {
  name: string;
  company: string;
  email: string;
  phone: string;
  projectType: string;
  projectValue: string;
  location: string;
  message: string;
  requestProposal: boolean;
}

export interface ContactFormErrors {
  name?: string;
  company?: string;
  email?: string;
  phone?: string;
  projectType?: string;
  projectValue?: string;
  location?: string;
  message?: string;
}

// UI Types
export interface LoadingState {
  isLoading: boolean;
  error?: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

// Language Types
export type Language = 'id' | 'en';

export interface TranslationKeys {
  navigation: Record<string, string>;
  hero: Record<string, string>;
  stats: Record<string, string>;
  products: Record<string, string>;
  projects: Record<string, string>;
  contact: Record<string, string>;
  common: Record<string, string>;
}

// Component Props
export interface LazyLoadProps {
  componentPath: string;
  fallback?: React.ReactNode;
  delay?: number;
}

export interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
  className?: string;
}

// Stats Type
export interface StatItem {
  icon: React.ComponentType<any>;
  value: string;
  label: string;
  suffix?: string;
}

// Error Types
export interface AppError {
  message: string;
  code?: string;
  stack?: string;
  timestamp: string;
}

// Dashboard Types
export interface DashboardStats {
  totalProducts: number;
  totalProjects: number;
  totalContacts: number;
  recentActivity: Array<{
    id: string;
    type: string;
    message: string;
    timestamp: string;
  }>;
}
