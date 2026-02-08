
import React from 'react';

const AboutView: React.FC = () => {
  return (
    <div className="flex flex-col pt-20">
      <header className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <img alt="Arena Entrance" className="absolute inset-0 w-full h-full object-cover grayscale" src="https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&q=80&w=2000" />
        <div className="absolute inset-0 hero-overlay"></div>
        <div className="relative z-10 text-center px-4">
          <h1 className="font-display text-4xl md:text-7xl font-bold mb-4 gold-gradient-text">About RITHY JESDA ARENA</h1>
          <p className="text-xl md:text-2xl text-slate-200 max-w-2xl mx-auto font-light italic">"Where tradition meets excellence in the heart of the game."</p>
        </div>
      </header>

      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <h2 className="font-display text-4xl font-bold border-l-4 border-primary pl-6 uppercase tracking-tight">The Legacy of RJS</h2>
              <p className="text-lg leading-relaxed text-slate-600 dark:text-slate-400">
                Founded in 2024, RITHY JESDA ARENA (RJS) emerged from a vision to elevate Cambodian sports to international standards. Named after the pillars of strength and victory, our facility is more than just a sports complex—it is a community hub for excellence.
              </p>
              <p className="text-lg leading-relaxed text-slate-600 dark:text-slate-400">
                Inspired by the three-headed elephant (Erawan), our logo represents the divine strength, wisdom, and cosmic order that we strive to bring to every tournament and training session.
              </p>
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="bg-slate-100 dark:bg-card-dark p-6 rounded-lg border border-primary/20">
                  <span className="material-icons text-primary text-3xl mb-2">military_tech</span>
                  <h3 className="font-bold mb-1 uppercase text-xs tracking-widest">Our Mission</h3>
                  <p className="text-xs text-slate-500">To provide a world-class sporting environment that fosters talent and discipline.</p>
                </div>
                <div className="bg-slate-100 dark:bg-card-dark p-6 rounded-lg border border-primary/20">
                  <span className="material-icons text-primary text-3xl mb-2">visibility</span>
                  <h3 className="font-bold mb-1 uppercase text-xs tracking-widest">Our Vision</h3>
                  <p className="text-xs text-slate-500">To be the premier destination for futsal and multisport development.</p>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-4 bg-primary/10 rounded-2xl rotate-3"></div>
              <img alt="Arena Court" className="relative rounded-2xl shadow-2xl border border-primary/30 grayscale transition-all duration-700 hover:grayscale-0" src="https://images.unsplash.com/photo-1551958219-acbc608c6377?auto=format&fit=crop&q=80&w=1000" />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-primary/5 dark:bg-card-dark/30 py-20 border-y border-primary/20">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <span className="material-icons text-primary text-6xl mb-8 drop-shadow-[0_0_15px_rgba(212,175,55,0.4)]">account_balance</span>
          <h2 className="font-display text-3xl font-bold mb-6 gold-gradient-text uppercase tracking-widest">The Symbolism of Victory</h2>
          <p className="text-xl max-w-3xl mx-auto text-slate-600 dark:text-slate-300 font-serif italic">
            "The three-headed elephant at the core of our identity symbolizes the unity of body, mind, and spirit. Like the celestial Airavata, RJS stands as a mountain of strength, welcoming athletes to conquer their limits."
          </p>
        </div>
      </section>

      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
            <div>
              <h2 className="font-display text-4xl font-bold mb-2 uppercase tracking-tight">Premium Facilities</h2>
              <p className="text-primary font-bold tracking-[0.2em] uppercase text-[10px]">Experience Modern Sports Infrastructure</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             <FacilityCard title="FIFA-Grade Courts" desc="Professional shock-absorption flooring for peak performance." img="https://images.unsplash.com/photo-1431324155629-1a6eda1dc150?auto=format&fit=crop&q=80&w=800" />
             <FacilityCard title="Strength Lab" desc="Dedicated conditioning area for elite athletes and training." img="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800" />
             <FacilityCard title="VIP Lounge" desc="Luxury recovery spaces for relaxation post-match and networking." img="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800" />
          </div>
        </div>
      </section>
    </div>
  );
};

const FacilityCard = ({ title, desc, img }: any) => (
  <div className="group relative h-80 overflow-hidden rounded-xl border border-primary/10 transition-transform hover:-translate-y-2">
    <img alt={title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" src={img} />
    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-6">
      <h3 className="text-xl font-bold text-white mb-1 group-hover:text-primary transition-colors">{title}</h3>
      <p className="text-slate-300 text-xs leading-relaxed">{desc}</p>
    </div>
  </div>
);

export default AboutView;
