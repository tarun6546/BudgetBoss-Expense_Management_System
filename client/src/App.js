import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ThemeProvider from './contexts/ThemeContext';
import Layout from './components/Layout/Layout';
import LandingPage from './pages/LandingPage';
import HomePage from './pages/HomePage';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Analytics from './pages/Analytics';
import Profile from './pages/Profile';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import AboutUs from './pages/AboutUs';
import 'antd/dist/reset.css';

function App() {
  return (
    <ThemeProvider>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={<ProtectedRoutes><Layout><HomePage /></Layout></ProtectedRoutes>} />
          <Route path="/dashboard" element={<ProtectedRoutes><Layout><Dashboard /></Layout></ProtectedRoutes>} />
          <Route path="/transactions" element={<ProtectedRoutes><Layout><Transactions /></Layout></ProtectedRoutes>} />
          <Route path="/analytics" element={<ProtectedRoutes><Layout><Analytics /></Layout></ProtectedRoutes>} />
          <Route path="/profile" element={<ProtectedRoutes><Layout><Profile /></Layout></ProtectedRoutes>} />
          <Route path="/settings" element={<ProtectedRoutes><Layout><Settings /></Layout></ProtectedRoutes>} />
          <Route path="/reports" element={<ProtectedRoutes><Layout><Reports /></Layout></ProtectedRoutes>} />
        </Routes>
      </div>
    </ThemeProvider>
  );
}

export function ProtectedRoutes(props) {
  if (localStorage.getItem('user')) {
    return props.children;
  } else {
    return <Navigate to="/login" />
  }
}

export default App;
