import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { WOW } from 'wowjs';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    full_name: '',
    phone: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.full_name.trim()) {
      newErrors.full_name = 'Full name is required';
    } else if (formData.full_name.trim().length < 2) {
      newErrors.full_name = 'Full name must be at least 2 characters';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    // Optional phone validation - only validate if provided
    if (formData.phone) {
      const cleanPhone = formData.phone.replace(/\s/g, ''); // Remove spaces
      // Check if starts with + (international format) or 0 (local format)
      if (!/^(\+[1-9]\d{7,14}|0\d{9,14})$/.test(cleanPhone)) {
        newErrors.phone = 'Phone must start with + (international) or 0 (local) and be 8-15 digits';
      }
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    return newErrors;
  };

  useEffect(() => {
    const wow = new WOW({ live: false });
    wow.init();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const { confirmPassword, ...registrationData } = formData;
      const result = await register(registrationData);
      
      if (result.success) {
        navigate('/customer/dashboard');
      }
    } catch (error) {
      setErrors({ general: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="pricing-area section-padding30 fix">
      <div className="container" style={{ marginTop: '-80px' }}>
        <div className="properties__card wow fadeInUp" data-wow-duration="2s" data-wow-delay=".4s">
          <div className="features-caption tnc-txt-color" style={{ marginTop: '0px' }}>
            <h2 className="login-page-title">Create Your Account:</h2>
            {errors.general && <p className="error-message">{errors.general}</p>}
            <form onSubmit={handleSubmit} className="login-form">
              {/* Row 1: Full Name and Email */}
              <div className="row">
                <div className="col-md-6">
                  <div className="login-input">
                    <label>Full Name:</label>
                    <input
                      type="text"
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleChange}
                      required
                    />
                    {errors.full_name && <span className="error-message">{errors.full_name}</span>}
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="login-input">
                    <label>Email:</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                    {errors.email && <span className="error-message">{errors.email}</span>}
                  </div>
                </div>
              </div>
              
              {/* Row 2: Password and Confirm Password */}
              <div className="row">
                <div className="col-md-6">
                  <div className="login-input" style={{ position: 'relative' }}>
                    <label>Password:</label>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      style={{ paddingRight: '40px' }}
                    />
                    <i 
                      className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: 'absolute',
                        right: '12px',
                        top: '38px',
                        cursor: 'pointer',
                        color: '#666'
                      }}
                    ></i>
                    {errors.password && <span className="error-message">{errors.password}</span>}
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="login-input" style={{ position: 'relative' }}>
                    <label>Confirm Password:</label>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      style={{ paddingRight: '40px' }}
                    />
                    <i 
                      className={`fas ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'}`}
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      style={{
                        position: 'absolute',
                        right: '12px',
                        top: '38px',
                        cursor: 'pointer',
                        color: '#666'
                      }}
                    ></i>
                    {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
                    {formData.password && formData.confirmPassword && formData.password === formData.confirmPassword && (
                      <span style={{ color: '#28a745', fontSize: '0.9rem', marginTop: '5px', display: 'block' }}>
                        ✓ Passwords match
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Row 3: Phone Number and Register Button */}
              <div className="row">
                <div className="col-md-6">
                  <div className="login-input">
                    <label>Phone Number (Optional):</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+1234567890 or 01234567890"
                    />
                    {errors.phone && <span className="error-message">{errors.phone}</span>}
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="login-input">
                    <label>&nbsp;</label>
                    <button 
                      type="submit" 
                      disabled={isSubmitting}
                      style={{
                        width: '100%',
                        padding: '12px 20px',
                        backgroundColor: '#b71c1c',
                        border: 'none',
                        borderRadius: '5px',
                        color: 'white',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        cursor: isSubmitting ? 'not-allowed' : 'pointer',
                        transition: 'all 0.3s ease',
                        opacity: isSubmitting ? 0.7 : 1
                      }}
                      onMouseEnter={(e) => {
                        if (!isSubmitting) {
                          e.target.style.backgroundColor = '#28a745';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isSubmitting) {
                          e.target.style.backgroundColor = '#b71c1c';
                        }
                      }}
                    >
                      {isSubmitting ? 'Creating Account...' : 'Create Account'}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RegisterForm;