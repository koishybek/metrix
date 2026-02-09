import React from 'react';
import { LucideIcon, ChevronRight } from 'lucide-react';

interface ServiceCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  onClick: () => void;
  colorClass?: string;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ 
  icon: Icon, 
  title, 
  description, 
  onClick,
  colorClass = "text-blue-500 bg-blue-50"
}) => {
  return (
    <button 
      onClick={onClick}
      className="w-full bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:bg-gray-50 transition-all active:scale-[0.98] text-left"
    >
      <div className={`p-3 rounded-xl ${colorClass}`}>
        <Icon className="w-6 h-6" />
      </div>
      
      <div className="flex-1">
        <h4 className="font-bold text-gray-900 mb-0.5">{title}</h4>
        <p className="text-xs text-gray-500 line-clamp-2">{description}</p>
      </div>

      <ChevronRight className="w-5 h-5 text-gray-300" />
    </button>
  );
};
