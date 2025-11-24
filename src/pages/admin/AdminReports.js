import React, { useState, useEffect } from 'react';
import DashboardStats from '../../components/DashboardStats';
import DataTable from '../../components/DataTable';
import adminService from '../../services/adminService';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Pie, Bar, Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

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
    { 
      key: 'status', 
      header: 'Status',
      render: (status) => {
        const getStatusColor = (status) => {
          switch(status) {
            case 'pending': return '#ff8c00';
            case 'confirmed': return '#28a745';
            case 'cancelled': return '#dc3545';
            case 'active': return '#007bff';
            case 'completed': return '#6c757d';
            default: return '#ffc107';
          }
        };
        return (
          <span style={{
            backgroundColor: getStatusColor(status),
            color: 'white',
            padding: '4px 8px',
            borderRadius: '12px',
            fontSize: '0.8rem',
            fontWeight: '500',
            textTransform: 'capitalize'
          }}>
            {status}
          </span>
        );
      }
    },
    { 
      key: 'total_amount', 
      header: 'Amount',
      render: (value) => `£${value}`
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
                color: 'white',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div style={{ textAlign: 'left' }}>
                  <h5 style={{ color: 'white', marginBottom: '15px' }}>Monthly Revenue</h5>
                  <h3 style={{ color: 'white', margin: 0 }}>£{reports.monthlyRevenue}</h3>
                  <p style={{ color: '#ccc', margin: 0, fontSize: '0.9rem' }}>Confirmed + Cancellation fees</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <h5 style={{ color: 'white', marginBottom: '15px' }}>Incoming Revenue</h5>
                  <h3 style={{ color: '#28a745', margin: 0 }}>£{reports.incomingRevenue || 0}</h3>
                  <p style={{ color: '#ccc', margin: 0, fontSize: '0.9rem' }}>Pending bookings</p>
                </div>
              </div>
            )}
            
            {/* Charts Section */}
            {reports?.chartData && (
              <div className="row">
                <div className="col-md-4 mb-4">
                  <div style={{
                    backgroundColor: 'black',
                    border: '2px solid red',
                    borderRadius: '15px',
                    padding: '20px',
                    color: 'white',
                    height: '400px'
                  }}>
                    <h5 style={{ color: 'white', marginBottom: '20px', textAlign: 'center' }}>Booking Status Distribution</h5>
                    <div style={{ height: '300px' }}>
                      <Pie 
                        data={{
                          labels: Object.keys(reports.chartData.statusDistribution),
                          datasets: [{
                            data: Object.values(reports.chartData.statusDistribution),
                            backgroundColor: [
                              '#ff8c00', // pending
                              '#28a745', // confirmed
                              '#dc3545', // cancelled
                              '#007bff', // active
                              '#6c757d'  // completed
                            ],
                            borderWidth: 2,
                            borderColor: '#fff'
                          }]
                        }}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: {
                              position: 'bottom',
                              labels: {
                                color: 'white',
                                padding: 8,
                                font: {
                                  size: 11
                                }
                              }
                            }
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="col-md-4 mb-4">
                  <div style={{
                    backgroundColor: 'black',
                    border: '2px solid red',
                    borderRadius: '15px',
                    padding: '20px',
                    color: 'white',
                    height: '400px'
                  }}>
                    <h5 style={{ color: 'white', marginBottom: '20px', textAlign: 'center' }}>Revenue Comparison</h5>
                    <Bar 
                      data={{
                        labels: ['Monthly Revenue', 'Incoming Revenue'],
                        datasets: [{
                          label: 'Revenue (£)',
                          data: [reports.monthlyRevenue, reports.incomingRevenue],
                          backgroundColor: ['#28a745', '#ff8c00'],
                          borderColor: ['#28a745', '#ff8c00'],
                          borderWidth: 2
                        }]
                      }}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            labels: {
                              color: 'white'
                            }
                          }
                        },
                        scales: {
                          y: {
                            ticks: {
                              color: 'white'
                            },
                            grid: {
                              color: 'rgba(255, 255, 255, 0.1)'
                            }
                          },
                          x: {
                            ticks: {
                              color: 'white'
                            },
                            grid: {
                              color: 'rgba(255, 255, 255, 0.1)'
                            }
                          }
                        }
                      }}
                    />
                  </div>
                </div>
                
                <div className="col-md-4 mb-4">
                  <div style={{
                    backgroundColor: 'black',
                    border: '2px solid red',
                    borderRadius: '15px',
                    padding: '20px',
                    color: 'white',
                    height: '400px'
                  }}>
                    <h5 style={{ color: 'white', marginBottom: '20px', textAlign: 'center' }}>Daily Booking Trends</h5>
                    <Line 
                      data={{
                        labels: Object.keys(reports.chartData.dailyTrends),
                        datasets: [{
                          label: 'Cars Booked',
                          data: Object.values(reports.chartData.dailyTrends),
                          borderColor: '#dc3545',
                          backgroundColor: 'rgba(220, 53, 69, 0.1)',
                          borderWidth: 3,
                          fill: true,
                          tension: 0.4,
                          pointBackgroundColor: '#dc3545',
                          pointBorderColor: '#fff',
                          pointBorderWidth: 2,
                          pointRadius: 4
                        }]
                      }}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            labels: {
                              color: 'white'
                            }
                          }
                        },
                        scales: {
                          y: {
                            beginAtZero: true,
                            ticks: {
                              color: 'white',
                              stepSize: 1,
                              precision: 0
                            },
                            grid: {
                              color: 'rgba(255, 255, 255, 0.1)'
                            }
                          },
                          x: {
                            ticks: {
                              color: 'white'
                            },
                            grid: {
                              color: 'rgba(255, 255, 255, 0.1)'
                            }
                          }
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminReports;