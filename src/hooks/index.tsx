import React from 'react';
import { AuthContextProvider } from './AuthContext';

const AppProvider: React.FC = ({ children }) => {
  return <AuthContextProvider>{children}</AuthContextProvider>;
};

export default AppProvider;
