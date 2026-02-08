
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface NavbarProps {
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
}

const Navbar: React.FC<NavbarProps> = ({ darkMode, setDarkMode }) => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <nav className="fixed w-full z-50 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-slate-200 dark:border-primary/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="h-12 w-12 flex items-center justify-center rounded-full bg-primary/10 border border-primary/20 group-hover:scale-110 transition-transform">
              <span className="material-icons text-primary text-3xl">sports_soccer</span>
            </div>
            <div className="flex flex-col">
              <span className="font-display font-black text-lg tracking-wider text-primary leading-none">RJS ARENA</span>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">The Realm of Champions</span>
            </div>
          </Link>

          {!isAdmin && (
            <div className="hidden md:flex space-x-8">
              <Link to="/" className={`text-xs font-bold tracking-widest hover:text-primary transition-colors ${location.pathname === '/' ? 'text-primary' : ''}`}>HOME</Link>
              <Link to="/about" className={`text-xs font-bold tracking-widest hover:text-primary transition-colors ${location.pathname === '/about' ? 'text-primary' : ''}`}>ABOUT</Link>
              <Link to="/tournaments" className={`text-xs font-bold tracking-widest hover:text-primary transition-colors ${location.pathname === '/tournaments' ? 'text-primary' : ''}`}>EVENTS</Link>
              <Link to="/booking" className={`text-xs font-bold tracking-widest hover:text-primary transition-colors ${location.pathname === '/booking' ? 'text-primary' : ''}`}>BOOKING</Link>
            </div>
          )}

          {isAdmin && (
             <div className="hidden md:flex space-x-8">
                <Link to="/admin" className={`text-xs font-bold tracking-widest hover:text-primary transition-colors ${location.pathname === '/admin' ? 'text-primary' : ''}`}>DASHBOARD</Link>
                <Link to="/admin/posts" className={`text-xs font-bold tracking-widest hover:text-primary transition-colors ${location.pathname === '/admin/posts' ? 'text-primary' : ''}`}>CMS</Link>
                <Link to="/" className="text-xs font-bold tracking-widest hover:text-primary transition-colors">EXIT PORTAL</Link>
             </div>
          )}

          <div className="flex items-center gap-4">
            <Link 
              to={isAdmin ? "/" : "/admin"}
              className="hidden sm:block bg-primary hover:bg-primary-dark text-black font-bold py-2 px-6 rounded-full transition-all transform hover:scale-105 shadow-lg shadow-primary/20 text-xs"
            >
              {isAdmin ? "PUBLIC SITE" : "ADMIN PORTAL"}
            </Link>
            <button 
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
            >
              <span className="material-icons text-primary">{darkMode ? 'light_mode' : 'dark_mode'}</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
