import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";

// Import necessary stylesheets
import "./assets/css/bootstrap.min.css";
import "./assets/css/slicknav.css";
import "./assets/css/style.css";
import "./styles/css/App.css";
import './assets/css/footer.css';

// Import components
import Home from './pages/public/Home';
import Contact from './reference/contact';
import Login from './pages/public/Login';
import Register from './pages/public/Register';
import Footer from './components/common/Footer';
import ScrollToTopButton from './reference/ScrollToTopButton';

import { WOW } from 'wowjs';

//import './styles/style.scss';

//import { useEffect } from 'react';

function ScrollToTop() {
  
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

const App = ({showContactUs=true}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  useEffect(() => {

    const authStatus = localStorage.getItem("isAuthenticated");
    if (authStatus === "true") {
      setIsAuthenticated(true);
    }
  }, []);
  const handleLogout = () => {
    // Clear authentication state
    localStorage.removeItem("isAuthenticated");
    setIsAuthenticated(false);
  };
  // State for toggling mobile menu
  const [menuOpen, setMenuOpen] = useState(false);

  // Preloader effect
  useEffect(() => {
    const preloader = document.getElementById("preloader-active");
    setTimeout(() => {
      preloader.style.display = "none";
    }, 1000); // Adjust timing if needed
  }, []);

  // Toggle mobile menu
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };
  useEffect(() => {
    const wow = new WOW({ live: false });
    wow.init();
  }, []);
  // Automatically hide the mobile menu when user scrolls
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

  const ContactUs  = () => (
      
    <section className="services-area">
    <div className="container myhover">
      <div className="row justify-content-between">
        <div className="col-xl-4 col-lg-4 col-md-6 col-sm-8">
          <div className="single-services mb-40 wow fadeInUp" data-wow-duration="1s" data-wow-delay=".1s">
            <div className="icon-circle">
             <a href="whatsapp://send?phone=+27671473686&text=Hello, Hello, Stream Line TV I would like to try yout TV for free.">
                <i className="fab fa-whatsapp fa-3x"></i>
             </a>
            </div>
            <div className="features-caption">
              <h3 ><a href="whatsapp://send?phone=+27671473686&text=Hello, Hello, Stream Line TV I would like to try yout TV for free.">WhatsApp</a></h3>
              <p><a href="whatsapp://send?phone=+27671473686&text=Hello, Hello, Stream Line TV I would like to try yout TV for free.">+44 7469 46835</a></p>
            </div>
          </div>
        </div>
        {/* Contact details */}
        <div className="col-xl-3 col-lg-4 col-md-6 col-sm-8">
          <div className="single-services mb-40 wow fadeInUp" data-wow-duration="1s" data-wow-delay=".2s">
            <div className="icon-circle">
              <a href="tel:+27671473686">
              <i className="fas fa-phone-alt fa-2x"></i>
              </a>
            </div>
            <div className="features-caption contact-color">
              <h3><a href="tel:+27671473686">Phone</a></h3>
              <p><a href="tel:+27671473686">+44 7469 46835</a></p>
              <p><a href="tel:+27671473686">+44 7469 46835</a></p>
            </div>
          </div>
        </div>
        <div className="col-xl-3 col-lg-4 col-md-6 col-sm-8">
          <div className="single-services mb-40 wow fadeInUp" data-wow-duration="1s" data-wow-delay=".2s">
            <div className="icon-circle">
              <a href="mailto:enquire@car-rental.com">
              <i className="fas fa-envelope fa-2x"></i>
              </a>
            </div>
            <div className="features-caption contact-color">
            <h3><a href="mailto:enquire@car-rental.com">Email</a></h3>
              <p><a href="mailto:enquire@car-rental.com">enquire@car-rental.com</a></p>
              <p><a href="mailto:info@car-rental.com">info@car-rental.com</a></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  );

  return (
    <div className="black-bg">
      <ScrollToTop />
      {/* Preloader Start */}
      <div id="preloader-active">
        <div className="preloader d-flex align-items-center justify-content-center">
          <div className="preloader-inner position-relative">
            <div className="preloader-circle"></div>
            <div className="preloader-img pere-text">
              <img src="/car-logo.png" alt="Logo" />
            </div>
          </div>
        </div>
      </div>
      {/* Preloader End */}

      <header>
        {/* Header Start */}
        <div className="header-area header-transparent">
          <div className="main-header header-sticky">
            <div className="container-fluid">
              <div className="menu-wrapper d-flex align-items-center justify-content-between">
                {/* Logo */}
                <div className="logo">
                  <Link to="/home">
                    <img src="/car-logo.png" alt="Logo" width="80" height="40" />
                  </Link>
                </div>

                {/* Main-menu for large screens */}
                <div className={`main-menu f-right d-none d-lg-block ${menuOpen ? 'open' : ''}`}>
                  <nav>
                    <ul id="navigation">
                      <li><Link to="/home">Home</Link></li>
                      <li><Link to="/contact-us">Contact Us</Link></li>
                      {!isAuthenticated &&  <li><Link to="/login">Login</Link></li>}
                      {!isAuthenticated &&  <li><Link to="/register">Register</Link></li>}
                      {isAuthenticated && <li><Link to="/" onClick={handleLogout}>Logout</Link></li>}
                    </ul>
                  </nav>
                </div>

                {/* Header-btn */}
                <div className="header-btns d-none d-lg-block f-right">
                  <a href="whatsapp://send?phone=+27671473686&text=Hello, Stream Line TV I would like to try your TV for free." className="btn">
                    BOOK NOW
                  </a>
                </div>

                {/* Mobile Menu - Hamburger icon */}
                <div className="mobile-menu-icon d-block d-lg-none" onClick={toggleMenu}>
                  <span className="hamburger-bar"></span>
                  <span className="hamburger-bar"></span>
                  <span className="hamburger-bar"></span>
                </div>

                {/* Mobile Menu - Display when the menu is open */}
                {menuOpen && (
                  <div className="mobile-menu d-block d-lg-none">
                    <nav>
                      <ul id="navigation">
                        <li><Link to="/home" onClick={toggleMenu}>Home</Link></li>
                        <li><Link to="/contact-us" onClick={toggleMenu}>Contact Us</Link></li>
                        {!isAuthenticated && <li><Link to="/login" onClick={toggleMenu}>Login</Link></li>}
                        {!isAuthenticated && <li><Link to="/register" onClick={toggleMenu}>Register</Link></li>}
                        {isAuthenticated && <li><Link to="/" onClick={handleLogout}>Logout</Link></li>}  
                        <li><a href="whatsapp://send?phone=+27671473686&text=Hello, Stream Line TV I would like to try your TV for free." className=" btn">
                          BOOK
                        </a></li>
                      </ul>
                    </nav>                   
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        {/* Header End */}
      </header>

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/contact-us" element={<Contact />} />
          <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/register" element={<Register />} />
        </Routes>
        {showContactUs && <ContactUs/>}
      </main>

      <Footer />
      <ScrollToTopButton />
    </div>
  );
};

// Wrap the App in the Router for routing
export default function RouterApp() {
  return (
    <Router>
      <App />
    </Router>
  );
}
