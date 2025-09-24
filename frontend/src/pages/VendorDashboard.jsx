import React from 'react';

// --- DUMMY DATA (Replace with your API data) ---
const suppliersData = [
  {
    id: 1,
    name: 'Vinayaka Retailer',
    rating: 4.5,
    imageUrl: 'https://placehold.co/300x200/d1fae5/34d399?text=Grocery+Aisles',
  },
  {
    id: 2,
    name: 'Gopal Wholesale',
    rating: 3.8,
    imageUrl: 'https://placehold.co/300x200/e0e7ff/818cf8?text=Market+Stall',
  },
  {
    id: 3,
    name: 'Om Shanti Retail',
    rating: 4.2,
    imageUrl: 'https://placehold.co/300x200/feefc7/facc15?text=Shop+Front',
  },
  {
    id: 4,
    name: 'Deccan Provisions',
    rating: 4.8,
    imageUrl: 'https://placehold.co/300x200/fce7f3/f472b6?text=Local+Store',
  },
];

const cartData = [
  {
    id: 1,
    name: 'Badam',
    quantity: '8 kg',
    imageUrl: 'https://placehold.co/40x40/fef3c7/f59e0b?text=B',
  },
  {
    id: 2,
    name: 'Onions',
    quantity: '15 kg',
    imageUrl: 'https://placehold.co/40x40/f3e8ff/c084fc?text=O',
  },
];

// --- SVG ICONS (for easy use without libraries) ---
const StarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-yellow-500"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
);

const ArrowRightIcon = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
);

const LocationIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
);


// --- REUSABLE COMPONENTS ---
const SupplierCard = ({ supplier }) => (
  <div className="supplier-card">
    <img src={supplier.imageUrl} alt={supplier.name} className="supplier-image" />
    <div className="supplier-info">
      <h3 className="supplier-name">{supplier.name}</h3>
      <div className="supplier-meta">
        <div className="supplier-rating">
          <StarIcon />
          <span>{supplier.rating}</span>
        </div>
        <div className="supplier-arrow">
          <ArrowRightIcon className="w-5 h-5" />
        </div>
      </div>
    </div>
  </div>
);

const CartItem = ({ item }) => (
  <div className="cart-item">
    <img src={item.imageUrl} alt={item.name} className="cart-item-image" />
    <div className="cart-item-details">
      <span className="cart-item-name">{item.name}</span>
      <span className="cart-item-quantity">{item.quantity}</span>
    </div>
    <ArrowRightIcon className="w-5 h-5 text-gray-400" />
  </div>
);

// --- MAIN VENDOR DASHBOARD COMPONENT ---
function App() {
  return (
    <>
      <style>{`
        /* --- FONT & BASE --- */
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        body {
          font-family: 'Inter', sans-serif;
          background-color: #f8fafc;
          color: #1e293b;
        }

        /* --- LAYOUT --- */
        .vendor-dashboard {
          display: flex;
          height: 100vh;
        }
        .sidebar-placeholder { /* Your existing sidebar */
          width: 80px;
          flex-shrink: 0;
          background-color: #fff;
          border-right: 1px solid #e2e8f0;
        }
        .main-wrapper {
          flex-grow: 1;
          display: flex;
          flex-direction: column;
          overflow-y: auto;
        }
        .top-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 2.5rem;
          background-color: #fff;
          border-bottom: 1px solid #e2e8f0;
        }
        .top-bar-user { font-weight: 600; }
        .top-bar-location {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #475569;
        }
        .content-area {
          flex-grow: 1;
          display: grid;
          grid-template-columns: minmax(0, 2fr) minmax(0, 1fr);
          grid-template-rows: auto 1fr;
          grid-template-areas:
            "suppliers cart"
            "featured featured";
          gap: 2rem;
          padding: 2rem 2.5rem;
        }
        
        /* --- SUPPLIERS SECTION --- */
        .suppliers-section {
          grid-area: suppliers;
          background-color: #fff;
          border-radius: 16px;
          padding: 1.5rem;
          border: 1px solid #e2e8f0;
        }
        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }
        .section-title {
          font-size: 1.25rem;
          font-weight: 600;
        }
        .supplier-list {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 1.5rem;
        }
        .supplier-card {
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          overflow: hidden;
          transition: transform 0.2s, box-shadow 0.2s;
          cursor: pointer;
        }
        .supplier-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
        }
        .supplier-image {
          width: 100%;
          height: 120px;
          object-fit: cover;
        }
        .supplier-info { padding: 1rem; }
        .supplier-name { font-weight: 600; margin: 0 0 0.75rem 0; }
        .supplier-meta { display: flex; justify-content: space-between; align-items: center; }
        .supplier-rating { display: flex; align-items: center; gap: 0.25rem; color: #475569; }
        .supplier-arrow { color: #64748b; }
        .text-yellow-500 { color: #f59e0b; }

        /* --- CART SECTION --- */
        .cart-section {
          grid-area: cart;
          background-color: #fff;
          border-radius: 16px;
          padding: 1.5rem;
          border: 1px solid #e2e8f0;
        }
        .cart-list { display: flex; flex-direction: column; gap: 1rem; }
        .cart-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          background-color: #fffbeb;
          padding: 1rem;
          border-radius: 12px;
          cursor: pointer;
        }
        .cart-item-image { width: 40px; height: 40px; border-radius: 8px; }
        .cart-item-details { flex-grow: 1; }
        .cart-item-name { display: block; font-weight: 500; }
        .cart-item-quantity { display: block; color: #64748b; font-size: 0.9rem; }
        
        /* --- FEATURED SECTION --- */
        .featured-content {
            grid-area: featured;
            border-radius: 16px;
            overflow: hidden;
        }
        .featured-image {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        /* --- RESPONSIVE --- */
        @media (max-width: 1024px) {
            .content-area {
                grid-template-columns: 1fr;
                grid-template-rows: auto auto auto;
                grid-template-areas:
                  "suppliers"
                  "cart"
                  "featured";
            }
        }
        @media (max-width: 768px) {
            .top-bar, .content-area { padding: 1rem; }
            .supplier-list {
                grid-template-columns: 1fr 1fr;
            }
        }
      `}</style>
      <div className="vendor-dashboard">
        {/* This is a placeholder for your existing sidebar */}
        <div className="sidebar-placeholder"></div>

        <div className="main-wrapper">
          <div className="top-bar">
            <h2 className="top-bar-user">Welcome User</h2>
            <div className="top-bar-location">
              <LocationIcon />
              <span>jntu, hyderabad</span>
            </div>
          </div>

          <main className="content-area">
            <section className="suppliers-section">
              <div className="section-header">
                <h2 className="section-title">Suppliers around you</h2>
              </div>
              <div className="supplier-list">
                {suppliersData.map(supplier => (
                  <SupplierCard key={supplier.id} supplier={supplier} />
                ))}
              </div>
            </section>

            <aside className="cart-section">
              <div className="section-header">
                <h2 className="section-title">Cart</h2>
                <ArrowRightIcon className="w-5 h-5 text-gray-500" />
              </div>
              <div className="cart-list">
                {cartData.map(item => (
                  <CartItem key={item.id} item={item} />
                ))}
              </div>
            </aside>
            
            <section className="featured-content">
                <img src="https://placehold.co/800x400/e2e8f0/475569?text=Featured+Supplier" alt="Featured Supplier" className="featured-image" />
            </section>
          </main>
        </div>
      </div>
    </>
  );
}

export default VendorDashboard;
