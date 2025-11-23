import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import ConfirmationModal from '../../components/common/ConfirmationModal';

const ReturnInspection = () => {
  const { user } = useAuth();
  const [activeBookings, setActiveBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [inspectionData, setInspectionData] = useState({
    fuel_level: 'full',
    damage_notes: '',
    additional_charges: 0,
    condition: 'good'
  });

  useEffect(() => {
    fetchActiveBookings();
  }, []);

  const fetchActiveBookings = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/bookings?status=active', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const result = await response.json();
        const data = result.data?.bookings || result.bookings || result;
        const bookingsArray = Array.isArray(data) ? data : [];
        setActiveBookings(bookingsArray.filter(booking => booking.status === 'active'));
      } else {
        setError('Failed to fetch active bookings');
        setActiveBookings([]);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setError('Error loading active bookings');
      setActiveBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInspectionStart = (booking) => {
    setSelectedBooking(booking);
    setInspectionData({
      fuel_level: 'full',
      damage_notes: '',
      additional_charges: 0,
      condition: 'good'
    });
    setShowModal(true);
  };

  const handleInspectionSubmit = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/bookings/${selectedBooking.id}/complete`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          status: 'completed',
          inspection_data: inspectionData
        })
      });

      if (response.ok) {
        setActiveBookings(activeBookings.filter(booking => booking.id !== selectedBooking.id));
        setShowModal(false);
        setSelectedBooking(null);
      } else {
        setError('Failed to complete inspection');
      }
    } catch (error) {
      console.error('Error completing inspection:', error);
      setError('Error completing inspection');
    }
  };

  if (loading) {
    return (
      <div style={{minHeight: '100vh', paddingTop: '120px', backgroundImage: 'url(/photos/hero2.png)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed'}}>
        <div className="container">
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
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
            <div className="card" style={{backgroundColor: 'rgba(255, 255, 255, 0.95)', borderRadius: '15px', border: '2px solid #dc3545'}}>
              <div className="card-header" style={{backgroundColor: '#dc3545', color: 'white', borderRadius: '13px 13px 0 0'}}>
                <h4 className="mb-0">Return Inspection</h4>
              </div>
              <div className="card-body">
                {error && (
                  <div className="alert alert-danger" role="alert">
                    {error}
                  </div>
                )}

                {activeBookings.length === 0 ? (
                  <div className="text-center py-4">
                    <h5>No Active Rentals</h5>
                    <p className="text-muted">There are currently no active rentals requiring inspection.</p>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th>Booking ID</th>
                          <th>Customer</th>
                          <th>Car</th>
                          <th>Return Date</th>
                          <th>Days Overdue</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {activeBookings.map((booking) => {
                          const returnDate = new Date(booking.return_date);
                          const today = new Date();
                          const daysOverdue = Math.max(0, Math.ceil((today - returnDate) / (1000 * 60 * 60 * 24)));
                          
                          return (
                            <tr key={booking.id}>
                              <td>
                                <small className="text-muted">#{booking.id.slice(0, 8)}</small>
                              </td>
                              <td>{booking.customer_name || 'N/A'}</td>
                              <td>
                                <strong>{booking.car_make} {booking.car_model}</strong>
                                <br />
                                <small className="text-muted">{booking.car_year}</small>
                              </td>
                              <td>{returnDate.toLocaleDateString()}</td>
                              <td>
                                {daysOverdue > 0 ? (
                                  <span className="badge bg-warning text-dark">{daysOverdue} days</span>
                                ) : (
                                  <span className="badge bg-success">On time</span>
                                )}
                              </td>
                              <td>
                                <button 
                                  className="btn btn-primary btn-sm"
                                  onClick={() => handleInspectionStart(booking)}
                                >
                                  Start Inspection
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Inspection Modal */}
      {showModal && selectedBooking && (
        <div className="modal show d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content" style={{borderRadius: '15px', border: '2px solid #dc3545'}}>
              <div className="modal-header" style={{backgroundColor: '#dc3545', color: 'white', borderRadius: '13px 13px 0 0'}}>
                <h5 className="modal-title">Return Inspection - {selectedBooking.car_make} {selectedBooking.car_model}</h5>
                <button 
                  type="button" 
                  className="btn-close btn-close-white" 
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Fuel Level</label>
                      <select 
                        className="form-select"
                        value={inspectionData.fuel_level}
                        onChange={(e) => setInspectionData({...inspectionData, fuel_level: e.target.value})}
                      >
                        <option value="empty">Empty</option>
                        <option value="quarter">1/4 Tank</option>
                        <option value="half">1/2 Tank</option>
                        <option value="three_quarters">3/4 Tank</option>
                        <option value="full">Full Tank</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Overall Condition</label>
                      <select 
                        className="form-select"
                        value={inspectionData.condition}
                        onChange={(e) => setInspectionData({...inspectionData, condition: e.target.value})}
                      >
                        <option value="excellent">Excellent</option>
                        <option value="good">Good</option>
                        <option value="fair">Fair</option>
                        <option value="poor">Poor</option>
                      </select>
                    </div>
                  </div>
                </div>
                
                <div className="mb-3">
                  <label className="form-label">Damage Notes</label>
                  <textarea 
                    className="form-control"
                    rows="4"
                    placeholder="Document any damage, scratches, or issues found..."
                    value={inspectionData.damage_notes}
                    onChange={(e) => setInspectionData({...inspectionData, damage_notes: e.target.value})}
                  ></textarea>
                </div>
                
                <div className="mb-3">
                  <label className="form-label">Additional Charges ($)</label>
                  <input 
                    type="number"
                    className="form-control"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    value={inspectionData.additional_charges}
                    onChange={(e) => setInspectionData({...inspectionData, additional_charges: parseFloat(e.target.value) || 0})}
                  />
                  <small className="form-text text-muted">
                    Include charges for damage, cleaning, fuel, or late return fees
                  </small>
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  className="btn btn-success"
                  onClick={handleInspectionSubmit}
                >
                  Complete Return
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReturnInspection;