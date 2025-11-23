import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/home');
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (menuOpen) {
        setMenuOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [menuOpen]);

  return (
    <header>
      <div className="header-area header-transparent">
        <div className="main-header header-sticky">
          <div className="container-fluid">
            <div className="menu-wrapper d-flex align-items-center justify-content-between">
              <div className="logo">
                <Link to={isAuthenticated ? `/${user?.role}/dashboard` : "/home"}>
                  <img src="/car-logo.png" alt="Logo" width="80" height="40" />
                </Link>
              </div>

              <div className={`main-menu ${isAuthenticated ? 'text-center' : 'f-right'} d-none d-lg-block ${menuOpen ? 'open' : ''}`}>
                <nav>
                  <ul id="navigation">
                    {!isAuthenticated && <li><Link to="/home">Home</Link></li>}
                    {!isAuthenticated && <li><Link to="/contact-us">Contact Us</Link></li>}
                    {!isAuthenticated && <li><Link to="/login">Login</Link></li>}
                    {!isAuthenticated && <li><Link to="/register">Register</Link></li>}
                    {isAuthenticated && user?.role === 'admin' && (
                      <>
                        <li><Link to="/admin/dashboard" style={{color: location.pathname === '/admin/dashboard' ? 'red' : 'white'}}>Dashboard</Link></li>
                        <li><Link to="/admin/users" style={{color: location.pathname === '/admin/users' ? 'red' : 'white'}}>Users</Link></li>
                        <li><Link to="/admin/cars" style={{color: location.pathname === '/admin/cars' ? 'red' : 'white'}}>Cars</Link></li>
                        <li><Link to="/admin/bookings" style={{color: location.pathname === '/admin/bookings' ? 'red' : 'white'}}>Bookings</Link></li>
                        <li><Link to="/admin/reports" style={{color: location.pathname === '/admin/reports' ? 'red' : 'white'}}>Reports</Link></li>
                      </>
                    )}
                    {isAuthenticated && user?.role === 'customer' && (
                      <>
                        <li><Link to="/customer/dashboard" style={{color: location.pathname === '/customer/dashboard' ? 'red' : 'white'}}>Dashboard</Link></li>
                        {location.pathname !== '/customer/dashboard' && (
                          <>
                            <li><Link to="/cars" style={{color: location.pathname === '/cars' ? 'red' : 'white'}}>Browse Cars</Link></li>
                            <li><Link to="/bookings" style={{color: location.pathname === '/bookings' ? 'red' : 'white'}}>My Bookings</Link></li>
                            <li><Link to="/profile" style={{color: location.pathname === '/profile' ? 'red' : 'white'}}>Profile</Link></li>
                          </>
                        )}
                      </>
                    )}
                    {isAuthenticated && user?.role === 'staff' && (
                      <>
                        <li><Link to="/staff/dashboard" style={{color: location.pathname === '/staff/dashboard' ? 'red' : 'white'}}>Dashboard</Link></li>
                        {location.pathname !== '/staff/dashboard' && (
                          <>
                            <li><Link to="/staff/bookings" style={{color: location.pathname === '/staff/bookings' ? 'red' : 'white'}}>Manage Bookings</Link></li>
                            <li><Link to="/staff/cars" style={{color: location.pathname === '/staff/cars' ? 'red' : 'white'}}>Car Management</Link></li>
                            <li><Link to="/staff/inspections" style={{color: location.pathname === '/staff/inspections' ? 'red' : 'white'}}>Return Inspection</Link></li>
                          </>
                        )}
                      </>
                    )}
                  </ul>
                </nav>
              </div>

              {isAuthenticated && (
                <div className="d-flex align-items-center d-none d-lg-block" style={{textAlign: 'right'}}>
                  <span style={{color: 'white', fontSize: '16px !important', fontWeight: 'normal !important', marginRight: '20px'}}>Welcome, {user?.full_name}</span>
                  <button onClick={handleLogout} className="btn btn-danger" style={{fontSize: '14px', padding: '12px 20px', height: '40px'}}>Logout</button>
                </div>
              )}

              {!isAuthenticated && (
                <div className="header-btns d-none d-lg-block f-right">
                  <Link to="/cars" className="btn">
                    BOOK NOW
                  </Link>
                </div>
              )}

              <div className="mobile-menu-icon d-block d-lg-none" onClick={toggleMenu}>
                <span className="hamburger-bar"></span>
                <span className="hamburger-bar"></span>
                <span className="hamburger-bar"></span>
              </div>

              {menuOpen && (
                <div className="mobile-menu d-block d-lg-none">
                  <nav>
                    <ul id="navigation">
                      {!isAuthenticated && <li><Link to="/home" onClick={toggleMenu}>Home</Link></li>}
                      {!isAuthenticated && <li><Link to="/contact-us" onClick={toggleMenu}>Contact Us</Link></li>}
                      {!isAuthenticated && <li><Link to="/login" onClick={toggleMenu}>Login</Link></li>}
                      {!isAuthenticated && <li><Link to="/register" onClick={toggleMenu}>Register</Link></li>}
                      {isAuthenticated && user?.role === 'admin' && (
                        <>
                          <li><Link to="/admin/dashboard" onClick={toggleMenu}>Dashboard</Link></li>
                          <li><Link to="/admin/users" onClick={toggleMenu}>Users</Link></li>
                          <li><Link to="/admin/cars" onClick={toggleMenu}>Cars</Link></li>
                          <li><Link to="/admin/bookings" onClick={toggleMenu}>Bookings</Link></li>
                          <li><Link to="/admin/reports" onClick={toggleMenu}>Reports</Link></li>
                          <li><Link to="/" onClick={() => { logout(); toggleMenu(); }}>Logout</Link></li>
                        </>
                      )}
                      {isAuthenticated && user?.role === 'customer' && (
                        <>
                          <li><Link to="/customer/dashboard" onClick={toggleMenu}>Dashboard</Link></li>
                          {location.pathname !== '/customer/dashboard' && (
                            <>
                              <li><Link to="/cars" onClick={toggleMenu}>Browse Cars</Link></li>
                              <li><Link to="/bookings" onClick={toggleMenu}>My Bookings</Link></li>
                              <li><Link to="/profile" onClick={toggleMenu}>Profile</Link></li>
                            </>
                          )}
                          <li><Link to="/" onClick={() => { handleLogout(); toggleMenu(); }}>Logout</Link></li>
                        </>
                      )}
                      {isAuthenticated && user?.role === 'staff' && (
                        <>
                          <li><Link to="/staff/dashboard" onClick={toggleMenu}>Dashboard</Link></li>
                          {location.pathname !== '/staff/dashboard' && (
                            <>
                              <li><Link to="/staff/bookings" onClick={toggleMenu}>Manage Bookings</Link></li>
                              <li><Link to="/staff/cars" onClick={toggleMenu}>Car Management</Link></li>
                              <li><Link to="/staff/inspections" onClick={toggleMenu}>Return Inspection</Link></li>
                            </>
                          )}
                          <li><Link to="/" onClick={() => { handleLogout(); toggleMenu(); }}>Logout</Link></li>
                        </>
                      )}  
                      {!isAuthenticated && (
                        <li><Link to="/cars" className="btn" onClick={toggleMenu}>
                          BOOK NOW
                        </Link></li>
                      )}
                    </ul>
                  </nav>                   
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;