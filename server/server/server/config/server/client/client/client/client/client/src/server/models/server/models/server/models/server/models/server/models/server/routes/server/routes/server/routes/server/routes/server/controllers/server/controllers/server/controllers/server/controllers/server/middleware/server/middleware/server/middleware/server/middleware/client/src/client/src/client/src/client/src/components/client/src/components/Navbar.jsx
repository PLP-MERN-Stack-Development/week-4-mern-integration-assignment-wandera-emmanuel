import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={{ background: '#f8f9fa', padding: '1rem' }}>
      <div className="container">
        <Link to="/">MERN Blog</Link>
        <ul style={{ display: 'flex', listStyle: 'none', gap: '1rem' }}>
          {user ? (
            <>
              <li>Welcome, {user.username}</li>
              <li>
                <Link to="/posts/new">Create Post</Link>
              </li>
              <li>
                <button onClick={handleLogout}>Logout</button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/login">Login</Link>
              </li>
              <li>
                <Link to="/register">Register</Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;