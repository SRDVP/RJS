
import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { useNotify } from '../App';

interface Post {
  id: number;
  title: string;
  cat: string;
  author: string;
  date: string;
  views: string;
  status: 'Published' | 'Scheduled' | 'Draft';
  img?: string;
  desc?: string;
}

const AdminManagePostsView: React.FC = () => {
  const { notify } = useNotify();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewPost, setPreviewPost] = useState<Post | null>(null);
  const [newPost, setNewPost] = useState({
    title: '',
    cat: 'Announcements',
    scheduleDate: '',
    status: 'Published' as Post['status'],
    img: '',
    desc: ''
  });

  useEffect(() => {
    const saved = localStorage.getItem('rjs_posts');
    if (saved) {
      setPosts(JSON.parse(saved));
    } else {
      const initial: Post[] = [
        { id: 1, title: 'New VAR System Installed', cat: 'Technology', author: 'Admin RJ', date: 'Oct 24, 2025', views: '2.4k', status: 'Published', img: 'https://images.unsplash.com/photo-1511886929837-354d827aae26?auto=format&fit=crop&q=80&w=800', desc: 'RJS Arena becomes the first futsal-only facility in the region to integrate a full VAR suite.' },
        { id: 2, title: 'Premium Lounge Opening', cat: 'Arena', author: 'Editor Kim', date: 'Oct 26, 2025', views: '1.2k', status: 'Published', img: 'https://images.unsplash.com/photo-1540324155974-7523202daa3f?auto=format&fit=crop&q=80&w=800', desc: 'Watch the games in style from our newly renovated 360-degree viewing gallery.' },
        { id: 3, title: 'Top 5 Goals of September 2025', cat: 'Player Spotlights', author: 'Admin RJ', date: 'Drafted', views: '0', status: 'Draft', img: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&q=80&w=800' },
      ];
      setPosts(initial);
      localStorage.setItem('rjs_posts', JSON.stringify(initial));
    }
  }, []);

  const savePosts = (updated: Post[]) => {
    setPosts(updated);
    localStorage.setItem('rjs_posts', JSON.stringify(updated));
  };

  const deletePost = (id: number) => {
    const updated = posts.filter(p => p.id !== id);
    savePosts(updated);
    notify("Post deleted successfully", "error");
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        notify("Image too large. Max 2MB allowed.", "error");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewPost({ ...newPost, img: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateManualPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.title) {
      notify("Please enter a title", "error");
      return;
    }

    let finalStatus = newPost.status;
    let displayDate = new Date().toLocaleDateString();

    if (newPost.scheduleDate) {
      const selectedDate = new Date(newPost.scheduleDate);
      const now = new Date();
      if (selectedDate > now) {
        finalStatus = 'Scheduled';
        displayDate = selectedDate.toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' });
      } else {
        displayDate = selectedDate.toLocaleDateString();
      }
    }

    const post: Post = {
      id: Date.now(),
      title: newPost.title,
      cat: newPost.cat,
      author: 'Admin RJ',
      date: displayDate,
      views: '0',
      status: finalStatus,
      img: newPost.img || 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=800',
      desc: newPost.desc
    };

    savePosts([post, ...posts]);
    setIsModalOpen(false);
    setNewPost({ title: '', cat: 'Announcements', scheduleDate: '', status: 'Published', img: '', desc: '' });
    notify(finalStatus === 'Scheduled' ? "Post Scheduled!" : "Post Created!");
  };

  const generateAIPost = async () => {
    setIsGenerating(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: "Write a short, professional and exciting headline (under 10 words) for a new futsal tournament at RITHY JESDA ARENA.",
        config: {
          systemInstruction: "You are a senior sports journalist for RITHY JESDA ARENA, an elite futsal complex in Cambodia. Your tone is professional, high-energy, and prestigious.",
        },
      });

      const aiHeadline = response.text?.trim() || "Elite Futsal Invitational: The Quest for Gold Begins";
      
      const newPost: Post = {
        id: Date.now(),
        title: aiHeadline,
        cat: 'AI Generated',
        author: 'Gemini AI',
        date: new Date().toLocaleDateString(),
        views: '0',
        status: 'Draft',
        img: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=800'
      };

      savePosts([newPost, ...posts]);
      notify("AI Content Generated!");
    } catch (err) {
      console.error(err);
      notify("AI Generation Failed", "error");
    } finally {
      setIsGenerating(false);
    }
  };

  const openPreview = (post: Post) => {
    setPreviewPost(post);
    setIsPreviewOpen(true);
  };

  return (
    <div className="pt-20 min-h-screen bg-background-light dark:bg-background-dark">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
           <div>
              <h1 className="text-3xl font-display font-black dark:text-white uppercase flex items-center gap-3">
                News Room CMS
                <span className="px-2 py-0.5 text-[9px] font-black bg-primary/10 text-primary border border-primary/20 rounded uppercase tracking-widest">Management</span>
              </h1>
              <p className="text-slate-500 dark:text-slate-400 text-xs mt-1 font-medium italic">Command the narrative of RITHY JESDA ARENA.</p>
           </div>
           <div className="flex gap-3">
             <button 
                onClick={generateAIPost}
                disabled={isGenerating}
                className="bg-white dark:bg-card-dark border border-primary/40 text-primary font-black px-6 py-2.5 rounded-xl flex items-center gap-2 text-[10px] uppercase tracking-widest hover:bg-primary/10 transition-all disabled:opacity-50"
             >
                <span className={`material-icons text-sm ${isGenerating ? 'animate-spin' : ''}`}>auto_awesome</span> 
                {isGenerating ? "Synthesizing..." : "AI Generate Post"}
             </button>
             <button 
                onClick={() => setIsModalOpen(true)}
                className="bg-primary text-black font-black px-6 py-2.5 rounded-xl flex items-center gap-2 text-[10px] uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-105 transition-transform active:scale-95"
             >
                <span className="material-icons text-sm">add_circle</span> Manual Entry
             </button>
           </div>
        </header>

        <div className="bg-white dark:bg-card-dark rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
          <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row gap-4 justify-between bg-slate-50/50 dark:bg-white/[0.02]">
            <div className="relative flex-1 max-w-md">
              <span className="material-icons absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm">search</span>
              <input 
                type="text" 
                placeholder="Search articles, authors, or categories..." 
                className="w-full pl-12 pr-4 py-3 bg-white dark:bg-white/5 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:ring-primary focus:border-primary transition-all" 
              />
            </div>
            <select className="bg-white dark:bg-white/5 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-xs font-bold uppercase tracking-widest dark:text-slate-400">
               <option>All Categories</option>
               <option>Match Reports</option>
               <option>Announcements</option>
               <option>Technology</option>
               <option>Arena</option>
               <option>AI Generated</option>
            </select>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 dark:bg-white/[0.03] text-[9px] font-black uppercase tracking-widest text-slate-500 border-b border-slate-100 dark:border-slate-800">
                <tr>
                  <th className="px-8 py-5">Post Content</th>
                  <th className="px-8 py-5">Metadata</th>
                  <th className="px-8 py-5">Curator</th>
                  <th className="px-8 py-5">Deployment</th>
                  <th className="px-8 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {posts.map(post => (
                  <tr key={post.id} className="hover:bg-slate-50/80 dark:hover:bg-white/[0.015] transition-colors group animate-fade-in">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-5">
                        <div className={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 shadow-inner overflow-hidden ${
                          post.cat === 'AI Generated' ? 'bg-primary/10 text-primary' : 'bg-slate-200 dark:bg-white/5 text-slate-400'
                        }`}>
                          {post.img ? (
                            <img src={post.img} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <span className="material-icons text-2xl">{post.cat === 'AI Generated' ? 'auto_awesome' : 'newspaper'}</span>
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-sm dark:text-white group-hover:text-primary transition-colors leading-snug">{post.title}</p>
                          <p className="text-[9px] text-slate-500 uppercase font-black mt-1.5 flex items-center gap-2">
                            <span className="flex items-center gap-0.5"><span className="material-icons text-[12px]">visibility</span> {post.views}</span>
                            <span className="w-1 h-1 rounded-full bg-slate-700"></span>
                            <span>{post.date}</span>
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                       <span className="px-3 py-1 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-slate-800 rounded-lg text-[10px] font-bold uppercase tracking-tight dark:text-slate-400">
                         {post.cat}
                       </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center text-[11px] font-bold dark:text-slate-400">
                         <div className="w-8 h-8 rounded-full bg-primary text-black flex items-center justify-center mr-3 text-[9px] font-black shadow-lg shadow-primary/10">
                           {post.author.substr(0, 2).toUpperCase()}
                         </div>
                         {post.author}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                       <span className={`px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                         post.status === 'Published' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 
                         post.status === 'Scheduled' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 
                         'bg-slate-500/10 text-slate-500 border-slate-500/20'
                       }`}>
                         {post.status}
                       </span>
                    </td>
                    <td className="px-8 py-6 text-right space-x-1">
                       <button 
                         onClick={() => openPreview(post)}
                         className="p-2 hover:bg-slate-100 dark:hover:bg-white/10 rounded-lg text-slate-400 hover:text-primary transition-colors"
                         title="Preview"
                       >
                         <span className="material-icons text-lg">visibility</span>
                       </button>
                       <button className="p-2 hover:bg-slate-100 dark:hover:bg-white/10 rounded-lg text-slate-400 hover:text-primary transition-colors" title="Edit">
                         <span className="material-icons text-lg">edit</span>
                       </button>
                       <button 
                         onClick={() => deletePost(post.id)}
                         className="p-2 hover:bg-red-100 dark:hover:bg-red-500/10 rounded-lg text-slate-400 hover:text-red-500 transition-colors"
                         title="Delete"
                       >
                         <span className="material-icons text-lg">delete_outline</span>
                       </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-8 py-6 bg-slate-50 dark:bg-white/[0.03] border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black">Archive capacity: {posts.length} entries utilized</p>
            <div className="flex gap-2">
              <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-primary transition-all"><span className="material-icons text-sm">chevron_left</span></button>
              <button className="px-4 h-8 flex items-center justify-center rounded-lg bg-primary text-black text-[10px] font-black">1</button>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-primary transition-all"><span className="material-icons text-sm">chevron_right</span></button>
            </div>
          </div>
        </div>
      </div>

      {/* Manual Entry / Scheduling Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="bg-white dark:bg-card-dark border border-primary/20 rounded-[2rem] w-full max-w-2xl shadow-2xl overflow-hidden my-auto">
            <div className="bg-primary px-8 py-6 flex justify-between items-center">
              <h2 className="text-black font-display font-black uppercase tracking-widest text-lg">Deploy Latest Arena News</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-black/60 hover:text-black transition-colors">
                <span className="material-icons">close</span>
              </button>
            </div>
            <form onSubmit={handleCreateManualPost} className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-2">News Headline</label>
                    <input 
                      type="text" 
                      value={newPost.title}
                      onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                      placeholder="Enter a captivating title..."
                      className="w-full bg-slate-100 dark:bg-white/5 border-none rounded-xl py-4 px-5 text-sm dark:text-white focus:ring-2 focus:ring-primary transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-2">Category / Type</label>
                    <select 
                      value={newPost.cat}
                      onChange={(e) => setNewPost({...newPost, cat: e.target.value})}
                      className="w-full bg-slate-100 dark:bg-white/5 border-none rounded-xl py-4 px-5 text-sm dark:text-white focus:ring-2 focus:ring-primary transition-all"
                    >
                      <option>Announcements</option>
                      <option>Technology</option>
                      <option>Arena Updates</option>
                      <option>Match Reports</option>
                      <option>Community</option>
                      <option>Tournament</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-2">Short Description</label>
                    <textarea 
                      rows={3}
                      value={newPost.desc}
                      onChange={(e) => setNewPost({...newPost, desc: e.target.value})}
                      placeholder="What is this news about?"
                      className="w-full bg-slate-100 dark:bg-white/5 border-none rounded-xl py-4 px-5 text-sm dark:text-white focus:ring-2 focus:ring-primary transition-all resize-none"
                    ></textarea>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-2">Hero Visual Asset</label>
                    <div className="relative group">
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="post-image-upload"
                      />
                      <label 
                        htmlFor="post-image-upload"
                        className="flex flex-col items-center justify-center w-full h-40 bg-slate-100 dark:bg-white/5 border-2 border-dashed border-slate-300 dark:border-slate-800 rounded-2xl cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all overflow-hidden"
                      >
                        {newPost.img ? (
                          <img src={newPost.img} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                          <div className="flex flex-col items-center p-4 text-center">
                            <span className="material-icons text-slate-400 text-3xl mb-2">add_a_photo</span>
                            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Click to upload image</span>
                            <span className="text-[8px] text-slate-400 mt-1 uppercase">Max size: 2MB</span>
                          </div>
                        )}
                      </label>
                      {newPost.img && (
                        <button 
                          type="button"
                          onClick={() => setNewPost({...newPost, img: ''})}
                          className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <span className="material-icons text-xs">close</span>
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-2">Publish Date</label>
                      <input 
                        type="datetime-local" 
                        value={newPost.scheduleDate}
                        onChange={(e) => setNewPost({...newPost, scheduleDate: e.target.value})}
                        className="w-full bg-slate-100 dark:bg-white/5 border-none rounded-xl py-4 px-5 text-[10px] dark:text-white focus:ring-2 focus:ring-primary transition-all color-scheme-dark"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-2">Initial Status</label>
                      <select 
                        value={newPost.status}
                        onChange={(e) => setNewPost({...newPost, status: e.target.value as Post['status']})}
                        className="w-full bg-slate-100 dark:bg-white/5 border-none rounded-xl py-4 px-5 text-[10px] dark:text-white focus:ring-2 focus:ring-primary transition-all uppercase font-black"
                      >
                        <option value="Published">Published</option>
                        <option value="Draft">Draft</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="pt-4">
                <button 
                  type="submit"
                  className="w-full bg-primary text-black font-black py-4 rounded-2xl uppercase tracking-[0.2em] text-[10px] shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
                >
                  DEPLOY TO PUBLIC HOME
                </button>
                <p className="text-center text-[9px] text-slate-500 uppercase tracking-widest font-bold mt-4">Selected 'Published' posts will immediately appear in 'Latest Arena News'.</p>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {isPreviewOpen && previewPost && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in">
          <div className="bg-background-light dark:bg-background-dark w-full max-w-2xl rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(212,175,55,0.2)] border border-primary/20">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-100 dark:bg-card-dark">
              <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Public View Simulation</span>
              <button onClick={() => setIsPreviewOpen(false)} className="w-8 h-8 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors">
                <span className="material-icons text-sm">close</span>
              </button>
            </div>
            <div className="h-64 relative">
              <img src={previewPost.img || "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=800"} alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-transparent to-transparent"></div>
            </div>
            <div className="px-10 pb-10 -mt-20 relative z-10">
              <div className="flex items-center gap-4 mb-4">
                <span className="px-4 py-1.5 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest rounded-full">{previewPost.cat}</span>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{previewPost.date}</span>
              </div>
              <h2 className="font-display text-3xl md:text-5xl font-black mb-6 dark:text-white leading-tight uppercase tracking-tight gold-gradient-text">
                {previewPost.title}
              </h2>
              <p className="text-slate-600 dark:text-slate-400 italic font-serif text-lg leading-relaxed mb-8">
                {previewPost.desc || "At RITHY JESDA ARENA, we don't just host games; we forge legends. This latest development represents another milestone in our commitment to sporting excellence in Cambodia."}
              </p>
              <div className="flex items-center justify-between py-6 border-y border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-black font-black text-xs">
                    {previewPost.author.substr(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-xs font-black dark:text-white uppercase tracking-widest">{previewPost.author}</p>
                    <p className="text-[10px] text-slate-500 font-bold">RJS Arena Editorial Team</p>
                  </div>
                </div>
                <div className="text-right">
                   <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Post Status</p>
                   <p className="text-xs font-black text-primary uppercase tracking-widest">{previewPost.status}</p>
                </div>
              </div>
              <button 
                onClick={() => setIsPreviewOpen(false)}
                className="mt-12 w-full py-4 border-2 border-primary text-primary font-black rounded-2xl uppercase tracking-[0.2em] text-[10px] hover:bg-primary hover:text-black transition-all"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const CMSInfoCard = ({ title, value, change, desc, icon, color }: any) => (
  <div className="bg-white dark:bg-card-dark border border-slate-200 dark:border-slate-800 p-8 rounded-2xl shadow-xl hover:shadow-primary/5 transition-all">
    <div className="flex items-center justify-between mb-4">
      <span className="text-slate-500 dark:text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">{title}</span>
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color} bg-opacity-10`}>
        <span className={`material-icons`}>{icon}</span>
      </div>
    </div>
    <div className="text-4xl font-display font-black text-slate-900 dark:text-white tracking-tighter">{value}</div>
    <div className="mt-4 flex items-center">
      {change ? (
        <span className="text-[10px] text-emerald-500 font-black flex items-center bg-emerald-500/10 px-2 py-0.5 rounded uppercase tracking-widest">
          <span className="material-icons text-[12px] mr-1">arrow_upward</span> {change}
        </span>
      ) : (
        <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest italic">{desc}</span>
      )}
    </div>
  </div>
);

export default AdminManagePostsView;
