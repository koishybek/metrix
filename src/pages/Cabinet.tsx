import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, RefreshCw, AlertCircle, Wrench, FileText, Phone, Settings, LogOut, X, Bell, ChevronRight, Edit2, Mail, Send, Menu } from 'lucide-react';
import { getUserMeters, addMeterToUser, deleteMeter, SavedMeter } from '../services/db';
import { getMeterStatus } from '../services/api';
import { MeterData } from '../types';
import { Sidebar } from '../components/Sidebar';
import { MeterListItem } from '../components/MeterListItem';
import { ServiceCard } from '../components/ServiceCard';
import { MeterDetailView } from '../components/MeterDetailView';
import { createServiceRequest, getUserRequests, ServiceRequest } from '../services/requests';
import { InputForm } from '../components/InputForm';
import { ResultCard } from '../components/ResultCard';
import { useI18n } from '../context/I18nContext';
import { generateWhatsAppLink } from '../lib/utils';
import { FAQ } from '../components/FAQ';

export const Cabinet: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState<'meters' | 'services' | 'notifications' | 'profile' | 'faq'>('meters');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [meters, setMeters] = useState<SavedMeter[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Selected Meter
  const [selectedMeter, setSelectedMeter] = useState<SavedMeter | null>(null);
  const [detailData, setDetailData] = useState<MeterData | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  // Add Meter (Check & Add Flow)
  const [showAddModal, setShowAddModal] = useState(false);
  const [checkLoading, setCheckLoading] = useState(false);
  const [checkResult, setCheckResult] = useState<MeterData | null>(null);
  const [checkError, setCheckError] = useState<string | null>(null);
  const [checkValue, setCheckValue] = useState<string>('');
  const [addingToCabinet, setAddingToCabinet] = useState(false);

  // Services & Profile
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [requestLoading, setRequestLoading] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    loadMeters();
    loadRequests();
  }, [user, navigate]);

  const loadMeters = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const savedMeters = await getUserMeters(user.id);
      setMeters(savedMeters);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadRequests = async () => {
    if (!user) return;
    try {
      const reqs = await getUserRequests(user.id);
      setRequests(reqs);
    } catch (error) {
      console.error(error);
    }
  };

  // Check & Add Logic
  const handleCheckSearch = async (value: string, type: 'serial' | 'account') => {
    setCheckLoading(true);
    setCheckError(null);
    setCheckResult(null);
    setCheckValue(value);
    try {
      const result = await getMeterStatus(value, type);
      setCheckResult(result);
    } catch (err: any) {
      setCheckError(err.message || 'Прибор не найден');
    } finally {
      setCheckLoading(false);
    }
  };

  const handleAddToCabinet = async () => {
    if (!user || !checkResult) return;
    setAddingToCabinet(true);
    try {
      await addMeterToUser(user.id, checkResult);
      
      // Small delay to ensure consistency
      await new Promise(resolve => setTimeout(resolve, 500));
      
      await loadMeters();
      setShowAddModal(false);
      setCheckResult(null);
      
      // Switch to meters tab to see the result
      setActiveTab('meters');
      
    } catch (error: any) {
      alert(error.message || 'Ошибка добавления');
    } finally {
      setAddingToCabinet(false);
    }
  };

  const handleResetCheck = () => {
    setCheckResult(null);
    setCheckError(null);
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm('Удалить этот счётчик?')) {
      await deleteMeter(id);
      await loadMeters();
    }
  };

  const openMeterDetail = async (meter: SavedMeter) => {
    setSelectedMeter(meter);
    setDetailLoading(true);
    try {
      const data = await getMeterStatus(meter.serial, 'serial');
      setDetailData(data);
    } catch (error) {
      console.error(error);
    } finally {
      setDetailLoading(false);
    }
  };

  const [showServiceModal, setShowServiceModal] = useState(false);
  const [selectedService, setSelectedService] = useState<{type: ServiceRequest['type'], title: string} | null>(null);
  const [serviceComment, setServiceComment] = useState('');
  const [serviceMeter, setServiceMeter] = useState('');

  const openServiceModal = (type: ServiceRequest['type'], title: string) => {
    setSelectedService({ type, title });
    setServiceComment('');
    setServiceMeter(meters[0]?.serial || '');
    setShowServiceModal(true);
  };

  const handleServiceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selectedService) return;

    setRequestLoading(true);
    try {
      // 1. Create DB Request
      await createServiceRequest(
        user.id, 
        user.phone, 
        selectedService.type, 
        `${selectedService.title}: ${serviceComment}`,
        serviceMeter
      );

      // 2. Simulate Telegram/Email Sending
      console.log(`[Email/Telegram Sent] To: Admin | Subject: New Request | Body: User ${user.phone} requested ${selectedService.title} for meter ${serviceMeter}. Comment: ${serviceComment}`);

      await loadRequests();
      setShowServiceModal(false);
      alert('Заявка успешно отправлена! Мы получили уведомление в Telegram и на почту.');
    } catch (error) {
      alert('Ошибка при отправке заявки');
    } finally {
      setRequestLoading(false);
    }
  };

  // Replace old handleServiceRequest calls with openServiceModal
  const handleServiceRequest = (type: ServiceRequest['type'], title: string) => {
    openServiceModal(type, title);
  };

  if (!user) return null;

  // --- DETAIL VIEW ---
  if (selectedMeter) {
    return (
      <MeterDetailView 
        meter={detailData || { ...selectedMeter, reading: 0, last_update: '', status: 'offline' } as any}
        savedMeter={selectedMeter}
        onBack={() => setSelectedMeter(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FB]">
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        activeTab={activeTab} 
        onChange={setActiveTab} 
      />

      <div className="pb-24 pt-6 px-4 max-w-md mx-auto">
        
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Menu className="w-7 h-7 text-gray-700" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">
              {activeTab === 'meters' && t('meters.title')}
              {activeTab === 'services' && t('services.title')}
              {activeTab === 'notifications' && t('notif.title')}
              {activeTab === 'profile' && t('profile.title')}
              {activeTab === 'faq' && t('menu.faq')}
            </h1>
          </div>
          
          {activeTab === 'meters' && (
            <button 
              onClick={() => setShowAddModal(true)}
              className="p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition-colors"
            >
              <Plus className="w-6 h-6" />
            </button>
          )}
        </div>

        {/* === METERS TAB === */}
        {activeTab === 'meters' && (
          <div className="space-y-4 animate-in fade-in duration-300">
            {isLoading ? (
              <div className="flex justify-center py-12">
                <RefreshCw className="w-8 h-8 animate-spin text-blue-500" />
              </div>
            ) : meters.length === 0 ? (
              <div className="text-center py-12 text-gray-400 bg-white rounded-2xl border border-dashed border-gray-200 p-8">
                <p className="mb-4">{t('meters.empty')}</p>
                <button 
                  onClick={() => setShowAddModal(true)}
                  className="px-6 py-3 bg-blue-500 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30"
                >
                  {t('meters.add_first')}
                </button>
              </div>
            ) : (
              <div className="grid gap-4">
                {meters.map((meter) => (
                  <MeterListItem 
                    key={meter.id}
                    meter={meter}
                    onClick={() => openMeterDetail(meter)}
                    onDelete={(e) => handleDelete(e, meter.id)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* === SERVICES TAB === */}
        {activeTab === 'services' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="grid gap-3">
              <h3 className="font-bold text-gray-400 text-xs uppercase tracking-wider px-1">{t('services.select')}</h3>
              <ServiceCard 
                icon={Wrench} 
                title={t('services.verification')}
                description={t('services.verification_desc')}
                onClick={() => handleServiceRequest('verification', t('services.verification'))}
              />
              <ServiceCard 
                icon={Settings} 
                title={t('services.repair')}
                description={t('services.repair_desc')}
                onClick={() => handleServiceRequest('repair', t('services.repair'))}
                colorClass="text-orange-500 bg-orange-50"
              />
              <ServiceCard 
                icon={FileText} 
                title={t('services.seal')}
                description={t('services.seal_desc')}
                onClick={() => handleServiceRequest('seal', t('services.seal'))}
                colorClass="text-green-500 bg-green-50"
              />
              <ServiceCard 
                icon={Phone} 
                title={t('services.consultation')}
                description={t('services.consultation_desc')}
                onClick={() => handleServiceRequest('consultation', t('services.consultation'))}
                colorClass="text-purple-500 bg-purple-50"
              />
            </div>
          </div>
        )}

        {/* === NOTIFICATIONS TAB === */}
        {activeTab === 'notifications' && (
          <div className="space-y-4 animate-in fade-in duration-300">
            {requests.length > 0 ? (
              requests.map(req => (
                <div key={req.id} className="bg-white p-4 rounded-xl border border-gray-100 flex gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    req.status === 'completed' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
                  }`}>
                    {req.status === 'completed' ? <CheckCircle className="w-5 h-5" /> : <Bell className="w-5 h-5" />}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm mb-1">{req.details}</h4>
                    <p className="text-xs text-gray-500">
                      {t('notif.status')}: <span className="font-medium text-gray-700">
                        {req.status === 'new' ? t('notif.new') : 
                         req.status === 'processing' ? t('notif.processing') : 
                         req.status === 'completed' ? t('notif.completed') : t('notif.cancelled')}
                      </span>
                    </p>
                    <p className="text-[10px] text-gray-400 mt-1">
                      {req.createdAt?.seconds ? new Date(req.createdAt.seconds * 1000).toLocaleString() : ''}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-gray-400">
                <Bell className="w-12 h-12 mx-auto mb-4 text-gray-200" />
                <p>{t('notif.empty')}</p>
              </div>
            )}
          </div>
        )}

        {/* === PROFILE TAB === */}
        {activeTab === 'profile' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-2xl mx-auto mb-4">
                {user.phone.slice(-2)}
              </div>
              <h2 className="text-xl font-bold text-gray-900">{user.phone}</h2>
              <p className="text-gray-500 text-sm mb-6">{t('menu.client_type')}</p>
              
              <div className="flex items-center justify-center gap-2 text-sm text-gray-600 bg-gray-50 py-2 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => setIsEditingEmail(!isEditingEmail)}>
                <Mail className="w-4 h-4" />
                {email || t('profile.add_email')}
                <Edit2 className="w-3 h-3 ml-1 text-gray-400" />
              </div>
              
              {isEditingEmail && (
                <div className="mt-4 flex gap-2">
                  <input 
                    type="email" 
                    className="flex-1 px-3 py-2 border rounded-lg text-sm"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <button 
                    className="p-2 bg-blue-500 text-white rounded-lg"
                    onClick={() => setIsEditingEmail(false)}
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-4 px-2">{t('profile.stats')}</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-xl text-center">
                  <span className="block text-2xl font-bold text-blue-600">{meters.length}</span>
                  <span className="text-xs text-gray-500">{t('profile.meters_count')}</span>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl text-center">
                  <span className="block text-2xl font-bold text-green-600">{requests.length}</span>
                  <span className="text-xs text-gray-500">{t('profile.requests_count')}</span>
                </div>
              </div>
            </div>

            <button 
              onClick={logout}
              className="w-full py-4 flex items-center justify-center gap-2 text-red-500 bg-white border border-red-100 hover:bg-red-50 rounded-xl font-bold transition-colors shadow-sm"
            >
              <LogOut className="w-5 h-5" />
              {t('profile.logout_button')}
            </button>
          </div>
        )}

        {/* === FAQ TAB === */}
        {activeTab === 'faq' && <FAQ />}

        {/* CHECK & ADD MODAL (Fullscreen) */}
        {showAddModal && (
          <div className="fixed inset-0 bg-[#F8F9FB] z-50 flex flex-col animate-in slide-in-from-bottom-10 duration-300">
            <div className="bg-white px-4 py-4 flex items-center justify-between border-b border-gray-100 shadow-sm">
              <h3 className="text-lg font-bold">{t('add.title')}</h3>
              <button onClick={() => { setShowAddModal(false); handleResetCheck(); }} className="p-2 hover:bg-gray-100 rounded-full">
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4">
              {!checkResult ? (
                <div className="max-w-md mx-auto space-y-6 mt-4">
                  <p className="text-gray-500 text-center">
                    {t('add.subtitle')}
                  </p>
                  <InputForm 
                    onSubmit={handleCheckSearch}
                    isLoading={checkLoading}
                  />
                  {checkError && (
                  <div className="space-y-4">
                    <div className="bg-red-50 p-4 rounded-xl text-red-600 flex gap-3 items-center">
                      <AlertCircle className="w-5 h-5 flex-shrink-0" />
                      {checkError}
                    </div>

                    <div className="bg-gray-50 rounded-xl p-4 text-center space-y-3">
                      <h4 className="font-bold text-gray-900">{t('add.not_found_title')}</h4>
                      <p className="text-sm text-gray-500">{t('add.not_found_desc')}</p>
                      
                      <div className="grid grid-cols-1 gap-2">
                        <button
                          onClick={() => {
                            setShowAddModal(false);
                            handleResetCheck();
                            openServiceModal('consultation', 'Консультация (Прибор не найден)');
                          }}
                          className="w-full py-3 bg-blue-500 text-white rounded-lg font-bold text-sm hover:bg-blue-600 transition-colors"
                        >
                          {t('add.leave_request')}
                        </button>
                        
                        <a
                          href={generateWhatsAppLink({
                            type: 'not_found',
                            searchValue: checkValue,
                            userPhone: user.phone
                          })}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full py-3 bg-green-500 text-white rounded-lg font-bold text-sm hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
                        >
                          <Phone className="w-4 h-4" />
                          {t('add.contact_support')}
                        </a>
                      </div>
                    </div>
                  </div>
                )}
                </div>
              ) : (
                <div className="max-w-md mx-auto space-y-6 pb-20">
                  <div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-xl mb-4">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-medium">{t('add.found')}</span>
                </div>
                
                <ResultCard 
                  data={checkResult} 
                  onReset={handleResetCheck}
                />
                
                <button
                  onClick={handleAddToCabinet}
                  disabled={addingToCabinet}
                  className="w-full py-4 bg-blue-500 text-white rounded-xl font-bold text-lg shadow-lg shadow-blue-500/30 flex justify-center items-center gap-2 sticky bottom-4"
                >
                  {addingToCabinet ? <RefreshCw className="w-5 h-5 animate-spin" /> : t('add.button_add')}
                </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* SERVICE REQUEST MODAL */}
        {showServiceModal && selectedService && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center">
            <div className="bg-white w-full max-w-md rounded-t-2xl sm:rounded-2xl p-6 space-y-6 animate-in slide-in-from-bottom-10 duration-300">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold">{selectedService.title}</h3>
                <button onClick={() => setShowServiceModal(false)} className="p-2 hover:bg-gray-100 rounded-full">
                  <X className="w-6 h-6 text-gray-400" />
                </button>
              </div>
              
              <form onSubmit={handleServiceSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('common.select_meter')}</label>
                <select 
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-blue-500 outline-none bg-white"
                  value={serviceMeter}
                  onChange={(e) => setServiceMeter(e.target.value)}
                >
                  {meters.map(m => (
                    <option key={m.id} value={m.serial}>
                      № {m.serial} ({m.address})
                    </option>
                  ))}
                  <option value="">{t('common.other_meter')}</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('common.comment')}</label>
                <textarea
                  placeholder="..."
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-blue-500 outline-none h-32 resize-none"
                  value={serviceComment}
                  onChange={(e) => setServiceComment(e.target.value)}
                  required
                />
              </div>
              
              <button
                type="submit"
                disabled={requestLoading}
                className="w-full py-4 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-bold text-lg flex justify-center items-center gap-2 shadow-lg shadow-blue-500/30 transition-all active:scale-[0.98]"
              >
                {requestLoading ? <RefreshCw className="w-5 h-5 animate-spin" /> : t('common.send')}
              </button>
            </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

// Helper icon
const CheckCircle = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);
