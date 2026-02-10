import React, { useState, useRef } from 'react';
import { Camera, Check, Loader2, Image as ImageIcon, X } from 'lucide-react';
import { cn } from '../lib/utils';

interface PhotoUploadProps {
  onFileSelect?: (file: File | null) => void;
  isLoading?: boolean;
}

export const PhotoUpload: React.FC<PhotoUploadProps> = ({ onFileSelect, isLoading = false }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      if (onFileSelect) {
        onFileSelect(file);
      }
    }
  };

  const handleClear = () => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    if (onFileSelect) {
      onFileSelect(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerCamera = () => {
    fileInputRef.current?.click();
  };

  if (selectedFile && previewUrl) {
    return (
      <div className="relative rounded-xl overflow-hidden border border-gray-200">
        <img src={previewUrl} alt="Preview" className="w-full h-48 object-cover" />
        <button 
          onClick={handleClear}
          className="absolute top-2 right-2 p-1 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
          disabled={isLoading}
        >
          <X className="w-5 h-5" />
        </button>
        <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-2 text-white text-xs flex items-center gap-2">
          <Check className="w-4 h-4 text-green-400" />
          <span>Фото выбрано</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <input 
        type="file" 
        accept="image/*" 
        capture="environment" 
        className="hidden" 
        ref={fileInputRef}
        onChange={handleFileChange}
      />
      
      <button 
        onClick={triggerCamera}
        disabled={isLoading}
        className={cn(
          "w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl border-2 border-dashed transition-all duration-200",
          isLoading 
            ? "bg-muted border-muted-foreground/20 cursor-wait text-muted-foreground" 
            : "bg-background border-primary/30 text-primary hover:bg-primary/5 hover:border-primary/50 active:scale-[0.98]"
        )}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Загрузка...</span>
          </>
        ) : (
          <>
            <Camera className="w-5 h-5" />
            <span className="font-medium">Сфотографировать показания</span>
          </>
        )}
      </button>
      <p className="text-xs text-center text-muted-foreground mt-2">
        Прикрепите фото счетчика для подтверждения
      </p>
    </div>
  );
};
