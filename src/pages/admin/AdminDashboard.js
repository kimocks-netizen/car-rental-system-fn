import React from 'react';
import { useAuth } from '../../context/AuthContext';
import AdminDashboardCard from '../../components/AdminDashboardCard';

const AdminDashboard = () => {
  const { user } = useAuth();

  const dashboardItems = [
    {
      imageSrc: '/photos/avatar-many.jpg',
      alt: 'Users',
      title: 'Users',
      description: 'Manage system users',
      link: '/admin/users',
      linkText: 'Manage Users',
      delay: '.2s'
    },
    {
      imageSrc: '/photos/car6.jpg',
      alt: 'Cars',
      title: 'Cars',
      description: 'Manage car inventory',
      link: '/admin/cars',
      linkText: 'Manage Cars',
      delay: '.4s'
    },
    {
      imageSrc: '/photos/car1.jpg',
      alt: 'Bookings',
      title: 'Bookings',
      description: 'View all bookings',
      link: '/admin/bookings',
      linkText: 'View Bookings',
      delay: '.6s'
    },
    {
      imageSrc: '/photos/reports.jpg',
      alt: 'Reports',
      title: 'Reports',
      description: 'Generate reports',
      link: '/admin/reports',
      linkText: 'View Reports',
      delay: '.8s'
    }
  ];

  return (
    <div style={{minHeight: '100vh', paddingTop: '120px', backgroundImage: 'url(/photos/hero2.png)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed'}}>
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="row">
              {dashboardItems.map((item, index) => (
                <AdminDashboardCard
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
              <h5>Admin Features Coming Soon!</h5>
              <p className="mb-0">Full admin functionality will be available in upcoming modules.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;