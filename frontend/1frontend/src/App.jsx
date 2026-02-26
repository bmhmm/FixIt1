import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './components/auth/register.jsx';
import Login from './components/auth/login.jsx'
import ProviderDashboard from './components/provider/providerDashboard.jsx';
import CustomerDashboard from './components/customer/CustomerDashboard.jsx';
import ProviderList from "d:/FixIt/FixIt1/frontend/1frontend/src/components/provider/ProviderLists.jsx";
import ProviderProfileView from './components/provider/providerProfileView.jsx';
import BookingForm from './components/customer/BookingForm.jsx';
import MyBookings from './components/customer/myBooking.jsx';
import Favorites from './components/customer/favorites.jsx';
import Settings from './components/customer/settings.jsx';



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} /> {/* Add this */}
        <Route path="/" element={<Login />} /> {/* Change to Login as default */}
        <Route path="/api/provider/dashboard" element={<ProviderDashboard />} />
        <Route path="/api/customer/dashboard" element={<CustomerDashboard />} />
        {/* <Route path="/customer/dashboard" element={<CustomerDashboard />} /> */}
        <Route path="/api/customer/providers" element={<ProviderList />} />
        <Route path="/api/customer/provider/:id" element={<ProviderProfileView />} />
        <Route path="/api/customer/book/:id" element={<BookingForm />} />
        <Route path="/api/customer/my-bookings" element={<MyBookings />} />
        <Route path="/api/customer/favorites" element={<Favorites />} />
        <Route path="/api/customer/settings" element={<Settings />} />
      </Routes>
    </Router>
  );
}

export default App;
