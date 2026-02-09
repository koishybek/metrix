import React from 'react';
import { Phone, Mail, Globe, Send } from 'lucide-react';
import { useI18n } from '../context/I18nContext';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const { t } = useI18n();

  return (
    <footer className="bg-white border-t border-gray-100 mt-auto">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="font-bold text-lg mb-4 text-gray-900">{t('footer.contacts')}</h3>
            <ul className="space-y-3">
              <li>
                <a 
                  href="https://wa.me/77776291638" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-gray-600 hover:text-green-500 transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  <span>WhatsApp: +7 777 629 16 38</span>
                </a>
              </li>
              <li>
                <a 
                  href="https://t.me/mrolzz" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-gray-600 hover:text-blue-500 transition-colors"
                >
                  <Send className="w-4 h-4" />
                  <span>Telegram: @mrolzz</span>
                </a>
              </li>
              <li>
                <a 
                  href="mailto:info@iot-exp.kz" 
                  className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  <span>Email: info@iot-exp.kz</span>
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4 text-gray-900">{t('footer.about')}</h3>
            <ul className="space-y-3">
              <li>
                <a 
                  href="https://iot-exp.kz" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors"
                >
                  <Globe className="w-4 h-4" />
                  <span>Сайт: iot-exp.kz</span>
                </a>
              </li>
              <li className="text-gray-500 text-sm">
                {t('footer.desc')}
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <p>© {currentYear} Metrix / SmartMetrix. {t('footer.rights')}</p>
          <p>{t('footer.made_with')}</p>
        </div>
      </div>
    </footer>
  );
};
