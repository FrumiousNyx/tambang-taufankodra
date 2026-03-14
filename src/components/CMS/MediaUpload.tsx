import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Upload, X, Image, Video, File } from 'lucide-react';
import { cmsService } from '@/lib/cms';
import { CMSMedia } from '@/types/cms';

interface MediaUploadProps {
  onUploadComplete: (media: CMSMedia) => void;
  onError?: (error: string) => void;
}

const MediaUpload: React.FC<MediaUploadProps> = ({ onUploadComplete, onError }) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [metadata, setMetadata] = useState({
    alt: {
      id: '',
      en: '',
      zh: '',
    },
    caption: {
      id: '',
      en: '',
      zh: '',
    },
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <Image className="h-8 w-8" />;
      case 'video':
        return <Video className="h-8 w-8" />;
      default:
        return <File className="h-8 w-8" />;
    }
  };

  const getFileType = (file: File): 'image' | 'video' | 'document' => {
    if (file.type.startsWith('image/')) return 'image';
    if (file.type.startsWith('video/')) return 'video';
    return 'document';
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (file: File) => {
    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      onError?.('File size must be less than 10MB');
      return;
    }

    setSelectedFile(file);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleMetadataChange = (field: 'alt' | 'caption', lang: string, value: string) => {
    setMetadata(prev => ({
      ...prev,
      [field]: {
        ...prev[field],
        [lang]: value,
      },
    }));
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    setProgress(0);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 100);

      const media = await cmsService.uploadMedia(selectedFile, metadata);
      
      clearInterval(progressInterval);
      setProgress(100);
      
      onUploadComplete(media);
      
      // Reset form
      setSelectedFile(null);
      setMetadata({
        alt: { id: '', en: '', zh: '' },
        caption: { id: '', en: '', zh: '' },
      });
      setProgress(0);
      
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Upload error:', error);
      onError?.(error instanceof Error ? error.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const languages = [
    { code: 'id', name: 'Bahasa Indonesia', flag: '🇮🇩' },
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Media</CardTitle>
        <CardDescription>
          Upload images, videos, or documents to your media library
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* File Upload Area */}
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive
              ? 'border-orange-500 bg-orange-50'
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleInputChange}
            accept="image/*,video/*,.pdf,.doc,.docx"
            className="hidden"
            id="file-upload"
          />
          
          {selectedFile ? (
            <div className="space-y-4">
              <div className="flex items-center justify-center space-x-4">
                {getFileIcon(getFileType(selectedFile))}
                <div className="text-left">
                  <p className="font-medium">{selectedFile.name}</p>
                  <p className="text-sm text-gray-500">{formatFileSize(selectedFile.size)}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedFile(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              {selectedFile.type.startsWith('image/') && (
                <img
                  src={URL.createObjectURL(selectedFile)}
                  alt="Preview"
                  className="max-h-32 mx-auto rounded"
                />
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <Upload className="h-12 w-12 text-gray-400 mx-auto" />
              <div>
                <p className="text-lg font-medium">Drop files here or click to browse</p>
                <p className="text-sm text-gray-500">
                  Supports images, videos, and documents (max 10MB)
                </p>
              </div>
              <Button asChild variant="outline">
                <label htmlFor="file-upload" className="cursor-pointer">
                  Choose File
                </label>
              </Button>
            </div>
          )}
        </div>

        {/* Metadata */}
        {selectedFile && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Media Details</h3>
            
            {languages.map(lang => (
              <div key={lang.code} className="space-y-3 p-4 border rounded-lg">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{lang.flag}</span>
                  <h4 className="font-medium">{lang.name}</h4>
                </div>
                
                <div>
                  <Label htmlFor={`alt-${lang.code}`}>Alt Text</Label>
                  <Input
                    id={`alt-${lang.code}`}
                    value={metadata.alt[lang.code as keyof typeof metadata.alt]}
                    onChange={(e) => handleMetadataChange('alt', lang.code, e.target.value)}
                    placeholder={`Alt text in ${lang.name}`}
                  />
                </div>
                
                <div>
                  <Label htmlFor={`caption-${lang.code}`}>Caption</Label>
                  <Textarea
                    id={`caption-${lang.code}`}
                    value={metadata.caption[lang.code as keyof typeof metadata.caption]}
                    onChange={(e) => handleMetadataChange('caption', lang.code, e.target.value)}
                    placeholder={`Caption in ${lang.name}`}
                    rows={2}
                  />
                </div>
              </div>
            ))}
            
            {/* Upload Progress */}
            {uploading && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Uploading...</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} />
              </div>
            )}
            
            {/* Upload Button */}
            <Button 
              onClick={handleUpload} 
              disabled={uploading}
              className="w-full"
            >
              {uploading ? 'Uploading...' : 'Upload Media'}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MediaUpload;
