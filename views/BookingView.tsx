
import React, { useState, useEffect, useMemo } from 'react';
import { useNotify } from '../App';

interface Seat {
  id: string;
  row: string;
  num: number;
  type: 'Gold' | 'Silver' | 'Standard' | 'Occupied';
  price: number;
}

const BookingView: React.FC = () => {
  const { notify } = useNotify();
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [occupiedIds, setOccupiedIds] = useState<string[]>([]);

  // Load persistence
  useEffect(() => {
    const stored = localStorage.getItem('rjs_occupied_seats');
    if (stored) {
      setOccupiedIds(JSON.parse(stored));
    } else {
      // Initial random occupancy
      const initial = ['A5', 'A6', 'B2', 'C10', 'D1', 'D2'];
      setOccupiedIds(initial);
      localStorage.setItem('rjs_occupied_seats', JSON.stringify(initial));
    }
  }, []);

  const rows = ['A', 'B', 'C', 'D'];
  const seatsPerRow = 12;

  const seats = useMemo(() => {
    const s: Seat[] = [];
    rows.forEach((row, rowIndex) => {
      for (let i = 1; i <= seatsPerRow; i++) {
        const id = `${row}${i}`;
        let type: Seat['type'] = 'Standard';
        let price = 40;
        if (rowIndex === 0) { type = 'Gold'; price = 120; }
        else if (rowIndex === 1) { type = 'Silver'; price = 80; }
        
        if (occupiedIds.includes(id)) type = 'Occupied';
        s.push({ id, row, num: i, type, price });
      }
    });
    return s;
  }, [occupiedIds]);

  const toggleSeat = (seat: Seat) => {
    if (seat.type === 'Occupied') return;
    if (selectedSeats.find(s => s.id === seat.id)) {
      setSelectedSeats(selectedSeats.filter(s => s.id !== seat.id));
    } else {
      if (selectedSeats.length >= 6) {
        notify("Max 6 seats per booking", "error");
        return;
      }
      setSelectedSeats([...selectedSeats, seat]);
    }
  };

  const handleCheckout = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const newOccupied = [...occupiedIds, ...selectedSeats.map(s => s.id)];
      setOccupiedIds(newOccupied);
      localStorage.setItem('rjs_occupied_seats', JSON.stringify(newOccupied));
      setIsProcessing(false);
      setIsSuccess(true);
      notify("Booking Confirmed!");
    }, 2000);
  };

  const subtotal = selectedSeats.reduce((acc, s) => acc + s.price, 0);
  const fee = selectedSeats.length > 0 ? 4.50 : 0;

  if (isSuccess) {
    return (
      <div className="pt-40 min-h-screen bg-background-dark text-white flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white/5 border border-primary/30 rounded-3xl p-10 text-center backdrop-blur-xl animate-scale-in">
          <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(212,175,55,0.4)]">
            <span className="material-icons text-black text-4xl font-bold">check</span>
          </div>
          <h2 className="font-display text-3xl font-black gold-gradient-text uppercase mb-2">Victory is Yours!</h2>
          <p className="text-slate-400 text-sm mb-8 italic">Your seats have been reserved. Show this digital ticket at the entrance.</p>
          
          <div className="bg-white p-4 rounded-2xl mb-8 mx-auto w-48 h-48 flex items-center justify-center">
            {/* Simulated QR Code */}
            <div className="grid grid-cols-4 gap-1 w-full h-full opacity-80">
               {Array.from({length: 16}).map((_, i) => (
                 <div key={i} className={`bg-black rounded-sm ${Math.random() > 0.5 ? 'opacity-100' : 'opacity-0'}`}></div>
               ))}
            </div>
          </div>

          <div className="text-left space-y-2 mb-8 border-y border-white/10 py-4">
            <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase"><span>Ticket ID</span> <span className="text-white">RJS-{Math.random().toString(36).substr(2, 9).toUpperCase()}</span></div>
            <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase"><span>Seats</span> <span className="text-white">{selectedSeats.map(s => s.id).join(', ')}</span></div>
          </div>

          <button onClick={() => { setIsSuccess(false); setSelectedSeats([]); }} className="text-primary font-bold text-xs uppercase tracking-widest hover:underline">Book More Seats</button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen bg-background-dark text-white">
      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Map */}
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm relative overflow-hidden shadow-2xl">
            <div className="mb-10 text-center">
              <h2 className="text-2xl font-display font-black uppercase gold-gradient-text tracking-widest">Select Your Seats</h2>
              <p className="text-slate-400 text-[10px] mt-1 uppercase tracking-widest font-bold">Golden Dragons vs Silver Phoenix • Season Final</p>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap justify-center gap-6 mb-12 text-[9px] font-bold uppercase tracking-widest">
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-primary"></div> Gold ($120)</div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-slate-400"></div> Silver ($80)</div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-slate-600"></div> Standard ($40)</div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-slate-800"></div> Occupied</div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm border-2 border-white bg-transparent shadow-[0_0_10px_#fff]"></div> Selected</div>
            </div>

            {/* Pitch */}
            <div className="w-full max-w-lg mx-auto aspect-[2/1] border-2 border-white/5 rounded-lg flex items-center justify-center mb-12 relative bg-emerald-900/10">
               <div className="w-1/2 h-full border-r border-white/10"></div>
               <div className="absolute size-24 border-2 border-white/10 rounded-full"></div>
               <div className="absolute left-0 w-8 h-16 border-y border-r border-white/10"></div>
               <div className="absolute right-0 w-8 h-16 border-y border-l border-white/10"></div>
               <span className="absolute text-[8px] text-white/10 font-black tracking-[0.5em] uppercase">Arena Floor</span>
            </div>

            {/* Seats Map */}
            <div className="flex flex-col gap-4 items-center mb-10 overflow-x-auto pb-4 custom-scrollbar">
              {rows.map(row => (
                <div key={row} className="flex gap-2 min-w-max">
                  <span className="w-6 text-[10px] font-bold text-slate-700 flex items-center justify-center">{row}</span>
                  {seats.filter(s => s.row === row).map(seat => (
                    <button 
                      key={seat.id}
                      disabled={seat.type === 'Occupied' || isProcessing}
                      onClick={() => toggleSeat(seat)}
                      className={`w-5 h-5 rounded-sm transition-all transform hover:scale-110 active:scale-90 ${
                        selectedSeats.find(s => s.id === seat.id) 
                          ? 'border-2 border-white scale-125 shadow-[0_0_15px_#fff] z-10' 
                          : ''
                      } ${
                        seat.type === 'Gold' ? 'bg-primary' :
                        seat.type === 'Silver' ? 'bg-slate-400' :
                        seat.type === 'Standard' ? 'bg-slate-600' :
                        'bg-slate-800 cursor-not-allowed opacity-30'
                      }`}
                      title={`${seat.id} - $${seat.price}`}
                    />
                  ))}
                  <span className="w-6 text-[10px] font-bold text-slate-700 flex items-center justify-center">{row}</span>
                </div>
              ))}
            </div>

            <p className="text-center text-[8px] text-slate-600 uppercase tracking-widest font-black">Entrance / Main Gallery</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InfoBox label="Venue" value="Rithy Jesda Arena" icon="location_on" />
            <InfoBox label="Date" value="Oct 24, 2026" icon="calendar_today" />
            <InfoBox label="Available" value={`${seats.filter(s => s.type !== 'Occupied').length} Seats`} icon="chair" />
          </div>
        </div>

        {/* Right: Checkout */}
        <div className="lg:col-span-4">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-xl sticky top-28 shadow-2xl">
            <h3 className="text-xl font-bold mb-6 gold-gradient-text uppercase tracking-widest">Order Summary</h3>
            
            <div className="space-y-4 max-h-64 overflow-y-auto custom-scrollbar mb-8 pr-2">
              {selectedSeats.length === 0 ? (
                <div className="text-center py-12 px-4">
                  <span className="material-icons text-slate-700 text-5xl mb-3">shopping_basket</span>
                  <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest italic">Your basket is empty.</p>
                </div>
              ) : (
                selectedSeats.map(seat => (
                  <div key={seat.id} className="flex justify-between items-center p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors group">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary text-black flex items-center justify-center shadow-lg shadow-primary/10">
                        <span className="material-icons text-xl">event_seat</span>
                      </div>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-tight">Row {seat.row} • Seat {seat.num}</p>
                        <p className="text-[9px] text-primary font-black uppercase tracking-tighter">{seat.type} Tier</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-black">${seat.price}</p>
                      <button onClick={() => toggleSeat(seat)} className="text-[9px] text-red-400 hover:text-red-300 uppercase tracking-widest font-bold transition-colors">Remove</button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {selectedSeats.length > 0 && (
              <div className="space-y-3 mb-8 border-t border-white/10 pt-6 animate-fade-in">
                <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase">
                  <span>Subtotal</span>
                  <span className="text-white">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase">
                  <span>Processing Fee</span>
                  <span className="text-white">${fee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-end pt-4 border-t border-white/10">
                  <div>
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Total Amount</p>
                    <p className="text-2xl font-black text-primary">${(subtotal + fee).toFixed(2)}</p>
                  </div>
                  <span className="text-[10px] text-slate-500 font-bold mb-1">USD</span>
                </div>
              </div>
            )}

            <button 
              onClick={handleCheckout}
              disabled={selectedSeats.length === 0 || isProcessing}
              className="w-full h-16 bg-primary hover:bg-primary-dark disabled:bg-slate-800 disabled:text-slate-600 disabled:cursor-not-allowed transition-all rounded-2xl flex items-center justify-center gap-3 text-black font-black text-sm uppercase tracking-widest shadow-xl shadow-primary/20 transform active:scale-95 overflow-hidden relative"
            >
              {isProcessing ? (
                <>
                  <span className="animate-spin material-icons">sync</span>
                  AUTHORIZING...
                </>
              ) : (
                <>
                  CONFIRM & PAY
                  <span className="material-icons">arrow_forward</span>
                </>
              )}
            </button>
            <p className="text-center text-[8px] text-slate-600 uppercase tracking-widest font-bold mt-4">Secure encrypted transaction</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const InfoBox = ({ label, value, icon }: any) => (
  <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex items-center gap-4 hover:bg-white/10 transition-colors">
    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
      <span className="material-icons">{icon}</span>
    </div>
    <div>
      <p className="text-[9px] text-slate-500 uppercase tracking-widest font-black mb-0.5">{label}</p>
      <p className="text-sm font-black uppercase tracking-tight">{value}</p>
    </div>
  </div>
);

export default BookingView;
