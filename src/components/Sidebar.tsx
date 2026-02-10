import React from 'react';
import { Home, Wrench, User, Bell, X, LogOut, HelpCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useI18n } from '../context/I18nContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: 'meters' | 'services' | 'notifications' | 'profile' | 'faq';
  onChange: (tab: 'meters' | 'services' | 'notifications' | 'profile' | 'faq') => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, activeTab, onChange }) => {
  const { user, logout } = useAuth();
  const { t, language, setLanguage } = useI18n();

  const handleNav = (tab: any) => {
    onChange(tab);
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Sidebar Panel */}
      <div 
        className={`fixed top-0 left-0 bottom-0 w-[280px] bg-white z-50 shadow-2xl transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6 flex flex-col h-full">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-bold text-gray-900">{t('menu.title')}</h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>

          {/* User Info */}
          <div className="mb-8 p-4 bg-gray-50 rounded-2xl flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
              {user?.phone.slice(-2)}
            </div>
            <div>
              <p className="font-bold text-gray-900">{user?.phone}</p>
              <p className="text-xs text-gray-500">{t('menu.client_type')}</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="space-y-2 flex-1">
            <button
              onClick={() => handleNav('meters')}
              className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all ${
                activeTab === 'meters' ? 'bg-blue-50 text-blue-600 font-bold' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Home className="w-5 h-5" />
              {t('menu.meters')}
            </button>

            <button
              onClick={() => handleNav('services')}
              className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all ${
                activeTab === 'services' ? 'bg-blue-50 text-blue-600 font-bold' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Wrench className="w-5 h-5" />
              {t('menu.services')}
            </button>

            <button
              onClick={() => handleNav('notifications')}
              className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all ${
                activeTab === 'notifications' ? 'bg-blue-50 text-blue-600 font-bold' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Bell className="w-5 h-5" />
              {t('menu.notifications')}
            </button>

            <button
              onClick={() => handleNav('profile')}
              className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all ${
                activeTab === 'profile' ? 'bg-blue-50 text-blue-600 font-bold' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <User className="w-5 h-5" />
              {t('menu.profile')}
            </button>

            <button
              onClick={() => handleNav('faq')}
              className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all ${
                activeTab === 'faq' ? 'bg-blue-50 text-blue-600 font-bold' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <HelpCircle className="w-5 h-5" />
              {t('menu.faq')}
            </button>
          </nav>

          {/* Language Switcher */}
          <div className="flex gap-2 justify-center mb-6 bg-gray-50 p-2 rounded-xl">
            <button 
              onClick={() => setLanguage('kz')} 
              className={`flex-1 text-xs font-bold py-2 rounded-lg transition-colors ${language === 'kz' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500'}`}
            >KZ</button>
            <button 
              onClick={() => setLanguage('ru')} 
              className={`flex-1 text-xs font-bold py-2 rounded-lg transition-colors ${language === 'ru' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500'}`}
            >RU</button>
            <button 
              onClick={() => setLanguage('en')} 
              className={`flex-1 text-xs font-bold py-2 rounded-lg transition-colors ${language === 'en' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500'}`}
            >EN</button>
          </div>

          {/* Footer */}
          <div className="space-y-2">
            <button 
              onClick={logout}
              className="w-full flex items-center gap-4 p-4 text-red-500 hover:bg-red-50 rounded-xl transition-colors font-medium"
            >
              <LogOut className="w-5 h-5" />
              {t('menu.logout')}
            </button>
            <p className="text-center text-[10px] text-gray-300">v1.2 (Vercel)</p>
          </div>
        </div>
      </div>
    </>
  );
};
