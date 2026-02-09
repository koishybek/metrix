import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <Loader2 className="w-12 h-12 text-primary animate-spin" />
      <p className="mt-4 text-muted-foreground animate-pulse">Загрузка данных...</p>
    </div>
  );
};
