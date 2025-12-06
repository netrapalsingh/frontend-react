const { useState, useEffect } = React;

function formatPrice(p){ return `₹${(p/100).toFixed(2)}` }

const SAMPLE_MENU = [
  // auto-detected local images from `images/` folder
  { id: 1, name: 'Margherita Pizza', price: 29900, desc: 'Classic cheese tomato', img: 'images/margherita.jpg', prepTime: 12, rating: 4.4 },
  { id: 2, name: 'Paneer Butter Masala', price: 19900, desc: 'Cottage cheese in creamy gravy', img: 'images/paneer.svg', prepTime: 18, rating: 4.6 },
  { id: 3, name: 'Veg Biryani', price: 15900, desc: 'Fragrant spiced rice with veggies', img: 'images/biryani.svg', prepTime: 25, rating: 4.2 },
  { id: 4, name: 'Masala Dosa', price: 12000, desc: 'Crispy dosa with potato masala', img: 'images/dosa.svg', prepTime: 10, rating: 4.7 },
    { id: 5, name: 'Farmhouse Pizza', price: 34900, desc: 'Loaded with veggies and cheese', img: 'images/farmhouse.jpg', prepTime: 15, rating: 4.5 },
    { id: 6, name: 'Pepperoni Pizza', price: 39900, desc: 'Pepperoni, mozzarella, tomato sauce', img: 'images/pepperoni.jpg', prepTime: 14, rating: 4.7 },
    { id: 7, name: 'Paneer Tikka Pizza', price: 36900, desc: 'Spicy paneer tikka, onions, capsicum', img: 'images/paneer-tikka.jpg', prepTime: 16, rating: 4.6 },
    { id: 8, name: 'Veggie Supreme Pizza', price: 32900, desc: 'Mixed veggies, olives, jalapenos', img: 'images/veggie-supreme.jpg', prepTime: 13, rating: 4.3 },
  // Sample Burgers
  { id: 9, name: 'Classic Veg Burger', price: 14900, desc: 'Veg patty, lettuce, tomato, cheese', img: 'images/veg-burger.jpg', prepTime: 8, rating: 4.2 },
  { id: 10, name: 'Paneer Burger', price: 17900, desc: 'Paneer patty, onions, spicy mayo', img: 'images/paneer-burger.jpg', prepTime: 9, rating: 4.4 },
  { id: 11, name: 'Cheese Burst Burger', price: 16900, desc: 'Cheese-filled patty, veggies', img: 'images/cheese-burger.jpg', prepTime: 7, rating: 4.3 },
  // Sample Drinks
  { id: 12, name: 'Cold Coffee', price: 9900, desc: 'Chilled coffee with ice cream', img: 'images/cold-coffee.jpg', prepTime: 3, rating: 4.5 },
  { id: 13, name: 'Fresh Lime Soda', price: 6900, desc: 'Refreshing lime soda', img: 'images/lime-soda.jpg', prepTime: 2, rating: 4.1 },
  { id: 14, name: 'Masala Chai', price: 5900, desc: 'Spiced Indian tea', img: 'images/masala-chai.jpg', prepTime: 4, rating: 4.6 },
  // Sample Desserts
  { id: 15, name: 'Chocolate Brownie', price: 12900, desc: 'Rich chocolate brownie', img: 'images/brownie.jpg', prepTime: 5, rating: 4.7 },
  { id: 16, name: 'Gulab Jamun', price: 9900, desc: 'Soft sweet balls in syrup', img: 'images/gulab-jamun.jpg', prepTime: 4, rating: 4.8 },
  { id: 17, name: 'Ice Cream Sundae', price: 11900, desc: 'Vanilla ice cream, chocolate sauce', img: 'images/sundae.jpg', prepTime: 3, rating: 4.5 },
];

function App(){
  const [menu,setMenu] = useState(SAMPLE_MENU);
  const [showCart, setShowCart] = useState(false);
  const [cart,setCart] = useState(() => {
    try { return JSON.parse(localStorage.getItem('cart')||'[]') } catch(e){ return [] }
  });

  useEffect(()=>{
    localStorage.setItem('cart', JSON.stringify(cart));
    const count = cart.reduce((s,i)=>s+i.qty,0);
  },[cart]);

  function addToCart(item){
    setCart(prev => {
      const found = prev.find(p=>p.id===item.id);
      if(found) return prev.map(p=>p.id===item.id?{...p,qty:p.qty+1}:p);
      return [...prev, {...item, qty:1}];
    });
  }

  function updateQty(id, delta){
    setCart(prev => prev.map(p=>p.id===id?{...p, qty: Math.max(0, p.qty+delta)}:p).filter(p=>p.qty>0));
  }

  function clearCart(){ setCart([]) }

  const subtotal = cart.reduce((s,i)=>s+i.price*i.qty,0);

  // Category definitions
  const categories = [
    { key: 'pizza', label: 'Pizza', match: item => item.name.toLowerCase().includes('pizza') },
    { key: 'burgers', label: 'Burgers', match: item => item.name.toLowerCase().includes('burger') },
    { key: 'drinks', label: 'Drinks', match: item => ['coffee','chai','soda','drink'].some(word => item.name.toLowerCase().includes(word)) },
    { key: 'desserts', label: 'Desserts', match: item => ['dessert','brownie','jamun','ice cream','sundae'].some(word => item.name.toLowerCase().includes(word)) }
  ];

  // Scroll to section handler
  function scrollToCategory(key) {
    const el = document.getElementById(key);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  return (
    <div>
      <Header cart={cart} onCartClick={() => setShowCart(true)} />

      <section className="menu-section">
        {/* Removed 'Our Menu' heading to utilize more space */}
        {/* Category Sections */}
        <div style={{ width: '100%', maxWidth: '1200px', margin: '0 auto' }}>
          {categories.map(cat => (
            <div key={cat.key} id={cat.key} style={{ marginBottom: 32, scrollMarginTop: 165 }}>
              <h2 style={{ fontSize: '2.4rem', fontWeight: 800, color: '#2c3e50', letterSpacing: '1px', marginBottom: 18, textShadow: '0 2px 8px rgba(255,107,53,0.10)' }}>{cat.label}</h2>
              <div className="menu-grid" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '24px',
                width: '100%'
              }}>
                {menu.filter(cat.match).map(item => (
                  <div className="card" key={item.id} style={{ width: '280px', minWidth: '280px', maxWidth: '280px', margin: '0 auto' }}>
                    {item.img && (
                      <div className="card-image">
                        <img src={'/' + item.img} alt={item.name} loading="lazy" />
                      </div>
                    )}
                    <div className="card-content">
                      <h3>{item.name}</h3>
                      <div className="card-desc">{item.desc}</div>
                      <div className="card-meta" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', marginBottom: '8px', width: '100%' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                          <span className="card-discount-label" style={{
                            display: 'inline-block',
                            background: '#e3f2fd',
                            color: '#1976d2',
                            fontWeight: 700,
                            fontSize: '0.92rem',
                            padding: '2px 10px',
                            borderRadius: '12px',
                            marginBottom: '6px',
                            letterSpacing: '0.5px',
                          }}>FLAT 10% OFF</span>
                          <span className="card-price" style={{ fontWeight: 700, color: '#2c3e50', fontSize: '1rem', textDecoration: 'line-through', display: 'block' }}>{formatPrice(item.price)}</span>
                          <span className="card-discounted-price" style={{ fontWeight: 700, color: '#2c3e50', fontSize: '1.05rem', display: 'block', marginTop: '2px' }}>{formatPrice(Math.round(item.price * 0.9))}</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                          {typeof item.rating === 'number' && (
                            <span className="card-rating" style={{ color: '#ffffff', fontWeight: 600, fontSize: '0.95rem' }}>★ {Number(item.rating).toFixed(1)}</span>
                          )}
                          {typeof item.prepTime === 'number' && (
                            <div className="card-time" style={{ fontSize: '0.95rem', color: '#7f8c8d', marginTop: '2px' }}>⏱️ {item.prepTime} min</div>
                          )}
                        </div>
                      </div>
                      <button onClick={()=>addToCart(item)} style={{
                        background: '#27ae60',
                        border: 'none',
                        color: '#fff',
                        fontWeight: 700,
                        fontSize: '1rem',
                        padding: '7px 18px',
                        borderRadius: '18px',
                        cursor: 'pointer',
                        boxShadow: '0 2px 8px rgba(34,197,94,0.10)',
                        marginTop: '6px',
                        transition: 'background 0.2s, box-shadow 0.2s',
                      }}>Add to Cart</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Cart modal popup */}
      {showCart && (
        <div role="dialog" aria-modal="true" style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.6)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:9999}} onClick={()=>setShowCart(false)}>
          <div onClick={e=>e.stopPropagation()} style={{width:'min(560px,95%)', maxHeight:'90vh', overflowY:'auto', background:'#fff', padding:24, borderRadius:12, boxShadow:'0 20px 60px rgba(0,0,0,0.3)'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
              <h2 style={{margin:0,color:'#2c3e50',fontSize:24,fontWeight:700}}>Order Summary</h2>
              <button onClick={()=>setShowCart(false)} style={{fontSize:24,background:'none',border:'none',cursor:'pointer',color:'#7f8c8d'}}>✕</button>
            </div>
            <hr style={{margin:'16px 0',border:'none',borderTop:'1px solid #ecf0f1'}} />
            {cart.length===0 && <div style={{color:'#7f8c8d',padding:'24px',textAlign:'center'}}>Your cart is empty</div>}
            {cart.map(it=> (
              <div key={it.id} style={{marginBottom:16,paddingBottom:12,borderBottom:'1px solid #ecf0f1'}}>
                <div style={{fontWeight:600,color:'#2c3e50',marginBottom:4}}>{it.name} <small style={{color:'#95a5a6',fontWeight:400}}>× {it.qty}</small></div>
                <div style={{color:'#7f8c8d',fontSize:14,marginBottom:8}}>{formatPrice(it.price)} each</div>
                <div style={{marginTop:8,display:'flex',gap:6}}>
                  <button onClick={()=>updateQty(it.id,-1)} style={{padding:'6px 12px',background:'#ecf0f1',border:'none',borderRadius:6,cursor:'pointer',fontWeight:600,color:'#ff6b35'}}>−</button>
                  <button onClick={()=>updateQty(it.id,1)} style={{padding:'6px 12px',background:'#ecf0f1',border:'none',borderRadius:6,cursor:'pointer',fontWeight:600,color:'#ff6b35'}}>+</button>
                </div>
              </div>
            ))}
            <div style={{marginTop:20,paddingTop:16,borderTop:'2px solid #ff6b35'}}>
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:20,fontSize:18,fontWeight:700,color:'#2c3e50'}}>
                <span>Total:</span>
                <span style={{color:'#ff6b35'}}>{formatPrice(subtotal)}</span>
              </div>
              <button onClick={()=>{ window.location = '/checkout.html' }} style={{width:'100%',padding:12,background:'linear-gradient(135deg, #ff6b35 0%, #ee5a24 100%)',color:'#fff',border:'none',borderRadius:8,fontWeight:600,cursor:'pointer',marginBottom:8,transition:'all 0.3s',fontSize:16}}>Proceed to Checkout</button>
              <button onClick={clearCart} style={{width:'100%',padding:12,background:'#ecf0f1',border:'none',borderRadius:8,fontWeight:600,cursor:'pointer',color:'#2c3e50',transition:'all 0.3s',fontSize:16}}>Clear Cart</button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(App));
