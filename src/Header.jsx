const Header = ({ cart, onCartClick }) => {
  return (
    <header style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      background: 'linear-gradient(135deg, #2c3e50 0%, #1a252f 100%)',
      padding: '16px 24px',
      borderRadius: '12px',
      boxShadow: '0 4px 12px rgba(44, 62, 80, 0.25)',
      marginBottom: '32px',
      position: 'sticky',
      top: '16px',
      zIndex: '100'
    }}>
      <h1 style={{
        color: '#fff',
        margin: 0,
        fontSize: '28px',
        fontWeight: 700,
        letterSpacing: '0.5px',
        textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
      }}>
        🍽️ BRO'$ CAFE
      </h1>
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
