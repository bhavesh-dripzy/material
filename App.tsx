
import React, { useState, useMemo } from 'react';
import { AppTab, Product, CartItem } from './types';
import { GROUPED_CATEGORIES, PRODUCTS, PRICE_DROP_PRODUCTS } from './constants';

// Generic Components
import BottomNav from './components/BottomNav';
import ProductCard from './components/ProductCard';
import { OrdersIcon } from './components/Icons';

// Home Tab Components
import HomeHeader from './tabs/home/Header';
import CrazyDealSection from './tabs/home/CrazyDealSection';
import FrequentlyBoughtSection from './tabs/home/FrequentlyBoughtSection';
import PriceDropSection from './tabs/home/PriceDropSection';

// Categories Tab Components
import CategoriesHeader from './tabs/categories/Header';
import BrowseCategoriesSection from './tabs/categories/BrowseCategoriesSection';

// Products Tab Components
import ProductListingHeader from './tabs/products/Header';
import ProductListingPage from './tabs/products/ProductListingPage';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.HOME);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [address] = useState('Bhavesh, House no 4, canal');

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prev => {
      const item = prev.find(i => i.id === id);
      if (item && item.quantity > 1) return prev.map(i => i.id === id ? { ...i, quantity: i.quantity - 1 } : i);
      return prev.filter(i => i.id !== id);
    });
  };

  const cartTotal = cart.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0);
  const cartCount = cart.reduce((acc, curr) => acc + curr.quantity, 0);

  const filteredProducts = useMemo(() => {
    if (!searchQuery) return PRODUCTS;
    return PRODUCTS.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [searchQuery]);

  const handleTabChange = (tab: AppTab) => {
    setActiveTab(tab);
    if (tab !== AppTab.SEARCH) setSearchQuery('');
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-white relative flex flex-col overflow-hidden shadow-2xl">
      
      {activeTab === AppTab.CATEGORIES ? (
        <CategoriesHeader 
          address={address} 
          searchQuery={searchQuery}
          onSearchChange={(val) => {
            setSearchQuery(val);
            setActiveTab(AppTab.SEARCH);
          }}
          onSearchClick={() => setActiveTab(AppTab.SEARCH)}
        />
      ) : activeTab === AppTab.PRODUCTS ? (
        <ProductListingHeader 
          title="Blockbuster Deals"
          onBack={() => setActiveTab(AppTab.HOME)}
          onSearchClick={() => setActiveTab(AppTab.SEARCH)}
          onFavoriteClick={() => {}}
        />
      ) : (
        <HomeHeader 
          address={address} 
          searchQuery={searchQuery}
          onSearchChange={(val) => {
            setSearchQuery(val);
            setActiveTab(AppTab.SEARCH);
          }}
          onSearchClick={() => setActiveTab(AppTab.SEARCH)}
        />
      )}

      <main className="flex-grow overflow-y-auto hide-scrollbar bg-white">
        {activeTab === AppTab.HOME && (
          <div className="pb-32 px-3">
            <CrazyDealSection />
            <PriceDropSection products={PRICE_DROP_PRODUCTS} onAdd={addToCart} onViewAll={() => setActiveTab(AppTab.PRODUCTS)} />
            <FrequentlyBoughtSection products={PRODUCTS} onAdd={addToCart} />
          </div>
        )}

        {activeTab === AppTab.CATEGORIES && (
          <div className="pb-32 px-4 pt-6 bg-white">
            <BrowseCategoriesSection 
              groups={GROUPED_CATEGORIES} 
              onCategoryClick={(name) => {
                setSearchQuery(name);
                setActiveTab(AppTab.SEARCH);
              }} 
            />
          </div>
        )}

        {activeTab === AppTab.ORDERS && (
          <div className="px-3 py-8 pb-32 flex flex-col items-center justify-center min-h-[50vh]">
            <div className="bg-gray-100 p-6 rounded-full mb-4">
              <OrdersIcon active />
            </div>
            <h3 className="text-sm font-black uppercase tracking-tight text-gray-900">No active orders</h3>
            <p className="text-[10px] text-gray-500 font-bold mt-1 text-center">Place your first order and track it here in real-time!</p>
            <button onClick={() => setActiveTab(AppTab.HOME)} className="mt-6 bg-green-700 text-white px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-green-100">
              Start Shopping
            </button>
          </div>
        )}

        {activeTab === AppTab.SEARCH && (
          <div className="px-3 py-3 pb-32">
             <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-black uppercase tracking-tight text-gray-400">Search Results</h3>
                {searchQuery && <button onClick={() => setSearchQuery('')} className="text-[10px] font-black text-red-600 uppercase tracking-widest">Clear</button>}
             </div>
             <div className="grid grid-cols-2 gap-3">
               {filteredProducts.map(p => (
                 <ProductCard key={p.id} product={p} onAdd={addToCart} />
               ))}
               {filteredProducts.length === 0 && (
                 <div className="col-span-2 text-center py-12 text-gray-400 text-sm font-bold">No materials found for "{searchQuery}"</div>
               )}
             </div>
          </div>
        )}

        {activeTab === AppTab.PRODUCTS && (
          <ProductListingPage 
            products={[...PRICE_DROP_PRODUCTS, ...PRODUCTS]} 
            onAdd={addToCart}
            title="Blockbuster Deals"
          />
        )}

        {activeTab === AppTab.CART && (
           <div className="px-3 py-4 pb-32">
              <div className="flex items-center gap-2 mb-4">
                 <button onClick={() => setActiveTab(AppTab.HOME)} className="p-1"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="m15 18-6-6 6-6"/></svg></button>
                 <h3 className="text-lg font-black uppercase tracking-tighter">Your Basket</h3>
              </div>
              {cart.length === 0 ? (
                <div className="text-center py-16 opacity-40">
                  <div className="text-4xl mb-3">🛒</div>
                  <p className="font-bold text-sm">Basket is empty</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="bg-gray-50 rounded-xl p-3">
                    {cart.map(item => (
                      <div key={item.id} className="flex gap-3 py-2 border-b border-gray-200 last:border-0 items-center">
                         <img src={item.image} className="w-10 h-10 rounded-lg" alt={item.name} />
                         <div className="flex-grow">
                           <div className="text-[11px] font-bold truncate max-w-[150px]">{item.name}</div>
                           <div className="text-[9px] text-gray-500">₹{item.price} x {item.quantity}</div>
                         </div>
                         <div className="flex items-center gap-2">
                           <button onClick={() => removeFromCart(item.id)} className="w-6 h-6 bg-red-50 text-red-600 rounded-full flex items-center justify-center font-bold text-xs">−</button>
                           <span className="font-bold text-xs">{item.quantity}</span>
                           <button onClick={() => addToCart(item)} className="w-6 h-6 bg-green-50 text-green-600 rounded-full flex items-center justify-center font-bold text-xs">+</button>
                         </div>
                      </div>
                    ))}
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3 flex justify-between items-center">
                    <span className="font-bold text-xs uppercase tracking-tight">Total Payable</span>
                    <span className="text-lg font-black">₹{cartTotal}</span>
                  </div>
                  <button className="w-full bg-green-700 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs mt-4">Place Order</button>
                </div>
              )}
           </div>
        )}
      </main>

      <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />

      {cart.length > 0 && activeTab !== AppTab.CART && (
         <div className="fixed bottom-24 left-1/2 -translate-x-1/2 w-[92%] z-50">
            <button 
              onClick={() => setActiveTab(AppTab.CART)}
              className="w-full bg-green-700 text-white rounded-xl px-4 py-3.5 shadow-2xl flex items-center justify-between shadow-green-100/50"
            >
              <div className="flex items-center gap-3">
                <div className="bg-green-800 rounded-lg px-2 py-1 text-[10px] font-black uppercase tracking-tighter">{cartCount} items</div>
                <div className="flex flex-col items-start leading-none">
                  <span className="text-[13px] font-black">₹{cartTotal}</span>
                  <span className="text-[8px] font-bold text-green-300 uppercase mt-0.5">Plus Taxes</span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-[11px] font-black uppercase tracking-widest">View Basket</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><path d="m9 18 6-6-6-6"/></svg>
              </div>
            </button>
         </div>
      )}
    </div>
  );
};

export default App;
