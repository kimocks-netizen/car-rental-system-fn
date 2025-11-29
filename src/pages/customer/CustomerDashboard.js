import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import DashboardCard from '../../components/DashboardCard';

const CustomerDashboard = () => {
  const { user, logout } = useAuth();

  const dashboardItems = [
    {
      imageSrc: '/photos/car6.jpg',
      alt: 'Browse Cars',
      title: 'Browse Cars',
      description: 'Find the perfect car for your trip',
      link: '/cars',
      linkText: 'View Cars',
      delay: '.2s'
    },
    {
      imageSrc: '/photos/car1.jpg',
      alt: 'My Bookings',
      title: 'My Bookings',
      description: 'View and manage your reservations',
      link: '/bookings',
      linkText: 'View Bookings',
      delay: '.4s'
    },
    {
      imageSrc: '/photos/avatar.png',
      alt: 'Profile',
      title: 'Profile',
      description: 'Update your personal information',
      link: '/profile',
      linkText: 'Edit Profile',
      delay: '.6s'
    }
  ];

  return (
    <div style={{minHeight: '100vh', paddingTop: '120px', backgroundImage: 'url(/photos/hero2.png)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed'}}>
      <div className="container">
        <div className="row">
          <div className="col-12">

            
            <div className="row">
              {dashboardItems.map((item, index) => (
                <DashboardCard
                  key={index}
                  imageSrc={item.imageSrc}
                  alt={item.alt}
                  title={item.title}
                  description={item.description}
                  link={item.link}
                  linkText={item.linkText}
                  delay={item.delay}
                />
              ))}
            </div>
            
            <div style={{
              backgroundColor: 'rgba(0, 0, 0, 0.9)',
              border: '2px solid #dc3545',
              borderRadius: '15px',
              padding: '25px',
              textAlign: 'center',
              marginTop: '30px'
            }}>
              <div style={{
                backgroundColor: '#dc3545',
                borderRadius: '50%',
                width: '60px',
                height: '60px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 15px'
              }}>
                <i className="fas fa-check-circle" style={{ fontSize: '1.5rem', color: 'white' }}></i>
              </div>
              <h3 style={{ color: 'white', marginBottom: '10px' }}>Everything Ready!</h3>
              <p style={{ color: '#ccc', fontSize: '1rem', marginBottom: 0 }}>
                Explore our fleet, track your reservations, and manage your account with ease.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;