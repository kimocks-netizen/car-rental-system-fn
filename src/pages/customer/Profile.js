import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import ConfirmationModal from '../../components/common/ConfirmationModal';
import { CancelButton, SubmitButton } from '../../components/common/ActionButtons';
import Badge from '../../components/common/Badge';
import ChangePasswordCard from '../../components/common/ChangePasswordCard';
import { API_BASE_URL } from '../../utils/api';

const Profile = () => {
  const { user, updateProfile, logout } = useAuth();
  const [loading, setLoading] = useState({ profile: false, password: false });
  const [userBookings, setUserBookings] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  
  // Profile form data
  const [profileData, setProfileData] = useState({
    full_name: '',
    phone: '',
    cust_address: '',
    license_number: ''
  });
  
  // Password form data
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchUserBookings();
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const result = await response.json();
        const userData = result.data || result;
        
        setProfileData({
          full_name: userData.full_name || '',
          phone: userData.phone || '',
          cust_address: userData.cust_address || '',
          license_number: userData.license_number || ''
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const fetchUserBookings = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/bookings/my-bookings`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const result = await response.json();
        setUserBookings(result.data || []);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateProfileForm = () => {
    const newErrors = {};
    
    if (!profileData.full_name.trim()) {
      newErrors.full_name = 'Full name is required';
    }
    
    if (profileData.phone) {
      const cleanPhone = profileData.phone.replace(/\s/g, '');
      if (!/^(\+[1-9]\d{7,14}|0\d{9,14})$/.test(cleanPhone)) {
        newErrors.phone = 'Phone must start with + (international) or 0 (local) and be 8-15 digits';
      }
    }
    
    return newErrors;
  };

  const validatePasswordForm = () => {
    const newErrors = {};
    
    if (!passwordData.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }
    
    if (!passwordData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (passwordData.newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters';
    }
    
    if (!passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    return newErrors;
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    
    const formErrors = validateProfileForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setLoading(prev => ({ ...prev, profile: true }));
    setErrors({});
    setSuccessMessage('');

    try {
      await updateProfile(profileData);
      setSuccessMessage('Profile updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
      await fetchUserProfile();
    } catch (error) {
      setErrors({ general: error.message });
    } finally {
      setLoading(prev => ({ ...prev, profile: false }));
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    const formErrors = validatePasswordForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setLoading(prev => ({ ...prev, password: true }));
    setErrors({});
    setSuccessMessage('');

    try {
      const response = await fetch(`${API_BASE_URL}/auth/change-password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      });

      if (response.ok) {
        setSuccessMessage('Password changed successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        const errorData = await response.json();
        setErrors({ general: errorData.message || 'Failed to change password' });
      }
    } catch (error) {
      setErrors({ general: 'Error changing password' });
    } finally {
      setLoading(prev => ({ ...prev, password: false }));
    }
  };



  const handleDeleteAccount = async () => {
    try {
      setDeleting(true);
      
      const response = await fetch(`${API_BASE_URL}/auth/delete-account`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        logout();
        window.location.href = '/';
      } else {
        const errorData = await response.json();
        setErrors({ general: errorData.message || 'Failed to delete account' });
      }
    } catch (error) {
      setErrors({ general: 'Error deleting account' });
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  return (
    <div style={{minHeight: '100vh', paddingTop: '120px', paddingBottom: '50px', backgroundImage: 'url(/photos/hero2.png)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed'}}>
      <div className="container">
        <div className="row">
          <div className="col-12">
            <h2 className="text-white mb-4 text-center">My Profile</h2>
            
            {successMessage && (
              <div className="alert alert-success mb-4">
                {successMessage}
              </div>
            )}
            
            {errors.general && (
              <div className="alert alert-danger mb-4">
                {errors.general}
              </div>
            )}

            {/* Profile Information Section - Only for customers */}
            {user?.role === 'customer' && (
              <div className="mb-5" style={{
                backgroundColor: 'rgba(0, 0, 0, 0.9)',
                border: '2px solid #dc3545',
                borderRadius: '15px',
                padding: '30px'
              }}>
              <form onSubmit={handleProfileSubmit}>
                <h4 style={{ color: 'white', marginBottom: '25px', borderBottom: '2px solid #dc3545', paddingBottom: '10px' }}>Profile Information</h4>
                
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label style={{ color: 'white', marginBottom: '8px', fontWeight: '500' }}>Full Name *</label>
                    <input
                      type="text"
                      name="full_name"
                      className="form-control"
                      value={profileData.full_name}
                      onChange={handleProfileChange}
                      required
                      style={{
                        backgroundColor: 'rgba(255,255,255,0.1)',
                        border: '1px solid #555',
                        color: 'white',
                        padding: '12px',
                        fontSize: '16px'
                      }}
                    />
                    {errors.full_name && <span style={{ color: '#dc3545', fontSize: '0.9rem' }}>{errors.full_name}</span>}
                  </div>
                  
                  <div className="col-md-6 mb-3">
                    <label style={{ color: 'white', marginBottom: '8px', fontWeight: '500' }}>Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      className="form-control"
                      value={profileData.phone}
                      onChange={handleProfileChange}
                      placeholder="+1234567890 or 01234567890"
                      style={{
                        backgroundColor: 'rgba(255,255,255,0.1)',
                        border: '1px solid #555',
                        color: 'white',
                        padding: '12px',
                        fontSize: '16px'
                      }}
                    />
                    {errors.phone && <span style={{ color: '#dc3545', fontSize: '0.9rem' }}>{errors.phone}</span>}
                  </div>
                  
                  <div className="col-md-6 mb-3">
                    <label style={{ color: 'white', marginBottom: '8px', fontWeight: '500' }}>Address</label>
                    <textarea
                      name="cust_address"
                      className="form-control"
                      rows="3"
                      value={profileData.cust_address}
                      onChange={handleProfileChange}
                      placeholder="Your full address"
                      style={{
                        backgroundColor: 'rgba(255,255,255,0.1)',
                        border: '1px solid #555',
                        color: 'white',
                        padding: '12px',
                        fontSize: '16px',
                        resize: 'vertical'
                      }}
                    />
                  </div>
                  
                  <div className="col-md-6 mb-3">
                    <label style={{ color: 'white', marginBottom: '8px', fontWeight: '500' }}>License Number</label>
                    <input
                      type="text"
                      name="license_number"
                      className="form-control"
                      value={profileData.license_number}
                      onChange={handleProfileChange}
                      placeholder="Your driving license number"
                      style={{
                        backgroundColor: 'rgba(255,255,255,0.1)',
                        border: '1px solid #555',
                        color: 'white',
                        padding: '12px',
                        fontSize: '16px'
                      }}
                    />
                  </div>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
                  <SubmitButton type="submit" loading={loading.profile}>
                    {loading.profile ? 'Updating...' : 'Update Profile'}
                  </SubmitButton>
                </div>
              </form>
              </div>
            )}

            {/* Change Password Section - Available for all user types */}
            <ChangePasswordCard />

            {/* Delete Account Section - Only for customers */}
            {user?.role === 'customer' && (
              <div style={{
                backgroundColor: 'rgba(0, 0, 0, 0.9)',
                border: '2px solid #dc3545',
                borderRadius: '15px',
                padding: '30px'
              }}>
              <h4 style={{ color: 'white', marginBottom: '25px', borderBottom: '2px solid #dc3545', paddingBottom: '10px' }}>Danger Zone</h4>
              
              {(() => {
                const activeBookings = userBookings.filter(booking => 
                  ['pending', 'confirmed', 'active'].includes(booking.status)
                );
                
                if (activeBookings.length > 0) {
                  return (
                    <div>
                      <div className="alert alert-warning mb-4">
                        <strong>🚫 Account Deletion Not Allowed</strong>
                      </div>
                      
                      <p style={{ color: 'white', marginBottom: '20px', fontSize: '16px' }}>
                        You cannot delete your account because you have the following active bookings:
                      </p>
                      
                      <div style={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.1)', 
                        borderRadius: '8px', 
                        padding: '20px', 
                        marginBottom: '20px' 
                      }}>
                        {activeBookings.map((booking, index) => (
                          <div key={booking.id} style={{
                            borderBottom: index < activeBookings.length - 1 ? '1px solid rgba(255,255,255,0.2)' : 'none',
                            paddingBottom: index < activeBookings.length - 1 ? '15px' : '0',
                            marginBottom: index < activeBookings.length - 1 ? '15px' : '0'
                          }}>
                            <div style={{ color: 'white', fontSize: '15px' }}>
                              <strong>Booking # {booking.id}</strong>
                              <Badge variant={booking.status} size="sm" style={{ marginLeft: '10px' }}>
                                {booking.status}
                              </Badge>
                            </div>
                            <div style={{ color: '#ccc', fontSize: '14px', marginTop: '5px' }}>
                              Car: {booking.car?.brand} {booking.car?.model} ({booking.car?.year}) | 
                              From: {new Date(booking.pickup_date).toLocaleDateString()} | 
                              To: {new Date(booking.return_date).toLocaleDateString()}
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="alert alert-danger">
                        <strong>📞 Need Help?</strong> Contact our admin team to proceed with account deletion or to clear your bookings first.
                        <br />
                        <small>Email: admin@carrental.com | Phone: +44 7469 46835</small>
                      </div>
                    </div>
                  );
                }
                
                return (
                  <div>
                    <div className="alert alert-warning mb-4">
                      <strong>⚠️ Warning:</strong> This action cannot be undone. All your data will be permanently deleted.
                    </div>
                    
                    <p style={{ color: 'white', marginBottom: '20px', fontSize: '16px' }}>
                      Deleting your account will permanently remove:
                    </p>
                    
                    <ul style={{ color: '#ccc', marginBottom: '30px', fontSize: '15px' }}>
                      <li>Your profile information</li>
                      <li>Your booking history</li>
                      <li>All associated data</li>
                    </ul>
                    
                    <button
                      onClick={() => setShowDeleteModal(true)}
                      style={{
                        backgroundColor: '#dc3545',
                        border: '2px solid #dc3545',
                        borderRadius: '8px',
                        color: 'white',
                        padding: '12px 24px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        fontSize: '16px'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = '#c82333';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = '#dc3545';
                      }}
                    >
                      🗑️ Delete My Account
                    </button>
                  </div>
                );
              })()}
              </div>
            )}
          </div>
        </div>
      </div>

      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteAccount}
        title="Delete Account"
        message="Are you absolutely sure you want to delete your account? This action cannot be undone and all your data will be permanently lost."
        confirmText="Delete Account"
        cancelText="Cancel"
        loading={deleting}
        type="danger"
      />
    </div>
  );
};

export default Profile;