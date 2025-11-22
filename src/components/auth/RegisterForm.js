import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

const RegisterForm = () => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const password = watch('password');

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');
    
    try {
      console.log('Register data:', data);
      // API call will be implemented in Module 9
      navigate('/login');
    } catch (err) {
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <div className="card-body">
        <h3 className="card-title text-center mb-4">Register</h3>
        
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-3">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              className={`form-control ${errors.full_name ? 'is-invalid' : ''}`}
              {...register('full_name', { required: 'Full name is required' })}
            />
            {errors.full_name && (
              <div className="invalid-feedback">{errors.full_name.message}</div>
            )}
          </div>

          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className={`form-control ${errors.email ? 'is-invalid' : ''}`}
              {...register('email', { 
                required: 'Email is required',
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: 'Invalid email address'
                }
              })}
            />
            {errors.email && (
              <div className="invalid-feedback">{errors.email.message}</div>
            )}
          </div>

          <div className="mb-3">
            <label className="form-label">Phone</label>
            <input
              type="tel"
              className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
              {...register('phone', { required: 'Phone is required' })}
            />
            {errors.phone && (
              <div className="invalid-feedback">{errors.phone.message}</div>
            )}
          </div>

          <div className="mb-3">
            <label className="form-label">Address</label>
            <textarea
              className={`form-control ${errors.cust_address ? 'is-invalid' : ''}`}
              rows="3"
              {...register('cust_address', { required: 'Address is required' })}
            />
            {errors.cust_address && (
              <div className="invalid-feedback">{errors.cust_address.message}</div>
            )}
          </div>

          <div className="mb-3">
            <label className="form-label">License Number</label>
            <input
              type="text"
              className={`form-control ${errors.license_number ? 'is-invalid' : ''}`}
              {...register('license_number', { required: 'License number is required' })}
            />
            {errors.license_number && (
              <div className="invalid-feedback">{errors.license_number.message}</div>
            )}
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className={`form-control ${errors.password ? 'is-invalid' : ''}`}
              {...register('password', { 
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters'
                }
              })}
            />
            {errors.password && (
              <div className="invalid-feedback">{errors.password.message}</div>
            )}
          </div>

          <div className="mb-3">
            <label className="form-label">Confirm Password</label>
            <input
              type="password"
              className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
              {...register('confirmPassword', { 
                required: 'Please confirm your password',
                validate: value => value === password || 'Passwords do not match'
              })}
            />
            {errors.confirmPassword && (
              <div className="invalid-feedback">{errors.confirmPassword.message}</div>
            )}
          </div>

          <button 
            type="submit" 
            className="btn btn-primary w-100"
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;