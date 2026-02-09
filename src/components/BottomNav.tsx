import React from 'react';
import { Home, Wrench, User } from 'lucide-react';

interface BottomNavProps {
  activeTab: 'meters' | 'services' | 'profile';
  onChange: (tab: 'meters' | 'services' | 'profile') => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onChange }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 pb-safe pt-2 px-6 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-40">
      <div className="flex justify-around items-center">
        <button
          onClick={() => onChange('meters')}
          className={`flex flex-col items-center gap-1 p-2 transition-colors ${
            activeTab === 'meters' ? 'text-primary' : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          <Home className={`w-6 h-6 ${activeTab === 'meters' ? 'fill-current' : ''}`} />
          <span className="text-[10px] font-medium">Счётчики</span>
        </button>

        <button
          onClick={() => onChange('services')}
          className={`flex flex-col items-center gap-1 p-2 transition-colors ${
            activeTab === 'services' ? 'text-primary' : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          <Wrench className={`w-6 h-6 ${activeTab === 'services' ? 'fill-current' : ''}`} />
          <span className="text-[10px] font-medium">Услуги</span>
        </button>

        <button
          onClick={() => onChange('profile')}
          className={`flex flex-col items-center gap-1 p-2 transition-colors ${
            activeTab === 'profile' ? 'text-primary' : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          <User className={`w-6 h-6 ${activeTab === 'profile' ? 'fill-current' : ''}`} />
          <span className="text-[10px] font-medium">Профиль</span>
        </button>
      </div>
    </div>
  );
};
