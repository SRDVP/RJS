
import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 dark:bg-background-dark text-white pt-20 pb-10 border-t border-primary/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-3 mb-6">
               <span className="material-icons text-primary text-4xl">sports_soccer</span>
               <span className="font-display font-bold text-xl tracking-tighter uppercase gold-gradient-text">RITHY JESDA ARENA</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">The premier destination for professional futsal, sports excellence, and community spirit. Join the RJS movement and experience sports at its finest.</p>
          </div>
          <div>
            <h6 className="font-display font-bold text-lg mb-6 text-primary tracking-widest uppercase text-xs">Navigate</h6>
            <ul className="space-y-4 text-sm text-slate-400">
              <li><Link className="hover:text-primary transition-colors" to="/">Home</Link></li>
              <li><Link className="hover:text-primary transition-colors" to="/about">About Arena</Link></li>
              <li><Link className="hover:text-primary transition-colors" to="/tournaments">Tournaments</Link></li>
              <li><Link className="hover:text-primary transition-colors" to="/admin">Admin Access</Link></li>
            </ul>
          </div>
          <div>
            <h6 className="font-display font-bold text-lg mb-6 text-primary tracking-widest uppercase text-xs">Connect</h6>
            <ul className="space-y-4 text-sm text-slate-400">
              <li><a className="hover:text-primary transition-colors" href="#">Contact Support</a></li>
              <li><a className="hover:text-primary transition-colors" href="#">Partnerships</a></li>
              <li><Link className="hover:text-primary transition-colors" to="/booking">Court Booking</Link></li>
              <li><a className="hover:text-primary transition-colors" href="#">Career Opportunities</a></li>
            </ul>
          </div>
          <div>
            <h6 className="font-display font-bold text-lg mb-6 text-primary tracking-widest uppercase text-xs">Visit Us</h6>
            <p className="text-sm text-slate-400 mb-4">No. 123, Sports Way,<br/>Phnom Penh, Cambodia</p>
            <div className="flex gap-4">
              <a className="w-10 h-10 rounded-full border border-primary/40 flex items-center justify-center hover:bg-primary hover:text-black transition-all" href="#">
                <span className="material-icons text-xl">facebook</span>
              </a>
              <a className="w-10 h-10 rounded-full border border-primary/40 flex items-center justify-center hover:bg-primary hover:text-black transition-all" href="#">
                <span className="material-icons text-xl">camera_alt</span>
              </a>
              <a className="w-10 h-10 rounded-full border border-primary/40 flex items-center justify-center hover:bg-primary hover:text-black transition-all" href="#">
                <span className="material-icons text-xl">play_circle</span>
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-slate-800 pt-10 text-center text-xs text-slate-500 tracking-widest">
          <p>© {new Date().getFullYear()} RITHY JESDA ARENA. ALL RIGHTS RESERVED. DESIGNED FOR CHAMPIONS.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
