import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Phone, ArrowRight, Loader2, Globe } from 'lucide-react';
import { useI18n, Language } from '../context/I18nContext';

export const Login: React.FC = () => {
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { t, language, setLanguage } = useI18n();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) return;

    setIsLoading(true);
    try {
      let formattedPhone = phone;
      if (!phone.startsWith('+')) {
        formattedPhone = '+' + phone.replace(/\D/g, '');
      }
      
      await login(formattedPhone);
      navigate('/cabinet');
    } catch (error) {
      alert('Ошибка входа. Попробуйте еще раз.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-gray-100 relative">
        
        {/* Language Switcher */}
        <div className="absolute top-4 right-4 flex gap-2">
          <button 
            onClick={() => setLanguage('kz')} 
            className={`text-xs font-bold px-2 py-1 rounded-md transition-colors ${language === 'kz' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
          >KZ</button>
          <button 
            onClick={() => setLanguage('ru')} 
            className={`text-xs font-bold px-2 py-1 rounded-md transition-colors ${language === 'ru' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
          >RU</button>
          <button 
            onClick={() => setLanguage('en')} 
            className={`text-xs font-bold px-2 py-1 rounded-md transition-colors ${language === 'en' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
          >EN</button>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{t('login.title')}</h1>
          <p className="text-gray-500">{t('login.subtitle')}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">{t('login.phone_label')}</label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="tel"
                placeholder="+7 777 123 45 67"
                className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-lg"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || !phone}
            className="w-full py-4 bg-primary hover:bg-primary-hover text-white rounded-xl font-bold text-lg shadow-lg shadow-primary/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                {t('login.loading')}
              </>
            ) : (
              <>
                {t('login.button')}
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-400">
          {t('login.terms')}
        </div>
      </div>
    </div>
  );
};
