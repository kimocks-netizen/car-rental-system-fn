import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import '../../assets/css/footer.css';
import { WOW } from 'wowjs';

const Footer = () => {
  const footerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll('.footer-row, .footer-divider, .mt-3, .h4, .social-links a, .list-unstyled li').forEach((el, index) => {
              setTimeout(() => {
                el.classList.add('animate');
              }, index * 200);
            });
          }
        });
      },
      { threshold: 0.1 }
    );

    if (footerRef.current) {
      observer.observe(footerRef.current);
    }

    return () => {
      if (footerRef.current) {
        observer.unobserve(footerRef.current);
      }
    };
  }, []);
  useEffect(() => {
    const wow = new WOW({ live: false });
    wow.init();
  }, []);

  // Scroll to top on link click
  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth' // for a smooth scrolling effect
    });
  };

  return (
    <footer className="footer-area" ref={footerRef}>
      <div className="container">
        <div className="footer-row row">
          <div className="col-md-4 mb-4 mb-md-0 wow fadeInLeft "data-wow-duration="2s" data-wow-delay=".2s">
            <Link to="/" className="footer-logo"  onClick={handleScrollToTop}>
              <img src="/car-logo.png" alt="Car Rental System" width="120" />
            </Link>
            <p className="mt-3">Car Rental System - Your Trusted Car Rental Partner</p>
          </div>
          <div className="col-md-2 col-sm-6 mb-4 mb-md-0">
            <h4>Company</h4>
            <ul className="list-unstyled">
              <li><Link to="/home" onClick={handleScrollToTop}>Home</Link></li>
              <li><Link to="/cars" onClick={handleScrollToTop}>Our Fleet</Link></li>
            </ul>
          </div>
          <div className="col-md-2 col-sm-6 mb-4 mb-md-0">
            <h4>Services</h4>
            <ul className="list-unstyled">
              <li><Link to="/login" onClick={handleScrollToTop}>Login</Link></li>
              <li><Link to="/register" onClick={handleScrollToTop}>Register</Link></li>
              <li><Link to="/bookings" onClick={handleScrollToTop}>My Bookings</Link></li>
            </ul>
          </div>
          <div className="col-md-4">
            <h4>Contact Info</h4>
            <div className="contact-info">
              <p style={{color: 'white'}}><i className="fas fa-envelope"></i> info@car-rental.com</p>
              <p style={{color: 'white'}}><i className="fas fa-map-marker-alt"></i> 123 Main St, Warrick City</p>
            </div>
            <div className="social-links mt-3">
              <a href="#" target="_blank" rel="noopener noreferrer"><i className="fab fa-facebook-f"></i></a>
              <a href="#" target="_blank" rel="noopener noreferrer"><i className="fab fa-twitter"></i></a>
              <a href="#" target="_blank" rel="noopener noreferrer"><i className="fab fa-instagram"></i></a>
            </div>
          </div>
        </div>
        
        <div className="footer-divider wow fadeInUp "data-wow-duration="2s" data-wow-delay=".2s"></div>
        
        <div className="footer-row row mt-4 wow fadeInUp" data-wow-duration="2s" data-wow-delay=".2s">
          <div className="col-12 text-center">
            <p className="mt-3" style={{ display: 'inline-block' }}>
              &copy; {new Date().getFullYear()} Car Rental System. All rights reserved for <a className="streamline-text" href="#" target="_blank" rel="noopener noreferrer">Car Rental System</a>
            </p>

            <span style={{ display: 'inline-block', marginLeft: '10px' }}>|</span>
                <p className="mt-3" style={{ display: 'inline-block', marginLeft: '10px' }}>
                 <a className="streamline-text" href="#" target="_blank" rel="noopener noreferrer">Terms & Conditions</a>
            </p>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
