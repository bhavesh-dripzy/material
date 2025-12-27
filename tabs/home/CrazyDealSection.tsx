import React from 'react';

const PromoCard = ({ title, image, showBingo }: { title: string; image: string; showBingo?: boolean }) => (
  <div className="bg-white border-[2.5px] border-[#1e3a8a] rounded-2xl p-2 flex flex-col items-center justify-start aspect-[2/3] relative overflow-hidden group active:scale-95 transition-transform shadow-md">
    {/* Title at the top */}
    <h3 className="text-[9px] font-black text-gray-900 text-center leading-tight uppercase tracking-tighter z-10 mb-2 h-5 flex items-center justify-center">
      {title}
    </h3>
    
    {/* Centered Image Area */}
    <div className="flex-grow flex items-center justify-center w-full px-1 relative z-10">
      <img 
        src={image} 
        alt={title} 
        className="max-h-[85%] w-full object-contain drop-shadow-[0_4px_8px_rgba(0,0,0,0.05)]" 
      />
      
      {/* Specific Bingo sticker placement for Safety Gear as per screenshot */}
      {showBingo && (
        <div className="absolute right-0 bottom-0 w-8 h-8 bg-[#fff100] border-2 border-white rounded-lg rotate-12 shadow-md flex items-center justify-center z-20">
           <span className="text-[6px] font-[1000] text-red-600 uppercase -rotate-12 italic tracking-tighter">BINGO!</span>
        </div>
      )}
    </div>
  </div>
);

const CrazyDealSection: React.FC = () => {
  return (
    <div className="bg-[#e0f2fe]/60 -mx-3 px-3 pt-6 pb-8 mb-6 relative overflow-hidden border-b border-blue-100">
      {/* Background patterns */}
      <div className="absolute top-0 right-0 opacity-10 pointer-events-none scale-150 translate-x-10 -translate-y-10">
        <svg width="200" height="200" viewBox="0 0 24 24" fill="#3b82f6"><circle cx="12" cy="12" r="8"/></svg>
      </div>
      
      {/* Lightning Bolt branding in background */}
      <div className="absolute top-10 right-10 w-40 h-40 text-blue-400 opacity-10 pointer-events-none">
        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
      </div>

      <div className="relative z-10">
      
        {/* Promotional Header */}
        <div className="flex flex-col items-center mb-4 relative">
          {/* Glowing background effect */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-white/80 blur-[40px] rounded-full"></div>
          
          <div className="relative flex flex-col items-center text-center">
            {/* Headings */}
            <div className="flex flex-col -space-y-0.5 mb-1">
              <span className="text-[16px] font-[1000] text-[#ff7d45] leading-none tracking-tight uppercase italic">100% Original</span>
            </div>
            
            {/* Subtext */}
            <p className="text-[9px] font-black text-blue-900 leading-tight mb-3 px-10 max-w-[240px] uppercase">
              Construction Materials Delivered Fast
            </p>
          </div>
        </div>

        {/* Grid of Items */}
        <div className="grid grid-cols-4 gap-2 px-0.5 relative z-10">
          <PromoCard 
            title="HOUSE PAINTS" 
            image="https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=200&auto=format&fit=crop" 
          />
          <PromoCard 
            title="DRILL SETS" 
            image="https://images.unsplash.com/photo-1581244277943-fe4a9c777189?q=80&w=200&auto=format&fit=crop" 
          />
          <PromoCard 
            title="ELECTRICALS" 
            image="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=200&auto=format&fit=crop" 
          />
          <PromoCard 
            title="HARDWARES" 
            image="https://images.unsplash.com/photo-1510816159960-63fb58b4ddbb?q=80&w=200&auto=format&fit=crop" 
          />
          <PromoCard 
            title="PLUMBING" 
            image="https://images.unsplash.com/photo-1558402529-d26c897104b9?q=80&w=200&auto=format&fit=crop" 
          />
          <PromoCard 
            title="GARDEN TOOLS" 
            image="https://images.unsplash.com/photo-1558402529-d26c897104b9?q=80&w=200&auto=format&fit=crop" 
          />
          <PromoCard 
            title="LOCKS & KEYS" 
            image="https://images.unsplash.com/photo-1510816159960-63fb58b4ddbb?q=80&w=200&auto=format&fit=crop" 
          />
          <PromoCard 
            title="SAFETY GEAR" 
            image="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=200&auto=format&fit=crop" 
            showBingo
          />
        </div>
      </div>
    </div>
  );
};

export default CrazyDealSection;