import React, { useState } from 'react';
import { MeterData } from '../types';
import { 
  ChevronRight, 
  Droplet, 
  MapPin, 
  Info, 
  Calendar, 
  Bell, 
  Clock, 
  Edit2,
  AlertTriangle,
  Loader2,
  CheckCircle2
} from 'lucide-react';
import { SavedMeter } from '../services/db';
import { HistoryChart } from './HistoryChart';
import { useI18n } from '../context/I18nContext';
import { PhotoUpload } from './PhotoUpload';
import { createServiceRequest, uploadPhoto } from '../services/requests';
import { useAuth } from '../context/AuthContext';

interface MeterDetailViewProps {
  meter: MeterData;
  savedMeter?: SavedMeter;
  onBack: () => void;
}

export const MeterDetailView: React.FC<MeterDetailViewProps> = ({ meter, savedMeter, onBack }) => {
  const [activeTab, setActiveTab] = useState<'info' | 'readings' | 'notifications'>('readings');
  const [readingInput, setReadingInput] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
  const { t, language } = useI18n();
  const { user } = useAuth();

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return t('detail.not_specified');
    try {
      return new Date(dateString).toLocaleDateString(language === 'en' ? 'en-US' : language === 'kz' ? 'kk-KZ' : 'ru-RU');
    } catch (e) {
      return t('detail.not_specified');
    }
  };

  const handleSubmitReading = async () => {
    if (!user) {
      alert('Пожалуйста, войдите в систему');
      return;
    }

    if (!readingInput) {
      alert('Пожалуйста, введите показания');
      return;
    }

    setIsSubmitting(true);
    try {
      let photoUrl = undefined;
      
      if (selectedFile) {
        // Create a unique path for the photo
        const timestamp = Date.now();
        const path = `readings/${user.id}/${meter.serial}/${timestamp}_${selectedFile.name}`;
        photoUrl = await uploadPhoto(selectedFile, path);
      }

      await createServiceRequest(
        user.id,
        user.phone,
        'reading_submit',
        `Передача показаний для счетчика ${meter.serial}`,
        meter.serial,
        photoUrl,
        parseFloat(readingInput)
      );

      setSubmitSuccess(true);
      setReadingInput('');
      setSelectedFile(null);
      
      // Reset success message after 3 seconds
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 3000);

    } catch (error) {
      console.error('Error submitting reading:', error);
      alert('Ошибка при отправке данных. Попробуйте позже.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderInfoTab = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm space-y-4">
        <h3 className="font-bold text-gray-900 flex items-center gap-2">
          <Info className="w-5 h-5 text-blue-500" />
          {t('detail.info')}
        </h3>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="space-y-1">
            <p className="text-gray-400">{t('detail.serial')}</p>
            <p className="font-medium">{meter.serial}</p>
          </div>
          <div className="space-y-1">
            <p className="text-gray-400">{t('detail.model')}</p>
            <p className="font-medium">{meter.device_type || t('detail.not_specified')}</p>
          </div>
          <div className="space-y-1">
            <p className="text-gray-400">{t('detail.check_date')}</p>
            <p className="font-medium">
              {formatDate(meter.check_date)}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-gray-400">{t('detail.diameter')}</p>
            <p className="font-medium">15 мм</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm space-y-4">
        <h3 className="font-bold text-gray-900 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-green-500" />
          {t('detail.address')}
        </h3>
        <p className="text-gray-600">{meter.address}</p>
      </div>
    </div>
  );

  const renderReadingsTab = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* Current Reading Card */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex justify-between items-start mb-6">
          <div>
            <p className="text-gray-400 text-sm mb-1">{t('detail.prev_reading')}</p>
            <p className="text-lg font-medium text-gray-900">
              {new Date().toLocaleDateString(language === 'en' ? 'en-US' : language === 'kz' ? 'kk-KZ' : 'ru-RU', { month: 'long', year: 'numeric' })}
            </p>
          </div>
          <div className="text-right">
            <p className="text-gray-400 text-sm mb-1">{t('detail.consumption')}</p>
            <p className="text-lg font-bold text-blue-600">{meter.last_consumption || 0} м³</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <p className="text-gray-400 text-sm">{t('detail.current_reading_date')}</p>
            <p className="font-medium">
              {new Date().toLocaleDateString(language === 'en' ? 'en-US' : language === 'kz' ? 'kk-KZ' : 'ru-RU', { month: 'long', year: 'numeric' })}
            </p>
          </div>

          <div className="relative">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">
              {t('detail.current_reading')}
            </label>
            <div className="relative">
              <input 
                type="number" 
                value={readingInput}
                onChange={(e) => setReadingInput(e.target.value)}
                placeholder={meter.reading.toString()}
                className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-2xl font-mono font-bold py-3 pl-4 pr-12 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white cursor-pointer hover:bg-blue-600 transition-colors">
                <Edit2 className="w-4 h-4" />
              </div>
            </div>
          </div>
          
          <PhotoUpload 
            onFileSelect={setSelectedFile} 
            isLoading={isSubmitting} 
          />

          {submitSuccess ? (
             <div className="w-full py-4 bg-green-500 text-white rounded-xl font-bold text-lg flex items-center justify-center gap-2 animate-in zoom-in">
               <CheckCircle2 className="w-6 h-6" />
               Заявка отправлена!
             </div>
          ) : (
            <button 
              onClick={handleSubmitReading}
              disabled={isSubmitting || !readingInput}
              className="w-full py-4 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white rounded-xl font-bold text-lg shadow-lg shadow-blue-500/30 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
              {isSubmitting && <Loader2 className="w-5 h-5 animate-spin" />}
              {t('detail.submit_request')}
            </button>
          )}
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-purple-500" />
          {t('detail.history')}
        </h3>
        <div className="h-48">
          <HistoryChart history={meter.history || []} />
        </div>
      </div>
    </div>
  );

  const renderNotificationsTab = () => (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-100 flex gap-3">
        <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
        <div>
          <h4 className="font-bold text-yellow-800 text-sm">{t('detail.notif_check')}</h4>
          <p className="text-yellow-700 text-xs mt-1">{t('detail.notif_check_desc')}</p>
        </div>
      </div>
      
      {meter.status === 'offline' && (
        <div className="bg-red-50 p-4 rounded-xl border border-red-100 flex gap-3">
          <Clock className="w-5 h-5 text-red-600 flex-shrink-0" />
          <div>
            <h4 className="font-bold text-red-800 text-sm">{t('detail.notif_offline')}</h4>
            <p className="text-red-700 text-xs mt-1">{t('detail.notif_offline_desc')}</p>
          </div>
        </div>
      )}

      <div className="text-center py-8 text-gray-400 text-sm">
        {t('detail.no_notifs')}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8F9FB] pb-20">
      {/* Header */}
      <div className="bg-white px-4 pt-6 pb-4 sticky top-0 z-10 border-b border-gray-100 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <button 
            onClick={onBack}
            className="p-2 -ml-2 hover:bg-gray-50 rounded-full transition-colors"
          >
            <ChevronRight className="w-6 h-6 text-gray-400 rotate-180" />
          </button>
          <h1 className="text-lg font-bold text-gray-900">№ {meter.account}</h1>
        </div>

        {/* Profile Card Style */}
        <div className="space-y-1 mb-6">
          <h2 className="text-xl font-bold text-gray-900">{meter.consumer || t('detail.not_specified')}</h2>
          <p className="text-gray-500 text-sm">{t('detail.consumer')}</p>
          <p className="text-blue-500 font-medium">{savedMeter?.userId ? '+7 *** *** ** **' : ''}</p>
          <div className="flex items-start gap-2 mt-2 bg-gray-50 p-3 rounded-xl">
            <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-gray-600 line-clamp-2">{meter.address}</p>
          </div>
        </div>

        {/* Meter Type Card */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
              <Droplet className="w-5 h-5 text-red-500" fill="currentColor" />
            </div>
            <div>
              <p className="font-bold text-gray-900 text-sm">{t('detail.hot_water')}</p>
              <p className="text-xs text-gray-400">№ {meter.serial}</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-300 rotate-90" />
        </div>

        {/* Tabs */}
        <div className="flex bg-gray-100 p-1 rounded-xl mt-6">
          <button
            onClick={() => setActiveTab('info')}
            className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'info' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <div className="flex flex-col items-center gap-1">
              <Info className="w-4 h-4" />
              {t('detail.info').split(' ')[0]}
            </div>
          </button>
          <button
            onClick={() => setActiveTab('readings')}
            className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'readings' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <div className="flex flex-col items-center gap-1">
              <Calendar className="w-4 h-4" />
              {t('detail.readings')}
            </div>
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'notifications' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <div className="flex flex-col items-center gap-1">
              <Bell className="w-4 h-4" />
              {t('detail.notifications')}
            </div>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {activeTab === 'info' && renderInfoTab()}
        {activeTab === 'readings' && renderReadingsTab()}
        {activeTab === 'notifications' && renderNotificationsTab()}
      </div>
    </div>
  );
};
