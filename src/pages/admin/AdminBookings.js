import React, { useState, useEffect } from 'react';
import DataTable from '../../components/DataTable';

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [cars, setCars] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedId, setSelectedId] = useState('');
  const [modalPosition, setModalPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      // Fetch bookings and cars in parallel
      const [bookingsResponse, carsResponse] = await Promise.all([
        fetch('http://localhost:8000/api/bookings', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }),
        fetch('http://localhost:8000/api/cars', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
      ]);
      
      if (!bookingsResponse.ok || !carsResponse.ok) {
        throw new Error('Failed to fetch data');
      }
      
      const bookingsResult = await bookingsResponse.json();
      const carsResult = await carsResponse.json();
      
      // Create cars lookup object
      const carsLookup = {};
      const carsList = carsResult.data.cars || carsResult.data || [];
      carsList.forEach(car => {
        carsLookup[car.id] = `${car.brand} ${car.model}`;
      });
      
      setBookings(bookingsResult.data.bookings || bookingsResult.data || []);
      setCars(carsLookup);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const bookingColumns = [
    { 
      key: 'id', 
      header: 'Booking ID',
      render: (id) => (
        <span 
          style={{
            cursor: 'pointer',
            color: '#007bff',
            textDecoration: 'underline',
            position: 'relative'
          }}
          onClick={(e) => {
            const rect = e.target.getBoundingClientRect();
            setModalPosition({ x: rect.left, y: rect.bottom + 5 });
            setSelectedId(id);
            setShowModal(true);
          }}
          title="Click to view full ID"
        >
          {`${id.slice(0, 4)}***${id.slice(-4)}`}
        </span>
      )
    },
    { 
      key: 'car_id', 
      header: 'Car',
      render: (carId) => cars[carId] || 'Unknown Car'
    },
    { 
      key: 'status', 
      header: 'Status',
      render: (status) => {
        const getStatusColor = (status) => {
          switch(status) {
            case 'pending': return '#ff8c00';
            case 'confirmed': return '#28a745';
            case 'active': return '#007bff';
            case 'completed': return '#6c757d';
            case 'cancelled': return '#dc3545';
            case 'returned': return '#17a2b8';
            default: return '#6c757d';
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
      render: (value) => `$${value}`
    },
    { 
      key: 'pickup_date', 
      header: 'Pickup Date',
      render: (value) => new Date(value).toLocaleDateString()
    },
    { 
      key: 'return_date', 
      header: 'Return Date',
      render: (value) => new Date(value).toLocaleDateString()
    }
  ];

  const bookingActions = [
    {
      label: <i className="fas fa-eye" style={{color: 'white'}}></i>,
      className: 'btn-link',
      onClick: (booking) => {
        console.log('View booking:', booking);
      },
      title: 'View Details'
    },
    {
      label: <i className="fas fa-edit" style={{color: 'white'}}></i>,
      className: 'btn-link',
      onClick: (booking) => {
        console.log('Edit booking:', booking);
      },
      title: 'Edit Booking'
    },
    {
      label: <i className="fas fa-car" style={{color: '#28a745'}}></i>,
      className: 'btn-link',
      onClick: (booking) => {
        console.log('Return car:', booking);
      },
      title: 'Return Car'
    }
  ];

  if (loading) {
    return (
      <div style={{minHeight: '100vh', paddingTop: '120px', backgroundImage: 'url(/photos/hero2.png)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed'}}>
        <div className="container">
          <div className="text-center text-white">
            <h3>Loading bookings...</h3>
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
            <h5>Error loading bookings</h5>
            <p>{error}</p>
            <button className="btn btn-primary" onClick={fetchBookings}>Retry</button>
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
            <h2 className="text-white mb-4">Booking Management</h2>
            <DataTable 
              title={`All Bookings (${bookings.length})`}
              data={bookings}
              columns={bookingColumns}
              actions={bookingActions}
            />
            
            {showModal && (
              <>
                <div 
                  style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: 999
                  }}
                  onClick={() => setShowModal(false)}
                />
                <div
                  style={{
                    position: 'fixed',
                    left: modalPosition.x,
                    top: modalPosition.y,
                    backgroundColor: 'black',
                    border: '2px solid red',
                    borderRadius: '8px',
                    padding: '10px 15px',
                    color: 'white',
                    fontSize: '0.9rem',
                    zIndex: 1000,
                    boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
                    maxWidth: '300px',
                    wordBreak: 'break-all'
                  }}
                >
                  <div style={{ marginBottom: '5px', fontWeight: 'bold' }}>Full Booking ID:</div>
                  <div style={{ fontFamily: 'monospace' }}>{selectedId}</div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminBookings;