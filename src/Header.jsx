const Header = ({ cart, onCartClick }) => {
    const [selectedCategory, setSelectedCategory] = React.useState('pizza');

    React.useEffect(() => {
      const handleScroll = () => {
        const categories = ['pizza', 'burgers', 'drinks', 'desserts'];
        let closestKey = 'pizza';
        let minDistance = Infinity;
        for (const key of categories) {
          const el = document.getElementById(key);
          if (el) {
            const rect = el.getBoundingClientRect();
            const distance = Math.abs(rect.top - 120);
            if (distance < minDistance) {
              minDistance = distance;
              closestKey = key;
            }
          }
        }
        setSelectedCategory(closestKey);
      };
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }, []);
  return (
      <>
        <header style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          maxWidth: '1400px',
          margin: '0 auto 32px auto',
          background: 'linear-gradient(135deg, #2c3e50 0%, #1a252f 100%)',
          padding: '16px 24px',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(44, 62, 80, 0.25)',
          position: 'sticky',
          top: '16px',
          zIndex: '100',
        }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '12px', flex: '1 1 0%', minWidth: 0 }}>
        <h1 style={{
          color: '#fff',
          margin: 0,
          fontSize: '3.2rem',
          fontWeight: 800,
          letterSpacing: '1px',
          textShadow: '0 4px 12px rgba(0, 0, 0, 0.12)',
          wordBreak: 'break-word',
          textAlign: 'left',
          width: '100%',
        }}>
          🍽️ BRO'$ CAFE
        </h1>
        {/* Food categories as clickable buttons */}
        <nav className="food-category-nav" style={{ marginTop: '6px', width: '100%', justifyContent: 'flex-start', display: 'flex' }}>
          <ul style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px',
            listStyle: 'none',
            padding: 0,
            margin: 0,
            fontSize: '1rem',
            fontWeight: 600,
            color: '#ff6b35',
            letterSpacing: '0.5px',
            justifyContent: 'flex-start',
            width: '100%',
          }}>
            {[
              { key: 'pizza', label: 'Pizza', icon: '🍕' },
              { key: 'burgers', label: 'Burgers', icon: '🍔' },
              { key: 'drinks', label: 'Drinks', icon: '🥤' },
              { key: 'desserts', label: 'Desserts', icon: '🍨' }
            ].map(cat => (
              <li key={cat.key}>
                <button
                  style={{
                    background: selectedCategory === cat.key
                      ? 'linear-gradient(90deg, #ffecd2 0%, #ff6b35 100%)'
                      : 'linear-gradient(90deg, #fff7e6 0%, #ffe0cc 100%)',
                    border: selectedCategory === cat.key ? '2px solid #ff6b35' : '1px solid #ff6b35',
                    color: selectedCategory === cat.key ? '#fff' : '#ff6b35',
                    fontWeight: 600,
                    fontSize: '1rem',
                    cursor: 'pointer',
                    padding: '6px 14px',
                    borderRadius: '18px',
                    boxShadow: selectedCategory === cat.key
                      ? '0 2px 8px rgba(255,107,53,0.12)'
                      : '0 1px 4px rgba(255,107,53,0.06)',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'background 0.2s, box-shadow 0.2s, color 0.2s',
                  }}
                  onClick={() => {
                    setSelectedCategory(cat.key);
                    const el = document.getElementById(cat.key);
                    if (el) {
                      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                  }}
                  aria-label={cat.label}
                >
                  <span style={{ fontSize: '1.3rem' }}>{cat.icon}</span>
                  {cat.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div 
        id="cart"
        onClick={onCartClick}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          cursor: 'pointer',
          background: 'rgba(255, 255, 255, 0.1)',
          padding: '8px 16px',
          borderRadius: '8px',
          transition: 'all 0.3s ease',
          marginLeft: '0',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
          e.currentTarget.style.transform = 'translateY(-2px)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
          e.currentTarget.style.transform = 'translateY(0)';
        }}
      >
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <img 
            id="cartIcon" 
            src="/images/cart.svg" 
            alt="Cart" 
            style={{
              height: '20px',
              width: '20px',
              display: 'block',
              filter: 'brightness(0) invert(1)'
            }} 
          />
          <span 
            id="cartCountBadge"
            style={{
              position: 'absolute',
              right: '-8px',
              top: '-8px',
              background: '#ff6b35',
              color: '#fff',
              borderRadius: '999px',
              padding: '2px 6px',
              fontSize: '12px',
              fontWeight: 700,
              lineHeight: 1
            }}
          >
            {cart.reduce((sum, item) => sum + item.qty, 0)}
          </span>
        </div>
        <span id="cartBadge" style={{ display: 'none' }}>Cart: 0</span>
      </div>
      </header>
      <style>{`
        @media (max-width: 900px) {
          header {
            flex-direction: row !important;
            align-items: center !important;
            padding: 12px 8px !important;
          }
          .food-category-nav ul {
            font-size: 0.95rem !important;
            gap: 6px !important;
            justify-content: flex-start !important;
          }
          h1 {
            font-size: 2.1rem !important;
            text-align: left !important;
          }
          #cart {
            margin-left: auto !important;
            margin-top: 0 !important;
            justify-content: flex-end !important;
          }
        }
        @media (max-width: 600px) {
          header {
            flex-direction: row !important;
            align-items: center !important;
            padding: 8px 2px !important;
          }
          .food-category-nav ul {
            font-size: 0.7rem !important;
            gap: 2px !important;
            justify-content: flex-start !important;
          }
          .food-category-nav ul li {
            padding: 2px 8px !important;
          }
          .food-category-nav ul li button, .food-category-nav ul li span {
            font-size: 0.7rem !important;
            padding: 4px 8px !important;
            min-width: 60px !important;
            min-height: 28px !important;
          }
          h1 {
            font-size: 1.3rem !important;
            text-align: left !important;
          }
          #cart {
            margin-left: auto !important;
            margin-top: 0 !important;
            justify-content: flex-end !important;
          }
        }
      `}</style>
    </>
  );
};

window.Header = Header;
