import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { message } from 'antd';
import axios from 'axios';
import Spinner from '../components/Spinner';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('user')) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      message.error('Please fill all fields');
      return;
    }

    try {
      setLoading(true);
      const apiUrl = process.env.REACT_APP_API_URL 
        ? `${process.env.REACT_APP_API_URL}/api/users/v1/login`
        : '/api/users/v1/login';
      const { data } = await axios.post(apiUrl, formData);
      setLoading(false);
      
      message.success('Login successful!');
      localStorage.setItem('user', JSON.stringify({ ...data.user, password: "" }));
      navigate('/dashboard');
    } catch (error) {
      setLoading(false);
      message.error(error.response?.data?.message || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="auth-page">
      {loading && <Spinner />}
      
      <div className="auth-container">
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{ 
            fontSize: '3rem', 
            marginBottom: '10px' 
          }}>💼</div>
          <h1 className="auth-title">Welcome Back</h1>
          <p style={{ color: '#7f8c8d' }}>Sign in to your expense management account</p>
        </div>

        <form onSubmit={submitHandler}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              name="email"
              className="form-input"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              className="form-input"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-100 mb-20">
            Sign In
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Don't have an account?{' '}
            <Link to="/register" className="auth-link">
              Create one here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;