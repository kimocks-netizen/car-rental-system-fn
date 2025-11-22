import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const AdminNav = () => {
  const location = useLocation();

  const navItems = [
    { path: '/admin/dashboard', label: 'Dashboard' },
    { path: '/admin/users', label: 'Users' },
    { path: '/admin/cars', label: 'Cars' },
    { path: '/admin/bookings', label: 'Bookings' },
    { path: '/admin/reports', label: 'Reports' }
  ];

  return (
    <div style={{
      backgroundColor: 'black',
      border: '2px solid red',
      borderRadius: '15px',
      padding: '15px',
      marginBottom: '20px'
    }}>
      <div className="d-flex flex-wrap justify-content-center">
        {navItems.map((item, index) => (
          <Link
            key={index}
            to={item.path}
            style={{
              color: location.pathname === item.path ? 'red' : 'white',
              textDecoration: 'none',
              padding: '10px 20px',
              margin: '5px',
              borderRadius: '8px',
              backgroundColor: location.pathname === item.path ? 'rgba(255, 0, 0, 0.1)' : 'transparent',
              border: location.pathname === item.path ? '1px solid red' : '1px solid transparent',
              fontWeight: location.pathname === item.path ? 'bold' : 'normal'
            }}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AdminNav;