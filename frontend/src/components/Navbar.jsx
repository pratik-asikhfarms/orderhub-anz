import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

function Navbar() {
  const { cartSummary } = useCart();

  return (
    <nav
      style={{
        padding: '16px 24px',
        borderBottom: '1px solid #ddd',
        display: 'flex',
        justifyContent: 'space-between',
      }}
    >
      <Link to="/" style={{ textDecoration: 'none', color: '#111' }}>
        <strong>OrderHub NZ</strong>
      </Link>

      <div style={{ display: 'flex', gap: '16px' }}>
        <Link to="/">Products</Link>
        <Link to="/cart">Cart ({cartSummary.totalItems})</Link>
      </div>
    </nav>
  );
}

export default Navbar;