
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { useNotify } from '../App';

interface Tournament {
  id: number;
  type: string;
  title: string;
  date: string;
  status: string;
  img: string;
}

const AdminDashboardView: React.FC = () => {
  const { notify } = useNotify();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [newEvent, setNewEvent] = useState({
    title: '',
    type: 'Professional',
    startDate: '',
    endDate: '',
    status: 'Upcoming',
    img: '' 
  });

  const data = [
    { name: 'Mon', sales: 4000, reg: 2400 },
    { name: 'Tue', sales: 3000, reg: 1398 },
    { name: 'Wed', sales: 2000, reg: 9800 },
    { name: 'Thu', sales: 2780, reg: 3908 },
    { name: 'Fri', sales: 1890, reg: 4800 },
    { name: 'Sat', sales: 2390, reg: 3800 },
    { name: 'Sun', sales: 3490, reg: 4300 },
  ];

  useEffect(() => {
    const stored = localStorage.getItem('rjs_tournaments');
    if (stored) {
      setTournaments(JSON.parse(stored));
    }
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        notify("Asset too large. Max 2MB allowed.", "error");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewEvent({ ...newEvent, img: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const formatDateRange = (start: string, end: string) => {
    if (!start) return '';
    const s = new Date(start);
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
    const startStr = s.toLocaleDateString('en-US', options);
    
    if (!end || start === end) {
      return `${startStr}, ${s.getFullYear()}`;
    }
    
    const e = new Date(end);
    const endStr = e.toLocaleDateString('en-US', options);
    return `${startStr} - ${endStr}, ${e.getFullYear()}`;
  };

  const handlePostEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvent.title || !newEvent.startDate) {
      notify("Please fill in title and start date", "error");
      return;
    }

    const tournament: Tournament = {
      id: Date.now(),
      title: newEvent.title,
      type: newEvent.type,
      status: newEvent.status,
      date: formatDateRange(newEvent.startDate, newEvent.endDate),
      img: newEvent.img || 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=800'
    };

    const updated = [tournament, ...tournaments];
    setTournaments(updated);
    localStorage.setItem('rjs_tournaments', JSON.stringify(updated));
    
    setIsModalOpen(false);
    setNewEvent({
      title: '',
      type: 'Professional',
      startDate: '',
      endDate: '',
      status: 'Upcoming',
      img: ''
    });
    notify("New Event Posted Successfully!");
  };

  return (
    <div className="pt-20 min-h-screen bg-background-light dark:bg-background-dark">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-black dark:text-white uppercase tracking-tight">Dashboard Overview</h1>
            <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">Welcome back, Admin. Real-time stats for RITHY JESDA ARENA.</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-primary text-black font-bold px-6 py-2.5 rounded-lg flex items-center gap-2 text-xs uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-105 transition-all"
          >
            <span className="material-icons text-sm">add</span> New Event
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard title="Ticket Sales" value="$24,580" change="+12%" up icon="payments" color="text-primary" />
          <StatCard title="New Registrations" value="1,248" change="+8%" up icon="group" color="text-blue-500" />
          <StatCard title="Site Visitors" value="45.2K" change="Stable" icon="language" color="text-purple-500" />
          <StatCard title="Active Tournaments" value={tournaments.length.toString()} change="+1" up icon="event" color="text-primary" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
          <div className="lg:col-span-2 bg-white dark:bg-card-dark p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-display font-bold text-lg dark:text-white uppercase tracking-widest text-xs">Revenue Performance</h3>
              <select className="bg-slate-100 dark:bg-white/5 border-none text-[10px] font-bold uppercase rounded-lg px-3 py-1.5 focus:ring-1 focus:ring-primary cursor-pointer dark:text-slate-400">
                <option>Last 30 Days</option>
                <option>Year to Date</option>
              </select>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" />
                  <XAxis dataKey="name" stroke="#666" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="#666" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#161618', border: '1px solid #333', fontSize: '10px', borderRadius: '8px' }}
                    itemStyle={{ color: '#D4AF37' }}
                  />
                  <Line type="monotone" dataKey="sales" stroke="#D4AF37" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="bg-white dark:bg-card-dark p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="font-display font-bold text-lg dark:text-white uppercase tracking-widest text-xs mb-8">Recent Activity</h3>
            <div className="space-y-6">
               <ActivityItem icon="confirmation_number" color="bg-primary/10 text-primary" title="New Ticket Purchase" desc="John Doe bought 2 VIP tickets." time="2 mins ago" />
               <ActivityItem icon="person_add" color="bg-blue-500/10 text-blue-500" title="New User Registered" desc="Sarah Chen joined as Member." time="45 mins ago" />
               <ActivityItem icon="warning" color="bg-yellow-500/10 text-yellow-500" title="Scheduling Conflict" desc="Pitch A double booking Dec 15th." time="2 hours ago" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-card-dark rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <h3 className="font-display font-bold text-lg dark:text-white uppercase tracking-widest text-xs">Recently Posted Tournaments</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 dark:bg-white/5 border-b border-slate-100 dark:border-slate-800 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
                <tr>
                  <th className="px-8 py-4">Tournament Name</th>
                  <th className="px-8 py-4">Date</th>
                  <th className="px-8 py-4">Type</th>
                  <th className="px-8 py-4">Status</th>
                  <th className="px-8 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {tournaments.slice(0, 5).map(t => (
                  <TableRow key={t.id} title={t.title} subtitle={t.type} date={t.date} teams="Managed" status={t.status} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* New Event Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="bg-white dark:bg-card-dark border border-primary/20 rounded-[2rem] w-full max-w-2xl shadow-2xl overflow-hidden my-auto">
            <div className="bg-primary px-8 py-6 flex justify-between items-center">
              <h2 className="text-black font-display font-black uppercase tracking-widest text-lg">Create New Tournament</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-black/60 hover:text-black transition-colors">
                <span className="material-icons">close</span>
              </button>
            </div>
            <form onSubmit={handlePostEvent} className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Side: Basic Info */}
                <div className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-2">Tournament Title</label>
                    <input 
                      type="text" 
                      value={newEvent.title}
                      onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                      placeholder="e.g. Winter Futsal Clash"
                      className="w-full bg-slate-100 dark:bg-white/5 border-none rounded-xl py-4 px-5 text-sm dark:text-white focus:ring-2 focus:ring-primary transition-all"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-2">Type</label>
                      <select 
                        value={newEvent.type}
                        onChange={(e) => setNewEvent({...newEvent, type: e.target.value})}
                        className="w-full bg-slate-100 dark:bg-white/5 border-none rounded-xl py-4 px-5 text-[10px] dark:text-white focus:ring-2 focus:ring-primary transition-all font-bold uppercase"
                      >
                        <option>Professional</option>
                        <option>Amateur</option>
                        <option>Youth</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-2">Status</label>
                      <select 
                        value={newEvent.status}
                        onChange={(e) => setNewEvent({...newEvent, status: e.target.value})}
                        className="w-full bg-slate-100 dark:bg-white/5 border-none rounded-xl py-4 px-5 text-[10px] dark:text-white focus:ring-2 focus:ring-primary transition-all font-bold uppercase"
                      >
                        <option>Upcoming</option>
                        <option>Registration Open</option>
                        <option>Ongoing</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-2">Tournament Date Range</label>
                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        <input 
                          type="date" 
                          value={newEvent.startDate}
                          onChange={(e) => setNewEvent({...newEvent, startDate: e.target.value})}
                          className="w-full bg-slate-100 dark:bg-white/5 border-none rounded-xl py-3 px-4 text-[11px] dark:text-white focus:ring-2 focus:ring-primary transition-all color-scheme-dark font-bold"
                        />
                      </div>
                      <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest">To</span>
                      <div className="flex-1">
                        <input 
                          type="date" 
                          value={newEvent.endDate}
                          onChange={(e) => setNewEvent({...newEvent, endDate: e.target.value})}
                          className="w-full bg-slate-100 dark:bg-white/5 border-none rounded-xl py-3 px-4 text-[11px] dark:text-white focus:ring-2 focus:ring-primary transition-all color-scheme-dark font-bold"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Side: Image Upload */}
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-2">Tournament Hero Poster</label>
                  <div className="relative group">
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="tournament-image-upload"
                    />
                    <label 
                      htmlFor="tournament-image-upload"
                      className="flex flex-col items-center justify-center w-full h-[220px] bg-slate-100 dark:bg-white/5 border-2 border-dashed border-slate-300 dark:border-slate-800 rounded-2xl cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all overflow-hidden"
                    >
                      {newEvent.img ? (
                        <img src={newEvent.img} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <div className="flex flex-col items-center p-6 text-center">
                          <span className="material-icons text-primary text-4xl mb-3">add_photo_alternate</span>
                          <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Select Visual Asset</span>
                          <span className="text-[9px] text-slate-400 mt-2 uppercase">PNG, JPG up to 2MB</span>
                        </div>
                      )}
                    </label>
                    {newEvent.img && (
                      <button 
                        type="button"
                        onClick={() => setNewEvent({...newEvent, img: ''})}
                        className="absolute -top-3 -right-3 bg-red-600 text-white p-1.5 rounded-full shadow-xl opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-red-700"
                      >
                        <span className="material-icons text-xs">close</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
                <button 
                  type="submit"
                  className="w-full bg-primary text-black font-black py-4 rounded-2xl uppercase tracking-[0.2em] text-[11px] shadow-2xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
                >
                  PUBLISH TO ARENA CALENDAR
                </button>
                <p className="text-center text-[9px] text-slate-500 uppercase tracking-widest font-black mt-4">This action will update the public 'Events' section immediately.</p>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const StatCard = ({ title, value, change, up, icon, color }: any) => (
  <div className="bg-white dark:bg-card-dark p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
    <div className="flex items-center justify-between mb-4">
      <span className={`p-3 rounded-xl material-icons ${color} bg-opacity-10 bg-current`}>{icon}</span>
      <span className={`text-[10px] font-bold flex items-center gap-1 ${up ? 'text-green-500' : 'text-red-500'}`}>
        {change} <span className="material-icons text-[10px]">{up ? 'trending_up' : 'trending_down'}</span>
      </span>
    </div>
    <p className="text-slate-500 dark:text-slate-400 text-[9px] font-bold uppercase tracking-widest">{title}</p>
    <h3 className="text-2xl font-display font-bold mt-1 dark:text-white tracking-tight">{value}</h3>
  </div>
);

const ActivityItem = ({ icon, color, title, desc, time }: any) => (
  <div className="flex gap-4">
    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${color}`}>
      <span className="material-icons text-sm">{icon}</span>
    </div>
    <div>
      <p className="text-xs font-bold dark:text-white">{title}</p>
      <p className="text-[10px] text-slate-500">{desc}</p>
      <span className="text-[8px] text-slate-400 uppercase font-black mt-1 block">{time}</span>
    </div>
  </div>
);

const TableRow = ({ title, subtitle, date, teams, status }: any) => (
  <tr className="hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors">
    <td className="px-8 py-5">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shadow-md">
          <span className="material-icons">sports_soccer</span>
        </div>
        <div>
          <p className="font-bold text-xs dark:text-white">{title}</p>
          <p className="text-[9px] text-slate-500 uppercase font-bold tracking-widest">{subtitle}</p>
        </div>
      </div>
    </td>
    <td className="px-8 py-5 text-[10px] font-bold uppercase tracking-tight dark:text-slate-400">{date}</td>
    <td className="px-8 py-5 text-[10px] font-bold uppercase tracking-tight dark:text-slate-400">{teams}</td>
    <td className="px-8 py-5">
      <span className={`px-2.5 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${
        status === 'Ongoing' ? 'bg-green-100 text-green-700' : 
        status === 'Upcoming' ? 'bg-primary/10 text-primary' : 
        'bg-yellow-100 text-yellow-700'
      }`}>{status}</span>
    </td>
    <td className="px-8 py-5 text-right">
      <button className="p-2 text-slate-400 hover:text-primary transition-colors">
        <span className="material-icons text-sm">more_horiz</span>
      </button>
    </td>
  </tr>
);

export default AdminDashboardView;
