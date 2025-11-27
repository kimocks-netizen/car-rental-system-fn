import React from 'react';
import EnhancedBookingsTable from '../../components/EnhancedBookingsTable';

const AdminBookings = () => {



  return (
    <div style={{minHeight: '100vh', paddingTop: '120px', backgroundImage: 'url(/photos/hero2.png)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed'}}>
      <div className="container">
        <div className="row">
          <div className="col-12">
            <h2 className="text-white mb-4">Booking Management</h2>
            <EnhancedBookingsTable 
              apiEndpoint="/api/bookings"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminBookings;