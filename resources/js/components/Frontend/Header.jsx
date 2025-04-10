import React from 'react';
import { Link } from 'react-router-dom';
import './Design/Footer.css';
import HeaderLogo from './HeaderLogo';

const Header = () => {
    // const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem('token');

  const handleLogout = async () => {
    console.log('loging out');
    try {
      await axios.post('/logout', {}, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Accept': 'application/json',
        },
        withCredentials: true,
      });

      localStorage.removeItem('token');
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };
  return (
    <nav className="navbar">
        <div className="container">
            <div className="navbar-brand">
                <Link to="/" className="nav-link">
                    <HeaderLogo 
                        logoUrl="/ar.png" 
                        title="Diaspora's #1 Advertising Resource"
                        siteUrl="/"
                    />
                </Link>
            </div>
            <div className="prod-code-sec">
                <div className="clearfix">
                    <h4 className="mb-0"
                        style={{
                            fontWeight: "bold !important",
                            fontSize: "17pt",
                            color: "#1b2122",
                        }}
                    >
                        Post Your Free Classified Ad
                    </h4>
                    <h4 className="text-center mb-0"
                    style={{
                        fontWeight: "bold !important",
                        fontSize: "14pt",
                        color: "#1b2122",
                    }}
                    >
                        Use Promo Code
                    </h4>
                </div>
            </div>
            <div className="navbar-links">
                {isAuthenticated ? (
                    <>
                    <Link to="/home" className="nav-link">Dashboard</Link>
                    <button onClick={handleLogout} className="nav-link">Logout</button>
                    </>
                ) : (
                    <>
                    <Link to="/login" className="nav-link">Login</Link>
                    <Link to="/register" className="nav-link">Register</Link>
                    </>
                )}
            </div>
        </div>
    </nav>
  );
};

export default Header;