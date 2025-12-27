import React from 'react';
import { SearchIcon, MicIcon, WalletIcon, AccountIcon } from '../../components/Icons';

interface HeaderProps {
  address: string;
  searchQuery: string;
  onSearchChange: (val: string) => void;
  onSearchClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ address, searchQuery, onSearchChange, onSearchClick }) => {
  return (
    <div className="bg-ray-pattern px-4 pt-3 pb-2.5 sticky top-0 z-50 transition-all duration-300 border-b border-white/20">
      {/* Top Row: Brand, Time & Icons */}
      <div className="flex items-start justify-between mb-1.5">
        <div className="flex flex-col">
          <span className="text-[12px] font-extrabold text-gray-800 leading-none mb-0.5 tracking-tight">BuildQuick in</span>
          <div className="flex items-center gap-1.5">
            <h1 className="text-[22px] font-[1000] text-gray-900 leading-none tracking-tighter">60 minutes</h1>
            <div className="bg-[#fff8e1] border border-[#fef3c7] rounded-full px-1.5 py-0.5 flex items-center gap-0.5 shadow-sm">
                <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#b45309" strokeWidth="4"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                <span className="text-[9px] font-black text-[#b45309] uppercase tracking-tighter">24/7</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <WalletIcon />
          <div className="w-9 h-9 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm border border-white/50 overflow-hidden">
             <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Bhavesh" alt="user" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>

      {/* Middle Row: Address - Decreased mb-3 to mb-1 */}
      <div className="flex items-center gap-0.5 mb-1 cursor-pointer group" onClick={onSearchClick}>
         <span className="text-[13px] font-black text-gray-900 uppercase tracking-tight">HOME</span>
         <span className="text-[13px] font-semibold text-gray-700 truncate max-w-[200px]">- {address}</span>
         <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" className="text-gray-900 group-active:translate-y-0.5 transition-transform"><path d="m6 9 6 6 6-6"/></svg>
      </div>

      {/* Bottom Row: Search Bar */}
      <div className="relative flex items-center group">
        <div className="absolute left-3.5 text-gray-900 z-10 pointer-events-none opacity-80">
          <SearchIcon size={20} />
        </div>
        <input 
          type="text" 
          placeholder='Search "cement", "pipes" or "paints"'
          className="w-full bg-white/95 backdrop-blur-sm border border-gray-800 rounded-xl py-2 pl-11 pr-11 text-[14px] font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-100 placeholder-gray-400 transition-all text-gray-900"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          onClick={onSearchClick}
        />
        <div className="absolute right-3.5 text-gray-900 z-10 pointer-events-none opacity-80">
          <MicIcon />
        </div>
      </div>
    </div>
  );
};

export default Header;