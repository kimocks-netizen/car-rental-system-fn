import React from 'react';
import ChangePasswordCard from '../../components/common/ChangePasswordCard';

const ChangePassword = () => {
  return (
    <div style={{minHeight: '100vh', paddingTop: '120px', paddingBottom: '50px', backgroundImage: 'url(/photos/hero2.png)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed'}}>
      <div className="container">
        <div className="row">
          <div className="col-12">
            <h2 className="text-white mb-4 text-center">My Profile</h2>
            <ChangePasswordCard />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;