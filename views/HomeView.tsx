
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface NewsPost {
  id: number;
  title: string;
  cat: string;
  author: string;
  date: string;
  views: string;
  status: string;
  img?: string;
  desc?: string;
}

const HomeView: React.FC = () => {
  const [news, setNews] = useState<NewsPost[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('rjs_posts');
    if (saved) {
      setNews(JSON.parse(saved));
    } else {
      const initial: NewsPost[] = [
        { id: 1, title: 'New VAR System Installed', cat: 'Technology', author: 'Admin RJ', date: 'Oct 24, 2025', views: '2.4k', status: 'Published', img: 'https://images.unsplash.com/photo-1511886929837-354d827aae26?auto=format&fit=crop&q=80&w=800', desc: 'RJS Arena becomes the first futsal-only facility in the region to integrate a full VAR suite.' },
        { id: 2, title: 'Premium Lounge Opening', cat: 'Arena', author: 'Editor Kim', date: 'Oct 26, 2025', views: '1.2k', status: 'Published', img: 'https://images.unsplash.com/photo-1540324155974-7523202daa3f?auto=format&fit=crop&q=80&w=800', desc: 'Watch the games in style from our newly renovated 360-degree viewing gallery.' },
        { id: 3, title: 'Super Cup Prize Pool', cat: 'Tournament', author: 'Admin RJ', date: 'Drafted', views: '0', status: 'Published', img: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&q=80&w=800', desc: 'The 2026 RITHY JESDA SUPER CUP committee announces a record-breaking prize pool.' },
        { id: 4, title: 'Sunday Kids Academy', cat: 'Community', author: 'Admin RJ', date: 'Oct 30, 2025', views: '800', status: 'Published', img: 'https://images.unsplash.com/photo-1526232761682-d26e03ac148e?auto=format&fit=crop&q=80&w=800', desc: 'Registration now open for the summer intensive camp for players aged 6-12.' },
      ];
      setNews(initial);
      localStorage.setItem('rjs_posts', JSON.stringify(initial));
    }
  }, []);

  // Only show published news on home
  const publishedNews = news.filter(n => n.status === 'Published').slice(0, 4);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            alt="Futsal Action" 
            className="w-full h-full object-cover" 
            src="https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=2000"
          />
          <div className="absolute inset-0 hero-overlay"></div>
        </div>
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <div className="mb-8 animate-pulse">
            <span className="material-icons text-primary text-[120px] lg:text-[180px] drop-shadow-[0_0_50px_rgba(212,175,55,0.4)]">sports_soccer</span>
          </div>
          <h1 className="font-display text-4xl md:text-8xl font-black mb-4 gold-gradient-text tracking-tight uppercase">
            The Realm of Champions
          </h1>
          <p className="text-lg md:text-2xl text-slate-300 mb-10 max-w-2xl mx-auto font-light italic">
            Experience elite-level futsal in the heart of the city's premier sports complex.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/booking" className="bg-primary text-black font-bold py-4 px-10 rounded-full text-lg transition-all hover:shadow-[0_0_20px_rgba(212,175,55,0.6)] hover:scale-105">
              BOOK A COURT
            </Link>
            <Link to="/about" className="border-2 border-primary text-primary font-bold py-4 px-10 rounded-full text-lg hover:bg-primary hover:text-black transition-all">
              OUR STORY
            </Link>
          </div>
        </div>
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <span className="material-icons text-primary text-4xl">expand_more</span>
        </div>
      </section>

      {/* Stats Bar */}
      <div className="bg-primary text-black py-8 relative z-20">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-4xl font-display font-black">12</div>
            <div className="text-[10px] font-bold tracking-[0.2em] uppercase">FIFA PRO COURTS</div>
          </div>
          <div>
            <div className="text-4xl font-display font-black">500+</div>
            <div className="text-[10px] font-bold tracking-[0.2em] uppercase">MONTHLY MATCHES</div>
          </div>
          <div>
            <div className="text-4xl font-display font-black">2026</div>
            <div className="text-[10px] font-bold tracking-[0.2em] uppercase">SUPER CUP HOST</div>
          </div>
          <div>
            <div className="text-4xl font-display font-black">24/7</div>
            <div className="text-[10px] font-bold tracking-[0.2em] uppercase">ARENA ACCESS</div>
          </div>
        </div>
      </div>

      {/* Upcoming Events */}
      <section className="py-24 bg-white dark:bg-background-dark overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16">
            <div>
              <h2 className="text-primary font-bold tracking-[0.3em] text-[10px] mb-4 uppercase">Tournaments</h2>
              <h3 className="text-4xl md:text-6xl font-display font-black dark:text-white uppercase">UPCOMING <span className="text-silver-dark dark:text-slate-400">EVENTS</span></h3>
            </div>
            <Link to="/tournaments" className="text-primary hover:text-primary-dark font-bold flex items-center gap-2 mt-6 md:mt-0 transition-all group">
              VIEW CALENDAR <span className="material-icons group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </Link>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <EventCard 
              date="DEC 15, 2025" 
              icon="emoji_events" 
              title="Futsal Super Cup 2026 Qualifiers" 
              desc="The road to the championship begins. Top regional teams battle for the final 8 spots." 
              time="09:00 AM" 
              loc="Main Arena" 
            />
            <EventCard 
              date="JAN 05, 2026" 
              icon="stars" 
              title="Corporate Champions League" 
              desc="Elevate your team building to the next level. Season 4 of the city's best corporate tournament." 
              time="07:00 PM" 
              loc="Court 4-6" 
            />
            <EventCard 
              date="FEB 20, 2026" 
              icon="military_tech" 
              title="RJS Elite Youth Cup" 
              desc="Scouting the next generation of futsal stars. Ages 12-16 professional league." 
              time="08:00 AM" 
              loc="Youth Wing"
              highlight
            />
          </div>
        </div>
      </section>

      {/* Latest News */}
      <section className="py-24 bg-slate-50 dark:bg-[#0F0F11]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-primary font-bold tracking-[0.3em] text-[10px] mb-4 uppercase">Keep Updated</h2>
            <h3 className="text-4xl md:text-5xl font-display font-black dark:text-white uppercase">LATEST <span className="gold-gradient-text">ARENA NEWS</span></h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {publishedNews.length > 0 ? publishedNews.map((item) => (
              <NewsCard 
                key={item.id}
                tag={item.cat} 
                title={item.title} 
                desc={item.desc || "Read the latest updates from RJS Arena."} 
                img={item.img || "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=800"}
              />
            )) : (
              <div className="col-span-full py-10 text-center text-slate-500 italic uppercase text-[10px] tracking-widest font-black">
                No published news articles found.
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

const EventCard = ({ date, icon, title, desc, time, loc, highlight }: any) => (
  <div className={`group relative p-8 rounded-2xl border transition-all duration-500 ${highlight ? 'bg-primary text-black border-primary scale-105 shadow-2xl' : 'bg-white dark:bg-card-dark border-transparent hover:border-primary/40 dark:text-white'}`}>
    <div className="flex justify-between items-start mb-6">
      <div className={`px-4 py-2 rounded-lg font-bold text-[10px] tracking-widest uppercase ${highlight ? 'bg-black text-primary' : 'bg-primary/10 text-primary'}`}>{date}</div>
      <span className={`material-icons text-4xl ${highlight ? 'text-black' : 'text-primary/40'}`}>{icon}</span>
    </div>
    <h4 className="text-2xl font-display font-bold mb-4">{title}</h4>
    <p className={`mb-8 text-sm ${highlight ? 'text-black/70' : 'text-slate-500 dark:text-slate-400'}`}>{desc}</p>
    <div className={`flex items-center gap-4 text-xs font-bold ${highlight ? 'text-black' : 'dark:text-slate-300'}`}>
      <span className="flex items-center gap-1"><span className={`material-icons text-base ${highlight ? 'text-black' : 'text-primary'}`}>schedule</span> {time}</span>
      <span className="flex items-center gap-1"><span className={`material-icons text-base ${highlight ? 'text-black' : 'text-primary'}`}>place</span> {loc}</span>
    </div>
    <Link to="/tournaments" className={`block text-center w-full mt-8 py-4 border font-bold rounded-xl transition-all uppercase tracking-widest text-[10px] ${highlight ? 'bg-black text-primary border-black' : 'border-primary text-primary hover:bg-primary hover:text-black'}`}>
      {highlight ? 'JOIN WAITLIST' : 'REGISTER TEAM'}
    </Link>
  </div>
);

const NewsCard = ({ tag, title, desc, img }: any) => (
  <div className="bg-white dark:bg-card-dark rounded-2xl overflow-hidden group shadow-xl transition-transform hover:-translate-y-2 h-full flex flex-col">
    <div className="h-48 overflow-hidden flex-shrink-0">
      <img alt={title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" src={img} />
    </div>
    <div className="p-6 flex flex-col flex-grow">
      <span className="text-[9px] font-black text-primary tracking-widest uppercase">{tag}</span>
      <h5 className="text-lg font-bold mt-2 mb-3 dark:text-white group-hover:text-primary transition-colors leading-snug">{title}</h5>
      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed flex-grow">{desc}</p>
      <Link className="mt-4 inline-block text-[10px] font-bold border-b border-primary text-primary uppercase tracking-widest self-start" to="#">READ MORE</Link>
    </div>
  </div>
);

export default HomeView;
