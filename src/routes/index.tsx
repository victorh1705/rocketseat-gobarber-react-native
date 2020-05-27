import React from 'react';

import AuthRoutes from './auth.routes';
import AppRoutes from './app.routes';

import { useAuth } from '../hooks/AuthContext';

const Routes: React.FC = () => {
  const { user } = useAuth();
  console.log('usuario', user);

  return user ? <AppRoutes /> : <AuthRoutes />;
};

export default Routes;
