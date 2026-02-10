import React from 'react';
import { CheckCircle2 } from 'lucide-react';

interface SuccessAnimationProps {
  isVisible: boolean;
  message?: string;
}

export const SuccessAnimation: React.FC<SuccessAnimationProps> = ({ isVisible, message = 'Успешно!' }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl p-8 flex flex-col items-center gap-4 shadow-2xl animate-in zoom-in-95 duration-300 transform scale-110">
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-2">
          <CheckCircle2 className="w-12 h-12 text-green-500 animate-in zoom-in duration-500 delay-150" />
        </div>
        <h3 className="text-xl font-bold text-gray-900">{message}</h3>
      </div>
    </div>
  );
};
