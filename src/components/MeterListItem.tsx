import React, { useState } from 'react';
import { SavedMeter } from '../services/db';
import { Droplet, MapPin, ChevronRight, AlertCircle, Trash2, CheckCircle2, Loader2, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { createServiceRequest } from '../services/requests';

interface MeterListItemProps {
  meter: SavedMeter;
  onClick: () => void;
  onDelete: (e: React.MouseEvent) => void;
}

export const MeterListItem: React.FC<MeterListItemProps> = ({ meter, onClick, onDelete }) => {
  const isOffline = meter.status === 'offline'; 
  const { user } = useAuth();
  
  const [isAttaching, setIsAttaching] = useState(false);
  const [accountInput, setAccountInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleAttachClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAttaching(true);
  };

  const handleCancelAttach = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAttaching(false);
    setAccountInput('');
  };

  const handleAccountSubmit = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!user) {
      alert('Пожалуйста, войдите в систему');
      return;
    }

    if (!accountInput.trim()) {
      alert('Введите номер лицевого счета');
      return;
    }

    setIsSubmitting(true);
    try {
      await createServiceRequest(
        user.id,
        user.phone,
        'account_attach',
        `Запрос на прикрепление лицевого счета: ${accountInput}`,
        meter.serial,
        undefined,
        undefined
      );
      
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        setIsAttaching(false);
        setAccountInput('');
      }, 3000);
      
    } catch (error) {
      console.error('Error submitting account request:', error);
      alert('Ошибка при отправке запроса');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAccountInput(e.target.value);
  };
  
  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-2xl p-0 shadow-sm border border-gray-100 active:scale-[0.98] transition-all cursor-pointer relative group overflow-hidden"
    >
      {/* Status Stripe */}
      <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${isOffline ? 'bg-red-500' : 'bg-blue-500'}`} />

      <div className="flex justify-between items-start p-5 pl-6">
        <div className="space-y-3 flex-1">
          {/* Account Number */}
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-gray-900 tracking-tight">
              {meter.account || 'Нет Л/С'}
            </h3>
            <p className="text-xs font-medium text-gray-400">
              ГКП на ПХВ "Астана Су Арнасы"
            </p>
          </div>

          {/* Address */}
          <div className="text-xs text-gray-500 font-medium line-clamp-2 pr-4">
            {meter.address}
          </div>
        </div>

        <div className="flex flex-col items-end gap-3">
          {isOffline && (
            <div className="p-1.5 bg-red-50 rounded-full">
              <AlertCircle className="w-4 h-4 text-red-500" />
            </div>
          )}
          <button 
            onClick={onDelete}
            className="p-2 text-gray-300 hover:text-red-500 transition-colors z-10"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Footer Action */}
      <div 
        className="bg-blue-500 min-h-[48px] px-4 flex justify-center items-center text-white font-bold text-sm hover:bg-blue-600 transition-colors mt-2 relative overflow-hidden"
        onClick={(e) => isAttaching && e.stopPropagation()}
      >
        {isSuccess ? (
           <div className="flex items-center gap-2 animate-in zoom-in">
             <CheckCircle2 className="w-5 h-5" />
             <span>Запрос отправлен!</span>
           </div>
        ) : isAttaching ? (
          <div className="flex items-center gap-2 w-full animate-in slide-in-from-bottom duration-300">
            <input
              type="text"
              value={accountInput}
              onChange={handleInputChange}
              placeholder="Введите номер Л/С"
              className="flex-1 bg-white/20 border border-white/40 rounded-lg px-3 py-1.5 text-white placeholder:text-white/70 outline-none focus:bg-white/30 text-sm"
              autoFocus
            />
            <button 
              onClick={handleAccountSubmit}
              disabled={isSubmitting}
              className="p-1.5 bg-white text-blue-500 rounded-lg hover:bg-white/90 disabled:opacity-70"
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
            </button>
            <button 
              onClick={handleCancelAttach}
              className="p-1.5 hover:bg-white/20 rounded-lg text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button 
            onClick={handleAttachClick}
            className="w-full h-full py-3 flex items-center justify-center gap-2"
          >
            Прикрепить лицевой счет
          </button>
        )}
      </div>
    </div>
  );
};
