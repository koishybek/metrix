import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Header } from './components/Header';
import { InputForm } from './components/InputForm';
import { ResultCard } from './components/ResultCard';
import { NoData } from './components/NoData';
import { FAQ } from './components/FAQ';
import { Footer } from './components/Footer';
import { LoadingSpinner } from './components/LoadingSpinner';
import { Login } from './pages/Login';
import { Cabinet } from './pages/Cabinet';
import { Admin } from './pages/Admin';
import { getMeterStatus } from './services/api';
import { MeterData } from './types';
import { logSearch, addMeterToUser } from './services/db';

// Main Search Page (Search & Add)
const Home: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<MeterData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notFoundNumber, setNotFoundNumber] = useState<string | null>(null);
  const [recentSearches, setRecentSearches] = useState<any[]>([]);
  const { user } = useAuth();

  // Load last search from localStorage (User Isolated)
  useEffect(() => {
    if (!user) {
      setRecentSearches([]);
      return;
    }
    const storageKey = `recent_searches_${user.id}`;
    const recent = JSON.parse(localStorage.getItem(storageKey) || '[]');
    setRecentSearches(recent);
  }, [user]);

  const handleSearch = async (value: string, type: 'serial' | 'account') => {
    // ... existing loading logic ...
    setLoading(true);
    setError(null);
    setData(null);
    setNotFoundNumber(null);

    try {
      const result = await getMeterStatus(value, type);
      setData(result);
      
      // Auto-save to cabinet if user is logged in
      if (user) {
        try {
          await addMeterToUser(user.id, result);
        } catch (e) {
          // Ignore duplicate errors silently
        }
      }

      // Save to recent searches (User Isolated)
      if (user) {
        const storageKey = `recent_searches_${user.id}`;
        const newSearch = { value, type, date: new Date().toISOString(), found: true };
        const currentRecent = JSON.parse(localStorage.getItem(storageKey) || '[]');
        const updatedRecent = [newSearch, ...currentRecent.filter((s: any) => s.value !== value)].slice(0, 5);
        setRecentSearches(updatedRecent);
        localStorage.setItem(storageKey, JSON.stringify(updatedRecent));
      }

      // Log success
      logSearch('search', value, 'found');

    } catch (err: any) {
      // ... error handling ...
      setError(err.message);
      setNotFoundNumber(value);
      logSearch('search', value, 'not_found');
    } finally {
      setLoading(false);
    }
  };

  const handleClearRecent = () => {
    if (user) {
      const storageKey = `recent_searches_${user.id}`;
      setRecentSearches([]);
      localStorage.removeItem(storageKey);
    }
  };

  const handleReset = () => {
    setData(null);
    setError(null);
    setNotFoundNumber(null);
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-80px)]">
      <main className="flex-grow container mx-auto px-4 py-8 flex flex-col items-center gap-8">
        
        {!data && !error && (
          <div className="text-center space-y-2 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
              Проверьте статус <br className="sm:hidden" />своего счётчика
            </h2>
            <p className="text-gray-500 text-lg max-w-md mx-auto">
              Введите серийный номер или лицевой счёт для получения актуальных данных
            </p>
          </div>
        )}

        {!data && !error && (
          <InputForm 
            onSubmit={handleSearch} 
            isLoading={loading} 
            recentSearches={recentSearches}
            onClearRecent={handleClearRecent}
          />
        )}

        {loading && !data && !error && (
          <div className="mt-12">
            <LoadingSpinner />
          </div>
        )}

        {data && (
          <div className="w-full flex flex-col items-center gap-4">
            <ResultCard data={data} onReset={handleReset} />
            {user && (
              <div className="text-green-600 font-medium text-sm bg-green-50 px-4 py-2 rounded-full animate-in fade-in slide-in-from-bottom-2">
                ✓ Счётчик автоматически добавлен в ваш кабинет
              </div>
            )}
          </div>
        )}

        {error && (
          <NoData 
            serialNumber={notFoundNumber || '---'} 
            onReset={handleReset} 
          />
        )}

        {!data && !error && !loading && <FAQ />}
      </main>
    </div>
  );
};

// Layout Wrapper
const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#F8F9FB] font-sans text-gray-900 flex flex-col">
      <Header />
      {children}
      <Footer />
    </div>
  );
};

// Protected Route Wrapper
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) return <LoadingSpinner />;
  if (!user) return <Navigate to="/login" replace />;

  return <>{children}</>;
};

// Main App Router
function App() {
  return (
    <Router>
      <AuthProvider>
        <Layout>
          <Routes>
            {/* Redirect root to login for new flow */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            
            {/* Search page is now 'check-status' or accessible after login */}
            <Route path="/search" element={<Home />} />
            
            <Route 
              path="/cabinet" 
              element={
                <ProtectedRoute>
                  <Cabinet />
                </ProtectedRoute>
              } 
            />
            
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </Layout>
      </AuthProvider>
    </Router>
  );
}

export default App;
