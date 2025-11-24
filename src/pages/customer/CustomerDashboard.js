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
            {/* Welcome Header */}
            {/* <div style={{
              backgroundColor: 'rgba(0, 0, 0, 0.9)',
              border: '2px solid #dc3545',
              borderRadius: '15px',
              padding: '20px',
              marginBottom: '30px',
              textAlign: 'center'
            }}>
              <h2 style={{ color: 'white', margin: 0 }}>Welcome, {user?.full_name}</h2>
              <p style={{ color: '#ccc', margin: 0, fontSize: '1.1rem' }}>Ready for your next adventure?</p>
            </div> */}
            
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
              padding: '30px',
              textAlign: 'center',
              marginTop: '30px'
            }}>
              <div style={{
                backgroundColor: '#dc3545',
                borderRadius: '50%',
                width: '80px',
                height: '80px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px'
              }}>
                <i className="fas fa-rocket" style={{ fontSize: '2rem', color: 'white' }}></i>
              </div>
              <h3 style={{ color: 'white', marginBottom: '15px' }}>Coming Soon!</h3>
              <p style={{ color: '#ccc', fontSize: '1.1rem', marginBottom: 0 }}>
                Full dashboard functionality will be available in upcoming modules.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;