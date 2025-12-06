const Header = ({ cart, onCartClick }) => {
    const [selectedCategory, setSelectedCategory] = React.useState('pizza');

    React.useEffect(() => {
      const handleScroll = () => {
        const categories = ['pizza', 'burgers', 'drinks', 'desserts'];
        let found = 'pizza';
        for (const key of categories) {
          const el = document.getElementById(key);
          if (el) {
            const rect = el.getBoundingClientRect();
            if (rect.top <= 120 && rect.bottom > 120) {
              found = key;
              break;
            }
          }
        }
        setSelectedCategory(found);
      };
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }, []);
  return (
    <header style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
      maxWidth: '1400px',
      margin: '0 auto 32px auto',
      background: 'linear-gradient(135deg, #2c3e50 0%, #1a252f 100%)',
      padding: '16px 48px',
      borderRadius: '12px',
      boxShadow: '0 4px 12px rgba(44, 62, 80, 0.25)',
      position: 'sticky',
      top: '16px',
      zIndex: '100'
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '12px' }}>
        <h1 style={{
          color: '#fff',
          margin: 0,
          fontSize: '3.2rem',
          fontWeight: 800,
          letterSpacing: '1px',
          textShadow: '0 4px 12px rgba(0, 0, 0, 0.12)'
        }}>
          🍽️ BRO'$ CAFE
        </h1>
        {/* Food categories as clickable buttons */}
        <nav className="food-category-nav" style={{ marginTop: '6px' }}>
          <ul style={{
            display: 'flex',
            gap: '8px',
            listStyle: 'none',
            padding: 0,
            margin: 0,
            fontSize: '1rem',
            fontWeight: 600,
            color: '#ff6b35',
            letterSpacing: '0.5px'
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
                    padding: '4px 10px',
                    borderRadius: '18px',
                    boxShadow: selectedCategory === cat.key
                      ? '0 2px 8px rgba(255,107,53,0.12)'
                      : '0 1px 4px rgba(255,107,53,0.06)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
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
                  <span style={{ fontSize: '1.2rem' }}>{cat.icon}</span>
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
          transition: 'all 0.3s ease'
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
  );
};

window.Header = Header;
