import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to dashboard
    navigate('/dashboard');
  }, [navigate]);

  return <div>Redirecting to Dashboard...</div>;
};

export default HomePage;
