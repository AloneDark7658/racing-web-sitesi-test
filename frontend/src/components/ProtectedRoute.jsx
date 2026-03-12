import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import api from '../lib/api';

const ProtectedRoute = ({ children }) => {
  const [status, setStatus] = useState('loading'); // loading | ok | fail
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setStatus('fail');
      return;
    }

    // Token'ı backend'e doğrulat
    api.get('/users/profile')
      .then(() => setStatus('ok'))
      .catch(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setStatus('fail');
      });
  }, []);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (status === 'fail') {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
