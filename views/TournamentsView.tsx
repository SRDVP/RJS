
import React, { useState, useEffect } from 'react';
import { useNotify } from '../App';

interface Tournament {
  id: number;
  type: string;
  title: string;
  date: string;
  status: string;
  img: string;
}

const TournamentsView: React.FC = () => {
  const { notify } = useNotify();
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [tournaments, setTournaments] = useState<Tournament[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('rjs_tournaments');
    if (stored) {
      setTournaments(JSON.parse(stored));
    } else {
      const initial = [
        { id: 1, type: 'Professional', title: 'Futsal Super Cup 2026', date: 'Jan 12 - Feb 05', status: 'Upcoming', img: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=800' },
        { id: 2, type: 'Amateur', title: 'Sunday Community Cup', date: 'Dec 20, 2025', status: 'Registration Open', img: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=800' },
        { id: 3, type: 'Youth', title: 'Rising Stars Academy Open', date: 'Dec 15, 2025', status: 'Ongoing', img: 'https://images.unsplash.com/photo-1526232761682-d26e03ac148e?auto=format&fit=crop&q=80&w=800' },
        { id: 4, type: 'Professional', title: 'Corporate Champions Cup', date: 'Jan 05, 2026', status: 'Upcoming', img: 'https://images.unsplash.com/photo-1540324155974-7523202daa3f?auto=format&fit=crop&q=80&w=800' },
      ];
      setTournaments(initial);
      localStorage.setItem('rjs_tournaments', JSON.stringify(initial));
    }
  }, []);

  const filtered = tournaments
    .filter(t => filter === 'All' || t.type === filter)
    .filter(t => t.title.toLowerCase().includes(search.toLowerCase()));

  const handleAction = (type: string, title: string) => {
    if (type === 'Register') {
      notify(`Application sent for ${title}!`);
    } else {
      notify(`Checking seat availability for ${title}...`);
    }
  };

  return (
    <div className="pt-20">
      <section className="bg-background-dark py-24 border-b border-primary/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 blur-[120px] -rotate-12 transform translate-x-1/2"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <span className="material-icons text-primary text-5xl mb-6 drop-shadow-[0_0_15px_rgba(212,175,55,0.4)]">emoji_events</span>
          <h1 className="font-display text-4xl md:text-7xl font-black mb-6 gold-gradient-text uppercase tracking-tight">Arena Calendar</h1>
          <p className="text-slate-400 max-w-2xl mx-auto italic font-serif text-lg md:text-xl leading-relaxed">
            Witness the convergence of skill and strategy. Browse upcoming fixtures at the realm of champions.
          </p>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-background-dark/50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-16 bg-white dark:bg-card-dark p-6 rounded-3xl border border-primary/10 shadow-xl">
            <div className="flex flex-wrap justify-center gap-2 p-1.5 bg-slate-100 dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/10">
              {['All', 'Professional', 'Amateur', 'Youth'].map((cat) => (
                <button 
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === cat ? 'bg-primary text-black shadow-lg shadow-primary/20 scale-105' : 'hover:text-primary dark:text-slate-500'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
            <div className="relative w-full md:w-96">
              <span className="material-icons absolute left-4 top-1/2 -translate-y-1/2 text-primary">search</span>
              <input 
                type="text" 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Find specific tournaments..." 
                className="pl-12 pr-4 py-4 w-full bg-slate-100 dark:bg-white/5 border-none rounded-2xl text-xs font-bold uppercase tracking-widest focus:ring-2 focus:ring-primary transition-all dark:text-white" 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {filtered.length > 0 ? filtered.map((t) => (
              <div key={t.id} className="group flex flex-col xl:flex-row bg-white dark:bg-card-dark border border-slate-200 dark:border-primary/10 rounded-[2rem] overflow-hidden hover:border-primary/50 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5">
                <div className="w-full xl:w-2/5 h-64 xl:h-auto overflow-hidden relative">
                  <img src={t.img} alt={t.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent xl:hidden"></div>
                  <div className="absolute bottom-6 left-6 xl:hidden">
                     <span className="px-3 py-1 bg-primary text-black text-[9px] font-black uppercase rounded-full">{t.type}</span>
                  </div>
                </div>
                <div className="flex-1 p-10 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-6">
                      <span className="hidden xl:block text-[11px] font-black text-primary uppercase tracking-[0.3em]">{t.type}</span>
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                        t.status === 'Ongoing' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-primary/10 text-primary border-primary/20'
                      }`}>{t.status}</span>
                    </div>
                    <h3 className="text-3xl font-display font-black mb-6 dark:text-white group-hover:text-primary transition-colors leading-tight uppercase tracking-tight">{t.title}</h3>
                    <div className="space-y-3 mb-10">
                      <div className="flex items-center gap-3 text-xs font-bold dark:text-slate-400">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-white/5 flex items-center justify-center"><span className="material-icons text-base text-primary">calendar_today</span></div>
                        <span className="uppercase tracking-widest">{t.date}</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs font-bold dark:text-slate-400">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-white/5 flex items-center justify-center"><span className="material-icons text-base text-primary">sports_soccer</span></div>
                        <span className="uppercase tracking-widest">RJS Arena • Pitch A & B</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <button 
                      onClick={() => handleAction('Register', t.title)}
                      className="flex-1 py-4 bg-primary text-black font-black rounded-2xl text-[10px] uppercase tracking-[0.2em] hover:shadow-lg hover:shadow-primary/30 transition-all transform active:scale-95"
                    >
                      TEAM SIGNUP
                    </button>
                    <button 
                      onClick={() => handleAction('Tickets', t.title)}
                      className="flex-1 py-4 border-2 border-primary text-primary font-black rounded-2xl text-[10px] uppercase tracking-[0.2em] hover:bg-primary hover:text-black transition-all transform active:scale-95"
                    >
                      GET TICKETS
                    </button>
                  </div>
                </div>
              </div>
            )) : (
              <div className="col-span-full py-20 text-center">
                 <span className="material-icons text-slate-700 text-7xl mb-6">event_busy</span>
                 <p className="text-slate-500 font-display text-2xl uppercase tracking-widest">No matching events found</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default TournamentsView;
