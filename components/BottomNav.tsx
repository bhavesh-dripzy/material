
import React from 'react';
import { AppTab } from '../types';
import { HomeIcon, CategoriesIcon, OrdersIcon } from './Icons';

interface BottomNavProps {
  activeTab: AppTab;
  onTabChange: (tab: AppTab) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t border-gray-100 px-2 py-2.5 pb-6 flex items-center justify-around z-40">
      <button onClick={() => onTabChange(AppTab.HOME)} className={`flex flex-col items-center gap-1 transition-colors ${activeTab === AppTab.HOME ? 'text-black' : 'text-gray-400'}`}>
        <HomeIcon active={activeTab === AppTab.HOME} />
        <span className={`text-[9px] uppercase tracking-tighter font-bold`}>Home</span>
      </button>
      <button onClick={() => onTabChange(AppTab.CATEGORIES)} className={`flex flex-col items-center gap-1 transition-colors ${activeTab === AppTab.CATEGORIES ? 'text-black' : 'text-gray-400'}`}>
        <CategoriesIcon active={activeTab === AppTab.CATEGORIES} />
        <span className={`text-[9px] uppercase tracking-tighter font-bold`}>Category</span>
      </button>
      <button onClick={() => onTabChange(AppTab.ORDERS)} className={`flex flex-col items-center gap-1 transition-colors ${activeTab === AppTab.ORDERS ? 'text-black' : 'text-gray-400'}`}>
        <OrdersIcon active={activeTab === AppTab.ORDERS} />
        <span className={`text-[9px] uppercase tracking-tighter font-bold`}>Orders</span>
      </button>
    </nav>
  );
};

export default BottomNav;
