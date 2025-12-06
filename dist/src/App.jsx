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

  // promo moved to checkout page; no promo banner on the main menu page

  useEffect(()=>{
    localStorage.setItem('cart', JSON.stringify(cart));
    const count = cart.reduce((s,i)=>s+i.qty,0);
    const badge = document.getElementById('cartBadge');
    if(badge) badge.textContent = `Cart: ${count}`;
    const countBadge = document.getElementById('cartCountBadge');
    if(countBadge) countBadge.textContent = String(count);
    // make header cart container clickable to open popup (handles icon + badge)
    const cartContainer = document.getElementById('cart');
    function onClickCart(){ setShowCart(true); }
    if(cartContainer) cartContainer.addEventListener('click', onClickCart);
    return () => { if(cartContainer) cartContainer.removeEventListener('click', onClickCart); };
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
  // promo/discount handled on checkout page
  const discount = 0;
  const totalAfterDiscount = subtotal;

  return (
    <div>
      <h2>Menu</h2>
      <div className="menu-grid">
        {menu.map(item=> (
          <div className="card" key={item.id} style={{position:'relative'}}>
            {item.img && (
              <div style={{overflow:'hidden', borderRadius:6}}>
                {(() => {
                  const src = String(item.img || '');
                  const isRemote = src.startsWith('http://') || src.startsWith('https://');
                  return (
                    <img
                      src={isRemote ? src : '/' + src}
                      alt={item.name}
                      loading="lazy"
                      style={{width:'100%', height:120, objectFit:'cover', display:'block'}}
                    />
                  );
                })()}
              </div>
            )}
            <h3>{item.name}</h3>
            <div style={{color:'#555'}}>{item.desc}</div>
            <div style={{marginTop:8,fontWeight:600}}>{formatPrice(item.price)}</div>
            {typeof item.rating === 'number' && (
              <div aria-hidden style={{position:'absolute', right:8, bottom:36, background:'#28a745', padding:'4px 6px', borderRadius:6, fontWeight:700, fontSize:11, color:'#ffffff', boxShadow:'0 1px 3px rgba(0,0,0,0.12)'}}>
                {'★' + Number(item.rating).toFixed(1)}
              </div>
            )}
            {typeof item.prepTime === 'number' && (
              <div aria-hidden style={{position:'absolute', right:8, bottom:8, background:'rgba(255,255,255,0.95)', padding:'6px 8px', borderRadius:6, fontWeight:700, fontSize:12, color:'#333', boxShadow:'0 1px 3px rgba(0,0,0,0.12)'}}>
                {item.prepTime} min
              </div>
            )}
            <div style={{marginTop:10}}>
              <button onClick={()=>addToCart(item)}>Add to cart</button>
            </div>
          </div>
        ))}
      </div>

      {/* hide fixed cart box - cart will open in popup when header badge is clicked */}
      <div className="cart" style={{display:'none'}}>
        <h3>Your Cart</h3>
        {cart.length===0 && <div>Cart is empty</div>}
        {cart.map(it=> (
          <div key={it.id} style={{marginBottom:8}}>
            <div style={{fontWeight:600}}>{it.name} <small style={{color:'#666'}}>x{it.qty}</small></div>
            <div style={{color:'#444'}}>{formatPrice(it.price)} each</div>
            <div style={{marginTop:6}}>
              <button onClick={()=>updateQty(it.id,-1)}>-</button>
              <button onClick={()=>updateQty(it.id,1)} style={{marginLeft:6}}>+</button>
            </div>
          </div>
        ))}
        <div style={{marginTop:10,fontWeight:700}}>Subtotal: {formatPrice(subtotal)}</div>
        <div style={{marginTop:8}}>
          <button onClick={()=>{ window.location = '/checkout.html' }}>Checkout</button>
          <button onClick={clearCart} style={{marginLeft:8}}>Clear</button>
        </div>
      </div>

      {/* Cart modal popup */}
      {showCart && (
        <div role="dialog" aria-modal="true" style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.5)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:9999}} onClick={()=>setShowCart(false)}>
          <div onClick={e=>e.stopPropagation()} style={{width:'min(560px,95%)', maxHeight:'90vh', overflowY:'auto', background:'#fff', padding:20, borderRadius:8}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <h2 style={{margin:0}}>Your Cart</h2>
              <button onClick={()=>setShowCart(false)} style={{fontSize:16}}>✕</button>
            </div>
            <hr />
            {cart.length===0 && <div>Cart is empty</div>}
            {cart.map(it=> (
              <div key={it.id} style={{marginBottom:8}}>
                <div style={{fontWeight:600}}>{it.name} <small style={{color:'#666'}}>x{it.qty}</small></div>
                <div style={{color:'#444'}}>{formatPrice(it.price)} each</div>
                <div style={{marginTop:6}}>
                  <button onClick={()=>updateQty(it.id,-1)}>-</button>
                  <button onClick={()=>updateQty(it.id,1)} style={{marginLeft:6}}>+</button>
                </div>
              </div>
            ))}
            <div style={{marginTop:10,fontWeight:700}}>Subtotal: {formatPrice(subtotal)}</div>
            <div style={{marginTop:8}}>
              <button onClick={()=>{ window.location = '/checkout.html' }}>Checkout</button>
              <button onClick={clearCart} style={{marginLeft:8}}>Clear</button>
            </div>
          </div>
        </div>
      )}

      {/* promo banner moved to checkout page */}
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(App));
