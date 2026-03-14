import React, { useState, useMemo } from 'react';

interface SearchItem {
  id: string;
  title: string;
  titleEn?: string;
  description: string;
  descriptionEn?: string;
  category: 'product' | 'project';
  tags?: string[];
  tagsEn?: string[];
}

export const useSearch = (items: SearchItem[], searchTerm: string, language: 'id' | 'en') => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const filteredItems = useMemo(() => {
    if (!searchTerm.trim()) return items;

    const term = searchTerm.toLowerCase();
    
    return items.filter(item => {
      const title = language === 'id' ? item.title : (item.titleEn || item.title);
      const description = language === 'id' ? item.description : (item.descriptionEn || item.description);
      const tags = language === 'id' ? (item.tags || []) : (item.tagsEn || item.tags || []);
      
      return (
        title.toLowerCase().includes(term) ||
        description.toLowerCase().includes(term) ||
        tags.some(tag => tag.toLowerCase().includes(term))
      );
    });
  }, [items, searchTerm, language]);

  const highlightText = (text: string, term: string): React.ReactNode => {
    if (!term.trim()) return text;
    
    const regex = new RegExp(`(${term})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? React.createElement(
        'mark',
        {
          key: index,
          className: "bg-accent/20 text-accent px-1 rounded"
        },
        part
      ) : part
    );
  };

  return {
    filteredItems,
    isSearchOpen,
    setIsSearchOpen,
    highlightText
  };
};
