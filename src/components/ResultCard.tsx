import React, { useState } from 'react';
import { 
  MapPin, 
  FileText, 
  Hash, 
  Clock, 
  Activity, 
  Signal, 
  User,
  Info,
  Wifi,
  WifiOff,
  Calendar,
  MessageCircle,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Loader2
} from 'lucide-react';
import { MeterData } from '../types';
import { cn, generateWhatsAppLink } from '../lib/utils';
import { HistoryAccordion } from './HistoryAccordion';
import { HistoryChart } from './HistoryChart';
import { PhotoUpload } from './PhotoUpload';
import { formatDistanceToNow, isToday, isYesterday } from 'date-fns';
import { ru } from 'date-fns/locale';

interface ResultCardProps {
  data: MeterData;
  onReset: () => void;
  onRefresh?: () => void;
  isLoading?: boolean;
}

export const ResultCard: React.FC<ResultCardProps> = ({ data, onReset, onRefresh, isLoading = false }) => {
  const [showHistory, setShowHistory] = useState(false);
  const lastUpdateDate = new Date(data.last_update);
  const daysSinceUpdate = Math.floor((Date.now() - lastUpdateDate.getTime()) / (1000 * 60 * 60 * 24));
  const isOffline = data.status !== 'online' || daysSinceUpdate > 3;

  // Freshness Indicator Logic
  const getFreshnessStatus = () => {
    if (isToday(lastUpdateDate) || isYesterday(lastUpdateDate)) {
      return { color: 'bg-success', text: 'Актуальные данные' };
    } else if (daysSinceUpdate <= 2) {
      return { color: 'bg-warning', text: 'Данные за 2 дня' };
    } else {
      return { color: 'bg-destructive', text: 'Устаревшие данные' };
    }
  };

  const freshness = getFreshnessStatus();

  const getSignalConfig = (coverage?: string) => {
    switch (coverage) {
      case 'excellent':
        return { icon: Signal, color: 'text-success', text: 'Отличное' };
      case 'good':
        return { icon: Signal, color: 'text-primary', text: 'Хорошее' };
      case 'satisfactory':
        return { icon: Signal, color: 'text-warning', text: 'Удовлетворительное' };
      case 'poor':
        return { icon: Signal, color: 'text-destructive', text: 'Плохое' };
      default:
        return { icon: Signal, color: 'text-muted-foreground', text: 'Неизвестно' };
    }
  };

  const signalConfig = getSignalConfig(data.coverage);
  const SignalIcon = signalConfig.icon;

  const whatsappLink = generateWhatsAppLink({
    type: 'meter_detail',
    meter: data
  });

  return (
    <div className="w-full max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700 relative">
      {isLoading && (
        <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-50 flex items-center justify-center rounded-2xl">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
        </div>
      )}
      
      <div className="bg-card rounded-2xl shadow-lg border border-border overflow-hidden">
        {/* Header Status Bar */}
        <div className={cn(
          "px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between border-b gap-3 sm:gap-0",
          data.status === 'online' ? "bg-success/10 border-success/20" : "bg-destructive/10 border-destructive/20"
        )}>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              {data.status === 'online' ? (
                <Wifi className="w-5 h-5 text-success" />
              ) : (
                <WifiOff className="w-5 h-5 text-destructive" />
              )}
              <span className={cn(
                "font-bold text-sm uppercase tracking-wide",
                data.status === 'online' ? "text-success-dark" : "text-destructive-dark"
              )}>
                {data.status === 'online' ? 'На связи' : `Не на связи (${daysSinceUpdate} дн.)`}
              </span>
            </div>
            
            {/* Smart Freshness Text */}
            <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <div className={cn("w-2 h-2 rounded-full", freshness.color)} />
              <span>
                {isToday(lastUpdateDate) 
                  ? `Обновлено сегодня в ${lastUpdateDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`
                  : isYesterday(lastUpdateDate)
                    ? 'Обновлено вчера'
                    : `Последний раз ${formatDistanceToNow(lastUpdateDate, { addSuffix: true, locale: ru })}`
                }
              </span>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Main Info Grid */}
          <div className="grid gap-x-4 gap-y-6 md:grid-cols-2">
            
            {/* Consumer Info */}
            {data.consumer && (
              <div className="col-span-2 space-y-1">
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <User className="w-4 h-4" />
                  <span>Потребитель</span>
                </div>
                <p className="font-medium text-foreground leading-snug text-lg">{data.consumer}</p>
              </div>
            )}

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <MapPin className="w-4 h-4" />
                <span>Адрес установки</span>
              </div>
              <p className="font-medium text-foreground leading-snug">{data.address}</p>
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <FileText className="w-4 h-4" />
                <span>Лицевой счёт / Договор</span>
              </div>
              <p className="font-medium text-foreground">{data.account}</p>
            </div>

            {/* Technical Info */}
            {data.device_type && (
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <Info className="w-4 h-4" />
                  <span>Тип устройства</span>
                </div>
                <p className="font-medium text-foreground">{data.device_type}</p>
              </div>
            )}

            {data.join_date && (
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <Calendar className="w-4 h-4" />
                  <span>Дата подключения</span>
                </div>
                <p className="font-medium text-foreground">{new Date(data.join_date).toLocaleDateString()}</p>
              </div>
            )}
          </div>

          <div className="h-px bg-border" />

          {/* Meter Readings */}
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="bg-primary/5 rounded-xl p-4 space-y-2 border border-primary/10">
              <div className="flex items-center gap-2 text-primary text-sm font-medium">
                <Hash className="w-4 h-4" />
                <span>Текущее показание</span>
              </div>
              <div className="text-3xl font-bold text-foreground tabular-nums">
                {data.reading.toFixed(3)} <span className="text-lg text-muted-foreground font-normal">м³</span>
              </div>
              <div className="text-xs text-muted-foreground flex flex-col gap-0.5">
                <span>Серийный №: {data.serial}</span>
                {data.device_eui && <span>EUI: {data.device_eui}</span>}
              </div>
            </div>

            <div className="grid gap-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Activity className="w-4 h-4" />
                  <span>Расход за сутки</span>
                </div>
                <span className="font-semibold text-foreground">
                  {data.last_consumption !== undefined ? data.last_consumption.toFixed(3) : '0.000'} м³
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <SignalIcon className={cn("w-4 h-4", signalConfig.color)} />
                  <span>Уровень сигнала</span>
                </div>
                <span className={cn("font-semibold", signalConfig.color)}>
                  {signalConfig.text}
                </span>
              </div>
            </div>
          </div>

          {/* Chart Section */}
          <div className="mt-4">
             <HistoryChart history={data.history || []} />
          </div>

          {/* Photo Upload for Offline Meters */}
          {isOffline && (
            <div className="mt-4 animate-in fade-in slide-in-from-bottom-2">
              <PhotoUpload />
            </div>
          )}

          {/* History Accordion Button */}
          {data.history && data.history.length > 0 && (
            <div className="border rounded-xl overflow-hidden">
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="w-full flex items-center justify-between p-4 bg-muted/10 hover:bg-muted/20 transition-colors"
              >
                <span className="font-medium text-sm flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  История показаний
                </span>
                {showHistory ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {showHistory && (
                <div className="p-4 bg-white border-t">
                  <HistoryAccordion history={data.history} />
                </div>
              )}
            </div>
          )}

          {/* Support Button */}
          <a 
            href={whatsappLink}
            target="_blank" 
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors border border-gray-200"
          >
            <MessageCircle className="w-5 h-5 text-[#25D366]" />
            Написать в поддержку
          </a>
        </div>
        
        {/* Footer Actions */}
        <div className="p-4 bg-muted/20 border-t flex flex-col sm:flex-row items-center justify-center gap-4">
          {onRefresh && (
            <button 
              onClick={onRefresh}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-all active:scale-95 disabled:opacity-70"
            >
              <RefreshCw className={cn("w-4 h-4", isLoading && "animate-spin")} />
              ОБНОВИТЬ
            </button>
          )}
          
          <button 
            onClick={onReset}
            disabled={isLoading}
            className="flex items-center gap-2 text-muted-foreground font-medium hover:text-foreground hover:underline transition-all text-sm"
          >
            Ввести другой номер
          </button>
        </div>
      </div>
    </div>
  );
};
