import React , { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../reference/PageHeader';
import "../../assets/css/style.css";
import "../../styles/css/admin.css";
import { WOW } from 'wowjs';
import { useEffect } from 'react';
import LoginBackground from '../../assets/img/hero/log2.jpg';

const Login = ({ setIsAuthenticated }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
  
    const handleLogin = async (e) => {
      e.preventDefault();
      
      try {
        const response = await axios.post('http://localhost:8000/api/login', { username, password });
        console.log('API Response:', response);
    
        if (response.status === 200) {
          setIsAuthenticated(true);
          navigate('/upload/row1');
        }
      } catch (error) {
        console.error('Error during login:', error);
    
        if (error.response) {
          console.log('Response Data:', error.response.data);
          console.log('Response Status:', error.response.status);
          console.log('Response Headers:', error.response.headers);
    
          if (error.response.status === 401) {
            setErrorMessage('Invalid username or password.');
          } else {
            setErrorMessage('Login failed. Please try again.');
          }
        } else {
          // Handle errors without a response (e.g., network errors)
          console.error('No Response:', error.message);
          setErrorMessage('Network error. Please check your connection.');
        }
      }
    };
    useEffect(() => {
        const wow = new WOW({ live: false });
        wow.init();
    }, []);


  return (
    <div className="black-bg">
  
        {/* Hero Start */}
        <PageHeader title="Login" sliderAreaClass="slider-area3" backgroundImage={LoginBackground}/>
        {/* Hero End */}

        {/* Courses Area Start */}
        <main>
        <section className="pricing-area section-padding30 fix">
          <div className="container">

            <div className="properties__card wow fadeInUp "data-wow-duration="2s" data-wow-delay=".4s">
              <div className="features-caption tnc-txt-color">
                <h2 className="login-page-title">Admin Login Page:</h2>
                {errorMessage && <p  className="error-message">{errorMessage}</p>}
                <form onSubmit={handleLogin} className="login-form">
                    <div className="login-input">
                    <label>Username:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
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
                    <button type="submit" className="login-button">Login</button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Login;
