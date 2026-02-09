import React, { useEffect, useState } from 'react';
import { getAllUsers, UserStat } from '../services/db';
import { getAllRequests, updateRequestStatus, ServiceRequest } from '../services/requests';
import { 
  Users, 
  Activity, 
  Search,
  Lock,
  ChevronDown,
  ChevronUp,
  MapPin,
  FileText,
  Hash,
  Inbox,
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react';

export const Admin: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [users, setUsers] = useState<UserStat[]>([]);
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'users' | 'requests'>('requests');
  const [expandedUser, setExpandedUser] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123') {
      setIsAuthenticated(true);
    } else {
      alert('Неверный пароль');
    }
  };

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [usersData, requestsData] = await Promise.all([
        getAllUsers(),
        getAllRequests()
      ]);
      setUsers(usersData);
      setRequests(requestsData);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (requestId: string, newStatus: ServiceRequest['status']) => {
    try {
      await updateRequestStatus(requestId, newStatus);
      await loadData(); // Refresh
    } catch (error) {
      alert('Ошибка обновления статуса');
    }
  };

  const totalMeters = users.reduce((sum, u) => sum + u.meterCount, 0);

  const toggleUser = (userId: string) => {
    setExpandedUser(expandedUser === userId ? null : userId);
  };

  if (!isAuthenticated) {
    // ... Login Form (Same as before)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <form onSubmit={handleLogin} className="bg-white p-8 rounded-2xl shadow-lg max-w-sm w-full">
          <div className="flex justify-center mb-6">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <Lock className="w-6 h-6 text-red-500" />
            </div>
          </div>
          <h2 className="text-xl font-bold text-center mb-6">Панель администратора</h2>
          <input
            type="password"
            placeholder="Введите пароль"
            className="w-full px-4 py-3 rounded-xl border mb-4 focus:ring-2 focus:ring-red-500/20 outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="w-full py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-black transition-colors">
            Войти
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Административная панель</h1>
        <button 
          onClick={loadData} 
          className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          title="Обновить данные"
        >
          <Activity className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('requests')}
          className={`pb-4 px-2 font-medium transition-colors relative ${
            activeTab === 'requests' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Заявки ({requests.filter(r => r.status === 'new').length})
          {activeTab === 'requests' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-t-full" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`pb-4 px-2 font-medium transition-colors relative ${
            activeTab === 'users' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Пользователи ({users.length})
          {activeTab === 'users' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-t-full" />
          )}
        </button>
      </div>

      {/* REQUESTS TAB */}
      {activeTab === 'requests' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
             <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
               <div className="text-blue-500 text-sm font-bold uppercase">Новые</div>
               <div className="text-2xl font-bold text-gray-900">{requests.filter(r => r.status === 'new').length}</div>
             </div>
             <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
               <div className="text-orange-500 text-sm font-bold uppercase">В работе</div>
               <div className="text-2xl font-bold text-gray-900">{requests.filter(r => r.status === 'processing').length}</div>
             </div>
             <div className="bg-green-50 p-4 rounded-xl border border-green-100">
               <div className="text-green-500 text-sm font-bold uppercase">Выполнено</div>
               <div className="text-2xl font-bold text-gray-900">{requests.filter(r => r.status === 'completed').length}</div>
             </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-sm font-medium text-gray-500">Дата</th>
                    <th className="px-6 py-4 text-sm font-medium text-gray-500">Клиент</th>
                    <th className="px-6 py-4 text-sm font-medium text-gray-500">Услуга</th>
                    <th className="px-6 py-4 text-sm font-medium text-gray-500">Статус</th>
                    <th className="px-6 py-4 text-sm font-medium text-gray-500">Действия</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {requests.map((req) => (
                    <tr key={req.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-gray-600 text-sm">
                        {req.createdAt?.seconds ? new Date(req.createdAt.seconds * 1000).toLocaleString() : '-'}
                      </td>
                      <td className="px-6 py-4 font-medium">
                        {req.userPhone}
                      </td>
                      <td className="px-6 py-4">
                        <span className="bg-gray-100 px-2 py-1 rounded text-sm">{req.details}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${
                          req.status === 'new' ? 'bg-blue-100 text-blue-700' :
                          req.status === 'processing' ? 'bg-orange-100 text-orange-700' :
                          req.status === 'completed' ? 'bg-green-100 text-green-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {req.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          {req.status === 'new' && (
                            <button 
                              onClick={() => handleStatusChange(req.id, 'processing')}
                              className="p-1 text-orange-500 hover:bg-orange-50 rounded" title="В работу"
                            >
                              <Clock className="w-5 h-5" />
                            </button>
                          )}
                          {req.status === 'processing' && (
                            <button 
                              onClick={() => handleStatusChange(req.id, 'completed')}
                              className="p-1 text-green-500 hover:bg-green-50 rounded" title="Завершить"
                            >
                              <CheckCircle className="w-5 h-5" />
                            </button>
                          )}
                          {(req.status === 'new' || req.status === 'processing') && (
                            <button 
                              onClick={() => handleStatusChange(req.id, 'cancelled')}
                              className="p-1 text-red-500 hover:bg-red-50 rounded" title="Отменить"
                            >
                              <XCircle className="w-5 h-5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {requests.length === 0 && (
                    <tr>
                      <td colSpan={5} className="text-center py-8 text-gray-400">Нет активных заявок</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* USERS TAB (Existing Logic) */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* ... Existing Users List Code ... */}
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-bold">База пользователей и приборов</h3>
        </div>
        <div className="divide-y divide-gray-100">
          {users.map((user) => (
            <div key={user.id} className="group">
              <div 
                className="p-4 sm:p-6 hover:bg-gray-50 transition-colors cursor-pointer flex items-center justify-between"
                onClick={() => toggleUser(user.id)}
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 font-bold">
                    {user.phone.slice(-2)}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{user.phone}</h4>
                    <p className="text-sm text-gray-500">
                      Регистрация: {user.createdAt?.seconds ? new Date(user.createdAt.seconds * 1000).toLocaleDateString() : '-'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${user.meterCount > 0 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                    {user.meterCount} приборов
                  </span>
                  {expandedUser === user.id ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </div>
              </div>

              {/* Expanded Meters List */}
              {expandedUser === user.id && (
                <div className="bg-gray-50 px-4 sm:px-6 py-4 space-y-3 border-t border-gray-100 animate-in slide-in-from-top-2 duration-200">
                  {user.meters && user.meters.length > 0 ? (
                    user.meters.map((meter) => (
                      <div key={meter.id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm font-bold text-gray-900">
                            <Hash className="w-4 h-4 text-blue-500" />
                            № {meter.serial}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <FileText className="w-4 h-4 text-gray-400" />
                            Л/С: {meter.account || 'Не указан'}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            {meter.address}
                          </div>
                        </div>
                        
                        <div className="flex flex-row sm:flex-col items-center sm:items-end gap-2 sm:gap-1 border-t sm:border-t-0 pt-2 sm:pt-0 mt-2 sm:mt-0">
                          <span className="text-xs text-gray-400 uppercase font-medium">Показание</span>
                          <span className="text-lg font-mono font-bold text-primary bg-blue-50 px-2 py-1 rounded-lg">
                            {meter.lastReading} м³
                          </span>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${meter.status === 'online' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {meter.status === 'online' ? 'На связи' : 'Не на связи'}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-gray-500 py-4 italic">У пользователя нет добавленных счётчиков</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
        </div>
      )}
    </div>
  );
};
