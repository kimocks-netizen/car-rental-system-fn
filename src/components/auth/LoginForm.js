import React , { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { WOW } from 'wowjs';
import { useEffect } from 'react';

const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();
  
    const handleLogin = async (e) => {
      e.preventDefault();
      setIsLoading(true);
      setErrorMessage('');
      
      try {
        const result = await login(email, password);
        
        if (result.success) {
          const userRole = result.user.role;
          if (userRole === 'admin') {
            navigate('/admin/dashboard');
          } else if (userRole === 'staff') {
            navigate('/staff/dashboard');
          } else {
            navigate('/customer/dashboard');
          }
        }
      } catch (error) {
        setErrorMessage(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    useEffect(() => {
        const wow = new WOW({ live: false });
        wow.init();
    }, []);

  return (
    <section className="pricing-area section-padding30 fix">
      <div className="container" style={{ marginTop: '-80px' }}>
        <div className="properties__card wow fadeInUp" data-wow-duration="2s" data-wow-delay=".4s">
          <div className="features-caption tnc-txt-color" style={{ marginTop: '0px' }}>
            <h2 className="login-page-title">Car Rental Login:</h2>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            <form onSubmit={handleLogin} className="login-form">
                <div className="login-input">
                <label>Email:</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                </div >
                <div className="login-input">
                <label>Password:</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                </div>
                <button type="submit" className="login-button" disabled={isLoading}>
                  {isLoading ? 'Logging in...' : 'Login'}
                </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
export default LoginForm;