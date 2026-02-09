import React from 'react';
import { Droplet, User, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link, useLocation } from 'react-router-dom';
import { useI18n } from '../context/I18nContext';

export const Header: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const { t } = useI18n();

  return (
    <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform duration-300">
            <Droplet className="w-6 h-6 text-white" fill="currentColor" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-gray-900 leading-none">
              Metrix
            </h1>
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
              Powered by SmartMetrix
            </p>
          </div>
        </Link>
        
        <nav className="flex items-center gap-2">
          {/* Admin Link (Hidden) */}
          {location.pathname === '/admin' && (
             <span className="p-2 bg-red-50 text-red-500 rounded-full">
                <Shield className="w-5 h-5" />
             </span>
          )}

          {user ? (
            <Link 
              to="/cabinet" 
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all font-medium ${location.pathname === '/cabinet' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">{t('header.cabinet')}</span>
            </Link>
          ) : (
            <Link 
              to="/login"
              className={`px-5 py-2 rounded-xl font-bold transition-all ${location.pathname === '/login' ? 'bg-primary text-white' : 'text-primary hover:bg-blue-50'}`}
            >
              {t('header.login')}
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};
