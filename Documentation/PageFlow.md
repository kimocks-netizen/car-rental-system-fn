# Page Flow & Navigation

## CUSTOMER FLOW
````
Home → Login/Register → Dashboard → Search Cars → 
Car Details → Booking → Payment → My Bookings
````

## STAFF FLOW
````
Login → Staff Dashboard → Bookings Management → 
Process Returns → Car Management
````
## ADMIN FLOW
````
Login → Admin Dashboard → Users Management → 
Cars Management → Financial Reports
````

#  Responsive Layout Structure
## Main Layout Components
````
<App>
  <Navbar />
  <Sidebar /> (conditional - for staff/admin)
  <MainContent>
    <PageContent />
  </MainContent>
  <Footer />
</App>
````
## Role-Based Routing
````
// Protected routes based on user role
<Route path="/admin/*" element={<AdminLayout />} />
<Route path="/staff/*" element={<StaffLayout />} />
<Route path="/customer/*" element={<CustomerLayout />} />
````
