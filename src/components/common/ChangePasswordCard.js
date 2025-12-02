import React, { useState } from 'react';
import { SubmitButton } from './ActionButtons';
import { API_BASE_URL } from '../../utils/api';

const ChangePasswordCard = () => {
  const [loading, setLoading] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
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

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    const formErrors = validatePasswordForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setLoading(true);
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
      setLoading(false);
    }
  };

  return (
    <div className="mb-5" style={{
      backgroundColor: 'rgba(0, 0, 0, 0.9)',
      border: '2px solid #dc3545',
      borderRadius: '15px',
      padding: '30px'
    }}>
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

      <form onSubmit={handlePasswordSubmit}>
        <h4 style={{ color: 'white', marginBottom: '25px', borderBottom: '2px solid #dc3545', paddingBottom: '10px' }}>Change Password</h4>
        
        <div className="row">
          <div className="col-md-4 mb-3">
            <label style={{ color: 'white', marginBottom: '8px', fontWeight: '500' }}>Current Password *</label>
            <input
              type="password"
              name="currentPassword"
              className="form-control"
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
              required
              style={{
                backgroundColor: 'rgba(255,255,255,0.1)',
                border: '1px solid #555',
                color: 'white',
                padding: '12px',
                fontSize: '16px'
              }}
            />
            {errors.currentPassword && <span style={{ color: '#dc3545', fontSize: '0.9rem' }}>{errors.currentPassword}</span>}
          </div>
          
          <div className="col-md-4 mb-3">
            <label style={{ color: 'white', marginBottom: '8px', fontWeight: '500' }}>New Password *</label>
            <input
              type="password"
              name="newPassword"
              className="form-control"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              required
              style={{
                backgroundColor: 'rgba(255,255,255,0.1)',
                border: '1px solid #555',
                color: 'white',
                padding: '12px',
                fontSize: '16px'
              }}
            />
            {errors.newPassword && <span style={{ color: '#dc3545', fontSize: '0.9rem' }}>{errors.newPassword}</span>}
          </div>
          
          <div className="col-md-4 mb-3">
            <label style={{ color: 'white', marginBottom: '8px', fontWeight: '500' }}>Confirm New Password *</label>
            <input
              type="password"
              name="confirmPassword"
              className="form-control"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              required
              style={{
                backgroundColor: 'rgba(255,255,255,0.1)',
                border: '1px solid #555',
                color: 'white',
                padding: '12px',
                fontSize: '16px'
              }}
            />
            {errors.confirmPassword && <span style={{ color: '#dc3545', fontSize: '0.9rem' }}>{errors.confirmPassword}</span>}
            {passwordData.newPassword && passwordData.confirmPassword && passwordData.newPassword === passwordData.confirmPassword && (
              <span style={{ color: '#28a745', fontSize: '0.9rem', marginTop: '5px', display: 'block' }}>
                ✓ Passwords match
              </span>
            )}
          </div>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
          <SubmitButton type="submit" loading={loading}>
            {loading ? 'Changing...' : 'Change Password'}
          </SubmitButton>
        </div>
      </form>
    </div>
  );
};

export default ChangePasswordCard;