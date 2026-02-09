import React from 'react';
import { SavedMeter } from '../services/db';
import { Droplet, MapPin, ChevronRight, AlertCircle, Trash2 } from 'lucide-react';

interface MeterListItemProps {
  meter: SavedMeter;
  onClick: () => void;
  onDelete: (e: React.MouseEvent) => void;
}

export const MeterListItem: React.FC<MeterListItemProps> = ({ meter, onClick, onDelete }) => {
  const isOffline = meter.status === 'offline'; 
  
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
      <div className="bg-blue-500 py-3 px-4 flex justify-center items-center gap-2 text-white font-bold text-sm hover:bg-blue-600 transition-colors mt-2">
        Прикрепить лицевой счет
      </div>
    </div>
  );
};
