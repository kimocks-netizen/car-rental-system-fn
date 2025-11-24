import React from 'react';

const DashboardStats = ({ stats }) => {
  if (!stats) return null;

  const statItems = [
    { label: 'Total Users', value: stats.totalUsers, icon: '👥' },
    { label: 'Total Cars', value: stats.totalCars, icon: '🚗' },
    { label: 'Active Bookings', value: stats.activeBookings, icon: '📅' },
    { label: 'Total Revenue', value: `£${stats.totalRevenue}`, icon: '💰' }
  ];

  return (
    <div className="row mb-4">
      {statItems.map((item, index) => (
        <div key={index} className="col-md-3 mb-3">
          <div style={{
            backgroundColor: 'black',
            border: '2px solid red',
            borderRadius: '15px',
            padding: '20px',
            textAlign: 'center',
            color: 'white',
            height: '100%'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '10px' }}>{item.icon}</div>
            <h3 style={{ color: 'white', marginBottom: '10px' }}>{item.value}</h3>
            <p style={{ color: 'white', margin: 0 }}>{item.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardStats;