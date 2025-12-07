const { useState, useEffect } = React;

function formatPrice(p){ return `₹${(p/100).toFixed(2)}` }

function App() {
  const [menu, setMenu] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [cart, setCart] = useState(() => {
    try { return JSON.parse(localStorage.getItem('cart')||'[]') } catch(e){ return [] }
  });

  useEffect(()=>{
    localStorage.setItem('cart', JSON.stringify(cart));
  },[cart]);

  useEffect(() => {
    fetch('categories.json')
      .then(res => res.json())
      .then(data => setCategories(data));
    fetch('menu.json')
      .then(res => res.json())
      .then(data => setMenu(data));
  }, []);

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
                {(() => {
                  const items = menu.filter(item => item.category === cat.key);
                  // Sort: in-stock first, out-of-stock last
                  items.sort((a, b) => {
                    const aOut = a.stock === 0;
                    const bOut = b.stock === 0;
                    if (aOut === bOut) return 0;
                    return aOut ? 1 : -1;
                  });
                  return items.map(item => {
                    const outOfStock = item.stock === 0;
                    return (
                    <div
                      className="card menu-card"
                      key={item.id}
                      style={{
                        width: '280px', minWidth: '280px', maxWidth: '280px', margin: '0 auto',
                        opacity: outOfStock ? 0.5 : 1,
                        pointerEvents: outOfStock ? 'none' : 'auto',
                        filter: outOfStock ? 'grayscale(0.7)' : 'none',
                        background: outOfStock ? '#f3f3f3' : '#fff',
                      }}
                    >
                      {item.img && (
                        <div className="card-image">
                          <img src={'/' + item.img} alt={item.name} loading="lazy" />
                        </div>
                      )}
                      <div className="card-content">
                        <h3 style={{fontSize:'0.9rem',margin:'0 0 4px 0'}}>{item.name}</h3>
                        <div className="card-desc" style={{fontSize:'0.8rem',marginBottom:'4px'}}>{item.desc}</div>
                        <div className="card-meta" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px', marginBottom: '6px', width: '100%' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                            <span className="card-discount-label" style={{
                              display: 'inline-block',
                              background: '#e3f2fd',
                              color: '#1976d2',
                              fontWeight: 700,
                              fontSize: '0.75rem',
                              padding: '1px 6px',
                              borderRadius: '10px',
                              marginBottom: '4px',
                              letterSpacing: '0.5px',
                            }}>FLAT 10% OFF</span>
                            <span className="card-price" style={{ fontWeight: 700, color: '#2c3e50', fontSize: '0.8rem', textDecoration: 'line-through', display: 'block' }}>{formatPrice(item.price)}</span>
                            <span className="card-discounted-price" style={{ fontWeight: 700, color: '#2c3e50', fontSize: '0.85rem', display: 'block', marginTop: '2px' }}>{formatPrice(Math.round(item.price * 0.9))}</span>
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                            {typeof item.rating === 'number' && (
                              <span className="card-rating" style={{ color: '#ffffff', fontWeight: 600, fontSize: '0.8rem' }}>★ {Number(item.rating).toFixed(1)}</span>
                            )}
                            {typeof item.prepTime === 'number' && (
                              <div className="card-time" style={{ fontSize: '0.8rem', color: '#7f8c8d', marginTop: '2px' }}>⏱️ {item.prepTime} min</div>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => addToCart(item)}
                          disabled={outOfStock}
                          style={{
                            background: outOfStock ? '#ccc' : '#27ae60',
                            border: 'none',
                            color: outOfStock ? '#888' : '#fff',
                            fontWeight: 700,
                            fontSize: '0.85rem',
                            padding: '5px 12px',
                            borderRadius: '14px',
                            cursor: outOfStock ? 'not-allowed' : 'pointer',
                            boxShadow: '0 1px 4px rgba(34,197,94,0.10)',
                            marginTop: '4px',
                            transition: 'background 0.2s, box-shadow 0.2s',
                          }}
                        >{outOfStock ? 'Out of Stock' : 'Add to Cart'}</button>
                      </div>
                    </div>
                    );
                  });
                })()}
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
              <div style={{display:'flex',gap:10,flexDirection:'row',marginBottom:8}}>
                <button onClick={()=>{ window.location = '/checkout.html' }} style={{flex:1,minWidth:140,padding:12,background:'linear-gradient(135deg, #27ae60 0%, #43e97b 100%)',color:'#fff',border:'none',borderRadius:8,fontWeight:600,cursor:'pointer',transition:'all 0.3s',fontSize:16}}>Pay Now</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
      <style>{`
        @media (max-width: 600px) {
          .menu-grid {
            grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)) !important;
            gap: 12px !important;
          }
          .menu-card {
            width: 160px !important;
            min-width: 160px !important;
            max-width: 160px !important;
          }
          .menu-card .card-image {
            height: 80px !important;
          }
          .menu-card .card-content {
            padding: 8px !important;
          }
          .menu-card h3 {
            font-size: 0.95rem !important;
          }
          .menu-card .card-desc {
            font-size: 0.8rem !important;
          }
          .menu-card .card-meta {
            gap: 4px !important;
            margin-bottom: 4px !important;
          }
          .menu-card .card-discount-label {
            font-size: 0.7rem !important;
            padding: 1px 4px !important;
          }
          .menu-card .card-price, .menu-card .card-discounted-price {
            font-size: 0.8rem !important;
          }
          .menu-card .card-rating, .menu-card .card-time {
            font-size: 0.7rem !important;
          }
          .menu-card button {
            font-size: 0.85rem !important;
            padding: 5px 8px !important;
            border-radius: 12px !important;
          }
        }
      `}</style>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(App));
