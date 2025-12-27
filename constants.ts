import { CategoryGroup, Product } from './types';

export const GROUPED_CATEGORIES: CategoryGroup[] = [
  {
    title: "Civil & Interiors",
    categories: [
      { id: 'cement', name: 'Cement', image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=200&auto=format&fit=crop' },
      { id: 'tiling', name: 'Tiling', image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=200&auto=format&fit=crop' },
      { id: 'painting', name: 'Painting', image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=200&auto=format&fit=crop' },
      { id: 'waterproofing', name: 'Water Proofing', image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=200&auto=format&fit=crop' },
      { id: 'plywood', name: 'Plywood, MDF & HDHMR', image: 'https://images.unsplash.com/photo-1628744448839-2462bc28b77d?q=80&w=200&auto=format&fit=crop' },
      { id: 'fevicol', name: 'Fevicol', image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=200&auto=format&fit=crop' },
      { id: 'hardware', name: 'General Hardware & Tools', image: 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?q=80&w=200&auto=format&fit=crop' },
      { id: 'appliances', name: 'Kitchen & Home Appliances', image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=200&auto=format&fit=crop' },
    ]
  },
  {
    title: "Furniture & Architectural Hardware",
    categories: [
      { id: 'hinges', name: 'Hinges, Channels & Handles', image: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?q=80&w=200&auto=format&fit=crop' },
      { id: 'kitchen-sys', name: 'Kitchen Systems & Accessories', image: 'https://images.unsplash.com/photo-1600585154526-990dcea46c99?q=80&w=200&auto=format&fit=crop' },
      { id: 'wardrobe', name: 'Wardrobe & Bed Fittings', image: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?q=80&w=200&auto=format&fit=crop' },
      { id: 'locks', name: 'Door Locks & Hardware', image: 'https://images.unsplash.com/photo-1510816159960-63fb58b4ddbb?q=80&w=200&auto=format&fit=crop' },
    ]
  },
  {
    title: "Electrical",
    categories: [
      { id: 'conduits', name: 'Conduits & GI Boxes', image: 'https://images.unsplash.com/photo-1558402529-d26c897104b9?q=80&w=200&auto=format&fit=crop' },
      { id: 'wires', name: 'Wires', image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=200&auto=format&fit=crop' },
      { id: 'switches', name: 'Switches & Sockets', image: 'https://images.unsplash.com/photo-1614859324967-bdf471b0724e?q=80&w=200&auto=format&fit=crop' },
      { id: 'lighting', name: 'Lighting', image: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=200&auto=format&fit=crop' },
    ]
  }
];

export const PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Ultratech Cement (OPC 43)',
    category: 'cement',
    price: 410,
    originalPrice: 450,
    unit: '50kg Bag',
    brand: 'Ultratech',
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=300&auto=format&fit=crop'
  },
  {
    id: 'p2',
    name: 'Havells 1.5 Sq mm FR Wire',
    category: 'electrical',
    price: 1540,
    originalPrice: 1800,
    unit: '90m Coil',
    brand: 'Havells',
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=300&auto=format&fit=crop'
  }
];

export const PRICE_DROP_PRODUCTS: Product[] = [
  {
    id: 'pd1',
    name: 'Berger Bison Emulsion Paint - White',
    category: 'painting',
    price: 120,
    originalPrice: 240,
    unit: '1 Litre',
    brand: 'Berger',
    image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=300&auto=format&fit=crop',
    rating: 4.8,
    ratingCount: 5620,
    deliveryTime: '25 MINS',
    discount: '50% OFF'
  },
  {
    id: 'pd2',
    name: 'Godrej Ultra Lock (Rim)',
    category: 'locks',
    price: 890,
    originalPrice: 1200,
    unit: '1 Unit',
    brand: 'Godrej',
    image: 'https://images.unsplash.com/photo-1510816159960-63fb58b4ddbb?q=80&w=300&auto=format&fit=crop',
    rating: 4.5,
    ratingCount: 17551,
    deliveryTime: '45 MINS',
    discount: '25% OFF'
  },
  {
    id: 'pd3',
    name: 'Bosch Professional Drill Machine',
    category: 'hardware',
    price: 2499,
    originalPrice: 4500,
    unit: 'Box Kit',
    brand: 'Bosch',
    image: 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?q=80&w=300&auto=format&fit=crop',
    rating: 4.7,
    ratingCount: 9581,
    deliveryTime: '60 MINS',
    discount: '44% OFF'
  }
];