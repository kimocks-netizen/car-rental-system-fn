# Car Rental System - Frontend

A React-based frontend application for the Car Rental System with modern UI and responsive design.

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation
```bash
# Install dependencies
npm install

# Start development server
npm start
```

The application will open at `http://localhost:3000`

## 📁 Project Structure

```
src/
├── components/          # Reusable components
│   ├── common/         # Shared components (Navbar, Footer, etc.)
│   ├── auth/           # Authentication components
│   └── booking/        # Booking-related components
├── pages/              # Page components
│   ├── public/         # Public pages (Home, Login, Register)
│   ├── customer/       # Customer dashboard pages
│   ├── staff/          # Staff management pages
│   └── admin/          # Admin panel pages
├── services/           # API service functions
├── context/            # React context providers
├── utils/              # Utility functions
└── assets/             # Static assets (CSS, images, etc.)
```

## 🔧 Available Scripts

- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npm eject` - Eject from Create React App

## 🌐 Environment Variables

Create a `.env` file in the root directory:

```env
REACT_APP_CAR_RENTAL_API_URL=http://localhost:8000/api
REACT_APP_SUPABASE_URL=your_supabase_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 🎨 Features

- **Responsive Design**: Mobile-first approach with Bootstrap
- **Role-based Navigation**: Different interfaces for customers, staff, and admin
- **Modern UI**: Clean and intuitive user interface
- **Real-time Updates**: Live booking status and notifications
- **Secure Authentication**: JWT-based authentication system

## 🔗 API Integration

The frontend connects to the Car Rental Backend API running on port 5000. Ensure the backend server is running for full functionality.

## 📱 Pages

### Public Pages
- **Home**: Hero section with car rental information
- **Login**: User authentication
- **Register**: New user registration
- **Contact**: Contact information and support

### Customer Pages
- **Dashboard**: User overview and quick actions
- **Cars**: Browse available vehicles
- **Bookings**: Manage car reservations
- **Profile**: Account settings

### Staff/Admin Pages
- **Management Dashboards**: Booking and car management
- **Reports**: Analytics and financial reports
- **User Management**: Admin user controls

## 🛠️ Built With

- **React 18**: Frontend framework
- **React Router**: Client-side routing
- **Bootstrap 5**: CSS framework
- **Axios**: HTTP client
- **React Hook Form**: Form handling
- **Supabase**: Backend as a Service

## 📄 License

This project is part of the Car Rental System.