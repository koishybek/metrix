import React from 'react';
import { AlertCircle, MessageSquare, ArrowLeft } from 'lucide-react';

interface NoDataProps {
  serialNumber: string;
  onReset: () => void;
}

export const NoData: React.FC<NoDataProps> = ({ serialNumber, onReset }) => {
  return (
    <div className="w-full max-w-lg mx-auto animate-in fade-in zoom-in duration-300">
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="w-8 h-8 text-gray-400" />
        </div>
        
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          Данные не найдены
        </h3>
        <p className="text-gray-500 mb-6">
          По запросу <span className="font-mono font-medium text-gray-900 bg-gray-100 px-1.5 py-0.5 rounded">{serialNumber}</span> ничего не найдено.
        </p>

        <div className="bg-blue-50/50 rounded-xl p-5 text-left mb-8">
          <p className="text-sm font-medium text-gray-700 mb-3">Возможные причины:</p>
          <ul className="space-y-2.5">
            <li className="flex items-start gap-2.5 text-sm text-gray-600">
              <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-1.5 flex-shrink-0" />
              Прибор ещё не зарегистрирован в системе
            </li>
            <li className="flex items-start gap-2.5 text-sm text-gray-600">
              <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-1.5 flex-shrink-0" />
              Введён неверный номер или лицевой счёт
            </li>
            <li className="flex items-start gap-2.5 text-sm text-gray-600">
              <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-1.5 flex-shrink-0" />
              Временная техническая ошибка
            </li>
          </ul>
        </div>

        <div className="space-y-3">
          <a 
            href="https://wa.me/77776291638" 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-xl font-semibold transition-colors shadow-lg shadow-green-200"
          >
            <MessageSquare className="w-5 h-5" />
            Написать в WhatsApp
          </a>
          
          <button 
            onClick={onReset}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-gray-900 rounded-xl font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Ввести другой номер
          </button>
        </div>
      </div>
    </div>
  );
};
