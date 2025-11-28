import React from 'react';
import PageHeader from '../../reference/PageHeader';
import RegisterForm from '../../components/auth/RegisterForm';
import "../../assets/css/style.css";
import "../../styles/css/admin.css";
import RegisterBackground from '../../assets/img/hero/register.png';

const Register = () => {
  return (
    <div className="black-bg">
      {/* Hero Start */}
      <PageHeader title="Register" sliderAreaClass="slider-area3" backgroundImage={RegisterBackground}/>
      {/* Hero End */}

      {/* Register Form */}
      <main>
        <RegisterForm />
      </main>
    </div>
  );
};

export default Register;