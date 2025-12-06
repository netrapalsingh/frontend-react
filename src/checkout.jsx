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
				<div className="promo-banner">
					<div className="promo-banner-text">
						Welcome! Get <span className="discount">10% off</span> on your first order.
					</div>
					<div style={{display:'flex', gap:8}}>
						<button className="btn-primary" onClick={()=>{ setPromoApplied(true); setShowPromoBanner(false); localStorage.setItem('firstTimePromoApplied','true'); }}>Claim 10% off</button>
						<button className="btn-secondary" onClick={()=>{ setShowPromoBanner(false); localStorage.setItem('firstTimePromoDismissed','true'); }}>Not now</button>
					</div>
				</div>
			)}

			{/* Coupon code input section */}
			<div className="coupon-section">
				<label>Have a coupon code?</label>
				<div className="coupon-input-group">
					<input 
						value={couponInput} 
						onChange={e=>{ setCouponInput(e.target.value); setCouponError(''); }} 
						placeholder="Enter coupon code (e.g., FIRST10)" 
					/>
					<button className="btn-primary" onClick={()=>{
						const code = (couponInput||'').trim().toUpperCase();
						applyCoupon(code);
					}}>Apply</button>
				</div>
				{couponError && <div className="coupon-error">✕ {couponError}</div>}
				{promoApplied && couponInput && <div className="coupon-success">✓ Coupon applied successfully!</div>}
			</div>

			<h2>Order Summary</h2>
			{cart.length===0 && <div className="empty-cart">Your cart is empty</div>}
			{cart.length > 0 && (
				<>
					{cart.map(it=> (
						<div key={it.id} className="cart-item">
							<div className="cart-item-name">{it.name}</div>
							<div className="cart-item-price">{formatPrice(it.price)} each</div>
							<div className="cart-item-qty">Quantity: {it.qty}</div>
							<div className="qty-controls">
								<button onClick={()=>updateQty(it.id,-1)}>Remove</button>
								<button onClick={()=>updateQty(it.id,1)}>Add More</button>
							</div>
						</div>
					))}

					<div className="summary-section">
						<div className="summary-row subtotal">
							<span>Subtotal:</span>
							<span>{formatPrice(subtotal)}</span>
						</div>
						{promoApplied && (
							<div className="summary-row discount">
								<span>Discount (10%):</span>
								<span>−{formatPrice(discount)}</span>
							</div>
						)}
						<div className="summary-row total">
							<span>Total:</span>
							<span>{formatPrice(promoApplied ? totalAfterDiscount : subtotal)}</span>
						</div>
					</div>

					<div className="action-buttons">
						<button className="btn-primary" onClick={()=>alert('Checkout flow not wired in this demo')}>Pay Now</button>
						{promoApplied && (
							<button className="btn-secondary" onClick={() => {
								setPromoApplied(false);
								localStorage.removeItem('firstTimePromoApplied');
								localStorage.removeItem('firstTimePromoDismissed');
								setShowPromoBanner(true);
								localStorage.removeItem('couponCode');
								setCouponInput('');
							}}>Remove Coupon</button>
						)}
						<button className="btn-danger" onClick={clearCart}>Clear Cart</button>
					</div>
				</>
			)}
		</div>
	);
}

const root = ReactDOM.createRoot(document.getElementById('checkout-root'));
root.render(React.createElement(CheckoutApp));

