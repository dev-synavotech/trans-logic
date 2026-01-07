import React from 'react';
import { Navigate } from 'react-router-dom';
import { getToken, isProvider } from '@/lib/auth';

const ProviderOnly: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const token = getToken();
  if (!token) {
    return <Navigate to="/auth" replace />;
  }
  if (!isProvider()) {
    return <Navigate to="/" replace />;
  }
  return children;
};

export default ProviderOnly;
