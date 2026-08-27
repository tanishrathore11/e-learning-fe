import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { useAuth, AuthProvider } from './hooks/useAuth';
import Navbar from './components/organisms/Navbar/Navbar';
import AppRoutes from './routes/AppRoutes';

const AppContent: React.FC = () => {
  const { user, logout } = useAuth();
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar user={user} onLogout={logout} />
      <main className="flex-1">
        <AppRoutes user={user} />
      </main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
