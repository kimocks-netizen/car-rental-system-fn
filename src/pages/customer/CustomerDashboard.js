import React from 'react';
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
            
            <div className="alert alert-info">
              <h5>Coming Soon!</h5>
              <p className="mb-0">Full dashboard functionality will be available in upcoming modules.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;