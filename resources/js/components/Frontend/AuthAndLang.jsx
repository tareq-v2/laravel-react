import React from "react";
import { Link } from "react-router-dom";
import CountryLanguageSelector from "./countryLanguageSelector";

const AuthAndLang = (props) => {
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
    <div className="navbar-links">
    <div className="d-flex justify-content-between align-items-center gap-2">
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
     <div>
      <CountryLanguageSelector />
     </div>
  </div>
  );
};

export default AuthAndLang;