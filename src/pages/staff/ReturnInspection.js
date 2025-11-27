import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import DataTable from '../../components/DataTable';
import { API_BASE_URL } from '../../utils/api';

const ReturnInspection = () => {
  const { user } = useAuth();
  const [activeBookings, setActiveBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [inspectionData, setInspectionData] = useState({
    fuel_level: 'full',
    condition: 'good',
    damage_level: 0,
    damage_types: [],
    additional_notes: '',
    calculated_charge: 0
  });

  const damageTypes = [
    'Scratches',
    'Dents', 
    'Interior Damage',
    'Mechanical Issues',
    'Missing Items'
  ];

  useEffect(() => {
    fetchActiveBookings();
  }, []);

  const fetchActiveBookings = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/bookings?status=active`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const result = await response.json();
        const bookings = result.data?.bookings || [];
        
        // Fetch car and customer details for each booking
        const enrichedBookings = await Promise.all(
          bookings.map(async (booking) => {
            try {
              // Fetch car details
              const carResponse = await fetch(`${API_BASE_URL}/cars/${booking.car_id}`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
              });
              const carData = carResponse.ok ? await carResponse.json() : null;
              
              // Fetch customer details
              const customerResponse = await fetch(`${API_BASE_URL}/admin/users/${booking.user_id}`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
              });
              const customerData = customerResponse.ok ? await customerResponse.json() : null;
              
              console.log('Customer response:', customerResponse.status, customerData);
              
              return {
                ...booking,
                car: carData?.data || {},
                customer: customerData?.data || {}
              };
            } catch (err) {
              return booking;
            }
          })
        );
        
        setActiveBookings(enrichedBookings);
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

  const calculateDamageCharge = (damageLevel, depositAmount) => {
    if (damageLevel === 0) return 0;
    return (damageLevel / 10) * depositAmount;
  };

  const handleInspectionStart = (booking) => {
    setSelectedBooking(booking);
    setInspectionData({
      fuel_level: 'full',
      condition: 'good',
      damage_level: 0,
      damage_types: [],
      additional_notes: '',
      calculated_charge: 0
    });
    setShowModal(true);
  };

  const handleDamageTypeChange = (type, checked) => {
    const newTypes = checked 
      ? [...inspectionData.damage_types, type]
      : inspectionData.damage_types.filter(t => t !== type);
    
    setInspectionData({
      ...inspectionData,
      damage_types: newTypes
    });
  };

  const handleDamageLevelChange = (level) => {
    const charge = calculateDamageCharge(level, selectedBooking?.deposit_amount || 0);
    setInspectionData({
      ...inspectionData,
      damage_level: level,
      calculated_charge: charge
    });
  };

  const handleInspectionSubmit = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/bookings/${selectedBooking.id}/complete-return`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          damage_level: inspectionData.damage_level || null,
          return_notes: inspectionData.damage_types.join(','),
          additional_notes: inspectionData.additional_notes,
          fuel_level: inspectionData.fuel_level,
          condition: inspectionData.condition,
          damage_charge: inspectionData.calculated_charge
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

  const columns = [
    { 
      key: 'id', 
      header: 'Booking ID',
      render: (value) => `#${value.slice(0, 8)}`
    },
    { 
      key: 'customer', 
      header: 'Customer',
      render: (value) => value?.full_name || 'N/A'
    },
    { 
      key: 'car', 
      header: 'Vehicle',
      render: (value) => value?.brand && value?.model ? `${value.brand} ${value.model} (${value.year})` : 'N/A'
    },
    { 
      key: 'return_date', 
      header: 'Return Date',
      render: (value) => new Date(value).toLocaleDateString()
    },
    { 
      key: 'return_date', 
      header: 'Status',
      render: (value) => {
        const returnDate = new Date(value);
        const today = new Date();
        const daysOverdue = Math.max(0, Math.ceil((today - returnDate) / (1000 * 60 * 60 * 24)));
        
        return daysOverdue > 0 ? (
          <span style={{
            backgroundColor: '#ff8c00',
            color: 'white',
            padding: '4px 8px',
            borderRadius: '12px',
            fontSize: '0.8rem',
            fontWeight: '500'
          }}>
            {daysOverdue} days overdue
          </span>
        ) : (
          <span style={{
            backgroundColor: '#28a745',
            color: 'white',
            padding: '4px 8px',
            borderRadius: '12px',
            fontSize: '0.8rem',
            fontWeight: '500'
          }}>
            On time
          </span>
        );
      }
    },
    {
      key: 'action',
      header: 'Action',
      render: (value, row) => (
        <button
          onClick={() => handleInspectionStart(row)}
          style={{
            backgroundColor: '#28a745',
            border: 'none',
            color: 'white',
            padding: '8px 16px',
            borderRadius: '8px',
            fontSize: '0.85rem',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#218838';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = '#28a745';
          }}
        >
          <i className="fas fa-clipboard-check"></i>
          Start Inspection
        </button>
      )
    }
  ];



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
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}
        
        <DataTable 
          title="Return Inspections"
          data={activeBookings}
          columns={columns}
        />
      </div>

      {/* Inspection Modal */}
      {showModal && selectedBooking && (
        <div className="modal show d-block" style={{backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 999, position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'auto', overflow: 'auto'}}>
          <div className="modal-dialog modal-lg" style={{marginTop: '120px', marginBottom: '50px', pointerEvents: 'auto'}}>
            <div style={{
              backgroundColor: 'black',
              border: '2px solid red',
              borderRadius: '15px',
              padding: '25px',
              color: 'white',
              boxShadow: '0 4px 15px rgba(255, 0, 0, 0.1)',
              position: 'relative',
              pointerEvents: 'auto',
              maxHeight: 'calc(100vh - 170px)',
              overflow: 'auto'
            }}>
              {/* Header */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '20px',
                paddingBottom: '15px',
                borderBottom: '1px solid rgba(255, 0, 0, 0.3)'
              }}>
                <h5 style={{ color: 'white', margin: 0, fontSize: '1.25rem', fontWeight: '600' }}>
                  Return Inspection - {selectedBooking.car?.brand} {selectedBooking.car?.model}
                </h5>
                <button 
                  onClick={() => setShowModal(false)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'white',
                    fontSize: '1.5rem',
                    cursor: 'pointer'
                  }}
                >
                  ×
                </button>
              </div>

              {/* Form Content */}
              <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.02)', padding: '20px' }}>
                  
                  {/* Basic Info Row */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                    <div>
                      <label style={{ color: 'white', fontSize: '0.9rem', fontWeight: '600', marginBottom: '8px', display: 'block' }}>Fuel Level</label>
                      <select 
                        value={inspectionData.fuel_level}
                        onChange={(e) => setInspectionData({...inspectionData, fuel_level: e.target.value})}
                        style={{
                          width: '100%',
                          padding: '12px',
                          backgroundColor: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(255, 0, 0, 0.3)',
                          borderRadius: '8px',
                          color: 'white',
                          fontSize: '0.95rem'
                        }}
                      >
                        <option value="empty">Empty</option>
                        <option value="quarter">1/4 Tank</option>
                        <option value="half">1/2 Tank</option>
                        <option value="three_quarters">3/4 Tank</option>
                        <option value="full">Full Tank</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ color: 'white', fontSize: '0.9rem', fontWeight: '600', marginBottom: '8px', display: 'block' }}>Overall Condition</label>
                      <select 
                        value={inspectionData.condition}
                        onChange={(e) => setInspectionData({...inspectionData, condition: e.target.value})}
                        style={{
                          width: '100%',
                          padding: '12px',
                          backgroundColor: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(255, 0, 0, 0.3)',
                          borderRadius: '8px',
                          color: 'white',
                          fontSize: '0.95rem'
                        }}
                      >
                        <option value="excellent">Excellent</option>
                        <option value="good">Good</option>
                        <option value="fair">Fair</option>
                        <option value="poor">Poor</option>
                      </select>
                    </div>
                  </div>

                  {/* Damage Level */}
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ color: 'white', fontSize: '0.9rem', fontWeight: '600', marginBottom: '8px', display: 'block' }}>Damage Assessment</label>
                    <select 
                      value={inspectionData.damage_level}
                      onChange={(e) => handleDamageLevelChange(parseInt(e.target.value))}
                      style={{
                        width: '100%',
                        padding: '12px',
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 0, 0, 0.3)',
                        borderRadius: '8px',
                        color: 'white',
                        fontSize: '0.95rem'
                      }}
                    >
                      <option value={0}>No Damage</option>
                      {[...Array(10)].map((_, i) => (
                        <option key={i+1} value={i+1}>
                          Level {i+1} - {(i+1) * 10}% charge
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Damage Types */}
                  {inspectionData.damage_level > 0 && (
                    <div style={{ marginBottom: '20px' }}>
                      <label style={{ color: 'white', fontSize: '0.9rem', fontWeight: '600', marginBottom: '12px', display: 'block' }}>Damage Types</label>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                        {damageTypes.map((type) => (
                          <label key={type} style={{
                            display: 'flex',
                            alignItems: 'center',
                            padding: '10px',
                            backgroundColor: 'rgba(255, 0, 0, 0.05)',
                            border: '1px solid rgba(255, 0, 0, 0.2)',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                          }}>
                            <input 
                              type="checkbox"
                              checked={inspectionData.damage_types.includes(type)}
                              onChange={(e) => handleDamageTypeChange(type, e.target.checked)}
                              style={{ marginRight: '8px', accentColor: '#dc3545' }}
                            />
                            <span style={{ color: 'white', fontSize: '0.9rem' }}>{type}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Additional Notes */}
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ color: 'white', fontSize: '0.9rem', fontWeight: '600', marginBottom: '8px', display: 'block' }}>Additional Notes</label>
                    <textarea 
                      rows="3"
                      placeholder="Document specific damage details, location, severity..."
                      value={inspectionData.additional_notes}
                      onChange={(e) => setInspectionData({...inspectionData, additional_notes: e.target.value})}
                      style={{
                        width: '100%',
                        padding: '12px',
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 0, 0, 0.3)',
                        borderRadius: '8px',
                        color: 'white',
                        fontSize: '0.95rem',
                        resize: 'vertical'
                      }}
                    ></textarea>
                  </div>

                  {/* Damage Charge Display */}
                  {inspectionData.damage_level > 0 && (
                    <div style={{
                      backgroundColor: 'rgba(255, 193, 7, 0.1)',
                      border: '1px solid rgba(255, 193, 7, 0.3)',
                      borderRadius: '8px',
                      padding: '15px',
                      marginBottom: '20px'
                    }}>
                      <div style={{ color: '#ffc107', fontWeight: 'bold', fontSize: '1.1rem' }}>
                        Calculated Damage Charge: £{inspectionData.calculated_charge.toFixed(2)}
                      </div>
                      <div style={{ color: '#ccc', fontSize: '0.9rem', marginTop: '5px' }}>
                        Based on {inspectionData.damage_level * 10}% of security deposit (£{selectedBooking.deposit_amount})
                      </div>
                      <div style={{ color: '#ccc', fontSize: '0.85rem', marginTop: '3px' }}>
                        Remaining deposit: £{(selectedBooking.deposit_amount - inspectionData.calculated_charge).toFixed(2)}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                    <button
                      onClick={() => setShowModal(false)}
                      style={{
                        padding: '12px 24px',
                        backgroundColor: 'transparent',
                        border: '2px solid #6c757d',
                        borderRadius: '8px',
                        color: '#6c757d',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = '#6c757d';
                        e.target.style.color = 'white';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = 'transparent';
                        e.target.style.color = '#6c757d';
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleInspectionSubmit}
                      style={{
                        padding: '12px 24px',
                        backgroundColor: '#28a745',
                        border: '2px solid #28a745',
                        borderRadius: '8px',
                        color: 'white',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = '#218838';
                        e.target.style.borderColor = '#218838';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = '#28a745';
                        e.target.style.borderColor = '#28a745';
                      }}
                    >
                      Complete Return
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReturnInspection;