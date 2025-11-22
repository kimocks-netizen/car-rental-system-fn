import React from 'react';
import PageHeader from '../../reference/PageHeader';
import LoginForm from '../../components/auth/LoginForm';
import "../../assets/css/style.css";
import "../../styles/css/admin.css";
import LoginBackground from '../../assets/img/hero/log2.jpg';

const Login = () => {
  return (
    <div className="black-bg">
      {/* Hero Start */}
      <PageHeader title="Login" sliderAreaClass="slider-area3" backgroundImage={LoginBackground}/>
      {/* Hero End */}

      {/* Login Form */}
      <main>
        <LoginForm />
      </main>
    </div>
  );
};

export default Login;
