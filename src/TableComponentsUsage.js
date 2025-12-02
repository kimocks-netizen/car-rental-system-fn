import React from 'react';
import EnhancedCarGallery from './components/cars/EnhancedCarGallery';
import EnhancedCarsTable from './components/EnhancedCarsTable';
import EnhancedBookingsTable from './components/EnhancedBookingsTable';
import EnhancedUsersTable from './components/EnhancedUsersTable';

// Example usage of the enhanced table components

// 1. Car Gallery for public/customer pages
const CustomerCarGallery = () => {
  return (
    <div className="container-fluid">
      <h2 className="text-white mb-4">Available Cars</h2>
      <EnhancedCarGallery 
        apiEndpoint="/api/cars/available" // Available cars endpoint
      />
    </div>
  );
};

// 2. Admin Cars Management
const AdminCarsPage = () => {
  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-white">Cars Management</h2>
        <button className="btn btn-primary">
          <i className="fas fa-plus me-2"></i>
          Add New Car
        </button>
      </div>
      <EnhancedCarsTable 
        apiEndpoint="/api/admin/cars" // Admin endpoint
      />
    </div>
  );
};

// 3. Staff Cars Management
const StaffCarsPage = () => {
  return (
    <div className="container-fluid">
      <h2 className="text-white mb-4">Cars Management</h2>
      <EnhancedCarsTable 
        apiEndpoint="/api/staff/cars" // Staff endpoint
      />
    </div>
  );
};

// 4. Admin Bookings Management
const AdminBookingsPage = () => {
  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-white">Bookings Management</h2>
        <div>
          <button className="btn btn-outline-light me-2">
            <i className="fas fa-download me-2"></i>
            Export
          </button>
          <button className="btn btn-primary">
            <i className="fas fa-plus me-2"></i>
            New Booking
          </button>
        </div>
      </div>
      <EnhancedBookingsTable 
        apiEndpoint="/api/admin/bookings"
      />
    </div>
  );
};

// 5. Staff Bookings Management
const StaffBookingsPage = () => {
  return (
    <div className="container-fluid">
      <h2 className="text-white mb-4">Bookings Management</h2>
      <EnhancedBookingsTable 
        apiEndpoint="/api/staff/bookings"
      />
    </div>
  );
};

// 6. Admin Users Management
const AdminUsersPage = () => {
  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-white">Users Management</h2>
        <div>
          <button className="btn btn-outline-light me-2">
            <i className="fas fa-user-plus me-2"></i>
            Invite User
          </button>
          <button className="btn btn-primary">
            <i className="fas fa-plus me-2"></i>
            Add User
          </button>
        </div>
      </div>
      <EnhancedUsersTable 
        apiEndpoint="/api/admin/users"
      />
    </div>
  );
};

// 7. Customer Bookings (My Bookings)
const CustomerBookingsPage = () => {
  return (
    <div className="container-fluid">
      <h2 className="text-white mb-4">My Bookings</h2>
      <EnhancedBookingsTable 
        apiEndpoint="/api/customer/bookings"
      />
    </div>
  );
};

// Export all examples
export {
  CustomerCarGallery,
  AdminCarsPage,
  StaffCarsPage,
  AdminBookingsPage,
  StaffBookingsPage,
  AdminUsersPage,
  CustomerBookingsPage
};

// Usage in your existing pages:
/*

// In AdminCars.js
import { AdminCarsPage } from '../TableComponentsUsage';

const AdminCars = () => {
  return <AdminCarsPage />;
};

// In StaffCars.js  
import { StaffCarsPage } from '../TableComponentsUsage';

const StaffCars = () => {
  return <StaffCarsPage />;
};

// In AvailableCars.js
import { CustomerCarGallery } from '../TableComponentsUsage';

const AvailableCars = () => {
  return <CustomerCarGallery />;
};

// In AdminBookings.js
import { AdminBookingsPage } from '../TableComponentsUsage';

const AdminBookings = () => {
  return <AdminBookingsPage />;
};

// In AdminUsers.js
import { AdminUsersPage } from '../TableComponentsUsage';

const AdminUsers = () => {
  return <AdminUsersPage />;
};

*/