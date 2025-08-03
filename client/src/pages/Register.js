import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { message } from 'antd';
import axios from 'axios';
import Spinner from '../components/Spinner';

const Register = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
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

    if (!formData.name || !formData.email || !formData.password) {
      message.error('Please fill all fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      message.error('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      message.error('Password must be at least 6 characters long');
      return;
    }

    try {
      setLoading(true);
      const apiUrl = process.env.REACT_APP_API_URL
        ? `${process.env.REACT_APP_API_URL}/api/users/v1/register`
        : '/api/users/v1/register';
      await axios.post(apiUrl, {
        name: formData.name,
        email: formData.email,
        password: formData.password
      });

      message.success('Registration successful! Please login.');
      setLoading(false);
      navigate('/login');
    } catch (error) {
      setLoading(false);
      message.error(error.response?.data?.message || 'Registration failed. Please try again.');
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
          <h1 className="auth-title">Create Account</h1>
          <p style={{ color: '#7f8c8d' }}>Join us to start managing your expenses</p>
        </div>

        <form onSubmit={submitHandler}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              name="name"
              className="form-input"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>

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
              placeholder="Create a password (min 6 characters)"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              className="form-input"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-100 mb-20">
            Create Account
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Already have an account?{' '}
            <Link to="/login" className="auth-link">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;