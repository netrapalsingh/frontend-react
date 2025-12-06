const { useState, useEffect } = React;

function formatPrice(p){ return `₹${(p/100).toFixed(2)}` }

const SAMPLE_MENU = [
  // auto-detected local images from `images/` folder
  { id: 1, name: 'Margherita Pizza', price: 29900, desc: 'Classic cheese tomato', img: 'images/margherita.svg', prepTime: 12, rating: 4.4 },
  { id: 2, name: 'Paneer Butter Masala', price: 19900, desc: 'Cottage cheese in creamy gravy', img: 'images/paneer.svg', prepTime: 18, rating: 4.6 },
  { id: 3, name: 'Veg Biryani', price: 15900, desc: 'Fragrant spiced rice with veggies', img: 'images/biryani.svg', prepTime: 25, rating: 4.2 },
  { id: 4, name: 'Masala Dosa', price: 12000, desc: 'Crispy dosa with potato masala', img: 'images/dosa.svg', prepTime: 10, rating: 4.7 },
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

  return (
    <div>
      <Header cart={cart} onCartClick={() => setShowCart(true)} />
      
      <section className="menu-section">
        <h2>Our Menu</h2>
        <div className="menu-grid">
          {menu.map(item=> (
            <div className="card" key={item.id}>
              {item.img && (
                <div className="card-image">
                  {(() => {
                    const src = String(item.img || '');
                    const isRemote = src.startsWith('http://') || src.startsWith('https://');
                    return (
                      <img
                        src={isRemote ? src : '/' + src}
                        alt={item.name}
                        loading="lazy"
                      />
                    );
                  })()}
                </div>
              )}
              <div className="card-content">
                <h3>{item.name}</h3>
                <div className="card-desc">{item.desc}</div>
                <div className="card-meta">
                  <span className="card-price">{formatPrice(item.price)}</span>
                  {typeof item.rating === 'number' && (
                    <span className="card-rating">
                      ★ {Number(item.rating).toFixed(1)}
                    </span>
                  )}
                </div>
                {typeof item.prepTime === 'number' && (
                  <div className="card-time">
                    ⏱️ {item.prepTime} min
                  </div>
                )}
                <button onClick={()=>addToCart(item)}>Add to Cart</button>
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
