import React, { useState, useEffect } from 'react';
import DashboardStats from '../../components/DashboardStats';
import DataTable from '../../components/DataTable';
import adminService from '../../services/adminService';

const AdminReports = () => {
  const [reports, setReports] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await adminService.getReports();
      setReports(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const bookingColumns = [
    { key: 'id', header: 'Booking ID' },
    { key: 'status', header: 'Status' },
    { 
      key: 'total_amount', 
      header: 'Amount',
      render: (value) => `$${value}`
    },
    { 
      key: 'created_at', 
      header: 'Date',
      render: (value) => new Date(value).toLocaleDateString()
    }
  ];

  if (loading) {
    return (
      <div style={{minHeight: '100vh', paddingTop: '120px', backgroundImage: 'url(/photos/hero2.png)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed'}}>
        <div className="container">
          <div className="text-center text-white">
            <h3>Loading reports...</h3>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{minHeight: '100vh', paddingTop: '120px', backgroundImage: 'url(/photos/hero2.png)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed'}}>
        <div className="container">
          <div className="alert alert-danger">
            <h5>Error loading reports</h5>
            <p>{error}</p>
            <button className="btn btn-primary" onClick={fetchReports}>Retry</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{minHeight: '100vh', paddingTop: '120px', backgroundImage: 'url(/photos/hero2.png)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed'}}>
      <div className="container">
        <div className="row">
          <div className="col-12">
            <h2 className="text-white mb-4">Reports & Analytics</h2>
            
            {reports?.stats && <DashboardStats stats={reports.stats} />}
            
            {reports?.recentBookings && (
              <DataTable 
                title="Recent Bookings"
                data={reports.recentBookings}
                columns={bookingColumns}
              />
            )}
            
            {reports?.monthlyRevenue !== undefined && (
              <div style={{
                backgroundColor: 'black',
                border: '2px solid red',
                borderRadius: '15px',
                padding: '20px',
                marginBottom: '20px',
                color: 'white'
              }}>
                <h5 style={{ color: 'white', marginBottom: '15px' }}>Monthly Revenue</h5>
                <h3 style={{ color: 'white' }}>${reports.monthlyRevenue}</h3>
                <p style={{ color: 'white', margin: 0 }}>Total revenue for this month</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminReports;