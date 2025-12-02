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

// Import auth context and protected routes
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute, { AdminRoute, StaffRoute, CustomerRoute } from './components/common/ProtectedRoute';

// Import dashboard pages
import CustomerDashboard from './pages/customer/CustomerDashboard';
import MyBookings from './pages/customer/MyBookings';
import Profile from './pages/customer/Profile';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminReports from './pages/admin/AdminReports';
import AdminBookings from './pages/admin/AdminBookings';
import AdminCars from './pages/admin/AdminCars';
import StaffDashboard from './pages/staff/StaffDashboard';
import StaffBookings from './pages/staff/StaffBookings';
import StaffCars from './pages/staff/StaffCars';
import ReturnInspection from './pages/staff/ReturnInspection';
import AdminChangePassword from './pages/admin/ChangePassword';
import StaffChangePassword from './pages/staff/ChangePassword';
import Header from './components/Header';
import AvailableCars from './pages/public/AvailableCars';
import CarPreview from './pages/public/CarPreview';
import BookingPage from './pages/booking/BookingPage';
import BookingConfirmation from './pages/booking/BookingConfirmation';

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
  const { isAuthenticated } = useAuth();

  // Preloader effect
  useEffect(() => {
    const preloader = document.getElementById("preloader-active");
    setTimeout(() => {
      preloader.style.display = "none";
    }, 1000); // Adjust timing if needed
  }, []);

  useEffect(() => {
    const wow = new WOW({ live: false });
    wow.init();
  }, []);

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

      <Header />

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/contact-us" element={<Contact />} />
          <Route path="/cars" element={<AvailableCars />} />
          <Route path="/cars/preview/:id" element={<CarPreview />} />
          <Route path="/booking/:carId" element={
            <CustomerRoute>
              <BookingPage />
            </CustomerRoute>
          } />
          <Route path="/booking-confirmation/:bookingId" element={
            <CustomerRoute>
              <BookingConfirmation />
            </CustomerRoute>
          } />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected Dashboard Routes */}
          <Route path="/customer/dashboard" element={
            <CustomerRoute>
              <CustomerDashboard />
            </CustomerRoute>
          } />
          <Route path="/bookings" element={
            <CustomerRoute>
              <MyBookings />
            </CustomerRoute>
          } />
          <Route path="/profile" element={
            <CustomerRoute>
              <Profile />
            </CustomerRoute>
          } />
          <Route path="/staff/dashboard" element={
            <StaffRoute>
              <StaffDashboard />
            </StaffRoute>
          } />
          <Route path="/staff/bookings" element={
            <StaffRoute>
              <StaffBookings />
            </StaffRoute>
          } />
          <Route path="/staff/cars" element={
            <StaffRoute>
              <StaffCars />
            </StaffRoute>
          } />
          <Route path="/staff/inspections" element={
            <StaffRoute>
              <ReturnInspection />
            </StaffRoute>
          } />
          <Route path="/admin/dashboard" element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          } />
          <Route path="/admin/users" element={
            <AdminRoute>
              <AdminUsers />
            </AdminRoute>
          } />
          <Route path="/admin/reports" element={
            <AdminRoute>
              <AdminReports />
            </AdminRoute>
          } />
          <Route path="/admin/bookings" element={
            <AdminRoute>
              <AdminBookings />
            </AdminRoute>
          } />
          <Route path="/admin/cars" element={
            <AdminRoute>
              <AdminCars />
            </AdminRoute>
          } />
          <Route path="/admin/change-password" element={
            <AdminRoute>
              <AdminChangePassword />
            </AdminRoute>
          } />
          <Route path="/staff/change-password" element={
            <StaffRoute>
              <StaffChangePassword />
            </StaffRoute>
          } />
          
          {/* Unauthorized page */}
          <Route path="/unauthorized" element={
            <div className="container py-5 text-center">
              <h2>Access Denied</h2>
              <p>You don't have permission to access this page.</p>
              <Link to="/" className="btn btn-primary">Go Home</Link>
            </div>
          } />
        </Routes>
        {showContactUs && !isAuthenticated && <ContactUs/>}
      </main>

      {!isAuthenticated && <Footer />}
      <ScrollToTopButton />
    </div>
  );
};

// Wrap the App in the Router and AuthProvider
export default function RouterApp() {
  return (
    <Router>
      <AuthProvider>
        <App />
      </AuthProvider>
    </Router>
  );
}
