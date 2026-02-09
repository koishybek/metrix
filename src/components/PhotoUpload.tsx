import React, { useState, useRef } from 'react';
import { Camera, Check, Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';

export const PhotoUpload: React.FC = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleUpload(file);
    }
  };

  const handleUpload = (file: File) => {
    setIsUploading(true);
    
    // Simulate upload process
    // TODO: Replace with actual API endpoint to upload photo
    console.log('Uploading photo:', file.name);
    
    setTimeout(() => {
      setIsUploading(false);
      setIsSuccess(true);
      
      // Reset success message after 3 seconds
      setTimeout(() => {
        setIsSuccess(false);
      }, 3000);
    }, 2000);
  };

  const triggerCamera = () => {
    fileInputRef.current?.click();
  };

  if (isSuccess) {
    return (
      <div className="bg-success/10 border border-success/20 rounded-xl p-4 flex items-center justify-center gap-2 text-success-dark animate-in fade-in zoom-in duration-300">
        <Check className="w-5 h-5" />
        <span className="font-medium">Фото успешно отправлено!</span>
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
        disabled={isUploading}
        className={cn(
          "w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl border-2 border-dashed transition-all duration-200",
          isUploading 
            ? "bg-muted border-muted-foreground/20 cursor-wait text-muted-foreground" 
            : "bg-background border-primary/30 text-primary hover:bg-primary/5 hover:border-primary/50 active:scale-[0.98]"
        )}
      >
        {isUploading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Отправка фото...</span>
          </>
        ) : (
          <>
            <Camera className="w-5 h-5" />
            <span className="font-medium">Сфотографировать показания</span>
          </>
        )}
      </button>
      <p className="text-xs text-center text-muted-foreground mt-2">
        Мы обработаем фото и обновим данные в течение 24 часов
      </p>
    </div>
  );
};
