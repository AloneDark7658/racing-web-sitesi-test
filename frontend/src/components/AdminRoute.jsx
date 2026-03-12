import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import api from '../lib/api';

const AdminRoute = ({ children }) => {
  const [status, setStatus] = useState('loading'); // loading | ok | fail | forbidden
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setStatus('fail');
      return;
    }

    // Backend'den profili çek ve rol kontrolü yap
    api.get('/users/profile')
      .then(({ data }) => {
        if (data.role === 'admin' || data.role === 'superadmin') {
          setStatus('ok');
        } else {
          setStatus('forbidden');
        }
      })
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

  if (status === 'forbidden') {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default AdminRoute;
