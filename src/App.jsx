import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import AppLayout from './components/common/AppLayout';
import Login from './components/login/Login';
import Users from './components/users/Users';
import DashboardPage from './components/dashboard/DashboardPage';
import Warehouses from './components/warehouse/Warehouses';
import Commodities from './components/commodity/Commodities';
import Customers from './components/customer/Customers';
import Farmers from './components/farmer/Farmers';
import Transporters from './components/transporter/Transporters';
import Prices from './components/price/Prices';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route path="/" element={<Navigate to="dashboard" />} />
          <Route path="*" element={<Navigate to="dashboard" />} />
          <Route path="login" element={<Login />} />
          <Route path="dashboard" element={<DashboardPage />} />
          
          <Route path="users" element={<Users />} />
          <Route path="warehouse" element={<Warehouses />} />
          <Route path="commodity" element={<Commodities />} />
          <Route path="customers" element={<Customers />} />
          <Route path="farmers" element={<Farmers />} />
          <Route path="transporters" element={<Transporters />} />
          <Route path="price" element={<Prices />} />
          
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
