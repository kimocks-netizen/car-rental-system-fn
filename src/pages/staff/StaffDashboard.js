import React from 'react';
import { useAuth } from '../../context/AuthContext';
import DashboardCard from '../../components/DashboardCard';

const StaffDashboard = () => {
  const { user } = useAuth();

  const dashboardItems = [
    {
      imageSrc: '/photos/car1.jpg',
      alt: 'Manage Bookings',
      title: 'Manage Bookings',
      description: 'Process customer bookings',
      link: '/staff/bookings',
      linkText: 'View Bookings',
      delay: '.2s'
    },
    {
      imageSrc: '/photos/car6.jpg',
      alt: 'Car Management',
      title: 'Car Management',
      description: 'Update car status and details',
      link: '/staff/cars',
      linkText: 'Manage Cars',
      delay: '.4s'
    },
    {
      imageSrc: '/photos/inspections.jpg',
      alt: 'Return Inspection',
      title: 'Return Inspection',
      description: 'Process car returns',
      link: '/staff/inspections',
      linkText: 'Inspections',
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
            

          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffDashboard;