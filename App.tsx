
import React, { useState, useEffect, createContext, useContext } from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import HomeView from './views/HomeView';
import AboutView from './views/AboutView';
import TournamentsView from './views/TournamentsView';
import BookingView from './views/BookingView';
import AdminDashboardView from './views/AdminDashboardView';
import AdminManagePostsView from './views/AdminManagePostsView';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Simple Notification Context
const NotificationContext = createContext({
  notify: (msg: string, type?: 'success' | 'error') => {},
});

export const useNotify = () => useContext(NotificationContext);

const App: React.FC = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [toast, setToast] = useState<{ msg: string; type: string } | null>(null);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const notify = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <NotificationContext.Provider value={{ notify }}>
      <HashRouter>
        <div className="min-h-screen flex flex-col relative">
          <ScrollToTop />
          <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
          
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomeView />} />
              <Route path="/about" element={<AboutView />} />
              <Route path="/tournaments" element={<TournamentsView />} />
              <Route path="/booking" element={<BookingView />} />
              <Route path="/admin" element={<AdminDashboardView />} />
              <Route path="/admin/posts" element={<AdminManagePostsView />} />
            </Routes>
          </main>
          
          <Footer />

          {/* Global Toast */}
          {toast && (
            <div className={`fixed bottom-8 right-8 z-[100] px-6 py-4 rounded-xl shadow-2xl border flex items-center gap-3 animate-bounce-in ${
              toast.type === 'success' ? 'bg-primary text-black border-primary' : 'bg-red-600 text-white border-red-500'
            }`}>
              <span className="material-icons">{toast.type === 'success' ? 'check_circle' : 'error'}</span>
              <span className="font-bold text-xs uppercase tracking-widest">{toast.msg}</span>
            </div>
          )}
        </div>
      </HashRouter>
    </NotificationContext.Provider>
  );
};

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

export default App;
