const { useState, useEffect } = React;

function formatPrice(p){ return `₹${(p/100).toFixed(2)}` }

function CheckoutApp(){
	const [cart, setCart] = useState(() => {
		try { return JSON.parse(localStorage.getItem('cart')||'[]') } catch(e){ return [] }
	});
	const [promoApplied, setPromoApplied] = useState(false);
	const [showPromoBanner, setShowPromoBanner] = useState(false);
	const [couponInput, setCouponInput] = useState('');
	const [couponError, setCouponError] = useState('');

	useEffect(()=>{
		const applied = localStorage.getItem('firstTimePromoApplied') === 'true';
		const dismissed = localStorage.getItem('firstTimePromoDismissed') === 'true';
		const storedCode = localStorage.getItem('couponCode') || '';
		if(storedCode){ setCouponInput(storedCode); }
		if(applied){ setPromoApplied(true); setShowPromoBanner(false); }
		else if(!dismissed){ setShowPromoBanner(true); }
		// no remote coupons fetched — user will enter codes manually
	},[]);

	useEffect(()=>{
		localStorage.setItem('cart', JSON.stringify(cart));
	},[cart]);

	function updateQty(id, delta){
		setCart(prev => prev.map(p=>p.id===id?{...p, qty: Math.max(0, p.qty+delta)}:p).filter(p=>p.qty>0));
	}
	function clearCart(){ setCart([]); }

	function applyCoupon(code){
		if(!code) { setCouponError('Please enter a coupon code'); return; }
		const c = (code||'').trim().toUpperCase();
		// small internal list of accepted coupons (no remote list shown)
		const ACCEPTED = [
			{ code: 'FIRST10', oneTime: true, expiry: '2030-01-01T00:00:00Z' },
			{ code: 'WELCOME10', oneTime: false, expiry: '2030-01-01T00:00:00Z' }
		];
		const found = ACCEPTED.find(x=> x.code === c);
		if(!found){
			setCouponError('Invalid coupon code');
			return;
		}
		// check expiry
		if(found.expiry){
			const exp = new Date(found.expiry);
			if(!isNaN(exp) && exp.getTime() < Date.now()){
				setCouponError('Coupon expired');
				return;
			}
		}
		// check one-time usage (client-side approximation)
		if(found.oneTime){
			const used = localStorage.getItem('couponUsed:' + found.code) === 'true';
			if(used){ setCouponError('This coupon can be used only once'); return; }
			localStorage.setItem('couponUsed:' + found.code, 'true');
		}

		// apply
		setPromoApplied(true);
		localStorage.setItem('firstTimePromoApplied','true');
		localStorage.setItem('couponCode', found.code);
		setCouponError('');
		setCouponInput(found.code);
	}

	const subtotal = cart.reduce((s,i)=>s+i.price*i.qty,0);
	const discount = promoApplied ? Math.round(subtotal * 0.10) : 0;
	const totalAfterDiscount = subtotal - discount;

	return (
		<div className="checkout">
			{showPromoBanner && (
				<div style={{marginBottom:12, background:'#fff3cd', border:'1px solid #ffeeba', padding:12, borderRadius:6, display:'flex', alignItems:'center', justifyContent:'space-between'}}>
					<div style={{color:'#856404', fontWeight:700}}>Welcome! Get <span style={{color:'#155724'}}>10% off</span> on your first order.</div>
					<div style={{display:'flex', gap:8}}>
						<button onClick={()=>{ setPromoApplied(true); setShowPromoBanner(false); localStorage.setItem('firstTimePromoApplied','true'); }}>Claim 10% off</button>
						<button onClick={()=>{ setShowPromoBanner(false); localStorage.setItem('firstTimePromoDismissed','true'); }}>No thanks</button>
					</div>
				</div>
			)}

			{/* Coupon code input for users who already have a code */}
			<div style={{marginBottom:12, background:'#f8f9fa', border:'1px solid #dee2e6', padding:12, borderRadius:6}}>
				<div style={{fontWeight:700, marginBottom:8}}>Have a coupon?</div>
				<div style={{display:'flex', gap:8, alignItems:'center'}}>
					<input value={couponInput} onChange={e=>{ setCouponInput(e.target.value); setCouponError(''); }} placeholder="Enter coupon code" style={{padding:8, flex:1}} />
					<button onClick={()=>{
						const code = (couponInput||'').trim().toUpperCase();
						applyCoupon(code);
					}}>Apply</button>
				</div>
				{couponError && <div style={{color:'#b02a37', marginTop:8}}>{couponError}</div>}
			</div>

			{/* Available coupons list (from coupons.json) */}


			<h2>Your Cart</h2>
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
			{promoApplied && (
				<div style={{marginTop:6,color:'#2d6a4f',fontWeight:700}}>Discount (10%): -{formatPrice(discount)}</div>
			)}
			{promoApplied && (
				<div style={{marginTop:6,fontWeight:800}}>Total: {formatPrice(totalAfterDiscount)}</div>
			)}

			<div style={{marginTop:12}}>
				<button onClick={()=>alert('Checkout flow not wired in this demo')}>Pay now</button>
				<button onClick={clearCart} style={{marginLeft:8}}>Clear</button>
				{promoApplied && (
					<button onClick={() => {
						setPromoApplied(false);
						localStorage.removeItem('firstTimePromoApplied');
						localStorage.removeItem('firstTimePromoDismissed');
						setShowPromoBanner(true);
						// also remove stored coupon code when removing
						localStorage.removeItem('couponCode');
						setCouponInput('');
					}} style={{marginLeft:8}}>Remove coupon</button>
				)}
			</div>
		</div>
	);
}

const root = ReactDOM.createRoot(document.getElementById('checkout-root'));
root.render(React.createElement(CheckoutApp));

